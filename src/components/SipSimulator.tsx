"use client";
import { sipFutureValue, formatINR } from "@/lib/financialCalc";
import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function SipSimulator() {
    const [monthlyAmount, setMonthlyAmount] = useState(5000);
    const [annualRate, setAnnualRate] = useState(12);
    const [years, setYears] = useState(10);

    const chartData = Array.from({ length: years }, (_, i) => {
        const yearNumber = i + 1;
        return {
            year: `Yr ${yearNumber}`,
            value: Math.round(sipFutureValue(monthlyAmount, annualRate, yearNumber)),
        };
    });

    const finalValue = chartData[chartData.length - 1]?.value ?? 0;
    const totalInvested = monthlyAmount * years * 12;
    const totalGrowth = finalValue - totalInvested;

    return (
        <div className="w-full bg-card rounded-xl p-6 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-textColor text-center">SIP Simulator</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-muted-textColor">Monthly Investment (₹)</label>
                    <input
                        type="number"
                        value={monthlyAmount}
                        onChange={(e) => setMonthlyAmount(Math.max(0, Number(e.target.value)))}
                        className="bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-muted-textColor">Expected Annual Return (%)</label>
                    <input
                        type="number"
                        value={annualRate}
                        onChange={(e) => setAnnualRate(Math.max(0, Number(e.target.value)))}
                        className="bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-muted-textColor">Duration (Years)</label>
                    <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(Math.min(40, Math.max(1, Number(e.target.value))))}
                        className="bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm text-muted-textColor">Total Invested</p>
                    <p className="text-lg font-semibold text-textColor">{formatINR(totalInvested)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-textColor">Estimated Growth</p>
                    <p className="text-lg font-semibold text-green-500">{formatINR(totalGrowth)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-textColor">Future Value</p>
                    <p className="text-lg font-semibold text-primary">{formatINR(finalValue)}</p>
                </div>
            </div>

            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="sipGrowth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#67c7ff" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#67c7ff" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="year" stroke="var(--muted-foreground, #94a3b8)" fontSize={12} />
                        <YAxis
                            stroke="var(--muted-foreground, #94a3b8)"
                            fontSize={12}
                            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            formatter={(value: any) => formatINR(Number(value))}
                            contentStyle={{ backgroundColor: "var(--card, #0f172a)", border: "1px solid var(--border, #1e293b)", borderRadius: "8px" }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#67c7ff" strokeWidth={2} fill="url(#sipGrowth)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
