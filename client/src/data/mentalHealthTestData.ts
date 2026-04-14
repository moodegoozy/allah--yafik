/**
 * Mental Health Test Data — بيانات اختبار الصحة النفسية
 * Three separate tests by age group: young (1-17), teenage (18-25), adult (26+)
 * Each question measures: mentalHealth | awareness | stillness
 */

export type AgeGroup = "young" | "teenage" | "adult";
export type Dimension = "mentalHealth" | "awareness" | "stillness";

export interface TestQuestion {
  id: number;
  text: string;
  dimension: Dimension;
  options: { label: string; emoji: string; score: number }[];
}

export interface TestResult {
  mentalHealth: number;
  awareness: number;
  stillness: number;
  total: number;
  level: "excellent" | "good" | "moderate" | "low" | "critical";
  label: string;
  color: string;
  recommendation: string;
}

export const ageGroupLabels: Record<
  AgeGroup,
  { label: string; emoji: string; color: string; gradient: string }
> = {
  young: {
    label: "فئة الناشئين",
    emoji: "🌱",
    color: "#00D4AA",
    gradient: "from-[#00D4AA] to-[#0EA5E9]",
  },
  teenage: {
    label: "فئة الشباب",
    emoji: "⚡",
    color: "#F59E0B",
    gradient: "from-[#F59E0B] to-[#EF4444]",
  },
  adult: {
    label: "فئة البالغين",
    emoji: "🏛️",
    color: "#8B5CF6",
    gradient: "from-[#8B5CF6] to-[#EC4899]",
  },
};

// =====================================================
// YOUNG (1-17) — Simple language with emojis, 8 questions
// =====================================================
export const youngQuestions: TestQuestion[] = [
  {
    id: 1,
    text: "كيف تشعر اليوم بشكل عام؟",
    dimension: "mentalHealth",
    options: [
      { label: "سعيد جداً", emoji: "😄", score: 3 },
      { label: "عادي", emoji: "😐", score: 2 },
      { label: "حزين شوي", emoji: "😢", score: 1 },
      { label: "زعلان كثير", emoji: "😠", score: 0 },
    ],
  },
  {
    id: 2,
    text: "هل تعرف إيش هي الأشياء الضارة اللي ممكن تأذيك؟",
    dimension: "awareness",
    options: [
      { label: "أعرف كثير منها", emoji: "🧠", score: 3 },
      { label: "أعرف بعضها", emoji: "🤔", score: 2 },
      { label: "أعرف شوي", emoji: "😶", score: 1 },
      { label: "ما أعرف", emoji: "❓", score: 0 },
    ],
  },
  {
    id: 3,
    text: 'لما أحد يعرض عليك شيء ما تبيه، تقدر تقول "لا"؟',
    dimension: "stillness",
    options: [
      { label: "دايم أقول لا بسهولة", emoji: "💪", score: 3 },
      { label: "أحياناً أقدر", emoji: "🙂", score: 2 },
      { label: "صعب علي", emoji: "😰", score: 1 },
      { label: "ما أقدر أبداً", emoji: "😔", score: 0 },
    ],
  },
  {
    id: 4,
    text: "هل تحس إن عندك أصدقاء يساعدونك لما تحتاجهم؟",
    dimension: "mentalHealth",
    options: [
      { label: "عندي أصدقاء كثير طيبين", emoji: "👫", score: 3 },
      { label: "عندي صديق أو اثنين", emoji: "🤝", score: 2 },
      { label: "مو متأكد", emoji: "🤷", score: 1 },
      { label: "ما عندي أحد", emoji: "😞", score: 0 },
    ],
  },
  {
    id: 5,
    text: "هل تعرف ليش التدخين والمخدرات خطيرة؟",
    dimension: "awareness",
    options: [
      { label: "أعرف تماماً", emoji: "✅", score: 3 },
      { label: "أعرف شوي", emoji: "📖", score: 2 },
      { label: "سمعت بس ما أفهم", emoji: "👂", score: 1 },
      { label: "ما أعرف شي", emoji: "🚫", score: 0 },
    ],
  },
  {
    id: 6,
    text: "لما تكون متضايق، إيش تسوي عادة؟",
    dimension: "stillness",
    options: [
      { label: "أتكلم مع أهلي أو صديق", emoji: "💬", score: 3 },
      { label: "ألعب أو أسوي شي أحبه", emoji: "⚽", score: 2 },
      { label: "أقعد لحالي وأسكت", emoji: "🤐", score: 1 },
      { label: "أصير عصبي وأزعل", emoji: "💥", score: 0 },
    ],
  },
  {
    id: 7,
    text: "هل تنام كويس بالليل؟",
    dimension: "mentalHealth",
    options: [
      { label: "نعم دايم", emoji: "😴", score: 3 },
      { label: "غالباً", emoji: "🌙", score: 2 },
      { label: "أحياناً أسهر كثير", emoji: "📱", score: 1 },
      { label: "ما أنام كويس أبداً", emoji: "😵", score: 0 },
    ],
  },
  {
    id: 8,
    text: "لو شفت أحد أصدقاءك يسوي شي غلط، إيش تسوي؟",
    dimension: "awareness",
    options: [
      { label: "أنصحه وأقوله لا", emoji: "🗣️", score: 3 },
      { label: "أبتعد عنه", emoji: "🚶", score: 2 },
      { label: "أسكت وما أسوي شي", emoji: "🙊", score: 1 },
      { label: "أسوي مثله", emoji: "😬", score: 0 },
    ],
  },
];

// =====================================================
// TEENAGE (18-25) — More mature, pressure/identity focused
// =====================================================
export const teenageQuestions: TestQuestion[] = [
  {
    id: 1,
    text: "كيف تقيّم حالتك النفسية خلال الأسبوعين الماضيين؟",
    dimension: "mentalHealth",
    options: [
      { label: "ممتازة", emoji: "🌟", score: 3 },
      { label: "جيدة", emoji: "👍", score: 2 },
      { label: "متقلبة", emoji: "🎭", score: 1 },
      { label: "صعبة جداً", emoji: "⛈️", score: 0 },
    ],
  },
  {
    id: 2,
    text: "هل تعرف كيف تتعامل مع ضغط الأقران والمجتمع؟",
    dimension: "awareness",
    options: [
      { label: "نعم، عندي آليات واضحة", emoji: "🛡️", score: 3 },
      { label: "أحاول لكن أحياناً أتأثر", emoji: "💭", score: 2 },
      { label: "أتأثر بسهولة", emoji: "🌊", score: 1 },
      { label: "ما أقدر أقاوم الضغط", emoji: "😩", score: 0 },
    ],
  },
  {
    id: 3,
    text: "عندما تواجه مشاعر سلبية (غضب، قلق، حزن)، كيف تتصرف؟",
    dimension: "stillness",
    options: [
      { label: "أتأمل أو أمارس تقنيات تهدئة", emoji: "🧘", score: 3 },
      { label: "أتحدث مع شخص أثق به", emoji: "💬", score: 2 },
      { label: "أحاول أنسى بالترفيه", emoji: "📱", score: 1 },
      { label: "أبحث عن أي شي يخفف حتى لو ضار", emoji: "⚠️", score: 0 },
    ],
  },
  {
    id: 4,
    text: "هل تشعر بالوحدة أو العزلة الاجتماعية؟",
    dimension: "mentalHealth",
    options: [
      { label: "نادراً", emoji: "❤️", score: 3 },
      { label: "أحياناً", emoji: "🫤", score: 2 },
      { label: "كثيراً", emoji: "😶‍🌫️", score: 1 },
      { label: "دائماً", emoji: "🖤", score: 0 },
    ],
  },
  {
    id: 5,
    text: "هل لديك معرفة بمخاطر المواد المخدرة والمؤثرات العقلية؟",
    dimension: "awareness",
    options: [
      { label: "معرفة شاملة ومفصلة", emoji: "📚", score: 3 },
      { label: "معرفة عامة", emoji: "📖", score: 2 },
      { label: "معرفة محدودة", emoji: "📝", score: 1 },
      { label: "لا أعرف شيئاً", emoji: "❌", score: 0 },
    ],
  },
  {
    id: 6,
    text: "كيف تتعامل مع الإحباط عندما لا تسير الأمور كما تريد؟",
    dimension: "stillness",
    options: [
      { label: "أتقبل وأبحث عن حلول بديلة", emoji: "🎯", score: 3 },
      { label: "أحتاج وقت بس أتجاوز", emoji: "⏳", score: 2 },
      { label: "أتضايق كثير وأنعزل", emoji: "🚪", score: 1 },
      { label: "أفقد السيطرة على مشاعري", emoji: "🌋", score: 0 },
    ],
  },
  {
    id: 7,
    text: "هل تستخدم وسائل التواصل الاجتماعي بشكل مفرط؟",
    dimension: "mentalHealth",
    options: [
      { label: "لا، استخدامي محدود ومنظم", emoji: "⏰", score: 3 },
      { label: "أحياناً أتجاوز", emoji: "📲", score: 2 },
      { label: "نعم، ساعات طويلة يومياً", emoji: "🔄", score: 1 },
      { label: "ما أقدر أعيش بدونها", emoji: "🫣", score: 0 },
    ],
  },
  {
    id: 8,
    text: "هل تجد صعوبة في التركيز على دراستك أو عملك؟",
    dimension: "awareness",
    options: [
      { label: "أبداً، تركيزي عالي", emoji: "🎓", score: 3 },
      { label: "أحياناً فقط", emoji: "📊", score: 2 },
      { label: "كثيراً", emoji: "🌀", score: 1 },
      { label: "دائماً مشتت", emoji: "💫", score: 0 },
    ],
  },
  {
    id: 9,
    text: "هل مررت بتجربة تعرضت فيها لعرض مواد مخدرة أو ضارة؟",
    dimension: "stillness",
    options: [
      { label: "لا أبداً", emoji: "✨", score: 3 },
      { label: "نعم ورفضت بسهولة", emoji: "🛡️", score: 2 },
      { label: "نعم وكان صعب أرفض", emoji: "😓", score: 1 },
      { label: "نعم ولم أستطع الرفض", emoji: "😞", score: 0 },
    ],
  },
  {
    id: 10,
    text: "ما مدى رضاك عن حياتك الحالية بشكل عام؟",
    dimension: "mentalHealth",
    options: [
      { label: "راضي جداً", emoji: "🌈", score: 3 },
      { label: "راضي نوعاً ما", emoji: "☀️", score: 2 },
      { label: "غير راضي", emoji: "🌥️", score: 1 },
      { label: "غير راضي أبداً", emoji: "⛈️", score: 0 },
    ],
  },
];

// =====================================================
// ADULT (26+) — Professional, family, stress-focused
// =====================================================
export const adultQuestions: TestQuestion[] = [
  {
    id: 1,
    text: "كيف تقيّم مستوى التوتر والضغط النفسي في حياتك اليومية؟",
    dimension: "mentalHealth",
    options: [
      { label: "منخفض جداً — أعيش باتزان", emoji: "🧘", score: 3 },
      { label: "متوسط — أتعامل معه", emoji: "⚖️", score: 2 },
      { label: "مرتفع — يؤثر على حياتي", emoji: "📈", score: 1 },
      { label: "شديد جداً — لا أطيقه", emoji: "🆘", score: 0 },
    ],
  },
  {
    id: 2,
    text: "هل لديك وعي كافٍ بأعراض الاحتراق النفسي (Burnout)؟",
    dimension: "awareness",
    options: [
      { label: "نعم، وأعرف كيف أتجنبه", emoji: "✅", score: 3 },
      { label: "أعرف الأعراض لكن لا أطبق", emoji: "📋", score: 2 },
      { label: "سمعت عنه فقط", emoji: "👂", score: 1 },
      { label: "لا أعرف ماهو", emoji: "❓", score: 0 },
    ],
  },
  {
    id: 3,
    text: "كيف تتعامل مع ضغوطات العمل أو المسؤوليات العائلية؟",
    dimension: "stillness",
    options: [
      { label: "أنظم وقتي وأولوياتي بفعالية", emoji: "📅", score: 3 },
      { label: "أحاول لكن أحتاج تحسين", emoji: "🔧", score: 2 },
      { label: "أشعر بالإرهاق المستمر", emoji: "😮‍💨", score: 1 },
      { label: "فقدت السيطرة تماماً", emoji: "💔", score: 0 },
    ],
  },
  {
    id: 4,
    text: "هل تلجأ لأي مواد (تدخين، كحول، أدوية) للتخفيف من الضغط؟",
    dimension: "mentalHealth",
    options: [
      { label: "لا أبداً", emoji: "🚫", score: 3 },
      { label: "نادراً جداً", emoji: "🟡", score: 2 },
      { label: "أحياناً", emoji: "🟠", score: 1 },
      { label: "بشكل منتظم", emoji: "🔴", score: 0 },
    ],
  },
  {
    id: 5,
    text: "هل تعرف أعراض الإدمان المبكرة وكيف تحمي نفسك وعائلتك؟",
    dimension: "awareness",
    options: [
      { label: "نعم، ولديّ خطة وقائية", emoji: "🛡️", score: 3 },
      { label: "أعرف الأعراض بشكل عام", emoji: "📖", score: 2 },
      { label: "معرفتي محدودة", emoji: "📝", score: 1 },
      { label: "لا أعرف شيئاً عنها", emoji: "❌", score: 0 },
    ],
  },
  {
    id: 6,
    text: "هل لديك روتين يومي يشمل الرياضة أو التأمل أو الصلاة؟",
    dimension: "stillness",
    options: [
      { label: "نعم، روتين ثابت ويومي", emoji: "🌅", score: 3 },
      { label: "أحاول لكن غير منتظم", emoji: "📊", score: 2 },
      { label: "نادراً", emoji: "🌀", score: 1 },
      { label: "لا وقت عندي لهذا", emoji: "⏰", score: 0 },
    ],
  },
  {
    id: 7,
    text: "كيف هي علاقتك بعائلتك وأقربائك؟",
    dimension: "mentalHealth",
    options: [
      { label: "ممتازة ومستقرة", emoji: "🏡", score: 3 },
      { label: "جيدة بشكل عام", emoji: "👨‍👩‍👧‍👦", score: 2 },
      { label: "فيها توتر وخلافات", emoji: "💢", score: 1 },
      { label: "سيئة جداً", emoji: "💔", score: 0 },
    ],
  },
  {
    id: 8,
    text: "هل تشعر بأن لديك هدف ومعنى واضح في حياتك؟",
    dimension: "awareness",
    options: [
      { label: "نعم، أهدافي واضحة", emoji: "🎯", score: 3 },
      { label: "نوعاً ما", emoji: "🤔", score: 2 },
      { label: "أشعر بالضياع أحياناً", emoji: "🧭", score: 1 },
      { label: "ما عندي أي هدف", emoji: "😶", score: 0 },
    ],
  },
  {
    id: 9,
    text: "في أوقات الأزمات، هل تعرف من تتصل به للمساعدة؟",
    dimension: "stillness",
    options: [
      { label: "نعم، لدي شبكة دعم واضحة", emoji: "📞", score: 3 },
      { label: "عندي شخص أو اثنين", emoji: "🤝", score: 2 },
      { label: "غير متأكد", emoji: "🤷", score: 1 },
      { label: "لا أحد يساعدني", emoji: "😔", score: 0 },
    ],
  },
  {
    id: 10,
    text: "هل تراجع صحتك النفسية والجسدية بشكل دوري؟",
    dimension: "mentalHealth",
    options: [
      { label: "نعم، كل ٦ أشهر على الأقل", emoji: "🏥", score: 3 },
      { label: "أحياناً", emoji: "📆", score: 2 },
      { label: "فقط عند المرض", emoji: "🤒", score: 1 },
      { label: "أبداً", emoji: "🚫", score: 0 },
    ],
  },
];

export function getTestQuestions(ageGroup: AgeGroup): TestQuestion[] {
  switch (ageGroup) {
    case "young":
      return youngQuestions;
    case "teenage":
      return teenageQuestions;
    case "adult":
      return adultQuestions;
  }
}

export function calculateTestResult(
  answers: number[],
  questions: TestQuestion[]
): TestResult {
  const maxScore = questions.length * 3;
  let mentalHealth = 0,
    awareness = 0,
    stillness = 0;
  let mhCount = 0,
    awCount = 0,
    stCount = 0;

  questions.forEach((q, i) => {
    const score = answers[i] ?? 0;
    switch (q.dimension) {
      case "mentalHealth":
        mentalHealth += score;
        mhCount++;
        break;
      case "awareness":
        awareness += score;
        awCount++;
        break;
      case "stillness":
        stillness += score;
        stCount++;
        break;
    }
  });

  // Normalize to 0-100
  const mhPct =
    mhCount > 0 ? Math.round((mentalHealth / (mhCount * 3)) * 100) : 0;
  const awPct = awCount > 0 ? Math.round((awareness / (awCount * 3)) * 100) : 0;
  const stPct = stCount > 0 ? Math.round((stillness / (stCount * 3)) * 100) : 0;
  const totalScore = answers.reduce((a, b) => a + b, 0);
  const totalPct = Math.round((totalScore / maxScore) * 100);

  let level: TestResult["level"];
  let label: string;
  let color: string;
  let recommendation: string;

  if (totalPct >= 85) {
    level = "excellent";
    label = "ممتاز";
    color = "#00D4AA";
    recommendation =
      "حالتك ممتازة! استمر في نمط حياتك الصحي وكن قدوة لمن حولك.";
  } else if (totalPct >= 70) {
    level = "good";
    label = "جيد";
    color = "#0EA5E9";
    recommendation =
      "أنت في وضع جيد. ركز على تعزيز نقاط القوة وتطوير مهاراتك الوقائية.";
  } else if (totalPct >= 50) {
    level = "moderate";
    label = "متوسط";
    color = "#F59E0B";
    recommendation =
      "تحتاج لتطوير بعض المهارات. ننصحك بمتابعة المحاضرات وتمارين الوقاية بانتظام.";
  } else if (totalPct >= 30) {
    level = "low";
    label = "يحتاج تحسين";
    color = "#EF4444";
    recommendation =
      "ننصحك بشدة بمتابعة خطة التعافي والتحدث مع مختص. نحن هنا لمساعدتك.";
  } else {
    level = "critical";
    label = "حرج — تحتاج دعم فوري";
    color = "#DC2626";
    recommendation =
      "يرجى التواصل مع خط المساعدة فوراً. لست وحدك، ونحن هنا لدعمك في كل خطوة.";
  }

  return {
    mentalHealth: mhPct,
    awareness: awPct,
    stillness: stPct,
    total: totalPct,
    level,
    label,
    color,
    recommendation,
  };
}
