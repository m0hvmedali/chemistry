import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Bot, Send, Settings, Database, Shield } from 'lucide-react';

interface KBEntry { id: string; title: string; tags?: string[]; content: string; }

export default function ChatbotOR() {
  const [kb, setKb] = useState<KBEntry[]>([]);
  const [query, setQuery] = useState('');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('or:apiKey') || '');
  const [model, setModel] = useState<string>('openai/gpt-oss-120b:free');
  const [messages, setMessages] = useState<{ role: 'user'|'assistant'; text: string; sources?: KBEntry[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const files = ['/kb/deepseek.json', '/kb/knowledge.json'];
        const agg: KBEntry[] = [];
        for (const f of files) {
          try {
            const res = await fetch(f);
            if (res.ok) {
              const data = await res.json();
              // Try common shapes
              if (Array.isArray(data)) {
                data.forEach((d: any, i: number) => agg.push({ id: d.id || `${f}-${i}`, title: d.title || 'معلومة', tags: d.tags || [], content: JSON.stringify(d) }));
              } else if (data.entries && Array.isArray(data.entries)) {
                data.entries.forEach((d: any, i: number) => agg.push({ id: d.id || `${f}-e-${i}`, title: d.title || 'معلومة', tags: d.tags || [], content: d.content ? String(d.content) : JSON.stringify(d)}));
              } else if (data.foundational_chemistry_guide) {
                const g = data.foundational_chemistry_guide;
                const title = g.title || 'دليل الكيمياء';
                const flatten = (obj: any, path: string[] = []) => {
                  if (!obj) return;
                  if (typeof obj === 'string') {
                    agg.push({ id: path.join('>'), title, content: obj });
                  } else if (Array.isArray(obj)) {
                    obj.forEach((item, idx) => flatten(item, [...path, String(idx)]));
                  } else if (typeof obj === 'object') {
                    if (obj.details || obj.topic) {
                      agg.push({ id: (obj.topic||'موضوع') + ':' + (obj.details||''), title: obj.topic || 'موضوع', content: obj.details || '' });
                    }
                    Object.keys(obj).forEach(k => {
                      if (k !== 'details' && k !== 'topic') flatten(obj[k], [...path, k]);
                    });
                  }
                };
                flatten(g);
              }
            }
          } catch {}
        }
        setKb(agg);
      } catch {}
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
    return [...kb].map(e => ({ e, s: score(e) })).filter(x => x.s>0).sort((a,b)=>b.s-a.s).slice(0,4).map(x=>x.e);
  };

  const buildPrompt = (q: string, hits: KBEntry[]) => {
    const context = hits.map((h, i) => `[#${i+1}] ${h.title}\n${h.content}`).join('\n\n');
    return (
`أنت مساعد يشبه أسلوب واتساب، أنيق ومهني، يجيب بالعربية الفصحى المبسطة.
- استعمل السياق أدناه أولاً وثبّت الحقائق.
- اجعل الإجابة منظمة: عناوين قصيرة، نقاط، أمثلة، وخلاصة.
- إن لم يوجد سياق كافٍ، اطلب توضيحاً.

السؤال: ${q}

سياق معرفي:
${context || '— لا سياق —'}
`
    );
  };

  const callOpenRouter = async (prompt: string): Promise<string | null> => {
    try {
      if (!apiKey) return null; // لا نُضمّن المفاتيح في الكود
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'كن خبير كيمياء عربي ودود، ملتزم بالدقة.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.6,
          max_tokens: 600
        })
      });
      if (!res.ok) return null;
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      return typeof content === 'string' ? content : null;
    } catch {
      return null;
    }
  };

  const localAnswer = (q: string, hits: KBEntry[]) => {
    if (!hits.length) return 'لم أعثر على سياق مناسب في قاعدة المعرفة. فضلاً، وضّح سؤالك أكثر.';
    const bullets = hits.map(h=>`• ${h.title}: ${h.content.split('\n').slice(0,2).join(' ')}`).join('\n');
    return `ملخص سريع من قاعدة المعرفة:\n${bullets}\n\nخلاصة: ${q}`;
  };

  const ask = async () => {
    const q = query.trim();
    if (!q) return;
    setQuery('');
    const hits = searchKB(q);
    setMessages(prev => [...prev, { role: 'user', text: q }, { role: 'assistant', text: '... جاري توليد الإجابة ...', sources: hits }]);
    const prompt = buildPrompt(q, hits);
    const answer = await callOpenRouter(prompt);
    setMessages(prev => {
      const m = [...prev];
      m[m.length-1] = { role: 'assistant', text: answer || localAnswer(q, hits), sources: hits };
      return m;
    });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-xl border overflow-hidden shadow-lg bg-white dark:bg-gray-900">
          <div className="bg-green-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <div className="font-bold">المساعد الذكي</div>
                <div className="text-xs opacity-90">متصل الآن</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input value={model} onChange={(e)=>setModel(e.target.value)} className="h-8 w-[160px] text-xs text-black" />
              <Input type="password" value={apiKey} onChange={(e)=>{ setApiKey(e.target.value); localStorage.setItem('or:apiKey', e.target.value); }} placeholder="OpenRouter API Key" className="h-8 w-[180px] text-xs text-black" />
            </div>
          </div>

          <div className="p-2 h-[70vh] overflow-y-auto bg-[url('https://i.imgur.com/dP8PZ0Z.png')] bg-opacity-10 dark:bg-opacity-10">
            {messages.map((m, i) => (
              <div key={i} className={`mb-2 flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-7 shadow ${m.role==='user'?'bg-green-500 text-white rounded-br-none':'bg-gray-100 dark:bg-gray-800 text-foreground rounded-bl-none'}`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  {m.role==='assistant' && m.sources && m.sources.length>0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {m.sources.map((s, si)=>(
                        <Badge key={si} variant="secondary" className="text-[10px]"><Database className="w-3 h-3 mr-1"/>{s.title}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-2 bg-gray-50 dark:bg-gray-800 border-t">
            <div className="flex items-center gap-2">
              <Textarea value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="اكتب رسالتك..." className="min-h-[44px] max-h-28 text-sm"/>
              <Button onClick={ask} disabled={!query.trim()} className="bg-green-600 hover:bg-green-700"><Send className="w-4 h-4"/></Button>
            </div>
            {!apiKey && (
              <div className="text-[11px] text-yellow-700 bg-yellow-100 border border-yellow-300 rounded p-1 mt-2 flex items-center gap-1">
                <Shield className="w-3 h-3"/> أدخل OpenRouter API Key (يُحفظ محليًا) لتفعيل الإجابات الذكية. بدون مفتاح ستعتمد الإجابات على قاعدة المعرفة فقط.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
