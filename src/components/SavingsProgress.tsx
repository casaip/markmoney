'use client';

interface Props {
  saved: number;
  income: number;
  expense: number;
}

export default function SavingsProgress({ saved, income }: Props) {
  const pct = income > 0 ? Math.round((saved / income) * 100) : 0;
  const safePct = Math.max(0, Math.min(100, pct));
  const color = pct >= 50 ? 'emerald' : pct >= 20 ? 'amber' : 'red';

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Saved This Month</div>
      <div className="text-3xl font-bold text-gray-900 mb-3">
        {saved >= 0 ? '+' : ''}${saved.toFixed(2)}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-${color}-500 rounded-full transition-all duration-500`}
            style={{ width: `${safePct}%` }}
          />
        </div>
        <span className={`text-xs font-semibold text-${color}-600 min-w-[32px] text-right`}>
          {safePct}%
        </span>
      </div>
      <div className="text-xs text-gray-400">
        Saved {safePct}% of your ${income.toFixed(2)} income this month
      </div>
    </div>
  );
}
