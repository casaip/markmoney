'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { day: number; expense: number; income: number }[];
}

export default function DailyBarChart({ data }: Props) {
  const hasData = data.some((d) => d.expense > 0 || d.income > 0);
  if (!hasData) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Daily Spending</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              formatter={(value: unknown, name: unknown) => [`$${(value as number).toFixed(2)}`, name === 'expense' ? 'Spent' : 'Income']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: 12 }}
            />
            <Bar dataKey="expense" fill="#ef4444" radius={[2, 2, 0, 0]} maxBarSize={20} />
            <Bar dataKey="income" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
