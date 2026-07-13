import { buildFinancialSummary } from "@/lib/insights";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const result = await buildFinancialSummary(userId);
        if (typeof result === "string") return NextResponse.json(
            { error: result },
            { status: 400 }
        )
        const { persona, incomeRange, primaryGoal, totalIncome, totalExpenses, savings, recurringExpenses, monthlyExpenses, expenseSpikes, exceedingBudget } = result;

        const exceededText = exceedingBudget.length > 0 ?
            exceedingBudget.map((b) => {
                return `${b.category} (spent ₹${b.spent}, limit: ₹${b.limit} )`
            }).join(", ") : "None";

        const spikesText = expenseSpikes.length > 0 ?
            expenseSpikes.map((e) => {
                return `${e.category} (spent ₹${e.currentSpend},avg: ₹${e.average})`
            }).join(", ") : "None";
        const recurringText = recurringExpenses.length > 0 ?
            recurringExpenses.map((e) => {
                return `${e.description} (spent: ₹${e.averageAmount}, occurence: ${e.occurrences})`
            }).join(", ") : "None";
        const topCategoriesText = monthlyExpenses.map((e) => {
            return `${e.category}: ₹${e.total}`
        }).join(", ");

        const systemPrompt = `You are a personal finance advisor for Indian users. Be direct and concise. The user is a ${persona}. Reference their actual rupee amounts. Never give generic advice. Respond ONLY in valid JSON: { "insights": [{ "type": string, "title": string, "description": string, "priority": string }] } Insight types: overspending | savings_tip | investment_suggestion | recurring_alert | goal_progress`;

        const userPrompt = `Monthly data for ${persona} with goal ${primaryGoal}:
        Income: ₹${totalIncome} | Expenses: ₹${totalExpenses} | Savings this month: ₹${savings}
        Top categories: ${topCategoriesText}
        Budget exceeded in: ${exceededText}
        Recurring expenses detected: ${recurringText}
        Spending spikes this month: ${spikesText}
        Give me 3-5 priority-ranked financial insights.
        Vary insight types across the response where the data genuinely supports it, using at most 2 insights of the same type. Do not invent an overspending, spike, or recurring_alert insight if the data above shows none — accuracy to the real numbers always takes priority over type variety.`;

        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            system: systemPrompt,
            messages: [
                { role: "user", content: userPrompt }
            ]
        });
        let cleanedRes = text.trim();
        if (cleanedRes.startsWith("```")) {
            cleanedRes = cleanedRes.replace(/```json|```/g, "").trim();
        }
        const parsed = JSON.parse(cleanedRes)
        // console.log("Insight types received:", parsed.insights.map((i: any) => i.type));
        return NextResponse.json(parsed, { status: 200 })
    } catch (error) {
        // console.error("Insights route error:", error);
        return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
    }
}