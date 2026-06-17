'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  data: { category: string; amount: number; type: string }[];
  type: 'income' | 'expense';
}

const COLORS_INCOME = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
const COLORS_EXPENSE = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'];

export default function CategoryChart({ data, type }: Props) {
  const filtered = data.filter((d) => d.type === type);
  const colors = type === 'income' ? COLORS_INCOME : COLORS_EXPENSE;

  if (filtered.length === 0) return null;

  const total = filtered.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        {type === 'income' ? 'Income Breakdown' : 'Expense Breakdown'}
      </h3>
      <div className="flex items-center gap-4">
        <div className="w-28 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filtered.map((d) => ({ name: d.category, value: d.amount }))}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={3}
                dataKey="value"
              >
                {filtered.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: unknown) => `$${(value as number).toFixed(2)}`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1">
          {filtered.map((d, i) => (
            <div key={d.category} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <span className="text-gray-600">{d.category}</span>
              </div>
              <span className="font-medium text-gray-800">
                ${d.amount.toFixed(0)}
                <span className="text-gray-400 ml-0.5">
                  ({total > 0 ? Math.round((d.amount / total) * 100) : 0}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
