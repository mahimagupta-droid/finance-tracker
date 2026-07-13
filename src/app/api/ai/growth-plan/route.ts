import { buildFinancialSummary } from "@/lib/insights";
import prisma from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { monthlySavingsPotential, emergencyFundTarget } from "@/lib/financialCalc";
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const summary = await buildFinancialSummary(userId);
        if (typeof summary === "string") return NextResponse.json({ error: summary }, { status: 400 });

        const { persona, primaryGoal, totalIncome, totalExpenses } = summary;

        const savingsResult = await prisma.saving.aggregate({
            where: { clerkId: userId, label: "Emergency Fund" },
            _sum: { amount: true },
        });
        const totalSaved = savingsResult._sum.amount ?? 0;

        const savingsPotential = monthlySavingsPotential(totalIncome, totalExpenses);
        const emergencyTarget = emergencyFundTarget(totalExpenses, persona ?? "");

        const systemPrompt = `You are a personal finance advisor for Indian users. Be direct, practical, and encouraging.
        The user is a ${persona}, and their primary financial goal is: ${primaryGoal}.
        Based on their available monthly savings, recommend how they should allocate that money across these categories:
        - "Emergency Fund" — building/topping up their safety cushion, if not yet fully funded
        - "Upskilling" — courses, certifications, or skills relevant to increasing their income
        - "Investing" — SIPs, index funds, or other wealth-building instruments, appropriate to their persona and risk stability
        - "Debt Clearance" — only include this if relevant based on the data given
        If their emergency fund is not yet fully funded, prioritize it heavily before suggesting large investing amounts.
        Keep each "reason" to 1-2 short sentences, in plain language, avoiding jargon without explanation.
        Respond ONLY in valid JSON: { "allocations": [{ "category": string, "amount": number, "reason": string }] }
        The amounts across all allocations should roughly sum to the user's monthly savings potential.`;

        const userPrompt = `Monthly savings potential: ₹${savingsPotential}
        Emergency Fund progress: ₹${totalSaved} saved out of a ₹${emergencyTarget} target
        Persona: ${persona}
        Primary goal: ${primaryGoal}
        Give me a practical monthly allocation plan for this money.`;
        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
        });

        let cleaned = text.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/```json|```/g, "").trim();
        }
        const parsed = JSON.parse(cleaned);

        return NextResponse.json(parsed, { status: 200 });
    } catch (error) {
        // console.error("Growth plan route error:", error);
        return NextResponse.json({ error: "Failed to generate growth plan" }, { status: 500 });
    }
}