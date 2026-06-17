import { NextRequest, NextResponse } from 'next/server';
import { getTransactions, getDailyGroups, addTransaction } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);
  const group = searchParams.get('group') === 'daily';

  if (group) {
    const days = getDailyGroups(month);
    return NextResponse.json(days);
  }

  const transactions = getTransactions(month);
  return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, amount, category, description, date } = body;

  if (!type || !['income', 'expense'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }
  if (!category) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 });
  }
  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  const tx = addTransaction({
    type,
    amount: Math.round(amount * 100) / 100,
    category,
    description: description || '',
    date,
  });

  return NextResponse.json(tx, { status: 201 });
}
