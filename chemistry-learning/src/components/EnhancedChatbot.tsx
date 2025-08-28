import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedChemistryChatbot, ChatMessage, TrainingFile } from '@/lib/enhancedChatbot';
import { Send, Bot, User, Upload, FileText, Trash2, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EnhancedChatbot() {
  const [chatbot] = useState(() => new EnhancedChemistryChatbot());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً! أنا المساعد الذكي المطور للكيمياء. يمكنني مساعدتك في فهم المفاهيم الكيميائية والإجابة على أسئلتك. كما يمكنك رفع ملفات PDF أو Word لأتدرب عليها وأجيب على الأسئلة بناءً على محتواها. ما الذي تريد تعلمه اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [trainingFiles, setTrainingFiles] = useState<TrainingFile[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Quick question suggestions
  const quickQuestions = [
    'ما هو الجدول الدوري؟',
    'شرح الروابط الكيميائية',
    'أنواع التفاعلات الكيميائية',
    'ما الفرق بين الحمض والقاعدة؟',
    'كيف تتكون الأيونات؟'
  ];

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    try {
      const response = await chatbot.sendMessage(userMessage.content);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setCurrentMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    
    try {
      toast.promise(
        chatbot.trainOnFiles(fileArray),
        {
          loading: 'يتم رفع وتحليل الملفات...',
          success: `تم رفع ${fileArray.length} ملف بنجاح`,
          error: 'حدث خطأ أثناء رفع الملفات'
        }
      );

      // Update training files list
      const updatedFiles = chatbot.getTrainingFiles();
      setTrainingFiles(updatedFiles);

      // Add system message
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `تم رفع وتحليل ${fileArray.length} ملف. يمكنك الآن سؤالي عن محتوى هذه الملفات.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, systemMessage]);
      
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('حدث خطأ أثناء رفع الملفات');
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'تم مسح المحادثة. كيف يمكنني مساعدتك؟',
        timestamp: new Date()
      }
    ]);
    chatbot.clearHistory();
    toast.success('تم مسح سجل المحادثة');
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            المساعد الذكي المطور
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              رفع ملفات
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Training Files Display */}
        {trainingFiles.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {trainingFiles.map((file, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                <FileText className="w-3 h-3" />
                {file.name}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600">يكتب الآن...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-600">أسئلة سريعة:</h4>
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

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isTyping || !currentMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Tips */}
        <div className="text-xs text-gray-500 text-center">
          💡 نصيحة: يمكنك رفع ملفات PDF أو Word لأتدرب عليها وأجيب على أسئلتك بناءً على محتواها
        </div>
      </CardContent>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </Card>
  );
}