import { Modal } from '../common/Modal';
import type { Transaction } from '../../types';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatters';
import { Edit2, Trash2, Calendar, Tag, FileText } from 'lucide-react';

interface TransactionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
}

export const TransactionDetailModal = ({ isOpen, onClose, transaction, onEdit, onDelete }: TransactionDetailModalProps) => {
    if (!transaction) return null;

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            onDelete(transaction.id);
            onClose();
        }
    };

    const handleEdit = () => {
        onEdit(transaction);
        onClose();
    };

    const isIncome = transaction.type === 'income';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Transaction Details"
        >
            <div className="space-y-6">
                {/* Header Section with Amount */}
                <div className="text-center py-4 bg-secondary/10 rounded-xl">
                    <p className="text-sm text-text-secondary mb-1 uppercase tracking-wide font-medium">
                        {transaction.type}
                    </p>
                    <div className={`text-4xl font-bold tracking-tight ${isIncome ? 'text-income' : 'text-text-primary'}`}>
                        {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
                    </div>
                </div>

                {/* Details List */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 hover:bg-secondary/10 rounded-lg transition-colors">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary font-medium">Date</p>
                            <p className="text-text-primary">{format(new Date(transaction.date), 'MMMM d, yyyy')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 hover:bg-secondary/10 rounded-lg transition-colors">
                        <div className="p-2 bg-secondary/20 text-text-secondary rounded-lg">
                            <Tag className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary font-medium">Category</p>
                            <p className="text-text-primary font-medium">{transaction.category}</p>
                        </div>
                    </div>

                    {transaction.description && (
                        <div className="flex items-center gap-3 p-3 hover:bg-secondary/10 rounded-lg transition-colors">
                            <div className="p-2 bg-secondary/20 text-text-secondary rounded-lg">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs text-text-secondary font-medium">Description</p>
                                <p className="text-text-primary">{transaction.description}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                        onClick={handleDelete}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                    <button
                        onClick={handleEdit}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl font-medium hover:brightness-110 transition-all shadow-lg shadow-primary/25"
                    >
                        <Edit2 className="w-4 h-4" /> Edit
                    </button>
                </div>
            </div>
        </Modal>
    );
};
