import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
        const label = req.nextUrl.searchParams.get("label");
        const result = await prisma.saving.aggregate({
            where: {
                clerkId: userId,
                label: label ?? undefined
            },
            _sum: { amount: true }
        })
        const totalSavings = result._sum.amount ?? 0;
        return NextResponse.json({ totalSavings }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
        const { amount, label, date } = await req.json();
        if (!amount || !label || !date) return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        const savingsData = await prisma.saving.create({
            data: {
                clerkId: userId,
                amount,
                label,
                date: new Date(date),
            }
        })
        return NextResponse.json(savingsData, { status: 201 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
            return NextResponse.json(
                { error: "PROFILE_REQUIRED", message: "Please complete your profile before adding transactions." },
                { status: 409 },
            );
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}