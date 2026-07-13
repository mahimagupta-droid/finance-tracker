"use client";
import { PieChart, Cell, Pie } from "recharts";
import { CATEGORY_META } from "@/components/Budgets/CategoryBudgetList";
import { Budget } from "@/lib/types/budget";

type Props = {
    budgets: Budget[];
}

export default function DonutChart({ budgets }: Props) {
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const hasSpending = totalSpent > 0;

    // When nothing has been spent, Recharts can't compute arc angles from all-zero
    // values (division by zero), so it renders nothing. Feed it a single placeholder
    // slice instead so the ring still shows.
    const chartData = hasSpending
        ? budgets
        : [{ category: "empty", spent: 1 }];

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
                <PieChart width={300} height={300}>
                    <Pie
                        data={chartData}
                        innerRadius={60}
                        outerRadius={130}
                        dataKey="spent"
                    >
                        {hasSpending ? (
                            budgets.map((entry, i) => {
                                const meta = CATEGORY_META[entry.category];
                                return <Cell key={i} fill={meta?.color || "#888"} />;
                            })
                        ) : (
                            <Cell fill="var(--border)" />
                        )}
                    </Pie>
                </PieChart>
                <div className="absolute text-center pointer-events-none">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">₹{totalSpent}</p>
                </div>
            </div>

            {budgets.length > 0 && (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-xs">
                    {budgets.map((b) => {
                        const meta = CATEGORY_META[b.category];
                        return (
                            <div key={b.id} className="flex items-center gap-2 text-sm">
                                <span
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: meta?.color || "#888" }}
                                />
                                <span className="text-textColor capitalize">{b.category}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}