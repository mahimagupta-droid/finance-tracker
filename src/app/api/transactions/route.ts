import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { amount, type, category, description, date, paymentMethod, isEssential, isRecurring } = body;
    if (
      amount == null || amount <= 0 ||
      !type || type === "select" ||
      !category || category === "select" ||
      !date ||
      !paymentMethod || paymentMethod === "select"
    ) {
      return NextResponse.json(
        { error: "All fields are required and must be valid" },
        { status: 400 },
      );
    }

    const response = await prisma.transaction.create({
      data: {
        clerkId: userId,
        amount: amount,
        type: type,
        category: category,
        description: description,
        date: date,
        paymentMethod: paymentMethod,
        isEssential: isEssential ?? false,
        isRecurring: isRecurring ?? false,
      }
    });
    return NextResponse.json(
      {
        transaction: response,
        success: true,
        message: "Transaction successfully created!",
      },
      { status: 201 },
    );
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const transactions = await prisma.transaction.findMany({ where: { clerkId: userId } });
    return NextResponse.json(
      { transactions, success: true, message: "Transactions retrieved." },
      { status: 200 },
    );
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
