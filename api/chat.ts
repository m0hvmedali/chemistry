export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  try {
    const { prompt } = await req.json();
    const model = 'openai/gpt-oss-120b:free';
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return Response.json({ error: 'Server missing OPENROUTER_API_KEY' }, { status: 500 });

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'كن خبير كيمياء عربي ودود، دقيق ومبسط.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 600
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ error: 'OpenRouter error', details: errText }, { status: 500 });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    return Response.json({ text });
  } catch (e: any) {
    return Response.json({ error: 'Unexpected error', details: e?.message }, { status: 500 });
  }
}
