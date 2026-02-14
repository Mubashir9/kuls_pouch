import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import type { Transaction } from '../../types';
import { useData } from '../../contexts/DataContext';

interface CategoryChartProps {
    transactions: Transaction[];
}

export const CategoryChart = ({ transactions }: CategoryChartProps) => {
    const { categories } = useData();

    // Aggregate expenses by category
    const categoryTotals = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    const data = Object.entries(categoryTotals)
        .map(([name, value]) => {
            const category = categories.find(c => c.name === name);
            return {
                name,
                value,
                color: category?.color || '#94A3B8' // Default gray if category not found
            };
        })
        .sort((a, b) => b.value - a.value); // Sort by highest spend

    const totalExpense = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm h-96">
            <h3 className="text-lg font-bold text-text-primary mb-6">By Category</h3>

            <div className="h-72 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={75}
                            outerRadius={95}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            animationBegin={200}
                            animationDuration={1000}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '8px',
                                border: '1px solid #E7E5E4',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            formatter={(value: any) => [`$${value}`, 'Spent'] as [string, string]}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-sm text-text-secondary ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                    <span className="text-2xl font-bold text-text-primary">${totalExpense.toLocaleString()}</span>
                    <span className="text-xs text-text-secondary uppercase tracking-wider">Total</span>
                </div>
            </div>
        </div>
    );
};
