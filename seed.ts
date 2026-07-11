import "dotenv/config";
import prisma from "./src/lib/prisma";

const CLERK_ID = "user_3G7pDzP7ikWSW2vOHAA3OTCvuae";

async function main() {
    // ---------- TRANSACTIONS ----------
    await prisma.transaction.createMany({
        data: [
            // ===== MAY 2026 =====
            { clerkId: CLERK_ID, amount: 50000, type: "income", category: "salary", description: "Office salary", date: new Date("2026-05-01"), paymentMethod: "bank_transfer", isEssential: true, isRecurring: true },
            { clerkId: CLERK_ID, amount: 12000, type: "expense", category: "rent", description: "Monthly rent", date: new Date("2026-05-02"), paymentMethod: "bank_transfer", isEssential: true, isRecurring: true },
            { clerkId: CLERK_ID, amount: 500, type: "expense", category: "subscriptions", description: "Netflix", date: new Date("2026-05-05"), paymentMethod: "upi", isEssential: false, isRecurring: true },
            { clerkId: CLERK_ID, amount: 199, type: "expense", category: "subscriptions", description: "Spotify", date: new Date("2026-05-06"), paymentMethod: "upi", isEssential: false, isRecurring: true },
            { clerkId: CLERK_ID, amount: 4000, type: "expense", category: "food", description: "Groceries week 1", date: new Date("2026-05-04"), paymentMethod: "cash", isEssential: true, isRecurring: false },
            { clerkId: CLERK_ID, amount: 3200, type: "expense", category: "food", description: "Groceries week 3", date: new Date("2026-05-18"), paymentMethod: "cash", isEssential: true, isRecurring: false },
            { clerkId: CLERK_ID, amount: 1500, type: "expense", category: "transport", description: "Fuel + cab", date: new Date("2026-05-12"), paymentMethod: "upi", isEssential: true, isRecurring: false },
            { clerkId: CLERK_ID, amount: 2000, type: "expense", category: "shopping", description: "Clothes", date: new Date("2026-05-18"), paymentMethod: "card", isEssential: false, isRecurring: false },
            { clerkId: CLERK_ID, amount: 800, type: "expense", category: "entertainment", description: "Movie night", date: new Date("2026-05-22"), paymentMethod: "upi", isEssential: false, isRecurring: false },

            // ===== JUNE 2026 =====
            { clerkId: CLERK_ID, amount: 50000, type: "income", category: "salary", description: "Office salary", date: new Date("2026-06-01"), paymentMethod: "bank_transfer", isEssential: true, isRecurring: true },
            { clerkId: CLERK_ID, amount: 9000, type: "income", category: "freelance", description: "Side project", date: new Date("2026-06-15"), paymentMethod: "bank_transfer", isEssential: false, isRecurring: false },
            { clerkId: CLERK_ID, amount: 12500, type: "expense", category: "rent", description: "Monthly rent", date: new Date("2026-06-02"), paymentMethod: "bank_transfer", isEssential: true, isRecurring: true },
            { clerkId: CLERK_ID, amount: 500, type: "expense", category: "subscriptions", description: "Netflix", date: new Date("2026-06-05"), paymentMethod: "upi", isEssential: false, isRecurring: true },
            { clerkId: CLERK_ID, amount: 199, type: "expense", category: "subscriptions", description: "Spotify", date: new Date("2026-06-06"), paymentMethod: "upi", isEssential: false, isRecurring: true },
            { clerkId: CLERK_ID, amount: 4300, type: "expense", category: "food", description: "Groceries week 1", date: new Date("2026-06-04"), paymentMethod: "cash", isEssential: true, isRecurring: false },
            { clerkId: CLERK_ID, amount: 3100, type: "expense", category: "food", description: "Groceries week 3", date: new Date("2026-06-19"), paymentMethod: "cash", isEssential: true, isRecurring: false },
            { clerkId: CLERK_ID, amount: 1800, type: "expense", category: "transport", description: "Fuel + cab", date: new Date("2026-06-13"), paymentMethod: "upi", isEssential: true, isRecurring: false },
            { clerkId: CLERK_ID, amount: 8000, type: "expense", category: "other_expense", description: "New headphones", date: new Date("2026-06-20"), paymentMethod: "card", isEssential: false, isRecurring: false },
            { clerkId: CLERK_ID, amount: 2200, type: "expense", category: "shopping", description: "Shoes", date: new Date("2026-06-22"), paymentMethod: "card", isEssential: false, isRecurring: false },
            { clerkId: CLERK_ID, amount: 700, type: "expense", category: "entertainment", description: "Concert tickets", date: new Date("2026-06-25"), paymentMethod: "upi", isEssential: false, isRecurring: false },

            // ===== JULY 2026 (current month — deliberate spike + exceeded budget here) =====
            { clerkId: CLERK_ID, amount: 50000, type: "income", category: "salary", description: "Office salary", date: new Date("2026-07-01"), paymentMethod: "bank_transfer", isEssential: true, isRecurring: true },
            { clerkId: CLERK_ID, amount: 12000, type: "expense", category: "rent", description: "Monthly rent", date: new Date("2026-07-02"), paymentMethod: "bank_transfer", isEssential: true, isRecurring: true },
            { clerkId: CLERK_ID, amount: 500, type: "expense", category: "subscriptions", description: "Netflix", date: new Date("2026-07-05"), paymentMethod: "upi", isEssential: false, isRecurring: true },
            { clerkId: CLERK_ID, amount: 199, type: "expense", category: "subscriptions", description: "Spotify", date: new Date("2026-07-06"), paymentMethod: "upi", isEssential: false, isRecurring: true },
            { clerkId: CLERK_ID, amount: 4200, type: "expense", category: "food", description: "Groceries week 1", date: new Date("2026-07-04"), paymentMethod: "cash", isEssential: true, isRecurring: false },
            { clerkId: CLERK_ID, amount: 1600, type: "expense", category: "transport", description: "Fuel + cab", date: new Date("2026-07-08"), paymentMethod: "upi", isEssential: true, isRecurring: false },
            // Shopping SPIKE: was ~2000-2200 the last two months, now 7500 — should trigger spike detection
            { clerkId: CLERK_ID, amount: 7500, type: "expense", category: "shopping", description: "Festive shopping haul", date: new Date("2026-07-10"), paymentMethod: "card", isEssential: false, isRecurring: false },
            { clerkId: CLERK_ID, amount: 900, type: "expense", category: "entertainment", description: "Weekend outing", date: new Date("2026-07-12"), paymentMethod: "upi", isEssential: false, isRecurring: false },
        ],
    });
    console.log("✅ Transactions seeded");

    // ---------- BUDGETS (for July 2026 — month: 7) ----------
    await prisma.budget.createMany({
        data: [
            { clerkId: CLERK_ID, category: "rent", monthlyLimit: 12000, month: 7, year: 2026 },
            { clerkId: CLERK_ID, category: "food", monthlyLimit: 5000, month: 7, year: 2026 },
            { clerkId: CLERK_ID, category: "transport", monthlyLimit: 2000, month: 7, year: 2026 },
            // Shopping budget deliberately set low so July's ₹7500 spike EXCEEDS it — tests exceededBudgets logic
            { clerkId: CLERK_ID, category: "shopping", monthlyLimit: 3000, month: 7, year: 2026 },
            { clerkId: CLERK_ID, category: "subscriptions", monthlyLimit: 1000, month: 7, year: 2026 },
            { clerkId: CLERK_ID, category: "entertainment", monthlyLimit: 1500, month: 7, year: 2026 },
        ],
    });
    console.log("✅ Budgets seeded");

    // ---------- SAVINGS (Emergency Fund — partial progress) ----------
    await prisma.saving.createMany({
        data: [
            { clerkId: CLERK_ID, amount: 5000, label: "Emergency Fund", date: new Date("2026-05-10") },
            { clerkId: CLERK_ID, amount: 4000, label: "Emergency Fund", date: new Date("2026-06-10") },
            { clerkId: CLERK_ID, amount: 3000, label: "Emergency Fund", date: new Date("2026-07-05") },
        ],
    });
    console.log("✅ Savings seeded (₹12,000 total toward Emergency Fund)");

    console.log("\n🎉 All seed data inserted successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });