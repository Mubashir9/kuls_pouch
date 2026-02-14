import type { Transaction } from '../types';
import { subDays, isWithinInterval, startOfDay, endOfDay, differenceInDays, parseISO } from 'date-fns';

export const calculateTrend = (
    allTransactions: Transaction[],
    type: 'income' | 'expense' | 'savings' | 'count',
    dateRange: { start: string; end: string } | null
): number => {
    const now = new Date();

    // Determine current and previous periods
    let currentStart: Date;
    let currentEnd: Date;
    let previousStart: Date;
    let previousEnd: Date;

    if (dateRange) {
        currentStart = startOfDay(parseISO(dateRange.start));
        currentEnd = endOfDay(parseISO(dateRange.end));

        const duration = differenceInDays(currentEnd, currentStart) + 1;
        previousEnd = endOfDay(subDays(currentStart, 1));
        previousStart = startOfDay(subDays(previousEnd, duration - 1));
    } else {
        // Default to last 30 days vs previous 30 days for "All Time" trend context
        currentEnd = endOfDay(now);
        currentStart = startOfDay(subDays(now, 29));

        previousEnd = endOfDay(subDays(currentStart, 1));
        previousStart = startOfDay(subDays(previousEnd, 29));
    }

    const filterByDate = (txs: Transaction[], start: Date, end: Date) =>
        txs.filter(t => isWithinInterval(new Date(t.date), { start, end }));

    const currentTxs = filterByDate(allTransactions, currentStart, currentEnd);
    const previousTxs = filterByDate(allTransactions, previousStart, previousEnd);

    const calculateTotal = (txs: Transaction[]) => {
        if (type === 'count') return txs.length;
        if (type === 'savings') {
            const income = txs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
            const expense = txs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
            return income - expense;
        }
        return txs
            .filter(t => t.type === type)
            .reduce((acc, t) => acc + t.amount, 0);
    };

    const currentAmount = calculateTotal(currentTxs);
    const previousAmount = calculateTotal(previousTxs);

    if (previousAmount === 0) {
        return currentAmount > 0 ? 100 : 0;
    }

    return ((currentAmount - previousAmount) / Math.abs(previousAmount)) * 100;
};
