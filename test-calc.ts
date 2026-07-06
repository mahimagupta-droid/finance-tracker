import { emergencyFundTarget, compoundInterest, sipFutureValue, monthlySavingsPotential, formatINR } from "@/lib/financialCalc";

console.log("testing emergency fund function")
console.log(emergencyFundTarget(15000, "student"));
console.log(emergencyFundTarget(15000, "professional"));
console.log(emergencyFundTarget(15000, "freelancer"));
console.log(emergencyFundTarget(15000, "other"));
console.log("testing compound interest function");
console.log(compoundInterest(10000, 0.05, 1, 10));
console.log("testing sip future value function");
console.log(sipFutureValue(10000, 0.05, 10));
console.log("testing monthly savings potential function");
console.log(monthlySavingsPotential(10000, 3000));
console.log(formatINR(1000000));