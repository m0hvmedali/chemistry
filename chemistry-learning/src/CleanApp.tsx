import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast, Toaster } from 'sonner';
import ChemistryChatbot from '@/components/ChemistryChatbot';
import FloatingChatbot from '@/components/FloatingChatbot';
import {
  Beaker,
  BookOpen,
  Bot,
  Award,
  Target,
  FlaskConical,
  Atom,
  Grid3x3,
  Settings,
  Menu,
  X
} from 'lucide-react';

// Simple elements data
const ELEMENTS = [
  { symbol: 'H', name: 'هيدروجين', atomicNumber: 1, category: 'nonmetal', color: '#ff6b6b' },
  { symbol: 'He', name: 'هيليوم', atomicNumber: 2, category: 'noble-gas', color: '#4ecdc4' },
  { symbol: 'Li', name: 'ليثيوم', atomicNumber: 3, category: 'alkali-metal', color: '#45b7d1' },
  { symbol: 'C', name: 'كربون', atomicNumber: 6, category: 'nonmetal', color: '#2d3436' },
  { symbol: 'N', name: 'نيتروجين', atomicNumber: 7, category: 'nonmetal', color: '#74b9ff' },
  { symbol: 'O', name: 'أكسجين', atomicNumber: 8, category: 'nonmetal', color: '#fd79a8' },
  { symbol: 'Na', name: 'صوديوم', atomicNumber: 11, category: 'alkali-metal', color: '#a29bfe' },
  { symbol: 'Mg', name: 'ماغنسيوم', atomicNumber: 12, category: 'alkaline-earth-metal', color: '#fd79a8' },
  { symbol: 'Al', name: 'ألومنيوم', atomicNumber: 13, category: 'post-transition-metal', color: '#fdcb6e' },
  { symbol: 'Si', name: 'سيليكون', atomicNumber: 14, category: 'metalloid', color: '#6c5ce7' },
  { symbol: 'Cl', name: 'كلور', atomicNumber: 17, category: 'halogen', color: '#55a3ff' },
  { symbol: 'K', name: 'بوتاسيوم', atomicNumber: 19, category: 'alkali-metal', color: '#ff7675' },
  { symbol: 'Ca', name: 'كالسيوم', atomicNumber: 20, category: 'alkaline-earth-metal', color: '#fd79a8' },
  { symbol: 'Fe', name: 'حديد', atomicNumber: 26, category: 'transition-metal', color: '#636e72' },
  { symbol: 'Cu', name: 'نحاس', atomicNumber: 29, category: 'transition-metal', color: '#e17055' },
  { symbol: 'Zn', name: 'زنك', atomicNumber: 30, category: 'transition-metal', color: '#74b9ff' },
  { symbol: 'Ag', name: 'فضة', atomicNumber: 47, category: 'transition-metal', color: '#ddd' },
  { symbol: 'Au', name: 'ذهب', atomicNumber: 79, category: 'transition-metal', color: '#f39c12' }
];

// Simple compounds data
const COMPOUNDS = [
  { name: 'أكسيد كالسيوم', formula: 'CaO', type: 'oxide', description: 'مركب قاعدي يستخدم في بناء الأسمنت' },
  { name: 'كلوريد ماغنيسيوم', formula: 'MgCl₂', type: 'salt', description: 'ملح يستخدم في إذابة الجليد والمكملات الغذائية' },
  { name: 'هيدروكسيد صوديوم', formula: 'NaOH', type: 'base', description: 'قاعدة قوية تستخدم في صناعة الصابون والورق' },
  { name: 'حمض كبريتيك', formula: 'H₂SO₄', type: 'acid', description: 'حمض قوي جداً يستخدم في البطاريات والصناعة' },
  { name: 'حمض هيدروكلوريك', formula: 'HCl', type: 'acid', description: 'حمض قوي موجود في عصارة المعدة ويساعد في الهضم' }
];

export default function CleanApp() {
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedElement, setSelectedElement] = useState<any>(null);

  const sections = [
    { key: 'home', icon: Beaker, label: 'الرئيسية', desc: 'الصفحة الرئيسية' },
    { key: 'elements', icon: Atom, label: 'العناصر', desc: 'تعلم عن العناصر الكيميائية' },
    { key: 'compounds', icon: FlaskConical, label: 'المركبات', desc: 'الأحماض والقواعد والأملاح' },
    { key: 'chatbot', icon: Bot, label: 'المساعد الذكي', desc: 'اسأل أي سؤال كيميائي' },
    { key: 'quiz', icon: Award, label: 'اختبار', desc: 'قيم مستواك في الكيمياء' }
  ];

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
      
      {/* Floating Chatbot */}
      <FloatingChatbot />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950">
        {/* Navigation */}
        <nav className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <FlaskConical className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Chemistry Lab
                </h1>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                {sections.map(({ key, icon: Icon, label }) => (
                  <Button
                    key={key}
                    variant={currentSection === key ? 'default' : 'ghost'}
                    onClick={() => setCurrentSection(key)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden bg-white/90 dark:bg-gray-950/90 border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-1 p-2 overflow-x-auto">
            {sections.map(({ key, icon: Icon, label }) => (
              <Button
                key={key}
                variant={currentSection === key ? 'default' : 'ghost'}
                onClick={() => setCurrentSection(key)}
                className="flex-shrink-0 gap-1 text-xs px-3 py-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Home Section */}
          {currentSection === 'home' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  مرحباً بك في مختبر الكيمياء
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  تعلم الكيمياء بطريقة تفاعلية وممتعة مع المساعد الذكي والأدوات المتقدمة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sections.slice(1).map(({ key, icon: Icon, label, desc }) => (
                  <Card 
                    key={key}
                    className="cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setCurrentSection(key)}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900 w-fit">
                        <Icon className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                      </div>
                      <CardTitle className="text-lg">{label}</CardTitle>
                      <CardDescription>{desc}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Elements Section */}
          {currentSection === 'elements' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">العناصر الكيميائية</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  اكتشف العناصر الكيميائية وخصائصها
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {ELEMENTS.map((element) => (
                  <Card 
                    key={element.symbol}
                    className="cursor-pointer hover:scale-105 transition-all duration-300 text-center p-4"
                    style={{ borderColor: element.color }}
                    onClick={() => {
                      setSelectedElement(element);
                      toast.success('تم اختيار ' + element.name);
                    }}
                  >
                    <div className="text-xs text-muted-foreground">{element.atomicNumber}</div>
                    <div className="text-2xl font-bold mb-1" style={{ color: element.color }}>
                      {element.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground">{element.name}</div>
                  </Card>
                ))}
              </div>

              {selectedElement && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span style={{ color: selectedElement.color }}>
                        {selectedElement.symbol}
                      </span>
                      {selectedElement.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>العدد الذري</Label>
                        <div className="text-lg font-semibold">{selectedElement.atomicNumber}</div>
                      </div>
                      <div>
                        <Label>التصنيف</Label>
                        <div className="text-lg">{selectedElement.category}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Compounds Section */}
          {currentSection === 'compounds' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">المركبات الكيميائية</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  تعلم عن الأحماض والقواعد والأملاح
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COMPOUNDS.map((compound, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="w-5 h-5" />
                        {compound.name}
                      </CardTitle>
                      <CardDescription className="text-lg font-mono">
                        {compound.formula}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="mb-2">{compound.type}</Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {compound.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Chatbot Section */}
          {currentSection === 'chatbot' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">المساعد الذكي للكيمياء</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  اسأل أي سؤال عن الكيمياء واحصل على إجابة فورية
                </p>
              </div>
              <ChemistryChatbot />
            </div>
          )}

          {/* Quiz Section */}
          {currentSection === 'quiz' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">اختبار الكيمياء</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  اختبر معرفتك في الكيمياء
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>سؤال تجريبي</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="font-semibold">ما هو الرمز الكيميائي للماء؟</p>
                    <div className="space-y-2">
                      {['H₂O', 'CO₂', 'NaCl', 'CaCO₃'].map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full text-left justify-start"
                          onClick={() => {
                            if (option === 'H₂O') {
                              toast.success('إجابة صحيحة! 🎉');
                            } else {
                              toast.error('إجابة خاطئة. الإجابة الصحيحة هي H₂O');
                            }
                          }}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-16 py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FlaskConical className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold">Chemistry Lab</h3>
            </div>
            <p className="text-gray-400">
              تطبيق تعليمي للكيمياء مع مساعد ذكي
            </p>
            <div className="mt-4">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentSection('chatbot')}
                className="text-blue-400 hover:text-blue-300"
              >
                <Bot className="w-4 h-4 mr-2" />
                جرب المساعد الذكي
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}