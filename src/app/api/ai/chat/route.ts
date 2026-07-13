import { buildFinancialSummary } from "@/lib/insights";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import { streamText, convertToModelMessages } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({
            error: "unauthorized access",
        }, { status: 401 })
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

        const systemPrompt = `You are a personal finance advisor for Indian users named FinSight. Be direct, concise, and conversational.
        The user is a ${persona} with the goal: ${primaryGoal}. Reference their actual rupee amounts naturally in your answers.
        Here is their current financial snapshot:
        Income: ₹${totalIncome} | Expenses: ₹${totalExpenses} | Savings this month: ₹${savings}
        Top categories: ${topCategoriesText}
        Budget exceeded in: ${exceededText}
        Recurring expenses: ${recurringText}
        Spending spikes: ${spikesText}
        Answer the user's questions using this context. Do not respond in JSON — respond in plain, helpful natural language.`;

        const { messages } = await req.json();
        const modelMessages = await convertToModelMessages(messages);
        const streamResult = streamText({
            model: google("gemini-2.5-flash"),
            system: systemPrompt,
            messages: modelMessages,
        })
        return streamResult.toUIMessageStreamResponse()
    } catch (error) {
        // console.error("Chat route error: ", error);
        return NextResponse.json(
            { error: "Failed to generate insights" },
            { status: 500 }
        )
    }
}