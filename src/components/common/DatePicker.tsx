import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
    value: string; // ISO format yyyy-MM-dd
    onChange: (date: string) => void;
    label?: string;
    placeholder?: string;
}

export const DatePicker = ({ value, onChange, label, placeholder = 'Select date' }: DatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedDate = value ? new Date(value) : null;

    // Helper: Generate calendar days
    const getDays = () => {
        const start = startOfWeek(startOfMonth(viewDate));
        const end = endOfWeek(endOfMonth(viewDate));
        return eachDayOfInterval({ start, end });
    };

    const handleDateClick = (date: Date) => {
        onChange(format(date, 'yyyy-MM-dd'));
        setIsOpen(false);
    };

    const isSelected = (date: Date) => {
        return selectedDate ? isSameDay(date, selectedDate) : false;
    };

    const isToday = (date: Date) => {
        return isSameDay(date, new Date());
    };

    // Outside click handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update view date when value changes externally (e.g. when opening modal for existing tx)
    useEffect(() => {
        if (value) {
            setViewDate(new Date(value));
        }
    }, [value]);

    return (
        <div className="relative" ref={containerRef}>
            {label && <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
            <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                <input
                    type="text"
                    readOnly
                    value={value ? format(selectedDate!, 'dd/MM/yyyy') : ''}
                    onClick={() => setIsOpen(!isOpen)}
                    placeholder={placeholder}
                    className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer text-text-primary"
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 left-0 p-4 bg-surface rounded-xl shadow-xl border border-border z-[60] w-72"
                    >
                        {/* Header: Month Navigation */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={() => setViewDate(subMonths(viewDate, 1))}
                                className="p-1.5 hover:bg-secondary/10 rounded-full transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 text-text-secondary" />
                            </button>
                            <span className="font-semibold text-text-primary">
                                {format(viewDate, 'MMMM yyyy')}
                            </span>
                            <button
                                type="button"
                                onClick={() => setViewDate(addMonths(viewDate, 1))}
                                className="p-1.5 hover:bg-secondary/10 rounded-full transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 text-text-secondary" />
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-1">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="text-xs font-medium text-text-secondary py-1">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {getDays().map((date, i) => {
                                const isCurrentMonth = isSameMonth(date, viewDate);
                                const selected = isSelected(date);
                                const today = isToday(date);

                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleDateClick(date)}
                                        className={`
                                            h-8 w-8 text-xs rounded-full flex items-center justify-center transition-all relative
                                            ${!isCurrentMonth ? 'text-text-secondary/30' : 'text-text-primary'}
                                            ${selected ? 'bg-primary text-white font-bold' : today ? 'bg-secondary/10 text-primary border border-primary/30' : 'hover:bg-secondary/10'}
                                        `}
                                    >
                                        {format(date, 'd')}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer: Today/Clear */}
                        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => handleDateClick(new Date())}
                                className="text-xs font-medium text-primary hover:underline px-2 py-1"
                            >
                                Today
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(format(new Date(), 'yyyy-MM-dd')); // Or empty if allowed, but TransactionModal usually needs a date
                                    setIsOpen(false);
                                }}
                                className="text-xs font-medium text-text-secondary hover:bg-secondary/10 px-2 py-1 rounded-lg transition-colors border border-border"
                            >
                                Clear
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
