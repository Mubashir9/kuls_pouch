import { useState } from 'react';
import { motion } from 'framer-motion';
import { MetricCard } from './MetricCard';
import { SpendingChart } from './SpendingChart';
import { CategoryChart } from './CategoryChart';
import { TrendingUp, TrendingDown, PiggyBank, Receipt, Plus, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { TransactionDetailModal } from './TransactionDetailModal';
import { TransactionModal } from './TransactionModal';
import { calculateTrend } from '../../utils/analytics';
import { format } from 'date-fns';
import type { Transaction } from '../../types';

export const Dashboard = () => {
    const { filteredTransactions, transactions, globalFilter, deleteTransaction } = useData();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const recentTransactions = filteredTransactions.slice(0, 5);

    const incomeTrend = calculateTrend(transactions, 'income', globalFilter.dateRange);
    const expenseTrend = calculateTrend(transactions, 'expense', globalFilter.dateRange);
    const savingsTrend = calculateTrend(transactions, 'savings', globalFilter.dateRange);
    const countTrend = calculateTrend(transactions, 'count', globalFilter.dateRange);

    const metrics = [
        {
            label: 'Total Income',
            amount: filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
            icon: TrendingUp,
            trend: incomeTrend,
            color: 'income' as const,
            delay: 0.1
        },
        {
            label: 'Total Expenses',
            amount: filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
            icon: TrendingDown,
            trend: expenseTrend,
            color: 'expense' as const,
            delay: 0.2
        },
        {
            label: 'Net Savings',
            amount: filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0) - filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
            icon: PiggyBank,
            trend: savingsTrend,
            color: 'primary' as const,
            delay: 0.3
        },
        {
            label: 'Transactions',
            amount: filteredTransactions.length,
            icon: Receipt,
            trend: countTrend,
            color: 'secondary' as const,
            delay: 0.4,
            isCurrency: false,
            onClick: () => navigate('/transactions')
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex justify-between items-center">
                <motion.h1 variants={itemVariants} className="text-2xl font-bold text-text-primary">Dashboard</motion.h1>
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setSelectedTransaction(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:brightness-110 transition-all shadow-lg shadow-primary/25"
                >
                    <Plus className="w-4 h-4" /> Add Transaction
                </motion.button>
            </div>

            {/* Metrics Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric) => (
                    <MetricCard
                        key={metric.label}
                        {...metric}
                    />
                ))}
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SpendingChart transactions={filteredTransactions} />
                </div>
                <div>
                    <CategoryChart transactions={filteredTransactions} />
                </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div variants={itemVariants} className="bg-surface border border-border rounded-xl p-6 shadow-sm min-h-[300px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-text-primary">Recent Transactions</h3>
                    <Link to="/transactions" className="text-primary text-sm font-medium hover:underline">View All</Link>
                </div>

                {recentTransactions.length === 0 ? (
                    <div className="text-center text-text-secondary py-10">
                        No transactions yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentTransactions.map((t) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.01, x: 4 }}
                                onClick={() => {
                                    setSelectedTransaction(t);
                                    setIsDetailModalOpen(true);
                                }}
                                className="flex items-center justify-between p-4 bg-background rounded-xl hover:bg-secondary/10 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-income/15 text-income' : 'bg-expense/15 text-expense'}`}>
                                        {t.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-primary">{t.description || t.category}</p>
                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(t.date), 'MMM d, yyyy')}</span>
                                            <span>•</span>
                                            <span>{t.category}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`font-bold ${t.type === 'income' ? 'text-income' : 'text-text-primary'}`}>
                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={selectedTransaction} // Reuse this state if we want to support editing from here
            />

            <TransactionDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                transaction={selectedTransaction}
                onDelete={deleteTransaction}
                onEdit={(t) => {
                    setSelectedTransaction(t);
                    setIsDetailModalOpen(false);
                    setIsModalOpen(true);
                }}
            />

        </motion.div>
    );
};
