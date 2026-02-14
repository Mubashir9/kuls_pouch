import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWithinInterval, startOfWeek, endOfWeek, subDays } from 'date-fns';
import { useData } from '../../contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

export const DateRangePicker = () => {
    const { globalFilter, setGlobalFilter } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial logic to handle "All Time" or selected range
    const selectedRange = globalFilter.dateRange;

    // Helper: Generate calendar days
    const getDays = () => {
        const start = startOfWeek(startOfMonth(viewDate));
        const end = endOfWeek(endOfMonth(viewDate));
        return eachDayOfInterval({ start, end });
    };

    const handleDateClick = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');

        if (!selectedRange) {
            setGlobalFilter({ dateRange: { start: dateStr, end: dateStr } });
        } else if (selectedRange.start === selectedRange.end && selectedRange.start !== dateStr) {
            // Second click: determine range
            const start = new Date(selectedRange.start);
            const end = date;
            if (end < start) {
                setGlobalFilter({ dateRange: { start: dateStr, end: selectedRange.start } });
            } else {
                setGlobalFilter({ dateRange: { start: selectedRange.start, end: dateStr } });
            }
            // Close after selecting range? Maybe keep open to let them see selection
        } else {
            // Reset to single selection if range already exists
            setGlobalFilter({ dateRange: { start: dateStr, end: dateStr } });
        }
    };

    const isSelected = (date: Date) => {
        if (!selectedRange) return false;
        const target = format(date, 'yyyy-MM-dd');
        return target === selectedRange.start || target === selectedRange.end;
    };

    const isInRange = (date: Date) => {
        if (!selectedRange || selectedRange.start === selectedRange.end) return false;
        const start = new Date(selectedRange.start);
        const end = new Date(selectedRange.end);
        return isWithinInterval(date, { start, end });
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

    const formatDateRange = () => {
        if (!selectedRange) return 'All Time';
        if (selectedRange.start === selectedRange.end) {
            return format(new Date(selectedRange.start), 'MMM d, yyyy');
        }
        return `${format(new Date(selectedRange.start), 'MMM d')} - ${format(new Date(selectedRange.end), 'MMM d, yyyy')}`;
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedRange
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'bg-surface text-text-secondary hover:bg-secondary/10'
                    }`}
            >
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDateRange()}</span>
                {selectedRange ? (
                    <X
                        className="w-3 h-3 hover:text-red-500 cursor-pointer ml-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            setGlobalFilter({ dateRange: null });
                        }}
                    />
                ) : null}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 left-0 p-4 bg-surface rounded-xl shadow-xl border border-border z-50 w-72"
                    >
                        {/* Header: Month Navigation */}
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={() => setViewDate(subMonths(viewDate, 1))} className="p-1 hover:bg-secondary/10 rounded-full">
                                <ChevronLeft className="w-4 h-4 text-text-secondary" />
                            </button>
                            <span className="font-semibold text-text-primary">
                                {format(viewDate, 'MMMM yyyy')}
                            </span>
                            <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1 hover:bg-secondary/10 rounded-full">
                                <ChevronRight className="w-4 h-4 text-text-secondary" />
                            </button>
                        </div>

                        {/* Presets */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <button
                                onClick={() => {
                                    setGlobalFilter({ dateRange: null });
                                    setIsOpen(false);
                                }}
                                className="px-2 py-1 text-xs rounded-lg bg-secondary/10 text-text-secondary hover:bg-secondary/20"
                            >
                                All Time
                            </button>
                            <button
                                onClick={() => {
                                    const end = new Date();
                                    const start = subDays(end, 30);
                                    setGlobalFilter({
                                        dateRange: {
                                            start: format(start, 'yyyy-MM-dd'),
                                            end: format(end, 'yyyy-MM-dd')
                                        }
                                    });
                                    setIsOpen(false);
                                }}
                                className="px-2 py-1 text-xs rounded-lg bg-secondary/10 text-text-secondary hover:bg-secondary/20"
                            >
                                Last 30 Days
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
                                const inRange = isInRange(date);

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleDateClick(date)}
                                        disabled={!isCurrentMonth}
                                        className={`
                                            h-8 w-8 text-xs rounded-full flex items-center justify-center transition-all relative
                                            ${!isCurrentMonth ? 'invisible' : ''}
                                            ${selected ? 'bg-primary text-white font-bold z-10' : ''}
                                            ${inRange ? 'bg-primary/20 text-primary dark:bg-primary/30 rounded-none first:rounded-l-full last:rounded-r-full' : ''}
                                            ${!selected && !inRange ? 'hover:bg-secondary/20 text-text-primary' : ''}
                                        `}
                                    >
                                        {format(date, 'd')}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
