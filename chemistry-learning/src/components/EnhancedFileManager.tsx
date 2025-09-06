import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  FileImage, 
  File, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  MoreVertical,
  Search,
  Filter,
  Calendar,
  FileCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { db, FileUpload, useUserPoints } from '@/lib/supabase';

interface FileWithPreview extends File {
  preview?: string;
  id?: string;
}

interface EnhancedFileManagerProps {
  userId: string;
}

export default function EnhancedFileManager({ userId }: EnhancedFileManagerProps) {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<FileUpload | null>(null);
  const [editingFile, setEditingFile] = useState<FileUpload | null>(null);
  const [editForm, setEditForm] = useState({
    filename: '',
    summary: ''
  });
  const { addPoints } = useUserPoints(userId);

  // تحميل الملفات المحفوظة
  useEffect(() => {
    loadFiles();
  }, [userId]);

  const loadFiles = async () => {
    try {
      const userFiles = db.getFileUploads(userId);
      setFiles(userFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('فشل في تحميل الملفات');
    }
  };

  // معالجة سحب وإسقاط الملفات
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        id: Math.random().toString(36).substr(2, 9)
      })
    );
    setUploadedFiles(prev => [...prev, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  // رفع الملفات والمعالجة
  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('يرجى اختيار ملف واحد على الأقل');
      return;
    }

    setIsProcessing(true);

    try {
      for (const file of uploadedFiles) {
        // محاكاة رفع الملف
        const fileData = await processFile(file);
        const summary = await generateSummary(file);

        const savedFile = await db.saveFileUpload({
          user_id: userId,
          filename: file.name,
          file_path: `/uploads/${userId}/${file.id}`,
          file_type: file.type,
          file_size: file.size,
          summary,
          processed: true
        });

        // إضافة نقاط لرفع الملف
        await addPoints(3, 'رفع ملف');
      }

      setUploadedFiles([]);
      await loadFiles();
      toast.success(`تم رفع ${uploadedFiles.length} ملف بنجاح! +${uploadedFiles.length * 3} نقاط`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('فشل في رفع الملفات');
    } finally {
      setIsProcessing(false);
    }
  };

  // معالجة الملف وقراءة المحتوى
  const processFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // للملفات الأخرى، نحفظ كـ base64
        reader.readAsDataURL(file);
      }
    });
  };

  // توليد ملخص تلقائي
  const generateSummary = async (file: File): Promise<string> => {
    // محاكاة تحليل الملف وتوليد ملخص
    const fileType = file.type;
    const fileName = file.name;
    const fileSize = Math.round(file.size / 1024);

    if (fileType.includes('pdf')) {
      return `ملف PDF: ${fileName} (${fileSize} كيلوبايت). يحتوي على محتوى أكاديمي مناسب للدراسة والمراجعة.`;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return `مستند Word: ${fileName} (${fileSize} كيلوبايت). مستند نصي يحتوي على معلومات دراسية مفصلة.`;
    } else if (fileType.includes('text')) {
      return `ملف نصي: ${fileName} (${fileSize} كيلوبايت). ملف نص بسيط يحتوي على ملاحظات أو مراجع.`;
    } else if (fileType.includes('image')) {
      return `صورة: ${fileName} (${fileSize} كيلوبايت). صورة تعليمية أو رسم بياني مناسب للمراجعة.`;
    } else {
      return `ملف: ${fileName} (${fileSize} كيلوبايت). ملف متنوع يحتوي على محتوى تعليمي.`;
    }
  };

  // حذف ملف من القائمة المؤقتة
  const removeUploadedFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // تصفية الملفات
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.summary && file.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || file.file_type.includes(filterType);
    return matchesSearch && matchesFilter;
  });

  // فتح ملف للعرض
  const viewFile = (file: FileUpload) => {
    setSelectedFile(file);
  };

  // تحرير ملف
  const startEditFile = (file: FileUpload) => {
    setEditingFile(file);
    setEditForm({
      filename: file.filename,
      summary: file.summary || ''
    });
  };

  // حفظ التعديلات
  const saveEdit = async () => {
    if (!editingFile) return;

    try {
      await db.updateFileUpload(userId, editingFile.id, {
        filename: editForm.filename,
        summary: editForm.summary
      });
      
      await loadFiles();
      setEditingFile(null);
      toast.success('تم حفظ التعديلات بنجاح');
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('فشل في حفظ التعديلات');
    }
  };

  // حذف ملف
  const deleteFile = async (fileId: string) => {
    try {
      await db.deleteFileUpload(userId, fileId);
      await loadFiles();
      toast.success('تم حذف الملف بنجاح');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('فشل في حذف الملف');
    }
  };

  // تحديد أيقونة الملف
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <FileImage className="h-8 w-8 text-green-600" />;
    if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-red-600" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileText className="h-8 w-8 text-blue-600" />;
    return <File className="h-8 w-8 text-gray-600" />;
  };

  // تحديد لون البادج
  const getStatusColor = (processed: boolean) => {
    return processed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      {/* منطقة رفع الملفات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            رفع ملفات جديدة
          </CardTitle>
          <CardDescription>
            اسحب الملفات هنا أو انقر لاختيارها (PDF, DOC, TXT, صور - حد أقصى 10 ميجابايت)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600 dark:text-blue-400">أفلت الملفات هنا...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">اسحب وأفلت الملفات هنا</p>
                <p className="text-gray-500 dark:text-gray-400">أو انقر لاختيار الملفات</p>
              </div>
            )}
          </motion.div>

          {/* عرض الملفات المرفوعة المؤقتة */}
          <AnimatePresence>
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <h4 className="font-medium mb-3">الملفات المختارة:</h4>
                <div className="grid gap-3">
                  {uploadedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(file.size / 1024)} كيلوبايت
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUploadedFile(file.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <Button
                  onClick={handleUpload}
                  className="w-full mt-4"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      رفع الملفات (+{uploadedFiles.length * 3} نقاط)
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* إدارة الملفات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            الملفات المرفوعة ({files.length})
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Label htmlFor="search">البحث في الملفات</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="ابحث في أسماء الملفات أو الملخصات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filter">تصفية حسب النوع</Label>
              <select
                id="filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="all">جميع الأنواع</option>
                <option value="pdf">PDF</option>
                <option value="word">Word</option>
                <option value="text">نص</option>
                <option value="image">صور</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {files.length === 0 ? 'لم يتم رفع أي ملفات بعد' : 'لا توجد ملفات تطابق البحث'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getFileIcon(file.file_type)}
                    <div className="flex-1">
                      <h4 className="font-medium">{file.filename}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {file.summary || 'لا يوجد ملخص'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className={getStatusColor(file.processed)}>
                          {file.processed ? 'معالج' : 'قيد المعالجة'}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {Math.round(file.file_size / 1024)} كيلوبايت
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(file.created_at).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => viewFile(file)}>
                        <Eye className="mr-2 h-4 w-4" />
                        عرض
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => startEditFile(file)}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteFile(file.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* نافذة عرض الملف */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.filename}</DialogTitle>
            <DialogDescription>
              تفاصيل الملف ومعاينة المحتوى
            </DialogDescription>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">حجم الملف:</span> {Math.round(selectedFile.file_size / 1024)} كيلوبايت
                </div>
                <div>
                  <span className="font-medium">نوع الملف:</span> {selectedFile.file_type}
                </div>
                <div>
                  <span className="font-medium">تاريخ الرفع:</span> {new Date(selectedFile.created_at).toLocaleString('ar-SA')}
                </div>
                <div>
                  <span className="font-medium">الحالة:</span> 
                  <Badge className={`ml-2 ${getStatusColor(selectedFile.processed)}`}>
                    {selectedFile.processed ? 'معالج' : 'قيد المعالجة'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">الملخص:</h4>
                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {selectedFile.summary || 'لا يوجد ملخص متاح'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* نافذة تعديل الملف */}
      <Dialog open={!!editingFile} onOpenChange={() => setEditingFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الملف</DialogTitle>
            <DialogDescription>
              يمكنك تعديل اسم الملف والملخص
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-filename">اسم الملف</Label>
              <Input
                id="edit-filename"
                value={editForm.filename}
                onChange={(e) => setEditForm(prev => ({ ...prev, filename: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-summary">الملخص</Label>
              <Textarea
                id="edit-summary"
                value={editForm.summary}
                onChange={(e) => setEditForm(prev => ({ ...prev, summary: e.target.value }))}
                rows={4}
                placeholder="اكتب ملخصاً مفيداً للملف..."
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={saveEdit} className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                حفظ التعديلات
              </Button>
              <Button variant="outline" onClick={() => setEditingFile(null)}>
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}