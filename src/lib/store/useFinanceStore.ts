import { create } from 'zustand'

interface Transaction {
    id: string;
    amount: number;
    type: string;
    category: string;
    description?: string | null;
    date: string;
    paymentMethod?: string;
    isEssential: boolean;
    isRecurring: boolean;
}

interface Budget {
    id: string;
    category: string;
    monthlyLimit: number;
    spent: number;
    month: number;
    year: number;
}

interface Insight {
    type: string;
    title: string;
    description: string;
    priority: string;
}

interface FinanceStore {
    transactions: Transaction[];
    budgets: Budget[];
    loading: boolean;
    transactionsError: string | null;
    budgetsError: string | null;
    fetchTransactions: () => Promise<void>;
    fetchBudgets: () => Promise<void>;
    aiInsights: Insight[];
    insightsLoading: boolean;
    insightsFetched: boolean;
    insightsError: string | null;
    userPersona: string | null;
    totalSavings: number;
    savingsLoading: boolean;
    fetchTotalSavings: (label: string) => Promise<void>;
    fetchUserPersona: () => Promise<void>;
    fetchInsights: (force?: boolean) => Promise<void>;
    growthPlan: { category: string; amount: number; reason: string }[];
    growthPlanLoading: boolean;
    growthPlanFetched: boolean;
    growthPlanError: string | null;
    fetchGrowthPlan: (force?: boolean) => Promise<void>;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
    transactions: [],
    budgets: [],
    loading: true,
    transactionsError: null,
    budgetsError: null,
    aiInsights: [],
    insightsLoading: false,
    insightsFetched: false,
    insightsError: null,
    userPersona: null,
    totalSavings: 0,
    savingsLoading: false,
    growthPlan: [],
    growthPlanLoading: false,
    growthPlanFetched: false,
    growthPlanError: null,
    fetchTransactions: async () => {
        set({ loading: true, transactionsError: null });
        try {
            const response = await fetch("/api/transactions");
            if (!response.ok) {
                throw new Error(`Failed to fetch transactions (${response.status})`);
            }
            const data = await response.json();
            if (data.success && data.transactions) {
                set({ transactions: data.transactions });
            } else {
                throw new Error("Unexpected response while fetching transactions.");
            }
        } catch (error: any) {
            set({ transactionsError: error.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchBudgets: async () => {
        set({ budgetsError: null });
        try {
            const response = await fetch("/api/budgets");
            if (!response.ok) {
                throw new Error(`Failed to fetch budgets (${response.status})`);
            }
            const budgetsData = await response.json();
            set({ budgets: budgetsData });
        } catch (error: any) {
            set({ budgetsError: error.message });
        }
    },

    fetchInsights: async (force = false) => {
        const { insightsFetched } = get();
        if (insightsFetched && !force) return;
        set({ insightsLoading: true, insightsError: null });
        try {
            const response = await fetch("/api/ai/insights");
            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.error || `Failed to fetch insights (${response.status})`);
            }
            const data = await response.json();
            set({ aiInsights: data.insights, insightsFetched: true, insightsError: null });
        } catch (error: any) {
            set({
                insightsError: error.message,
                insightsFetched: true,
            });
        } finally {
            set({ insightsLoading: false });
        }
    },

    fetchTotalSavings: async (label: string) => {
        set({ savingsLoading: true })
        try {
            const response = await fetch(`/api/savings?label=${encodeURIComponent(label)}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch total savings for label ${label} (${response.status})`);
            }
            const data = await response.json();
            set({ totalSavings: data.totalSavings ?? 0 });
        } catch (error: any) {
            set({ totalSavings: 0 });
            // console.error(error.message);
        } finally {
            set({ savingsLoading: false });
        }
    },

    fetchUserPersona: async () => {
        try {
            const response = await fetch("/api/user-profile");
            if (response.ok) {
                const data = await response.json();
                const persona = data.user.persona;
                set({ userPersona: persona })
            } else {
                throw new Error(`Failed to fetch user profile (${response.status})`);
            }
        } catch (error: any) {
            set({ userPersona: null })
            // console.error(error.message)
        }
    },

    fetchGrowthPlan: async (force = false) => {
        const { growthPlanFetched } = get();
        if (growthPlanFetched && !force) return;
        try {
            set({ growthPlanLoading: true })
            const response = await fetch("/api/ai/growth-plan");
            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.error || `Failed to fetch growth plan (${response.status})`);
            }
            const data = await response.json();
            set({ growthPlan: data.allocations, growthPlanFetched: true, growthPlanError: null });
        } catch (error: any) {
            set({ growthPlanError: error.message, growthPlanFetched: true, growthPlan: [] });
        } finally {
            set({ growthPlanLoading: false });
        }
    }
}));