'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardCards from '@/components/DashboardCards';
import AddTransactionForm from '@/components/AddTransactionForm';
import DailyLog from '@/components/DailyLog';
import CategoryChart from '@/components/CategoryChart';
import type { Transaction, DailyGroup, MonthlyStats } from '@/lib/db';

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getMonthStr(date: Date): string {
  return date.toISOString().slice(0, 7);
}

function formatMonth(month: string): string {
  const [y, m] = month.split('-');
  const d = new Date(parseInt(y), parseInt(m) - 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function Home() {
  const [month, setMonth] = useState(() => getMonthStr(new Date()));
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [days, setDays] = useState<DailyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Add form state
  const [formType, setFormType] = useState<'income' | 'expense' | null>(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getTodayStr());
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [statsRes, daysRes] = await Promise.all([
      fetch(`/api/stats?month=${month}`),
      fetch(`/api/transactions?month=${month}&group=daily`),
    ]);
    if (statsRes.ok) setStats(await statsRes.json());
    if (daysRes.ok) setDays(await daysRes.json());
    setLoading(false);
  }, [month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = useCallback(async () => {
    if (!amount || !category || !formType) return;
    setSaving(true);

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: formType,
        amount: parseFloat(amount),
        category,
        description,
        date,
      }),
    });

    if (res.ok) {
      setFormType(null);
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(getTodayStr());
      fetchData();
    }
    setSaving(false);
  }, [amount, category, formType, description, date, fetchData]);

  const handleDelete = useCallback(
    async (id: number) => {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    },
    [fetchData]
  );

  const changeMonth = (delta: number) => {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta);
    setMonth(getMonthStr(d));
  };

  const isCurrentMonth = month === getMonthStr(new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">💸 MarkMoney</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-700 min-w-[120px] text-center">
              {formatMonth(month)}
            </span>
            <button
              onClick={() => changeMonth(1)}
              disabled={isCurrentMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-24">
        {/* Monthly Summary Cards */}
        {stats && (
          <DashboardCards
            totalIncome={stats.totalIncome}
            totalExpense={stats.totalExpense}
            balance={stats.balance}
          />
        )}

        {/* Category Charts */}
        {stats && stats.categoryBreakdown.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
            <CategoryChart data={stats.categoryBreakdown} type="income" />
            <CategoryChart data={stats.categoryBreakdown} type="expense" />
          </div>
        )}

        {/* Add Transaction Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <AddTransactionForm
            onAdd={() => {}}
            type={formType}
            setType={setFormType}
            amount={amount}
            setAmount={setAmount}
            category={category}
            setCategory={setCategory}
            description={description}
            setDescription={setDescription}
            date={date}
            setDate={setDate}
            onSubmit={handleAdd}
            loading={saving}
          />
        </div>

        {/* Daily Log */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Daily Log</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-2" />
              Loading...
            </div>
          ) : (
            <DailyLog days={days} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </div>
  );
}
