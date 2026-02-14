import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import type { Transaction } from '../../types';
import { format, subDays, isSameDay } from 'date-fns';

interface SpendingChartProps {
    transactions: Transaction[];
}

export const SpendingChart = ({ transactions }: SpendingChartProps) => {

    // Aggregate data for the last 7 days
    const data = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dayTransactions = transactions.filter(t =>
            t.type === 'expense' && isSameDay(new Date(t.date), date)
        );
        const amount = dayTransactions.reduce((acc, t) => acc + t.amount, 0);
        return {
            name: format(date, 'EEE'), // Mon, Tue, etc.
            fullDate: format(date, 'MMM d'),
            amount: amount
        };
    });

    return (
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm h-96">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-text-primary">Spending Over Time</h3>
                <select className="bg-transparent border-none rounded-lg text-sm px-3 py-1 focus:ring-1 focus:ring-primary outline-none text-text-primary cursor-pointer hover:bg-secondary/5 transition-colors">
                    <option>This Week</option>
                    <option>Last Week</option>
                    <option>This Month</option>
                </select>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '8px',
                                border: '1px solid #E7E5E4',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: '#1F2937' }}
                            labelStyle={{ color: '#6B7280', marginBottom: '4px' }}
                            formatter={(value: any) => [`$${value}`, 'Spent'] as [string, string]}
                            labelFormatter={(label, payload) => {
                                if (payload && payload.length > 0) {
                                    return payload[0].payload.fullDate;
                                }
                                return label;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
