/**
 * rehabData.ts - نظام خطط الوقاية التأهيلية الشامل
 * "صون" - مبني على أحدث البروتوكولات الوقائية العلمية
 * يشمل: WHO Prevention Guidelines 2024, NIDA Prevention Framework
 */

export type PhaseId = "awareness" | "skills" | "environment" | "maintain";
export type RiskLevel = "low" | "moderate" | "high" | "severe";

export interface DailyTask {
  id: string;
  time: string;
  title: string;
  description: string;
  category: "awareness" | "psychological" | "spiritual" | "social" | "physical" | "skill";
  duration: number;
  mandatory: boolean;
  icon: string;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  metric: string;
  target: number;
  unit: string;
}

export interface RehabPhase {
  id: PhaseId;
  order: number;
  title: string;
  subtitle: string;
  duration: string;
  durationDays: number;
  color: string;
  gradient: string;
  icon: string;
  description: string;
  scientificBasis: string;
  goals: string[];
  dailySchedule: DailyTask[];
  weeklyGoals: WeeklyGoal[];
  warningSignals: string[];
  successIndicators: string[];
  professionalSupport: string[];
  selfCareTools: string[];
}

export const rehabPhases: RehabPhase[] = [
  {
    id: "awareness",
    order: 1,
    title: "مرحلة الوعي",
    subtitle: "بناء الوعي الوقائي وفهم المخاطر",
    duration: "أسبوعان",
    durationDays: 14,
    color: "#00D4AA",
    gradient: "linear-gradient(135deg, #00D4AA, #0EA5E9)",
    icon: "🧠",
    description: "الوعي هو الخطوة الأولى والأهم في الوقاية. في هذه المرحلة تتعلم كيف يعمل الإدمان في الدماغ، وتحدد عوامل الخطر الشخصية، وتبني أساساً معرفياً قوياً يحميك.",
    scientificBasis: "تستند هذه المرحلة إلى نظرية التعلم الاجتماعي (Bandura) ونموذج الوقاية الأولية (NIDA 2024) التي تؤكد أن الوعي المبكر يقلل خطر الإدمان بنسبة ٦٠٪.",
    goals: [
      "فهم آليات الإدمان العصبية",
      "تحديد عوامل الخطر الشخصية",
      "التعرف على المحفزات البيئية",
      "بناء موقف واضح من المخدرات",
    ],
    dailySchedule: [
      {
        id: "morning-dhikr",
        time: "٦:٣٠ ص",
        title: "أذكار الصباح والتحصين",
        description: "أذكار الصباح كاملة + آية الكرسي + المعوذتين. التحصين الروحي اليومي يبني قوة داخلية.",
        category: "spiritual",
        duration: 15,
        mandatory: true,
        icon: "🕌",
      },
      {
        id: "awareness-read",
        time: "٧:٠٠ ص",
        title: "قراءة توعوية يومية",
        description: "قراءة مقال أو فصل من كتاب عن مخاطر الإدمان. ١٠ دقائق كافية لبناء المعرفة تدريجياً.",
        category: "awareness",
        duration: 10,
        mandatory: true,
        icon: "📖",
      },
      {
        id: "morning-exercise",
        time: "٧:٣٠ ص",
        title: "رياضة صباحية",
        description: "٣٠ دقيقة مشي أو جري. الرياضة تُفرز الدوبامين بشكل طبيعي وتقلل الحاجة للمحفزات الاصطناعية.",
        category: "physical",
        duration: 30,
        mandatory: false,
        icon: "🏃",
      },
      {
        id: "risk-journal",
        time: "٢:٠٠ م",
        title: "يومية عوامل الخطر",
        description: "سجّل المواقف التي شعرت فيها بالضعف أو الإغراء. التسجيل يزيد الوعي ويساعد على التخطيط.",
        category: "awareness",
        duration: 10,
        mandatory: true,
        icon: "📝",
      },
      {
        id: "positive-circle",
        time: "٦:٠٠ م",
        title: "وقت مع الأصدقاء الإيجابيين",
        description: "قضِ وقتاً مع أصدقاء يدعمونك ويشاركونك قيمك. البيئة الاجتماعية الصحية هي أقوى درع وقائي.",
        category: "social",
        duration: 60,
        mandatory: false,
        icon: "👥",
      },
      {
        id: "evening-dhikr",
        time: "٩:٠٠ م",
        title: "أذكار المساء والمراجعة",
        description: "أذكار المساء + مراجعة سريعة لليوم: ما الذي تعلمته؟ ما الذي تجنبته؟",
        category: "spiritual",
        duration: 15,
        mandatory: true,
        icon: "🌙",
      },
    ],
    weeklyGoals: [
      { id: "w1", title: "قراءة مقالين توعويين", description: "اقرأ مقالين عن مخاطر الإدمان", metric: "مقالات", target: 2, unit: "مقال" },
      { id: "w2", title: "حضور محاضرة توعوية", description: "حضور محاضرة في التطبيق أو المجتمع", metric: "محاضرات", target: 1, unit: "محاضرة" },
      { id: "w3", title: "تحديد ٣ عوامل خطر شخصية", description: "اكتب العوامل التي تجعلك عرضة للخطر", metric: "عوامل", target: 3, unit: "عامل" },
    ],
    warningSignals: [
      "الشعور بالفضول المتزايد تجاه المخدرات",
      "قضاء وقت أكثر مع أصدقاء سلبيين",
      "تجاهل التحصين الروحي اليومي",
      "العزلة الاجتماعية المتزايدة",
    ],
    successIndicators: [
      "القدرة على شرح مخاطر الإدمان للآخرين",
      "تحديد عوامل الخطر الشخصية بوضوح",
      "الالتزام بالتحصين الروحي اليومي",
      "الشعور بالثقة في مواجهة الضغط الاجتماعي",
    ],
    professionalSupport: [
      "محاضرات توعوية متخصصة",
      "جلسة استشارية مع متخصص وقاية",
      "انضمام لمجموعة وعي في التطبيق",
    ],
    selfCareTools: [
      "تطبيق يومية الوعي",
      "قائمة عوامل الخطر الشخصية",
      "خطة التحصين الروحي اليومي",
    ],
  },
  {
    id: "skills",
    order: 2,
    title: "مرحلة المهارات",
    subtitle: "بناء مهارات الرفض وإدارة الضغط",
    duration: "٣ أسابيع",
    durationDays: 21,
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6, #EC4899)",
    icon: "🛡️",
    description: "المعرفة وحدها لا تكفي — تحتاج إلى مهارات عملية. في هذه المرحلة تتدرب على مهارات الرفض الحازم، وإدارة الضغط، وبناء قوة الإرادة من خلال تمارين يومية.",
    scientificBasis: "تستند إلى نظرية الكفاءة الذاتية (Self-Efficacy) وبرامج Life Skills Training التي أثبتت فاعلية ٨٠٪ في الوقاية من الإدمان لدى الشباب.",
    goals: [
      "إتقان مهارة الرفض الحازم",
      "تعلم تقنيات إدارة الضغط",
      "بناء قوة الإرادة يومياً",
      "التعامل مع الضغط الاجتماعي بثقة",
    ],
    dailySchedule: [
      {
        id: "morning-affirmations",
        time: "٦:٣٠ ص",
        title: "التأكيدات الإيجابية + أذكار",
        description: "أذكار الصباح + ٥ تأكيدات إيجابية أمام المرآة: 'أنا قوي، أنا واعٍ، أنا أحمي نفسي'",
        category: "psychological",
        duration: 15,
        mandatory: true,
        icon: "💪",
      },
      {
        id: "refusal-practice",
        time: "٨:٠٠ ص",
        title: "تمرين الرفض الحازم",
        description: "تمرين يومي: تخيّل موقفاً يُعرض فيه عليك شيء ضار وتدرّب على الرفض بصوت واضح وثابت.",
        category: "skill",
        duration: 10,
        mandatory: true,
        icon: "🚫",
      },
      {
        id: "breathing-478",
        time: "١٢:٠٠ م",
        title: "تقنية التنفس ٤-٧-٨",
        description: "استنشق ٤ ثوانٍ، احبس ٧، أخرج ٨. كررها ٤ مرات. تقلل الضغط وتقوي الإرادة.",
        category: "physical",
        duration: 5,
        mandatory: true,
        icon: "🌬️",
      },
      {
        id: "stress-journal",
        time: "٤:٠٠ م",
        title: "يومية إدارة الضغط",
        description: "سجّل مصادر الضغط اليوم وكيف تعاملت معها. التسجيل يحوّل الضغط من عدو إلى فرصة للتعلم.",
        category: "psychological",
        duration: 10,
        mandatory: false,
        icon: "📊",
      },
      {
        id: "skill-video",
        time: "٧:٠٠ م",
        title: "مشاهدة محاضرة مهارات",
        description: "شاهد محاضرة قصيرة عن مهارات الوقاية في التطبيق. ٢٠ دقيقة تبني مهارة جديدة.",
        category: "skill",
        duration: 20,
        mandatory: false,
        icon: "🎓",
      },
      {
        id: "evening-review",
        time: "٩:٣٠ م",
        title: "مراجعة المهارات + أذكار المساء",
        description: "راجع مهارة الرفض التي تدربت عليها اليوم + أذكار المساء للتحصين.",
        category: "spiritual",
        duration: 15,
        mandatory: true,
        icon: "🌙",
      },
    ],
    weeklyGoals: [
      { id: "w1", title: "تطبيق مهارة الرفض ٣ مرات", description: "رفض ضغط اجتماعي حقيقي ٣ مرات", metric: "مرات", target: 3, unit: "مرة" },
      { id: "w2", title: "تمرين التنفس يومياً", description: "ممارسة تقنية ٤-٧-٨ كل يوم", metric: "أيام", target: 7, unit: "يوم" },
      { id: "w3", title: "إتمام محاضرة مهارات كاملة", description: "إكمال محاضرة وقائية مع الاختبار", metric: "محاضرات", target: 1, unit: "محاضرة" },
    ],
    warningSignals: [
      "صعوبة في قول 'لا' بشكل حازم",
      "الاستسلام للضغط الاجتماعي",
      "تجنب التدرب على مهارات الرفض",
      "الشعور بأن الرفض سيؤثر على الصداقات",
    ],
    successIndicators: [
      "القدرة على الرفض بثقة وبدون إحراج",
      "تطبيق تقنيات إدارة الضغط يومياً",
      "الشعور بالقوة والسيطرة على القرارات",
      "تحسن في العلاقات الاجتماعية الإيجابية",
    ],
    professionalSupport: [
      "ورشة مهارات الرفض الجماعية",
      "جلسة تدريب مع مرشد وقائي",
      "مجموعة تدريب المهارات في التطبيق",
    ],
    selfCareTools: [
      "بطاقات تذكير مهارات الرفض",
      "تطبيق تتبع التمارين اليومية",
      "مجلة إدارة الضغط الشخصية",
    ],
  },
  {
    id: "environment",
    order: 3,
    title: "مرحلة البيئة",
    subtitle: "بناء بيئة اجتماعية وقائية آمنة",
    duration: "شهر",
    durationDays: 30,
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    icon: "🌿",
    description: "البيئة المحيطة هي أقوى عامل في الوقاية أو الخطر. في هذه المرحلة تعمل على تشكيل بيئتك الاجتماعية بوعي: تعزيز العلاقات الإيجابية، والابتعاد عن البيئات الخطرة.",
    scientificBasis: "تستند إلى نظرية البيئة الاجتماعية (Social Ecology) التي تؤكد أن ٧٠٪ من قرارات الإدمان تتأثر بالبيئة المباشرة.",
    goals: [
      "تحديد وتعزيز العلاقات الإيجابية",
      "الابتعاد التدريجي عن البيئات الخطرة",
      "بناء شبكة دعم اجتماعي قوية",
      "إنشاء بيئة منزلية وعملية آمنة",
    ],
    dailySchedule: [
      {
        id: "morning-plan",
        time: "٦:٣٠ ص",
        title: "تخطيط اليوم الوقائي",
        description: "خطط ليومك: من ستلتقي؟ أين ستذهب؟ هل هناك مواقف خطرة؟ كيف ستتعامل معها؟",
        category: "awareness",
        duration: 10,
        mandatory: true,
        icon: "📅",
      },
      {
        id: "positive-contact",
        time: "٩:٠٠ ص",
        title: "تواصل مع شخص إيجابي",
        description: "تواصل يومياً مع شخص يدعمك ويشاركك قيمك. العلاقات الإيجابية تبني حصناً واقياً.",
        category: "social",
        duration: 15,
        mandatory: true,
        icon: "📞",
      },
      {
        id: "hobby-time",
        time: "٤:٠٠ م",
        title: "هواية أو نشاط بناء",
        description: "خصص وقتاً لهواية تحبها: رياضة، قراءة، رسم، موسيقى. الهوايات تملأ الفراغ الذي يستغله الإدمان.",
        category: "physical",
        duration: 60,
        mandatory: false,
        icon: "🎨",
      },
      {
        id: "environment-audit",
        time: "٧:٠٠ م",
        title: "مراجعة البيئة الاجتماعية",
        description: "راجع أسبوعياً: من أمضيت معه وقتاً؟ هل أثّر عليك إيجاباً أم سلباً؟ هل تحتاج لتعديل؟",
        category: "social",
        duration: 15,
        mandatory: false,
        icon: "🗺️",
      },
      {
        id: "community-activity",
        time: "٨:٠٠ م",
        title: "نشاط مجتمعي أو تطوعي",
        description: "المشاركة في أنشطة مجتمعية إيجابية تبني هوية قوية وتقلل الشعور بالفراغ.",
        category: "social",
        duration: 60,
        mandatory: false,
        icon: "🤝",
      },
      {
        id: "gratitude-dhikr",
        time: "٩:٣٠ م",
        title: "الشكر والأذكار",
        description: "اكتب ٣ أشياء تشكر الله عليها اليوم + أذكار المساء. الامتنان يبني نظرة إيجابية للحياة.",
        category: "spiritual",
        duration: 15,
        mandatory: true,
        icon: "🌙",
      },
    ],
    weeklyGoals: [
      { id: "w1", title: "تجنب بيئة خطرة واحدة", description: "ابتعد عن موقف أو شخص يشكّل خطراً", metric: "مرات", target: 1, unit: "مرة" },
      { id: "w2", title: "تعزيز ٣ علاقات إيجابية", description: "قضِ وقتاً نوعياً مع ٣ أشخاص داعمين", metric: "علاقات", target: 3, unit: "علاقة" },
      { id: "w3", title: "المشاركة في نشاط مجتمعي", description: "شارك في فعالية أو نشاط مجتمعي إيجابي", metric: "أنشطة", target: 1, unit: "نشاط" },
    ],
    warningSignals: [
      "قضاء وقت أكثر مع أصدقاء سلبيين",
      "تجنب الأنشطة الاجتماعية الإيجابية",
      "الشعور بالوحدة والعزلة",
      "الذهاب لأماكن تعرف أنها خطرة",
    ],
    successIndicators: [
      "شبكة دعم اجتماعي قوية ومتنوعة",
      "الشعور بالانتماء لمجتمع إيجابي",
      "تجنب البيئات الخطرة بشكل طبيعي",
      "الهويات الإيجابية (رياضي، متطوع، طالب متميز)",
    ],
    professionalSupport: [
      "ورشة بناء العلاقات الصحية",
      "مجموعة دعم اجتماعي في التطبيق",
      "استشارة مع متخصص في الوقاية",
    ],
    selfCareTools: [
      "خريطة العلاقات الاجتماعية",
      "قائمة الأنشطة الإيجابية المفضلة",
      "دليل تجنب البيئات الخطرة",
    ],
  },
  {
    id: "maintain",
    order: 4,
    title: "مرحلة الثبات",
    subtitle: "الحفاظ على الحصانة الوقائية مدى الحياة",
    duration: "مستمر",
    durationDays: 365,
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981, #3B82F6)",
    icon: "🏆",
    description: "الوقاية ليست حدثاً واحداً بل أسلوب حياة. في هذه المرحلة تُرسّخ العادات الوقائية وتصبح جزءاً من هويتك، وتبدأ بمشاركة وعيك مع الآخرين.",
    scientificBasis: "تستند إلى نموذج الوقاية المستدامة (Sustainable Prevention) الذي يؤكد أن الوقاية الفعّالة تتحول إلى هوية وليس مجرد سلوك.",
    goals: [
      "ترسيخ العادات الوقائية كأسلوب حياة",
      "مشاركة الوعي مع الأسرة والأصدقاء",
      "أن تصبح سفيراً للوقاية في مجتمعك",
      "الاستمرار في التطوير الذاتي",
    ],
    dailySchedule: [
      {
        id: "morning-routine",
        time: "٦:٣٠ ص",
        title: "الروتين الصباحي الوقائي",
        description: "أذكار الصباح + تأكيدات إيجابية + تخطيط اليوم. هذا الروتين أصبح جزءاً من هويتك.",
        category: "spiritual",
        duration: 20,
        mandatory: true,
        icon: "☀️",
      },
      {
        id: "awareness-share",
        time: "١٠:٠٠ ص",
        title: "مشاركة معلومة وقائية",
        description: "شارك معلومة توعوية يومية مع شخص في حياتك أو على مجتمع التطبيق. التعليم يُرسّخ المعرفة.",
        category: "social",
        duration: 5,
        mandatory: false,
        icon: "💡",
      },
      {
        id: "daily-exercise",
        time: "٥:٠٠ م",
        title: "رياضة يومية",
        description: "٣٠-٤٥ دقيقة رياضة. الرياضة المنتظمة هي أقوى وقاية طبيعية — تُفرز الدوبامين بشكل صحي.",
        category: "physical",
        duration: 45,
        mandatory: false,
        icon: "🏋️",
      },
      {
        id: "weekly-lecture",
        time: "٨:٠٠ م",
        title: "محاضرة أسبوعية",
        description: "حضور محاضرة توعوية أسبوعياً للبقاء محدثاً ومتعلماً. الوقاية تحتاج تجديداً مستمراً.",
        category: "awareness",
        duration: 30,
        mandatory: false,
        icon: "🎓",
      },
      {
        id: "evening-reflection",
        time: "٩:٣٠ م",
        title: "تأمل مسائي + أذكار",
        description: "راجع يومك: ما الذي فعلته للوقاية اليوم؟ ما الذي يمكن تحسينه؟ + أذكار المساء.",
        category: "spiritual",
        duration: 15,
        mandatory: true,
        icon: "🌙",
      },
    ],
    weeklyGoals: [
      { id: "w1", title: "مشاركة وعي مع ٣ أشخاص", description: "علّم ٣ أشخاص معلومة وقائية", metric: "أشخاص", target: 3, unit: "شخص" },
      { id: "w2", title: "حضور محاضرة توعوية", description: "حضور محاضرة كاملة مع الاختبار", metric: "محاضرات", target: 1, unit: "محاضرة" },
      { id: "w3", title: "نشاط تطوعي توعوي", description: "المشاركة في فعالية توعوية", metric: "أنشطة", target: 1, unit: "نشاط" },
    ],
    warningSignals: [
      "التوقف عن الروتين الوقائي اليومي",
      "الابتعاد عن المجتمع الإيجابي",
      "الشعور بأن الوقاية لم تعد ضرورية",
      "العودة لبيئات أو أصدقاء سلبيين",
    ],
    successIndicators: [
      "الوقاية أصبحت جزءاً طبيعياً من حياتك",
      "تعليم الآخرين مهارات الوقاية",
      "الشعور بالفخر والهوية الإيجابية",
      "التأثير الإيجابي على من حولك",
    ],
    professionalSupport: [
      "التطوع في برامج التوعية",
      "الانضمام لفريق الوقاية في المجتمع",
      "مشاركة قصتك الوقائية لإلهام الآخرين",
    ],
    selfCareTools: [
      "مجلة الوقاية الشخصية المستمرة",
      "شبكة الدعم الاجتماعي المتنوعة",
      "خطة التطوع والمشاركة المجتمعية",
    ],
  },
];

export const motivationalQuotes = [
  { text: "الوقاية خير من العلاج — والوعي أقوى سلاح", author: "حكمة طبية" },
  { text: "من عرف نفسه حمى نفسه — الوعي الذاتي هو درعك الواقي", author: "مبدأ وقائي" },
  { text: "قوة الإرادة عضلة — كلما تدربت عليها كلما قويت", author: "علم النفس" },
  { text: "بيئتك تصنعك — اختر محيطك بحكمة وعناية", author: "نظرية اجتماعية" },
  { text: "صون — ويحفظك ويقيك من كل شر", author: "دعاء" },
  { text: "كل يوم تختار الوقاية هو انتصار يستحق الاحتفال", author: "برنامج صون" },
  { text: "لا تنتظر الخطر ليقترب — ابنِ حصنك قبل أن تحتاجه", author: "استراتيجية وقائية" },
  { text: "الشاب الواعي يحمي نفسه وأسرته ومجتمعه", author: "رؤية اجتماعية" },
];

export const addictionTypes = [
  { id: "drugs", label: "المخدرات", icon: "💊", color: "#EF4444" },
  { id: "smoking", label: "التدخين", icon: "🚬", color: "#F59E0B" },
  { id: "digital", label: "الإدمان الرقمي", icon: "📱", color: "#8B5CF6" },
  { id: "gambling", label: "القمار", icon: "🎰", color: "#EC4899" },
  { id: "other", label: "أخرى", icon: "⚠️", color: "#6B7280" },
];
