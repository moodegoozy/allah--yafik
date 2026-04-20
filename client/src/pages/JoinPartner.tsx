/**
 * JoinPartner - نموذج طلب انضمام المؤسسات الشريكة
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: نموذج تفاعلي متعدد الخطوات، تصنيف المؤسسات، تأكيد الإرسال
 */
import { useState } from "react";
import {
  Building2,
  Hospital,
  GraduationCap,
  Shield,
  BookOpen,
  Microscope,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Users,
  FileText,
  Sparkles,
  Heart,
  Star,
  Send,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const CONTACT_PHONE = "0546192019";

const partnerTypes = [
  {
    id: "hospital",
    icon: Hospital,
    label: "مستشفى / مركز صحي",
    desc: "دعم صحي وطبي متخصص للمتعافين",
    color: "#EF4444",
    benefits: [
      "تقديم استشارات طبية مجانية",
      "برامج علاج متخصصة",
      "دعم طبي في حالات الطوارئ",
    ],
  },
  {
    id: "university",
    icon: GraduationCap,
    label: "جامعة / كلية",
    desc: "دعم أكاديمي وتوعية للطلاب",
    color: "#3B82F6",
    benefits: [
      "محاضرات توعوية للطلاب",
      "برامج إرشاد أكاديمي",
      "دعم الطلاب في التعافي",
    ],
  },
  {
    id: "school",
    icon: BookOpen,
    label: "مدرسة / معهد تعليمي",
    desc: "توعية مبكرة للأجيال الناشئة",
    color: "#10B981",
    benefits: ["برامج وقاية للطلاب", "تدريب المعلمين", "ورش عمل توعوية"],
  },
  {
    id: "security",
    icon: Shield,
    label: "جهة أمنية / عسكرية",
    desc: "دعم أمني ومتابعة قانونية",
    color: "#8B5CF6",
    benefits: [
      "دعم قانوني للمتعافين",
      "برامج إعادة التأهيل",
      "التنسيق مع الجهات المختصة",
    ],
  },
  {
    id: "religious",
    icon: Star,
    label: "جهة دينية / مسجد",
    desc: "توعية دينية وإرشاد روحي",
    color: "#F59E0B",
    benefits: [
      "محاضرات دينية توعوية",
      "إرشاد روحي للمتعافين",
      "دعم مجتمعي ديني",
    ],
  },
  {
    id: "narcotics",
    icon: Microscope,
    label: "هيئة مكافحة المخدرات",
    desc: "إحصائيات ودعم رسمي متخصص",
    color: "#00D4AA",
    benefits: [
      "إحصائيات وبيانات رسمية",
      "تنسيق مع الجهات الحكومية",
      "دعم مؤسسي رسمي",
    ],
  },
];

const steps = [
  { id: 1, label: "نوع المؤسسة" },
  { id: 2, label: "بيانات المؤسسة" },
  { id: 3, label: "تفاصيل الشراكة" },
  { id: 4, label: "التأكيد" },
];

interface FormData {
  partnerType: string;
  orgName: string;
  city: string;
  region: string;
  contactName: string;
  contactTitle: string;
  phone: string;
  email: string;
  employeeCount: string;
  partnershipGoal: string;
  availableResources: string[];
  preferredActivities: string[];
  additionalNotes: string;
}

const regions = [
  "الرياض",
  "مكة المكرمة",
  "المدينة المنورة",
  "الشرقية",
  "القصيم",
  "حائل",
  "تبوك",
  "الجوف",
  "الحدود الشمالية",
  "عسير",
  "جازان",
  "نجران",
  "الباحة",
];

const activities = [
  "محاضرات توعوية",
  "ورش عمل",
  "برامج تدريبية",
  "استشارات",
  "دعم طارئ",
  "إحصائيات وبيانات",
  "حملات توعية",
  "برامج أسرية",
];

const resources = [
  "قاعات اجتماعات",
  "متخصصون صحيون",
  "كوادر تعليمية",
  "دعم مالي",
  "وسائل إعلام",
  "شبكة تواصل واسعة",
];

export default function JoinPartner() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    partnerType: "",
    orgName: "",
    city: "",
    region: "",
    contactName: "",
    contactTitle: "",
    phone: "",
    email: "",
    employeeCount: "",
    partnershipGoal: "",
    availableResources: [],
    preferredActivities: [],
    additionalNotes: "",
  });

  const selectedType = partnerTypes.find(t => t.id === form.partnerType);

  const toggleArray = (
    field: "availableResources" | "preferredActivities",
    value: string
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !form.partnerType) {
      toast.error("يرجى اختيار نوع المؤسسة");
      return;
    }
    if (
      currentStep === 2 &&
      (!form.orgName || !form.city || !form.contactName || !form.phone)
    ) {
      toast.error("يرجى تعبئة الحقول المطلوبة");
      return;
    }
    setCurrentStep(s => s + 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    toast.success("تم إرسال طلب الشراكة بنجاح! سنتواصل معك خلال ٢٤ ساعة");
  };

  return (
    <div className="app-container bg-gradient-navy overflow-hidden">
      <div className="orb w-64 h-64 opacity-8 top-10 -right-20" style={{ background: "oklch(0.75 0.18 175)" }} />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div>
          <div className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
            انضم كشريك
          </div>
          <h1 className="text-foreground font-black text-xl">طلب الشراكة المؤسسية</h1>
          <p className="text-muted-foreground text-xs mt-0.5">كن جزءاً من الحل الوطني لمكافحة الإدمان</p>
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        <div className="px-4 pt-3">
          <AnimatePresence mode="wait">
            {/* Success State */}
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 glow-teal">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-black text-foreground mb-3">
                  تم إرسال الطلب!
                </h2>
                <p className="text-foreground/55 mb-2">
                  شكراً لاهتمامك بالانضمام لبرنامج{" "}
                  <strong className="text-foreground">الله يعافيك</strong>
                </p>
                <p className="text-muted-foreground text-sm mb-8">
                  سيتواصل معك فريقنا خلال{" "}
                  <strong className="text-primary">٢٤ ساعة</strong> على رقم{" "}
                  {form.phone}
                </p>

                <div className="glass-card p-5 border border-border text-right mb-6 max-w-sm mx-auto">
                  <h4 className="text-foreground font-bold text-sm mb-3">
                    ملخص طلبك
                  </h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>المؤسسة:</span>
                      <span className="text-foreground/80">{form.orgName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>النوع:</span>
                      <span className="text-foreground/80">
                        {selectedType?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>المدينة:</span>
                      <span className="text-foreground/80">{form.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المسؤول:</span>
                      <span className="text-foreground/80">{form.contactName}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-primary-foreground transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))",
                  }}
                >
                  <Phone className="w-4 h-4" />
                  تواصل مباشرة: {CONTACT_PHONE}
                </a>
              </motion.div>
            ) : (
              <>
                {/* Steps Indicator */}
                <div className="flex items-center justify-between mb-8">
                  {steps.map((step, i) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all ${
                            currentStep > step.id
                              ? "bg-emerald-500 text-primary-foreground"
                              : currentStep === step.id
                                ? "bg-primary/20 border border-primary/50 text-primary"
                                : "glass-card border border-border text-muted-foreground/70"
                          }`}
                        >
                          {currentStep > step.id ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            step.id
                          )}
                        </div>
                        <span
                          className={`text-xs mt-1.5 ${currentStep === step.id ? "text-primary" : "text-muted-foreground/70"}`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className={`flex-1 h-px mx-2 mb-5 transition-all ${currentStep > step.id ? "bg-emerald-500/50" : "bg-secondary/80"}`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Partner Type */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-foreground font-black text-base mb-4">
                      ما نوع مؤسستك؟
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {partnerTypes.map(type => (
                        <button
                          key={type.id}
                          onClick={() =>
                            setForm(prev => ({ ...prev, partnerType: type.id }))
                          }
                          className={`p-4 rounded-2xl border text-right transition-all ${
                            form.partnerType === type.id
                              ? "text-foreground"
                              : "glass-card border-border hover:border-border"
                          }`}
                          style={
                            form.partnerType === type.id
                              ? {
                                  background: `${type.color}12`,
                                  borderColor: `${type.color}35`,
                                }
                              : {}
                          }
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center"
                              style={{ background: `${type.color}20` }}
                            >
                              <type.icon
                                className="w-4.5 h-4.5"
                                style={{ color: type.color }}
                              />
                            </div>
                            <span className="text-foreground font-bold text-sm">
                              {type.label}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs">{type.desc}</p>
                          {form.partnerType === type.id && (
                            <div className="mt-3 pt-3 border-t border-border space-y-1">
                              {type.benefits.map((b, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-1.5 text-xs"
                                  style={{ color: type.color }}
                                >
                                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                                  {b}
                                </div>
                              ))}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Organization Info */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-foreground font-black text-base mb-4">
                      بيانات المؤسسة
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                          اسم المؤسسة *
                        </label>
                        <input
                          value={form.orgName}
                          onChange={e =>
                            setForm(prev => ({
                              ...prev,
                              orgName: e.target.value,
                            }))
                          }
                          placeholder="مثال: مستشفى الملك فهد"
                          className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                            المدينة *
                          </label>
                          <input
                            value={form.city}
                            onChange={e =>
                              setForm(prev => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                            placeholder="مثال: الرياض"
                            className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                            المنطقة
                          </label>
                          <select
                            value={form.region}
                            onChange={e =>
                              setForm(prev => ({
                                ...prev,
                                region: e.target.value,
                              }))
                            }
                            className="w-full bg-card border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-border text-sm"
                          >
                            <option value="">اختر المنطقة</option>
                            {regions.map(r => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                            اسم المسؤول *
                          </label>
                          <input
                            value={form.contactName}
                            onChange={e =>
                              setForm(prev => ({
                                ...prev,
                                contactName: e.target.value,
                              }))
                            }
                            placeholder="الاسم الكامل"
                            className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                            المسمى الوظيفي
                          </label>
                          <input
                            value={form.contactTitle}
                            onChange={e =>
                              setForm(prev => ({
                                ...prev,
                                contactTitle: e.target.value,
                              }))
                            }
                            placeholder="مثال: مدير الشراكات"
                            className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border text-sm"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                            رقم الجوال *
                          </label>
                          <input
                            value={form.phone}
                            onChange={e =>
                              setForm(prev => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="05XXXXXXXX"
                            className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border text-sm font-numbers"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                            البريد الإلكتروني
                          </label>
                          <input
                            value={form.email}
                            onChange={e =>
                              setForm(prev => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            placeholder="example@org.com"
                            className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border text-sm"
                            dir="ltr"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                          عدد الموظفين / الطلاب
                        </label>
                        <select
                          value={form.employeeCount}
                          onChange={e =>
                            setForm(prev => ({
                              ...prev,
                              employeeCount: e.target.value,
                            }))
                          }
                          className="w-full bg-card border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-border text-sm"
                        >
                          <option value="">اختر النطاق</option>
                          <option value="less50">أقل من ٥٠</option>
                          <option value="50-200">٥٠ - ٢٠٠</option>
                          <option value="200-1000">٢٠٠ - ١٠٠٠</option>
                          <option value="more1000">أكثر من ١٠٠٠</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Partnership Details */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-foreground font-black text-base mb-4">
                      تفاصيل الشراكة
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <label className="text-muted-foreground text-xs font-bold mb-3 block">
                          الأنشطة المفضلة (اختر ما يناسبك)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {activities.map(act => (
                            <button
                              key={act}
                              onClick={() =>
                                toggleArray("preferredActivities", act)
                              }
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                form.preferredActivities.includes(act)
                                  ? "bg-primary/15 border border-primary/35 text-primary"
                                  : "glass-card border border-border text-muted-foreground hover:text-foreground/70"
                              }`}
                            >
                              {act}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-muted-foreground text-xs font-bold mb-3 block">
                          الموارد المتاحة لديكم
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {resources.map(res => (
                            <button
                              key={res}
                              onClick={() =>
                                toggleArray("availableResources", res)
                              }
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                form.availableResources.includes(res)
                                  ? "bg-violet-500/15 border border-violet-500/35 text-violet-500"
                                  : "glass-card border border-border text-muted-foreground hover:text-foreground/70"
                              }`}
                            >
                              {res}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                          هدف الشراكة
                        </label>
                        <textarea
                          value={form.partnershipGoal}
                          onChange={e =>
                            setForm(prev => ({
                              ...prev,
                              partnershipGoal: e.target.value,
                            }))
                          }
                          placeholder="صف باختصار ما تأمل تحقيقه من خلال هذه الشراكة..."
                          className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border text-sm resize-none"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                          ملاحظات إضافية
                        </label>
                        <textarea
                          value={form.additionalNotes}
                          onChange={e =>
                            setForm(prev => ({
                              ...prev,
                              additionalNotes: e.target.value,
                            }))
                          }
                          placeholder="أي معلومات إضافية تريد إضافتها..."
                          className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border text-sm resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-foreground font-black text-base mb-4">
                      مراجعة الطلب
                    </h3>
                    <div className="space-y-4 mb-6">
                      {/* Partner Type */}
                      {selectedType && (
                        <div className="glass-card p-4 border border-border rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ background: `${selectedType.color}20` }}
                            >
                              <selectedType.icon
                                className="w-5 h-5"
                                style={{ color: selectedType.color }}
                              />
                            </div>
                            <div>
                              <div className="text-foreground font-bold text-sm">
                                {selectedType.label}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {selectedType.desc}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Org Info */}
                      <div className="glass-card p-4 border border-border rounded-2xl space-y-2.5">
                        <h4 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-3">
                          بيانات المؤسسة
                        </h4>
                        {[
                          {
                            icon: Building2,
                            label: "المؤسسة",
                            value: form.orgName,
                          },
                          {
                            icon: MapPin,
                            label: "الموقع",
                            value: `${form.city}${form.region ? ` - ${form.region}` : ""}`,
                          },
                          {
                            icon: Users,
                            label: "المسؤول",
                            value: `${form.contactName}${form.contactTitle ? ` (${form.contactTitle})` : ""}`,
                          },
                          { icon: Phone, label: "الجوال", value: form.phone },
                          {
                            icon: Mail,
                            label: "البريد",
                            value: form.email || "—",
                          },
                        ].map((row, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 text-sm"
                          >
                            <row.icon className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0" />
                            <span className="text-muted-foreground w-16 flex-shrink-0">
                              {row.label}:
                            </span>
                            <span className="text-foreground/80">{row.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Activities */}
                      {form.preferredActivities.length > 0 && (
                        <div className="glass-card p-4 border border-border rounded-2xl">
                          <h4 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-3">
                            الأنشطة المفضلة
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {form.preferredActivities.map(a => (
                              <span
                                key={a}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="glass-card p-4 border border-accent/20 rounded-2xl mb-6 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        بإرسال هذا الطلب، أنت توافق على مشاركة بيانات مؤسستك مع
                        فريق برنامج "الله يعافيك" لأغراض الشراكة فقط. ستتلقى
                        رداً خلال ٢٤ ساعة.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-6">
                  {currentStep > 1 ? (
                    <button
                      onClick={() => setCurrentStep(s => s - 1)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card border border-border text-muted-foreground hover:text-foreground font-bold text-sm transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                      السابق
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-primary-foreground transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))",
                      }}
                    >
                      التالي
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-primary-foreground transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.70 0.17 160), oklch(0.75 0.18 175))",
                      }}
                    >
                      <Send className="w-4 h-4" />
                      إرسال الطلب
                    </button>
                  )}
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
