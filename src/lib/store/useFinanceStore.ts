import { create } from 'zustand'

interface Transaction {
    id: string;
    amount: number;
    type: string;
    category: string;
    description: string;
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
    fetchInsights: (force?: boolean) => Promise<void>;
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
}));