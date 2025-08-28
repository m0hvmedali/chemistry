import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Bot, User, Send, Loader2, MessageCircle, BookOpen, Atom, FlaskConical } from 'lucide-react';
import { chemistryChatbot, ChatMessage } from '../lib/chatbot';
import { toast } from 'sonner';

export default function ChemistryChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً! أنا مساعد الكيمياء الذكي. يمكنني مساعدتك في فهم العناصر، الجدول الدوري، الروابط الكيميائية، والمزيد. ما الذي تريد تعلمه اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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
      const response = await chemistryChatbot.sendMessage(userMessage.content, messages);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('حدث خطأ في إرسال الرسالة');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    { text: 'ما هو الجدول الدوري؟', icon: <Atom className="w-4 h-4" /> },
    { text: 'شرح الروابط الكيميائية', icon: <BookOpen className="w-4 h-4" /> },
    { text: 'الأحماض والقواعد', icon: <FlaskConical className="w-4 h-4" /> },
    { text: 'كيف تحدث التفاعلات الكيميائية؟', icon: <MessageCircle className="w-4 h-4" /> }
  ];

  const handleQuickQuestion = (question: string) => {
    setCurrentMessage(question);
    inputRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
              <Bot className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">مساعد الكيمياء الذكي</h2>
              <p className="text-sm text-muted-foreground font-normal">
                مدعوم بتقنية الذكاء الاصطناعي المتقدمة
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              متصل
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-300">
                أسئلة سريعة:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question.text)}
                    className="justify-start text-right h-auto p-3 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {question.icon}
                      <span className="text-xs">{question.text}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <ScrollArea 
            className="flex-1 p-4" 
            ref={scrollAreaRef}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                      </div>
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap" dir="rtl">
                        {message.content}
                      </div>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 order-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600 dark:text-green-300" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-500">يكتب...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب سؤالك عن الكيمياء هنا..."
                className="flex-1 text-right"
                dir="rtl"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                size="icon"
                className="flex-shrink-0"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              اضغط Enter للإرسال • مدعوم بالذكاء الاصطناعي
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chemistry Facts Sidebar */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FlaskConical className="w-4 h-4" />
            نصائح للحصول على إجابات أفضل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">أسئلة يمكنني الإجابة عليها:</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>• شرح العناصر والجدول الدوري</li>
                <li>• الروابط الكيميائية وأنواعها</li>
                <li>• الأحماض والقواعد والأملاح</li>
                <li>• التفاعلات الكيميائية والمعادلات</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">نصائح للأسئلة:</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>• كن واضحاً ومحدداً في سؤالك</li>
                <li>• استخدم المصطلحات الكيميائية</li>
                <li>• اسأل سؤالاً واحداً في كل مرة</li>
                <li>• لا تتردد في طلب أمثلة</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}