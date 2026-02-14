import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import type { Transaction } from '../../types';
import { Search, Filter, Edit2, Trash2, ArrowUpDown, Plus, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { TransactionModal } from './TransactionModal';
import { TransactionDetailModal } from './TransactionDetailModal';
import { formatCurrency } from '../../utils/formatters';

export const AllTransactions = () => {
    const { filteredTransactions: globalFilteredTransactions, deleteTransaction } = useData();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    // Modal State
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const filteredTransactions = useMemo(() => {
        return globalFilteredTransactions
            .filter(t => {
                const matchesSearch =
                    t.description.toLowerCase().includes(search.toLowerCase()) ||
                    t.category.toLowerCase().includes(search.toLowerCase());
                const matchesType = filterType === 'all' || t.type === filterType;
                return matchesSearch && matchesType;
            })
            .sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            });
    }, [globalFilteredTransactions, search, filterType, sortOrder]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            await deleteTransaction(id);
        }
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleRowClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDetailModalOpen(true);
    };

    const handleAdd = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Transactions</h1>
                    <p className="text-text-secondary text-sm">Manage your income and expenses.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:brightness-110 transition-all shadow-lg shadow-primary/25 w-full md:w-auto justify-center"
                >
                    <Plus className="w-4 h-4" /> Add Transaction
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-surface border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="appearance-none pl-9 pr-8 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none" />
                    </div>

                    <button
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="px-3 py-2 bg-background border border-border rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                        <ArrowUpDown className="w-3.5 h-3.5 text-text-secondary" />
                        <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
                    </button>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-transparent text-text-secondary font-medium uppercase text-xs border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                                        No transactions found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((t) => (
                                    <tr
                                        key={t.id}
                                        onClick={() => handleRowClick(t)}
                                        className="hover:bg-secondary/10 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                                            {format(new Date(t.date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-text-primary">{t.description || 'No description'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-text-secondary border border-border">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 font-medium ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-text-primary'}`}>
                                            {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(t);
                                                    }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(t.id);
                                                    }}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={editingTransaction}
            />

            <TransactionDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                transaction={selectedTransaction}
                onDelete={deleteTransaction}
                onEdit={(t) => {
                    handleEdit(t);
                    setIsDetailModalOpen(false);
                }}
            />
        </div>
    );
};
