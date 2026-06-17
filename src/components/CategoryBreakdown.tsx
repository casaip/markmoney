'use client';

interface Props {
  data: { category: string; amount: number; type: string }[];
  type: 'income' | 'expense';
}

const COLORS_INCOME = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
const COLORS_EXPENSE = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'];

export default function CategoryBreakdown({ data, type }: Props) {
  const filtered = data
    .filter((d) => d.type === type)
    .sort((a, b) => b.amount - a.amount);

  if (filtered.length === 0) return null;

  const total = filtered.reduce((sum, d) => sum + d.amount, 0);
  const colors = type === 'income' ? COLORS_INCOME : COLORS_EXPENSE;
  const maxAmount = filtered[0]?.amount || 1;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {type === 'income' ? 'Income Categories' : 'Expense Categories'}
      </h3>
      <div className="space-y-2">
        {filtered.map((d, i) => (
          <div key={d.category}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{d.category}</span>
              <span className="font-medium text-gray-800">
                ${d.amount.toFixed(2)}
                <span className="text-gray-400 ml-1">
                  ({total > 0 ? Math.round((d.amount / total) * 100) : 0}%)
                </span>
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round((d.amount / maxAmount) * 100)}%`,
                  backgroundColor: colors[i % colors.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
