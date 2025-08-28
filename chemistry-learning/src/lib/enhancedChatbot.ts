// Enhanced Chemistry Chatbot with File Training Support

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TrainingFile {
  name: string;
  content: string;
  type: 'pdf' | 'docx' | 'txt';
  uploadDate: Date;
}

export class EnhancedChemistryChatbot {
  private knowledgeBase: Map<string, string[]>;
  private trainingFiles: TrainingFile[];
  private conversationHistory: ChatMessage[];

  constructor() {
    this.knowledgeBase = new Map();
    this.trainingFiles = [];
    this.conversationHistory = [];
    this.initializeKnowledge();
  }

  private initializeKnowledge() {
    // Base chemistry knowledge
    this.knowledgeBase.set('ذرة', [
      'الذرة هي أصغر وحدة في المادة تحتفظ بخصائص العنصر',
      'تتكون الذرة من النواة (البروتونات والنيوترونات) والإلكترونات التي تدور حولها',
      'العدد الذري يساوي عدد البروتونات في النواة ويحدد نوع العنصر'
    ]);

    this.knowledgeBase.set('جدول دوري', [
      'الجدول الدوري ينظم جميع العناصر الكيميائية حسب العدد الذري والخصائص',
      'المجموعات (الأعمدة) تحتوي على عناصر لها نفس عدد الإلكترونات الخارجية',
      'الدورات (الصفوف) تمثل مستويات الطاقة الإلكترونية'
    ]);

    this.knowledgeBase.set('تفاعل كيميائي', [
      'التفاعل الكيميائي هو عملية تكسر وتكوين روابط بين الذرات',
      'قانون حفظ الكتلة ينص على أن الكتلة لا تفنى ولا تستحدث في التفاعلات',
      'التفاعلات تنقسم إلى: تكوين، تفكك، إحلال مفرد، إحلال مزدوج'
    ]);

    this.knowledgeBase.set('حمض', [
      'الحمض هو مادة تتبرع بالبروتونات (H+) في المحلول المائي',
      'الأحماض القوية تتأين بالكامل في الماء مثل HCl و H₂SO₄',
      'مقياس pH يقيس حموضة المحلول من 0 (حمضي جداً) إلى 14 (قاعدي جداً)'
    ]);

    this.knowledgeBase.set('قاعدة', [
      'القاعدة هي مادة تستقبل البروتونات أو تتبرع بالهيدروكسيد (OH-)',
      'القواعد القوية مثل NaOH و Ca(OH)₂ تتأين بالكامل في الماء',
      'التفاعل بين حمض وقاعدة ينتج ملح وماء (تفاعل التعادل)'
    ]);

    this.knowledgeBase.set('رابطة كيميائية', [
      'الرابطة التساهمية: تشارك الإلكترونات بين اللافلزات',
      'الرابطة الأيونية: انتقال إلكترونات من فلز إلى لافلز',
      'الرابطة المعدنية: بحر من الإلكترونات المتحركة في الفلزات'
    ]);

    // Add more chemistry topics
    this.knowledgeBase.set('كيمياء عضوية', [
      'الكيمياء العضوية تدرس مركبات الكربون وروابطها',
      'الهيدروكربونات هي أبسط المركبات العضوية (كربون وهيدروجين فقط)',
      'المجموعات الوظيفية تحدد خصائص المركبات العضوية'
    ]);

    this.knowledgeBase.set('كتلة ذرية', [
      'الكتلة الذرية هي متوسط كتل نظائر العنصر الموزونة',
      'وحدة الكتلة الذرية (amu) تساوي 1/12 من كتلة ذرة الكربون-12',
      'الكتلة الذرية مهمة في حسابات الكيمياء الكمية'
    ]);
  }

  // Train the chatbot with uploaded files
  async trainOnFiles(files: File[]): Promise<void> {
    for (const file of files) {
      try {
        const content = await this.extractTextFromFile(file);
        const trainingFile: TrainingFile = {
          name: file.name,
          content,
          type: this.getFileType(file.name),
          uploadDate: new Date()
        };
        
        this.trainingFiles.push(trainingFile);
        this.processTrainingContent(content);
        
        console.log(`تم تدريب البوت على الملف: ${file.name}`);
      } catch (error) {
        console.error(`خطأ في معالجة الملف ${file.name}:`, error);
      }
    }
  }

  private async extractTextFromFile(file: File): Promise<string> {
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      return await file.text();
    }
    
    // For now, return file content as text
    // In production, you'd use libraries like pdf-parse for PDFs
    return await file.text();
  }

  private getFileType(fileName: string): 'pdf' | 'docx' | 'txt' {
    if (fileName.endsWith('.pdf')) return 'pdf';
    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return 'docx';
    return 'txt';
  }

  private processTrainingContent(content: string): void {
    // Extract key chemistry concepts from the content
    const lines = content.split('\\n');
    let currentTopic = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.includes(':') && line.length < 50) {
        // New topic detected
        if (currentTopic && currentContent.length > 0) {
          this.addToKnowledge(currentTopic, currentContent);
        }
        currentTopic = line.replace(':', '').trim();
        currentContent = [];
      } else if (line.trim()) {
        currentContent.push(line.trim());
      }
    }

    // Add the last topic
    if (currentTopic && currentContent.length > 0) {
      this.addToKnowledge(currentTopic, currentContent);
    }
  }

  private addToKnowledge(topic: string, content: string[]): void {
    const existing = this.knowledgeBase.get(topic) || [];
    this.knowledgeBase.set(topic, [...existing, ...content]);
  }

  // Enhanced message processing with training data
  async sendMessage(message: string): Promise<string> {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    this.conversationHistory.push(userMessage);

    try {
      let response = await this.generateEnhancedResponse(message);
      
      // If no specific response found, search training files
      if (!response || response.includes('لا أعرف')) {
        const trainingResponse = this.searchTrainingFiles(message);
        if (trainingResponse) {
          response = trainingResponse;
        }
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      this.conversationHistory.push(assistantMessage);
      return response;

    } catch (error) {
      console.error('خطأ في الشات بوت:', error);
      return 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.';
    }
  }

  private searchTrainingFiles(query: string): string | null {
    const searchTerms = query.toLowerCase().split(' ');
    
    for (const file of this.trainingFiles) {
      const content = file.content.toLowerCase();
      
      // Check if any search term appears in the file
      const hasMatch = searchTerms.some(term => content.includes(term));
      
      if (hasMatch) {
        // Extract relevant paragraph
        const sentences = file.content.split('.');
        const relevantSentences = sentences.filter(sentence => 
          searchTerms.some(term => sentence.toLowerCase().includes(term))
        );
        
        if (relevantSentences.length > 0) {
          return `بناءً على الملف "${file.name}":\\n\\n${relevantSentences.slice(0, 3).join('. ')}.`;
        }
      }
    }
    
    return null;
  }

  private async generateEnhancedResponse(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    // Check for exact matches first
    for (const [key, responses] of this.knowledgeBase) {
      if (lowerMessage.includes(key.toLowerCase())) {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        return randomResponse;
      }
    }

    // Fallback responses based on context
    if (lowerMessage.includes('ما هو') || lowerMessage.includes('عرف')) {
      return this.getDefinitionResponse(lowerMessage);
    }
    
    if (lowerMessage.includes('كيف') || lowerMessage.includes('طريقة')) {
      return this.getHowToResponse(lowerMessage);
    }

    if (lowerMessage.includes('مثال') || lowerMessage.includes('أمثلة')) {
      return this.getExampleResponse(lowerMessage);
    }

    // Chemistry-specific responses
    if (lowerMessage.includes('تفاعل') || lowerMessage.includes('معادلة')) {
      return 'التفاعلات الكيميائية تتبع قانون حفظ الكتلة. هل تريد معلومات عن نوع معين من التفاعلات؟';
    }

    if (lowerMessage.includes('عنصر') && (lowerMessage.includes('أي') || lowerMessage.includes('ما'))) {
      return 'يمكنني مساعدتك في معرفة معلومات عن أي عنصر كيميائي. اذكر اسم العنصر أو رمزه.';
    }

    // Default response
    return 'أعتذر، لم أفهم سؤالك تماماً. يمكنك سؤالي عن العناصر الكيميائية، التفاعلات، الجدول الدوري، أو أي موضوع في الكيمياء.';
  }

  private getDefinitionResponse(message: string): string {
    const definitions = [
      'يمكنني تعريف المصطلحات الكيميائية. حدد المصطلح الذي تريد تعريفه.',
      'أعطني اسم المفهوم الكيميائي وسأوضحه لك بالتفصيل.',
      'سأساعدك في فهم أي مفهوم في الكيمياء. ما هو المصطلح المحدد؟'
    ];
    return definitions[Math.floor(Math.random() * definitions.length)];
  }

  private getHowToResponse(message: string): string {
    const howToResponses = [
      'يمكنني شرح خطوات العمليات الكيميائية. ما العملية التي تريد معرفة كيفية تنفيذها؟',
      'سأوضح لك الطرق والخطوات. حدد ما تريد تعلم كيفية عمله في الكيمياء.',
      'أعطني تفاصيل أكثر عن العملية التي تريد معرفة خطواتها.'
    ];
    return howToResponses[Math.floor(Math.random() * howToResponses.length)];
  }

  private getExampleResponse(message: string): string {
    const exampleResponses = [
      'يمكنني إعطاء أمثلة على المفاهيم الكيميائية. عن أي موضوع تريد أمثلة؟',
      'سأقدم لك أمثلة واضحة. حدد الموضوع الذي تريد أمثلة عنه.',
      'الأمثلة تساعد في الفهم. ما الموضوع الكيميائي الذي تحتاج أمثلة عنه؟'
    ];
    return exampleResponses[Math.floor(Math.random() * exampleResponses.length)];
  }

  // Get conversation history
  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  // Get training files info
  getTrainingFiles(): TrainingFile[] {
    return this.trainingFiles;
  }

  // Clear conversation
  clearHistory(): void {
    this.conversationHistory = [];
  }

  // Get available topics
  getAvailableTopics(): string[] {
    return Array.from(this.knowledgeBase.keys());
  }

  // Add new knowledge manually
  addKnowledge(topic: string, information: string[]): void {
    const existing = this.knowledgeBase.get(topic) || [];
    this.knowledgeBase.set(topic, [...existing, ...information]);
  }
}