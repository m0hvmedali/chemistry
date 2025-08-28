import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Bot, X, MessageCircle } from 'lucide-react';
import ChemistryChatbot from './ChemistryChatbot';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full w-16 h-16 bg-blue-600 hover:bg-blue-700 shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Bot className="w-8 h-8 text-white" />
          </Button>
        )}
      </div>

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] max-w-[90vw] max-h-[80vh]">
          <Card className="w-full h-full shadow-2xl border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-bold">المساعد الذكي</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Chatbot Content */}
            <div className="h-full overflow-hidden">
              <ChemistryChatbot />
            </div>
          </Card>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}