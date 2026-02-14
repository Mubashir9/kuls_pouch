import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Transaction, Category, Settings, DataContextType, GlobalFilters } from '../types';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [settings, setSettings] = useState<Settings>({
        theme: 'system',
        currency: 'USD',
        dateFormat: 'MM/dd/yyyy',
    });
    const [globalFilter, setGlobalFilterState] = useState<GlobalFilters>({
        dateRange: null,
        category: null
    });
    const [loading, setLoading] = useState(true);

    const setGlobalFilter = (filter: Partial<GlobalFilters>) => {
        setGlobalFilterState(prev => ({ ...prev, ...filter }));
    };

    // Derived state
    const filteredTransactions = transactions.filter(t => {
        if (globalFilter.category && t.category !== globalFilter.category) return false;
        if (globalFilter.dateRange) {
            const txDate = new Date(t.date);
            // Create interval from start of start date to end of end date
            const interval = {
                start: startOfDay(new Date(globalFilter.dateRange.start)),
                end: endOfDay(new Date(globalFilter.dateRange.end))
            };
            if (!isWithinInterval(txDate, interval)) return false;
        }
        return true;
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            // Ensure window.api exists (we might mock it in browser dev if needed)
            if (window.api) {
                const txData = await window.api.getTransactions();
                const catData = await window.api.getCategories();
                const setData = await window.api.getSettings();

                setTransactions(txData.transactions || []);
                setCategories(catData.categories || []);
                setSettings(setData || {});
            } else {
                console.warn('Electron API not found (running in browser?)');
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
        const newTx = { ...tx, id: crypto.randomUUID() };
        const updated = [newTx, ...transactions];
        setTransactions(updated);
        if (window.api) {
            await window.api.saveTransactions({ transactions: updated });
        }
    };

    const updateTransaction = async (id: string, tx: Partial<Transaction>) => {
        const updated = transactions.map(t => (t.id === id ? { ...t, ...tx } : t));
        setTransactions(updated);
        if (window.api) {
            await window.api.saveTransactions({ transactions: updated });
        }
    };


    const deleteTransaction = async (id: string) => {
        const updated = transactions.filter(t => t.id !== id);
        setTransactions(updated);
        if (window.api) {
            await window.api.saveTransactions({ transactions: updated });
        }
    };

    const addCategory = async (cat: Omit<Category, 'id'>) => {
        const newCat = { ...cat, id: crypto.randomUUID(), isDefault: false };
        const updated = [...categories, newCat];
        setCategories(updated);
        if (window.api) {
            await window.api.saveCategories({ categories: updated });
        }
    };

    const deleteCategory = async (id: string) => {
        const updated = categories.filter(c => c.id !== id);
        setCategories(updated);
        if (window.api) {
            await window.api.saveCategories({ categories: updated });
        }
    };

    const seedData = async () => {
        const mockCategories: Category[] = [
            { id: crypto.randomUUID(), name: 'Salary', type: 'income', color: '#22c55e', icon: 'Wallet', isDefault: true },
            { id: crypto.randomUUID(), name: 'Freelance', type: 'income', color: '#3b82f6', icon: 'Briefcase', isDefault: true },
            { id: crypto.randomUUID(), name: 'Food', type: 'expense', color: '#ef4444', icon: 'Utensils', isDefault: true },
            { id: crypto.randomUUID(), name: 'Rent', type: 'expense', color: '#f97316', icon: 'Home', isDefault: true },
            { id: crypto.randomUUID(), name: 'Transport', type: 'expense', color: '#a855f7', icon: 'Car', isDefault: true },
            { id: crypto.randomUUID(), name: 'Entertainment', type: 'expense', color: '#ec4899', icon: 'Film', isDefault: true },
            { id: crypto.randomUUID(), name: 'Utilities', type: 'expense', color: '#06b6d4', icon: 'Zap', isDefault: true },
        ];

        const mockTransactions: Transaction[] = [];
        const today = new Date();

        // Generate last 60 days of data (to support trend calculation)
        for (let i = 0; i < 60; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Randomly add transactions
            if (Math.random() > 0.7) {
                // Income
                mockTransactions.push({
                    id: crypto.randomUUID(),
                    date: dateStr,
                    amount: Math.floor(Math.random() * 1000) + 500,
                    type: 'income',
                    category: Math.random() > 0.5 ? 'Salary' : 'Freelance',
                    description: 'Income payment',
                    status: 'completed'
                });
            }

            // Expenses (more frequent)
            if (Math.random() > 0.3) {
                mockTransactions.push({
                    id: crypto.randomUUID(),
                    date: dateStr,
                    amount: Math.floor(Math.random() * 100) + 10,
                    type: 'expense',
                    category: ['Food', 'Transport', 'Entertainment'][Math.floor(Math.random() * 3)],
                    description: 'Daily expense',
                    status: 'completed'
                });
            }
            if (Math.random() > 0.9) {
                mockTransactions.push({
                    id: crypto.randomUUID(),
                    date: dateStr,
                    amount: Math.floor(Math.random() * 200) + 100,
                    type: 'expense',
                    category: 'Utilities',
                    description: 'Bill payment',
                    status: 'completed'
                });
            }
        }

        setCategories(mockCategories);
        setTransactions(mockTransactions);

        if (window.api) {
            await window.api.saveCategories({ categories: mockCategories });
            await window.api.saveTransactions({ transactions: mockTransactions });
        }
    };

    return (
        <DataContext.Provider
            value={{
                transactions,
                categories,
                settings,
                loading,
                refreshData: fetchData,
                addTransaction,
                updateTransaction,
                deleteTransaction,
                addCategory,
                deleteCategory,
                globalFilter,
                setGlobalFilter,
                filteredTransactions,
                seedData
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
