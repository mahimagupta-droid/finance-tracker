import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getCategorySpending } from "../../../../lib/insights";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const startParam = searchParams.get("start");
        const endParam = searchParams.get("end");

        const now = new Date();
        const start = startParam ? new Date(startParam) : new Date(now.getFullYear(), now.getMonth(), 1);
        const end = endParam ? new Date(endParam) : new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const data = await getCategorySpending(userId, start, end);

        return NextResponse.json({ success: true, data: data });
    } catch (error) {
        // console.error("Error fetching category spending:", error);
        return NextResponse.json({ error: "Failed to fetch category spending" }, { status: 500 });
    }
}