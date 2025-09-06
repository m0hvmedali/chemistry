import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Clock, 
  Brain, 
  Shield, 
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsPageProps {
  userId: string;
}

export default function SettingsPage({ userId }: SettingsPageProps) {
  const { isDark, toggleTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    // إعدادات الملف الشخصي
    username: 'Student User',
    email: 'student@example.com',
    
    // إعدادات الإشعارات
    enableNotifications: true,
    studyReminders: true,
    breakReminders: true,
    dailyGoalReminders: true,
    
    // إعدادات الدراسة
    dailyGoal: 180, // دقائق
    studySessionLength: 45,
    breakLength: 20,
    autoStartBreak: true,
    
    // إعدادات الواجهة
    theme: isDark ? 'dark' : 'light',
    language: 'ar',
    fontSize: 'medium',
    compactMode: false,
    
    // إعدادات الذكاء الاصطناعي
    chatbotPersonality: 'friendly',
    responseLength: 'medium',
    includeExamples: true,
    
    // إعدادات الخصوصية
    saveHistory: true,
    shareProgress: false,
    anonymousAnalytics: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(`settings_${userId}`, JSON.stringify(settings));
      toast.success('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      toast.error('فشل في حفظ الإعدادات');
    }
  };

  const resetSettings = () => {
    setSettings({
      username: 'Student User',
      email: 'student@example.com',
      enableNotifications: true,
      studyReminders: true,
      breakReminders: true,
      dailyGoalReminders: true,
      dailyGoal: 180,
      studySessionLength: 45,
      breakLength: 20,
      autoStartBreak: true,
      theme: 'light',
      language: 'ar',
      fontSize: 'medium',
      compactMode: false,
      chatbotPersonality: 'friendly',
      responseLength: 'medium',
      includeExamples: true,
      saveHistory: true,
      shareProgress: false,
      anonymousAnalytics: true
    });
    toast.success('تم إعادة تعيين الإعدادات');
  };

  const exportData = () => {
    try {
      const userData = {
        profile: localStorage.getItem(`user_${userId}`),
        materials: localStorage.getItem(`materials_${userId}`),
        sessions: localStorage.getItem(`sessions_${userId}`),
        files: localStorage.getItem(`files_${userId}`),
        settings: localStorage.getItem(`settings_${userId}`)
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `chemistry-lab-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      toast.success('تم تصدير البيانات بنجاح');
    } catch (error) {
      toast.error('فشل في تصدير البيانات');
    }
  };

  const clearAllData = () => {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        const keys = Object.keys(localStorage).filter(key => key.includes(userId));
        keys.forEach(key => localStorage.removeItem(key));
        toast.success('تم حذف جميع البيانات');
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toast.error('فشل في حذف البيانات');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الإعدادات</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            خصص تجربة التعلم الخاصة بك
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={saveSettings} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" />
            حفظ الإعدادات
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* الملف الشخصي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                الملف الشخصي
              </CardTitle>
              <CardDescription>
                معلومات حسابك الشخصية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input
                    id="username"
                    value={settings.username}
                    onChange={(e) => handleSettingChange('username', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* الإشعارات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                الإشعارات
              </CardTitle>
              <CardDescription>
                اختر الإشعارات التي تريد تلقيها
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>تفعيل الإشعارات</Label>
                  <p className="text-sm text-gray-500">تلقي جميع الإشعارات</p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => handleSettingChange('enableNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>تذكيرات الدراسة</Label>
                  <p className="text-sm text-gray-500">تذكيرك بأوقات المذاكرة</p>
                </div>
                <Switch
                  checked={settings.studyReminders}
                  onCheckedChange={(checked) => handleSettingChange('studyReminders', checked)}
                  disabled={!settings.enableNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>تذكيرات الراحة</Label>
                  <p className="text-sm text-gray-500">تذكيرك بأخذ فترات راحة</p>
                </div>
                <Switch
                  checked={settings.breakReminders}
                  onCheckedChange={(checked) => handleSettingChange('breakReminders', checked)}
                  disabled={!settings.enableNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* إعدادات الدراسة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                إعدادات الدراسة
              </CardTitle>
              <CardDescription>
                خصص أوقات الدراسة والراحة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>الهدف اليومي (دقائق): {settings.dailyGoal}</Label>
                <Slider
                  value={[settings.dailyGoal]}
                  onValueChange={([value]) => handleSettingChange('dailyGoal', value)}
                  max={480}
                  min={30}
                  step={15}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  من 30 دقيقة إلى 8 ساعات يومياً
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>مدة جلسة الدراسة (دقائق)</Label>
                  <Input
                    type="number"
                    min="15"
                    max="90"
                    value={settings.studySessionLength}
                    onChange={(e) => handleSettingChange('studySessionLength', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>مدة الراحة (دقائق)</Label>
                  <Input
                    type="number"
                    min="5"
                    max="30"
                    value={settings.breakLength}
                    onChange={(e) => handleSettingChange('breakLength', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>بدء الراحة تلقائياً</Label>
                  <p className="text-sm text-gray-500">بدء مؤقت الراحة تلقائياً بعد انتهاء الدراسة</p>
                </div>
                <Switch
                  checked={settings.autoStartBreak}
                  onCheckedChange={(checked) => handleSettingChange('autoStartBreak', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* إعدادات الواجهة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                إعدادات الواجهة
              </CardTitle>
              <CardDescription>
                خصص مظهر التطبيق
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>الوضع الداكن</Label>
                  <p className="text-sm text-gray-500">استخدام الثيم الداكن</p>
                </div>
                <Switch
                  checked={isDark}
                  onCheckedChange={toggleTheme}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>اللغة</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>حجم الخط</Label>
                  <Select value={settings.fontSize} onValueChange={(value) => handleSettingChange('fontSize', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">صغير</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">كبير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* إعدادات الذكاء الاصطناعي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                المساعد الذكي
              </CardTitle>
              <CardDescription>
                خصص سلوك المساعد الذكي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>شخصية المساعد</Label>
                <Select value={settings.chatbotPersonality} onValueChange={(value) => handleSettingChange('chatbotPersonality', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">ودود ومشجع</SelectItem>
                    <SelectItem value="professional">مهني وأكاديمي</SelectItem>
                    <SelectItem value="casual">غير رسمي ومرح</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>طول الاستجابة</Label>
                <Select value={settings.responseLength} onValueChange={(value) => handleSettingChange('responseLength', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">قصير ومختصر</SelectItem>
                    <SelectItem value="medium">متوسط ومفصل</SelectItem>
                    <SelectItem value="long">طويل وشامل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>تضمين أمثلة</Label>
                  <p className="text-sm text-gray-500">إضافة أمثلة عملية في الإجابات</p>
                </div>
                <Switch
                  checked={settings.includeExamples}
                  onCheckedChange={(checked) => handleSettingChange('includeExamples', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* الخصوصية والبيانات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                الخصوصية والبيانات
              </CardTitle>
              <CardDescription>
                إدارة خصوصية بياناتك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>حفظ السجل</Label>
                  <p className="text-sm text-gray-500">حفظ تاريخ الدراسة والمحادثات</p>
                </div>
                <Switch
                  checked={settings.saveHistory}
                  onCheckedChange={(checked) => handleSettingChange('saveHistory', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>الإحصائيات المجهولة</Label>
                  <p className="text-sm text-gray-500">مساعدة تطوير التطبيق بإرسال إحصائيات مجهولة</p>
                </div>
                <Switch
                  checked={settings.anonymousAnalytics}
                  onCheckedChange={(checked) => handleSettingChange('anonymousAnalytics', checked)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button onClick={exportData} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  تصدير البيانات
                </Button>
                
                <Button onClick={resetSettings} variant="outline" className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  إعادة تعيين الإعدادات
                </Button>
                
                <Button onClick={clearAllData} variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                  <Trash2 className="mr-2 h-4 w-4" />
                  حذف جميع البيانات
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}