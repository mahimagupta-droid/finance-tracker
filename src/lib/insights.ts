import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns"
export async function getReccuringExpenses(userId: string, threeMonthsAgo: Date,) {
  const transactions = await prisma.transaction.findMany({
    where: {
      clerkId: userId,
      type: "expense",
      date: { gte: threeMonthsAgo },
    },
    orderBy: { date: "asc" },
  });

  const groupedByDescription: Record<string, { month: string; amount: number }[]> = {};

  transactions.forEach((t) => {
    const monthKey = `${t.date.getFullYear()}-${t.date.getMonth()}`;
    if (!groupedByDescription[t.description]) {
      groupedByDescription[t.description] = [];
    }
    groupedByDescription[t.description].push({
      month: monthKey,
      amount: t.amount,
    });
  });

  const recurringItems: {
    description: string
    averageAmount: number;
    occurrences: number;
  }[] = [];

  Object.entries(groupedByDescription).forEach(([description, entries]) => {
    const uniqueMonths = new Set(entries.map((e) => e.month));

    if (uniqueMonths.size >= 3) {
      const amounts = entries.map((e) => e.amount);
      const avg = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;

      const allWithinTolerance = amounts.every((amt) => {
        const diff = Math.abs(amt - avg) / avg;
        return diff <= 0.2;
      });

      if (allWithinTolerance) {
        recurringItems.push({
          description,
          averageAmount: avg,
          occurrences: uniqueMonths.size,
        });
      }
    }
  });
  return recurringItems;
}

export async function getCategorySpending(userId: string, start: Date, end: Date,) {
  const result = await prisma.transaction.groupBy({
    by: ["category"],
    where: {
      clerkId: userId,
      type: "expense",
      date: { gte: start, lte: end },
    },
    _sum: { amount: true },
  });
  const formatted = result.map((item) => ({
    category: item.category,
    total: item._sum.amount ?? 0,
  }));
  return formatted;
}


export async function getExpenseSpikes(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      clerkId: userId,
      type: "expense",
      date: { gte: new Date(new Date().setMonth(new Date().getMonth() - 4)) },
    },
    orderBy: { date: "asc" },
  });
  const groupedByCategory: Record<string, Record<string, number>> = {};

  transactions.forEach((t) => {
    const monthKey = `${t.date.getFullYear()}-${t.date.getMonth()}`;
    if (!groupedByCategory[t.category]) {
      groupedByCategory[t.category] = {};
    }
    groupedByCategory[t.category][monthKey] =
      (groupedByCategory[t.category][monthKey] || 0) + t.amount;
  });
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

  const spikes: {
    category: string;
    currentSpend: number;
    average: number;
    percentageIncrease: number;
  }[] = [];

  Object.entries(groupedByCategory).forEach(([category, monthData]) => {
    const currentMonthSpend = monthData[currentMonthKey];

    // Skip if there's no spending this month in this category
    if (currentMonthSpend === undefined) return;

    // History = all months except the current one
    const historyValues = Object.entries(monthData)
      .filter(([month]) => month !== currentMonthKey)
      .map(([, amount]) => amount);

    // Need at least 3 months of history to calculate meaningful stats
    if (historyValues.length < 3) return;

    const mean =
      historyValues.reduce((sum, v) => sum + v, 0) / historyValues.length;
    const variance =
      historyValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
      historyValues.length;
    const stdDev = Math.sqrt(variance);

    const threshold = mean + 2 * stdDev;

    if (currentMonthSpend > threshold) {
      const percentageIncrease = Math.round(
        ((currentMonthSpend - mean) / mean) * 100,
      );
      spikes.push({
        category,
        currentSpend: currentMonthSpend,
        average: Math.round(mean),
        percentageIncrease,
      });
    }
  });
  return spikes;
}

export async function buildFinancialSummary(userId: string) {
  const userDetails = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!userDetails) {
    return "Please fill the details first"
  }
  const { persona, incomeRange, primaryGoal } = userDetails;
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const incomeResult = await prisma.transaction.aggregate({
    where: {
      clerkId: userId,
      type: 'income',
      date: { gte: monthStart, lte: monthEnd }
    },
    _sum: { amount: true },
  })
  const totalIncome = incomeResult._sum.amount ?? 0;
  const expensesResult = await prisma.transaction.aggregate({
    where: {
      clerkId: userId,
      type: 'expense',
      date: { gte: monthStart, lte: monthEnd }
    },
    _sum: { amount: true },
  })
  const totalExpenses = expensesResult._sum.amount ?? 0;
  const savings = totalIncome - totalExpenses;
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const recurringExpenses = await getReccuringExpenses(userId, threeMonthsAgo);
  const monthlyExpenses = await getCategorySpending(userId, monthStart, monthEnd);
  const expenseSpikes = await getExpenseSpikes(userId);
  const budgets = await prisma.budget.findMany({
    where: {
      clerkId: userId,
      month: monthStart.getMonth() + 1,
      year: monthStart.getFullYear(),
    }
  })
  const exceedingBudget = budgets.map((budget) => {
    const spent = monthlyExpenses.find((c) => c.category === budget.category)
    return {
      category: budget.category,
      limit: budget.monthlyLimit,
      spent: spent?.total ?? 0,
    }
  }).filter((b) => b.spent > b.limit);
  console.log("income:", totalIncome, "expenses:", totalExpenses, "savings:", savings, "recurringExpenses:", recurringExpenses, "monthlyExpenses:", monthlyExpenses, "expenseSpikes:", expenseSpikes, "exceedingBudget:", exceedingBudget);
  return { persona, incomeRange, primaryGoal, totalIncome, totalExpenses, savings, recurringExpenses, monthlyExpenses, expenseSpikes, exceedingBudget };
}