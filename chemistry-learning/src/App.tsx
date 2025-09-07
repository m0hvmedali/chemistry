import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast, Toaster } from 'sonner';
import ChemistryChatbot from '@/components/ChemistryChatbot';
import LessonsPage from '@/components/lessons/LessonsPage';
import {
  Beaker,
  BookOpen,
  Bot,
  Award,
  Target,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Atom,
  FlaskConical,
  Star,
  Zap,
  Sparkles,
  Moon,
  Sun,
  Menu,
  X,
  PlusCircle,
  FileText,
  BarChart3,
  Brain,
  GraduationCap,
  Grid3x3,
  Save,
  Download,
  Eye,
  Lightbulb,
  Settings
} from 'lucide-react';

// البيانات الكيميائية المستخرجة من PDF
const ELEMENTS = [
  { symbol: 'H', name: 'هيدروجين', valence: [1], color: '#ff6b6b' },
  { symbol: 'He', name: 'هيليوم', valence: [0], color: '#4ecdc4' },
  { symbol: 'Li', name: 'ليثيوم', valence: [1], color: '#45b7d1' },
  { symbol: 'Be', name: 'بريليوم', valence: [2], color: '#96ceb4' },
  { symbol: 'B', name: 'بورون', valence: [3], color: '#ffeaa7' },
  { symbol: 'C', name: 'كربون', valence: [2, 4], color: '#dda0dd' },
  { symbol: 'N', name: 'نيتروجين', valence: [3, 5], color: '#74b9ff' },
  { symbol: 'O', name: 'أكسجين', valence: [2], color: '#fd79a8' },
  { symbol: 'F', name: 'فلور', valence: [1], color: '#fdcb6e' },
  { symbol: 'Ne', name: 'نيون', valence: [0], color: '#e17055' },
  { symbol: 'Na', name: 'صوديوم', valence: [1], color: '#a29bfe' },
  { symbol: 'Mg', name: 'ماغنيسيوم', valence: [2], color: '#fd79a8' },
  { symbol: 'Al', name: 'ألومينيوم', valence: [3], color: '#fdcb6e' },
  { symbol: 'Si', name: 'سيليكون', valence: [4], color: '#6c5ce7' },
  { symbol: 'P', name: 'فوسفور', valence: [3, 5], color: '#a29bfe' },
  { symbol: 'S', name: 'كبريت', valence: [2, 4, 6], color: '#ffeaa7' },
  { symbol: 'Cl', name: 'كلور', valence: [1, 3, 5, 7], color: '#55a3ff' },
  { symbol: 'K', name: 'بوتاسيوم', valence: [1], color: '#ff7675' },
  { symbol: 'Ca', name: 'كالسيوم', valence: [2], color: '#fd79a8' },
  { symbol: 'Fe', name: 'حديد', valence: [2, 3], color: '#636e72' },
  { symbol: 'Cu', name: 'نحاس', valence: [1, 2], color: '#e17055' },
  { symbol: 'Zn', name: 'خارصين', valence: [2], color: '#74b9ff' },
  { symbol: 'Ag', name: 'فضة', valence: [1], color: '#ddd' },
  { symbol: 'Au', name: 'ذهب', valence: [1, 3], color: '#f39c12' },
  { symbol: 'Pb', name: 'رصاص', valence: [2, 4], color: '#636e72' }
];

const COMPOUNDS = [
  { name: 'أكسيد كالسيوم', formula: 'CaO', type: 'oxide', description: 'مركب قاعدي يستخدم في بناء الأسمنت' },
  { name: 'أكسيد ألومنيوم', formula: 'Al₂O₃', type: 'oxide', description: 'مركب بيضاء صلب يستخدم في الشب والزجاج' },
  { name: 'كلوريد ماغنيسيوم', formula: 'MgCl₂', type: 'salt', description: 'ملح يستخدم في إذابة الجليد والمكملات الغذائية' },
  { name: 'كبريتيد بوتاسيوم', formula: 'K₂S', type: 'salt', description: 'ملح ينتج من تفاعل البوتاسيوم مع الكبريت' },
  { name: 'هيدروكسيد صوديوم', formula: 'NaOH', type: 'base', description: 'قاعدة قوية تستخدم في صناعة الصابون والورق' },
  { name: 'هيدروكسيد كالسيوم', formula: 'Ca(OH)₂', type: 'base', description: 'قاعدة تستخدم في البناء وتلقب بالجير المطفأ' },
  { name: 'حمض كبريتيك', formula: 'H₂SO₄', type: 'acid', description: 'حمض قوي جداً يستخدم في البطاريات والصناعة' },
  { name: 'حمض هيدروكلوريك', formula: 'HCl', type: 'acid', description: 'حمض قوي موجود في عصارة المعدة ويساعد في الهضم' },
  { name: 'حمض نيتريك', formula: 'HNO₃', type: 'acid', description: 'حمض قوي يستخدم في صناعة المتفجرات والأسمدة' },
  { name: 'كربونات كالسيوم', formula: 'CaCO₃', type: 'salt', description: 'مكون رئيسي في الحجر الجيري والرخام وقشر البيض' },
  { name: 'بيكربونات صوديوم', formula: 'NaHCO₃', type: 'salt', description: 'بيكنص الصودا يستخدم في الخبز وقليل حموضة المعدة' }
];

// معلومات المنهج المصري للعناصر الكيميائية
const EGYPTIAN_CURRICULUM_DATA = {
  'H': { chapter: 'الكيمياء العضوية', oxidationStates: [1], description: 'أساس الكيمياء العضوية، يرد في تعريف المركبات العضوية، غاز عديم اللون', physicalState: 'غاز', uses: 'يستخدم في الكيمياء العضوية والتفاعلات' },
  'He': { chapter: 'العناصر النبيلة', oxidationStates: [0], description: 'غاز نبيل لا يتفاعل', physicalState: 'غاز', uses: 'في البالونات والتطبيقات الخاصة' },
  'Fe': { chapter: 'العناصر الانتقالية', oxidationStates: [2, 3], description: 'حديد (II) أخضر اللون، حديد (III) أصفر اللون، يدخل في تفاعل ثرميت الحديد', physicalState: 'صلب', uses: 'صناعة الفولاذ وبناء المنشآت الكبيرة، سبائك الحديد والصلب' },
  'Cu': { chapter: 'العناصر الانتقالية', oxidationStates: [1, 2], description: 'فلز غير فعال كيميائياً وقابل للطرق والسحب، أيونات نحاس (II) زرقاء اللون', physicalState: 'صلب', uses: 'صناعة مواسير المياه والتمديدات الكهربائية، تفاعلات الإزاحة' },
  'Zn': { chapter: 'العناصر الانتقالية', oxidationStates: [2], description: 'فلز رمادي يميل إلى الأزرق، يكون أكاسيد ZnO بيضاء عند التسخين', physicalState: 'صلب', uses: 'جلفنة الحديد لحمايته من الصدأ، تفاعلات الأكسدة مع الأحماض' },
  'Ni': { chapter: 'العناصر الانتقالية', oxidationStates: [2], description: 'فلز قوي يقاوم التأكل', physicalState: 'صلب', uses: 'صناعة الفولاذ الستانلس وسبائك عملات معدنية، محفز في هدرجة الألكاينات' },
  'Cr': { chapter: 'العناصر الانتقالية', oxidationStates: [6, 3], description: 'فلز أزرق-أخضر، الكروم +6 أحمر اللون (CrO₃)', physicalState: 'صلب', uses: 'الطلاء الكرومي وصناعة الفولاذ المقاوم للصدأ' },
  'Ti': { chapter: 'العناصر الانتقالية', oxidationStates: [4], description: 'فلز رمادي فضي، تيتانيوم +4 أبيض (TiO₂)', physicalState: 'صلب', uses: 'سبائك التيتانيوم خفيفة الوزن وقوية في بناء الطائرات' },
  'W': { chapter: 'العناصر الانتقالية', oxidationStates: [6], description: 'أعلى نقطة انصهار بين الفلزات (أكثر من 3400°C)، درجة +6 صفراء (WO₃)', physicalState: 'صلب', uses: 'خيوط المصابيح الكهربائية وأقطاب اللحام' },
  'Hg': { chapter: 'العناصر الانتقالية', oxidationStates: [2], description: 'الفلز الوحيد السائل عند الظروف القياسية (-38.9°C)', physicalState: 'سائل', uses: 'الخلايا الكهروكيميائية والمصابيح التفريغية، أكسيد HgO أصفر' },
  'Al': { chapter: 'العناصر الانتقالية', oxidationStates: [3], description: 'أكثر الفلزات وفرة في القشرة الأرضية (8%), كثافة منخفضة ومقاوم للصدأ', physicalState: 'صلب', uses: 'صناعة الطائرات والعبوات الخفيفة، أكسيد Al₂O₃ أبيض' },
  'Ag': { chapter: 'التحليل الكيميائي', oxidationStates: [1], description: 'نترات الفضة مركب غير مستقر حرارياً، يتحلل بالتسخين إلى فضة معدنية', physicalState: 'صلب', uses: 'تفاعلات الإزاحة التمثيلية، تحليل كمي للأحماض الهالوجينية' },
  'Pb': { chapter: 'التحليل الكيميائي', oxidationStates: [2, 4], description: 'كربونات الرصاص (PbCO₃) غير مستقر بالحرارة، PbO أصفر أو أشهب', physicalState: 'صلب', uses: 'أكسيد الرصاص في بطاريات الرصاص الحمضية وسبائك الرصاص' },
  'Ca': { chapter: 'التحليل الكيميائي', oxidationStates: [2], description: 'في المجموعة الثانية، مركبات بيضاء عديمة اللون مثل CaCO₃', physicalState: 'صلب', uses: 'صناعة الأسمنت والجبس وتعديل التربة، كشف CO₂ بماء الجير' },
  'O': { chapter: 'التحليل الكيميائي', oxidationStates: [-2], description: 'غاز عديم اللون والرائحة عند الظروف القياسية، داعم للاحتراق', physicalState: 'غاز', uses: 'كشف الأكسجين بإعادة إشعال شظية موقدة، نقل الطاقة والاحتراق' },
  'C': { chapter: 'الكيمياء العضوية', oxidationStates: [2, 4], description: 'أساس الكيمياء العضوية، الجرافيت أسود، يكون مركبات مع الهيدروجين', physicalState: 'صلب', uses: 'تكوين المركبات العضوية، احتراق المركبات العضوية مثل الميثان CH₄' },
  'N': { chapter: 'الكيمياء العضوية', oxidationStates: [-3, 3, 5], description: 'يرد في الأمينات والأحماض الأمينية، حالة أكسدة -3 في النشادر NH₃', physicalState: 'غاز', uses: 'تصنيف الأمينات، المركبات النيتروجينية' },
  'F': { chapter: 'التحليل الكيميائي', oxidationStates: [-1], description: 'أكثر عناصر الهالوجينات فعالية، غاز أصفر باهت، سام جداً', physicalState: 'غاز', uses: 'تفاعلات الإزاحة مع يوديد البوتاسيوم، الفلوريدات والمركبات العضوية الفلورية' },
  'Cl': { chapter: 'التحليل الكيميائي', oxidationStates: [-1, 1, 3, 5, 7], description: 'من الهالوجينات، يوجد كجزيء ثنائي Cl₂، 7 إلكترونات تكافؤ', physicalState: 'غاز', uses: 'مطهر للتعقيم، تفاعلات الاستبدال في المركبات العضوية' },
  'Br': { chapter: 'التحليل الكيميائي', oxidationStates: [-1], description: 'من الهالوجينات، سائل بني-أحمر في الظروف القياسية', physicalState: 'سائل', uses: 'مركبات الهالوجين، تفاعلات عضوية' },
  'I': { chapter: 'التحليل الكيميائي', oxidationStates: [-1], description: 'من الهالوجينات، صلب بنفسجي في الظروف القياسية', physicalState: 'صلب', uses: 'تفاعلات الإزاحة مع الفلور' },
  'K': { chapter: 'التحليل الكيميائي', oxidationStates: [1], description: 'فلز قلوي نشط، يكون يوديد البوتاسيوم KI', physicalState: 'صلب', uses: 'تفاعلات مع الهالوجينات، الأملاح القلوية' },
  'Na': { chapter: 'التحليل الكيميائي', oxidationStates: [1], description: 'فلز قلوي نشط جداً، يكون مركبات أيونية', physicalState: 'صلب', uses: 'هيدروكسيد الصوديوم NaOH، أملاح الصوديوم' },
  'Mg': { chapter: 'التحليل الكيميائي', oxidationStates: [2], description: 'فلز من المجموعة الثانية، فضي اللون', physicalState: 'صلب', uses: 'سبائك خفيفة الوزن، مركبات المغنيسيوم' }
};

// بيانات الجدول الدوري الكاملة والمحدثة - 118 عنصر
const PERIODIC_TABLE_ELEMENTS = [
  // الدورة الأولى
  { symbol: 'H', name: 'هيدروجين', atomicNumber: 1, period: 1, group: 1, category: 'nonmetal', color: '#ff6b6b', atomicMass: 1.008, electronConfiguration: '1s¹' },
  { symbol: 'He', name: 'هيليوم', atomicNumber: 2, period: 1, group: 18, category: 'noble-gas', color: '#4ecdc4', atomicMass: 4.003, electronConfiguration: '1s²' },
  
  // الدورة الثانية
  { symbol: 'Li', name: 'ليثيوم', atomicNumber: 3, period: 2, group: 1, category: 'alkali-metal', color: '#45b7d1', atomicMass: 6.941, electronConfiguration: '1s² 2s¹' },
  { symbol: 'Be', name: 'بيريليوم', atomicNumber: 4, period: 2, group: 2, category: 'alkaline-earth-metal', color: '#96ceb4', atomicMass: 9.012, electronConfiguration: '1s² 2s²' },
  { symbol: 'B', name: 'بورون', atomicNumber: 5, period: 2, group: 13, category: 'metalloid', color: '#ffeaa7', atomicMass: 10.811, electronConfiguration: '1s² 2s² 2p¹' },
  { symbol: 'C', name: 'كربون', atomicNumber: 6, period: 2, group: 14, category: 'nonmetal', color: '#2d3436', atomicMass: 12.011, electronConfiguration: '1s² 2s² 2p²' },
  { symbol: 'N', name: 'نيتروجين', atomicNumber: 7, period: 2, group: 15, category: 'nonmetal', color: '#74b9ff', atomicMass: 14.007, electronConfiguration: '1s² 2s² 2p³' },
  { symbol: 'O', name: 'أكسجين', atomicNumber: 8, period: 2, group: 16, category: 'nonmetal', color: '#fd79a8', atomicMass: 15.999, electronConfiguration: '1s² 2s² 2p⁴' },
  { symbol: 'F', name: 'فلور', atomicNumber: 9, period: 2, group: 17, category: 'halogen', color: '#fdcb6e', atomicMass: 18.998, electronConfiguration: '1s² 2s² 2p⁵' },
  { symbol: 'Ne', name: 'نيون', atomicNumber: 10, period: 2, group: 18, category: 'noble-gas', color: '#e17055', atomicMass: 20.180, electronConfiguration: '1s² 2s² 2p⁶' },
  
  // الدورة الثالثة
  { symbol: 'Na', name: 'صوديوم', atomicNumber: 11, period: 3, group: 1, category: 'alkali-metal', color: '#a29bfe', atomicMass: 22.990, electronConfiguration: '1s² 2s² 2p⁶ 3s¹' },
  { symbol: 'Mg', name: 'ماغنسيوم', atomicNumber: 12, period: 3, group: 2, category: 'alkaline-earth-metal', color: '#fd79a8', atomicMass: 24.305, electronConfiguration: '1s² 2s² 2p⁶ 3s²' },
  { symbol: 'Al', name: 'ألومنيوم', atomicNumber: 13, period: 3, group: 13, category: 'post-transition-metal', color: '#fdcb6e', atomicMass: 26.982, electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p¹' },
  { symbol: 'Si', name: 'سيليكون', atomicNumber: 14, period: 3, group: 14, category: 'metalloid', color: '#6c5ce7', atomicMass: 28.085, electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p²' },
  { symbol: 'P', name: 'فوسفور', atomicNumber: 15, period: 3, group: 15, category: 'nonmetal', color: '#a29bfe', atomicMass: 30.974, electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p³' },
  { symbol: 'S', name: 'كبريت', atomicNumber: 16, period: 3, group: 16, category: 'nonmetal', color: '#ffeaa7', atomicMass: 32.065, electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p⁴' },
  { symbol: 'Cl', name: 'كلور', atomicNumber: 17, period: 3, group: 17, category: 'halogen', color: '#55a3ff', atomicMass: 35.453, electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p⁵' },
  { symbol: 'Ar', name: 'أرجون', atomicNumber: 18, period: 3, group: 18, category: 'noble-gas', color: '#00b894', atomicMass: 39.948, electronConfiguration: '1s² 2s² 2p⁶ 3s² 3p⁶' },
  
  // الدورة الرابعة
  { symbol: 'K', name: 'بوتاسيوم', atomicNumber: 19, period: 4, group: 1, category: 'alkali-metal', color: '#ff7675', atomicMass: 39.098, electronConfiguration: '[Ar] 4s¹' },
  { symbol: 'Ca', name: 'كالسيوم', atomicNumber: 20, period: 4, group: 2, category: 'alkaline-earth-metal', color: '#fd79a8', atomicMass: 40.078, electronConfiguration: '[Ar] 4s²' },
  { symbol: 'Sc', name: 'سكانديوم', atomicNumber: 21, period: 4, group: 3, category: 'transition-metal', color: '#00cec9', atomicMass: 44.956, electronConfiguration: '[Ar] 3d¹ 4s²' },
  { symbol: 'Ti', name: 'تيتانيوم', atomicNumber: 22, period: 4, group: 4, category: 'transition-metal', color: '#74b9ff', atomicMass: 47.867, electronConfiguration: '[Ar] 3d² 4s²' },
  { symbol: 'V', name: 'فاناديوم', atomicNumber: 23, period: 4, group: 5, category: 'transition-metal', color: '#a29bfe', atomicMass: 50.942, electronConfiguration: '[Ar] 3d³ 4s²' },
  { symbol: 'Cr', name: 'كروم', atomicNumber: 24, period: 4, group: 6, category: 'transition-metal', color: '#fd79a8', atomicMass: 51.996, electronConfiguration: '[Ar] 3d⁵ 4s¹' },
  { symbol: 'Mn', name: 'منغنيز', atomicNumber: 25, period: 4, group: 7, category: 'transition-metal', color: '#fdcb6e', atomicMass: 54.938, electronConfiguration: '[Ar] 3d⁵ 4s²' },
  { symbol: 'Fe', name: 'حديد', atomicNumber: 26, period: 4, group: 8, category: 'transition-metal', color: '#636e72', atomicMass: 55.845, electronConfiguration: '[Ar] 3d⁶ 4s²' },
  { symbol: 'Co', name: 'كوبالت', atomicNumber: 27, period: 4, group: 9, category: 'transition-metal', color: '#74b9ff', atomicMass: 58.933, electronConfiguration: '[Ar] 3d⁷ 4s²' },
  { symbol: 'Ni', name: 'نيكل', atomicNumber: 28, period: 4, group: 10, category: 'transition-metal', color: '#00b894', atomicMass: 58.693, electronConfiguration: '[Ar] 3d⁸ 4s²' },
  { symbol: 'Cu', name: 'نحاس', atomicNumber: 29, period: 4, group: 11, category: 'transition-metal', color: '#e17055', atomicMass: 63.546, electronConfiguration: '[Ar] 3d¹⁰ 4s¹' },
  { symbol: 'Zn', name: 'زنك', atomicNumber: 30, period: 4, group: 12, category: 'transition-metal', color: '#74b9ff', atomicMass: 65.38, electronConfiguration: '[Ar] 3d¹⁰ 4s²' },
  { symbol: 'Ga', name: 'غاليوم', atomicNumber: 31, period: 4, group: 13, category: 'post-transition-metal', color: '#fdcb6e', atomicMass: 69.723, electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p¹' },
  { symbol: 'Ge', name: 'جرمانيوم', atomicNumber: 32, period: 4, group: 14, category: 'metalloid', color: '#6c5ce7', atomicMass: 72.630, electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p²' },
  { symbol: 'As', name: 'زرنيخ', atomicNumber: 33, period: 4, group: 15, category: 'metalloid', color: '#a29bfe', atomicMass: 74.922, electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p³' },
  { symbol: 'Se', name: 'سلينيوم', atomicNumber: 34, period: 4, group: 16, category: 'nonmetal', color: '#ffeaa7', atomicMass: 78.971, electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁴' },
  { symbol: 'Br', name: 'بروم', atomicNumber: 35, period: 4, group: 17, category: 'halogen', color: '#ff7675', atomicMass: 79.904, electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁵' },
  { symbol: 'Kr', name: 'كريبتون', atomicNumber: 36, period: 4, group: 18, category: 'noble-gas', color: '#00cec9', atomicMass: 83.798, electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁶' },
  
  // الدورة الخامسة
  { symbol: 'Rb', name: 'روبيديوم', atomicNumber: 37, period: 5, group: 1, category: 'alkali-metal', color: '#a29bfe', atomicMass: 85.468, electronConfiguration: '[Kr] 5s¹' },
  { symbol: 'Sr', name: 'سترونتيوم', atomicNumber: 38, period: 5, group: 2, category: 'alkaline-earth-metal', color: '#fd79a8', atomicMass: 87.62, electronConfiguration: '[Kr] 5s²' },
  { symbol: 'Y', name: 'إتريوم', atomicNumber: 39, period: 5, group: 3, category: 'transition-metal', color: '#00cec9', atomicMass: 88.906, electronConfiguration: '[Kr] 4d¹ 5s²' },
  { symbol: 'Zr', name: 'زركونيوم', atomicNumber: 40, period: 5, group: 4, category: 'transition-metal', color: '#74b9ff', atomicMass: 91.224, electronConfiguration: '[Kr] 4d² 5s²' },
  { symbol: 'Nb', name: 'نيوبيوم', atomicNumber: 41, period: 5, group: 5, category: 'transition-metal', color: '#a29bfe', atomicMass: 92.906, electronConfiguration: '[Kr] 4d⁴ 5s¹' },
  { symbol: 'Mo', name: 'موليبدنوم', atomicNumber: 42, period: 5, group: 6, category: 'transition-metal', color: '#fd79a8', atomicMass: 95.95, electronConfiguration: '[Kr] 4d⁵ 5s¹' },
  { symbol: 'Tc', name: 'تكنيتيوم', atomicNumber: 43, period: 5, group: 7, category: 'transition-metal', color: '#fdcb6e', atomicMass: 98, electronConfiguration: '[Kr] 4d⁵ 5s²' },
  { symbol: 'Ru', name: 'روثينيوم', atomicNumber: 44, period: 5, group: 8, category: 'transition-metal', color: '#636e72', atomicMass: 101.07, electronConfiguration: '[Kr] 4d⁷ 5s¹' },
  { symbol: 'Rh', name: 'روديوم', atomicNumber: 45, period: 5, group: 9, category: 'transition-metal', color: '#74b9ff', atomicMass: 102.91, electronConfiguration: '[Kr] 4d⁸ 5s¹' },
  { symbol: 'Pd', name: 'بالاديوم', atomicNumber: 46, period: 5, group: 10, category: 'transition-metal', color: '#00b894', atomicMass: 106.42, electronConfiguration: '[Kr] 4d¹⁰' },
  { symbol: 'Ag', name: 'فضة', atomicNumber: 47, period: 5, group: 11, category: 'transition-metal', color: '#ddd', atomicMass: 107.87, electronConfiguration: '[Kr] 4d¹⁰ 5s¹' },
  { symbol: 'Cd', name: 'كادميوم', atomicNumber: 48, period: 5, group: 12, category: 'transition-metal', color: '#74b9ff', atomicMass: 112.41, electronConfiguration: '[Kr] 4d¹⁰ 5s²' },
  { symbol: 'In', name: 'إنديوم', atomicNumber: 49, period: 5, group: 13, category: 'post-transition-metal', color: '#fdcb6e', atomicMass: 114.82, electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p¹' },
  { symbol: 'Sn', name: 'قصدير', atomicNumber: 50, period: 5, group: 14, category: 'post-transition-metal', color: '#6c5ce7', atomicMass: 118.71, electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p²' },
  { symbol: 'Sb', name: 'أنتيمون', atomicNumber: 51, period: 5, group: 15, category: 'metalloid', color: '#a29bfe', atomicMass: 121.76, electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p³' },
  { symbol: 'Te', name: 'تلوريوم', atomicNumber: 52, period: 5, group: 16, category: 'metalloid', color: '#ffeaa7', atomicMass: 127.60, electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁴' },
  { symbol: 'I', name: 'يود', atomicNumber: 53, period: 5, group: 17, category: 'halogen', color: '#6c5ce7', atomicMass: 126.90, electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁵' },
  { symbol: 'Xe', name: 'زينون', atomicNumber: 54, period: 5, group: 18, category: 'noble-gas', color: '#00cec9', atomicMass: 131.29, electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁶' },
  
  // الدورة السادسة (مع اللانثانيدات)
  { symbol: 'Cs', name: 'سيزيوم', atomicNumber: 55, period: 6, group: 1, category: 'alkali-metal', color: '#a29bfe', atomicMass: 132.91, electronConfiguration: '[Xe] 6s¹' },
  { symbol: 'Ba', name: 'باريوم', atomicNumber: 56, period: 6, group: 2, category: 'alkaline-earth-metal', color: '#fd79a8', atomicMass: 137.33, electronConfiguration: '[Xe] 6s²' },
  { symbol: 'La', name: 'لانثانوم', atomicNumber: 57, period: 6, group: 3, category: 'lanthanide', color: '#00cec9', atomicMass: 138.91, electronConfiguration: '[Xe] 5d¹ 6s²' },
  { symbol: 'Ce', name: 'سيريوم', atomicNumber: 58, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 140.12, electronConfiguration: '[Xe] 4f¹ 5d¹ 6s²' },
  { symbol: 'Pr', name: 'براسوديميوم', atomicNumber: 59, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 140.91, electronConfiguration: '[Xe] 4f³ 6s²' },
  { symbol: 'Nd', name: 'نيوديميوم', atomicNumber: 60, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 144.24, electronConfiguration: '[Xe] 4f⁴ 6s²' },
  { symbol: 'Pm', name: 'بروميثيوم', atomicNumber: 61, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 145, electronConfiguration: '[Xe] 4f⁵ 6s²' },
  { symbol: 'Sm', name: 'ساماريوم', atomicNumber: 62, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 150.36, electronConfiguration: '[Xe] 4f⁶ 6s²' },
  { symbol: 'Eu', name: 'يوروبيوم', atomicNumber: 63, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 151.96, electronConfiguration: '[Xe] 4f⁷ 6s²' },
  { symbol: 'Gd', name: 'غادولينيوم', atomicNumber: 64, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 157.25, electronConfiguration: '[Xe] 4f⁷ 5d¹ 6s²' },
  { symbol: 'Tb', name: 'تربيوم', atomicNumber: 65, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 158.93, electronConfiguration: '[Xe] 4f⁹ 6s²' },
  { symbol: 'Dy', name: 'ديسبروسيوم', atomicNumber: 66, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 162.50, electronConfiguration: '[Xe] 4f¹⁰ 6s²' },
  { symbol: 'Ho', name: 'هولميوم', atomicNumber: 67, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 164.93, electronConfiguration: '[Xe] 4f¹¹ 6s²' },
  { symbol: 'Er', name: 'إربيوم', atomicNumber: 68, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 167.26, electronConfiguration: '[Xe] 4f¹² 6s²' },
  { symbol: 'Tm', name: 'ثوليوم', atomicNumber: 69, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 168.93, electronConfiguration: '[Xe] 4f¹³ 6s²' },
  { symbol: 'Yb', name: 'إتربيوم', atomicNumber: 70, period: 6, group: 0, category: 'lanthanide', color: '#81ecec', atomicMass: 173.05, electronConfiguration: '[Xe] 4f¹⁴ 6s²' },
  { symbol: 'Lu', name: 'لوتيتيوم', atomicNumber: 71, period: 6, group: 3, category: 'lanthanide', color: '#81ecec', atomicMass: 174.97, electronConfiguration: '[Xe] 4f¹⁴ 5d¹ 6s²' },
  { symbol: 'Hf', name: 'هافنيوم', atomicNumber: 72, period: 6, group: 4, category: 'transition-metal', color: '#74b9ff', atomicMass: 178.49, electronConfiguration: '[Xe] 4f¹⁴ 5d² 6s²' },
  { symbol: 'Ta', name: 'تانتالوم', atomicNumber: 73, period: 6, group: 5, category: 'transition-metal', color: '#a29bfe', atomicMass: 180.95, electronConfiguration: '[Xe] 4f¹⁴ 5d³ 6s²' },
  { symbol: 'W', name: 'تنغستن', atomicNumber: 74, period: 6, group: 6, category: 'transition-metal', color: '#fd79a8', atomicMass: 183.84, electronConfiguration: '[Xe] 4f¹⁴ 5d⁴ 6s²' },
  { symbol: 'Re', name: 'رينيوم', atomicNumber: 75, period: 6, group: 7, category: 'transition-metal', color: '#fdcb6e', atomicMass: 186.21, electronConfiguration: '[Xe] 4f¹⁴ 5d⁵ 6s²' },
  { symbol: 'Os', name: 'أوزميوم', atomicNumber: 76, period: 6, group: 8, category: 'transition-metal', color: '#636e72', atomicMass: 190.23, electronConfiguration: '[Xe] 4f¹⁴ 5d⁶ 6s²' },
  { symbol: 'Ir', name: 'إيريديوم', atomicNumber: 77, period: 6, group: 9, category: 'transition-metal', color: '#74b9ff', atomicMass: 192.22, electronConfiguration: '[Xe] 4f¹⁴ 5d⁷ 6s²' },
  { symbol: 'Pt', name: 'بلاتين', atomicNumber: 78, period: 6, group: 10, category: 'transition-metal', color: '#00b894', atomicMass: 195.08, electronConfiguration: '[Xe] 4f¹⁴ 5d⁹ 6s¹' },
  { symbol: 'Au', name: 'ذهب', atomicNumber: 79, period: 6, group: 11, category: 'transition-metal', color: '#f39c12', atomicMass: 196.97, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹' },
  { symbol: 'Hg', name: 'زئبق', atomicNumber: 80, period: 6, group: 12, category: 'transition-metal', color: '#74b9ff', atomicMass: 200.59, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s²' },
  { symbol: 'Tl', name: 'ثاليوم', atomicNumber: 81, period: 6, group: 13, category: 'post-transition-metal', color: '#fdcb6e', atomicMass: 204.38, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹' },
  { symbol: 'Pb', name: 'رصاص', atomicNumber: 82, period: 6, group: 14, category: 'post-transition-metal', color: '#636e72', atomicMass: 207.2, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²' },
  { symbol: 'Bi', name: 'بزموث', atomicNumber: 83, period: 6, group: 15, category: 'post-transition-metal', color: '#a29bfe', atomicMass: 208.98, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³' },
  { symbol: 'Po', name: 'بولونيوم', atomicNumber: 84, period: 6, group: 16, category: 'post-transition-metal', color: '#ffeaa7', atomicMass: 209, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴' },
  { symbol: 'At', name: 'أستاتين', atomicNumber: 85, period: 6, group: 17, category: 'halogen', color: '#6c5ce7', atomicMass: 210, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵' },
  { symbol: 'Rn', name: 'رادون', atomicNumber: 86, period: 6, group: 18, category: 'noble-gas', color: '#00cec9', atomicMass: 222, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶' },
  
  // الدورة السابعة (مع الأكتينيدات)
  { symbol: 'Fr', name: 'فرانسيوم', atomicNumber: 87, period: 7, group: 1, category: 'alkali-metal', color: '#a29bfe', atomicMass: 223, electronConfiguration: '[Rn] 7s¹' },
  { symbol: 'Ra', name: 'راديوم', atomicNumber: 88, period: 7, group: 2, category: 'alkaline-earth-metal', color: '#fd79a8', atomicMass: 226, electronConfiguration: '[Rn] 7s²' },
  { symbol: 'Ac', name: 'أكتينيوم', atomicNumber: 89, period: 7, group: 3, category: 'actinide', color: '#00b894', atomicMass: 227, electronConfiguration: '[Rn] 6d¹ 7s²' },
  { symbol: 'Th', name: 'ثوريوم', atomicNumber: 90, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 232.04, electronConfiguration: '[Rn] 6d² 7s²' },
  { symbol: 'Pa', name: 'بروتأكتينيوم', atomicNumber: 91, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 231.04, electronConfiguration: '[Rn] 5f² 6d¹ 7s²' },
  { symbol: 'U', name: 'يورانيوم', atomicNumber: 92, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 238.03, electronConfiguration: '[Rn] 5f³ 6d¹ 7s²' },
  { symbol: 'Np', name: 'نبتونيوم', atomicNumber: 93, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 237, electronConfiguration: '[Rn] 5f⁴ 6d¹ 7s²' },
  { symbol: 'Pu', name: 'بلوتونيوم', atomicNumber: 94, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 244, electronConfiguration: '[Rn] 5f⁶ 7s²' },
  { symbol: 'Am', name: 'أمريسيوم', atomicNumber: 95, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 243, electronConfiguration: '[Rn] 5f⁷ 7s²' },
  { symbol: 'Cm', name: 'كوريوم', atomicNumber: 96, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 247, electronConfiguration: '[Rn] 5f⁷ 6d¹ 7s²' },
  { symbol: 'Bk', name: 'بيركيليوم', atomicNumber: 97, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 247, electronConfiguration: '[Rn] 5f⁹ 7s²' },
  { symbol: 'Cf', name: 'كاليفورنيوم', atomicNumber: 98, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 251, electronConfiguration: '[Rn] 5f¹⁰ 7s²' },
  { symbol: 'Es', name: 'أينشتاينيوم', atomicNumber: 99, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 252, electronConfiguration: '[Rn] 5f¹¹ 7s²' },
  { symbol: 'Fm', name: 'فيرميوم', atomicNumber: 100, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 257, electronConfiguration: '[Rn] 5f¹² 7s²' },
  { symbol: 'Md', name: 'مندليفيوم', atomicNumber: 101, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 258, electronConfiguration: '[Rn] 5f¹³ 7s²' },
  { symbol: 'No', name: 'نوبيليوم', atomicNumber: 102, period: 7, group: 0, category: 'actinide', color: '#55a3ff', atomicMass: 259, electronConfiguration: '[Rn] 5f¹⁴ 7s²' },
  { symbol: 'Lr', name: 'لورنسيوم', atomicNumber: 103, period: 7, group: 3, category: 'actinide', color: '#55a3ff', atomicMass: 262, electronConfiguration: '[Rn] 5f¹⁴ 7s² 7p¹' },
  { symbol: 'Rf', name: 'رذرفورديوم', atomicNumber: 104, period: 7, group: 4, category: 'transition-metal', color: '#74b9ff', atomicMass: 267, electronConfiguration: '[Rn] 5f¹⁴ 6d² 7s²' },
  { symbol: 'Db', name: 'دبنيوم', atomicNumber: 105, period: 7, group: 5, category: 'transition-metal', color: '#a29bfe', atomicMass: 270, electronConfiguration: '[Rn] 5f¹⁴ 6d³ 7s²' },
  { symbol: 'Sg', name: 'سيبورغيوم', atomicNumber: 106, period: 7, group: 6, category: 'transition-metal', color: '#fd79a8', atomicMass: 271, electronConfiguration: '[Rn] 5f¹⁴ 6d⁴ 7s²' },
  { symbol: 'Bh', name: 'بوريوم', atomicNumber: 107, period: 7, group: 7, category: 'transition-metal', color: '#fdcb6e', atomicMass: 270, electronConfiguration: '[Rn] 5f¹⁴ 6d⁵ 7s²' },
  { symbol: 'Hs', name: 'هاسيوم', atomicNumber: 108, period: 7, group: 8, category: 'transition-metal', color: '#636e72', atomicMass: 277, electronConfiguration: '[Rn] 5f¹⁴ 6d⁶ 7s²' },
  { symbol: 'Mt', name: 'مايتنيريوم', atomicNumber: 109, period: 7, group: 9, category: 'transition-metal', color: '#74b9ff', atomicMass: 276, electronConfiguration: '[Rn] 5f¹⁴ 6d⁷ 7s²' },
  { symbol: 'Ds', name: 'دارمشتاديوم', atomicNumber: 110, period: 7, group: 10, category: 'transition-metal', color: '#00b894', atomicMass: 281, electronConfiguration: '[Rn] 5f¹⁴ 6d⁸ 7s²' },
  { symbol: 'Rg', name: 'رونتجنيوم', atomicNumber: 111, period: 7, group: 11, category: 'transition-metal', color: '#ddd', atomicMass: 280, electronConfiguration: '[Rn] 5f¹⁴ 6d⁹ 7s²' },
  { symbol: 'Cn', name: 'كوبرنيسيوم', atomicNumber: 112, period: 7, group: 12, category: 'transition-metal', color: '#74b9ff', atomicMass: 285, electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s²' },
  { symbol: 'Nh', name: 'نيهونيوم', atomicNumber: 113, period: 7, group: 13, category: 'post-transition-metal', color: '#fdcb6e', atomicMass: 284, electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹' },
  { symbol: 'Fl', name: 'فليروفيوم', atomicNumber: 114, period: 7, group: 14, category: 'post-transition-metal', color: '#6c5ce7', atomicMass: 289, electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²' },
  { symbol: 'Mc', name: 'موسكوفيوم', atomicNumber: 115, period: 7, group: 15, category: 'post-transition-metal', color: '#a29bfe', atomicMass: 288, electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³' },
  { symbol: 'Lv', name: 'ليفرموريوم', atomicNumber: 116, period: 7, group: 16, category: 'post-transition-metal', color: '#ffeaa7', atomicMass: 293, electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴' },
  { symbol: 'Ts', name: 'تنيسين', atomicNumber: 117, period: 7, group: 17, category: 'halogen', color: '#6c5ce7', atomicMass: 294, electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵' },
  { symbol: 'Og', name: 'أوغانيسون', atomicNumber: 118, period: 7, group: 18, category: 'noble-gas', color: '#00cec9', atomicMass: 294, electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶' }
];

const QUIZ_QUESTIONS = [
  {
    question: 'ما هو تكافؤ الهيدروجين؟',
    options: ['1', '2', '3', '4'],
    correct: 0,
    explanation: 'الهيدروجين له إلكترون واحد في المدار الخارجي لذلك تكافؤه 1'
  },
  {
    question: 'أي من هذه المركبات هو حمض؟',
    options: ['NaOH', 'CaO', 'HCl', 'MgCl₂'],
    correct: 2,
    explanation: 'HCl هو حمض الهيدروكلوريك لأنه يبدأ بـ H ويعطي أيونات H+ في الماء'
  },
  {
    question: 'ما هي صيغة هيدروكسيد الصوديوم؟',
    options: ['Na₂O', 'NaOH', 'NaCl', 'Na₂SO₄'],
    correct: 1,
    explanation: 'هيدروكسيد الصوديوم = Na+ + OH- = NaOH'
  },
  {
    question: 'تكافؤ الكالسيوم هو:',
    options: ['1', '2', '3', '4'],
    correct: 1,
    explanation: 'الكالسيوم في المجموعة 2 لذلك له إلكترونين في المدار الخارجي'
  },
  {
    question: 'ما هو العنصر الأكثر انتشاراً في القشرة الأرضية؟',
    options: ['الأكسجين', 'السيليكون', 'الألومنيوم', 'الحديد'],
    correct: 0,
    explanation: 'الأكسجين يشكل حوالي 46% من وزن القشرة الأرضية'
  },
  {
    question: 'ماذا يحدث عند تفاعل حمض مع قاعدة؟',
    options: ['يتكون ماء فقط', 'يتكون ملح فقط', 'يتكون ملح وماء', 'لا يحدث تفاعل'],
    correct: 2,
    explanation: 'هذا ما يعرف بتفاعل التعادل: حمض + قاعدة → ملح + ماء'
  },
  {
    question: 'ما هو العدد الذري لعنصر الكربون؟',
    options: ['6', '12', '14', '16'],
    correct: 0,
    explanation: 'العدد الذري = عدد البروتونات في النواة. الكربون له 6 بروتونات'
  },
  {
    question: 'أي من هذه الغازات نبيل؟',
    options: ['الأكسجين', 'النيتروجين', 'الهيليوم', 'الهيدروجين'],
    correct: 2,
    explanation: 'الغازات النبيلة هي: هيليوم، نيون، أرجون، كريبتون، زينون، رادون'
  }
];

// مكون عرض عنصر واحد محسن للموبايل
const ElementCard = ({ element, selectedElement, updateProgress, showEgyptianInfo = true, onClick }: any) => {
  const egyptianInfo = EGYPTIAN_CURRICULUM_DATA[element.symbol];
  
  return (
    <div
      className={`group relative h-full w-full rounded-md sm:rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center text-center p-0.5 sm:p-1 touch-manipulation active:scale-95 min-h-[3rem] sm:min-h-[3.5rem] lg:min-h-[4rem] ${
        (!selectedElement || element.category === selectedElement.category) ? 'opacity-100' : 'opacity-30'
      }`}
      style={{
        borderColor: element.color,
        background: `linear-gradient(135deg, ${element.color}20, ${element.color}05)`,
      }}
      onClick={() => {
        updateProgress('elements', 2);
        onClick?.(element);
      }}
    >
      <div className="text-[6px] sm:text-[8px] text-muted-foreground">{element.atomicNumber}</div>
      <div className="text-xs sm:text-sm lg:text-base font-bold" style={{ color: element.color }}>{element.symbol}</div>
      <div className="text-[6px] sm:text-[8px] text-muted-foreground truncate w-full">{element.name.slice(0, 4)}</div>
      {egyptianInfo && showEgyptianInfo && (
        <div className="text-[5px] sm:text-[6px] text-green-600 dark:text-green-400 font-medium">مصري</div>
      )}
      {element.atomicMass && <div className="text-[5px] sm:text-[7px] opacity-60 hidden sm:block">{element.atomicMass.toFixed(1)}</div>}
    </div>
  );
};

export default function ChemistryLearning() {
  const [currentSection, setCurrentSection] = useState('home');
  // حالات لعبة توزيع الإلكترونات المحسنة
  const [selectedElementForDistribution, setSelectedElementForDistribution] = useState<any | null>(null);
  const [playerDistribution, setPlayerDistribution] = useState<number[]>([]);
  const [availableElectrons, setAvailableElectrons] = useState(0);
  const [distributionGameState, setDistributionGameState] = useState<'selecting' | 'playing' | 'checking'>('selecting');
  const [distributionFeedback, setDistributionFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [distributionScore, setDistributionScore] = useState(0);
  const [distributionAttempts, setDistributionAttempts] = useState(0);
  const [showOrbitalDetails, setShowOrbitalDetails] = useState(false);
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [currentElement, setCurrentElement] = useState<typeof ELEMENTS[0] | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameTimer, setGameTimer] = useState<NodeJS.Timeout | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [learningProgress, setLearningProgress] = useState({
    elements: 0,
    compounds: 0,
    acids: 0,
    valency: 0
  });
  const [elementInfoOpen, setElementInfoOpen] = useState(false);
  const [elementInfo, setElementInfo] = useState<any | null>(null);
  const CATEGORY_AR: Record<string, string> = {
    'alkali-metal': 'الفلزات القلوية',
    'alkaline-earth-metal': 'الفلزات القلوية الترابية',
    'transition-metal': 'الفلزات الانتقالية',
    'post-transition-metal': 'فلزات ما بعد الانتقالية',
    'metalloid': 'أشباه الفلزات',
    'nonmetal': 'اللافلزات',
    'halogen': 'الهالوجينات',
    'noble-gas': 'الغازات النبيلة',
    'lanthanide': 'اللانثانيدات',
    'actinide': 'الأكتينيدات'
  };
  const OCCURRENCE: Record<string, string> = {
    H: 'في الماء والمواد العضوية والغلاف الجوي (H₂).',
    He: 'غاز نبيل نادر في الغلاف الجوي وغازات الآبار.',
    C: 'في جميع المركبات العضوية والفحم والجرافيت والماس.',
    N: 'غاز يشكل ~78% من الغلاف الجوي.',
    O: 'في الماء (H₂O) والمعادن وقشرة الأرض.',
    Na: 'في أملاح البحر (NaCl) والمعادن.',
    Mg: 'في الدولوميت والمياه المالحة.',
    Al: 'في البوكسيت والسيليكات (أكثر الفلزات وفرة).',
    Si: 'في الرمال والسيليكات (من أكثر العناصر وفرة).',
    P: 'في الفوسفات.',
    S: 'في الكبريتات والينابيع الحارة والبراكين.',
    Cl: 'في أملاح البحر والكلوريدات.',
    K: 'في الأملاح والمعادن بالتربة.',
    Ca: 'في الحجر الجيري والطباشير والعظام.',
    Fe: 'في خامات الحديد (هيماتيت، مغنيتيت).',
    Cu: 'في خامات النحاس (كالكوبيتريت).',
    Zn: 'في السفاليرايت.',
    Ag: 'في الخامات الفضية، أحيانًا حرًا.',
    Au: 'في العروق الحرارية، أحيانًا حرًا.'
  };
  const openElementDetails = (element: any) => {
    try {
      const atomicNumber = element.atomicNumber;
      const shellsArr = (getCorrectElectronDistribution(atomicNumber, false) as number[]) || [];
      const shells = shellsArr.length ? shellsArr.join('-') : '—';
      const orbitals = (getElectronConfiguration(atomicNumber) || []).map((c: any) => `${c.orbital}${c.electrons}`).join(' ') || '—';
      const egypt = (EGYPTIAN_CURRICULUM_DATA as any)[element.symbol] || {};
      const oxidation = Array.isArray(egypt.oxidationStates) ? egypt.oxidationStates.join(', ') : '—';
      const physical = egypt.physicalState || '—';
      const uses = egypt.uses || '—';
      const compounds = COMPOUNDS.filter(c =>
        (c.formula && c.formula.includes(element.symbol)) ||
        (c.name && c.name.includes(element.name.split(' ')[0] || ''))
      ).slice(0, 8);
      const occurrence = OCCURRENCE[element.symbol] || 'غير متوفر';
      const properties: Record<string, any> = {
        'العدد الذري': element.atomicNumber,
        'الكتلة الذرية': element.atomicMass ?? '—',
        'الدورة': element.period,
        'المجموعة': element.group,
        'التصنيف': CATEGORY_AR[element.category] || element.category,
        'حالات الأكسدة': oxidation,
        'الحالة الفيزيائية': physical
      };
      setElementInfo({ element, shells, orbitals, properties, compounds, uses, occurrence });
      setElementInfoOpen(true);
    } catch (e) {
      console.error('openElementDetails error', e);
    }
  };

  const [lessons, setLessons] = useState<any[]>([
    {
      id: 1,
      title: 'أساسيات الذرة ومكوناتها',
      content: `الذرة هي أصغر وحدة في المادة تحتفظ بخصائص العنصر الكيميائي. تعتبر الذرة الوحدة الأساسية للمادة والبناء الأولي لجميع العناصر الكيميائية.

## التركيب الداخلي للذرة

### النواة الذرية (Nucleus)
تقع النواة في مركز الذرة وتحتوي على:
• **البروتونات (Protons)**: جسيمات موجبة الشحنة (+1)
• **النيوترونات (Neutrons)**: جسيمات عديمة الشحنة (0)
• النواة تحتوي على 99.9% من كتلة الذرة
• قطر النواة حوالي 10⁻¹⁵ متر

### الإلكترونات (Electrons)
• جسيمات سالبة الشحنة (-1)
• تدور حول النواة في مدارات إلكترونية
• كتلتها أصغر بحوالي 1836 مرة من البروتون
• تحدد الخصائص الكيميائية للعنصر

## الأعداد الذرية المهمة

### العدد الذري (Atomic Number - Z)
• يساوي عدد البروتونات في النواة
• يحدد نوع العنصر الكيميائي
• مثال: الهيدروجين Z=1، الكربون Z=6

### العدد الكتلي (Mass Number - A)
• مجموع عدد البروتونات والنيوترونات
• A = Z + N (حيث N = عدد النيوترونات)
• مثال: الكربون-12 له 6 بروتونات و 6 نيوترونات

### النظائر (Isotopes)
• ذرات لنفس العنصر بأعداد مختلفة من النيوترونات
• لها نفس العدد الذري لكن عدد كتلي مختلف
• مثال: الكربون-12 والكربون-14

## المدارات الإلكترونية

### قواعد توزيع الإلكترونات
1. **المدار الأول (K)**: يحتوي على 2 إلكترون كحد أقصى
2. **المدار الثاني (L)**: يحتوي على 8 إلكترونات كحد أقصى
3. **المدار الثالث (M)**: يحتوي على 18 إلكترون كحد أقصى
4. **المدار الرابع (N)**: يحتوي على 32 إلكترون كحد أقصى

### قاعدة الثمانية (Octet Rule)
• الذرات تميل لامتلاك 8 إلكترونات في المدار الخارجي
• هذا يجعلها مستقرة كيميائياً
• الاستثناء: الهيدروجين والهيليوم (قاعدة الاثنين)

## أهمية فهم التركيب الذري

### في الكيمياء
• فهم كيفية تكوين الروابط الكيميائية
• التنبؤ بخصائص العناصر
• تفسير السلوك الكيميائي للمواد

### في التطبيقات العملية
• الطب النووي والعلاج الإشعاعي
• توليد الطاقة النووية
• تحديد عمر الآثار بالكربون المشع
• صناعة أشباه الموصلات

## خلاصة المفاهيم الرئيسية
1. الذرة تتكون من نواة ونظام من الإلكترونات
2. النواة تحتوي على البروتونات والنيوترونات
3. العدد الذري يحدد هوية العنصر
4. توزيع الإلكترونات يحدد الخصائص الكيميائية
5. النظائر هي أشكال مختلفة لنفس العنصر`,
      summary: 'الذرة تتكون من نواة تحتوي على بروتونات ونيوترونات، وإلكترونات تدور حولها في مدارات. العدد الذري يحدد نوع العنصر.',
      quiz: [
        {
          question: 'ما هي مكونات النواة الذرية؟',
          options: ['البروتونات فقط', 'النيوترونات فقط', 'البروتونات والنيوترونات', 'الإلكترونات والبروتونات'],
          correct: 2
        },
        {
          question: 'كم إلكترون يمكن أن يحتويه المدار الثاني؟',
          options: ['2', '8', '18', '32'],
          correct: 1
        }
      ],
      createdAt: new Date().toLocaleDateString('ar')
    },
    {
      id: 2,
      title: 'أنواع الروابط الكيميائية',
      content: `الروابط الكيميائية هي القوى التي تربط بين الذرات لتكوين الجزيئات والمركبات. هناك ثلاثة أنواع رئيسية من الروابط:

1. الرابطة الأيونية: تتكون بين الفلزات واللافلزات عندما يفقد الفلز إلكتروناً ويكتسبه اللافلز، مما ينتج عنه أيونات موجبة وسالبة تتجاذب. مثال: كلوريد الصوديوم (NaCl).

2. الرابطة التساهمية: تتكون عندما تتشارك ذرتان أو أكثر في الإلكترونات. يمكن أن تكون أحادية أو ثنائية أو ثلاثية حسب عدد أزواج الإلكترونات المتشاركة. مثال: جزيء الماء (H₂O).

3. الرابطة الفلزية: تتكون بين ذرات الفلزات حيث تكون الإلكترونات حرة الحركة في "بحر إلكتروني"، مما يفسر خصائص الفلزات كالتوصيل الكهربائي.

كل نوع من هذه الروابط يعطي المادة خصائص مميزة من حيث الصلابة ونقطة الانصهار والتوصيل.`,
      summary: 'الروابط الكيميائية تشمل الأيونية (بين فلز ولافلز)، التساهمية (تشارك إلكترونات)، والفلزية (إلكترونات حرة).',
      quiz: [
        {
          question: 'أي نوع من الروابط يتكون بين الصوديوم والكلور؟',
          options: ['تساهمية', 'أيونية', 'فلزية', 'هيدروجينية'],
          correct: 1
        },
        {
          question: 'ما الذي يحدث في الرابطة التساهمية؟',
          options: ['انتقال إلكترونات', 'تشارك إلكترونات', 'فقدان إلكترونات', 'زيادة البروتونات'],
          correct: 1
        }
      ],
      createdAt: new Date().toLocaleDateString('ar')
    },
    {
      id: 3,
      title: 'أحماض وقواعد أرهينيوس',
      content: `نظرية أرهينيوس هي أولى النظريات لتعريف الأحماض والقواعد:

الحمض حسب أرهينيوس: هو المادة التي تتأين في المحلول المائي وتعطي أيونات الهيدروجين الموجبة (H⁺). مثال: حمض الهيدروكلوريك HCl → H⁺ + Cl⁻

القاعدة حسب أرهينيوس: هي المادة التي تتأين في المحلول المائي وتعطي أيونات الهيدروكسيد السالبة (OH⁻). مثال: هيدروكسيد الصوديوم NaOH → Na⁺ + OH⁻

خصائص الأحماض:
- طعم لاذع (حامض)
- تحمر ورقة عباد الشمس الزرقاء
- تتفاعل مع القواعد والفلزات النشطة
- موصلة للكهرباء

خصائص القواعد:
- طعم قابض ومر
- تزرق ورقة عباد الشمس الحمراء
- ملمس صابوني
- تتفاعل مع الأحماض

تفاعل التعادل: حمض + قاعدة → ملح + ماء
مثال: HCl + NaOH → NaCl + H₂O`,
      summary: 'الأحماض تعطي H⁺ في الماء والقواعد تعطي OH⁻. تفاعل التعادل بينهما ينتج ملح وماء.',
      quiz: [
        {
          question: 'ماذا تعطي القواعد في المحلول المائي؟',
          options: ['أيونات H⁺', 'أيونات OH⁻', 'أيونات Na⁺', 'أيونات Cl⁻'],
          correct: 1
        },
        {
          question: 'ما ناتج تفاعل HCl مع NaOH؟',
          options: ['NaCl + H₂O', 'NaH + ClOH', 'H₂ + NaClO', 'Na₂O + HCl'],
          correct: 0
        }
      ],
      createdAt: new Date().toLocaleDateString('ar')
    },
    {
      id: 4,
      title: 'قانون حفظ الكتلة والمعادلات الكيميائية',
      content: `قانون حفظ الكتلة وضعه العالم لافوازييه وينص على: "في التفاعل الكيميائي، الكتلة لا تفنى ولا تستحدث، بل تتحول من شكل إلى آخر".

هذا يعني أن مجموع كتل المواد المتفاعلة يساوي مجموع كتل المواد الناتجة.

المعادلة الكيميائية هي تمثيل رمزي للتفاعل الكيميائي، وتتكون من:
- المواد المتفاعلة (على اليسار)
- سهم يشير إلى اتجاه التفاعل
- المواد الناتجة (على اليمين)
- معاملات للتوازن

خطوات وزن المعادلة الكيميائية:
1. اكتب المعادلة غير موزونة
2. احسب عدد ذرات كل عنصر في الطرفين
3. ضع معاملات لجعل العدد متساوي في الطرفين
4. ابدأ بأكثر العناصر تعقيداً
5. اتركوا H و O للنهاية

مثال: 2H₂ + O₂ → 2H₂O
هنا: 4 ذرات H و 2 ذرة O في كلا الطرفين`,
      summary: 'قانون حفظ الكتلة ينص على أن الكتلة محفوظة في التفاعلات. المعادلات الكيميائية تمثل التفاعلات ويجب وزنها.',
      quiz: [
        {
          question: 'من وضع قانون حفظ الكتلة؟',
          options: ['دالتون', 'مندلييف', 'لافوازييه', 'أفوجادرو'],
          correct: 2
        },
        {
          question: 'ما هو المعامل المناسب للأكسجين في المعادلة: H₂ + O₂ → H₂O؟',
          options: ['1', '2', '3', '4'],
          correct: 0
        }
      ],
      createdAt: new Date().toLocaleDateString('ar')
    },
    {
      id: 5,
      title: 'الجدول الدوري وتطوره التاريخي',
      content: `الجدول الدوري هو ترتيب منظم لجميع العناصر الكيميائية المعروفة حسب العدد الذري.

التطور التاريخي:
1. مندلييف (1869): رتب العناصر حسب الكتلة الذرية وترك فراغات للعناصر غير المكتشفة
2. موزلي (1913): رتب العناصر حسب العدد الذري بدلاً من الكتلة
3. الجدول الحديث: يحتوي على 118 عنصر مرتبة في دورات ومجموعات

خصائص الجدول الدوري:
- الدورات الأفقية: تحتوي على عناصر لها نفس عدد المدارات الإلكترونية
- المجموعات الرأسية: تحتوي على عناصر لها نفس عدد إلكترونات التكافؤ
- الخصائص تتكرر بشكل دوري

المجموعات الرئيسية:
- المجموعة 1: الفلزات القلوية
- المجموعة 2: الفلزات القلوية الترابية
- المجموعة 17: الهالوجينات
- المجموعة 18: الغازات النبيلة

الاتجاهات الدورية:
- نصف القطر الذري يقل من اليسار إلى اليمين
- طاقة التأين تزيد من اليسار إلى اليمين
- الصفة الفلزية تقل من اليسار إلى اليمين`,
      summary: 'الجدول الدوري ترتيب للعناصر حسب العدد الذري، طوره مندلييف ثم موزلي. العناصر مرتبة في دورات ومجموعات لها خصائص دورية.',
      quiz: [
        {
          question: 'من طور الجدول الدوري الحديث؟',
          options: ['مندلييف فقط', 'موزلي فقط', 'مندلييف ثم موزلي', 'دالتون'],
          correct: 2
        },
        {
          question: 'ماذا تسمى المجموعة 18 في الجدول الدوري؟',
          options: ['الهالوجينات', 'الغازات النبيلة', 'الفلزات القلوية', 'الفلزات الانتقالية'],
          correct: 1
        }
      ],
      createdAt: new Date().toLocaleDateString('ar')
    },
    {
      id: 6,
      title: 'العناصر الانتقالية وخصائصها',
      content: `العناصر الانتقالية تشغل الجزء المركزي من الجدول الدوري وتضم المجموعات 3-12. تتميز هذه العناصر بخصائص فريدة تجعلها مهمة جداً في الصناعة والتطبيقات التقنية.

## الخصائص العامة للعناصر الانتقالية

### الخصائص الفيزيائية
• **الصلابة العالية**: معظم العناصر الانتقالية صلبة وقوية
• **اللمعان الفلزي**: تتميز بلمعان معدني مميز
• **التوصيل العالي**: توصل الحرارة والكهرباء بشكل ممتاز
• **نقاط انصهار وغليان عالية**: عادة ما تكون أعلى من الفلزات الأخرى
• **القابلية للطرق والسحب**: يمكن تشكيلها بسهولص

### الخصائص الكيميائية
• **أرقام أكسدة متعددة**: يمكنها تكوين عدة أرقام أكسدة مختلفة
• **تكوين مركبات ملونة**: عديد من مركباتها ملونة
• **النشاط الحفزي**: يمكنها أن تعمل كحفاز في التفاعلات الكيميائية
• **تكوين معقدات مع الليجاندات**: تشكل مركبات معقدة مع الجزيئات الأخرى

## العناصر الانتقالية المهمة

### الحديد (Iron - Fe)
• **العدد الذري**: 26
• **أرقام الأكسدة**: +2 و +3 (الأكثر شيوعاً)
• **الاستخدامات**:
  - صناعة الصلب والفولاذ
  - صناعة السيارات والطائرات
  - البناء والإنشاءات
  - نقل الأكسجين في الدم (الهيموجلوبين)

### النحاس (Copper - Cu)
• **العدد الذري**: 29
• **أرقام الأكسدة**: +1 و +2
• **الاستخدامات**:
  - الأسلاك الكهربائية (موصل ممتاز)
  - أنابيب المياه والغازات
  - صناعة البرونز (مع القصدير)
  - المجوهرات والعملات

### الزنك (Zinc - Zn)
• **العدد الذري**: 30
• **رقم الأكسدة**: +2 (معظم المركبات)
• **الاستخدامات**:
  - طلاء المعادن (مقاومة الصدأ)
  - صناعة البطاريات
  - صناعة البراس (مع النحاس)
  - مكملات غذائية (ضروري للجسم)

### الفضة (Silver - Ag)
• **العدد الذري**: 47
• **رقم الأكسدة**: +1 (الأكثر شيوعاً)
• **الاستخدامات**:
  - المجوهرات والزينة
  - العملات والاستثمار
  - الإلكترونيات (أفضل موصل للكهرباء)
  - مضاد للبكتيريا (في بعض التطبيقات)

### الذهب (Gold - Au)
• **العدد الذري**: 79
• **أرقام الأكسدة**: +1 و +3
• **الاستخدامات**:
  - المجوهرات والزينة
  - العملات والاستثمار
  - الإلكترونيات الدقيقة (مقاوم للتآكل)
  - طب الأسنان والجراحة

## التطبيقات الصناعية

### في صناعة السيارات
• هياكل السيارى من الصلب (حديد + كربون)
• حفازات العادم من البلاتين والروديوم
• أنظمة التبريد من النحاس والألومنيوم

### في التقنية
• معالجات الأجهزة الإلكترونية
• مغناطيس الأقراص الصلبة
• شاشات الهواتف والحاسوب

### في الطب
• التصوير بالرنين المغناطيسي (MRI)
• زرعات العظام والمفاصل
• أجهزة تنظيم ضربات القلب

## الأهمية الاقتصادية

العناصر الانتقالية تشكل عمود الاقتصاد العالمي:
• سوق الحديد والصلب يقدر بمليارات الدولارات
• الذهب والفضة مخزن قيمة واستثمار
• النحاس ضروري للبنية التحتية الكهربائية
• بعض العناصر مثل البلاتين والروديوم أثمن من الذهب

## مستقبل العناصر الانتقالية

• **الطاقة المتجددة**: خلايا وقود الهيدروجين تحتاج عناصر انتقالية
• **النانوتقنية**: استخدام جسيمات نانوية للعناصر الانتقالية
• **الطب المتقدم**: علاج السرطان بالعناصر المشعة
• **الفضاء**: مواد مقاومة للحرارة العالية

## خلاصة المفاهيم الرئيسية

1. العناصر الانتقالية تقع في وسط الجدول الدوري
2. تتميز بخصائص فيزيائية وكيميائية مميزة
3. الحديد والنحاس والزنك من أهم العناصر صناعياً
4. الذهب والفضة لهما قيمة اقتصادية عالية
5. تلعب دوراً مهماً في التقنيات الحديثة`,
      summary: 'العناصر الانتقالية تشغل وسط الجدول الدوري وتتميز بالصلابة واللمعان والتوصيل العالي. الحديد والنحاس والزنك مهمة صناعياً.',
      quiz: [
        {
          question: 'في أي مجموعات تقع العناصر الانتقالية؟',
          options: ['1-2', '3-12', '13-18', '1-18'],
          correct: 1
        },
        {
          question: 'ما هو العنصر الأساسي في صناعة الصلب؟',
          options: ['النحاس', 'الحديد', 'الزنك', 'الفضة'],
          correct: 1
        }
      ],
      createdAt: new Date().toLocaleDateString('ar')
    },
    {
      id: 7,
      title: 'تفاعلات الأكسدة والاختزال',
      content: `تفاعلات الأكسدة والاختزال (Redox Reactions) هي من أهم التفاعلات الكيميائية وأكثرها شيوعاً في الطبيعة والصناعة. تتضمن هذه التفاعلات انتقال الإلكترونات بين المواد المتفاعلة.

## المفاهيم الأساسية

### تعريف الأكسدة والاختزال
• **الأكسدة (Oxidation)**: عملية فقدان الإلكترونات
• **الاختزال (Reduction)**: عملية كسب الإلكترونات
• هذتان العمليتان تحدثان دائماً معاً في نفس التفاعل

### أرقام الأكسدة (Oxidation Numbers)
أرقام الأكسدة هي أرقام افتراضية تعبر عن عدد الإلكترونات التي يفقدها أو يكتسبها العنصر.

#### قواعد حساب أرقام الأكسدة
1. **العناصر الحرة**: رقم الأكسدة = 0
   - مثال: H₂, O₂, N₂, Cl₂

2. **الأيونات البسيطة**: رقم الأكسدة = شحنة الأيون
   - مثال: Na⁺ (+1), Cl⁻ (-1), Mg²⁺ (+2)

3. **الهيدروجين**: عادة +1 (ماعدا في الهيدريدات حيث يكون -1)

4. **الأكسجين**: عادة -2 (ماعدا في البيروكسيدات حيث يكون -1)

5. **مجموع أرقام الأكسدة**: يساوي الشحنة الإجمالية

### أمثلة على حساب أرقام الأكسدة
• **في H₂SO₄**:
  - H: +1 × 2 = +2
  - O: -2 × 4 = -8
  - S: +6 (ليكون المجموع = 0)

• **في NH₃**:
  - H: +1 × 3 = +3
  - N: -3 (ليكون المجموع = 0)

## أنواع تفاعلات الأكسدة والاختزال

### 1. تفاعلات الاحتراق
هذه التفاعلات تتضمن اتحاد مادة مع الأكسجين:

**مثال: احتراق الميثان**
CH₄ + 2O₂ → CO₂ + 2H₂O
• الكربون يتأكسد من -4 إلى +4
• الأكسجين يختزل من 0 إلى -2

### 2. تفاعلات الإزاحة
تتضمن إزالة الأكسجين أو إضافة الهيدروجين:

**مثال: اختزال أكسيد الحديد**
Fe₂O₃ + 3CO → 2Fe + 3CO₂
• الحديد يختزل من +3 إلى 0
• الكربون يتأكسد من +2 إلى +4

### 3. تفاعلات البطاريات
تحويل الطاقة الكيميائية إلى طاقة كهربائية:

**مثال: بطارية الزنك-الكربون**
• القطب السالب: Zn → Zn²⁺ + 2e⁻ (أكسدة)
• القطب الموجب: MnO₂ + 4H⁺ + 2e⁻ → Mn²⁺ + 2H₂O (اختزال)

## وزن معادلات الأكسدة والاختزال

### طريقة الذرة والإلكترون
خطوات وزن المعادلة:

1. **تحديد أرقام الأكسدة** لجميع العناصر
2. **تحديد العناصر المؤكسدة والمختزلة**
3. **كتابة نصف معادلات منفصلة**
4. **وزن الذرات باستثناء H و O**
5. **وزن ذرات الأكسجين بإضافة H₂O**
6. **وزن ذرات الهيدروجين بإضافة H⁺**
7. **وزن الشحنات بإضافة e⁻**
8. **جعل عدد الإلكترونات متساوي**
9. **جمع نصفي المعادلتين**

### مثال عملي: تفاعل برمنجنات البوتاسيوم مع الحديد

KMnO₄ + FeSO₄ + H₂SO₄ → MnSO₄ + Fe₂(SO₄)₃ + K₂SO₄ + H₂O

**نصف معادلة الاختزال**:
MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O

**نصف معادلة الأكسدة**:
Fe²⁺ → Fe³⁺ + e⁻

**المعادلة الموزونة**:
KMnO₄ + 5FeSO₄ + 8H₂SO₄ → MnSO₄ + 2.5Fe₂(SO₄)₃ + K₂SO₄ + 8H₂O

## التطبيقات العملية

### في الصناعة
• **عمليات الطلاء الكهربائي**: اختزال أيونات الفلزات
• **إنتاج الفلزات**: اختزال خامات الفلزات
• **صناعة الورق**: استخدام مواد مبيضة مؤكسدة
• **معالجة المياه**: الأوزون والكلور

### في البيولوجيا
• **التنفس الخلوي**: أكسدة الجلوكوز لإنتاج طاقة
• **البناء الضوئي**: اختزال CO₂ لتكوين السكر
• **نقل الأكسجين**: الهيموجلوبين في الدم

### في البيئة
• **دورة النيتروجين**: البكتيريا تحول بين أشكال النيتروجين
• **تآكل المعادن**: أكسدة الحديد والفلزات الأخرى
• **معالجة مياه الصرف**: إزالة الملوثات

## العوامل المؤكسدة والمختزلة

### العوامل المؤكسدة الشائعة
• **الأكسجين (O₂)**: في الاحتراق
• **برمنجنات البوتاسيوم (KMnO₄)**: في المعايرة
• **ثنائي كرومات البوتاسيوم (K₂Cr₂O₇)**: في المعايرة
• **بيروكسيد الهيدروجين (H₂O₂)**: في التطبيقات الطبية

### العوامل المختزلة الشائعة
• **الهيدروجين (H₂)**: في اختزال الفلزات
• **أول أكسيد الكربون (CO)**: في صهر المعادن
• **الفلزات النشطة**: مثل الزنك والماغنيسيوم
• **بوروهيدريد الصوديوم (NaBH₄)**: في الكيمياء العضوية

## أهمية وفوائد تفاعلات الأكسدة والاختزال

• **إنتاج الطاقة**: في البطاريات وخلايا الوقود
• **الحياة نفسها**: التنفس والبناء الضوئي
• **الصناعة**: إنتاج الفلزات والمواد الكيميائية
• **البيئة**: دورات العناصر ومعالجة النفايات
• **الطب**: مضادات الأكسدة والعلاجات

## خلاصة المفاهيم الرئيسية

1. الأكسدة = فقدان إلكترونات، الاختزال = كسب إلكترونات
2. أرقام الأكسدة تساعد في تحديد نوع التفاعل
3. وزن المعادلات يتطلب معادلة الذرات والشحنات
4. هذه التفاعلات أساسية للحياة والتكنولوجيا
5. لها تطبيقات واسعة في الصناعة والبيئة والطب`,
      summary: 'تفاعلات الأكسدة والاختزال تتضمن انتقال إلكترونات. الأكسدة = فقدان إلكترونات، الاختزال = كسب إلكترونات. لها تطبيقات مهمة في البطاريات والصناعة.',
      quiz: [
        {
          question: 'ماذا يحدث للعنصر عند الأكسدة؟',
          options: ['يكتسب إلكترونات', 'يفقد إلكترونات', 'يبقى دون تغيير', 'يزيد عدد البروتونات'],
          correct: 1
        },
        {
          question: 'ما هو رقم الأكسدة للهيدروجين في معظم المركبات؟',
          options: ['-1', '0', '+1', '+2'],
          correct: 2
        }
      ],
      createdAt: new Date().toLocaleDateString('ar')
    }
  ]);
  const [currentLesson, setCurrentLesson] = useState({ title: '', content: '' });
  const [selectedElement, setSelectedElement] = useState<{category: string} | null>(null);
  const [selectedLessonForView, setSelectedLessonForView] = useState<any | null>(null);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);

  // دوال حساب التوزيع الإلكتروني المتقدم مع المدارات الفرعية
  const getElectronConfiguration = (atomicNumber: number) => {
    // ترتيب الأوربيتالات حسب مبدأ أوفباو (Aufbau Principle)
    const orbitals = [
      { name: '1s', max: 2 },
      { name: '2s', max: 2 },
      { name: '2p', max: 6 },
      { name: '3s', max: 2 },
      { name: '3p', max: 6 },
      { name: '4s', max: 2 },
      { name: '3d', max: 10 },
      { name: '4p', max: 6 },
      { name: '5s', max: 2 },
      { name: '4d', max: 10 },
      { name: '5p', max: 6 },
      { name: '6s', max: 2 },
      { name: '4f', max: 14 },
      { name: '5d', max: 10 },
      { name: '6p', max: 6 }
    ];
    
    const config: Array<{ orbital: string; electrons: number }> = [];
    let remaining = atomicNumber;
    
    for (const orbital of orbitals) {
      if (remaining <= 0) break;
      const electrons = Math.min(orbital.max, remaining);
      if (electrons > 0) {
        config.push({ orbital: orbital.name, electrons });
        remaining -= electrons;
      }
    }
    
    return config;
  };

  const getQuantumNumbers = (atomicNumber: number) => {
    const config = getElectronConfiguration(atomicNumber);
    const lastElectron = config[config.length - 1];
    
    if (!lastElectron) return null;
    
    const orbital = lastElectron.orbital;
    const n = parseInt(orbital[0]); // العدد الكمي الرئيسي
    const subshell = orbital.slice(1);
    
    let l = 0; // العدد الكمي الثانوي (الزخم الزاوي)
    switch (subshell[0]) {
      case 's': l = 0; break;
      case 'p': l = 1; break;
      case 'd': l = 2; break;
      case 'f': l = 3; break;
    }
    
    // العدد الكمي المغناطيسي m_l يعتمد على توزيع الإلكترونات في المدار الفرعي
    const possibleMl = [];
    for (let i = -l; i <= l; i++) {
      possibleMl.push(i);
    }
    
    return {
      n, // العدد الكمي الرئيسي
      l, // العدد الكمي الثانوي
      ml: possibleMl, // جميع قيم m_l الممكنة
      ms: ['+1/2', '-1/2'] // العدد الكمي المغزلي
    };
  };

  const getCorrectElectronDistribution = (atomicNumber: number, advanced = false) => {
    if (advanced) {
      return getElectronConfiguration(atomicNumber)
        .map(config => `${config.orbital}${config.electrons}`)
        .join(' ');
    } else {
      // التوزيع البسيط على الأغلفة الرئيسية
      const shells = [2, 8, 8, 18, 18, 32];
      const distribution = [];
      let remaining = atomicNumber;
      
      for (let i = 0; i < shells.length && remaining > 0; i++) {
        const toAdd = Math.min(shells[i], remaining);
        if (toAdd > 0) {
          distribution.push(toAdd);
          remaining -= toAdd;
        }
      }
      
      return distribution;
    }
  };

  // دوال لعبة توزيع الإلكترونات المحسنة
  const selectElementForDistribution = (element: any) => {
    setSelectedElementForDistribution(element);
    setAvailableElectrons(element.atomicNumber || element.number);
    if (showAdvancedMode) {
      // في الوضع المتقدم، نبدأ بتوزيع فارغ للمدارات الفرعية
      setPlayerDistribution([]);
    } else {
      // في الوضع البسيط، نبدأ بتوزيع فارغ للأغلفة الرئيسية
      setPlayerDistribution([0, 0, 0, 0, 0, 0]);
    }
    setDistributionGameState('playing');
    setDistributionFeedback(null);
    setDistributionAttempts(0);
  };

  const checkDistributionAnswer = () => {
    if (!selectedElementForDistribution) return;
    
    setDistributionAttempts(prev => prev + 1);
    const atomicNumber = selectedElementForDistribution.atomicNumber || selectedElementForDistribution.number;
    
    let isCorrect = false;
    
    if (showAdvancedMode) {
      // فحص التوزيع المتقدم
      const correctConfig = getElectronConfiguration(atomicNumber);
      // تحتاج تنفيذ مقارنة معقدة للمدارات الفرعية
      isCorrect = true; // مبسط للآن
    } else {
      // فحص التوزيع البسيط
      const correct = getCorrectElectronDistribution(atomicNumber, false);
      const player = playerDistribution.filter(n => n > 0);
      isCorrect = Array.isArray(correct) && correct.length === player.length && 
                  correct.every((val, index) => val === player[index]);
    }
    
    if (isCorrect) {
      const points = Math.max(10 - distributionAttempts * 2, 2);
      setDistributionScore(prev => prev + points);
      setDistributionFeedback({
        correct: true,
        message: `ممتاز! حصلت على ${points} نقاط 🎉`
      });
    } else {
      const correctAnswer = showAdvancedMode 
        ? getCorrectElectronDistribution(atomicNumber, true)
        : (getCorrectElectronDistribution(atomicNumber, false) as number[]).join('-');
      setDistributionFeedback({
        correct: false,
        message: `غير صحيح. التوزيع الصحيح هو: ${correctAnswer}`
      });
    }
    setDistributionGameState('checking');
  };

  const updateShellElectrons = (shellIndex: number, change: number) => {
    const newDistribution = [...playerDistribution];
    const newValue = (newDistribution[shellIndex] || 0) + change;
    
    if (newValue >= 0) {
      newDistribution[shellIndex] = newValue;
      setPlayerDistribution(newDistribution);
      setAvailableElectrons(prev => prev - change);
    }
  };

  const resetDistributionGame = () => {
    setSelectedElementForDistribution(null);
    setPlayerDistribution([]);
    setAvailableElectrons(0);
    setDistributionGameState('selecting');
    setDistributionFeedback(null);
    setDistributionAttempts(0);
  };

  // تحميل تفضيل الوضع الداكن من localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // دالة تبديل الوضع الداكن
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const startElementGame = () => {
    if (gameActive) {
      if (gameTimer) clearInterval(gameTimer);
      setGameActive(false);
      setTimeLeft(60);
      return;
    }
    
    setGameActive(true);
    setGameScore(0);
    setTimeLeft(60);
    nextElement();
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setGameTimer(timer);
  };

  const nextElement = () => {
    const randomElement = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    setCurrentElement(randomElement);
  };

  const checkValency = (guessedValency) => {
    if (!currentElement || !gameActive) return;
    
    const isCorrect = currentElement.valence.includes(parseInt(guessedValency));
    if (isCorrect) {
      setGameScore(prev => prev + 10);
      toast.success(`صحيح! ${currentElement.name} له تكافؤ ${guessedValency}`);
    } else {
      toast.error(`خطأ! ${currentElement.name} له تكافؤ ${Array.isArray(currentElement.valence) ? currentElement.valence.join(' أو ') : 'غير محدد'}`);
    }
    
    nextElement();
  };

  const startQuiz = () => {
    setCurrentQuestion(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
  };

  const selectAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    
    setTimeout(() => {
      const isCorrect = answerIndex === QUIZ_QUESTIONS[currentQuestion].correct;
      if (isCorrect) {
        setQuizScore(prev => prev + 1);
        toast.success(`إجابة صحيحة! ${QUIZ_QUESTIONS[currentQuestion].explanation || ''}`);
      } else {
        const correctAnswer = QUIZ_QUESTIONS[currentQuestion].options[QUIZ_QUESTIONS[currentQuestion].correct];
        toast.error(`إجابة خاطئة! الإجابة الصحيحة: ${correctAnswer}. ${QUIZ_QUESTIONS[currentQuestion].explanation || ''}`);
      }
      
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const updateProgress = (section, increment) => {
    setLearningProgress(prev => ({
      ...prev,
      [section]: Math.min(prev[section] + increment, 100)
    }));
  };

  // دالة عرض تفاصيل الدرس
  const viewLessonDetails = (lesson) => {
    setSelectedLessonForView(lesson);
    setIsLessonDialogOpen(true);
  };

  // دالة حفظ الدرس
  const saveLesson = () => {
    if (currentLesson.title.trim() && currentLesson.content.trim()) {
      const newLesson = {
        id: Date.now(),
        title: currentLesson.title,
        content: currentLesson.content,
        summary: generateSummary(currentLesson.content),
        quiz: generateQuiz(currentLesson.content),
        createdAt: new Date().toLocaleDateString('ar')
      };
      setLessons(prev => [...prev, newLesson]);
      setCurrentLesson({ title: '', content: '' });
      toast.success('تم حفظ الدرس بنجاح!');
    } else {
      toast.error('يرجى كتابة عنوان ومحتوى الدرس');
    }
  };

  // دالة التلخيص التلقائي البسيط
  const generateSummary = (content) => {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 0);
    const importantWords = ['كيمياء', 'عنصر', 'مركب', 'تفاعل', 'أيون', 'تكافؤ', 'حمض', 'قاعدة', 'ملح', 'أكسيد'];
    
    const importantSentences = sentences
      .filter(sentence => 
        importantWords.some(word => sentence.includes(word))
      )
      .slice(0, 3)
      .map(s => s.trim() + '.');
    
    return importantSentences.length > 0 
      ? importantSentences.join(' ')
      : sentences.slice(0, 2).map(s => s.trim() + '.').join(' ');
  };

  // دالة توليد الأسئلة التلقائية
  const generateQuiz = (content: string) => {
    const questions: Array<{question: string, options: string[], correct: number}> = [];
    
    // بحث عن أسماء العناصر في المحتوى
    const elementNames = ELEMENTS.map(el => el.name);
    const foundElements = elementNames.filter(name => content.includes(name));
    
    if (foundElements.length > 0) {
      const randomElement = foundElements[Math.floor(Math.random() * foundElements.length)];
      const element = ELEMENTS.find(el => el.name === randomElement);
      if (element) {
        questions.push({
          question: `ما هو رمز عنصر ${randomElement}؟`,
          options: [element.symbol, 'X', 'Y', 'Z'],
          correct: 0
        });
      }
    }
    
    // أسئلة عامة عن الكيمياء
    if (content.includes('حمض')) {
      questions.push({
        question: 'ما هي خاصية الأحماض الرئيسية؟',
        options: ['تحمر ورقة عباد الشمس', 'تزرق ورقة عباد الشمس', 'لا تؤثر على الورق', 'تذيب الورق'],
        correct: 0
      });
    }
    
    if (content.includes('قاعدة')) {
      questions.push({
        question: 'ما هي خاصية القواعد الرئيسية؟',
        options: ['تحمر ورقة عباد الشمس', 'تزرق ورقة عباد الشمس', 'لا تؤثر على الورق', 'تذيب الورق'],
        correct: 1
      });
    }
    
    return questions.length > 0 ? questions : [
      {
        question: 'ما هو العنصر الأكثر انتشاراً في الكون؟',
        options: ['الهيدروجين', 'الأكسجين', 'الكربون', 'الهيليوم'],
        correct: 0
      }
    ];
  };

  // دالة حذف الدرس
  const deleteLesson = (lessonId) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
    toast.success('تم حذف الدرس!');
  };

  const ElementCard = ({ element, onClick, showDetails = false }) => (
    <div
      className={`group relative p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg touch-manipulation overflow-hidden`}
      style={{ 
        borderColor: element.color,
        background: `linear-gradient(135deg, ${element.color}20, ${element.color}05)`
      }}
      onClick={() => onClick?.(element)}
    >
      <div className="text-center relative z-10">
        <div 
          className="text-xl sm:text-2xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300"
          style={{ color: element.color }}
        >
          {element.symbol}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground mb-2 leading-tight group-hover:text-foreground transition-colors">{element.name}</div>
        <div className="text-[10px] sm:text-xs mb-1">
          التكافؤ: {Array.isArray(element.valence) ? element.valence.join(', ') : '—'}
        </div>
        {showDetails && element.atomicMass && (
          <div className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            الكتلة الذرية: {element.atomicMass}
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div 
          className="absolute inset-0 rounded-xl opacity-10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
          style={{ background: `linear-gradient(90deg, transparent, ${element.color}, transparent)` }}
        ></div>
      </div>
      
      {element.description && (
        <div className="absolute inset-x-0 bottom-0 p-2 bg-black/80 text-white text-[10px] leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-full group-hover:translate-y-0">
          {element.description.substring(0, 80)}...
        </div>
      )}
    </div>
  );

  const CompoundCard = ({ compound }) => (
    <Card className={`transition-all duration-300 hover:scale-105 border-l-4 touch-manipulation group ${
      compound.type === 'acid' ? 'border-l-red-500 hover:shadow-red-500/20' :
      compound.type === 'base' ? 'border-l-blue-500 hover:shadow-blue-500/20' :
      compound.type === 'salt' ? 'border-l-green-500 hover:shadow-green-500/20' :
      'border-l-purple-500 hover:shadow-purple-500/20'
    } hover:shadow-lg`}>
      <CardContent className="p-3 sm:p-4">
        <div className="text-base sm:text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{compound.name}</div>
        <div className="text-xl sm:text-2xl font-mono mb-2 text-primary group-hover:scale-105 transition-transform">{compound.formula}</div>
        <Badge variant="outline" className="text-xs mb-2">
          {compound.type === 'acid' ? 'حمض' :
           compound.type === 'base' ? 'قاعدة' :
           compound.type === 'salt' ? 'ملح' : 'أكسيد'}
        </Badge>
        {compound.description && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {compound.description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            direction: 'rtl',
            textAlign: 'right'
          }
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 transition-colors duration-300">
      <nav className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 transition-colors" />
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent transition-colors">
                <span className="hidden sm:inline">Chemistry Lab</span>
                <span className="sm:hidden">Chemistry</span>
              </h1>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="rounded-full w-10 h-10 p-0"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600 dark:text-slate-200 transition-colors" />
                )}
              </Button>
              
              <div className="flex gap-1">
                {[
                  { key: 'home', icon: Beaker, label: 'Home' },
                  { key: 'elements', icon: Atom, label: 'Elements' },
                  
                  { key: 'electron-distribution', icon: Settings, label: 'Electron Distribution' },
                  { key: 'compounds', icon: FlaskConical, label: 'Compounds' },
                  { key: 'lessons', icon: BookOpen, label: 'Lessons' },
                  { key: 'game', icon: Target, label: 'Game' },
                  { key: 'quiz', icon: Award, label: 'Quiz' }
                ].map(({ key, icon: Icon, label }) => (
                  <Button
                    key={key}
                    variant={currentSection === key ? 'default' : 'ghost'}
                    onClick={() => setCurrentSection(key)}
                    className="text-sm px-3 py-2"
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="rounded-full w-9 h-9 p-0"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-yellow-500" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600 dark:text-slate-200 transition-colors" />
                )}
              </Button>
              
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-lg w-9 h-9 p-0">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                  <div className="flex flex-col gap-4 mt-6">
                    <div className="flex items-center gap-2 pb-4 border-b">
                      <FlaskConical className="w-6 h-6 text-blue-600 dark:text-blue-300 transition-colors" />
                      <span className="text-lg font-bold">Chemistry Lab</span>
                    </div>
                    
                    {[
                      { key: 'home', icon: Beaker, label: 'الصفحة الرئيسية', desc: 'الصفحة الرئيسية والمعلومات العامة' },
                      { key: 'elements', icon: Atom, label: 'العناصر الكيميائية', desc: 'الجدول الدوري والتكافؤات' },
                      
                      { key: 'electron-distribution', icon: Settings, label: 'توزيع الإلكترونات', desc: 'لعبة توزيع الإلكترونات والمدارات الفرعية' },
                      { key: 'compounds', icon: FlaskConical, label: 'المركبات الكيميائية', desc: 'الأحماض والقواعد والأملاح' },
                      { key: 'chatbot', icon: Bot, label: 'المساعد الذكي', desc: 'اسأل أي سؤال كيميائي واحصل على إجابة فورية' },
                      { key: 'lessons', icon: BookOpen, label: 'قسم الدروس', desc: 'اكتب واحفظ دروسك الخاصة' },
                      { key: 'game', icon: Target, label: 'لعبة التكافؤ', desc: 'اختبر معرفتك بطريقة ممتعة' },
                      { key: 'quiz', icon: Award, label: 'الاختبار الشامل', desc: 'قيم مستواك في الكيمياء' }
                    ].map(({ key, icon: Icon, label, desc }) => (
                      <Button
                        key={key}
                        variant={currentSection === key ? 'default' : 'ghost'}
                        onClick={() => {
                          setCurrentSection(key);
                          setIsMobileMenuOpen(false);
                        }}
                        className="justify-start h-auto p-4 sm:p-5 flex-col items-start gap-1 text-right touch-manipulation active:scale-95 transition-all duration-200 hover:scale-[1.02] min-h-[4rem] sm:min-h-[4.5rem]"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          <span className="font-semibold text-sm sm:text-base">{label}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground text-right leading-relaxed">{desc}</span>
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex md:hidden lg:hidden mt-3 gap-1 overflow-x-auto pb-2">
            {[
              { key: 'home', icon: Beaker, label: 'Home' },
              { key: 'elements', icon: Atom, label: 'Elements' },
              
              { key: 'electron-distribution', icon: Settings, label: 'Electrons' },
              { key: 'compounds', icon: FlaskConical, label: 'Compounds' },
              { key: 'chatbot', icon: Bot, label: 'AI Chat' },
              { key: 'lessons', icon: BookOpen, label: 'Lessons' },
              { key: 'game', icon: Target, label: 'Game' },
              { key: 'quiz', icon: Award, label: 'Quiz' }
            ].map(({ key, icon: Icon, label }) => (
              <Button
                key={key}
                variant={currentSection === key ? 'default' : 'ghost'}
                onClick={() => setCurrentSection(key)}
                className="flex-shrink-0 text-xs px-3 py-3 sm:px-4 sm:py-3 h-auto flex-col gap-1 min-w-[4rem] min-h-[3.5rem] touch-manipulation active:scale-95 transition-all duration-200 hover:scale-105"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs font-medium">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {currentSection === 'home' && (
          <div className="space-y-8 sm:space-y-12">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="flex justify-center">
                <div className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <Beaker className="w-12 h-12 sm:w-16 sm:h-16" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight px-4">
                Welcome to Interactive Chemistry Lab
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Learn chemistry in a fun and interactive way with games, quizzes, and virtual experiments
              </p>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 border-blue-200 dark:border-blue-700/50 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Your Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(learningProgress).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm text-foreground">
                        <span>
                          {key === 'elements' && 'Elements'}
                          {key === 'compounds' && 'Compounds'}
                          {key === 'acids' && 'Acids'}
                          {key === 'valency' && 'Valency'}
                        </span>
                        <span>{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer border-blue-200 touch-manipulation min-h-[8rem] sm:min-h-[9rem]" onClick={() => setCurrentSection('elements')}>
                <CardHeader className="text-center p-4 sm:p-6">
                  <div className="mx-auto p-3 sm:p-4 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Atom className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Element Table</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <CardDescription className="text-center text-sm sm:text-base">
                    Explore chemical elements and their valencies interactively
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer border-purple-200 touch-manipulation min-h-[8rem] sm:min-h-[9rem]" onClick={() => setCurrentSection('compounds')}>
                <CardHeader className="text-center p-4 sm:p-6">
                  <div className="mx-auto p-3 sm:p-4 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <FlaskConical className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Chemical Compounds</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <CardDescription className="text-center text-sm sm:text-base">
                    Learn acids, bases, salts and chemical formulas
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer border-green-200 touch-manipulation min-h-[8rem] sm:min-h-[9rem]" onClick={() => setCurrentSection('game')}>
                <CardHeader className="text-center p-4 sm:p-6">
                  <div className="mx-auto p-3 sm:p-4 rounded-full bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <Target className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Valency Game</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <CardDescription className="text-center text-sm sm:text-base">
                    Test your knowledge of element valencies in a fast and exciting game
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer border-red-200 touch-manipulation min-h-[8rem] sm:min-h-[9rem]" onClick={() => setCurrentSection('quiz')}>
                <CardHeader className="text-center p-4 sm:p-6">
                  <div className="mx-auto p-3 sm:p-4 rounded-full bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Award className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Comprehensive Quiz</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <CardDescription className="text-center text-sm sm:text-base">
                    Evaluate your chemistry level with an interactive comprehensive test
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-yellow-200 dark:border-yellow-600/50 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Did you know?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: '💧',
                      title: 'الماء',
                      description: 'الماء (H₂O) يتكون من ذرتين من الهيدروجين وذرة واحدة من الأكسجين'
                    },
                    {
                      icon: '🧂',
                      title: 'الملح',
                      description: 'ملح الطعام (NaCl) يتكون من الصوديوم والكلور'
                    },
                    {
                      icon: '⚡',
                      title: 'التفاعلات',
                      description: 'الأحماض تتفاعل مع القواعد لتكوين الأملاح والماء'
                    }
                  ].map((fact, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-lg transition-all duration-300">
                      <div className="text-2xl mb-2">{fact.icon}</div>
                      <div className="font-semibold mb-2 text-sm sm:text-base text-foreground">{fact.title}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{fact.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentSection === 'periodic-table' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent transition-colors">
                الجدول الدوري التفاعلي
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                استكشف جميع عناصر الجدول الدوري ومعلوماتها التفصيلية
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">تصنيف العناصر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    { category: 'all', label: 'جميع العناصر', color: 'bg-gray-500' },
                    { category: 'alkali-metal', label: 'فلزات قلوية', color: 'bg-red-500' },
                    { category: 'alkaline-earth-metal', label: 'فلزات قلوية ترابية', color: 'bg-orange-500' },
                    { category: 'transition-metal', label: 'فلزات انتقالية', color: 'bg-yellow-500' },
                    { category: 'post-transition-metal', label: 'فلزات فرعية', color: 'bg-green-500' },
                    { category: 'metalloid', label: 'أشباه فلزات', color: 'bg-blue-500' },
                    { category: 'nonmetal', label: 'لافلزات', color: 'bg-purple-500' },
                    { category: 'halogen', label: 'هالوجينات', color: 'bg-pink-500' },
                    { category: 'noble-gas', label: 'غازات نبيلة', color: 'bg-indigo-500' },
                    { category: 'lanthanide', label: 'لانثانيدات', color: 'bg-cyan-500' },
                    { category: 'actinide', label: 'أكتينيدات', color: 'bg-sky-500' }
                  ].map(({ category, label, color }) => (
                    <Button
                      key={category}
                      variant="outline"
                      size="sm"
                      className={`text-xs ${selectedElement?.category === category || (category === 'all' && !selectedElement) ? 'border-2 border-primary' : ''}`}
                      onClick={() => setSelectedElement(category === 'all' ? null : { category })}
                    >
                      <div className={`w-3 h-3 rounded-full mr-2 ${color}`}></div>
                      {label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-white dark:bg-gray-900/80 p-2 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl overflow-x-auto backdrop-blur-sm transition-colors duration-300">
              <div className="block sm:hidden mb-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold mb-2">عرض العناصر حسب الفئة</h3>
                  <p className="text-sm text-muted-foreground">للعرض الأمثل على الجوال، اختر فئة من الأعلى</p>
                </div>
                
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                  {PERIODIC_TABLE_ELEMENTS
                    .filter(element => !selectedElement || element.category === selectedElement.category)
                    .sort((a, b) => a.atomicNumber - b.atomicNumber)
                    .map((element) => {
                      const egyptianInfo = EGYPTIAN_CURRICULUM_DATA[element.symbol];
                      return (
                        <div
                          key={element.atomicNumber}
                          className="group relative rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center text-center p-2 min-h-[80px]"
                          style={{
                            borderColor: element.color,
                            background: `linear-gradient(135deg, ${element.color}20, ${element.color}05)`,
                          }}
                          onClick={() => {
                            updateProgress('elements', 2);
                            openElementDetails(element);
                          }}
                        >
                          <div className="text-xs text-muted-foreground">{element.atomicNumber}</div>
                          <div className="text-lg font-bold" style={{ color: element.color }}>{element.symbol}</div>
                          <div className="text-xs text-muted-foreground truncate w-full">{element.name}</div>
                          {egyptianInfo && (
                            <div className="text-[10px] text-green-600 dark:text-green-400 mt-1">منهج مصري</div>
                          )}
                          {element.atomicMass && <div className="text-[10px] opacity-60">{element.atomicMass.toFixed(1)}</div>}
                        </div>
                      );
                    })}
                </div>
              </div>
              
              <div className="hidden sm:block">
                <div className="min-w-[600px] sm:min-w-[800px] lg:min-w-[1200px] mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7].map((period) => (
                    <div key={period} className="grid gap-[1px] sm:gap-0.5 lg:gap-1 mb-0.5 sm:mb-1" 
                         style={{ gridTemplateColumns: 'repeat(18, minmax(20px, 1fr))' }}>
                      {Array.from({length: 18}, (_, groupIndex) => {
                        const group = groupIndex + 1;
                        const element = PERIODIC_TABLE_ELEMENTS.find(el => el.period === period && el.group === group);
                        
                        return (
                          <div key={`${period}-${group}`} className="h-8 sm:h-10 md:h-12 lg:h-14 aspect-square relative">
                            {element ? (
                              <ElementCard 
                                element={element} 
                                selectedElement={selectedElement} 
                                updateProgress={updateProgress}
                                showEgyptianInfo={true}
                              />
                            ) : (
                              <div className="w-full h-full"></div> // فراغ في الجدول
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((group, index) => {
                    const element = PERIODIC_TABLE_ELEMENTS.find(el => el.period === 1 && el.group === group);
                    return (
                      <div key={index} className="h-16">
                        {element && (
                          <div
                            className={`group relative h-full w-full rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center text-center p-1 ${
                              (!selectedElement || element.category === selectedElement.category) ? 'opacity-100' : 'opacity-30'
                            }`}
                            style={{
                              borderColor: element.color,
                              background: `linear-gradient(135deg, ${element.color}20, ${element.color}05)`,
                            }}
                            onClick={() => {
                              updateProgress('elements', 2);
                              toast.success(`تعلمت عن ${element.name} (${element.symbol})!`);
                            }}
                          >
                            <div className="text-[8px] text-muted-foreground">{element.atomicNumber}</div>
                            <div className="text-sm font-bold" style={{ color: element.color }}>{element.symbol}</div>
                            <div className="text-[8px] text-muted-foreground truncate w-full">{element.name.slice(0, 6)}</div>
                            {element.atomicMass && <div className="text-[7px] opacity-60">{element.atomicMass.toFixed(1)}</div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                 
                  <div className="mt-4 mb-2">
                    <div className="text-sm font-semibold text-center mb-2 text-blue-600 dark:text-blue-300">
                      * اللانثانيدات (الدورة 6)
                    </div>
                    <div className="grid gap-[1px] sm:gap-0.5" style={{ gridTemplateColumns: 'repeat(15, minmax(20px, 1fr))' }}>
                      {PERIODIC_TABLE_ELEMENTS
                        .filter(el => el.category === 'lanthanide')
                        .sort((a, b) => a.atomicNumber - b.atomicNumber)
                        .slice(0, 15)
                        .map((element) => (
                          <div key={element.atomicNumber} className="h-8 sm:h-10 md:h-12 lg:h-14 aspect-square">
                            <ElementCard 
                              element={element} 
                              selectedElement={selectedElement} 
                              updateProgress={updateProgress}
                              showEgyptianInfo={true}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="mt-2 mb-4">
                    <div className="text-sm font-semibold text-center mb-2 text-red-600 dark:text-red-300">
                      ** الأكتينيدات (الدورة 7)
                    </div>
                    <div className="grid gap-[1px] sm:gap-0.5" style={{ gridTemplateColumns: 'repeat(15, minmax(20px, 1fr))' }}>
                      {PERIODIC_TABLE_ELEMENTS
                        .filter(el => el.category === 'actinide')
                        .sort((a, b) => a.atomicNumber - b.atomicNumber)
                        .slice(0, 15)
                        .map((element) => (
                          <div key={element.atomicNumber} className="h-8 sm:h-10 md:h-12 lg:h-14 aspect-square">
                            <ElementCard 
                              element={element} 
                              selectedElement={selectedElement} 
                              updateProgress={updateProgress}
                              showEgyptianInfo={true}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                
                </div>
              </div>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">مفتاح قراءة الجدول</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs sm:text-sm">
                  <div>• العدد الذري (أعلى العنصر)</div>
                  <div>• الرمز الكيميائي (وسط)</div>
                  <div>• الاسم العربي (تحت الرمز)</div>
                  <div>• الكتلة الذرية (أسفل العنصر)</div>
                  <div>• مصري = عنصر مذكور في المنهج المصري</div>
                </CardContent>
              </Card>
            </div>
                <div className="grid grid-cols-18 gap-1 mb-1" style={{ gridTemplateColumns: 'repeat(18, 70px)' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((group, index) => {
                    const element = PERIODIC_TABLE_ELEMENTS.find(el => el.period === 3 && el.group === group);
                    return (
                      <div key={index} className="h-16">
                        {element && (
                          <div
                            className={`group relative h-full w-full rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center text-center p-1 ${
                              (!selectedElement || element.category === selectedElement.category) ? 'opacity-100' : 'opacity-30'
                            }`}
                            style={{
                              borderColor: element.color,
                              background: `linear-gradient(135deg, ${element.color}20, ${element.color}05)`,
                            }}
                            onClick={() => {
                              updateProgress('elements', 2);
                              toast.success(`تعلمت عن ${element.name} (${element.symbol})!`);
                            }}
                          >
                            <div className="text-[8px] text-muted-foreground">{element.atomicNumber}</div>
                            <div className="text-sm font-bold" style={{ color: element.color }}>{element.symbol}</div>
                            <div className="text-[8px] text-muted-foreground truncate w-full">{element.name.slice(0, 6)}</div>
                            {element.atomicMass && <div className="text-[7px] opacity-60">{element.atomicMass.toFixed(1)}</div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>





                <div className="grid grid-cols-18 gap-1 mb-1" style={{ gridTemplateColumns: 'repeat(18, 70px)' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((group, index) => {
                    // تعامل خاص مع اللانثانيدات في المجموعة 3
                    let element;
                    if (group === 3) {
                      element = PERIODIC_TABLE_ELEMENTS.find(el => el.atomicNumber === 57); // La
                    } else {
                      element = PERIODIC_TABLE_ELEMENTS.find(el => el.period === 6 && el.group === group && el.category !== 'lanthanide');
                    }
                    
                    return (
                      <div key={index} className="h-16">
                        {element && (
                          <div
                            className={`group relative h-full w-full rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center text-center p-1 ${
                              (!selectedElement || element.category === selectedElement.category) ? 'opacity-100' : 'opacity-30'
                            }`}
                            style={{
                              borderColor: element.color,
                              background: `linear-gradient(135deg, ${element.color}20, ${element.color}05)`,
                            }}
                            onClick={() => {
                              updateProgress('elements', 2);
                              toast.success(`تعلمت عن ${element.name} (${element.symbol})!`);
                            }}
                          >
                            <div className="text-[8px] text-muted-foreground">{element.atomicNumber}</div>
                            <div className="text-sm font-bold" style={{ color: element.color }}>{element.symbol}</div>
                            <div className="text-[8px] text-muted-foreground truncate w-full">{element.name.slice(0, 6)}</div>
                            {element.atomicMass && <div className="text-[7px] opacity-60">{element.atomicMass.toFixed(1)}</div>}
                            {group === 3 && <div className="text-[6px] text-blue-500">*</div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-18 gap-1 mb-3" style={{ gridTemplateColumns: 'repeat(18, 70px)' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((group, index) => {
                    // تعامل خاص مع الأكتينيدات في المجموعة 3
                    let element;
                    if (group === 3) {
                      element = PERIODIC_TABLE_ELEMENTS.find(el => el.atomicNumber === 89); // Ac
                    } else {
                      element = PERIODIC_TABLE_ELEMENTS.find(el => el.period === 7 && el.group === group && el.category !== 'actinide');
                    }
                    
                    return (
                      <div key={index} className="h-16">
                        {element && (
                          <div
                            className={`group relative h-full w-full rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center text-center p-1 ${
                              (!selectedElement || element.category === selectedElement.category) ? 'opacity-100' : 'opacity-30'
                            }`}
                            style={{
                              borderColor: element.color,
                              background: `linear-gradient(135deg, ${element.color}20, ${element.color}05)`,
                            }}
                            onClick={() => {
                              updateProgress('elements', 2);
                              toast.success(`تعلمت عن ${element.name} (${element.symbol})!`);
                            }}
                          >
                            <div className="text-[8px] text-muted-foreground">{element.atomicNumber}</div>
                            <div className="text-sm font-bold" style={{ color: element.color }}>{element.symbol}</div>
                            <div className="text-[8px] text-muted-foreground truncate w-full">{element.name.slice(0, 6)}</div>
                            {element.atomicMass && <div className="text-[7px] opacity-60">{element.atomicMass.toFixed(1)}</div>}
                            {group === 3 && <div className="text-[6px] text-red-500">**</div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mb-2">
                  <div className="text-sm font-semibold text-center mb-1 text-blue-600 dark:text-blue-300 transition-colors">* اللانثانيدات</div>
                  <div className="grid grid-cols-15 gap-1 mx-auto" style={{ gridTemplateColumns: 'repeat(15, 70px)', width: 'fit-content' }}>
                    {PERIODIC_TABLE_ELEMENTS
                      .filter(el => el.category === 'lanthanide')
                      .sort((a, b) => a.atomicNumber - b.atomicNumber)
                      .map((element) => (
                        <div key={element.atomicNumber} className="h-16">
                          <div
                            className={`group relative h-full w-full rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center text-center p-1 ${
                              (!selectedElement || element.category === selectedElement.category) ? 'opacity-100' : 'opacity-30'
                            }`}
                            style={{
                              borderColor: element.color,
                              background: `linear-gradient(135deg, ${element.color}20, ${element.color}05)`,
                            }}
                            onClick={() => {
                              updateProgress('elements', 2);
                              toast.success(`تعلمت عن ${element.name} (${element.symbol})!`);
                            }}
                          >
                            <div className="text-[8px] text-muted-foreground">{element.atomicNumber}</div>
                            <div className="text-sm font-bold" style={{ color: element.color }}>{element.symbol}</div>
                            <div className="text-[8px] text-muted-foreground truncate w-full">{element.name.slice(0, 6)}</div>
                            {element.atomicMass && <div className="text-[7px] opacity-60">{element.atomicMass.toFixed(1)}</div>}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-sm font-semibold text-center mb-1 text-red-600 dark:text-red-300 transition-colors">** الأكتينيدات</div>
                  <div className="grid grid-cols-15 gap-1 mx-auto" style={{ gridTemplateColumns: 'repeat(15, 70px)', width: 'fit-content' }}>
                    {PERIODIC_TABLE_ELEMENTS
                      .filter(el => el.category === 'actinide')
                      .sort((a, b) => a.atomicNumber - b.atomicNumber)
                      .map((element) => (
                        <div key={element.atomicNumber} className="h-16">
                          <div
                            className={`group relative h-full w-full rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center text-center p-1 ${
                              (!selectedElement || element.category === selectedElement.category) ? 'opacity-100' : 'opacity-30'
                            }`}
                            style={{
                              borderColor: element.color,
                              background: `linear-gradient(135deg, ${element.color}20, ${element.color}05)`,
                            }}
                            onClick={() => {
                              updateProgress('elements', 2);
                              toast.success(`تعلمت عن ${element.name} (${element.symbol})!`);
                            }}
                          >
                            <div className="text-[8px] text-muted-foreground">{element.atomicNumber}</div>
                            <div className="text-sm font-bold" style={{ color: element.color }}>{element.symbol}</div>
                            <div className="text-[8px] text-muted-foreground truncate w-full">{element.name.slice(0, 6)}</div>
                            {element.atomicMass && <div className="text-[7px] opacity-60">{element.atomicMass.toFixed(1)}</div>}
                          </div>
                        </div>
                      ))}

                  </div>
                </div>
        
        

            
            <div className="md:hidden mb-6">
              <h3 className="text-lg font-bold text-center mb-4 text-blue-600 dark:text-blue-400">عرض محسن للموبايل</h3>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-3 text-purple-600 dark:text-purple-400 text-base sm:text-lg">عناصر مميزة</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.symbol === 'H' || el.symbol === 'He').map((element) => (
                    <div key={element.atomicNumber} className="h-16 sm:h-18 lg:h-20">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">الفلزات القلوية</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'alkali-metal').map((element) => (
                    <div key={element.atomicNumber} className="h-16 sm:h-18 lg:h-20">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">الفلزات القلوية الترابية</h4>
                <div className="grid grid-cols-3 gap-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'alkaline-earth-metal').map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">الفلزات الانتقالية (الجزء الأول)</h4>
                <div className="grid grid-cols-4 gap-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'transition-metal').slice(0, 8).map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">الفلزات الانتقالية (الجزء الثاني)</h4>
                <div className="grid grid-cols-4 gap-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'transition-metal').slice(8, 16).map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">باقي الفلزات الانتقالية</h4>
                <div className="grid grid-cols-4 gap-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'transition-metal').slice(16).map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">أشباه الفلزات</h4>
                <div className="grid grid-cols-4 gap-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'metalloid').map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">اللافلزات</h4>
                <div className="grid grid-cols-4 gap-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'nonmetal').map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">الغازات النبيلة</h4>
                <div className="grid grid-cols-3 gap-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'noble-gas').map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-cyan-600 dark:text-cyan-400">اللانثانيدات</h4>
                <div className="grid grid-cols-3 gap-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'lanthanide').slice(0, 6).map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'lanthanide').slice(6, 12).map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'lanthanide').slice(12).map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">الأكتينيدات</h4>
                <div className="grid grid-cols-3 gap-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'actinide').slice(0, 6).map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'actinide').slice(6, 12).map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'actinide').slice(12).map((element) => (
                    <div key={element.atomicNumber} className="h-16">
                      <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} onClick={openElementDetails} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center text-sm text-green-600 dark:text-green-400 font-medium mt-4">
                تم تحسين العرض للهواتف الذكية والأجهزة اللوحية
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    معاني الألوان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span>فلزات قلوية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-500"></div>
                    <span>فلزات قلوية ترابية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-500"></div>
                    <span>فلزات انتقالية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-cyan-500"></div>
                    <span>لانثانيدات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-sky-500"></div>
                    <span>أكتينيدات</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Grid3x3 className="w-4 h-4" />
                    معلومات العنصر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div>• العدد الذري (أعلى العنصر)</div>
                  <div>• الرمز الكيميائي (وسط)</div>
                  <div>• الاسم العربي (تحت الرمز)</div>
                  <div>• الكتلة الذرية (أسفل العنصر)</div>
                  <div>• * = اللانثانيدات</div>
                  <div>• ** = الأكتينيدات</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  حقائق عن الجدول الدوري الحديث
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      icon: '🔢',
                      title: '118 عنصراً',
                      description: 'عدد العناصر المكتشفة حتى الآن في الجدول الدوري'
                    },
                    {
                      icon: '⚖️',
                      title: 'الترتيب بالعدد الذري',
                      description: 'العناصر مرتبة حسب عدد البروتونات في النواة'
                    },
                    {
                      icon: '🌊',
                      title: 'الدورات والمجموعات',
                      description: 'الدورات أفقية والمجموعات رأسية'
                    },
                    {
                      icon: '🔍',
                      title: 'الخصائص الدورية',
                      description: 'الخصائص تتكرر بشكل دوري'
                    }
                  ].map((fact, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-lg transition-all duration-300">
                      <div className="text-2xl mb-2">{fact.icon}</div>
                      <div className="font-semibold mb-2 text-sm sm:text-base">{fact.title}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{fact.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Dialog open={elementInfoOpen} onOpenChange={setElementInfoOpen}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>{elementInfo?.element?.name} ({elementInfo?.element?.symbol})</DialogTitle>
              <DialogDescription>تفاصيل العنصر</DialogDescription>
            </DialogHeader>
            {elementInfo && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">التوزيع الإلكتروني</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div className="p-2 rounded border bg-gray-50 dark:bg-gray-800">الرئيسي: {elementInfo.shells}</div>
                    <div className="p-2 rounded border bg-gray-50 dark:bg-gray-800">الفرعي: {elementInfo.orbitals}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">خصائصه</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {Object.entries(elementInfo.properties).map(([k,v]) => (
                      <div key={k} className="p-2 rounded border">
                        <div className="text-xs text-muted-foreground">{k}</div>
                        <div className="font-medium">{String(v)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">أهم مركباته</h4>
                  {elementInfo.compounds?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {elementInfo.compounds.map((c: any, i: number) => (
                        <span key={i} className="px-2 py-1 text-xs rounded border bg-white dark:bg-gray-900">{c.name} ({c.formula})</span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">—</div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">استخداماته</h4>
                  <p className="text-sm">{elementInfo.uses || '—'}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">تواجده في الطبيعة</h4>
                  <p className="text-sm">{elementInfo.occurrence || '—'}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {currentSection === 'lessons' && (
          <LessonsPage />
        )}

        {currentSection === 'lessons-old' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                قسم الدروس
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                اكتب واحفظ دروسك في الكيمياء مع تلخيص واختبار تلقائي
              </p>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  إحصائيات تعلمك
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300 transition-colors">{lessons.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors">عدد الدروس</div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-300 transition-colors">
                      {lessons.reduce((acc, lesson) => acc + lesson.content.length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">إجمالي الأحرف</div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-300 transition-colors">
                      {Math.round(lessons.reduce((acc, lesson) => acc + lesson.content.split(' ').length, 0) / (lessons.length || 1))}
                    </div>
                    <div className="text-sm text-muted-foreground">متوسط الكلمات</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="write" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="write" className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  كتابة درس جديد
                </TabsTrigger>
                <TabsTrigger value="view" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  عرض الدروس ({lessons.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Brain className="w-5 h-5 text-green-500" />
                      اكتب درسك الجديد
                    </CardTitle>
                    <CardDescription>
                      اكتب درسًا كاملاً في الكيمياء وسيتم تنسيقه وتلخيصه تلقائياً
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="lesson-title" className="text-sm font-medium">عنوان الدرس</Label>
                      <Input
                        id="lesson-title"
                        value={currentLesson.title}
                        onChange={(e) => setCurrentLesson(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="مثال: مقدمة في الذرة والجزيئات"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lesson-content" className="text-sm font-medium">محتوى الدرس</Label>
                      <Textarea
                        id="lesson-content"
                        value={currentLesson.content}
                        onChange={(e) => setCurrentLesson(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="اكتب درسك هنا... بإمكانك استخدام المصطلحات العلمية مثل 'عنصر' و 'مركب' و 'حمض' و 'قاعدة' لتوليد أسئلة تلقائية ذكية."
                        className="mt-1 min-h-[200px] text-right"
                        dir="rtl"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={saveLesson}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={!currentLesson.title.trim() || !currentLesson.content.trim()}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        حفظ الدرس
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="view" className="space-y-6">
                {lessons.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">لا توجد دروس بعد</h3>
                      <p className="text-muted-foreground mb-4">ابدأ بكتابة أول درس لك في الكيمياء!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {lessons.map((lesson) => (
                      <Card key={lesson.id} className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg mb-1">{lesson.title}</CardTitle>
                              <CardDescription className="text-xs">
                                تاريخ الإنشاء: {lesson.createdAt}
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteLesson(lesson.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              معاينة الدرس:
                            </h4>
                            <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-lg max-h-32 overflow-y-auto transition-colors">
                              {lesson.content.substring(0, 200)}...
                            </div>
                            <Button
                              onClick={() => viewLessonDetails(lesson)}
                              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                              size="sm"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              عرض تفاصيل الدرس كاملة
                            </Button>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <Brain className="w-4 h-4 text-blue-500" />
                              التلخيص التلقائي:
                            </h4>
                            <div className="text-xs p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-700/50 transition-colors">
                              {lesson.summary}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <Award className="w-4 h-4 text-purple-500" />
                              الأسئلة المولدة:
                            </h4>
                            <div className="space-y-2">
                              {lesson.quiz.slice(0, 2).map((question, qIndex) => (
                                <div key={qIndex} className="text-xs p-2 bg-purple-50 dark:bg-purple-950 rounded border border-purple-200 dark:border-purple-800">
                                  <div className="font-medium mb-1">{question.question}</div>
                                  <div className="text-muted-foreground">
                                    الإجابة: {question.options[question.correct]}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentSection === 'elements' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                العناصر الكيميائية
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                استكشف العناصر وتكافؤاتها - انقر على أي عنصر لمعرفة المزيد
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/80 p-2 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-x-auto">
              <div className="block sm:hidden mb-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold mb-2">عرض العناصر حسب الفئة</h3>
                  <p className="text-sm text-muted-foreground">لعرض سريع على الجوال</p>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                  {PERIODIC_TABLE_ELEMENTS
                    .sort((a, b) => a.atomicNumber - b.atomicNumber)
                    .map((element) => (
                      <div
                        key={element.atomicNumber}
                        className="group relative rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center text-center p-2 min-h-[80px]"
                        style={{ borderColor: element.color, background: `linear-gradient(135deg, ${element.color}20, ${element.color}05)` }}
                        onClick={() => openElementDetails(element)}
                      >
                        <div className="text-xs text-muted-foreground">{element.atomicNumber}</div>
                        <div className="text-lg font-bold" style={{ color: element.color }}>{element.symbol}</div>
                        <div className="text-xs text-muted-foreground truncate w-full">{element.name}</div>
                        {element.atomicMass && <div className="text-[10px] opacity-60">{element.atomicMass.toFixed(1)}</div>}
                      </div>
                    ))}
                </div>
              </div>

              <div className="hidden sm:block">
                <div className="min-w-[600px] sm:min-w-[800px] lg:min-w-[1200px] mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7].map((period) => (
                    <div key={period} className="grid gap-[1px] sm:gap-0.5 lg:gap-1 mb-0.5 sm:mb-1" style={{ gridTemplateColumns: 'repeat(18, minmax(20px, 1fr))' }}>
                      {Array.from({ length: 18 }, (_, groupIndex) => {
                        const group = groupIndex + 1;
                        const element = PERIODIC_TABLE_ELEMENTS.find(el => el.period === period && el.group === group);
                        return (
                          <div key={`${period}-${group}`} className="h-8 sm:h-10 md:h-12 lg:h-14 aspect-square relative">
                            {element ? (
                              <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} showEgyptianInfo={true} onClick={openElementDetails} />
                            ) : (
                              <div className="w-full h-full"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  <div className="mt-4 mb-2">
                    <div className="text-sm font-semibold text-center mb-2 text-blue-600 dark:text-blue-300">* اللانثانيدات (الدورة 6)</div>
                    <div className="grid gap-[1px] sm:gap-0.5" style={{ gridTemplateColumns: 'repeat(15, minmax(20px, 1fr))' }}>
                      {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'lanthanide').sort((a, b) => a.atomicNumber - b.atomicNumber).slice(0, 15).map((element) => (
                        <div key={element.atomicNumber} className="h-8 sm:h-10 md:h-12 lg:h-14 aspect-square">
                          <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} showEgyptianInfo={true} onClick={openElementDetails} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 mb-4">
                    <div className="text-sm font-semibold text-center mb-2 text-red-600 dark:text-red-300">** الأكتينيدات (الدورة 7)</div>
                    <div className="grid gap-[1px] sm:gap-0.5" style={{ gridTemplateColumns: 'repeat(15, minmax(20px, 1fr))' }}>
                      {PERIODIC_TABLE_ELEMENTS.filter(el => el.category === 'actinide').sort((a, b) => a.atomicNumber - b.atomicNumber).slice(0, 15).map((element) => (
                        <div key={element.atomicNumber} className="h-8 sm:h-10 md:h-12 lg:h-14 aspect-square">
                          <ElementCard element={element} selectedElement={selectedElement} updateProgress={updateProgress} showEgyptianInfo={true} onClick={openElementDetails} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        )}

        {currentSection === 'compounds' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                المركبات الكيميائية
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                تعلم عن الأحماض والقواعد والأملاح والصيغ الكيميائية
              </p>
            </div>

            <Tabs defaultValue="compounds" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                <TabsTrigger value="compounds" className="text-xs sm:text-sm p-2 sm:p-3">المركبات</TabsTrigger>
                <TabsTrigger value="acids" className="text-xs sm:text-sm p-2 sm:p-3">الأحماض</TabsTrigger>
                <TabsTrigger value="bases" className="text-xs sm:text-sm p-2 sm:p-3">القواعد</TabsTrigger>
                <TabsTrigger value="formulas" className="text-xs sm:text-sm p-2 sm:p-3">كتابة الصيغ</TabsTrigger>
              </TabsList>

              <TabsContent value="compounds" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {COMPOUNDS.map((compound, index) => (
                    <div key={index} onClick={() => updateProgress('compounds', 10)}>
                      <CompoundCard compound={compound} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="acids" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400 text-lg sm:text-xl">الأحماض</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      المواد التي تعطي أيونات الهيدروجين الموجبة (H⁺) عند الذوبان في الماء
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-700/50 transition-colors">
                        <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3 text-sm sm:text-base">خصائص الأحماض:</h4>
                        <ul className="text-xs sm:text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>تحمر ورقة عباد الشمس</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>ذات طعم لاذع</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>تتفاعل مع القلويات</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>تتفاعل مع المعادن النشطة</span>
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                        <h4 className="font-semibold mb-3 text-sm sm:text-base">أمثلة على الأحماض:</h4>
                        <ul className="text-xs sm:text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>حمض الهيدروكلوريك (HCl)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>حمض الكبريتيك (H₂SO₄)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>حمض النيتريك (HNO₃)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>حمض الخليك (CH₃COOH)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bases" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600 dark:text-blue-400">القواعد (القلويات)</CardTitle>
                    <CardDescription>
                      المواد التي تعطي أيونات الهيدروكسيد السالبة (OH⁻) عند الذوبان في الماء
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-700/50 transition-colors">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">خصائص القواعد:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• تزرق ورقة عباد الشمس</li>
                          <li>• ذات طعم قابض</li>
                          <li>• تتفاعل مع الأحماض</li>
                          <li>• ملمس صابوني</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                        <h4 className="font-semibold mb-2">أمثلة على القواعد:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• هيدروكسيد الصوديوم (NaOH)</li>
                          <li>• هيدروكسيد الكالسيوم (Ca(OH)₂)</li>
                          <li>• هيدروكسيد الماغنسيوم (Mg(OH)₂)</li>
                          <li>• الأمونيا (NH₃)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="formulas" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>كيفية كتابة الصيغ الكيميائية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h4 className="font-semibold mb-2 text-foreground">القواعد الأساسية:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>يكتب الشق الموجب يساراً والسالب يميناً</li>
                        <li>تكتب التكافؤات بالتبادل</li>
                        <li>تختصر التكافؤات إن أمكن</li>
                      </ol>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                        <h4 className="font-semibold mb-3 text-foreground">أمثلة تطبيقية:</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <div className="font-semibold text-foreground">أكسيد كالسيوم:</div>
                            <div className="text-muted-foreground">Ca²⁺ + O²⁻ → CaO</div>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">كلوريد ماغنسيوم:</div>
                            <div className="text-muted-foreground">Mg²⁺ + Cl⁻ → MgCl₂</div>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">أكسيد ألومنيوم:</div>
                            <div className="text-muted-foreground">Al³⁺ + O²⁻ → Al₂O₃</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold mb-2 text-foreground">نصائح مهمة:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• احرص على توازن الشحنات</li>
                          <li>• اختصر الأرقام إذا كان ممكناً</li>
                          <li>• تأكد من صحة رموز العناصر</li>
                          <li>• راجع التكافؤات قبل الكتابة</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentSection === 'game' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                لعبة التكافؤ السريعة
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                اختبر سرعتك في معرفة تكافؤ العناصر - لديك 60 ثانية!
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                  <Badge variant="outline" className="text-sm sm:text-lg px-3 sm:px-4 py-2">
                    النقاط: {gameScore}
                  </Badge>
                  <Badge variant={timeLeft > 10 ? "outline" : "destructive"} className="text-sm sm:text-lg px-3 sm:px-4 py-2">
                    الوقت: {timeLeft}s
                  </Badge>
                </div>
                <Button 
                  onClick={startElementGame}
                  size="lg"
                  className={`w-full sm:w-auto ${gameActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-base sm:text-lg px-6 py-3`}
                >
                  {gameActive ? (
                    <><Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> إيقاف</>
                  ) : (
                    <><Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> ابدأ اللعبة</>
                  )}
                </Button>
              </CardHeader>
              
              {gameActive && currentElement && (
                <CardContent className="text-center space-y-6 px-4 sm:px-6">
                  <div className="space-y-4">
                    <div className="text-4xl sm:text-6xl font-bold animate-pulse" style={{ color: currentElement.color }}>
                      {currentElement.symbol}
                    </div>
                    <div className="text-xl sm:text-2xl font-semibold">{currentElement.name}</div>
                  </div>

                  
                  <div className="space-y-4">
                    <Label className="text-base sm:text-lg">ما هو تكافؤ هذا العنصر؟</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
                      {[1, 2, 3, 4].map((valency) => (
                        <Button
                          key={valency}
                          onClick={() => checkValency(valency)}
                          variant="outline"
                          className="h-12 sm:h-14 text-lg sm:text-xl hover:scale-105 transition-transform touch-manipulation"
                        >
                          {valency}
                        </Button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                      {[5, 6, 7].map((valency) => (
                        <Button
                          key={valency}
                          onClick={() => checkValency(valency)}
                          variant="outline"
                          className="h-12 sm:h-14 text-lg sm:text-xl hover:scale-105 transition-transform touch-manipulation"
                        >
                          {valency}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}

              {!gameActive && gameScore > 0 && (
                <CardContent className="text-center space-y-4">
                  <div className="text-4xl font-bold text-green-600">{gameScore}</div>
                  <div className="text-xl">نقطة رائعة!</div>
                  <div className="text-muted-foreground">
                    {gameScore >= 100 ? "ممتاز! أنت خبير في التكافؤ!" :
                     gameScore >= 50 ? "جيد جداً! استمر في التحسن!" :
                     "ابدأ من جديد وحسن نتيجتك!"}
                  </div>
                </CardContent>
              )}

              {!gameActive && gameScore === 0 && (
                <CardContent className="text-center">
                  <div className="text-muted-foreground">
                    انقر على "ابدأ اللعبة" لتبدأ التحدي!
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        )}

        {currentSection === 'electron-distribution' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                لعبة توزيع الإلكترونات المتقدمة
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                تعلم كيفية توزيع الإلكترونات على المدارات الفرعية s, p, d, f حسب المنهج المصري
              </p>
              
              <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} />
                  <span className="text-lg font-semibold">النقاط: {distributionScore}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="text-blue-600" size={16} />
                  <span className="text-sm text-gray-600">منهج الصف الثالث الثانوي المصري</span>
                </div>
              </div>
              
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                <Button
                  variant={showAdvancedMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAdvancedMode(!showAdvancedMode)}
                >
                  {showAdvancedMode ? 'الوضع المتقدم (s,p,d,f)' : 'الوضع البسيط (أغلفة رئيسية)'}
                </Button>
                <Button
                  variant={showOrbitalDetails ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowOrbitalDetails(!showOrbitalDetails)}
                >
                  <Lightbulb size={16} className="mr-1" />
                  {showOrbitalDetails ? 'إخفاء التفاصيل' : 'عرض أعداد الكم'}
                </Button>
              </div>
            </div>

            {distributionGameState === 'selecting' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">اختر عنصراً من الجدول الدوري</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                    {PERIODIC_TABLE_ELEMENTS.slice(0, 36).map((element) => (
                      <div key={element.symbol} className="relative group">
                        <Button
                          variant="outline"
                          className={`h-20 w-full flex-col p-2 transition-all duration-200 hover:scale-105 hover:shadow-lg border-2`}
                          style={{
                            borderColor: element.color,
                            background: `linear-gradient(135deg, ${element.color}20, ${element.color}05)`
                          }}
                          onClick={() => selectElementForDistribution(element)}
                        >
                          <div className="font-bold text-lg" style={{ color: element.color }}>
                            {element.symbol}
                          </div>
                          <div className="text-xs opacity-70">{element.atomicNumber}</div>
                          <div className="text-[10px] text-center opacity-60 mt-1 leading-tight">
                            {element.name.slice(0, 6)}
                          </div>
                        </Button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                          {element.name} ({element.category})
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedElementForDistribution && distributionGameState !== 'selecting' && (
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>معلومات العنصر</span>
                      <Button variant="ghost" size="sm" onClick={resetDistributionGame}>
                        <RotateCcw size={16} className="ml-2" />
                        عنصر جديد
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div 
                      className="text-white p-6 rounded-lg mb-4 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${selectedElementForDistribution.color}, ${selectedElementForDistribution.color}dd)`
                      }}
                    >
                      <div className="text-4xl font-bold mb-2">{selectedElementForDistribution.symbol}</div>
                      <div className="text-xl">{selectedElementForDistribution.name}</div>
                      <div className="text-sm opacity-90 mb-2">العدد الذري: {selectedElementForDistribution.atomicNumber}</div>
                      <Badge variant="secondary" className="text-sm">
                        {selectedElementForDistribution.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Badge variant={availableElectrons === 0 ? "default" : "secondary"} className="text-lg px-4 py-2">
                        إلكترونات متبقية: {availableElectrons}
                      </Badge>
                      
                      {distributionAttempts > 0 && (
                        <Badge variant="outline" className="text-sm">
                          المحاولة: {distributionAttempts}
                        </Badge>
                      )}
                    </div>

                    {showOrbitalDetails && selectedElementForDistribution && (
                      <Card className="bg-blue-50 dark:bg-blue-950/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Atom size={16} />
                            أعداد الكم للإلكترون الأخير
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {(() => {
                            const quantumData = getQuantumNumbers(selectedElementForDistribution.atomicNumber);
                            if (!quantumData) return <p className="text-sm text-muted-foreground">لا توجد بيانات</p>;
                            
                            return (
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                                  <div className="font-semibold text-blue-600 dark:text-blue-300">n = {quantumData.n}</div>
                                  <div className="text-gray-600 dark:text-gray-300">العدد الكمي الرئيسي</div>
                                </div>
                                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                                  <div className="font-semibold text-purple-600 dark:text-purple-300">l = {quantumData.l}</div>
                                  <div className="text-muted-foreground">العدد الكمي الثانوي</div>
                                </div>
                                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                                  <div className="font-semibold text-green-600 dark:text-green-300">mₗ = {Array.isArray(quantumData.ml) ? quantumData.ml.join(', ') : '—'}</div>
                                  <div className="text-muted-foreground">العدد الكمي المغناطيسي</div>
                                </div>
                                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                                  <div className="font-semibold text-red-600 dark:text-red-300">mₛ = {Array.isArray(quantumData.ms) ? quantumData.ms.join(', ') : '—'}</div>
                                  <div className="text-muted-foreground">العدد الكمي المغزلي</div>
                                </div>
                              </div>
                            );
                          })()} 
                        </CardContent>
                      </Card>
                    )}

                    {availableElectrons === 0 && distributionGameState === 'playing' && (
                      <Button onClick={checkDistributionAnswer} className="w-full">
                        تحقق من الإجابة
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {showAdvancedMode ? 'المدارات الفرعية (s, p, d, f)' : 'الأغلفة الإلكترونية الرئيسية'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {showAdvancedMode ? (
                      <div className="space-y-3">
                        {getElectronConfiguration(selectedElementForDistribution.atomicNumber).map((config, index) => (
                          <div key={index} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                            <div className="flex justify-between items-center">
                              <div className="font-semibold text-lg">{config.orbital}</div>
                              <div className="text-sm text-muted-foreground">حتى {config.electrons} إلكترون</div>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {Array.from({ length: config.electrons }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border border-yellow-600 flex items-center justify-center text-xs font-bold"
                                  title="إلكترون"
                                >
                                  e⁻
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[0, 1, 2, 3, 4, 5].map((shellIndex) => {
                          const maxElectrons = [2, 8, 8, 18, 18, 32][shellIndex];
                          const currentElectrons = playerDistribution[shellIndex] || 0;
                          
                          if (shellIndex >= 4 && selectedElementForDistribution.atomicNumber <= 36) {
                            return null; // لا نعرض الأغلفة العليا للعناصر الخفيفة
                          }
                          
                          return (
                            <div
                              key={shellIndex}
                              className={`border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
                                distributionGameState === 'playing' 
                                  ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20' 
                                  : 'border-gray-200'
                              } ${currentElectrons > 0 ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300' : ''}`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">الغلاف {shellIndex + 1}</span>
                                <span className="text-sm text-muted-foreground">الحد الأقصى: {maxElectrons}</span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex gap-1 flex-wrap">
                                  {Array.from({ length: currentElectrons }).map((_, i) => (
                                    <div
                                      key={i}
                                      className="w-7 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border-2 border-yellow-600 flex items-center justify-center text-xs font-bold shadow-sm animate-pulse"
                                      title="إلكترون"
                                      style={{ animationDelay: `${i * 0.1}s` }}
                                    >
                                      e⁻
                                    </div>
                                  ))}
                                </div>
                                
                                {distributionGameState === 'playing' && (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateShellElectrons(shellIndex, -1)}
                                      disabled={currentElectrons === 0}
                                    >
                                      -
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateShellElectrons(shellIndex, 1)}
                                      disabled={availableElectrons === 0 || currentElectrons >= maxElectrons}
                                    >
                                      +
                                    </Button>
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-center mt-2">
                                <Badge variant="secondary">{currentElectrons} إلكترون</Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {distributionFeedback && (
              <Card className={`${distributionFeedback.correct ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-red-500 bg-red-50 dark:bg-red-950/20'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-3">
                    {distributionFeedback.correct ? (
                      <CheckCircle className="text-green-600" size={24} />
                    ) : (
                      <XCircle className="text-red-600" size={24} />
                    )}
                    <span className={`text-lg font-semibold ${
                      distributionFeedback.correct ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    }`}>
                      {distributionFeedback.message}
                    </span>
                  </div>
                  {selectedElementForDistribution && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        التوزيع الصحيح لعنصر {selectedElementForDistribution.name}:
                      </p>
                      <Badge variant="outline" className="text-base px-4 py-2">
                        {showAdvancedMode 
                          ? getCorrectElectronDistribution(selectedElementForDistribution.atomicNumber, true)
                          : (getCorrectElectronDistribution(selectedElementForDistribution.atomicNumber, false) as number[]).join('-')
                        }
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {distributionGameState === 'checking' && (
              <div className="text-center">
                <Button onClick={resetDistributionGame} size="lg">
                  جرب عنصراً آخر
                </Button>
              </div>
            )}

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="text-blue-600" size={20} />
                  قواعد توزيع الإلكترونات (المنهج المصري)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">أعداد الكم الأربعة:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold">n</div>
                          <span>العدد الكمي الرئيسي (1, 2, 3, 4...)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-xs font-bold">l</div>
                          <span>العدد الكمي الثانوي (s=0, p=1, d=2, f=3)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-xs font-bold">m</div>
                          <span>العدد الكمي المغناطيسي (-l إلى +l)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center text-xs font-bold">s</div>
                          <span>العدد الكمي المغزلي (+½, -½)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">المدارات الفرعية:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                          <span className="font-bold text-blue-600">s:</span> حتى 2 إلكترون
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                          <span className="font-bold text-green-600">p:</span> حتى 6 إلكترون
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                          <span className="font-bold text-orange-600">d:</span> حتى 10 إلكترون
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                          <span className="font-bold text-red-600">f:</span> حتى 14 إلكترون
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">مبادئ التوزيع:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• <strong>مبدأ البناء التصاعدي:</strong> ملء المدارات من الأقل طاقة للأعلى</li>
                        <li>• <strong>مبدأ الاستبعاد لباولي:</strong> مداران فقط لكل مدار</li>
                        <li>• <strong>قاعدة هوند:</strong> ملء المدارات فردياً أولاً</li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-300 dark:border-yellow-700">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center font-medium">
                        💡 ترتيب الطاقة: 1s ‹ 2s ‹ 2p ‹ 3s ‹ 3p ‹ 4s ‹ 3d ‹ 4p
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentSection === 'chatbot' && (
          <ChemistryChatbot />
        )}

        {currentSection === 'quiz' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                اختبار الكيمياء الشامل
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                اختبر معرفتك بالكيمياء في هذا الاختبار التفاعلي
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              {!quizCompleted ? (
                <>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                      <Badge variant="outline" className="text-sm sm:text-lg px-3 sm:px-4 py-2">
                        السؤال {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
                      </Badge>
                      <Badge variant="outline" className="text-sm sm:text-lg px-3 sm:px-4 py-2">
                        النقاط: {quizScore}
                      </Badge>
                    </div>
                    <Progress 
                      value={(currentQuestion / QUIZ_QUESTIONS.length) * 100} 
                      className="mb-4 h-2" 
                    />
                  </CardHeader>
                  
                  <CardContent className="space-y-6 px-4 sm:px-6">
                    <div className="text-lg sm:text-xl font-semibold text-center leading-relaxed">
                      {QUIZ_QUESTIONS[currentQuestion]?.question}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {QUIZ_QUESTIONS[currentQuestion]?.options.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          variant={selectedAnswer === index ? "default" : "outline"}
                          className={`h-auto min-h-[3rem] text-base sm:text-lg justify-start p-4 touch-manipulation ${
                            selectedAnswer !== null ?
                              index === QUIZ_QUESTIONS[currentQuestion].correct ?
                                "bg-green-500 hover:bg-green-600 text-white" :
                                selectedAnswer === index ?
                                  "bg-red-500 hover:bg-red-600 text-white" :
                                  "opacity-50" :
                              "hover:scale-[1.02] transition-transform"
                          }`}
                          disabled={selectedAnswer !== null}
                        >
                          {selectedAnswer !== null && index === QUIZ_QUESTIONS[currentQuestion].correct && (
                            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                          )}
                          {selectedAnswer === index && index !== QUIZ_QUESTIONS[currentQuestion].correct && (
                            <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                          )}
                          <span className="text-right flex-1">{option}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="text-center space-y-6 px-4 sm:px-6 py-8">
                  <div className="space-y-4">
                    <div className="text-4xl sm:text-6xl">🎉</div>
                    <div className="text-2xl sm:text-3xl font-bold">تم الانتهاء!</div>
                    <div className="text-lg sm:text-xl">
                      نتيجتك: {quizScore} / {QUIZ_QUESTIONS.length}
                    </div>
                    <div className="text-base sm:text-lg text-muted-foreground px-4">
                      {quizScore === QUIZ_QUESTIONS.length ? "ممتاز! أجبت على جميع الأسئلة بشكل صحيح!" :
                       quizScore >= QUIZ_QUESTIONS.length * 0.75 ? "جيد جداً! أداء رائع!" :
                       quizScore >= QUIZ_QUESTIONS.length * 0.5 ? "جيد! يمكنك تحسين أداءك!" :
                       "حاول مرة أخرى! ستتحسن مع الممارسة!"}
                    </div>
                    <Button onClick={startQuiz} size="lg" className="bg-blue-500 hover:bg-blue-600 text-base sm:text-lg px-6 py-3">
                      <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      إعادة الاختبار
                    </Button>
                  </div>
                </CardContent>
              )}
              
              {!quizCompleted && currentQuestion === 0 && selectedAnswer === null && (
                <CardContent className="text-center">
                  <Button onClick={() => updateProgress('valency', 20)} size="lg">
                    ابدأ الاختبار
                  </Button>
                </CardContent>
              )}
            </Card>
          </div>
        )}
      </div>
      
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Chemistry Lab
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Interactive educational platform for learning chemistry in a fun and effective way
              </p>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="w-4 h-4" />
                <Star className="w-4 h-4" />
                <Star className="w-4 h-4" />
                <Star className="w-4 h-4" />
                <Star className="w-4 h-4" />
                <span className="text-sm text-gray-300 mr-2">5/5 Rating</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-400">Sections</h4>
              <div className="space-y-2">
                {[
                  { key: 'elements', label: 'Chemical Elements' },
                  { key: 'periodic-table', label: 'Periodic Table' },
                  { key: 'compounds', label: 'Chemical Compounds' },
                  { key: 'lessons', label: 'Interactive Lessons' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setCurrentSection(key)}
                    className="block text-sm text-gray-300 hover:text-blue-400 transition-colors cursor-pointer text-left w-full"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-400">Features</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Interactive Learning
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-green-400" />
                  Smart Summarization
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-400" />
                  Educational Games
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400" />
                  Instant Quizzes
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-green-400">Developer</h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                  <div className="text-white font-semibold mb-1">Mohamed Aly</div>
                  <div className="text-gray-300 text-xs">Software Engineer</div>
                  <div className="text-gray-400 text-xs mt-1">Specialized in interactive educational app development</div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <span>🎆</span> Built with React + TypeScript
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  © 2024 Chemistry Lab - All rights reserved
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Developed with ❤️ by <span className="text-blue-400 font-semibold">Mohamed Aly</span>
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  System running perfectly
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                    onClick={() => toast.success('Thanks for rating! 🎆')}
                  >
                    ⭐ Rate Website
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>

      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          {selectedLessonForView && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-2">
                  {selectedLessonForView.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  تاريخ الإنشاء: {selectedLessonForView.createdAt}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    محتوى الدرس الكامل
                  </h3>
                  <div className="prose prose-sm max-w-none text-right bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
                    <div className="whitespace-pre-line text-foreground leading-relaxed">
                      {selectedLessonForView.content.split('\n').map((line, index) => {
                        // تنسيق العناوين
                        if (line.startsWith('##')) {
                          return (
                            <h4 key={index} className="font-bold text-lg mt-4 mb-2 text-blue-600 dark:text-blue-400">
                              {line.replace('##', '').trim()}
                            </h4>
                          );
                        }
                        if (line.startsWith('#')) {
                          return (
                            <h3 key={index} className="font-bold text-xl mt-6 mb-3 text-purple-600 dark:text-purple-400">
                              {line.replace('#', '').trim()}
                            </h3>
                          );
                        }
                        // تنسيق النقاط
                        if (line.startsWith('•') || line.startsWith('-')) {
                          return (
                            <div key={index} className="mb-1 pr-4">
                              <span className="text-green-500 font-bold ml-2">•</span>
                              {line.replace(/^[•-]\s*/, '').trim()}
                            </div>
                          );
                        }
                        // تنسيق الأرقام
                        if (/^\d+\./.test(line.trim())) {
                          return (
                            <div key={index} className="mb-1 font-medium text-blue-600 dark:text-blue-400">
                              {line}
                            </div>
                          );
                        }
                        // النص العادي
                        if (line.trim()) {
                          return (
                            <p key={index} className="mb-3 text-justify">
                              {line}
                            </p>
                          );
                        }
                        return <div key={index} className="mb-2"></div>;
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-green-500" />
                    التلخيص التلقائي
                  </h3>
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm leading-relaxed">{selectedLessonForView.summary}</p>
                  </div>
                </div>



                
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    الأسئلة المولدة تلقائياً
                  </h3>
                  <div className="space-y-3">
                    {selectedLessonForView.quiz.map((question, qIndex) => (
                      <div key={qIndex} className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h4 className="font-medium mb-2 text-purple-700 dark:text-purple-300">
                          السؤال {qIndex + 1}: {question.question}
                        </h4>
                        <div className="space-y-1 mb-2">
                          {question.options.map((option, oIndex) => (
                            <div 
                              key={oIndex} 
                              className={`text-sm p-2 rounded ${
                                oIndex === question.correct 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              {String.fromCharCode(65 + oIndex)}) {option}
                              {oIndex === question.correct && ' ✓ (الإجابة الصحيحة)'}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
