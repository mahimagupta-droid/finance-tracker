import { emergencyFundTarget } from "@/lib/financialCalc";
import { useFinanceStore } from "@/lib/store/useFinanceStore"
import { useEffect, useState } from "react";
export default function EmergencyFundCalculator() {
    const { transactions, userPersona, totalSavings, savingsLoading, fetchTotalSavings, fetchUserPersona } = useFinanceStore();
    const now = new Date();
    const monthlyExpenses = transactions.filter((t) => {
        const tDate = new Date(t.date)
        return t.type === "expense" && tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear()
    }).reduce((acc, t) => acc + t.amount, 0);
    const target = emergencyFundTarget(monthlyExpenses, userPersona ?? "")
    const progress = target > 0 ? Math.min(100, (totalSavings / target) * 100) : 0;
    useEffect(() => {
        fetchTotalSavings("Emergency Fund")
        fetchUserPersona()
    }, []);
    const [amount, setAmount] = useState(0);

    const handleAddSaving = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || amount <= 0) return;

        try {
            const response = await fetch("/api/savings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, label: "Emergency Fund", date: new Date() }),
            });
            if (response.ok) {
                setAmount(0);
                await fetchTotalSavings("Emergency Fund");
            }
        } catch (error) {
            console.error("Failed to add saving:", error);
        }
    };
    return (
        <div className="w-full max-w-md mx-auto bg-card rounded-2xl">
            <h1 className="text-2xl font-bold mb-6 text-foreground">Emergency Fund Calculator</h1>
            <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Monthly Expenses</label>
                <input
                    type="text"
                    value={monthlyExpenses.toLocaleString()}
                    disabled
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Persona</label>
                <input
                    type="text"
                    value={userPersona || "Calculating..."}
                    disabled
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Target Emergency Fund</label>
                <input
                    type="text"
                    value={target.toLocaleString()}
                    disabled
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Total Savings</label>
                <input
                    type="text"
                    value={totalSavings.toLocaleString()}
                    disabled
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Progress</label>
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                {progress.toFixed(1)}%
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-emerald-600">
                                {Math.round(totalSavings).toLocaleString()} / {Math.round(target).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-200">
                        <div
                            style={{ width: `${progress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500"
                        ></div>
                    </div>
                </div>
                <form onSubmit={handleAddSaving} className="mt-6 flex gap-2">
                    <input
                        type="number"
                        value={amount || ""}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="Add amount"
                        className="flex-1 bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                    />
                    <button
                        type="submit"
                        disabled={savingsLoading}
                        className="bg-button text-button border px-4 py-2 rounded-lg font-medium hover:bg-primary/85 transition disabled:opacity-50"
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    );
}