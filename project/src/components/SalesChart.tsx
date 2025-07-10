import React, { useRef, useEffect } from 'react';
import { ProcessedData } from '../types/sales';

interface SalesChartProps {
  data: ProcessedData;
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.regression) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { timeSeriesData, regression } = data;
    const { predictions, forecasts } = regression;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const padding = 60;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Calculate ranges
    const allData = [...timeSeriesData, ...forecasts];
    const xMin = Math.min(...allData.map(d => d.x));
    const xMax = Math.max(...allData.map(d => d.x));
    const yMin = Math.min(...allData.map(d => d.y)) * 0.9;
    const yMax = Math.max(...allData.map(d => d.y)) * 1.1;

    const xScale = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
    const yScale = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

    // Draw grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * (width - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = padding + (i / 10) * (height - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw actual data points
    ctx.fillStyle = '#3b82f6';
    timeSeriesData.forEach(point => {
      const x = xScale(point.x);
      const y = yScale(point.y);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw prediction line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    timeSeriesData.forEach((point, index) => {
      const x = xScale(point.x);
      const y = yScale(predictions[index]);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw forecast line
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    forecasts.forEach((point, index) => {
      const x = xScale(point.x);
      const y = yScale(point.y);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw forecast points
    ctx.fillStyle = '#8b5cf6';
    forecasts.forEach(point => {
      const x = xScale(point.x);
      const y = yScale(point.y);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#475569';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis labels
    for (let i = 0; i <= 5; i++) {
      const dayIndex = Math.floor((i / 5) * (xMax - xMin)) + xMin;
      const x = xScale(dayIndex);
      ctx.fillText(`Day ${dayIndex}`, x, height - padding + 20);
    }
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = yMin + (i / 5) * (yMax - yMin);
      const y = yScale(value);
      ctx.fillText(`$${Math.round(value).toLocaleString()}`, padding - 10, y + 4);
    }

    // Legend
    const legendY = padding + 20;
    ctx.textAlign = 'left';
    
    // Actual data legend
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(width - 150, legendY, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#1f2937';
    ctx.fillText('Actual Sales', width - 140, legendY + 4);
    
    // Prediction legend
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(width - 150, legendY + 20);
    ctx.lineTo(width - 130, legendY + 20);
    ctx.stroke();
    ctx.fillText('Predicted Trend', width - 125, legendY + 24);
    
    // Forecast legend
    ctx.strokeStyle = '#8b5cf6';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(width - 150, legendY + 40);
    ctx.lineTo(width - 130, legendY + 40);
    ctx.stroke();
    ctx.fillText('30-Day Forecast', width - 125, legendY + 44);

  }, [data]);

  return (
    <div className="w-full h-96 bg-slate-50 rounded-lg border overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default SalesChart;