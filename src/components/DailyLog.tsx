'use client';

import { useState } from 'react';
import type { DailyGroup } from '@/lib/db';

interface Props {
  days: DailyGroup[];
  onDelete: (id: number) => void;
}

export default function DailyLog({ days, onDelete }: Props) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  if (days.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-2">📝</div>
        <p>No transactions this month yet</p>
        <p className="text-sm">Tap the buttons below to add one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {days.map((day) => {
        const isExpanded = expandedDate === day.date;
        const net = day.income - day.expense;
        const dateObj = new Date(day.date + 'T00:00:00');
        const dayLabel = dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

        return (
          <div key={day.date} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setExpandedDate(isExpanded ? null : day.date)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">{dayLabel}</span>
              <div className="flex items-center gap-3 text-sm">
                {day.income > 0 && <span className="text-emerald-600 font-semibold">+${day.income.toFixed(2)}</span>}
                {day.expense > 0 && <span className="text-red-500 font-semibold">−${day.expense.toFixed(2)}</span>}
                <span className={`font-bold ${net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {net >= 0 ? '+' : ''}{net.toFixed(2)}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100">
                {day.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          tx.type === 'income'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '−'}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{tx.category}</div>
                        {tx.description && (
                          <div className="text-xs text-gray-400">{tx.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '−'}${tx.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(tx.id);
                        }}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
