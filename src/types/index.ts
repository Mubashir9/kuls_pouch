export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    date: string; // ISO string
    amount: number;
    type: TransactionType;
    category: string;
    description: string;
    status: 'completed' | 'pending';
    notes?: string;
}

export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
    type: TransactionType;
    isDefault?: boolean;
}

export interface Settings {
    theme: 'light' | 'dark' | 'system';
    currency: string;
    dateFormat: string;
}

export interface GlobalFilters {
    dateRange: { start: string; end: string } | null;
    category: string | null; // Category Name
}

export interface DataContextType {
    transactions: Transaction[];
    categories: Category[];
    settings: Settings;
    loading: boolean;
    refreshData: () => Promise<void>;
    addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
    updateTransaction: (id: string, tx: Partial<Transaction>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    addCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    globalFilter: GlobalFilters;
    setGlobalFilter: (filter: Partial<GlobalFilters>) => void;
    filteredTransactions: Transaction[];
    seedData: () => Promise<void>;
}
