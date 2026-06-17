import { NextRequest, NextResponse } from 'next/server';
import { getMonthlyStats, getDailyTotals, getWeeklyStats } from '@/lib/db';

function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month') || getCurrentMonth();
  const type = searchParams.get('type');

  if (type === 'daily') {
    const daily = getDailyTotals(month);
    return NextResponse.json(daily);
  }

  if (type === 'weekly') {
    const today = searchParams.get('today') || getTodayStr();
    const weekly = getWeeklyStats(today);
    return NextResponse.json(weekly);
  }

  const stats = getMonthlyStats(month);
  return NextResponse.json(stats);
}
