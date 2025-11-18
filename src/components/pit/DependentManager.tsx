import React, { useState } from 'react';
import { Dependent } from '../../types';
import { DEPENDENT_INCOME_LIMIT } from '../../constants';

const DependentManager: React.FC = () => {
    const [dependents, setDependents] = useState<Dependent[]>([
        { id: '1', name: 'Mẹ (Bà Hà)', monthlyIncome: 4000000 },
        { id: '2', name: 'Con (Bé An)', monthlyIncome: 0 },
    ]);
    const [newDependentName, setNewDependentName] = useState('');

    const handleIncomeChange = (id: string, income: string) => {
        setDependents(dependents.map(d =>
            d.id === id ? { ...d, monthlyIncome: Number(income) } : d
        ));
    };

    const handleAddDependent = () => {
        if (newDependentName.trim() === '') return;
        const newDependent: Dependent = {
            id: Date.now().toString(),
            name: newDependentName,
            monthlyIncome: 0,
        };
        setDependents([...dependents, newDependent]);
        setNewDependentName('');
    };

    const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

    return (
        <div className="space-y-4">
            <p className="text-slate-400">Theo dõi thu nhập của người phụ thuộc để tránh rủi ro bị truy thu thuế. Một người phụ thuộc chỉ đủ điều kiện nếu thu nhập bình quân tháng không vượt quá {formatCurrency(DEPENDENT_INCOME_LIMIT)} VND.</p>
            <div className="space-y-4">
                {dependents.map(dep => {
                    const hasRisk = dep.monthlyIncome > DEPENDENT_INCOME_LIMIT;
                    return (
                        <div key={dep.id} className={`p-4 rounded-lg border-l-4 transition-all ${hasRisk ? 'bg-red-900/20 border-red-500' : 'bg-slate-700/50 border-slate-600'}`}>
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                <span className="font-semibold text-slate-200">{dep.name}</span>
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm text-slate-300">Thu nhập tháng:</label>
                                    <input
                                        type="number"
                                        value={dep.monthlyIncome}
                                        onChange={(e) => handleIncomeChange(dep.id, e.target.value)}
                                        className="w-32 p-1 border border-slate-600 rounded-md bg-slate-800 text-slate-100"
                                        step="100000"
                                    />
                                     <span className="text-slate-400">VND</span>
                                </div>
                            </div>
                            {hasRisk && (
                                <div className="mt-3 flex items-start space-x-2 text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>
                                    <p className="text-sm font-medium">CẢNH BÁO: Thu nhập của người này đã vượt ngưỡng 1 triệu đồng/tháng. Bạn có nguy cơ bị truy thu thuế cuối năm nếu vẫn đăng ký giảm trừ.</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="flex space-x-2 pt-4">
                <input
                    type="text"
                    value={newDependentName}
                    onChange={e => setNewDependentName(e.target.value)}
                    placeholder="Tên người phụ thuộc mới"
                    className="flex-grow p-2 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:ring-teal-500 focus:border-teal-500"
                />
                <button onClick={handleAddDependent} className="bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">Thêm</button>
            </div>
        </div>
    );
};

export default DependentManager;