/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import DashboardCard from "@/components/dashboardCard";
import { useEffect, useState } from "react";
import LineChart from "@/components/charts/line";
import { PieChart } from "@/components/charts/pie";
import { BarChart } from "@/components/charts/bar";
import { useFinanceStore } from "../../lib/store/useFinanceStore"
import DateRangePicker from "../../components/miscellaneous/DateRangePicker";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import AskFinsightChat from "@/components/AskFinsightChat";

export default function Dashboard() {
    const { transactions, loading, fetchTransactions } = useFinanceStore();
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardingLoading, setOnboardingLoading] = useState(true);
    const [categorySpending, setCategorySpending] = useState<{ category: string; total: number }[]>([]);
    const [recurringItems, setRecurringItems] = useState<{ description: string; averageAmount: number; occurrences: number }[]>([]);
    const [spikes, setSpikes] = useState<{ category: string; currentSpend: number; average: number; percentageIncrease: number }[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const fetchSpikes = async () => {
        const response = await fetch("/api/insights/spikes");
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                setSpikes(data.spikes);
            }
        }
    }
    const fetchRecurring = async () => {
        const response = await fetch("/api/insights/recurring");
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                setRecurringItems(data.recurring);
            }
        }
    }
    const [onboardingData, setOnboardingData] = useState({
        age: 0,
        monthlyIncome: 0,
        savingsGoal: 0,
        frequency: "monthly",
        persona: "",
        incomeRange: "",
        primaryGoal: ""
    });

    const fetchCategorySpending = async (start?: Date, end?: Date) => {
        let url = "/api/insights/category-spending";
        if (start && end) {
            url += `?start=${start.toISOString()}&end=${end.toISOString()}`;
        }
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                setCategorySpending(data.data);
            }
        }
    }
    const handleRangeChange = (start: Date, end: Date) => {
        fetchCategorySpending(start, end);
    }
    const handleOnboardingSubmit = async () => {
        const response = await fetch("/api/user-profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                age: onboardingData.age,
                monthlyIncome: onboardingData.monthlyIncome,
                savingsGoal: onboardingData.savingsGoal,
                onboarded: true,
                persona: onboardingData.persona,
                incomeRange: onboardingData.incomeRange,
                primaryGoal: onboardingData.primaryGoal,
            }),
        });
        if (response.ok) {
            setShowOnboarding(false);
        }
    }

    const checkOnboarding = async () => {
        const response = await fetch("/api/user-profile");
        if (response.ok) {
            const data = await response.json();
            if (data.user.onboarded === false) {
                setShowOnboarding(true);
            }
        }
        setOnboardingLoading(false);
    }
    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        checkOnboarding();
        fetchCategorySpending();
        fetchRecurring();
        fetchSpikes();
    }, [fetchTransactions])

    const now = new Date();
    const currentMonthTransanctions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() == now.getMonth() && transactionDate.getFullYear() == now.getFullYear();
    })
    const totalIncome = currentMonthTransanctions.filter((transaction: any) => transaction.type == "income").reduce((total: any, currentTransaction: any) => total + currentTransaction.amount, 0);
    const totalExpenses = currentMonthTransanctions.filter((transaction: any) => transaction.type == "expense").reduce((total: any, currentTransaction: any) => total + currentTransaction.amount, 0);
    const balance = totalIncome - totalExpenses;
    const expenses = transactions.filter((transaction: any) => transaction.type == "expense")

    //line chart 
    const groupedExpenses = expenses.reduce((acc: any, curr: any) => {
        const date = new Date(curr.date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = curr.amount;
        } else {
            acc[date] += curr.amount;
        }
        return acc;
    }, {})
    const sortedDates = Object.keys(groupedExpenses).sort();
    const labelOnAxis = sortedDates;
    const amountOnAxis = sortedDates.map((date: string) => groupedExpenses[date]);
    const expenseChartData = {
        labels: labelOnAxis,
        datasets: [
            {
                label: "Expenses",
                data: amountOnAxis,
                borderColor: "var(--danger)",
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                pointBackgroundColor: "var(--danger)",
                pointBorderColor: "#fff",
                borderWidth: 2,
                tension: 0.4,
            }
        ]
    }

    //pie chart
    const pieLabels = categorySpending.map((item) => item.category);
    const pieAmounts = categorySpending.map((item) => item.total);
    const pieChartData = {
        labels: pieLabels,
        datasets: [
            {
                label: "Expenses",
                data: pieAmounts,
                backgroundColor: [
                    "#67c7ff",
                    "#9dceff",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                    "#a78bfa",
                    "#22d3ee"
                ],
                borderColor: "var(--background)",
                borderWidth: 2,
            }
        ]
    }

    //bar chart
    const groupedByMonth = transactions.reduce((acc: any, curr: any) => {
        const month = new Date(curr.date).toLocaleDateString("default", {
            month: "short",
        });

        if (!acc[month]) {
            acc[month] = { income: 0, expense: 0 };
        }

        if (curr.type === "income") {
            acc[month].income += curr.amount;
        } else {
            acc[month].expense += curr.amount;
        }

        return acc;
    }, {});
    const sortedMonths = Object.keys(groupedByMonth);
    const incomeData = sortedMonths.map(
        (month) => groupedByMonth[month].income
    );

    const expenseData = sortedMonths.map(
        (month) => groupedByMonth[month].expense
    );
    const barChartData = {
        labels: sortedMonths,
        datasets: [
            {
                label: "Income",
                data: incomeData,
                backgroundColor: "rgba(16, 185, 129, 0.8)", // green
                borderRadius: 8,
            },
            {
                label: "Expenses",
                data: expenseData,
                backgroundColor: "rgba(239, 68, 68, 0.8)", // red
                borderRadius: 8,
            },
        ],
    };
    if (loading) {
        return (
            <div className="flex flex-col gap-10 mb-20 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="h-28 bg-card rounded-xl border border-border" />
                    <div className="h-28 bg-card rounded-xl border border-border" />
                    <div className="h-28 bg-card rounded-xl border border-border" />
                </div>
                <div className="h-96 bg-card rounded-xl border border-border" />
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="h-64 bg-card rounded-xl border border-border" />
                    <div className="h-64 bg-card rounded-xl border border-border" />
                    <div className="h-64 bg-card rounded-xl border border-border" />
                </div>
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-10 mb-20">
            {showOnboarding && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
                    <div className="bg-card border border-border rounded-xl p-8 w-full max-w-md flex flex-col gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-textColor">Welcome to FinsightAI</h2>
                            <p className="text-accent mt-1">Step {currentStep + 1} of 3</p>
                        </div>

                        {currentStep === 0 && (
                            <div className="flex flex-col gap-4">
                                <label className="text-sm text-textColor">Who are you?</label>
                                <div className="flex flex-col gap-2">
                                    {["student", "professional", "freelancer"].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setOnboardingData({ ...onboardingData, persona: p })}
                                            className={`px-4 py-2 rounded-lg border capitalize text-left ${onboardingData.persona === p
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border text-textColor"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-textColor">Age</label>
                                    <input
                                        type="number"
                                        placeholder="eg. 22"
                                        className="bg-background border border-border rounded-lg px-4 py-2 text-textColor"
                                        onChange={(e) => setOnboardingData({ ...onboardingData, age: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-textColor">Monthly Income (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="eg. 50000"
                                        className="bg-background border border-border rounded-lg px-4 py-2 text-textColor"
                                        onChange={(e) => setOnboardingData({ ...onboardingData, monthlyIncome: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-textColor">Income Range</label>
                                    <select
                                        className="bg-background border border-border rounded-lg px-4 py-2 text-textColor"
                                        onChange={(e) => setOnboardingData({ ...onboardingData, incomeRange: e.target.value })}
                                    >
                                        <option value="<15k">Below ₹15,000</option>
                                        <option value="15k-50k">₹15,000 – ₹50,000</option>
                                        <option value="50k-1L">₹50,000 – ₹1,00,000</option>
                                        <option value=">1L">Above ₹1,00,000</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-textColor">Savings Goal (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="eg. 100000"
                                        className="bg-background border border-border rounded-lg px-4 py-2 text-textColor"
                                        onChange={(e) => setOnboardingData({ ...onboardingData, savingsGoal: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-textColor">Savings Goal Frequency</label>
                                    <select
                                        className="bg-background border border-border rounded-lg px-4 py-2 text-textColor"
                                        onChange={(e) => setOnboardingData({ ...onboardingData, frequency: e.target.value })}
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-textColor">Primary Financial Goal</label>
                                    <select
                                        className="bg-background border border-border rounded-lg px-4 py-2 text-textColor"
                                        onChange={(e) => setOnboardingData({ ...onboardingData, primaryGoal: e.target.value })}
                                    >
                                        <option value="Save More">Save More</option>
                                        <option value="Invest">Invest</option>
                                        <option value="Clear Debt">Clear Debt</option>
                                        <option value="Emergency Fund">Build Emergency Fund</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between gap-4">
                            {currentStep > 0 && (
                                <button
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="px-4 py-2 rounded-lg border border-border text-textColor"
                                >
                                    Back
                                </button>
                            )}
                            {currentStep < 2 ? (
                                <button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    className="flex-1 bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:opacity-90 transition"
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    onClick={handleOnboardingSubmit}
                                    className="flex-1 bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:opacity-90 transition"
                                >
                                    Let&apos;s Go →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 mt-10 mb-5">
                <div className="flex justify-center items-center">
                    <h2 className="text-textColor text-3xl font-bold ">
                        Transactions Overview
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl">
                    <DashboardCard title="Total Income" amount={totalIncome} type="income" />
                    <DashboardCard title="Total Expenses" amount={totalExpenses} type="expense" />
                    <DashboardCard title="Balance" amount={balance} type="balance" />
                </div>
            </div>
            <div className="flex flex-col justify-between items-center">
                <h2 className="text-textColor text-3xl font-bold">
                    SpendWise Dashboard
                </h2>
                <h3 className="text-accent text-lg">
                    Track your spending patterns and financial health
                </h3>
                <div className="flex justify-center mt-4">
                    <DateRangePicker onRangeChange={handleRangeChange} />
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-card border border-border p-6 rounded-xl w-full h-156.25 transition-colors duration-300">
                    <PieChart data={pieChartData} />
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-card border border-border p-6 rounded-xl h-75 transition-colors duration-300">
                        <LineChart data={expenseChartData} />
                    </div>
                    <div className="bg-card border border-border p-6 rounded-xl h-75 transition-colors duration-300">
                        <BarChart data={barChartData} />
                    </div>
                </div>
            </div>
            {recurringItems.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-textColor text-2xl font-bold text-center">
                        Subscriptions Detected
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recurringItems.map((item) => (
                            <div key={item.description} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
                                <span className="text-textColor font-semibold">{item.description}</span>
                                <span className="text-accent text-sm">
                                    ~₹{Math.round(item.averageAmount)} · {item.occurrences} months
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {spikes.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-textColor text-2xl font-bold text-center">
                        Spending Spikes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {spikes.map((spike) => (
                            <div key={spike.category} className="bg-card border border-danger/40 rounded-xl p-4 flex flex-col gap-2">
                                <span className="text-textColor font-semibold capitalize">{spike.category}</span>
                                <span className="text-danger text-sm">
                                    ₹{spike.currentSpend} this month — {spike.percentageIncrease}% above average
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 mt-3">
                <h1 className="text-textColor text-2xl font-bold text-center">AI Insights</h1>
                <AIInsightsPanel />
            </div>
            {/* <div className="p-3 rounded-xl bg-cyan-50 text-black w-1/4 flex flex-col text-right justify-right mt-3 fixed bottom-4 right-4 z-50"> */}
            <AskFinsightChat />
            {/* </div> */}
        </div>

    );
}