import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'markmoney.db');

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      amount REAL NOT NULL CHECK(amount > 0),
      category TEXT NOT NULL,
      description TEXT DEFAULT '',
      date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: { category: string; amount: number; type: string }[];
}

export interface DailyGroup {
  date: string;
  income: number;
  expense: number;
  transactions: Transaction[];
}

export function getTransactions(month: string): Transaction[] {
  const db = getDb();
  const stmt = db.prepare(
    `SELECT * FROM transactions WHERE strftime('%Y-%m', date) = ? ORDER BY date DESC, id DESC`
  );
  return stmt.all(month) as Transaction[];
}

export function addTransaction(tx: Omit<Transaction, 'id' | 'created_at'>): Transaction {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO transactions (type, amount, category, description, date)
     VALUES (@type, @amount, @category, @description, @date)`
  );
  const result = stmt.run(tx);
  return {
    id: result.lastInsertRowid as number,
    ...tx,
    created_at: new Date().toISOString(),
  };
}

export function deleteTransaction(id: number): boolean {
  const db = getDb();
  const stmt = db.prepare(`DELETE FROM transactions WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
}

export function getMonthlyStats(month: string): MonthlyStats {
  const db = getDb();
  const totals = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as totalIncome,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as totalExpense
    FROM transactions
    WHERE strftime('%Y-%m', date) = ?
  `).get(month) as { totalIncome: number; totalExpense: number };

  const categories = db.prepare(`
    SELECT category, SUM(amount) as amount, type
    FROM transactions
    WHERE strftime('%Y-%m', date) = ?
    GROUP BY category, type
    ORDER BY amount DESC
  `).all(month) as { category: string; amount: number; type: string }[];

  return {
    totalIncome: totals.totalIncome,
    totalExpense: totals.totalExpense,
    balance: totals.totalIncome - totals.totalExpense,
    categoryBreakdown: categories,
  };
}

export function getDailyGroups(month: string): DailyGroup[] {
  const txs = getTransactions(month);
  const groups = new Map<string, DailyGroup>();

  for (const tx of txs) {
    if (!groups.has(tx.date)) {
      groups.set(tx.date, { date: tx.date, income: 0, expense: 0, transactions: [] });
    }
    const group = groups.get(tx.date)!;
    if (tx.type === 'income') {
      group.income += tx.amount;
    } else {
      group.expense += tx.amount;
    }
    group.transactions.push(tx);
  }

  return Array.from(groups.values());
}


