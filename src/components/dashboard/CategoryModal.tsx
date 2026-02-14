import { useState } from 'react';
import { Modal } from '../common/Modal';
import { useData } from '../../contexts/DataContext';
import type { TransactionType } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORY_COLORS = [
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#D946EF', // Fuchsia
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#14B8A6', // Teal
    '#84CC16', // Lime
    '#A89F91', // Secondary/Beige
];

export const CategoryModal = ({ isOpen, onClose }: CategoryModalProps) => {
    const { categories, addCategory, deleteCategory } = useData();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryType, setNewCategoryType] = useState<TransactionType>('expense');
    const [isAdding, setIsAdding] = useState(false);

    // Filter categories by type for display
    const incomeCategories = categories.filter(c => c.type === 'income');
    const expenseCategories = categories.filter(c => c.type === 'expense');

    const handleAdd = async () => {
        if (!newCategoryName.trim()) return;

        // Pick a random color from the palette
        const randomColor = CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)];

        await addCategory({
            name: newCategoryName,
            type: newCategoryType,
            color: randomColor,
            icon: 'tag'
        });

        setNewCategoryName('');
        setIsAdding(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this category? Transactions using it will keep the category name but lose the reference.')) {
            await deleteCategory(id);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories">
            <div className="space-y-6">

                {/* Add New Category Section */}
                <div className="bg-secondary/10 p-4 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-text-primary">Add New Category</h3>
                        {!isAdding && (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="text-xs flex items-center gap-1 text-primary hover:underline"
                            >
                                <Plus className="w-3 h-3" /> Add
                            </button>
                        )}
                    </div>

                    {isAdding && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                            <div className="flex gap-2">
                                <select
                                    value={newCategoryType}
                                    onChange={(e) => setNewCategoryType(e.target.value as TransactionType)}
                                    className="bg-background border border-border rounded-lg text-sm px-2 py-1.5 focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Category Name"
                                    className="flex-1 bg-background border border-border rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-primary/20 outline-none"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="px-3 py-1.5 text-xs text-text-secondary hover:bg-secondary/20 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdd}
                                    disabled={!newCategoryName.trim()}
                                    className="px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:brightness-110 transition disabled:opacity-50"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Categories Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Income */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase text-text-secondary mb-3">Income Categories</h4>
                        <div className="space-y-2">
                            {incomeCategories.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/10 transition group">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                        <span className="text-sm text-text-primary">{cat.name}</span>
                                    </div>
                                    {!cat.isDefault && (
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expenses */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase text-text-secondary mb-3">Expense Categories</h4>
                        <div className="space-y-2 h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {expenseCategories.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/10 transition group">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                        <span className="text-sm text-text-primary">{cat.name}</span>
                                    </div>
                                    {!cat.isDefault && (
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
