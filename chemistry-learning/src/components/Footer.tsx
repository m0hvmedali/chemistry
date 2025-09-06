import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Star, 
  Send, 
  Heart,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  Shield,
  FileText,
  MessageSquare,
  Award,
  Globe
} from 'lucide-react';

export default function Footer() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleRating = (value: number) => {
    setRating(value);
  };

  const submitRating = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      const ratingData = {
        rating,
        feedback,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      localStorage.setItem(`rating_${Date.now()}`, JSON.stringify(ratingData));
      toast.success('Thank you for your feedback! شكراً لتقييمك!');
      setRating(0);
      setFeedback('');
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const contactData = {
        ...contactForm,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(`contact_${Date.now()}`, JSON.stringify(contactData));
      toast.success('Message sent successfully! We will get back to you soon.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chemistry Lab Platform
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              منصة تعلم الكيمياء الذكية التي تجمع بين التكنولوجيا المتقدمة والمحتوى التعليمي الغني لتوفير تجربة تعلم استثنائية.
            </p>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Supporting Arabic & English
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Features & Tools
                </a>
              </li>
              <li>
                <a href="#periodic-table" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Interactive Periodic Table
                </a>
              </li>
              <li>
                <a href="#study-materials" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Study Materials
                </a>
              </li>
              <li>
                <a href="#ai-assistant" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  AI Assistant
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Connect With Me
            </h3>
            <div className="space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact Mohamed Aly</DialogTitle>
                    <DialogDescription>
                      Get in touch for questions, suggestions, or collaboration opportunities.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/m0hvmedali" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://twitter.com/m0hvmedali" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://linkedin.com/in/m0hvmedali" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Rating & Feedback */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Rate This Platform
            </h3>
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRating(star)}
                      className={`p-1 rounded ${
                        star <= rating
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star 
                        className="h-6 w-6" 
                        fill={star <= rating ? 'currentColor' : 'none'}
                      />
                    </motion.button>
                  ))}
                </div>
                
                <Textarea
                  placeholder="Optional feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={2}
                  className="text-sm"
                />
                
                <Button 
                  onClick={submitRating} 
                  size="sm" 
                  className="w-full"
                  disabled={rating === 0}
                >
                  <Send className="mr-2 h-3 w-3" />
                  Submit Rating
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Legal & Policies */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
              <Dialog>
                <DialogTrigger className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Shield className="inline mr-1 h-3 w-3" />
                  Privacy Policy
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Privacy Policy</DialogTitle>
                    <DialogDescription>
                      Last updated: {new Date().toLocaleDateString()}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm">
                    <section>
                      <h4 className="font-semibold">Data Collection</h4>
                      <p>This platform stores data locally on your device using browser localStorage. No personal data is sent to external servers without your explicit consent.</p>
                    </section>
                    <section>
                      <h4 className="font-semibold">Usage Data</h4>
                      <p>We may collect anonymous usage statistics to improve the platform. This data cannot be used to identify individual users.</p>
                    </section>
                    <section>
                      <h4 className="font-semibold">Third-Party Services</h4>
                      <p>The platform may integrate with educational APIs and services. Each service has its own privacy policy.</p>
                    </section>
                    <section>
                      <h4 className="font-semibold">Data Control</h4>
                      <p>You can export or delete your data at any time through the Settings page.</p>
                    </section>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <FileText className="inline mr-1 h-3 w-3" />
                  Terms of Service
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Terms of Service</DialogTitle>
                    <DialogDescription>
                      Agreement for using Chemistry Lab Platform
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm">
                    <section>
                      <h4 className="font-semibold">Acceptable Use</h4>
                      <p>This platform is designed for educational purposes. Users must not misuse the system or upload inappropriate content.</p>
                    </section>
                    <section>
                      <h4 className="font-semibold">Educational Content</h4>
                      <p>All educational content is provided for learning purposes. While we strive for accuracy, users should verify important information with authoritative sources.</p>
                    </section>
                    <section>
                      <h4 className="font-semibold">User-Generated Content</h4>
                      <p>Users are responsible for the content they upload. Do not share copyrighted material without permission.</p>
                    </section>
                    <section>
                      <h4 className="font-semibold">Platform Availability</h4>
                      <p>We strive to maintain platform availability but cannot guarantee 100% uptime. The service is provided "as is".</p>
                    </section>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Award className="inline mr-1 h-3 w-3" />
                  Academic Integrity
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Academic Integrity Guidelines</DialogTitle>
                    <DialogDescription>
                      Promoting honest learning and academic excellence
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm">
                    <section>
                      <h4 className="font-semibold">Learning Support</h4>
                      <p>This platform is designed to support your learning journey, not to provide shortcuts or completed assignments.</p>
                    </section>
                    <section>
                      <h4 className="font-semibold">AI Assistant Guidelines</h4>
                      <p>The AI assistant provides explanations and guidance. Use it to understand concepts, not to complete assignments for you.</p>
                    </section>
                    <section>
                      <h4 className="font-semibold">Collaboration</h4>
                      <p>Share knowledge and help others learn, but ensure that your academic work represents your own understanding and effort.</p>
                    </section>
                    <section>
                      <h4 className="font-semibold">Responsibility</h4>
                      <p>Users are responsible for using the platform ethically and in accordance with their institution's academic policies.</p>
                    </section>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2 mb-2">
                <span>Developed with</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>by</span>
                <a 
                  href="https://github.com/m0hvmedali" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Mohamed Aly
                </a>
              </div>
              <div className="text-center">
                © {currentYear} Chemistry Lab Platform. All rights reserved.
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-3 w-3" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Award className="h-3 w-3" />
              <span>Educational Excellence</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Globe className="h-3 w-3" />
              <span>Free & Open Access</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}