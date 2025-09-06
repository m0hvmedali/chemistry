import React, { useState, useRef, useEffect } from 'react';
import ChatGPTEmbed from '@/components/ChatGPTEmbed';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  FileText, 
  Brain, 
  Zap, 
  MessageCircle,
  Upload,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { db, FileUpload } from '@/lib/supabase';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  fileContext?: string;
}

interface SmartChatbotProps {
  userId: string;
  isFloating?: boolean;
  onClose?: () => void;
}

export default function SmartChatbot({ userId, isFloating = false, onClose }: SmartChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'مرحباً! أنا مساعدك الذكي في تعلم الكيمياء. يمكنني الإجابة على أسئلتك بناءً على الfileات التي رفعتها والمحتوى التعليمي. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trainedFiles, setTrainedFiles] = useState<FileUpload[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainer = useRef<HTMLDivElement>(null);

  // تحميل الfileات المدربة
  useEffect(() => {
    loadTrainedFiles();
  }, [userId]);

  // تمرير إلى أسفل عند إضافة رسالة جديدة
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadTrainedFiles = async () => {
    try {
      const files = db.getFileUploads(userId);
      const processedFiles = files.filter(f => f.processed);
      setTrainedFiles(processedFiles);
    } catch (error) {
      console.error('Error loading trained files:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // معالجة الرسائل
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(userMessage.content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        fileContext: response.fileContext
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, an error occurred while processing your question. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // توليد الاستجابة الذكية
  const generateResponse = async (question: string): Promise<{ content: string; fileContext?: string }> => {
    // البحث في الfileات المدربة
    const relevantContent = searchInTrainedFiles(question);
    
    // قاعدة معرفية أساسية للكيمياء
    const chemistrKnowledge = getChemistryKnowledge(question);
    
    // دمج المحتوى وتوليد الإجابة
    if (relevantContent) {
      return {
        content: generateContextualResponse(question, relevantContent),
        fileContext: relevantContent.filename
      };
    } else if (chemistrKnowledge) {
      return {
        content: chemistrKnowledge
      };
    } else {
      return {
        content: generateGeneralResponse(question)
      };
    }
  };

  // البحث في الfileات المدربة
  const searchInTrainedFiles = (question: string): { content: string; filename: string } | null => {
    const keywords = extractKeywords(question);
    
    for (const file of trainedFiles) {
      if (file.summary) {
        const summaryLower = file.summary.toLowerCase();
        const questionLower = question.toLowerCase();
        
        // بحث بسيط في الملخص
        if (keywords.some(keyword => summaryLower.includes(keyword.toLowerCase())) ||
            summaryLower.includes(questionLower)) {
          return {
            content: file.summary,
            filename: file.filename
          };
        }
      }
    }
    
    return null;
  };

  // استخراج الكلمات المفتاحية
  const extractKeywords = (text: string): string[] => {
    const arabicStopWords = ['في', 'من', 'إلى', 'على', 'عن', 'مع', 'هو', 'هي', 'التي', 'الذي', 'ما', 'كيف', 'متى', 'أين', 'لماذا'];
    const words = text.split(/\s+/).filter(word => 
      word.length > 2 && !arabicStopWords.includes(word)
    );
    return words;
  };

  // قاعدة المعرفة الكيميائية
  const getChemistryKnowledge = (question: string): string | null => {
    const questionLower = question.toLowerCase();
    
    const knowledgeBase: { [key: string]: string } = {
      'حديد': 'الحديد (Fe) عنصر انتقالي له حالتا تأكسد رئيسيتان +2 و+3. أيونات الحديد II تظهر بلون أخضر، بينما أيونات الحديد III تظهر بلون أصفر. يستخدم الحديد في صناعة الفولاذ والبناء.',
      'نحاس': 'النحاس (Cu) فلز انتقالي غير فعال كيميائياً وقابل للطرق والسحب. أيونات النحاس II (Cu²⁺) زرقاء اللون. يستخدم في صناعة الأسلاك الكهربائية والمواسير.',
      'أكسجين': 'الأكسجين (O₂) غاز ضروري للتنفس والاحتراق. يكون أكاسيد مع معظم العناصر وله حالة أكسدة -2 في أغلب المركبات.',
      'كربون': 'الكربون (C) أساس الكيمياء العضوية. يكون أربع روابط تساهمية ويدخل في تركيب جميع المركبات العضوية مع الهيدروجين.',
      'الجدول الدوري': 'الجدول الدوري ينظم العناصر حسب العدد الذري. العناصر في نفس المجموعة لها خصائص متشابهة والعناصر في نفس الدورة لها نفس عدد مستويات الطاقة.',
      'التفاعل الكيميائي': 'التفاعل الكيميائي هو عملية تكسير وتكوين روابط كيميائية لتكوين مواد جديدة. يجب أن تكون المعادلة موزونة وفقاً لقانون حفظ الكتلة.',
    };

    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (questionLower.includes(key)) {
        return value;
      }
    }

    return null;
  };

  // توليد استجابة بناءً على السياق
  const generateContextualResponse = (question: string, context: { content: string; filename: string }): string => {
    return `بناءً على محتوى الfile "${context.filename}":\n\n${context.content}\n\nهل تحتاج لمزيد من التوضيح حول هذا الموضوع؟`;
  };

  // توليد استجابة عامة
  const generateGeneralResponse = (question: string): string => {
    const responses = [
      'هذا سؤال مثير للاهتمام! للأسف لا أجد معلومات كافية في قاعدة البيانات الحالية. هل يمكنك رفع fileات تحتوي على المعلومات المطلوبة؟',
      'أعتذر، لا أستطيع العثور على إجابة دقيقة لهذا السؤال حالياً. يمكنك تجربة رفع fileات إضافية أو إعادة صياغة السؤال.',
      'سؤال رائع! لتحسين إجاباتي، يمكنك رفع fileات دراسية تحتوي على الموضوع الذي تسأل عنه. هذا سيساعدني في تقديم إجابات أكثر دقة.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // تدريب البوت على file جديد
  const trainOnNewFiles = async () => {
    setIsTraining(true);
    try {
      await loadTrainedFiles();
      toast.success('تم تحديث المعرفة بنجاح! البوت جاهز للإجابة على أسئلة جديدة.');
    } catch (error) {
      toast.error('فشل في تحديث المعرفة');
    } finally {
      setIsTraining(false);
    }
  };

  // الأسئلة السريعة
  const quickQuestions = [
    'ما هو الحديد وما خصائصه؟',
    'كيف أفرق بين الأحماض والقواعد؟',
    'ما هي العناصر الانتقالية؟',
    'اشرح لي التفاعلات الكيميائية',
    'ما هو الجدول الدوري؟'
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  if (isFloating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className={`fixed bottom-4 right-4 z-50 w-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 ${
          isMinimized ? 'h-14' : 'h-[600px]'
        }`}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium text-sm">Smart Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </div>

        {!isMinimized && (
          <div className="flex flex-col h-[calc(100%-56px)]">
            <div className="flex-1 p-3">
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}>
                        <div>{message.content}</div>
                        {message.fileContext && (
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              {message.fileContext}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin">
                            <RefreshCw className="h-4 w-4" />
                          </div>
                          <span className="text-sm">جاري التفكير...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكType your question here..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="text-sm"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !input.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* حالة التدريب */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            حالة التدريب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Bot trained on {trainedFiles.length} file
              </p>
              <div className="flex flex-wrap gap-2">
                {trainedFiles.slice(0, 3).map((file) => (
                  <Badge key={file.id} variant="secondary" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    {file.filename}
                  </Badge>
                ))}
                {trainedFiles.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{trainedFiles.length - 3} file آخر
                  </Badge>
                )}
              </div>
            </div>
            <Button 
              onClick={trainOnNewFiles} 
              disabled={isTraining}
              variant="outline"
            >
              {isTraining ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              تحديث المعرفة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* المحادثة */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            المحادثة
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 mb-4" ref={chatContainer}>
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.fileContext && (
                      <div className="mt-3">
                        <Badge variant="secondary">
                          <FileText className="w-4 h-4 mr-1" />
                          مصدر: {message.fileContext}
                        </Badge>
                      </div>
                    )}
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString('ar-SA')}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin">
                        <RefreshCw className="h-5 w-5" />
                      </div>
                      <span>جاري التفكير في إجابة...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* الأسئلة السريعة */}
          {messages.length === 1 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-3">أسئلة سريعة:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* إدخال الرسالة */}
          <div className="flex gap-3">
            <Input
              value={input}
              on
          {/* Embedded ChatGPT iframe (looks native) */}
          <div className="w-full my-4">
            <ChatGPTEmbed height={480} />
          </div>
Change={(e) => setInput(e.target.value)}
              placeholder="اكType your question here..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}