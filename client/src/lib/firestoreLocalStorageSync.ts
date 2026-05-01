import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { auth as firebaseAuth, db as firestoreDb } from "@/lib/firebase";

const DEVICE_KEY = "allah_yafik_firestore_sync_device_id";
const USERS_COLLECTION = "users";
const SYNC_SUBCOLLECTION = "local_storage_sync_items";
const MAX_VALUE_BYTES = 900_000;
const FLUSH_DELAY_MS = 300;

const INTERNAL_KEYS = new Set([DEVICE_KEY]);

let syncInitialized = false;
let isApplyingRemoteChanges = false;
let isFlushing = false;
let deviceId = "";
let currentUserId: string | null = null;
let flushTimer: number | null = null;
let sessionCounter = 0;
let unsubscribeRemoteChanges: (() => void) | null = null;
let unsubscribeAuthChanges: (() => void) | null = null;

const pendingUpserts = new Map<string, string>();
const pendingDeletes = new Set<string>();

declare global {
  interface Window {
    __allahYafikStorageSyncCleanup?: () => void;
  }
}

function isSyncableKey(key: string): boolean {
  return !INTERNAL_KEYS.has(key);
}

function encodeKeyForDocId(key: string): string {
  // Firestore doc ids cannot contain "/"; base64url keeps ids stable and compact.
  return btoa(encodeURIComponent(key))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function getSyncCollectionRef(userId: string) {
  return collection(
    firestoreDb!,
    USERS_COLLECTION,
    userId,
    SYNC_SUBCOLLECTION
  );
}

function getLocalStorageKeys(storage: Storage): string[] {
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && isSyncableKey(key)) {
      keys.push(key);
    }
  }
  return keys;
}

function getOrCreateDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_KEY);
  if (existing) return existing;

  const created = `device_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(DEVICE_KEY, created);
  return created;
}

function queueUpsert(key: string, value: string) {
  if (!isSyncableKey(key)) return;
  pendingDeletes.delete(key);
  pendingUpserts.set(key, value);
  scheduleFlush();
}

function queueDelete(key: string) {
  if (!isSyncableKey(key)) return;
  pendingUpserts.delete(key);
  pendingDeletes.add(key);
  scheduleFlush();
}

function scheduleFlush() {
  if (!firestoreDb || !currentUserId || flushTimer !== null) return;

  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flushPendingChanges();
  }, FLUSH_DELAY_MS);
}

async function flushPendingChanges() {
  if (!firestoreDb || !currentUserId || isFlushing) return;
  if (pendingUpserts.size === 0 && pendingDeletes.size === 0) return;

  isFlushing = true;
  const targetUserId = currentUserId;

  try {
    const operations: Array<
      | { type: "set"; key: string; value: string }
      | { type: "delete"; key: string }
    > = [];

    pendingDeletes.forEach(key => {
      operations.push({ type: "delete", key });
    });
    pendingDeletes.clear();

    pendingUpserts.forEach((value, key) => {
      operations.push({ type: "set", key, value });
    });
    pendingUpserts.clear();

    const collectionRef = getSyncCollectionRef(targetUserId);

    let cursor = 0;
    while (cursor < operations.length) {
      if (currentUserId !== targetUserId) {
        return;
      }

      const batch = writeBatch(firestoreDb);
      let batchCount = 0;

      while (cursor < operations.length && batchCount < 400) {
        const op = operations[cursor];
        cursor += 1;

        const ref = doc(collectionRef, encodeKeyForDocId(op.key));

        if (op.type === "delete") {
          batch.delete(ref);
          batchCount += 1;
          continue;
        }

        const valueSize = new Blob([op.value]).size;
        if (valueSize > MAX_VALUE_BYTES) {
          console.warn(
            `Skipping Firestore sync for localStorage key "${op.key}" because value exceeds ${MAX_VALUE_BYTES} bytes.`
          );
          continue;
        }

        batch.set(
          ref,
          {
            key: op.key,
            value: op.value,
            updatedAt: serverTimestamp(),
            originDevice: deviceId,
          },
          { merge: true }
        );
        batchCount += 1;
      }

      if (batchCount > 0) {
        await batch.commit();
      }
    }
  } catch (error) {
    console.warn("localStorage -> Firestore sync failed.", error);
  } finally {
    isFlushing = false;

    if (pendingUpserts.size > 0 || pendingDeletes.size > 0) {
      scheduleFlush();
    }
  }
}

function patchStoragePrototype() {
  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;
  const originalClear = Storage.prototype.clear;

  Storage.prototype.setItem = function (key: string, value: string) {
    originalSetItem.call(this, key, value);

    if (
      !firestoreDb ||
      !currentUserId ||
      this !== localStorage ||
      isApplyingRemoteChanges
    ) {
      return;
    }

    queueUpsert(key, String(value));
  };

  Storage.prototype.removeItem = function (key: string) {
    originalRemoveItem.call(this, key);

    if (
      !firestoreDb ||
      !currentUserId ||
      this !== localStorage ||
      isApplyingRemoteChanges
    ) {
      return;
    }

    queueDelete(key);
  };

  Storage.prototype.clear = function () {
    const keysBeforeClear = this === localStorage ? getLocalStorageKeys(this) : [];
    originalClear.call(this);

    if (
      !firestoreDb ||
      !currentUserId ||
      this !== localStorage ||
      isApplyingRemoteChanges
    ) {
      return;
    }

    keysBeforeClear.forEach(queueDelete);
  };

  return () => {
    Storage.prototype.setItem = originalSetItem;
    Storage.prototype.removeItem = originalRemoveItem;
    Storage.prototype.clear = originalClear;
  };
}

async function hydrateFromFirestore(userId: string) {
  if (!firestoreDb) return;

  try {
    const snapshot = await getDocs(getSyncCollectionRef(userId));

    isApplyingRemoteChanges = true;
    try {
      snapshot.forEach(item => {
        const data = item.data() as { key?: unknown; value?: unknown };
        if (typeof data.key !== "string" || typeof data.value !== "string") return;
        if (!isSyncableKey(data.key)) return;

        localStorage.setItem(data.key, data.value);
      });
    } finally {
      isApplyingRemoteChanges = false;
    }
  } catch (error) {
    console.warn("Failed to hydrate localStorage from Firestore.", error);
  }
}

function mirrorExistingLocalStorageToFirestore() {
  if (!firestoreDb || !currentUserId) return;

  getLocalStorageKeys(localStorage).forEach(key => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      queueUpsert(key, value);
    }
  });
}

function subscribeToRemoteChanges(userId: string) {
  if (!firestoreDb) return () => {};

  const collectionRef = getSyncCollectionRef(userId);

  return onSnapshot(
    collectionRef,
    snapshot => {
      if (currentUserId !== userId) return;

      snapshot.docChanges().forEach(change => {
        const data = change.doc.data() as {
          key?: unknown;
          value?: unknown;
          originDevice?: unknown;
        };

        if (typeof data.key !== "string" || !isSyncableKey(data.key)) return;

        // Ignore events produced by this same browser instance.
        if (typeof data.originDevice === "string" && data.originDevice === deviceId) {
          return;
        }

        isApplyingRemoteChanges = true;
        try {
          if (change.type === "removed") {
            localStorage.removeItem(data.key);
            return;
          }

          if (typeof data.value === "string") {
            localStorage.setItem(data.key, data.value);
          }
        } finally {
          isApplyingRemoteChanges = false;
        }
      });
    },
    error => {
      console.warn("Failed to subscribe to Firestore storage sync.", error);
    }
  );
}

function clearPendingQueues() {
  pendingUpserts.clear();
  pendingDeletes.clear();

  if (flushTimer !== null) {
    window.clearTimeout(flushTimer);
    flushTimer = null;
  }
}

function stopUserSyncSession() {
  currentUserId = null;
  clearPendingQueues();

  if (unsubscribeRemoteChanges) {
    unsubscribeRemoteChanges();
    unsubscribeRemoteChanges = null;
  }
}

async function startUserSyncSession(user: User, sessionId: number) {
  currentUserId = user.uid;

  await hydrateFromFirestore(user.uid);

  if (sessionId !== sessionCounter || currentUserId !== user.uid) {
    return;
  }

  mirrorExistingLocalStorageToFirestore();
  unsubscribeRemoteChanges = subscribeToRemoteChanges(user.uid);
}

export function initFirestoreLocalStorageSync() {
  if (syncInitialized || typeof window === "undefined") return;
  syncInitialized = true;

  if (!firestoreDb) return;

  const restoreStoragePrototype = patchStoragePrototype();
  deviceId = getOrCreateDeviceId();

  if (firebaseAuth) {
    unsubscribeAuthChanges = onAuthStateChanged(
      firebaseAuth,
      user => {
        sessionCounter += 1;
        const sessionId = sessionCounter;

        stopUserSyncSession();
        if (!user) return;

        void startUserSyncSession(user, sessionId);
      },
      error => {
        console.warn("Failed to watch Firebase auth state for storage sync.", error);
      }
    );
  }

  window.__allahYafikStorageSyncCleanup = () => {
    stopUserSyncSession();

    if (unsubscribeAuthChanges) {
      unsubscribeAuthChanges();
      unsubscribeAuthChanges = null;
    }

    restoreStoragePrototype();
  };
}