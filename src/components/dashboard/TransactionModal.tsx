import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useData } from '../../contexts/DataContext';
import type { Transaction, TransactionType } from '../../types';
import { Plus, Minus, Calendar, Tag, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { CategoryModal } from './CategoryModal';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction?: Transaction | null; // If provided, we are editing
}

export const TransactionModal = ({ isOpen, onClose, transaction }: TransactionModalProps) => {
    const { addTransaction, updateTransaction, categories } = useData();

    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Reset or populate form when opening/changing transaction
    useEffect(() => {
        if (isOpen) {
            if (transaction) {
                setType(transaction.type);
                setAmount(transaction.amount.toString());
                setDate(transaction.date);
                setCategory(transaction.category);
                setDescription(transaction.description);
            } else {
                // Defaults for new transaction
                setType('expense');
                setAmount('');
                setDate(format(new Date(), 'yyyy-MM-dd'));
                setCategory('');
                setDescription('');
            }
            setError('');
        }
    }, [isOpen, transaction]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category || !date) {
            setError('Please fill in all required fields.');
            return;
        }

        const txData: Omit<Transaction, 'id'> = {
            type,
            amount: parseFloat(amount),
            date,
            category,
            description,
            status: 'completed'
        };

        try {
            if (transaction) {
                await updateTransaction(transaction.id, { ...transaction, ...txData });
            } else {
                await addTransaction(txData);
            }
            onClose();
        } catch (err) {
            console.error("Failed to save transaction", err);
            setError('Failed to save transaction.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={transaction ? 'Edit Transaction' : 'Add Transaction'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                        {error}
                    </div>
                )}

                {/* Type Selection */}
                <div className="flex gap-2 p-1 bg-secondary/10 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${type === 'expense'
                            ? 'bg-surface shadow-sm text-red-600 dark:text-red-400'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <Minus className="w-4 h-4" /> Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${type === 'income'
                            ? 'bg-surface shadow-sm text-green-600 dark:text-green-400'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <Plus className="w-4 h-4" /> Income
                    </button>
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-7 pr-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                {/* Date & Category Group */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-text-secondary">Category</label>
                            <button
                                type="button"
                                onClick={() => setIsCategoryModalOpen(true)}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <Tag className="w-3 h-3" /> Manage
                            </button>
                        </div>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                                required
                            >
                                <option value="" disabled>Select</option>
                                {categories
                                    .filter(cat => cat.type === type)
                                    .map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-text-secondary" />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none h-24"
                            placeholder="What was this for?"
                        />
                    </div>
                </div>

                {/* Use reusable button component logic here later. For now generic button */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-secondary/20 text-text-primary rounded-xl font-medium hover:bg-secondary/30 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-2.5 bg-primary text-white rounded-xl font-medium hover:brightness-110 transition-all shadow-lg shadow-primary/25"
                    >
                        {transaction ? 'Save Changes' : 'Add Transaction'}
                    </button>
                </div>
            </form>

            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />
        </Modal>
    );
};
