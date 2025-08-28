import React from 'react';
import ChemistryChatbot from '@/components/ChemistryChatbot';
import FloatingChatbot from '@/components/FloatingChatbot';

export default function ChatbotTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4">
        <h1 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
          اختبار المساعد الذكي للكيمياء
        </h1>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold mb-4">الشات بوت المدمج</h2>
            <p className="text-gray-600 dark:text-gray-300">
              يمكنك التفاعل مع الشات بوت أدناه أو استخدام الزر العائم في الأسفل
            </p>
          </div>
          
          {/* Embedded Chatbot */}
          <ChemistryChatbot />
        </div>
      </div>
      
      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
}