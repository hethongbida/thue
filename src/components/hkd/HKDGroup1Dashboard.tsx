import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { HKD_GROUP1_THRESHOLD } from '../../constants';

interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
}

interface HKDGroup1DashboardProps {
    onReset: () => void;
}

const HKDGroup1Dashboard: React.FC<HKDGroup1DashboardProps> = ({ onReset }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const totalRevenue = useMemo(() => {
        return transactions.reduce((sum, t) => sum + t.amount, 0);
    }, [transactions]);

    const WARNING_THRESHOLD_PERCENTAGE = 90;
    const progressPercentage = (totalRevenue / HKD_GROUP1_THRESHOLD) * 100;
    const isOverThreshold = totalRevenue >= HKD_GROUP1_THRESHOLD;
    const isApproachingThreshold = progressPercentage >= WARNING_THRESHOLD_PERCENTAGE && !isOverThreshold;

    const remainingUntilThreshold = HKD_GROUP1_THRESHOLD - totalRevenue;
    
    const handleAddTransaction = () => {
        if (!amount) return;
        const newTransaction: Transaction = {
            id: Date.now(),
            date: new Date().toLocaleDateString('vi-VN'),
            description: description || 'Doanh thu bán hàng',
            amount: Number(amount.replace(/\./g, '')),
        };
        setTransactions([newTransaction, ...transactions]);
        setShowModal(false);
        setAmount('');
        setDescription('');
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        const formattedValue = new Intl.NumberFormat('vi-VN').format(Number(value));
        setAmount(value === '' ? '' : formattedValue);
    };

    const handleExportCSV = () => {
        if (transactions.length === 0) return;

        const csvHeader = '"ID","Ngày","Ghi chú","Số tiền (VND)"\n';
        const csvBody = transactions
            .map(t =>
                [
                    t.id,
                    `"${t.date}"`,
                    `"${t.description.replace(/"/g, '""')}"`,
                    t.amount,
                ].join(',')
            )
            .join('\n');
        
        const csvString = csvHeader + csvBody;
        const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' }); 

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'lich_su_giao_dich_nhom_1.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div>
            <div className="mb-4 text-center">
                <button onClick={onReset} className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                    &larr; Quay lại chọn nhóm
                </button>
            </div>
            <Card className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">Công cụ Chứng minh Miễn thuế</h2>
                <p className="text-slate-400 text-center mb-6">Ghi chép doanh thu để đảm bảo bạn vẫn trong ngưỡng miễn thuế GTGT và TNCN.</p>

                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between items-center mb-1 font-medium">
                            <span className="text-slate-300">Doanh thu năm nay</span>
                            <span className="text-teal-400">{new Intl.NumberFormat('vi-VN').format(totalRevenue)} / {new Intl.NumberFormat('vi-VN').format(HKD_GROUP1_THRESHOLD)} VND</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-4">
                            <div
                                className={`h-4 rounded-full transition-all duration-500 ${isOverThreshold ? 'bg-red-500' : isApproachingThreshold ? 'bg-yellow-400' : 'bg-teal-500'}`}
                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                     <div className={`text-center font-semibold p-3 rounded-lg ${
                        isOverThreshold ? 'bg-red-900/50 text-red-300'
                        : isApproachingThreshold ? 'bg-yellow-900/50 text-yellow-300'
                        : 'bg-green-900/50 text-green-300'
                    }`}>
                        {isOverThreshold ? (
                            <div className="flex items-center justify-center font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                <span>Bạn đã vượt ngưỡng miễn thuế. Cần kê khai theo Nhóm 2.</span>
                            </div>
                        ) : isApproachingThreshold ? (
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center font-bold mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>
                                    <span>Cảnh báo: Doanh thu sắp chạm ngưỡng miễn thuế.</span>
                                </div>
                                <span>Bạn còn cách ngưỡng {new Intl.NumberFormat('vi-VN').format(remainingUntilThreshold)} đồng.</span>
                            </div>
                        ) : (
                            <span>Bạn còn cách ngưỡng phải nộp thuế (Nhóm 2) {new Intl.NumberFormat('vi-VN').format(Math.max(0, remainingUntilThreshold))} đồng.</span>
                        )}
                    </div>
                </div>
                
                <div className="my-8 text-center">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors inline-flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>Ghi chép Giao dịch</span>
                    </button>
                </div>


                <div className="mt-4 p-4 bg-slate-700/50 border-l-4 border-teal-500 text-slate-300 rounded-r-lg">
                    <h4 className="font-bold text-teal-400">Lưu ý quan trọng</h4>
                    <p className="text-sm">
                        <strong>Miễn nộp thuế không đồng nghĩa với miễn kê khai.</strong> Bạn vẫn phải thực hiện nghĩa vụ kê khai (dự kiến 02 lần/năm) để chứng minh với cơ quan thuế rằng doanh thu của bạn thực sự nằm dưới ngưỡng 200 triệu đồng.
                    </p>
                </div>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-200">Lịch sử giao dịch</h3>
                        <button
                            onClick={handleExportCSV}
                            disabled={transactions.length === 0}
                            className="flex items-center space-x-2 text-sm bg-slate-600 text-slate-100 font-semibold py-1 px-3 rounded-lg hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            <span>Xuất CSV</span>
                        </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto pr-2">
                        {transactions.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">Chưa có giao dịch nào.</p>
                        ) : (
                            <ul className="space-y-2">
                                {transactions.map(t => (
                                    <li key={t.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-md">
                                        <div>
                                            <p className="font-medium text-slate-200">{t.description}</p>
                                            <p className="text-sm text-slate-400">{t.date}</p>
                                        </div>
                                        <span className="font-semibold text-slate-100">{new Intl.NumberFormat('vi-VN').format(t.amount)} VND</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </Card>
            
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold text-slate-100 mb-4">Thêm giao dịch mới</h3>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-300">Số tiền</label>
                                <input type="text" value={amount} onChange={handleAmountChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-100 focus:ring-teal-500 focus:border-teal-500" placeholder="1.000.000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300">Ghi chú (tùy chọn)</label>
                                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-100 focus:ring-teal-500 focus:border-teal-500" placeholder="Bán hàng cho khách A" />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setShowModal(false)} className="bg-slate-600 text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-500 transition-colors">Hủy</button>
                            <button onClick={handleAddTransaction} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">Lưu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HKDGroup1Dashboard;