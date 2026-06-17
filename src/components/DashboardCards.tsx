'use client';

interface Props {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export default function DashboardCards({ totalIncome, totalExpense, balance }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-emerald-50 rounded-xl p-4 text-center">
        <div className="text-xs text-emerald-600 font-medium mb-1">Income</div>
        <div className="text-lg font-bold text-emerald-700">${totalIncome.toFixed(2)}</div>
      </div>
      <div className="bg-red-50 rounded-xl p-4 text-center">
        <div className="text-xs text-red-600 font-medium mb-1">Expenses</div>
        <div className="text-lg font-bold text-red-700">${totalExpense.toFixed(2)}</div>
      </div>
      <div className={`rounded-xl p-4 text-center ${balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
        <div className={`text-xs font-medium mb-1 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Balance</div>
        <div className={`text-lg font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
          {balance >= 0 ? '+' : ''}{balance.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
