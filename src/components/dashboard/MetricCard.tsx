import { motion, useSpring, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useState, useEffect } from 'react';

interface MetricCardProps {
    label: string;
    amount: number;
    icon: LucideIcon;
    trend?: number; // Percentage change
    color: 'primary' | 'income' | 'expense' | 'secondary';
    delay?: number;
    isCurrency?: boolean;
    onClick?: () => void;
    className?: string;
}

export const MetricCard = ({ label, amount, icon: Icon, trend, color, delay = 0, isCurrency = true, onClick, className = '' }: MetricCardProps) => {
    const springValue = useSpring(0, { duration: 1000, bounce: 0 });
    const displayValue = useTransform(springValue, (value) =>
        isCurrency ? formatCurrency(value) : Math.round(value).toString()
    );
    const [formattedValue, setFormattedValue] = useState(isCurrency ? formatCurrency(0) : '0');

    useEffect(() => {
        springValue.set(amount);
        const unsubscribe = displayValue.on("change", (latest) => {
            setFormattedValue(latest);
        });
        return () => unsubscribe();
    }, [amount, springValue, displayValue]);

    const colorMap = {
        primary: 'bg-primary/15 text-primary',
        income: 'bg-income/15 text-income',
        expense: 'bg-expense/15 text-expense',
        secondary: 'bg-secondary/15 text-secondary',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: delay, duration: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={onClick}
            className={`bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-income/15 text-income' : 'bg-red-100 text-red-600'}`}>
                        {trend >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {Math.abs(trend).toFixed(1)}%
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-sm font-medium text-text-secondary mb-1">{label}</h3>
                <span className="text-3xl font-bold text-text-primary tracking-tight">
                    {formattedValue}
                </span>
            </div>
        </motion.div>
    );
};
