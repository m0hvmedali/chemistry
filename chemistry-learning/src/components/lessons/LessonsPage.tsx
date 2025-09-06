import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ChartJSRenderer from './ChartJSRenderer';
import MermaidRenderer from './MermaidRenderer';

import { toast } from 'sonner';
import { Download, Headphones, Image as ImageIcon, PlayCircle, X, SkipBack, SkipForward, Play, Pause, FileText } from 'lucide-react';

// Types
interface LessonMeta {
  id: string;
  title: string;
  summary?: string;
  keywords?: string[];
  image_url?: string;
  audio_url?: string;
  audios?: Array<string | { src: string; title?: string }>;
  pdf_url?: string;
  pdfs?: Array<string | { src: string; title?: string }>;
  content_path: string;
  exam_path?: string;
  createdAt?: string;
}

interface LessonContent {
  meta: { title: string; description?: string; keywords?: string[]; lang?: string };
  tl_dr: { one_line: string; three_sentences: string; eli12: string };
  sections: Array<{
    heading: string;
    short_summary?: string;
    detailed?: string;
    bullets?: string[];
    quotes?: string[];
    terms?: Array<{ term: string; definition: string }>;
    tables?: Array<{ title?: string; columns: string[]; rows: Array<Array<string | number>> }>;
    visuals?: Array<
      | { type: 'chartjs'; title?: string; config: any }
      | { type: 'mermaid'; title?: string; code: string }
    >;
  }>;
  faq?: Array<{ q: string; a: string }>;
  deliverables?: {
    html_snippets?: string[];
    chartjs_snippets?: string[];
    mermaid_snippets?: string[];
  };
}

interface ExamQuestionMCQ { type: 'mcq'; q: string; options: string[]; answer_index: number; explanation?: string }
interface ExamQuestionTF { type: 'true_false'; q: string; answer: boolean; explanation?: string }
interface ExamSchema { title?: string; duration_minutes?: number; questions: Array<ExamQuestionMCQ | ExamQuestionTF> }

export default function LessonsPage() {
  const [lessons, setLessons] = useState<LessonMeta[]>([]);
  const [selected, setSelected] = useState<LessonMeta | null>(null);
  const [content, setContent] = useState<LessonContent | null>(null);
  const [exam, setExam] = useState<ExamSchema | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | boolean>>({});

  // Audio playlist state
  const audioList = useMemo(() => {
    const toItem = (it: any, idx: number) => typeof it === 'string' ? { src: it, title: `مقطع صوتي ${idx + 1}` } : { src: it?.src, title: it?.title || `مقطع صوتي ${idx + 1}` };
    if (selected?.audios && Array.isArray(selected.audios) && selected.audios.length > 0) {
      return selected.audios.map(toItem);
    }
    if (selected?.audio_url) return [{ src: selected.audio_url, title: 'ملخص صوتي' }];
    return [];
  }, [selected]);
  const [audioIndex, setAudioIndex] = useState(0);
  const [playAll, setPlayAll] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { setAudioIndex(0); }, [selected]);

  // PDF list state
  const pdfList = useMemo(() => {
    const toItem = (it: any, idx: number) => typeof it === 'string' ? { src: it, title: `ملف PDF ${idx + 1}` } : { src: it?.src, title: it?.title || `ملف PDF ${idx + 1}` };
    if (selected?.pdfs && Array.isArray(selected.pdfs) && selected.pdfs.length > 0) return selected.pdfs.map(toItem);
    if (selected?.pdf_url) return [{ src: selected.pdf_url, title: 'ملف PDF' }];
    return [];
  }, [selected]);
  const [pdfIndex, setPdfIndex] = useState(0);
  const [autoRotatePdf, setAutoRotatePdf] = useState(false);
  useEffect(() => { setPdfIndex(0); }, [selected]);
  useEffect(() => {
    if (!autoRotatePdf || pdfList.length <= 1) return;
    const id = setInterval(() => setPdfIndex((i) => (i + 1) % pdfList.length), 20000);
    return () => clearInterval(id);
  }, [autoRotatePdf, pdfList.length]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/lessons/index.json');
        const data = await res.json();
        setLessons(data.lessons || []);
      } catch (e) {
        toast.error('تعذر تحميل قائمة الدروس');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selected) return;
      try {
        const c = await fetch(selected.content_path).then(r => r.json());
        setContent(c);
        if (selected.exam_path) {
          const ex = await fetch(selected.exam_path).then(r => r.json());
          setExam(ex);
        } else {
          setExam(null);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        toast.error('تعذر تحميل محتوى الدرس');
      }
    })();
  }, [selected]);

  const score = useMemo(() => {
    if (!exam) return 0;
    let correct = 0;
    exam.questions.forEach((q, i) => {
      const a = answers[i];
      if (q.type === 'mcq' && typeof a === 'number' && a === q.answer_index) correct++;
      if (q.type === 'true_false' && typeof a === 'boolean' && a === q.answer) correct++;
    });
    return Math.round((correct / exam.questions.length) * 100);
  }, [answers, exam]);

  const resetExam = () => setAnswers({});

  if (!selected) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">قسم الدروس</h2>
          <p className="text-muted-foreground">اختر درسًا لعرض تفاصيله التفاعلية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((l) => (
            <Card key={l.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg">{l.title}</CardTitle>
                {l.summary && <CardDescription className="text-sm">{l.summary}</CardDescription>}
                <div className="flex flex-wrap gap-2">
                  {(l.keywords || []).slice(0, 4).map((k) => (
                    <Badge key={k} variant="secondary">{k}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {l.image_url && (
                  <img src={l.image_url} alt={l.title} className="w-full h-40 object-cover rounded-md border" />
                )}
                <Button className="w-full" onClick={() => setSelected(l)}>عرض التفاصيل</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">{content?.meta.title || selected.title}</h2>
          {content?.meta.description && (
            <p className="text-muted-foreground mt-1">{content.meta.description}</p>
          )}
        </div>
        <Button variant="outline" onClick={() => { setSelected(null); setContent(null); setExam(null); }}>
          <X className="w-4 h-4 mr-2" /> عودة إلى جميع الدروس
        </Button>
      </div>

      {(audioList.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Headphones className="w-5 h-5"/>قائمة الملفات الصوتية</CardTitle>
            <CardDescription>تشغيل تلقائي بالتتابع بعد الضغط على تشغيل</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setAudioIndex((i) => (i - 1 + audioList.length) % audioList.length)}><SkipBack className="w-4 h-4"/>السابق</Button>
              {playAll ? (
                <Button onClick={() => { setPlayAll(false); audioRef.current?.pause(); }}><Pause className="w-4 h-4"/>إيقاف مؤقت</Button>
              ) : (
                <Button onClick={() => { setPlayAll(true); audioRef.current?.play().catch(()=>{}); }}><Play className="w-4 h-4"/>تشغيل الكل</Button>
              )}
              <Button variant="outline" onClick={() => setAudioIndex((i) => (i + 1) % audioList.length)}><SkipForward className="w-4 h-4"/>التالي</Button>
            </div>
            <audio key={audioIndex} ref={audioRef} controls className="w-full" autoPlay={playAll} onEnded={() => {
              if (audioList.length > 1) setAudioIndex((i) => (i + 1) % audioList.length);
            }}>
              <source src={audioList[audioIndex]?.src} />
            </audio>
            <div className="grid sm:grid-cols-2 gap-2">
              {audioList.map((a, i) => (
                <Button key={i} variant={i === audioIndex ? 'default' : 'outline'} onClick={() => setAudioIndex(i)} className="justify-start">
                  {i === audioIndex ? '▶ ' : ''}{a.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {content?.tl_dr && (
        <Card>
          <CardHeader><CardTitle>TL;DR</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border">{content.tl_dr.one_line}</div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border">{content.tl_dr.three_sentences}</div>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border">{content.tl_dr.eli12}</div>
          </CardContent>
        </Card>
      )}

      {selected.image_url && (
        <img src={selected.image_url} alt={selected.title} className="w-full rounded-xl border" />
      )}

      {content?.sections?.map((sec, idx) => (
        <Card key={idx} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl">{sec.heading}</CardTitle>
            {sec.short_summary && <CardDescription>{sec.short_summary}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            {sec.detailed && (
              <p className="leading-8 text-sm sm:text-base whitespace-pre-wrap">{sec.detailed}</p>
            )}

            {sec.bullets && sec.bullets.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">نقاط رئيسية</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {sec.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            )}

            {sec.quotes && sec.quotes.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">اقتباسات</h4>
                {sec.quotes.map((q, i) => (
                  <blockquote key={i} className="border-r-4 pr-3 text-sm italic opacity-80">{q}</blockquote>
                ))}
              </div>
            )}

            {sec.terms && sec.terms.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">مصطلحات</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {sec.terms.map((t, i) => (
                    <div key={i} className="p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border">
                      <div className="font-medium">{t.term}</div>
                      <div className="text-sm text-muted-foreground">{t.definition}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sec.tables && sec.tables.length > 0 && (
              <div className="space-y-4">
                {sec.tables.map((tbl, i) => (
                  <div key={i}>
                    {tbl.title && <h4 className="font-semibold mb-2">{tbl.title}</h4>}
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-800">
                            {tbl.columns.map((c, j) => <th key={j} className="p-2 text-right border-b">{c}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {tbl.rows.map((r, ri) => (
                            <tr key={ri} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                              {r.map((cell, ci) => <td key={ci} className="p-2 border-b">{String(cell)}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sec.visuals && sec.visuals.length > 0 && (
              <div className="space-y-4">
                <Separator />
                {sec.visuals.map((v, i) => (
                  <div key={i} className="space-y-2">
                    {'title' in v && v.title && <div className="font-semibold flex items-center gap-2">{v.type === 'chartjs' ? <PlayCircle className='w-4 h-4'/> : <ImageIcon className='w-4 h-4'/>}{v.title}</div>}
                    {v.type === 'chartjs' && <ChartJSRenderer id={`chart-${idx}-${i}`} config={v.config} />}
                    {v.type === 'mermaid' && <MermaidRenderer code={v.code} />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}


      {content?.faq && content.faq.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>أسئلة شائعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content.faq.map((f, i) => (
              <div key={i} className="p-3 rounded-md border bg-gray-50 dark:bg-gray-800/50">
                <div className="font-medium mb-1">{f.q}</div>
                <div className="text-sm text-muted-foreground">{f.a}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {(pdfList.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5"/>قائمة ملفات PDF</CardTitle>
            <CardDescription>اختر ملفًا للعرض أو فعِّل التمرير التلقائي</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setPdfIndex((i) => (i - 1 + pdfList.length) % pdfList.length)}><SkipBack className="w-4 h-4"/>السابق</Button>
              <Button variant={autoRotatePdf ? 'default' : 'outline'} onClick={() => setAutoRotatePdf(v => !v)}>{autoRotatePdf ? 'إيقاف التمرير' : 'تشغيل التمرير'}</Button>
              <Button variant="outline" onClick={() => setPdfIndex((i) => (i + 1) % pdfList.length)}><SkipForward className="w-4 h-4"/>التالي</Button>
            </div>
            <div className="border rounded-lg overflow-hidden w-full h-[70vh]">
              <iframe key={pdfIndex} src={pdfList[pdfIndex]?.src} className="w-full h-full" title="PDF"></iframe>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {pdfList.map((p, i) => (
                <div key={i} className={`p-2 rounded border ${i === pdfIndex ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-900'}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium truncate">{p.title}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setPdfIndex(i)}>عرض</Button>
                      <Button asChild size="sm" variant="secondary"><a href={p.src} target="_blank">فتح</a></Button>
                      <Button asChild size="sm" variant="outline"><a href={p.src} download>تحميل</a></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {exam && (
        <Card>
          <CardHeader>
            <CardTitle>الامتحان</CardTitle>
            {typeof exam.duration_minutes === 'number' && (
              <CardDescription>المدة المقترحة: {exam.duration_minutes} دقائق</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {exam.questions.map((q, i) => (
              <div key={i} className="p-3 rounded-md border">
                <div className="font-medium mb-2">{i + 1}. {q.q}</div>
                {q.type === 'mcq' && (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name={`q-${i}`}
                          checked={answers[i] === oi}
                          onChange={() => setAnswers(prev => ({ ...prev, [i]: oi }))}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === 'true_false' && (
                  <div className="flex gap-4 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name={`q-${i}`} checked={answers[i] === true} onChange={() => setAnswers(prev => ({ ...prev, [i]: true }))} />
                      <span>صحيح</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name={`q-${i}`} checked={answers[i] === false} onChange={() => setAnswers(prev => ({ ...prev, [i]: false }))} />
                      <span>خطأ</span>
                    </label>
                  </div>
                )}
                {'explanation' in q && answers[i] !== undefined && (
                  <div className="mt-2 text-xs text-muted-foreground">التوضيح: {(q as any).explanation || '—'}</div>
                )}
              </div>
            ))}
            <div className="flex items-center gap-3">
              <div className="font-semibold">النتيجة: {score}%</div>
              <Button variant="outline" onClick={resetExam}>إعادة</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>كيف تستخدم الصفحة؟</CardTitle>
          <CardDescription>٣ خطوات بسيطة</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="p-3 rounded-md border">1) استمع للملخص السريع أو اقرأ TL;DR</div>
          <div className="p-3 rounded-md border">2) تصفح الأقسام، الجداول، والرسوم (Chart.js و Mermaid)</div>
          <div className="p-3 rounded-md border">3) راجع الأسئلة الشائعة ثم جرّب الامتحان واطّلع على ملف PDF</div>
        </CardContent>
      </Card>
    </div>
  );
}
