/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const reqBody = await request.json();
    const { email, name, age, monthlyIncome, savingsGoal, persona, incomeRange, primaryGoal } = reqBody;
    const createResponse = await prisma.user.create({
      data: {
        clerkId: userId,
        email: email,
        name: name,
        age: age,
        monthlyIncome: monthlyIncome,
        savingsGoal: savingsGoal,
        onboarded: true,
        persona,
        incomeRange,
        primaryGoal
      },
    });
    return NextResponse.json({
      message: "User created successfully",
      user: createResponse,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
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
    const userProfile = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      user: userProfile,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await prisma.user.deleteMany({ where: { clerkId: userId } });
    const client = await clerkClient();
    await client.users.deleteUser(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion failed:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { age, monthlyIncome, savingsGoal, onboarded, persona, incomeRange, primaryGoal } =
      await request.json();
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
    const name = clerkUser?.fullName ?? clerkUser?.firstName ?? "";

    const updatedUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { age, monthlyIncome, savingsGoal, onboarded, persona, incomeRange, primaryGoal },
      create: {
        clerkId: userId,
        email,
        name,
        age,
        monthlyIncome,
        savingsGoal,
        onboarded,
        persona,
        incomeRange,
        primaryGoal,
      },
    });
    return NextResponse.json({
      message: "User updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}