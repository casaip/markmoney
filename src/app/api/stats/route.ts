import { NextRequest, NextResponse } from 'next/server';
import { getMonthlyStats } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

  const stats = getMonthlyStats(month);
  return NextResponse.json(stats);
}
