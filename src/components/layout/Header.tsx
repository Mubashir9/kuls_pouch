import { ChevronDown, X, Check } from 'lucide-react';
import { DateRangePicker } from '../common/DateRangePicker';
import { useData } from '../../contexts/DataContext';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Link } from 'react-router-dom';

export const Header = () => {
    // const { seedData } = useData(); // Removed unused
    return (
        <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img
                    src="logo.png"
                    alt="Logo"
                    className="w-8 h-8 object-contain"
                />
                <span className="font-bold text-lg tracking-tight text-text-primary">Kul's Pouch</span>
            </Link>

            {/* Center: Global Filters */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-4">
                <DateRangePicker />
                <CategoryFilter />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">

            </div>
        </header >
    );
};

const CategoryFilter = () => {
    const { categories, globalFilter, setGlobalFilter } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCategory = globalFilter.category;

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'bg-surface text-text-secondary hover:bg-secondary/10'
                    }`}
            >
                <span>{selectedCategory || 'All Categories'}</span>
                {selectedCategory ? (
                    <X
                        className="w-3 h-3 hover:text-red-500 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setGlobalFilter({ category: null });
                        }}
                    />
                ) : (
                    <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 right-0 w-56 bg-surface rounded-xl shadow-xl border border-border overflow-hidden z-50 max-h-80 overflow-y-auto"
                    >
                        <div className="p-1">
                            <button
                                onClick={() => {
                                    setGlobalFilter({ category: null });
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-primary/10 text-primary' : 'text-text-primary hover:bg-secondary/10'
                                    }`}
                            >
                                <span>All Categories</span>
                                {!selectedCategory && <Check className="w-3 h-3" />}
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setGlobalFilter({ category: cat.name });
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.name ? 'bg-primary/10 text-primary' : 'text-text-primary hover:bg-secondary/10'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${cat.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                        {cat.name}
                                    </span>
                                    {selectedCategory === cat.name && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
