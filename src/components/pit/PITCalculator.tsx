import React, { useState, useMemo } from 'react';
import { PIT_BRACKETS_2025, PIT_BRACKETS_2026, PERSONAL_DEDUCTION_2025, PERSONAL_DEDUCTION_2026, DEPENDENT_DEDUCTION_2025, DEPENDENT_DEDUCTION_2026 } from '../../constants';
import { PITBracket } from '../../types';

const calculateProgressiveTax = (taxableIncome: number, brackets: PITBracket[]): number => {
    if (taxableIncome <= 0) return 0;
    let tax = 0;
    let previousLimit = 0;

    for (const bracket of brackets) {
        if (taxableIncome > previousLimit) {
            const taxableInBracket = Math.min(taxableIncome, bracket.limit) - previousLimit;
            tax += taxableInBracket * bracket.rate;
        } else {
            break;
        }
        previousLimit = bracket.limit;
    }
    return tax;
};


const PITCalculator: React.FC = () => {
    const [monthlyIncome, setMonthlyIncome] = useState('50000000');
    const [numDependents, setNumDependents] = useState('1');

    const income = Number(monthlyIncome);
    const dependents = Number(numDependents);

    const { tax2025, tax2026 } = useMemo(() => {
        const totalDeduction2025 = PERSONAL_DEDUCTION_2025 + (dependents * DEPENDENT_DEDUCTION_2025);
        const taxableIncome2025 = Math.max(0, income - totalDeduction2025);
        const tax2025 = calculateProgressiveTax(taxableIncome2025, PIT_BRACKETS_2025);

        const totalDeduction2026 = PERSONAL_DEDUCTION_2026 + (dependents * DEPENDENT_DEDUCTION_2026);
        const taxableIncome2026 = Math.max(0, income - totalDeduction2026);
        const tax2026 = calculateProgressiveTax(taxableIncome2026, PIT_BRACKETS_2026);

        return { tax2025, tax2026 };
    }, [income, dependents]);

    const savings = tax2025 - tax2026;

    const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="income" className="block text-sm font-medium text-slate-300">Tổng thu nhập tháng (VND)</label>
                    <input
                        type="number"
                        id="income"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        className="mt-1 block w-full border border-slate-600 rounded-md shadow-sm p-2 bg-slate-700 text-slate-100 focus:ring-teal-500 focus:border-teal-500"
                        step="1000000"
                    />
                </div>
                <div>
                    <label htmlFor="dependents" className="block text-sm font-medium text-slate-300">Số người phụ thuộc</label>
                    <input
                        type="number"
                        id="dependents"
                        value={numDependents}
                        onChange={(e) => setNumDependents(e.target.value)}
                        className="mt-1 block w-full border border-slate-600 rounded-md shadow-sm p-2 bg-slate-700 text-slate-100 focus:ring-teal-500 focus:border-teal-500"
                        min="0"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg text-center mb-2 text-slate-300">Luật cũ (2025)</h3>
                    <p className="text-center text-2xl font-bold text-slate-100">{formatCurrency(tax2025)}</p>
                </div>
                <div className="bg-teal-900/50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg text-center mb-2 text-teal-300">Luật mới (2026)</h3>
                    <p className="text-center text-2xl font-bold text-teal-300">{formatCurrency(tax2026)}</p>
                </div>
            </div>

            <div className={`mt-6 text-center p-4 rounded-lg text-xl font-bold ${savings >= 0 ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                {savings >= 0 ? `Bạn tiết kiệm được: ${formatCurrency(savings)}` : `Bạn phải nộp thêm: ${formatCurrency(Math.abs(savings))}`}
            </div>
        </div>
    );
};

export default PITCalculator;