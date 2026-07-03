/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import SummaryCard from "@/components/summaryCard";
import CategoryBudgetList from "@/components/Budgets/CategoryBudgetList";
import CreateBudgetForm from "@/components/Budgets/CreateBudgetForm";
import DonutChart from "@/components/Budgets/DonutChart";
import { useFinanceStore } from "@/lib/store/useFinanceStore";
import { useEffect } from "react";

export default function BudgetPage() {
    const { transactions, budgets, loading, fetchTransactions, fetchBudgets, budgetsError } = useFinanceStore();

    useEffect(() => {
        fetchTransactions();
        fetchBudgets();
    }, [fetchBudgets, fetchTransactions]);

    const now = new Date();
    const spentByCategory: Record<string, number> = {};
    transactions.forEach((t: any) => {
        const tDate = new Date(t.date);
        if (t.type === "expense"
            && tDate.getMonth() === now.getMonth()
            && tDate.getFullYear() === now.getFullYear()) {
            spentByCategory[t.category] =
                (spentByCategory[t.category] ?? 0) + t.amount;
        }
    });

    const mappedBudgets = budgets.map((b: any) => ({
        ...b,
        monthlyLimit: Number(b.monthlyLimit),
        spent: spentByCategory[b.category] ?? 0,
    }));

    const totalExpenses = mappedBudgets.reduce((sum, items) => sum + items.spent, 0);
    const totalBudget = mappedBudgets.reduce((sum, items) => sum + items.monthlyLimit, 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center gap-6 mt-10 animate-pulse">
                <div className="h-10 w-64 bg-card rounded-xl border border-border" />
                <div className="grid md:grid-cols-3 gap-6 w-3/4">
                    <div className="h-28 bg-card rounded-xl border border-border" />
                    <div className="h-28 bg-card rounded-xl border border-border" />
                    <div className="h-28 bg-card rounded-xl border border-border" />
                </div>
                <div className="grid grid-cols-3 gap-6 w-3/4">
                    <div className="col-span-2 h-96 bg-card rounded-xl border border-border" />
                    <div className="h-96 bg-card rounded-xl border border-border" />
                </div>
            </div>
        )
    }

    return (
        <main className="w-full">
            <div className="flex flex-col items-center justify-center mb-10">
                <h1 className="text-[3rem] font-bold mb-3 mt-5">Budget Overview</h1>
                <div className="grid md:grid-cols-3 gap-6 mt-6 w-3/4">
                    <SummaryCard title="Total Expenses" amount={totalExpenses} type="expense" />
                    <SummaryCard title="Remaining" amount={totalBudget - totalExpenses} type="balance" />
                    <SummaryCard title="Total Budget" amount={totalBudget} type="income" />
                </div>
                {budgetsError ? (
                    <div className="mt-8 w-3/4 rounded-lg border border-border bg-card p-10 text-center">
                        <p className="font-semibold text-textColor">Couldn't load your budgets</p>
                        <p className="text-sm text-muted-textColor mt-1">{budgetsError}</p>
                        <button
                            onClick={() => fetchBudgets()}
                            className="mt-4 rounded-lg border border-border bg-primary text-primary-textColor px-4 py-2 text-sm hover:bg-primary/85 transition"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <div className="mt-8 w-3/4 grid grid-cols-3 gap-6 mt-10">
                        <div className="col-span-2">
                            <CategoryBudgetList budgets={mappedBudgets} />
                        </div>
                        <div className="flex flex-col items-center gap-4 col-span-1">
                            <DonutChart budgets={mappedBudgets} />
                            <CreateBudgetForm onSuccess={fetchBudgets} />
                        </div>
                    </div>
                )}
            </div>
        </main >
    );
}