'use client';

import { useCallback } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/constants';

interface Props {
  onAdd: () => void;
  type: 'income' | 'expense' | null;
  setType: (t: 'income' | 'expense' | null) => void;
  amount: string;
  setAmount: (a: string) => void;
  category: string;
  setCategory: (c: string) => void;
  description: string;
  setDescription: (d: string) => void;
  date: string;
  setDate: (d: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function AddTransactionForm({
  onAdd,
  type,
  setType,
  amount,
  setAmount,
  category,
  setCategory,
  description,
  setDescription,
  date,
  setDate,
  onSubmit,
  loading,
}: Props) {
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  if (!type) {
    return (
      <div className="flex gap-3">
        <button
          onClick={() => setType('expense')}
          className="flex-1 py-4 rounded-xl bg-red-500 text-white font-semibold text-lg active:scale-95 transition-transform"
        >
          − Expense
        </button>
        <button
          onClick={() => setType('income')}
          className="flex-1 py-4 rounded-xl bg-emerald-500 text-white font-semibold text-lg active:scale-95 transition-transform"
        >
          + Income
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => { setType(null); setAmount(''); setCategory(''); setDescription(''); }}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ← Back
        </button>
        <span className={`text-sm font-semibold ${type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
          {type === 'income' ? '+ Add Income' : '− Add Expense'}
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                category === cat
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. lunch at cafeteria"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !amount || !category}
        className={`w-full py-4 rounded-xl font-semibold text-lg text-white transition-colors ${
          type === 'income' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Saving...' : type === 'income' ? 'Add Income' : 'Add Expense'}
      </button>
    </form>
  );
}
