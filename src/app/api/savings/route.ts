import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        const label = req.nextUrl.searchParams.get("label");
        const result = await prisma.saving.aggregate({
            where: {
                clerkId: userId,
                label: label ?? undefined
            },
            _sum: { amount: true }
        })
        const totalSaved = result._sum.amount ?? 0;
        return NextResponse.json({ success: true, totalSaved })
    } catch (error) {
        console.log("Error getting savings", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        const { amount, label, date } = await req.json();
        const response = await prisma.saving.create({
            data: {
                clerkId: userId,
                amount,
                label,
                date: new Date(date)
            }
        })
        return NextResponse.json({ success: true, saving: response })
    } catch (error) {
        console.log("Error saving", error)
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
    }
}