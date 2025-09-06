import { createClient } from '@supabase/supabase-js';

// هذه معاملات وهمية للتطوير - في الإنتاج يجب استخدام متغيرات البيئة الحقيقية
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  points: number;
  level: number;
  experience: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface StudyMaterial {
  id: string;
  user_id: string;
  title: string;
  description: string;
  content: string;
  subject: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  points_awarded: number;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  material_id?: string;
  duration_minutes: number;
  break_duration_minutes: number;
  completed: boolean;
  points_earned: number;
  session_type: 'study' | 'break';
  created_at: string;
}

export interface FileUpload {
  id: string;
  user_id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  summary?: string;
  processed: boolean;
  created_at: string;
}

// نظام النقاط والمستويات
export const POINTS_SYSTEM = {
  COMPLETE_LESSON: 10,
  CORRECT_ANSWER: 5,
  STUDY_SESSION_45MIN: 15,
  UPLOAD_FILE: 3,
  DAILY_LOGIN: 2,
  STREAK_BONUS: 5,
};

export const LEVELS = [
  { level: 1, minPoints: 0, title: 'مبتدئ', color: '#3b82f6' },
  { level: 2, minPoints: 100, title: 'متعلم', color: '#10b981' },
  { level: 3, minPoints: 300, title: 'متقدم', color: '#f59e0b' },
  { level: 4, minPoints: 600, title: 'خبير', color: '#ef4444' },
  { level: 5, minPoints: 1000, title: 'أستاذ', color: '#8b5cf6' },
];

// دوال مساعدة لقاعدة البيانات (سنستخدم localStorage كبديل مؤقت)
class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // المستخدم
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const stored = localStorage.getItem(`user_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
      // إنشاء ملف تعريف جديد
      const newProfile: UserProfile = {
        id: userId,
        email: `user_${userId}@example.com`,
        username: `User_${userId}`,
        points: 0,
        level: 1,
        experience: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await this.updateUserProfile(newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async updateUserProfile(profile: UserProfile): Promise<void> {
    try {
      profile.updated_at = new Date().toISOString();
      localStorage.setItem(`user_${profile.id}`, JSON.stringify(profile));
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }

  async addPoints(userId: string, points: number, reason: string): Promise<UserProfile | null> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) return null;

      profile.points += points;
      profile.experience += points;

      // حساب المستوى الجديد
      const newLevel = this.calculateLevel(profile.points);
      if (newLevel > profile.level) {
        profile.level = newLevel;
        // مكافأة المستوى الجديد
        profile.points += 50;
      }

      await this.updateUserProfile(profile);
      
      // تسجيل النشاط
      this.logActivity(userId, 'points_earned', { points, reason, newTotal: profile.points });
      
      return profile;
    } catch (error) {
      console.error('Error adding points:', error);
      return null;
    }
  }

  calculateLevel(points: number): number {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].minPoints) {
        return LEVELS[i].level;
      }
    }
    return 1;
  }

  // المواد الدراسية
  async getStudyMaterials(userId: string): Promise<StudyMaterial[]> {
    try {
      const stored = localStorage.getItem(`materials_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting study materials:', error);
      return [];
    }
  }

  async saveStudyMaterial(userId: string, material: Omit<StudyMaterial, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<StudyMaterial> {
    try {
      const materials = await this.getStudyMaterials(userId);
      const newMaterial: StudyMaterial = {
        ...material,
        id: this.generateId(),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      materials.push(newMaterial);
      localStorage.setItem(`materials_${userId}`, JSON.stringify(materials));
      return newMaterial;
    } catch (error) {
      console.error('Error saving study material:', error);
      throw error;
    }
  }

  async updateStudyMaterial(userId: string, materialId: string, updates: Partial<StudyMaterial>): Promise<void> {
    try {
      const materials = await this.getStudyMaterials(userId);
      const index = materials.findIndex(m => m.id === materialId);
      if (index !== -1) {
        materials[index] = { ...materials[index], ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem(`materials_${userId}`, JSON.stringify(materials));
        
        // إضافة نقاط إذا تم إكمال الدرس
        if (updates.completed && !materials[index].completed) {
          await this.addPoints(userId, POINTS_SYSTEM.COMPLETE_LESSON, 'إكمال درس');
        }
      }
    } catch (error) {
      console.error('Error updating study material:', error);
    }
  }

  async deleteStudyMaterial(userId: string, materialId: string): Promise<void> {
    try {
      const materials = await this.getStudyMaterials(userId);
      const filtered = materials.filter(m => m.id !== materialId);
      localStorage.setItem(`materials_${userId}`, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting study material:', error);
    }
  }

  // جلسات الدراسة
  async saveStudySession(session: Omit<StudySession, 'id' | 'created_at'>): Promise<void> {
    try {
      const sessions = this.getStudySessions(session.user_id);
      const newSession: StudySession = {
        ...session,
        id: this.generateId(),
        created_at: new Date().toISOString(),
      };
      sessions.push(newSession);
      localStorage.setItem(`sessions_${session.user_id}`, JSON.stringify(sessions));

      // إضافة نقاط للجلسة
      if (session.completed && session.duration_minutes >= 45) {
        await this.addPoints(session.user_id, POINTS_SYSTEM.STUDY_SESSION_45MIN, 'جلسة دراسة 45 دقيقة');
      }
    } catch (error) {
      console.error('Error saving study session:', error);
    }
  }

  getStudySessions(userId: string): StudySession[] {
    try {
      const stored = localStorage.getItem(`sessions_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting study sessions:', error);
      return [];
    }
  }

  // الملفات المرفوعة
  async saveFileUpload(file: Omit<FileUpload, 'id' | 'created_at'>): Promise<FileUpload> {
    try {
      const files = this.getFileUploads(file.user_id);
      const newFile: FileUpload = {
        ...file,
        id: this.generateId(),
        created_at: new Date().toISOString(),
      };
      files.push(newFile);
      localStorage.setItem(`files_${file.user_id}`, JSON.stringify(files));

      // إضافة نقاط لرفع الملف
      await this.addPoints(file.user_id, POINTS_SYSTEM.UPLOAD_FILE, 'رفع ملف');

      return newFile;
    } catch (error) {
      console.error('Error saving file upload:', error);
      throw error;
    }
  }

  getFileUploads(userId: string): FileUpload[] {
    try {
      const stored = localStorage.getItem(`files_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting file uploads:', error);
      return [];
    }
  }

  async updateFileUpload(userId: string, fileId: string, updates: Partial<FileUpload>): Promise<void> {
    try {
      const files = this.getFileUploads(userId);
      const index = files.findIndex(f => f.id === fileId);
      if (index !== -1) {
        files[index] = { ...files[index], ...updates };
        localStorage.setItem(`files_${userId}`, JSON.stringify(files));
      }
    } catch (error) {
      console.error('Error updating file upload:', error);
    }
  }

  async deleteFileUpload(userId: string, fileId: string): Promise<void> {
    try {
      const files = this.getFileUploads(userId);
      const filtered = files.filter(f => f.id !== fileId);
      localStorage.setItem(`files_${userId}`, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting file upload:', error);
    }
  }

  // تسجيل النشاط
  logActivity(userId: string, action: string, data: any): void {
    try {
      const activities = this.getActivities(userId);
      activities.push({
        id: this.generateId(),
        user_id: userId,
        action,
        data,
        timestamp: new Date().toISOString(),
      });
      // حفظ آخر 1000 نشاط فقط
      if (activities.length > 1000) {
        activities.splice(0, activities.length - 1000);
      }
      localStorage.setItem(`activities_${userId}`, JSON.stringify(activities));
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  getActivities(userId: string): any[] {
    try {
      const stored = localStorage.getItem(`activities_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting activities:', error);
      return [];
    }
  }

  // دوال مساعدة
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // إحصائيات
  async getStats(userId: string): Promise<any> {
    try {
      const profile = await this.getUserProfile(userId);
      const materials = await this.getStudyMaterials(userId);
      const sessions = this.getStudySessions(userId);
      const files = this.getFileUploads(userId);

      const completedMaterials = materials.filter(m => m.completed).length;
      const totalStudyTime = sessions.reduce((total, session) => {
        return session.session_type === 'study' ? total + session.duration_minutes : total;
      }, 0);

      const today = new Date().toDateString();
      const todayTime = sessions
        .filter(s => new Date(s.created_at).toDateString() === today && s.session_type === 'study')
        .reduce((total, session) => total + session.duration_minutes, 0);

      return {
        profile,
        totalMaterials: materials.length,
        completedMaterials,
        completionRate: materials.length > 0 ? (completedMaterials / materials.length) * 100 : 0,
        totalStudyTime,
        todayStudyTime: todayTime,
        totalSessions: sessions.filter(s => s.session_type === 'study').length,
        totalFiles: files.length,
        currentLevel: this.calculateLevel(profile?.points || 0),
        nextLevel: this.getNextLevel(profile?.points || 0),
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return null;
    }
  }

  private getNextLevel(points: number): { level: number; pointsNeeded: number } | null {
    const currentLevel = this.calculateLevel(points);
    const nextLevelInfo = LEVELS.find(l => l.level > currentLevel);
    if (nextLevelInfo) {
      return {
        level: nextLevelInfo.level,
        pointsNeeded: nextLevelInfo.minPoints - points,
      };
    }
    return null;
  }
}

export const db = DatabaseService.getInstance();

// Hook لاستخدام النقاط والمستوى
export const useUserPoints = (userId: string) => {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const userProfile = await db.getUserProfile(userId);
      setProfile(userProfile);
      setLoading(false);
    };
    loadProfile();
  }, [userId]);

  const addPoints = async (points: number, reason: string) => {
    const updatedProfile = await db.addPoints(userId, points, reason);
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
  };

  return { profile, loading, addPoints };
};

// استيراد React للـ hook
import React from 'react';