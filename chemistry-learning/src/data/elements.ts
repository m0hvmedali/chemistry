export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  nameAr: string;
  atomicMass: number;
  category: string;
  period: number;
  group: number;
  block: string;
  color: string;
  electronicConfiguration: string;
  oxidationStates: string[];
  meltingPoint?: number;
  boilingPoint?: number;
  density?: number;
  description: string;
  uses: string;
  reactions: string;
  inCurriculum: boolean;
  curriculumInfo?: string;
}

export const PERIODIC_TABLE_ELEMENTS: Element[] = [
  // الدورة الأولى
  {
    atomicNumber: 1,
    symbol: 'H',
    name: 'Hydrogen',
    nameAr: 'هيدروجين',
    atomicMass: 1.008,
    category: 'nonmetal',
    period: 1,
    group: 1,
    block: 's',
    color: '#ff6b6b',
    electronicConfiguration: '1s¹',
    oxidationStates: ['-1', '+1'],
    meltingPoint: -259.16,
    boilingPoint: -252.87,
    density: 0.00009,
    description: 'أخف العناصر الكيميائية وأكثرها انتشاراً في الكون',
    uses: 'صناعة الأمونيا، البتروكيماويات، والطاقة النظيفة',
    reactions: 'يتفاعل مع الأكسجين لتكوين الماء، مع النيتروجين لتكوين الأمونيا',
    inCurriculum: true,
    curriculumInfo: 'أساس الكيمياء العضوية، يدخل في تكوين جميع المركبات العضوية مع الكربون'
  },
  {
    atomicNumber: 2,
    symbol: 'He',
    name: 'Helium',
    nameAr: 'هيليوم',
    atomicMass: 4.003,
    category: 'noble-gas',
    period: 1,
    group: 18,
    block: 'p',
    color: '#4ecdc4',
    electronicConfiguration: '1s²',
    oxidationStates: ['0'],
    meltingPoint: -272.2,
    boilingPoint: -268.93,
    density: 0.0001785,
    description: 'غاز نبيل خامل كيميائياً',
    uses: 'المناطيد، التبريد فائق التبريد، وحماية الأجواء في اللحام',
    reactions: 'لا يتفاعل كيميائياً في الظروف العادية',
    inCurriculum: false
  },
  
  // الدورة الثانية
  {
    atomicNumber: 3,
    symbol: 'Li',
    name: 'Lithium',
    nameAr: 'ليثيوم',
    atomicMass: 6.94,
    category: 'alkali-metal',
    period: 2,
    group: 1,
    block: 's',
    color: '#45b7d1',
    electronicConfiguration: '[He] 2s¹',
    oxidationStates: ['+1'],
    meltingPoint: 180.5,
    boilingPoint: 1342,
    density: 0.534,
    description: 'أخف الفلزات الصلبة',
    uses: 'بطاريات الليثيوم، السبائك، الطب النفسي',
    reactions: 'يتفاعل بشدة مع الماء لإنتاج هيدروجين',
    inCurriculum: false
  },
  {
    atomicNumber: 4,
    symbol: 'Be',
    name: 'Beryllium',
    nameAr: 'بيريليوم',
    atomicMass: 9.012,
    category: 'alkaline-earth-metal',
    period: 2,
    group: 2,
    block: 's',
    color: '#fd79a8',
    electronicConfiguration: '[He] 2s²',
    oxidationStates: ['+2'],
    meltingPoint: 1287,
    boilingPoint: 2470,
    density: 1.85,
    description: 'فلز خفيف قوي ومقاوم للتآكل',
    uses: 'الطائرات، الصواريخ، الأدوات النووية',
    reactions: 'مقاوم للتآكل بفضل طبقة أكسيد رقيقة',
    inCurriculum: false
  },
  {
    atomicNumber: 5,
    symbol: 'B',
    name: 'Boron',
    nameAr: 'بورون',
    atomicMass: 10.81,
    category: 'metalloid',
    period: 2,
    group: 13,
    block: 'p',
    color: '#6c5ce7',
    electronicConfiguration: '[He] 2s² 2p¹',
    oxidationStates: ['+3'],
    meltingPoint: 2077,
    boilingPoint: 4000,
    density: 2.34,
    description: 'شبه فلز صلب جداً',
    uses: 'السيراميك، المنظفات، الزجاج المقاوم للحرارة',
    reactions: 'يكون مركبات تساهمية مستقرة',
    inCurriculum: false
  },
  {
    atomicNumber: 6,
    symbol: 'C',
    name: 'Carbon',
    nameAr: 'كربون',
    atomicMass: 12.01,
    category: 'nonmetal',
    period: 2,
    group: 14,
    block: 'p',
    color: '#2d3436',
    electronicConfiguration: '[He] 2s² 2p²',
    oxidationStates: ['-4', '+2', '+4'],
    meltingPoint: 3825,
    boilingPoint: 4827,
    density: 2.267,
    description: 'أساس جميع أشكال الحياة على الأرض',
    uses: 'الفولاذ، البلاستيك، الوقود، والألماس',
    reactions: 'يكون أربع روابط تساهمية، أساس الكيمياء العضوية',
    inCurriculum: true,
    curriculumInfo: 'أساس الكيمياء العضوية، يكون مركبات مع الهيدروجين في الكحوليات والهيدروكربونات'
  },
  {
    atomicNumber: 7,
    symbol: 'N',
    name: 'Nitrogen',
    nameAr: 'نيتروجين',
    atomicMass: 14.01,
    category: 'nonmetal',
    period: 2,
    group: 15,
    block: 'p',
    color: '#74b9ff',
    electronicConfiguration: '[He] 2s² 2p³',
    oxidationStates: ['-3', '+1', '+2', '+3', '+4', '+5'],
    meltingPoint: -210.0,
    boilingPoint: -195.79,
    density: 0.0012506,
    description: 'يشكل 78% من الغلاف الجوي',
    uses: 'الأسمدة، المتفجرات، حفظ الطعام',
    reactions: 'يكون النشادر مع الهيدروجين، حالة أكسدة -3 في NH₃',
    inCurriculum: true,
    curriculumInfo: 'يظهر في الأمينات والأحماض الأمينية، حالة أكسدة -3 في النشادر NH₃'
  },
  {
    atomicNumber: 8,
    symbol: 'O',
    name: 'Oxygen',
    nameAr: 'أكسجين',
    atomicMass: 16.00,
    category: 'nonmetal',
    period: 2,
    group: 16,
    block: 'p',
    color: '#e74c3c',
    electronicConfiguration: '[He] 2s² 2p⁴',
    oxidationStates: ['-2', '-1', '+2'],
    meltingPoint: -218.79,
    boilingPoint: -182.96,
    density: 0.001429,
    description: 'ضروري للتنفس والاحتراق',
    uses: 'التنفس، اللحام، الطب، معالجة المياه',
    reactions: 'داعم للاحتراق، يكون أكاسيد مع معظم العناصر',
    inCurriculum: true,
    curriculumInfo: 'داعم للاحتراق، يُكشف بإعادة إشعال شظية موقدة، حالة أكسدة -2 في أغلب المركبات'
  },
  {
    atomicNumber: 9,
    symbol: 'F',
    name: 'Fluorine',
    nameAr: 'فلور',
    atomicMass: 19.00,
    category: 'halogen',
    period: 2,
    group: 17,
    block: 'p',
    color: '#55a3ff',
    electronicConfiguration: '[He] 2s² 2p⁵',
    oxidationStates: ['-1'],
    meltingPoint: -219.67,
    boilingPoint: -188.11,
    density: 0.001696,
    description: 'أكثر العناصر فعالية كيميائياً',
    uses: 'معجون الأسنان، التفلون، المبردات',
    reactions: 'يزيح جميع الهالوجينات الأخرى من أملاحها',
    inCurriculum: true,
    curriculumInfo: 'أكثر الهالوجينات فعالية، يزيح اليود من KI لإنتاج راسب أسود، غاز أصفر باهت سام'
  },
  {
    atomicNumber: 10,
    symbol: 'Ne',
    name: 'Neon',
    nameAr: 'نيون',
    atomicMass: 20.18,
    category: 'noble-gas',
    period: 2,
    group: 18,
    block: 'p',
    color: '#4ecdc4',
    electronicConfiguration: '[He] 2s² 2p⁶',
    oxidationStates: ['0'],
    meltingPoint: -248.59,
    boilingPoint: -246.08,
    density: 0.0008999,
    description: 'غاز نبيل خامل يعطي ضوءاً أحمر-برتقالي',
    uses: 'الإعلانات المضيئة، الليزر، التبريد',
    reactions: 'لا يكون مركبات مستقرة',
    inCurriculum: false
  },

  // الدورة الثالثة
  {
    atomicNumber: 11,
    symbol: 'Na',
    name: 'Sodium',
    nameAr: 'صوديوم',
    atomicMass: 22.99,
    category: 'alkali-metal',
    period: 3,
    group: 1,
    block: 's',
    color: '#a29bfe',
    electronicConfiguration: '[Ne] 3s¹',
    oxidationStates: ['+1'],
    meltingPoint: 97.79,
    boilingPoint: 883,
    density: 0.971,
    description: 'فلز طري يتفاعل بشدة مع الماء',
    uses: 'ملح الطعام، الصابون، مصابيح الصوديوم',
    reactions: 'يتفاعل بعنف مع الماء لإنتاج هيدروجين وهيدروكسيد الصوديوم',
    inCurriculum: false
  },
  {
    atomicNumber: 12,
    symbol: 'Mg',
    name: 'Magnesium',
    nameAr: 'ماغنسيوم',
    atomicMass: 24.31,
    category: 'alkaline-earth-metal',
    period: 3,
    group: 2,
    block: 's',
    color: '#fd79a8',
    electronicConfiguration: '[Ne] 3s²',
    oxidationStates: ['+2'],
    meltingPoint: 650,
    boilingPoint: 1090,
    density: 1.738,
    description: 'فلز خفيف فضي اللون',
    uses: 'السبائك، الألعاب النارية، المكملات الغذائية',
    reactions: 'يحترق بلهب أبيض ساطع في الهواء',
    inCurriculum: false
  },
  {
    atomicNumber: 13,
    symbol: 'Al',
    name: 'Aluminum',
    nameAr: 'ألومنيوم',
    atomicMass: 26.98,
    category: 'post-transition-metal',
    period: 3,
    group: 13,
    block: 'p',
    color: '#fdcb6e',
    electronicConfiguration: '[Ne] 3s² 3p¹',
    oxidationStates: ['+3'],
    meltingPoint: 660.32,
    boilingPoint: 2519,
    density: 2.70,
    description: 'أكثر الفلزات وفرة في القشرة الأرضية',
    uses: 'الطائرات، العبوات، البناء، الأسلاك',
    reactions: 'مقاوم للصدأ بسبب طبقة أكسيد Al₂O₃ الرقيقة',
    inCurriculum: true,
    curriculumInfo: 'أكثر الفلزات وفرة في القشرة الأرضية (>8%)، كثافة منخفضة ومقاوم للصدأ، حالة أكسدة +3'
  },
  {
    atomicNumber: 14,
    symbol: 'Si',
    name: 'Silicon',
    nameAr: 'سيليكون',
    atomicMass: 28.09,
    category: 'metalloid',
    period: 3,
    group: 14,
    block: 'p',
    color: '#6c5ce7',
    electronicConfiguration: '[Ne] 3s² 3p²',
    oxidationStates: ['-4', '+4'],
    meltingPoint: 1414,
    boilingPoint: 3265,
    density: 2.3296,
    description: 'شبه فلز، ثاني أكثر العناصر وفرة في القشرة الأرضية',
    uses: 'أشباه الموصلات، الزجاج، الخرسانة',
    reactions: 'يكون السيليكات مع الأكسجين',
    inCurriculum: false
  },
  {
    atomicNumber: 15,
    symbol: 'P',
    name: 'Phosphorus',
    nameAr: 'فوسفور',
    atomicMass: 30.97,
    category: 'nonmetal',
    period: 3,
    group: 15,
    block: 'p',
    color: '#fd79a8',
    electronicConfiguration: '[Ne] 3s² 3p³',
    oxidationStates: ['-3', '+3', '+5'],
    meltingPoint: 44.15,
    boilingPoint: 280.5,
    density: 1.823,
    description: 'عنصر ضروري للحياة، موجود في DNA و ATP',
    uses: 'الأسمدة، المنظفات، الكبريت الأحمر',
    reactions: 'يحترق في الهواء ليكون P₄O₁₀',
    inCurriculum: false
  },
  {
    atomicNumber: 16,
    symbol: 'S',
    name: 'Sulfur',
    nameAr: 'كبريت',
    atomicMass: 32.07,
    category: 'nonmetal',
    period: 3,
    group: 16,
    block: 'p',
    color: '#fdcb6e',
    electronicConfiguration: '[Ne] 3s² 3p⁴',
    oxidationStates: ['-2', '+4', '+6'],
    meltingPoint: 115.21,
    boilingPoint: 444.61,
    density: 2.067,
    description: 'عنصر أصفر اللون معروف منذ القدم',
    uses: 'حمض الكبريتيك، المطاط، الأسمدة',
    reactions: 'يكون حمض الكبريتيك H₂SO₄ القوي',
    inCurriculum: false
  },
  {
    atomicNumber: 17,
    symbol: 'Cl',
    name: 'Chlorine',
    nameAr: 'كلور',
    atomicMass: 35.45,
    category: 'halogen',
    period: 3,
    group: 17,
    block: 'p',
    color: '#55a3ff',
    electronicConfiguration: '[Ne] 3s² 3p⁵',
    oxidationStates: ['-1', '+1', '+3', '+5', '+7'],
    meltingPoint: -101.5,
    boilingPoint: -34.04,
    density: 0.003214,
    description: 'غاز أخضر سام يستخدم في التطهير',
    uses: 'تطهير المياه، البلاستيك، المبيضات',
    reactions: 'يكون أملاح الكلوريد مع الفلزات، جزيء ثنائي Cl₂',
    inCurriculum: true,
    curriculumInfo: 'من الهالوجينات، يوجد كجزيء ثنائي Cl₂، يستخدم مطهراً للتعقيم، حالة أكسدة -1 في الأملاح'
  },
  {
    atomicNumber: 18,
    symbol: 'Ar',
    name: 'Argon',
    nameAr: 'أرجون',
    atomicMass: 39.95,
    category: 'noble-gas',
    period: 3,
    group: 18,
    block: 'p',
    color: '#4ecdc4',
    electronicConfiguration: '[Ne] 3s² 3p⁶',
    oxidationStates: ['0'],
    meltingPoint: -189.35,
    boilingPoint: -185.85,
    density: 0.0017837,
    description: 'غاز نبيل عديم اللون والرائحة',
    uses: 'اللحام، المصابيح، حماية الأجواء الخاملة',
    reactions: 'خامل كيميائياً',
    inCurriculum: false
  },

  // الدورة الرابعة
  {
    atomicNumber: 19,
    symbol: 'K',
    name: 'Potassium',
    nameAr: 'بوتاسيوم',
    atomicMass: 39.10,
    category: 'alkali-metal',
    period: 4,
    group: 1,
    block: 's',
    color: '#ff7675',
    electronicConfiguration: '[Ar] 4s¹',
    oxidationStates: ['+1'],
    meltingPoint: 63.5,
    boilingPoint: 759,
    density: 0.89,
    description: 'فلز طري فضي اللون',
    uses: 'الأسمدة، الطب، المتفجرات',
    reactions: 'يتفاعل بعنف مع الماء أكثر من الصوديوم',
    inCurriculum: false
  },
  {
    atomicNumber: 20,
    symbol: 'Ca',
    name: 'Calcium',
    nameAr: 'كالسيوم',
    atomicMass: 40.08,
    category: 'alkaline-earth-metal',
    period: 4,
    group: 2,
    block: 's',
    color: '#fd79a8',
    electronicConfiguration: '[Ar] 4s²',
    oxidationStates: ['+2'],
    meltingPoint: 842,
    boilingPoint: 1484,
    density: 1.54,
    description: 'فلز فضي اللون ضروري للعظام والأسنان',
    uses: 'الأسمنت، الجبس، المكملات الغذائية',
    reactions: 'يكون كربونات الكالسيوم CaCO₃ مع CO₂',
    inCurriculum: true,
    curriculumInfo: 'من المجموعة الثانية، يكون كربونات الكالسيوم (جبس)، حالة أكسدة +2، يستخدم في الأسمنت والجبس'
  },
  {
    atomicNumber: 21,
    symbol: 'Sc',
    name: 'Scandium',
    nameAr: 'سكانديوم',
    atomicMass: 44.96,
    category: 'transition-metal',
    period: 4,
    group: 3,
    block: 'd',
    color: '#636e72',
    electronicConfiguration: '[Ar] 3d¹ 4s²',
    oxidationStates: ['+3'],
    meltingPoint: 1541,
    boilingPoint: 2836,
    density: 2.985,
    description: 'فلز انتقالي خفيف ونادر',
    uses: 'السبائك الخفيفة، أضواء عالية الكثافة',
    reactions: 'يتأكسد ببطء في الهواء',
    inCurriculum: false
  },
  {
    atomicNumber: 22,
    symbol: 'Ti',
    name: 'Titanium',
    nameAr: 'تيتانيوم',
    atomicMass: 47.87,
    category: 'transition-metal',
    period: 4,
    group: 4,
    block: 'd',
    color: '#636e72',
    electronicConfiguration: '[Ar] 3d² 4s²',
    oxidationStates: ['+2', '+3', '+4'],
    meltingPoint: 1668,
    boilingPoint: 3287,
    density: 4.506,
    description: 'فلز انتقالي قوي وخفيف',
    uses: 'الطائرات، الزراعات الطبية، السبائك',
    reactions: 'مقاوم للتآكل، يكون TiO₂ الأبيض',
    inCurriculum: true,
    curriculumInfo: 'من الفلزات الانتقالية الخفيفة، سبائكه خفيفة وقوية مثل الفولاذ، تستخدم في بناء الطائرات، حالة أكسدة شائعة +4'
  },
  {
    atomicNumber: 23,
    symbol: 'V',
    name: 'Vanadium',
    nameAr: 'فاناديوم',
    atomicMass: 50.94,
    category: 'transition-metal',
    period: 4,
    group: 5,
    block: 'd',
    color: '#636e72',
    electronicConfiguration: '[Ar] 3d³ 4s²',
    oxidationStates: ['+2', '+3', '+4', '+5'],
    meltingPoint: 1910,
    boilingPoint: 3407,
    density: 6.11,
    description: 'فلز انتقالي صلب ومقاوم للتآكل',
    uses: 'سبائك الفولاذ، المحفزات، البطاريات',
    reactions: 'يكون مركبات ملونة متعددة',
    inCurriculum: false
  },
  {
    atomicNumber: 24,
    symbol: 'Cr',
    name: 'Chromium',
    nameAr: 'كروم',
    atomicMass: 51.996,
    category: 'transition-metal',
    period: 4,
    group: 6,
    block: 'd',
    color: '#636e72',
    electronicConfiguration: '[Ar] 3d⁵ 4s¹',
    oxidationStates: ['+2', '+3', '+6'],
    meltingPoint: 1907,
    boilingPoint: 2671,
    density: 7.15,
    description: 'فلز صلب لامع مقاوم للتآكل',
    uses: 'الفولاذ المقاوم للصدأ، الطلاء الكرومي',
    reactions: 'يكون CrO₃ أحمر اللون في حالة أكسدة +6',
    inCurriculum: true,
    curriculumInfo: 'يستخدم في الطلاء الكرومي وصناعة الفولاذ المقاوم للصدأ (ستانلس ستيل)، حالة أكسدة +6 في CrO₃ أحمر'
  },
  {
    atomicNumber: 25,
    symbol: 'Mn',
    name: 'Manganese',
    nameAr: 'منجنيز',
    atomicMass: 54.94,
    category: 'transition-metal',
    period: 4,
    group: 7,
    block: 'd',
    color: '#636e72',
    electronicConfiguration: '[Ar] 3d⁵ 4s²',
    oxidationStates: ['+2', '+3', '+4', '+6', '+7'],
    meltingPoint: 1246,
    boilingPoint: 2061,
    density: 7.44,
    description: 'فلز انتقالي هش رمادي-وردي',
    uses: 'إنتاج الفولاذ، البطاريات الجافة، المحفزات',
    reactions: 'يكون مركبات ملونة متنوعة حسب درجة الأكسدة',
    inCurriculum: false
  },
  {
    atomicNumber: 26,
    symbol: 'Fe',
    name: 'Iron',
    nameAr: 'حديد',
    atomicMass: 55.845,
    category: 'transition-metal',
    period: 4,
    group: 8,
    block: 'd',
    color: '#636e72',
    electronicConfiguration: '[Ar] 3d⁶ 4s²',
    oxidationStates: ['+2', '+3'],
    meltingPoint: 1538,
    boilingPoint: 2862,
    density: 7.874,
    description: 'رابع أكثر العناصر وفرة في القشرة الأرضية',
    uses: 'الفولاذ، البناء، المغناطيس',
    reactions: 'أيونات Fe²⁺ خضراء، أيونات Fe³⁺ صفراء',
    inCurriculum: true,
    curriculumInfo: 'من السلسلة الانتقالية الأولى، حالتا تأكسد +2 و+3، أيونات Fe²⁺ خضراء وFe³⁺ صفراء، يستخدم في صناعة الفولاذ'
  },
  {
    atomicNumber: 27,
    symbol: 'Co',
    name: 'Cobalt',
    nameAr: 'كوبالت',
    atomicMass: 58.93,
    category: 'transition-metal',
    period: 4,
    group: 9,
    block: 'd',
    color: '#636e72',
    electronicConfiguration: '[Ar] 3d⁷ 4s²',
    oxidationStates: ['+2', '+3'],
    meltingPoint: 1495,
    boilingPoint: 2927,
    density: 8.86,
    description: 'فلز انتقالي صلب فضي-أزرق',
    uses: 'السبائك، المغناطيس، البطاريات',
    reactions: 'يكون مركبات زرقاء وردية',
    inCurriculum: false
  },
  {
    atomicNumber: 28,
    symbol: 'Ni',
    name: 'Nickel',
    nameAr: 'نيكل',
    atomicMass: 58.693,
    category: 'transition-metal',
    period: 4,
    group: 10,
    block: 'd',
    color: '#636e72',
    electronicConfiguration: '[Ar] 3d⁸ 4s²',
    oxidationStates: ['+2', '+3'],
    meltingPoint: 1455,
    boilingPoint: 2913,
    density: 8.912,
    description: 'فلز قوي مقاوم للتآكل',
    uses: 'الفولاذ الستانلس، العملات، البطاريات',
    reactions: 'محفز في هدرجة الألكاينات',
    inCurriculum: true,
    curriculumInfo: 'فلز قوي يقاوم التأكل، يستخدم في صناعة الفولاذ الستانلس وسبائك العملات، محفز في تفاعلات هدرجة الألكاينات'
  },
  {
    atomicNumber: 29,
    symbol: 'Cu',
    name: 'Copper',
    nameAr: 'نحاس',
    atomicMass: 63.546,
    category: 'transition-metal',
    period: 4,
    group: 11,
    block: 'd',
    color: '#e17055',
    electronicConfiguration: '[Ar] 3d¹⁰ 4s¹',
    oxidationStates: ['+1', '+2'],
    meltingPoint: 1084.62,
    boilingPoint: 2562,
    density: 8.96,
    description: 'فلز محمر اللون ممتاز التوصيل',
    uses: 'الأسلاك الكهربائية، المواسير، العملات',
    reactions: 'أيونات Cu²⁺ زرقاء، يتفاعل مع نترات الفضة',
    inCurriculum: true,
    curriculumInfo: 'فلز غير فعال كيميائياً وقابل للطرق والسحب، أيونات Cu²⁺ زرقاء، يستخدم في مواسير المياه والتمديدات الكهربائية'
  },
  {
    atomicNumber: 30,
    symbol: 'Zn',
    name: 'Zinc',
    nameAr: 'زنك',
    atomicMass: 65.38,
    category: 'transition-metal',
    period: 4,
    group: 12,
    block: 'd',
    color: '#74b9ff',
    electronicConfiguration: '[Ar] 3d¹⁰ 4s²',
    oxidationStates: ['+2'],
    meltingPoint: 419.53,
    boilingPoint: 907,
    density: 7.134,
    description: 'فلز رمادي مزرق',
    uses: 'جلفنة الحديد، البطاريات، السبائك',
    reactions: 'يكون ZnO أبيض عند التسخين',
    inCurriculum: true,
    curriculumInfo: 'فلز رمادي يميل للأزرق، يستخدم في جلفنة (تغطية) الحديد لحمايته من الصدأ، يكون ZnO أبيض عند التسخين'
  },
  {
    atomicNumber: 31,
    symbol: 'Ga',
    name: 'Gallium',
    nameAr: 'جاليوم',
    atomicMass: 69.72,
    category: 'post-transition-metal',
    period: 4,
    group: 13,
    block: 'p',
    color: '#fdcb6e',
    electronicConfiguration: '[Ar] 3d¹⁰ 4s² 4p¹',
    oxidationStates: ['+3'],
    meltingPoint: 29.76,
    boilingPoint: 2204,
    density: 5.91,
    description: 'فلز ينصهر في اليد',
    uses: 'أشباه الموصلات، الليزر، الثرمومترات',
    reactions: 'يكون مركبات مع الزرنيخ للإلكترونيات',
    inCurriculum: false
  },
  {
    atomicNumber: 32,
    symbol: 'Ge',
    name: 'Germanium',
    nameAr: 'جرمانيوم',
    atomicMass: 72.63,
    category: 'metalloid',
    period: 4,
    group: 14,
    block: 'p',
    color: '#6c5ce7',
    electronicConfiguration: '[Ar] 3d¹⁰ 4s² 4p²',
    oxidationStates: ['+2', '+4'],
    meltingPoint: 938.25,
    boilingPoint: 2833,
    density: 5.323,
    description: 'شبه فلز مهم في الإلكترونيات',
    uses: 'أشباه الموصلات، البصريات، المحفزات',
    reactions: 'مقاوم للأحماض باستثناء الماء الملكي',
    inCurriculum: false
  },
  {
    atomicNumber: 33,
    symbol: 'As',
    name: 'Arsenic',
    nameAr: 'زرنيخ',
    atomicMass: 74.92,
    category: 'metalloid',
    period: 4,
    group: 15,
    block: 'p',
    color: '#6c5ce7',
    electronicConfiguration: '[Ar] 3d¹⁰ 4s² 4p³',
    oxidationStates: ['-3', '+3', '+5'],
    meltingPoint: 817,
    boilingPoint: 614,
    density: 5.776,
    description: 'شبه فلز سام معروف تاريخياً',
    uses: 'المبيدات، السبائك، أشباه الموصلات',
    reactions: 'يكون مركبات سامة عديدة',
    inCurriculum: false
  },
  {
    atomicNumber: 34,
    symbol: 'Se',
    name: 'Selenium',
    nameAr: 'سيلنيوم',
    atomicMass: 78.97,
    category: 'nonmetal',
    period: 4,
    group: 16,
    block: 'p',
    color: '#fd79a8',
    electronicConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁴',
    oxidationStates: ['-2', '+4', '+6'],
    meltingPoint: 221,
    boilingPoint: 685,
    density: 4.809,
    description: 'لا فلز ضروري بكميات قليلة للحياة',
    uses: 'المكملات الغذائية، الخلايا الضوئية، الزجاج',
    reactions: 'خصائص مشابهة للكبريت',
    inCurriculum: false
  },
  {
    atomicNumber: 35,
    symbol: 'Br',
    name: 'Bromine',
    nameAr: 'بروم',
    atomicMass: 79.90,
    category: 'halogen',
    period: 4,
    group: 17,
    block: 'p',
    color: '#55a3ff',
    electronicConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁵',
    oxidationStates: ['-1', '+1', '+3', '+5', '+7'],
    meltingPoint: -7.2,
    boilingPoint: 58.8,
    density: 3.1028,
    description: 'الهالوجين الوحيد السائل في الظروف العادية',
    uses: 'المبيدات، المطهرات، مثبطات اللهب',
    reactions: 'سائل بني-أحمر، يكون أملاح البروميد',
    inCurriculum: true,
    curriculumInfo: 'من الهالوجينات، سائل بني-أحمر في الظروف القياسية، جزيء ثنائي Br₂'
  },
  {
    atomicNumber: 36,
    symbol: 'Kr',
    name: 'Krypton',
    nameAr: 'كريبتون',
    atomicMass: 83.80,
    category: 'noble-gas',
    period: 4,
    group: 18,
    block: 'p',
    color: '#4ecdc4',
    electronicConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁶',
    oxidationStates: ['0'],
    meltingPoint: -157.36,
    boilingPoint: -153.22,
    density: 0.003733,
    description: 'غاز نبيل عديم اللون والرائحة',
    uses: 'المصابيح عالية الكثافة، الليزر، النوافذ العازلة',
    reactions: 'خامل كيميائياً إلا في ظروف خاصة',
    inCurriculum: false
  },

  // الدورة الخامسة
  {
    atomicNumber: 47,
    symbol: 'Ag',
    name: 'Silver',
    nameAr: 'فضة',
    atomicMass: 107.87,
    category: 'transition-metal',
    period: 5,
    group: 11,
    block: 'd',
    color: '#ddd',
    electronicConfiguration: '[Kr] 4d¹⁰ 5s¹',
    oxidationStates: ['+1'],
    meltingPoint: 961.78,
    boilingPoint: 2162,
    density: 10.501,
    description: 'أفضل الفلزات توصيلاً للكهرباء والحرارة',
    uses: 'المجوهرات، العملات، الإلكترونيات',
    reactions: 'نترات الفضة غير مستقرة حرارياً',
    inCurriculum: true,
    curriculumInfo: 'نترات الفضة مركب غير مستقر حرارياً، تتحلل بالتسخين إلى فضة معدنية وأكاسيد النيتروجين، تدخل في تفاعلات الإزاحة'
  },
  {
    atomicNumber: 53,
    symbol: 'I',
    name: 'Iodine',
    nameAr: 'يود',
    atomicMass: 126.90,
    category: 'halogen',
    period: 5,
    group: 17,
    block: 'p',
    color: '#6c5ce7',
    electronicConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁵',
    oxidationStates: ['-1', '+1', '+3', '+5', '+7'],
    meltingPoint: 113.7,
    boilingPoint: 184.3,
    density: 4.933,
    description: 'الهالوجين الوحيد الصلب في الظروف العادية',
    uses: 'المطهرات، الطب، التصوير',
    reactions: 'صلب بنفسجي، يكون راسب أسود عند الإزاحة',
    inCurriculum: true,
    curriculumInfo: 'من الهالوجينات، صلب بنفسجي في الظروف القياسية، يكون راسب أسود عند تفاعل الفلور مع KI'
  },

  // الدورة السادسة
  {
    atomicNumber: 74,
    symbol: 'W',
    name: 'Tungsten',
    nameAr: 'تنجستن',
    atomicMass: 183.84,
    category: 'transition-metal',
    period: 6,
    group: 6,
    block: 'd',
    color: '#636e72',
    electronicConfiguration: '[Xe] 4f¹⁴ 5d⁴ 6s²',
    oxidationStates: ['+2', '+3', '+4', '+5', '+6'],
    meltingPoint: 3695,
    boilingPoint: 5828,
    density: 19.25,
    description: 'أعلى نقطة انصهار بين جميع العناصر',
    uses: 'خيوط المصابيح، أقطاب اللحام، السبائك',
    reactions: 'حالة أكسدة شائعة +6 في WO₃ الأصفر',
    inCurriculum: true,
    curriculumInfo: 'له أعلى نقطة انصهار بين الفلزات (أكثر من 3400°C)، يستخدم في خيوط المصابيح وأقطاب اللحام، حالة أكسدة +6'
  },
  {
    atomicNumber: 79,
    symbol: 'Au',
    name: 'Gold',
    nameAr: 'ذهب',
    atomicMass: 196.97,
    category: 'transition-metal',
    period: 6,
    group: 11,
    block: 'd',
    color: '#f39c12',
    electronicConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
    oxidationStates: ['+1', '+3'],
    meltingPoint: 1064.18,
    boilingPoint: 2856,
    density: 19.282,
    description: 'فلز نبيل مقاوم للتآكل والأكسدة',
    uses: 'المجوهرات، الإلكترونيات، الطب',
    reactions: 'مقاوم للأحماض عدا الماء الملكي',
    inCurriculum: false
  },
  {
    atomicNumber: 80,
    symbol: 'Hg',
    name: 'Mercury',
    nameAr: 'زئبق',
    atomicMass: 200.59,
    category: 'transition-metal',
    period: 6,
    group: 12,
    block: 'd',
    color: '#636e72',
    electronicConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s²',
    oxidationStates: ['+1', '+2'],
    meltingPoint: -38.83,
    boilingPoint: 356.73,
    density: 13.5336,
    description: 'الفلز الوحيد السائل في الظروف العادية',
    uses: 'الثرمومترات، المصابيح، الخلايا الكهروكيميائية',
    reactions: 'يكون HgO أصفر في حالة أكسدة +2',
    inCurriculum: true,
    curriculumInfo: 'الفلز الوحيد السائل عند الظروف القياسية (نقطة انصهار −38.9°C)، يستخدم في الخلايا الكهروكيميائية والمصابيح'
  },
  {
    atomicNumber: 82,
    symbol: 'Pb',
    name: 'Lead',
    nameAr: 'رصاص',
    atomicMass: 207.2,
    category: 'post-transition-metal',
    period: 6,
    group: 14,
    block: 'p',
    color: '#636e72',
    electronicConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²',
    oxidationStates: ['+2', '+4'],
    meltingPoint: 327.46,
    boilingPoint: 1749,
    density: 11.342,
    description: 'فلز ثقيل طري سام',
    uses: 'البطاريات، الحماية من الإشعاع، السبائك',
    reactions: 'كربونات الرصاص PbCO₃ غير مستقرة بالحرارة',
    inCurriculum: true,
    curriculumInfo: 'كربونات الرصاص PbCO₃ مركب غير مستقر بالحرارة، تتحلل إلى PbO وCO₂، يستخدم في بطاريات الرصاص الحمضية'
  }
];

// بقية العناصر المتبقية (مبسطة)
const REMAINING_ELEMENTS = [
  // الدورة الرابعة المتبقية
  { atomicNumber: 37, symbol: 'Rb', name: 'Rubidium', nameAr: 'روبيديوم', category: 'alkali-metal', period: 4, group: 1, color: '#ff7675' },
  { atomicNumber: 38, symbol: 'Sr', name: 'Strontium', nameAr: 'سترونشيوم', category: 'alkaline-earth-metal', period: 4, group: 2, color: '#fd79a8' },
  { atomicNumber: 39, symbol: 'Y', name: 'Yttrium', nameAr: 'إتريوم', category: 'transition-metal', period: 4, group: 3, color: '#636e72' },
  { atomicNumber: 40, symbol: 'Zr', name: 'Zirconium', nameAr: 'زركونيوم', category: 'transition-metal', period: 4, group: 4, color: '#636e72' },
  { atomicNumber: 41, symbol: 'Nb', name: 'Niobium', nameAr: 'نيوبيوم', category: 'transition-metal', period: 4, group: 5, color: '#636e72' },
  { atomicNumber: 42, symbol: 'Mo', name: 'Molybdenum', nameAr: 'موليبدنوم', category: 'transition-metal', period: 4, group: 6, color: '#636e72' },
  { atomicNumber: 43, symbol: 'Tc', name: 'Technetium', nameAr: 'تكنيشيوم', category: 'transition-metal', period: 4, group: 7, color: '#636e72' },
  { atomicNumber: 44, symbol: 'Ru', name: 'Ruthenium', nameAr: 'روثينيوم', category: 'transition-metal', period: 4, group: 8, color: '#636e72' },
  { atomicNumber: 45, symbol: 'Rh', name: 'Rhodium', nameAr: 'روديوم', category: 'transition-metal', period: 4, group: 9, color: '#636e72' },
  { atomicNumber: 46, symbol: 'Pd', name: 'Palladium', nameAr: 'بالاديوم', category: 'transition-metal', period: 4, group: 10, color: '#636e72' },
  
  // الدورة الخامسة المتبقية
  { atomicNumber: 48, symbol: 'Cd', name: 'Cadmium', nameAr: 'كادميوم', category: 'transition-metal', period: 5, group: 12, color: '#636e72' },
  { atomicNumber: 49, symbol: 'In', name: 'Indium', nameAr: 'إنديوم', category: 'post-transition-metal', period: 5, group: 13, color: '#fdcb6e' },
  { atomicNumber: 50, symbol: 'Sn', name: 'Tin', nameAr: 'قصدير', category: 'post-transition-metal', period: 5, group: 14, color: '#fdcb6e' },
  { atomicNumber: 51, symbol: 'Sb', name: 'Antimony', nameAr: 'إثمد', category: 'metalloid', period: 5, group: 15, color: '#6c5ce7' },
  { atomicNumber: 52, symbol: 'Te', name: 'Tellurium', nameAr: 'تيلوريوم', category: 'metalloid', period: 5, group: 16, color: '#6c5ce7' },
  { atomicNumber: 54, symbol: 'Xe', name: 'Xenon', nameAr: 'زينون', category: 'noble-gas', period: 5, group: 18, color: '#4ecdc4' },
  
  // الدورة السادسة المتبقية - سأضيف العناصر الأساسية
  { atomicNumber: 55, symbol: 'Cs', name: 'Cesium', nameAr: 'سيزيوم', category: 'alkali-metal', period: 6, group: 1, color: '#ff7675' },
  { atomicNumber: 56, symbol: 'Ba', name: 'Barium', nameAr: 'باريوم', category: 'alkaline-earth-metal', period: 6, group: 2, color: '#fd79a8' },
  { atomicNumber: 72, symbol: 'Hf', name: 'Hafnium', nameAr: 'هافنيوم', category: 'transition-metal', period: 6, group: 4, color: '#636e72' },
  { atomicNumber: 73, symbol: 'Ta', name: 'Tantalum', nameAr: 'تانتالوم', category: 'transition-metal', period: 6, group: 5, color: '#636e72' },
  { atomicNumber: 75, symbol: 'Re', name: 'Rhenium', nameAr: 'رينيوم', category: 'transition-metal', period: 6, group: 7, color: '#636e72' },
  { atomicNumber: 76, symbol: 'Os', name: 'Osmium', nameAr: 'أوزميوم', category: 'transition-metal', period: 6, group: 8, color: '#636e72' },
  { atomicNumber: 77, symbol: 'Ir', name: 'Iridium', nameAr: 'إيريديوم', category: 'transition-metal', period: 6, group: 9, color: '#636e72' },
  { atomicNumber: 78, symbol: 'Pt', name: 'Platinum', nameAr: 'بلاتين', category: 'transition-metal', period: 6, group: 10, color: '#636e72' },
  { atomicNumber: 81, symbol: 'Tl', name: 'Thallium', nameAr: 'ثاليوم', category: 'post-transition-metal', period: 6, group: 13, color: '#fdcb6e' },
  { atomicNumber: 83, symbol: 'Bi', name: 'Bismuth', nameAr: 'بزموت', category: 'post-transition-metal', period: 6, group: 15, color: '#fdcb6e' },
  { atomicNumber: 84, symbol: 'Po', name: 'Polonium', nameAr: 'بولونيوم', category: 'metalloid', period: 6, group: 16, color: '#6c5ce7' },
  { atomicNumber: 85, symbol: 'At', name: 'Astatine', nameAr: 'أستاتين', category: 'halogen', period: 6, group: 17, color: '#55a3ff' },
  { atomicNumber: 86, symbol: 'Rn', name: 'Radon', nameAr: 'رادون', category: 'noble-gas', period: 6, group: 18, color: '#4ecdc4' },
  
  // الدورة السابعة
  { atomicNumber: 87, symbol: 'Fr', name: 'Francium', nameAr: 'فرانسيوم', category: 'alkali-metal', period: 7, group: 1, color: '#ff7675' },
  { atomicNumber: 88, symbol: 'Ra', name: 'Radium', nameAr: 'راديوم', category: 'alkaline-earth-metal', period: 7, group: 2, color: '#fd79a8' },
  { atomicNumber: 104, symbol: 'Rf', name: 'Rutherfordium', nameAr: 'روذرفورديوم', category: 'transition-metal', period: 7, group: 4, color: '#636e72' },
  { atomicNumber: 105, symbol: 'Db', name: 'Dubnium', nameAr: 'دوبنيوم', category: 'transition-metal', period: 7, group: 5, color: '#636e72' },
  { atomicNumber: 106, symbol: 'Sg', name: 'Seaborgium', nameAr: 'سيبورجيوم', category: 'transition-metal', period: 7, group: 6, color: '#636e72' },
  { atomicNumber: 107, symbol: 'Bh', name: 'Bohrium', nameAr: 'بوريوم', category: 'transition-metal', period: 7, group: 7, color: '#636e72' },
  { atomicNumber: 108, symbol: 'Hs', name: 'Hassium', nameAr: 'هاسيوم', category: 'transition-metal', period: 7, group: 8, color: '#636e72' },
  { atomicNumber: 109, symbol: 'Mt', name: 'Meitnerium', nameAr: 'مايتنيريوم', category: 'transition-metal', period: 7, group: 9, color: '#636e72' },
  { atomicNumber: 110, symbol: 'Ds', name: 'Darmstadtium', nameAr: 'دارمشتاتيوم', category: 'transition-metal', period: 7, group: 10, color: '#636e72' },
  { atomicNumber: 111, symbol: 'Rg', name: 'Roentgenium', nameAr: 'رونتجنيوم', category: 'transition-metal', period: 7, group: 11, color: '#636e72' },
  { atomicNumber: 112, symbol: 'Cn', name: 'Copernicium', nameAr: 'كوبرنيسيوم', category: 'transition-metal', period: 7, group: 12, color: '#636e72' },
  { atomicNumber: 113, symbol: 'Nh', name: 'Nihonium', nameAr: 'نيهونيوم', category: 'post-transition-metal', period: 7, group: 13, color: '#fdcb6e' },
  { atomicNumber: 114, symbol: 'Fl', name: 'Flerovium', nameAr: 'فليروفيوم', category: 'post-transition-metal', period: 7, group: 14, color: '#fdcb6e' },
  { atomicNumber: 115, symbol: 'Mc', name: 'Moscovium', nameAr: 'موسكوفيوم', category: 'post-transition-metal', period: 7, group: 15, color: '#fdcb6e' },
  { atomicNumber: 116, symbol: 'Lv', name: 'Livermorium', nameAr: 'ليفرموريوم', category: 'post-transition-metal', period: 7, group: 16, color: '#fdcb6e' },
  { atomicNumber: 117, symbol: 'Ts', name: 'Tennessine', nameAr: 'تينيسين', category: 'halogen', period: 7, group: 17, color: '#55a3ff' },
  { atomicNumber: 118, symbol: 'Og', name: 'Oganesson', nameAr: 'أوجانيسون', category: 'noble-gas', period: 7, group: 18, color: '#4ecdc4' },
  
  // اللانثانيدات
  { atomicNumber: 57, symbol: 'La', name: 'Lanthanum', nameAr: 'لانثانوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 58, symbol: 'Ce', name: 'Cerium', nameAr: 'سيريوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 59, symbol: 'Pr', name: 'Praseodymium', nameAr: 'براسيوديميوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 60, symbol: 'Nd', name: 'Neodymium', nameAr: 'نيوديميوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 61, symbol: 'Pm', name: 'Promethium', nameAr: 'بروميثيوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 62, symbol: 'Sm', name: 'Samarium', nameAr: 'ساماريوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 63, symbol: 'Eu', name: 'Europium', nameAr: 'يوروبيوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 64, symbol: 'Gd', name: 'Gadolinium', nameAr: 'جادولينيوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 65, symbol: 'Tb', name: 'Terbium', nameAr: 'تيربيوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 66, symbol: 'Dy', name: 'Dysprosium', nameAr: 'ديسبروسيوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 67, symbol: 'Ho', name: 'Holmium', nameAr: 'هولميوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 68, symbol: 'Er', name: 'Erbium', nameAr: 'إربيوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 69, symbol: 'Tm', name: 'Thulium', nameAr: 'ثوليوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 70, symbol: 'Yb', name: 'Ytterbium', nameAr: 'إتيربيوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  { atomicNumber: 71, symbol: 'Lu', name: 'Lutetium', nameAr: 'لوتيشيوم', category: 'lanthanide', period: 6, group: 3, color: '#a29bfe' },
  
  // الأكتينيدات
  { atomicNumber: 89, symbol: 'Ac', name: 'Actinium', nameAr: 'أكتينيوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 90, symbol: 'Th', name: 'Thorium', nameAr: 'ثوريوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 91, symbol: 'Pa', name: 'Protactinium', nameAr: 'بروتاكتينيوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 92, symbol: 'U', name: 'Uranium', nameAr: 'يورانيوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 93, symbol: 'Np', name: 'Neptunium', nameAr: 'نبتونيوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 94, symbol: 'Pu', name: 'Plutonium', nameAr: 'بلوتونيوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 95, symbol: 'Am', name: 'Americium', nameAr: 'أمريسيوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 96, symbol: 'Cm', name: 'Curium', nameAr: 'كوريوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 97, symbol: 'Bk', name: 'Berkelium', nameAr: 'بركليوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 98, symbol: 'Cf', name: 'Californium', nameAr: 'كاليفورنيوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 99, symbol: 'Es', name: 'Einsteinium', nameAr: 'آينشتاينيوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 100, symbol: 'Fm', name: 'Fermium', nameAr: 'فيرميوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 101, symbol: 'Md', name: 'Mendelevium', nameAr: 'مندليفيوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 102, symbol: 'No', name: 'Nobelium', nameAr: 'نوبليوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' },
  { atomicNumber: 103, symbol: 'Lr', name: 'Lawrencium', nameAr: 'لورنسيوم', category: 'actinide', period: 7, group: 3, color: '#fd79a8' }
];

// دمج جميع العناصر مع بيانات مبسطة للعناصر المتبقية
const ALL_ELEMENTS = [...PERIODIC_TABLE_ELEMENTS];

// إضافة العناصر المتبقية مع البيانات الأساسية
REMAINING_ELEMENTS.forEach(element => {
  ALL_ELEMENTS.push({
    ...element,
    atomicMass: 0, // سيتم تحديثها لاحقاً
    block: element.period <= 2 ? 's' : element.group <= 2 ? 's' : element.group >= 13 ? 'p' : element.category === 'lanthanide' || element.category === 'actinide' ? 'f' : 'd',
    electronicConfiguration: '', // سيتم تحديثها لاحقاً
    oxidationStates: ['0'],
    description: `عنصر ${element.nameAr} من فئة ${ELEMENT_CATEGORIES[element.category]?.name || element.category}`,
    uses: 'استخدامات متخصصة في البحث والصناعة',
    reactions: 'تفاعلات مختلفة حسب الفئة',
    inCurriculum: false
  } as Element);
});

// ترتيب العناصر حسب العدد الذري
export const COMPLETE_PERIODIC_TABLE = ALL_ELEMENTS.sort((a, b) => a.atomicNumber - b.atomicNumber);

export const ELEMENT_CATEGORIES = {
  'alkali-metal': { name: 'فلزات قلوية', color: '#ff7675' },
  'alkaline-earth-metal': { name: 'فلزات قلوية ترابية', color: '#fd79a8' },
  'transition-metal': { name: 'فلزات انتقالية', color: '#636e72' },
  'post-transition-metal': { name: 'فلزات بعد انتقالية', color: '#fdcb6e' },
  'metalloid': { name: 'أشباه فلزات', color: '#6c5ce7' },
  'nonmetal': { name: 'لا فلزات', color: '#e74c3c' },
  'halogen': { name: 'هالوجينات', color: '#55a3ff' },
  'noble-gas': { name: 'غازات نبيلة', color: '#4ecdc4' },
  'lanthanide': { name: 'لانثانيدات', color: '#a29bfe' },
  'actinide': { name: 'أكتينيدات', color: '#fd79a8' }
};

// تخطيط الجدول الدوري
export const PERIODIC_TABLE_LAYOUT = [
  // الدورة 1
  [
    { period: 1, group: 1, atomicNumber: 1 },   // H
    null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
    { period: 1, group: 18, atomicNumber: 2 }  // He
  ],
  // الدورة 2
  [
    { period: 2, group: 1, atomicNumber: 3 },   // Li
    { period: 2, group: 2, atomicNumber: 4 },   // Be
    null, null, null, null, null, null, null, null, null, null,
    { period: 2, group: 13, atomicNumber: 5 },  // B
    { period: 2, group: 14, atomicNumber: 6 },  // C
    { period: 2, group: 15, atomicNumber: 7 },  // N
    { period: 2, group: 16, atomicNumber: 8 },  // O
    { period: 2, group: 17, atomicNumber: 9 },  // F
    { period: 2, group: 18, atomicNumber: 10 }  // Ne
  ],
  // الدورة 3
  [
    { period: 3, group: 1, atomicNumber: 11 },  // Na
    { period: 3, group: 2, atomicNumber: 12 },  // Mg
    null, null, null, null, null, null, null, null, null, null,
    { period: 3, group: 13, atomicNumber: 13 }, // Al
    { period: 3, group: 14, atomicNumber: 14 }, // Si
    { period: 3, group: 15, atomicNumber: 15 }, // P
    { period: 3, group: 16, atomicNumber: 16 }, // S
    { period: 3, group: 17, atomicNumber: 17 }, // Cl
    { period: 3, group: 18, atomicNumber: 18 }  // Ar
  ],
  // الدورة 4
  [
    { period: 4, group: 1, atomicNumber: 19 },  // K
    { period: 4, group: 2, atomicNumber: 20 },  // Ca
    { period: 4, group: 3, atomicNumber: 21 },  // Sc
    { period: 4, group: 4, atomicNumber: 22 },  // Ti
    { period: 4, group: 5, atomicNumber: 23 },  // V
    { period: 4, group: 6, atomicNumber: 24 },  // Cr
    { period: 4, group: 7, atomicNumber: 25 },  // Mn
    { period: 4, group: 8, atomicNumber: 26 },  // Fe
    { period: 4, group: 9, atomicNumber: 27 },  // Co
    { period: 4, group: 10, atomicNumber: 28 }, // Ni
    { period: 4, group: 11, atomicNumber: 29 }, // Cu
    { period: 4, group: 12, atomicNumber: 30 }, // Zn
    { period: 4, group: 13, atomicNumber: 31 }, // Ga
    { period: 4, group: 14, atomicNumber: 32 }, // Ge
    { period: 4, group: 15, atomicNumber: 33 }, // As
    { period: 4, group: 16, atomicNumber: 34 }, // Se
    { period: 4, group: 17, atomicNumber: 35 }, // Br
    { period: 4, group: 18, atomicNumber: 36 }  // Kr
  ],
  // الدورة 5
  [
    { period: 5, group: 1, atomicNumber: 37 },  // Rb
    { period: 5, group: 2, atomicNumber: 38 },  // Sr
    { period: 5, group: 3, atomicNumber: 39 },  // Y
    { period: 5, group: 4, atomicNumber: 40 },  // Zr
    { period: 5, group: 5, atomicNumber: 41 },  // Nb
    { period: 5, group: 6, atomicNumber: 42 },  // Mo
    { period: 5, group: 7, atomicNumber: 43 },  // Tc
    { period: 5, group: 8, atomicNumber: 44 },  // Ru
    { period: 5, group: 9, atomicNumber: 45 },  // Rh
    { period: 5, group: 10, atomicNumber: 46 }, // Pd
    { period: 5, group: 11, atomicNumber: 47 }, // Ag
    { period: 5, group: 12, atomicNumber: 48 }, // Cd
    { period: 5, group: 13, atomicNumber: 49 }, // In
    { period: 5, group: 14, atomicNumber: 50 }, // Sn
    { period: 5, group: 15, atomicNumber: 51 }, // Sb
    { period: 5, group: 16, atomicNumber: 52 }, // Te
    { period: 5, group: 17, atomicNumber: 53 }, // I
    { period: 5, group: 18, atomicNumber: 54 }  // Xe
  ],
  // الدورة 6
  [
    { period: 6, group: 1, atomicNumber: 55 },  // Cs
    { period: 6, group: 2, atomicNumber: 56 },  // Ba
    { period: 6, group: 3, atomicNumber: 57, isLanthanide: true }, // La*
    { period: 6, group: 4, atomicNumber: 72 },  // Hf
    { period: 6, group: 5, atomicNumber: 73 },  // Ta
    { period: 6, group: 6, atomicNumber: 74 },  // W
    { period: 6, group: 7, atomicNumber: 75 },  // Re
    { period: 6, group: 8, atomicNumber: 76 },  // Os
    { period: 6, group: 9, atomicNumber: 77 },  // Ir
    { period: 6, group: 10, atomicNumber: 78 }, // Pt
    { period: 6, group: 11, atomicNumber: 79 }, // Au
    { period: 6, group: 12, atomicNumber: 80 }, // Hg
    { period: 6, group: 13, atomicNumber: 81 }, // Tl
    { period: 6, group: 14, atomicNumber: 82 }, // Pb
    { period: 6, group: 15, atomicNumber: 83 }, // Bi
    { period: 6, group: 16, atomicNumber: 84 }, // Po
    { period: 6, group: 17, atomicNumber: 85 }, // At
    { period: 6, group: 18, atomicNumber: 86 }  // Rn
  ],
  // الدورة 7
  [
    { period: 7, group: 1, atomicNumber: 87 },  // Fr
    { period: 7, group: 2, atomicNumber: 88 },  // Ra
    { period: 7, group: 3, atomicNumber: 89, isActinide: true }, // Ac*
    { period: 7, group: 4, atomicNumber: 104 }, // Rf
    { period: 7, group: 5, atomicNumber: 105 }, // Db
    { period: 7, group: 6, atomicNumber: 106 }, // Sg
    { period: 7, group: 7, atomicNumber: 107 }, // Bh
    { period: 7, group: 8, atomicNumber: 108 }, // Hs
    { period: 7, group: 9, atomicNumber: 109 }, // Mt
    { period: 7, group: 10, atomicNumber: 110 }, // Ds
    { period: 7, group: 11, atomicNumber: 111 }, // Rg
    { period: 7, group: 12, atomicNumber: 112 }, // Cn
    { period: 7, group: 13, atomicNumber: 113 }, // Nh
    { period: 7, group: 14, atomicNumber: 114 }, // Fl
    { period: 7, group: 15, atomicNumber: 115 }, // Mc
    { period: 7, group: 16, atomicNumber: 116 }, // Lv
    { period: 7, group: 17, atomicNumber: 117 }, // Ts
    { period: 7, group: 18, atomicNumber: 118 }  // Og
  ]
];

// اللانثانيدات
export const LANTHANIDES = [
  57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71
];

// الأكتينيدات
export const ACTINIDES = [
  89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103
];

// دالة للحصول على عنصر بالعدد الذري
export const getElementById = (atomicNumber: number): Element | undefined => {
  return COMPLETE_PERIODIC_TABLE.find(element => element.atomicNumber === atomicNumber);
};

// دالة للحصول على عناصر مجموعة معينة
export const getElementsByGroup = (group: number): Element[] => {
  return COMPLETE_PERIODIC_TABLE.filter(element => element.group === group);
};

// دالة للحصول على عناصر دورة معينة
export const getElementsByPeriod = (period: number): Element[] => {
  return COMPLETE_PERIODIC_TABLE.filter(element => element.period === period);
};

// دالة للحصول على عناصر فئة معينة
export const getElementsByCategory = (category: string): Element[] => {
  return COMPLETE_PERIODIC_TABLE.filter(element => element.category === category);
};

// دالة للبحث في العناصر
export const searchElements = (query: string): Element[] => {
  const searchTerm = query.toLowerCase();
  return COMPLETE_PERIODIC_TABLE.filter(element => 
    element.name.toLowerCase().includes(searchTerm) ||
    element.nameAr.includes(searchTerm) ||
    element.symbol.toLowerCase().includes(searchTerm) ||
    element.description.includes(searchTerm)
  );
};