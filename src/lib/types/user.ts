export type UserTypes = {
    clerkId: string;
    email: string;
    name: string;
    age?: number | null;
    monthlyIncome?: number | null;
    savingsGoal?: number | null;
    frequency?: string | null;
    persona?: string | null;
    incomeRange?: string | null;
    primaryGoal?: string | null;
    onboarded: boolean;
    createdAt: Date;
    updatedAt: Date;
}