// Chatbot service using LlamaCloud
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class ChemistryChatbot {
  private apiKey: string;
  private indexName: string;
  private projectName: string;
  private organizationId: string;

  constructor() {
    this.apiKey = 'llx-TRERYAKe4BkHmOEjlVaqThcAi1HtyITDWuBQZDnSfctgYW7C';
    this.indexName = 'general-dragonfly-2025-08-28';
    this.projectName = 'Default';
    this.organizationId = '80af136a-180a-4b31-a9bb-d35160b2dd64';
  }

  async sendMessage(message: string, history: ChatMessage[] = []): Promise<string> {
    try {
      // For now, we'll create a simple chemistry-focused chatbot
      // In a real implementation, this would use LlamaCloud API
      
      const contextualResponse = await this.generateResponse(message, history);
      return contextualResponse;
    } catch (error) {
      console.error('Chatbot error:', error);
      return 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.';
    }
  }

  private async generateResponse(message: string, history: ChatMessage[]): Promise<string> {
    // Chemistry knowledge base responses
    const chemistryResponses: Record<string, string[]> = {
      'الجدول الدوري': [
        'الجدول الدوري هو ترتيب منظم لجميع العناصر الكيميائية حسب العدد الذري. يحتوي على 118 عنصر مقسمة إلى مجموعات ودورات.',
        'تم تطوير الجدول الدوري من قبل ديمتري مندليف في عام 1869. العناصر مرتبة في 7 دورات و 18 مجموعة.',
        'كل مجموعة في الجدول الدوري تحتوي على عناصر لها نفس عدد الإلكترونات في المدار الخارجي.'
      ],
      'العناصر': [
        'العناصر هي المواد الأساسية التي تتكون منها جميع المواد في الكون. كل عنصر له عدد ذري فريد.',
        'العناصر الأكثر شيوعاً في القشرة الأرضية هي الأكسجين، السيليكون، الألومنيوم، والحديد.',
        'العناصر تنقسم إلى فلزات، لافلزات، وأشباه فلزات حسب خصائصها الفيزيائية والكيميائية.'
      ],
      'الروابط الكيميائية': [
        'الروابط الكيميائية هي القوى التي تربط الذرات معاً. الأنواع الرئيسية هي الأيونية، التساهمية، والفلزية.',
        'الرابطة الأيونية تتكون بين فلز ولافلز، بينما التساهمية بين لافلزات.',
        'قوة الرابطة تحدد الخصائص الفيزيائية للمركب مثل نقطة الانصهار والذوبان.'
      ],
      'الأحماض والقواعد': [
        'الأحماض مواد تطلق أيونات الهيدروجين (H+) في المحلول، بينما القواعد تطلق أيونات الهيدروكسيد (OH-).',
        'مقياس الـ pH يحدد حمضية أو قاعدية المحلول من 0 إلى 14، حيث 7 متعادل.',
        'أمثلة على الأحماض: حمض الكلوريدريك، الكبريتيك، والخليك. أمثلة على القواعد: هيدروكسيد الصوديوم والأمونيا.'
      ],
      'التفاعلات الكيميائية': [
        'التفاعلات الكيميائية هي عمليات تغيير في تركيب المواد لإنتاج مواد جديدة.',
        'أنواع التفاعلات تشمل: الاتحاد، التفكك، الإحلال البسيط، والإحلال المزدوج.',
        'قانون حفظ الكتلة ينص على أن كتلة المتفاعلات تساوي كتلة النواتج في أي تفاعل كيميائي.'
      ]
    };

    // Simple pattern matching for Arabic chemistry terms
    const lowerMessage = message.toLowerCase();
    
    for (const [topic, responses] of Object.entries(chemistryResponses)) {
      if (lowerMessage.includes(topic.toLowerCase()) || 
          lowerMessage.includes(topic) ||
          this.containsRelatedTerms(lowerMessage, topic)) {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        return randomResponse;
      }
    }

    // Handle common question patterns
    if (lowerMessage.includes('ما هو') || lowerMessage.includes('ما هي')) {
      return 'يمكنني مساعدتك في فهم المفاهيم الكيميائية. اسأل عن الجدول الدوري، العناصر، الروابط الكيميائية، الأحماض والقواعد، أو التفاعلات الكيميائية.';
    }

    if (lowerMessage.includes('كيف') || lowerMessage.includes('لماذا')) {
      return 'هذا سؤال ممتاز! الكيمياء مليئة بالظواهر المثيرة. حدد الموضوع الذي تريد معرفة المزيد عنه وسأقدم لك شرحاً مفصلاً.';
    }

    if (lowerMessage.includes('مساعدة') || lowerMessage.includes('help')) {
      return 'مرحباً! أنا مساعد الكيمياء الذكي. يمكنني مساعدتك في:\n\n• شرح العناصر والجدول الدوري\n• توضيح الروابط الكيميائية\n• شرح الأحماض والقواعد\n• تفسير التفاعلات الكيميائية\n• الإجابة على أسئلة المنهج المصري\n\nما الذي تريد تعلمه اليوم؟';
    }

    // Default response
    return 'شكراً لسؤالك! يمكنني مساعدتك في مواضيع الكيمياء المختلفة. جرب أن تسأل عن الجدول الدوري، العناصر الكيميائية، الروابط، الأحماض والقواعد، أو أي موضوع كيميائي آخر.';
  }

  private containsRelatedTerms(message: string, topic: string): boolean {
    const relatedTerms: Record<string, string[]> = {
      'الجدول الدوري': ['دورة', 'مجموعة', 'عدد ذري', 'مندليف', 'عنصر'],
      'العناصر': ['ذرة', 'نواة', 'إلكترون', 'بروتون', 'نيوترون'],
      'الروابط الكيميائية': ['أيونية', 'تساهمية', 'فلزية', 'جزيء', 'مركب'],
      'الأحماض والقواعد': ['ph', 'حمضي', 'قاعدي', 'متعادل', 'هيدروجين'],
      'التفاعلات الكيميائية': ['تفاعل', 'متفاعل', 'ناتج', 'معادلة', 'توزان']
    };

    const terms = relatedTerms[topic] || [];
    return terms.some(term => message.includes(term));
  }
}

// Singleton instance
export const chemistryChatbot = new ChemistryChatbot();