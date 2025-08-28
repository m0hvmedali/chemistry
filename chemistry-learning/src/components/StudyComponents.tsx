import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  FolderOpen,
  Upload,
  Clock,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Link,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  BookOpen,
  BarChart3,
  Timer,
  PlusCircle,
  ExternalLink,
  Download,
  Trash2,
  Edit,
  Save
} from 'lucide-react';

// Study Materials Section
export function StudyMaterialsSection() {
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: 'الكيمياء العضوية',
      color: '#3b82f6',
      lessons: [
        {
          id: 1,
          name: 'الألكانات',
          link: 'https://example.com/alkanes',
          summary: 'دراسة الهيدروكربونات المشبعة',
          status: 'مكتمل',
          dueDate: '2024-02-15',
          timeSpent: 120
        },
        {
          id: 2,
          name: 'الألكينات',
          link: '',
          summary: 'الهيدروكربونات غير المشبعة',
          status: 'جاري',
          dueDate: '2024-02-20',
          timeSpent: 45
        }
      ]
    },
    {
      id: 2,
      name: 'الكيمياء غير العضوية',
      color: '#10b981',
      lessons: [
        {
          id: 3,
          name: 'الأحماض والقواعد',
          link: 'https://example.com/acids-bases',
          summary: 'نظريات الأحماض والقواعد',
          status: 'لم يبدأ',
          dueDate: '2024-02-25',
          timeSpent: 0
        }
      ]
    }
  ]);

  const [newSubject, setNewSubject] = useState('');
  const [newLesson, setNewLesson] = useState({
    subjectId: 0,
    name: '',
    link: '',
    summary: '',
    dueDate: ''
  });

  const addSubject = () => {
    if (!newSubject.trim()) return;
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    setSubjects([...subjects, {
      id: Date.now(),
      name: newSubject,
      color: colors[subjects.length % colors.length],
      lessons: []
    }]);
    setNewSubject('');
    toast.success('تم إضافة المادة بنجاح');
  };

  const addLesson = () => {
    if (!newLesson.name.trim() || !newLesson.subjectId) return;

    setSubjects(subjects.map(subject => 
      subject.id === newLesson.subjectId 
        ? {
            ...subject,
            lessons: [...subject.lessons, {
              id: Date.now(),
              ...newLesson,
              status: 'لم يبدأ',
              timeSpent: 0
            }]
          }
        : subject
    ));
    
    setNewLesson({
      subjectId: 0,
      name: '',
      link: '',
      summary: '',
      dueDate: ''
    });
    toast.success('تم إضافة الدرس بنجاح');
  };

  const updateLessonStatus = (subjectId: number, lessonId: number, status: string) => {
    setSubjects(subjects.map(subject =>
      subject.id === subjectId
        ? {
            ...subject,
            lessons: subject.lessons.map(lesson =>
              lesson.id === lessonId ? { ...lesson, status } : lesson
            )
          }
        : subject
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'text-green-600 bg-green-100';
      case 'جاري': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">المواد الدراسية</h2>
        <p className="text-gray-600 dark:text-gray-300">
          إدارة المواد والدروس مع متابعة التقدم
        </p>
      </div>

      {/* Add New Subject */}
      <Card>
        <CardHeader>
          <CardTitle>إضافة مادة جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="اسم المادة"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <Button onClick={addSubject}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subjects */}
      <div className="grid gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="border-l-4" style={{ borderLeftColor: subject.color }}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" style={{ color: subject.color }} />
                  {subject.name}
                </CardTitle>
                <Badge variant="outline">
                  {subject.lessons.length} درس
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Lessons Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">اسم الدرس</th>
                      <th className="text-right p-2">الرابط</th>
                      <th className="text-right p-2">الملخص</th>
                      <th className="text-right p-2">الحالة</th>
                      <th className="text-right p-2">تاريخ الانتهاء</th>
                      <th className="text-right p-2">الوقت المستغرق</th>
                      <th className="text-right p-2">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subject.lessons.map((lesson) => (
                      <tr key={lesson.id} className="border-b">
                        <td className="p-2">{lesson.name}</td>
                        <td className="p-2">
                          {lesson.link && (
                            <a href={lesson.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </td>
                        <td className="p-2 text-sm text-gray-600">{lesson.summary}</td>
                        <td className="p-2">
                          <Badge className={getStatusColor(lesson.status)}>
                            {lesson.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm">{lesson.dueDate}</td>
                        <td className="p-2 text-sm">{lesson.timeSpent} دقيقة</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateLessonStatus(subject.id, lesson.id, 'مكتمل')}
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateLessonStatus(subject.id, lesson.id, 'جاري')}
                            >
                              <Clock className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add New Lesson */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-3">إضافة درس جديد</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="اسم الدرس"
                    value={newLesson.subjectId === subject.id ? newLesson.name : ''}
                    onChange={(e) => setNewLesson({...newLesson, subjectId: subject.id, name: e.target.value})}
                  />
                  <Input
                    placeholder="رابط الدرس"
                    value={newLesson.subjectId === subject.id ? newLesson.link : ''}
                    onChange={(e) => setNewLesson({...newLesson, subjectId: subject.id, link: e.target.value})}
                  />
                  <Textarea
                    placeholder="ملخص الدرس"
                    value={newLesson.subjectId === subject.id ? newLesson.summary : ''}
                    onChange={(e) => setNewLesson({...newLesson, subjectId: subject.id, summary: e.target.value})}
                    className="md:col-span-2"
                  />
                  <Input
                    type="date"
                    value={newLesson.subjectId === subject.id ? newLesson.dueDate : ''}
                    onChange={(e) => setNewLesson({...newLesson, subjectId: subject.id, dueDate: e.target.value})}
                  />
                  <Button onClick={addLesson} className="md:col-span-1">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    إضافة الدرس
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// File Upload Section
export function FileUploadSection() {
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: 'أساسيات الكيمياء.pdf',
      type: 'pdf',
      size: '2.3 MB',
      uploadDate: '2024-02-10',
      summary: 'ملف يحتوي على أساسيات الكيمياء العامة والمفاهيم الأساسية'
    }
  ]);

  const [dragOver, setDragOver] = useState(false);
  const [lessonText, setLessonText] = useState('');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : file.type.includes('doc') ? 'doc' : 'text',
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        uploadDate: new Date().toISOString().split('T')[0],
        summary: 'يتم تحليل الملف وإنشاء الملخص...'
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      toast.success('تم رفع الملف: ' + file.name);
      
      // Simulate file processing
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === newFile.id 
            ? {...f, summary: 'تم تحليل الملف وإنشاء ملخص تلقائي للمحتوى'}
            : f
        ));
      }, 2000);
    });
  };

  const generateSummary = () => {
    if (!lessonText.trim()) {
      toast.error('الرجاء إدخال نص الدرس أولاً');
      return;
    }

    const summary = lessonText.slice(0, 200) + '...';
    toast.success('تم إنشاء ملخص الدرس');
    
    const newFile = {
      id: Date.now(),
      name: 'ملخص مكتوب - ' + new Date().toLocaleString('ar'),
      type: 'text',
      size: (lessonText.length / 1024).toFixed(1) + ' KB',
      uploadDate: new Date().toISOString().split('T')[0],
      summary: summary
    };
    
    setUploadedFiles(prev => [...prev, newFile]);
    setLessonText('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">رفع الملفات وتلخيص الدروس</h2>
        <p className="text-gray-600 dark:text-gray-300">
          ارفع ملفات PDF أو Word أو اكتب الدروس مباشرة لإنشاء ملخصات تلقائية
        </p>
      </div>

      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>رفع الملفات</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-300 dark:border-gray-600'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold mb-2">اسحب الملفات هنا أو انقر للاختيار</p>
            <p className="text-gray-500">يدعم ملفات PDF, DOC, DOCX, TXT</p>
            <Button className="mt-4">
              <Upload className="w-4 h-4 mr-2" />
              اختيار الملفات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Write Lesson */}
      <Card>
        <CardHeader>
          <CardTitle>كتابة درس جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="اكتب محتوى الدرس هنا..."
              value={lessonText}
              onChange={(e) => setLessonText(e.target.value)}
              rows={8}
            />
            <Button onClick={generateSummary} disabled={!lessonText.trim()}>
              <FileText className="w-4 h-4 mr-2" />
              إنشاء ملخص تلقائي
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      <Card>
        <CardHeader>
          <CardTitle>الملفات المرفوعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{file.name}</h4>
                      <p className="text-sm text-gray-500">{file.size} • {file.uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{file.summary}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Study Timer Section (Pomodoro)
export function StudyTimerSection() {
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [dailyTime, setDailyTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        setDailyTime(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (isBreak) {
        // Break finished, start new study session
        setTimeLeft(45 * 60);
        setIsBreak(false);
        toast.success('انتهت فترة الراحة! وقت الدراسة');
      } else {
        // Study session finished, start break
        setSessions(prev => prev + 1);
        setTimeLeft(20 * 60); // 20 minutes break
        setIsBreak(true);
        toast.success('انتهت فترة الدراسة! خذ راحة لمدة 20 دقيقة');
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? 20 * 60 : 45 * 60);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">مؤقت المذاكرة</h2>
        <p className="text-gray-600 dark:text-gray-300">
          نظام Pomodoro للدراسة الفعالة - 45 دقيقة دراسة + 20 دقيقة راحة
        </p>
      </div>

      {/* Timer Display */}
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center p-8">
          <div className={`text-6xl font-bold mb-4 ${isBreak ? 'text-green-600' : 'text-blue-600'}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="mb-4">
            <Badge variant={isBreak ? 'destructive' : 'default'} className="text-lg px-4 py-2">
              {isBreak ? 'فترة راحة' : 'وقت الدراسة'}
            </Badge>
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={toggleTimer} size="lg">
              {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isRunning ? 'إيقاف' : 'بدء'}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              إعادة تعيين
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">{sessions}</div>
            <div className="text-gray-600">جلسات اليوم</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">{formatTime(dailyTime)}</div>
            <div className="text-gray-600">إجمالي وقت الدراسة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">{Math.floor(dailyTime / 3600)}</div>
            <div className="text-gray-600">ساعات اليوم</div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Time Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>تتبع الوقت حسب المادة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'الكيمياء العضوية', time: 120, color: '#3b82f6' },
              { name: 'الكيمياء غير العضوية', time: 90, color: '#10b981' },
              { name: 'الكيمياء الفيزيائية', time: 60, color: '#f59e0b' }
            ].map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: subject.color }}></div>
                  <span>{subject.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{subject.time} دقيقة</span>
                  <Progress value={(subject.time / 180) * 100} className="w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Dashboard Section
export function DashboardSection() {
  const subjects = [
    { name: 'الكيمياء العضوية', completed: 8, total: 12, hours: 24.5 },
    { name: 'الكيمياء غير العضوية', completed: 5, total: 10, hours: 15.2 },
    { name: 'الكيمياء الفيزيائية', completed: 3, total: 8, hours: 8.7 }
  ];

  const totalHours = subjects.reduce((sum, subject) => sum + subject.hours, 0);
  const totalCompleted = subjects.reduce((sum, subject) => sum + subject.completed, 0);
  const totalLessons = subjects.reduce((sum, subject) => sum + subject.total, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">لوحة التحكم</h2>
        <p className="text-gray-600 dark:text-gray-300">
          متابعة التقدم والإحصائيات الشاملة
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center p-6">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{totalLessons}</div>
            <div className="text-sm text-gray-600">إجمالي الدروس</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{totalCompleted}</div>
            <div className="text-sm text-gray-600">دروس مكتملة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <div className="text-sm text-gray-600">ساعات الدراسة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <Target className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{Math.round((totalCompleted / totalLessons) * 100)}%</div>
            <div className="text-sm text-gray-600">نسبة الإنجاز</div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle>تقدم المواد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subjects.map((subject, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{subject.name}</h4>
                  <div className="text-sm text-gray-600">
                    {subject.completed}/{subject.total} دروس • {subject.hours} ساعة
                  </div>
                </div>
                <Progress value={(subject.completed / subject.total) * 100} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((subject.completed / subject.total) * 100)}% مكتمل
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>الجدول الزمني للدروس</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: '2024-02-15', lesson: 'الألكانات', subject: 'الكيمياء العضوية', status: 'مكتمل' },
              { date: '2024-02-17', lesson: 'الألكينات', subject: 'الكيمياء العضوية', status: 'جاري' },
              { date: '2024-02-20', lesson: 'الأحماض والقواعد', subject: 'الكيمياء غير العضوية', status: 'لم يبدأ' },
              { date: '2024-02-22', lesson: 'الديناميكا الحرارية', subject: 'الكيمياء الفيزيائية', status: 'لم يبدأ' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="text-sm text-gray-500 min-w-24">{item.date}</div>
                <div className="flex-1">
                  <div className="font-semibold">{item.lesson}</div>
                  <div className="text-sm text-gray-600">{item.subject}</div>
                </div>
                <Badge className={
                  item.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                  item.status === 'جاري' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Learning Resources Section
export function LearningResourcesSection() {
  const resources = [
    {
      category: 'كتب إلكترونية',
      items: [
        { name: 'أساسيات الكيمياء العامة', type: 'PDF', url: '#', description: 'كتاب شامل للمبتدئين' },
        { name: 'الكيمياء العضوية المتقدمة', type: 'PDF', url: '#', description: 'مرجع متخصص للطلاب المتقدمين' }
      ]
    },
    {
      category: 'مواقع تعليمية',
      items: [
        { name: 'Khan Academy Chemistry', type: 'موقع', url: 'https://www.khanacademy.org/science/chemistry', description: 'دروس تفاعلية مجانية' },
        { name: 'ChemLibreTexts', type: 'موقع', url: 'https://chem.libretexts.org/', description: 'مكتبة شاملة للكيمياء' }
      ]
    },
    {
      category: 'فيديوهات تعليمية',
      items: [
        { name: 'Crash Course Chemistry', type: 'يوتيوب', url: '#', description: 'سلسلة فيديوهات ممتعة ومبسطة' },
        { name: 'MIT Chemistry', type: 'يوتيوب', url: '#', description: 'محاضرات جامعية متقدمة' }
      ]
    },
    {
      category: 'أدوات تفاعلية',
      items: [
        { name: 'PhET Simulations', type: 'محاكي', url: '#', description: 'محاكيات تفاعلية للتجارب' },
        { name: 'ChemSketch', type: 'برنامج', url: '#', description: 'برنامج رسم الجزيئات' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">مصادر التعلم</h2>
        <p className="text-gray-600 dark:text-gray-300">
          مجموعة شاملة من المصادر التعليمية المجانية
        </p>
      </div>

      <div className="grid gap-6">
        {resources.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.type}</Badge>
                      <Button size="sm" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Study Tips */}
      <Card>
        <CardHeader>
          <CardTitle>نصائح للدراسة الفعالة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">تقنيات الحفظ</h4>
              <ul className="space-y-2 text-sm">
                <li>• استخدم البطاقات التعليمية للمعادلات</li>
                <li>• اربط المفاهيم بأمثلة من الحياة اليومية</li>
                <li>• راجع المادة بانتظام لتجنب النسيان</li>
                <li>• ارسم الجزيئات والتفاعلات يدوياً</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">حل المسائل</h4>
              <ul className="space-y-2 text-sm">
                <li>• ابدأ بالمسائل البسيطة ثم تدرج</li>
                <li>• اكتب جميع خطوات الحل بوضوح</li>
                <li>• تأكد من وحدات القياس في النتائج</li>
                <li>• راجع الأخطاء الشائعة وتجنبها</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}