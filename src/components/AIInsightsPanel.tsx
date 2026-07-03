import { useFinanceStore } from "@/lib/store/useFinanceStore";
import { useEffect } from "react";

export default function AIInsightsPanel() {
    const { aiInsights, insightsLoading, insightsFetched, insightsError, fetchInsights } = useFinanceStore();
    useEffect(() => {
        fetchInsights();
    }, []);
    const typeColors: Record<string, string> = {
        overspending: "border-red-500 bg-red-50 text-gray-900",
        savings_tip: "border-green-500 bg-green-50 text-gray-900",
        investment_suggestion: "border-blue-500 bg-blue-50 text-gray-900",
        recurring_alert: "border-amber-500 bg-amber-50 text-gray-900",
        goal_progress: "border-purple-500 bg-purple-50 text-gray-900",
    };
    const defaultColor = "border-slate-400 bg-slate-50 text-gray-900";
    return (
        <div className="space-y-3">
            {insightsLoading && <p className="text-center p-4 text-muted-foreground text-md">Loading insights...</p>}
            {insightsError && !insightsLoading && (
                <div className="rounded border-l-4 border-red-500 bg-red-50 p-4 text-gray-900">
                    <p className="font-semibold">Couldn't load your insights</p>
                    <p className="text-sm text-gray-600">{insightsError}</p>
                    <button
                        onClick={() => fetchInsights(true)}
                        className="mt-2 rounded border bg-red-100 px-3 py-1 text-sm hover:bg-red-200"
                    >
                        Try again
                    </button>
                </div>
            )}
            {!insightsLoading && !insightsError && aiInsights.length === 0 && insightsFetched && (
                <p className="text-center p-4 text-muted-foreground text-md">No insights yet.</p>
            )}
            {aiInsights.map((insight, index) => (
                <div key={index} className={`border-l-4 p-4 rounded ${typeColors[insight.type] ?? defaultColor}`}>
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <span className="text-xs uppercase">{insight.priority}</span>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
            ))}
            <div className="flex justify-center align-center">
                <button onClick={() => fetchInsights(true)} className="cursor-pointer rounded border p-3 text-center bg-gray-200 text-black">Refresh Insights</button>
            </div>
        </div>
    );
}