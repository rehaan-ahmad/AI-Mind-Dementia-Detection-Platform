'use client';

import * as React from 'react';
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';

interface RiskVisualizationProps {
  value: number;
}

export function RiskVisualization({ value }: RiskVisualizationProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const data = [{ name: 'score', value: value, fill: 'hsl(var(--primary))' }];
  const circleSize = 200;

  if (!isClient) {
    return <div style={{width: `${circleSize}px`, height: `${circleSize}px`}} className="bg-muted rounded-full animate-pulse" />;
  }

  return (
    <div className="w-[200px] h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="80%"
          outerRadius="100%"
          barSize={10}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: 'hsl(var(--muted))' }}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
