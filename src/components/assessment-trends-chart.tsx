
'use client';

import * as React from 'react';
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { day: 'Monday', assessments: 22 },
  { day: 'Tuesday', assessments: 31 },
  { day: 'Wednesday', assessments: 28 },
  { day: 'Thursday', assessments: 45 },
  { day: 'Friday', assessments: 35 },
  { day: 'Saturday', assessments: 15 },
  { day: 'Sunday', assessments: 12 },
];

const chartConfig = {
  assessments: {
    label: 'Assessments',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function AssessmentTrendsChart() {
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
            <LineChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 20,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    width={30}
                 />
                <Tooltip 
                    cursor={{fill: 'hsl(var(--muted))', opacity: 0.5}}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Line 
                    type="monotone" 
                    dataKey="assessments" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{
                        fill: 'hsl(var(--primary))',
                        r: 4
                    }}
                    activeDot={{
                        r: 6,
                        style: { stroke: 'hsl(var(--primary))' }
                    }}
                />
            </LineChart>
        </ChartContainer>
    </div>
  );
}
