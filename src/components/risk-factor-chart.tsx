
'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { factor: 'Memory', contribution: 18 },
  { factor: 'Exec. Func.', contribution: 15 },
  { factor: 'MRI Atrophy', contribution: 22 },
  { factor: 'Gait', contribution: 8 },
  { factor: 'Family Hist.', contribution: 12 },
  { factor: 'Speech', contribution: 10 },
  { factor: 'Other', contribution: 15 },
];

const chartConfig = {
  contribution: {
    label: 'Risk Contribution',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function RiskFactorChart() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-[350px] w-full bg-muted rounded-lg animate-pulse" />;
  }
  
  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <YAxis
              dataKey="factor"
              type="category"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              width={80}
            />
            <XAxis type="number" dataKey="contribution" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="contribution" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
