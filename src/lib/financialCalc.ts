export function emergencyFundTarget(monthlyExpenses: number, persona: string) {
    const multiplier = {
        student: 3,
        professional: 6,
        freelancer: 9,
    }[persona] ?? 6;
    // console.log(multiplier * monthlyExpenses, multiplier, monthlyExpenses)
    return multiplier * monthlyExpenses;
}

export const compoundInterest = (P: number, rate: number, n: number, t: number) => {
    const r = rate / 100;
    return P * (1 + r / n) ** (n * t);
}

export const sipFutureValue = (monthlyPMT: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 100 / 12;
    const n = years * 12;
    return monthlyPMT * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
}

export const monthlySavingsPotential = (income: number, expenses: number) => {
    return Math.max(0, income - expenses);
}

export const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-In", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}