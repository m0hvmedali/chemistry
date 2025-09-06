import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Coffee, 
  Target, 
  Award,
  BarChart3,
  Timer,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { db, useUserPoints } from '@/lib/supabase';

interface EnhancedStudyTimerProps {
  userId: string;
  materialId?: string;
  onSessionComplete?: (duration: number) => void;
}

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isBreak: boolean;
  totalStudyTime: number;
  totalBreakTime: number;
  completedSessions: number;
  currentSession: number;
}

export default function EnhancedStudyTimer({ userId, materialId, onSessionComplete }: EnhancedStudyTimerProps) {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 45,
    seconds: 0,
    isRunning: false,
    isBreak: false,
    totalStudyTime: 0,
    totalBreakTime: 0,
    completedSessions: 0,
    currentSession: 1
  });

  const [dailyGoal, setDailyGoal] = useState(180); // 3 ساعات افتراضية
  const [todayTime, setTodayTime] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState<number[]>([]);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { addPoints } = useUserPoints(userId);

  // إعداد الصوت للإشعارات
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYbBz2N1fLSeC4EK4zS8dGOOgcRd8j02n4pBSKe3/LFdDEBL4zS8dGOOgcRd8j02n4pBSKe3/LFdDEBL4zS8dGOOgcRds');
  }, []);

  // تحميل الإحصائيات
  useEffect(() => {
    loadDailyTime();
    loadWeeklyStats();
  }, [userId]);

  const loadDailyTime = async () => {
    const sessions = db.getStudySessions(userId);
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => 
      new Date(s.created_at).toDateString() === today && s.session_type === 'study'
    );
    const totalTime = todaySessions.reduce((sum, session) => sum + session.duration_minutes, 0);
    setTodayTime(totalTime);
  };

  const loadWeeklyStats = async () => {
    const sessions = db.getStudySessions(userId);
    const weekStats: number[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayString = date.toDateString();
      
      const daySessions = sessions.filter(s => 
        new Date(s.created_at).toDateString() === dayString && s.session_type === 'study'
      );
      const dayTime = daySessions.reduce((sum, session) => sum + session.duration_minutes, 0);
      weekStats.push(dayTime);
    }
    
    setWeeklyStats(weekStats);
  };

  // تشغيل المؤقت
  const startTimer = useCallback(() => {
    if (!timer.isRunning) {
      setSessionStartTime(new Date());
      setTimer(prev => ({ ...prev, isRunning: true }));
      
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            // انتهاء الجلسة
            handleSessionComplete();
            return prev;
          }
        });
      }, 1000);
    }
  }, [timer.isRunning]);

  // إيقاف المؤقت
  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimer(prev => ({ ...prev, isRunning: false }));
  }, []);

  // إيقاف المؤقت تماماً
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // حفظ الجلسة إذا كانت أكثر من 5 دقائق
    const elapsedMinutes = timer.isBreak ? 20 - timer.minutes : 45 - timer.minutes;
    if (elapsedMinutes >= 5 && sessionStartTime) {
      saveSession(elapsedMinutes, false);
    }
    
    setTimer({
      minutes: 45,
      seconds: 0,
      isRunning: false,
      isBreak: false,
      totalStudyTime: timer.totalStudyTime,
      totalBreakTime: timer.totalBreakTime,
      completedSessions: timer.completedSessions,
      currentSession: timer.currentSession
    });
    setSessionStartTime(null);
  }, [timer, sessionStartTime]);

  // انتهاء الجلسة
  const handleSessionComplete = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // تشغيل صوت الإشعار
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    if (timer.isBreak) {
      // انتهاء فترة الراحة
      setTimer(prev => ({
        ...prev,
        minutes: 45,
        seconds: 0,
        isRunning: false,
        isBreak: false,
        totalBreakTime: prev.totalBreakTime + 20,
        currentSession: prev.currentSession + 1
      }));
      
      toast.success('انتهت فترة الراحة! استعد للجلسة التالية', {
        duration: 5000,
        action: {
          label: 'ابدأ الآن',
          onClick: startTimer
        }
      });
      
      await saveSession(20, true);
    } else {
      // انتهاء جلسة الدراسة
      const studyDuration = 45;
      setTimer(prev => ({
        ...prev,
        minutes: 20,
        seconds: 0,
        isRunning: false,
        isBreak: true,
        totalStudyTime: prev.totalStudyTime + studyDuration,
        completedSessions: prev.completedSessions + 1
      }));

      // إضافة نقاط لإكمال الجلسة
      await addPoints(15, 'إكمال جلسة دراسة 45 دقيقة');
      await saveSession(studyDuration, true);
      await loadDailyTime();

      // إظهار تذكير الراحة
      setShowBreakReminder(true);
      
      toast.success('ممتاز! أكملت جلسة دراسة كاملة (+15 نقطة)', {
        duration: 10000,
        action: {
          label: 'ابدأ الراحة',
          onClick: startBreak
        }
      });

      if (onSessionComplete) {
        onSessionComplete(studyDuration);
      }
    }

    setSessionStartTime(null);
  }, [timer.isBreak, addPoints, onSessionComplete]);

  // بدء فترة الراحة
  const startBreak = useCallback(() => {
    setShowBreakReminder(false);
    setTimer(prev => ({ ...prev, isBreak: true, minutes: 20, seconds: 0 }));
    startTimer();
  }, [startTimer]);

  // تخطي الراحة
  const skipBreak = useCallback(() => {
    setShowBreakReminder(false);
    setTimer(prev => ({
      ...prev,
      isBreak: false,
      minutes: 45,
      seconds: 0,
      currentSession: prev.currentSession + 1
    }));
  }, []);

  // حفظ الجلسة في قاعدة البيانات
  const saveSession = async (duration: number, completed: boolean) => {
    try {
      await db.saveStudySession({
        user_id: userId,
        material_id: materialId,
        duration_minutes: duration,
        break_duration_minutes: timer.isBreak ? duration : 0,
        completed,
        points_earned: completed && !timer.isBreak ? 15 : 0,
        session_type: timer.isBreak ? 'break' : 'study'
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  // تنسيق الوقت
  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // حساب النسبة المئوية للتقدم
  const getProgress = () => {
    const totalSeconds = timer.isBreak ? 20 * 60 : 45 * 60;
    const remainingSeconds = timer.minutes * 60 + timer.seconds;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  return (
    <div className="space-y-6">
      {/* المؤقت الرئيسي */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 opacity-50" />
        <CardContent className="relative z-10 p-8">
          <div className="text-center">
            <motion.div
              animate={{ scale: timer.isRunning ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: timer.isRunning ? Infinity : 0 }}
              className="mb-6"
            >
              <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full border-8 ${
                timer.isBreak 
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' 
                  : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
              }`}>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${
                    timer.isBreak ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {formatTime(timer.minutes, timer.seconds)}
                  </div>
                  <div className={`text-sm font-medium ${
                    timer.isBreak ? 'text-green-500' : 'text-blue-500'
                  }`}>
                    {timer.isBreak ? 'فترة راحة' : 'دراسة'}
                  </div>
                </div>
              </div>
            </motion.div>

            <Progress 
              value={getProgress()} 
              className={`w-full mb-6 h-3 ${
                timer.isBreak ? '[&>div]:bg-green-500' : '[&>div]:bg-blue-500'
              }`}
            />

            <div className="flex justify-center gap-4 mb-6">
              {!timer.isRunning ? (
                <Button 
                  onClick={startTimer} 
                  size="lg"
                  className={`${
                    timer.isBreak 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Play className="mr-2 h-5 w-5" />
                  {timer.isBreak ? 'ابدأ الراحة' : 'ابدأ الدراسة'}
                </Button>
              ) : (
                <Button onClick={pauseTimer} variant="outline" size="lg">
                  <Pause className="mr-2 h-5 w-5" />
                  إيقاف مؤقت
                </Button>
              )}
              
              <Button onClick={stopTimer} variant="outline" size="lg">
                <Square className="mr-2 h-5 w-5" />
                إيقاف
              </Button>
            </div>

            {/* معلومات الجلسة */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">#{timer.currentSession}</div>
                <div className="text-sm text-gray-500">الجلسة الحالية</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{timer.completedSessions}</div>
                <div className="text-sm text-gray-500">جلسات مكتملة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(timer.totalStudyTime)} د
                </div>
                <div className="text-sm text-gray-500">إجمالي الدراسة</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الإحصائيات اليومية والأسبوعية */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* الهدف اليومي */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              الهدف اليومي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>التقدم</span>
                <span>{todayTime} / {dailyGoal} دقيقة</span>
              </div>
              <Progress value={(todayTime / dailyGoal) * 100} className="h-3" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-blue-600">{todayTime}</div>
                  <div className="text-xs text-gray-500">دقائق اليوم</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {Math.round((todayTime / dailyGoal) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">مكتمل</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* الإحصائيات الأسبوعية */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              آخر 7 أيام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyStats.map((time, index) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - index));
                const dayName = date.toLocaleDateString('ar-SA', { weekday: 'short' });
                const maxTime = Math.max(...weeklyStats, 180);
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 text-xs text-gray-500">{dayName}</div>
                    <div className="flex-1">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(time / maxTime) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-xs text-right">{time}د</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نافذة تذكير الراحة */}
      <AnimatePresence>
        {showBreakReminder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <Card className="w-full max-w-md mx-4">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <Coffee className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>وقت الراحة!</CardTitle>
                <CardDescription>
                  أكملت جلسة دراسة رائعة! خذ استراحة 20 دقيقة لتجديد طاقتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button onClick={startBreak} className="w-full bg-green-600 hover:bg-green-700">
                    <Coffee className="mr-2 h-4 w-4" />
                    ابدأ فترة الراحة (20 دقيقة)
                  </Button>
                  <Button onClick={skipBreak} variant="outline" className="w-full">
                    تخطي الراحة
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    نصائح للراحة الفعالة:
                  </h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• قم بالمشي أو تمارين خفيفة</li>
                    <li>• اشرب الماء أو مشروب صحي</li>
                    <li>• تجنب الشاشات والهاتف</li>
                    <li>• تنفس بعمق واسترخ</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}