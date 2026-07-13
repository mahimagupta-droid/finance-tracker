import prisma from "@/lib/prisma";
async function main() {
  const shouldDelete = process.argv.includes("--delete");

  const users = await prisma.user.findMany({ select: { clerkId: true } });
  const validClerkIds = users.map((u) => u.clerkId);

  const orphanTransactions = await prisma.transaction.findMany({
    where: { clerkId: { notIn: validClerkIds } },
  });
  const orphanBudgets = await prisma.budget.findMany({
    where: { clerkId: { notIn: validClerkIds } },
  });
  const orphanSavings = await prisma.saving.findMany({
    where: { clerkId: { notIn: validClerkIds } },
  });

  console.log(`Orphaned transactions: ${orphanTransactions.length}`);
  console.log(`Orphaned budgets: ${orphanBudgets.length}`);
  console.log(`Orphaned savings: ${orphanSavings.length}`);

  if (!shouldDelete) {
    console.log("\nRun again with --delete to remove these rows.");
    return;
  }

  const [t, b, s] = await Promise.all([
    prisma.transaction.deleteMany({ where: { clerkId: { notIn: validClerkIds } } }),
    prisma.budget.deleteMany({ where: { clerkId: { notIn: validClerkIds } } }),
    prisma.saving.deleteMany({ where: { clerkId: { notIn: validClerkIds } } }),
  ]);

  console.log(`\nDeleted ${t.count} transactions, ${b.count} budgets, ${s.count} savings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
