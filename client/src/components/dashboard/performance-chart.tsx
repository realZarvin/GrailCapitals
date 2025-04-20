import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DataPoint {
  date: string;
  value: number;
}

interface PerformanceChartProps {
  data: DataPoint[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartRef = useRef<ChartJS>(null);
  
  const labels = data.map(item => item.date);
  const values = data.map(item => item.value);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Investment Value',
        data: values,
        borderColor: 'hsl(45 100% 60%)',
        backgroundColor: 'hsla(45, 100%, 60%, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'hsl(45 100% 60%)',
        pointBorderColor: 'hsl(45 100% 60%)',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'hsla(var(--border), 0.5)',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        }
      },
      y: {
        grid: {
          color: 'hsla(var(--border), 0.5)',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          callback: function(value: number) {
            return '$' + value.toFixed(0);
          }
        }
      }
    },
  };
  
  // Empty chart data for displaying when no data is available
  const emptyChartData = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [
      {
        label: 'No Data',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'hsla(var(--muted-foreground), 0.5)',
        backgroundColor: 'hsla(var(--muted-foreground), 0.1)',
        borderDashed: [5, 5],
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };
  
  const isEmptyData = data.length === 0;
  
  return (
    <div className="h-full w-full">
      {isEmptyData ? (
        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
          <i className="fas fa-chart-line text-3xl mb-2"></i>
          <p>No performance data available yet.</p>
          <p className="text-sm">Make a deposit to start tracking your investments.</p>
        </div>
      ) : (
        <Line 
          ref={chartRef}
          data={chartData} 
          options={options as any} 
        />
      )}
    </div>
  );
}
