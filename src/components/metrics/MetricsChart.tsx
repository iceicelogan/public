import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { BodyMetricsEntry } from '../../types';
import { formatDateShort, isWithinDays } from '../../utils/helpers';

interface Props {
  metrics: BodyMetricsEntry[];
  window: 30 | 60 | 90;
  goalMin: number;
  goalMax: number;
}

export default function MetricsChart({ metrics, window, goalMin, goalMax }: Props) {
  const data = [...metrics]
    .filter((m) => m.weight && isWithinDays(m.date, window))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => ({
      date: m.date,
      weight: m.weight,
    }));

  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-600 text-sm">
        Log at least 2 weight entries to see a chart
      </div>
    );
  }

  const minWeight = Math.min(...data.map((d) => d.weight!)) - 2;
  const maxWeight = Math.max(...data.map((d) => d.weight!)) + 2;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis
          dataKey="date"
          tickFormatter={(d: string) => formatDateShort(d)}
          tick={{ fontSize: 10, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[minWeight, maxWeight]}
          tick={{ fontSize: 10, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#f1f5f9',
          }}
          formatter={(val: number) => [`${val} lbs`, 'Weight']}
          labelFormatter={(label: string) => formatDateShort(label)}
        />
        {/* Goal band */}
        <ReferenceLine
          y={goalMin}
          stroke="#22c55e"
          strokeDasharray="4 3"
          strokeWidth={1}
          label={{ value: `${goalMin}`, position: 'right', fontSize: 10, fill: '#22c55e' }}
        />
        <ReferenceLine
          y={goalMax}
          stroke="#22c55e"
          strokeDasharray="4 3"
          strokeWidth={1}
          label={{ value: `${goalMax}`, position: 'right', fontSize: 10, fill: '#22c55e' }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#f97316"
          strokeWidth={2.5}
          dot={{ fill: '#f97316', r: 3 }}
          activeDot={{ r: 5, fill: '#f97316' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
