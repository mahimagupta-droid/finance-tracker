import { UtensilsCrossed, Car, ShoppingBag, Heart, Banknote, CreditCard, Smile, Zap, GraduationCap, Home, MoreHorizontal } from "lucide-react";
import { formatter } from "@/components/summaryCard";
import { Budget } from "@/lib/types/budget";
export const ICON_MAP = { UtensilsCrossed, Car, ShoppingBag, Heart, Banknote, CreditCard, Smile, Zap, GraduationCap, Home, MoreHorizontal }
type Props = {
    budgets: Budget[];
}
export const CATEGORY_META: Record<string, { icon: keyof typeof ICON_MAP; color: string }> = {
    food: { icon: "UtensilsCrossed", color: "#FF6384" },
    transport: { icon: "Car", color: "#36A2EB" },
    shopping: { icon: "ShoppingBag", color: "#FFCE56" },
    health: { icon: "Heart", color: "#4BC0C0" },
    rent: { icon: "Home", color: "#78909C" },
    subscriptions: { icon: "CreditCard", color: "#AB47BC" },
    entertainment: { icon: "Smile", color: "#FF7043" },
    utilities: { icon: "Zap", color: "#29B6F6" },
    education: { icon: "GraduationCap", color: "#FFB300" },
    other_expense: { icon: "MoreHorizontal", color: "#757575" },
};
const getBarColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
}

export default function CategoryBudgetList({ budgets }: Props) {
    if (budgets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-card p-10 text-center min-h-full">
                <p className="text-lg font-semibold text-textColor">No budgets created yet</p>
                <p className="text-sm text-muted-foreground">Use the form to set your first monthly budget.</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-4 w-full">
            {budgets.map((b) => {
                const percentage = Math.min((b.spent / b.monthlyLimit) * 100, 100);
                const meta = CATEGORY_META[b.category];
                const IconComponent = meta ? ICON_MAP[meta.icon] : null;
                if (!IconComponent) return null;
                return (
                    <div key={b.id} className="flex flex-col gap-5">
                        <div className="bg-card mt-5 mb-5 p-5 rounded-md">
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row gap-2 mb-4">
                                    <IconComponent size={25} />
                                    <p className="font-semibold">{b.category}</p>
                                </div>
                                <p className="text-muted-foreground font-semibold">{formatter.format(b.spent)} / {formatter.format(b.monthlyLimit)}</p>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/10">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${getBarColor(percentage)}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <p className="mt-2 mb-1">Limit Used: {percentage.toFixed(1)}%</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}