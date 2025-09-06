import { useEffect, useId, useState } from 'react';

export default function MermaidRenderer({ code }: { code: string }) {
  const id = useId().replace(/:/g, '');
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    const mermaid = (window as any).mermaid;
    if (!mermaid) return;
    let mounted = true;
    (async () => {
      try {
        await mermaid.initialize({ startOnLoad: false });
        const { svg } = await mermaid.render(`mermaid-${id}`, code);
        if (mounted) setSvg(svg);
      } catch (e) {
        console.error('Mermaid render error', e);
      }
    })();
    return () => { mounted = false; };
  }, [code, id]);

  return (
    <div className="w-full overflow-x-auto border rounded-lg bg-white dark:bg-gray-900 p-3" dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
