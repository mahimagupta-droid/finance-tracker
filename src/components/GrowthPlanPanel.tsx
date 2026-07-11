"use client";
import { useFinanceStore } from "@/lib/store/useFinanceStore";
import { useEffect } from "react";

const categoryColors: Record<string, string> = {
    "Emergency Fund": "border-emerald-500 bg-emerald-50 text-gray-900",
    "Upskilling": "border-blue-500 bg-blue-50 text-gray-900",
    "Investing": "border-purple-500 bg-purple-50 text-gray-900",
    "Debt Clearance": "border-red-500 bg-red-50 text-gray-900",
};
const defaultColor = "border-slate-400 bg-slate-50 text-gray-900";

export default function GrowthPlanPanel() {
    const { growthPlan, growthPlanLoading, growthPlanFetched, growthPlanError, fetchGrowthPlan } = useFinanceStore();

    useEffect(() => {
        fetchGrowthPlan();
    }, []);

    return (
        <div className="space-y-3">
            {growthPlanLoading && (
                <p className="text-center p-4 text-muted-foreground text-md">Building your growth plan...</p>
            )}

            {growthPlanError && !growthPlanLoading && (
                <div className="rounded border-l-4 border-red-500 bg-red-50 p-4 text-gray-900">
                    <p className="font-semibold">Couldn&apos;t load your growth plan</p>
                    <p className="text-sm text-gray-600">{growthPlanError}</p>
                    <button
                        onClick={() => fetchGrowthPlan(true)}
                        className="mt-2 rounded border bg-red-100 px-3 py-1 text-sm hover:bg-red-200"
                    >
                        Try again
                    </button>
                </div>
            )}

            {!growthPlanLoading && !growthPlanError && growthPlan.length === 0 && growthPlanFetched && (
                <p className="text-center p-4 text-muted-foreground text-md">No growth plan yet.</p>
            )}

            {!growthPlanError && growthPlan.map((item, index) => (
                <div key={index} className={`border-l-4 p-4 rounded ${categoryColors[item.category] ?? defaultColor}`}>
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{item.category}</h3>
                        <span className="text-sm font-semibold">₹{item.amount.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
                </div>
            ))}

            <div className="flex justify-center">
                <button
                    onClick={() => fetchGrowthPlan(true)}
                    className="cursor-pointer rounded border p-3 text-center bg-button text-button"
                >
                    Refresh Growth Plan
                </button>
            </div>
        </div>
    );
}