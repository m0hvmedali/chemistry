import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Bot, Send, Settings, Database, Sparkles } from 'lucide-react';

interface KBEntry { id: string; title: string; tags?: string[]; content: string; }

export default function ChatbotHF() {
  const [kb, setKb] = useState<KBEntry[]>([]);
  const [model, setModel] = useState<string>('HuggingFaceH4/zephyr-7b-beta');
  const [token, setToken] = useState<string>(() => localStorage.getItem('hf:token') || '');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user'|'assistant'; text: string; sources?: KBEntry[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/kb/knowledge.json');
        if (!res.ok) throw new Error('KB load failed');
        const data = await res.json();
        setKb(data.entries || []);
      } catch {
        setKb([]);
      }
    })();
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const searchKB = (q: string): KBEntry[] => {
    if (!q.trim() || !kb.length) return [];
    const terms = q.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    const score = (e: KBEntry) => {
      const text = `${e.title} ${e.tags?.join(' ')||''} ${e.content}`.toLowerCase();
      let s = 0;
      terms.forEach(t => { if (text.includes(t)) s += 1; });
      return s + (e.tags?.some(t=>terms.includes(t.toLowerCase())) ? 2 : 0);
    };
    return [...kb].map(e => ({ e, s: score(e) })).filter(x => x.s>0).sort((a,b)=>b.s-a.s).slice(0,3).map(x=>x.e);
  };

  const buildPrompt = (q: string, hits: KBEntry[]) => {
    const context = hits.map((h, i) => `[#${i+1}] ${h.title}\n${h.content}`).join('\n\n');
    return (
`أنت مساعد كيمياء عربي محترف. أجب بدقة وبأسلوب مبسط ومنظّم.
- إن وُجد سياق معرفي أدناه فاستعمله أولاً.
- نظّم الإجابة بعناوين ونقاط وجداول عند الحاجة.
- اختم بخلاصة قصيرة ونصائح عملية.

السؤال: ${q}

سياق معرفي (قد يكون جزئياً):
${context || '— لا يوجد سياق —'}
`
    );
  };

  const callHF = async (prompt: string): Promise<string | null> => {
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 350, temperature: 0.6, return_full_text: false } })
      });
      if (!res.ok) return null;
      const data = await res.json();
      // data can be array of {generated_text}
      if (Array.isArray(data) && data[0]?.generated_text) return data[0].generated_text as string;
      // or a text field
      if (typeof data === 'object' && data.generated_text) return data.generated_text as string;
      return null;
    } catch {
      return null;
    }
  };

  const localAnswer = (q: string, hits: KBEntry[]) => {
    if (!hits.length) return 'لم أعثر على معلومة مباشرة في قاعدة المعرفة. وضّح سؤالك أو جرّب مصطلحات أخرى.';
    const blocks = hits.map((h,i)=>`- من (${h.title}): ${h.content.split('\n').slice(0,2).join(' ')}`);
    return `حسب قاعدة المعرفة:\n${blocks.join('\n')}\n\nخلاصة: ${q} — تم تلخيص المعلومات المتاحة أعلاه.`;
  };

  const ask = async () => {
    const q = query.trim();
    if (!q) return;
    setQuery('');
    const hits = searchKB(q);
    setMessages(prev => [...prev, { role: 'user', text: q }, { role: 'assistant', text: '... جاري توليد الإجابة ...', sources: hits }]);
    setLoading(true);
    const prompt = buildPrompt(q, hits);
    let answer = await callHF(prompt);
    if (!answer) answer = localAnswer(q, hits);
    setLoading(false);
    setMessages(prev => {
      const m = [...prev];
      m[m.length-1] = { role: 'assistant', text: answer || 'تعذر التوليد الآن.', sources: hits };
      return m;
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">المساعد الذكي (Hugging Face)</h2>
        <p className="text-sm text-muted-foreground">ابحث أولاً في قاعدة المعرفة، ثم حسِّن الإجابة عبر نموذج مجاني. أدخل مفتاح HF اختياريًا لتحسين الاستقرار.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2"><Bot className="w-5 h-5"/>المحادثة</CardTitle>
          <div className="flex items-center gap-2">
            <Input value={model} onChange={(e)=>setModel(e.target.value)} className="w-[260px]" placeholder="اسم النموذج" />
            <div className="flex items-center gap-2">
              <Input type="password" value={token} onChange={(e)=>{setToken(e.target.value); localStorage.setItem('hf:token', e.target.value);}} className="w-[220px]" placeholder="HF API Token (اختياري)" />
              <Button variant="outline" onClick={()=>toast.info('احصل على مفتاح مجاني من Hugging Face واحفظه محليًا هنا.') }><Settings className="w-4 h-4"/></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-3 border rounded-lg h-[60vh] overflow-y-auto bg-white dark:bg-gray-900">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">ابدأ بالسؤال عن درس، عنصر، أو تفاعل كيميائي.</div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`mb-4 ${m.role==='user'?'text-right':''}`}>
                  <div className={`inline-block px-3 py-2 rounded-lg ${m.role==='user'?'bg-blue-600 text-white':'bg-gray-100 dark:bg-gray-800'}`}>
                    <div className="whitespace-pre-wrap text-sm leading-7">{m.text}</div>
                  </div>
                  {m.role==='assistant' && m.sources && m.sources.length>0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.sources.map((s, si)=>(
                        <Badge key={si} variant="secondary"><Database className="w-3 h-3 mr-1"/>{s.title}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="space-y-3">
              <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-sm font-semibold mb-2">السؤال</div>
                <Textarea value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="اكتب سؤالك هنا..." className="min-h-[120px]" />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-muted-foreground">يتم البحث في قاعدة المعرفة محليًا</div>
                  <Button onClick={ask} disabled={loading || !query.trim()} className="gap-2"><Send className="w-4 h-4"/>{loading?'...':'إرسال'}</Button>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-sm font-semibold mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4"/>نصائح</div>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>اذكر العنصر أو الدرس بوضوح.</li>
                  <li>لتحسين الإجابة، أدخل HF Token (اختياري).</li>
                  <li>يمكنك تغيير اسم النموذج إذا رغبت.</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
