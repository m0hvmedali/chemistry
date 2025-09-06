import { useEffect, useRef } from 'react';

type ChartConfig = any;

export default function ChartJSRenderer({ id, config, height = 280 }: { id: string; config: ChartConfig; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const Chart = (window as any).Chart;
    if (!Chart || !canvasRef.current) return;

    try {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      chartRef.current = new Chart(canvasRef.current, config);
    } catch (e) {
      console.error('Chart.js render error', e);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [config]);

  return (
    <div className="w-full">
      <canvas ref={canvasRef} id={id} style={{ width: '100%', height }} />
    </div>
  );
}
