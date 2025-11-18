import React, { useState } from 'react';
import Card from '../ui/Card';
import { ECOMMERCE_GOODS_RATE, HKD_GROUP1_THRESHOLD } from '../../constants';

interface SaleRecord {
    id: string;
    revenue: number;
    status: 'Completed' | 'Cancelled';
}

const parseCSV = (content: string): SaleRecord[] => {
    const records: SaleRecord[] = [];
    const lines = content.replace(/\r/g, '').split('\n').slice(1).filter(line => line.trim() !== '');

    for (const line of lines) {
        const [id, revenueStr, status] = line.split(',');
        const revenue = Number(revenueStr);
        if (id && !isNaN(revenue) && status && (status.trim() === 'Completed' || status.trim() === 'Cancelled')) {
            records.push({ id: id.trim(), revenue, status: status.trim() as 'Completed' | 'Cancelled' });
        }
    }
    return records;
};

const RefundSection: React.FC<{ taxAmount: number }> = ({ taxAmount }) => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        setSubmitted(true);
    };
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(Math.round(value));

    return (
        <div className="mt-8 text-center bg-teal-900/50 p-6 rounded-lg border-l-4 border-teal-500">
            <div className="flex justify-center items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-teal-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-teal-200 mt-2">Bạn đủ điều kiện hoàn thuế!</h3>
            <p className="mt-2 text-slate-300">
                Vì tổng doanh thu năm từ TMĐT của bạn thấp hơn ngưỡng 200.000.000 VND, bạn có thể yêu cầu hoàn lại toàn bộ số thuế đã bị khấu trừ.
            </p>
            <p className="text-2xl font-bold text-teal-300 my-4">
                Số tiền được hoàn: {formatCurrency(taxAmount)} VND
            </p>
            {!submitted ? (
                 <button 
                    onClick={handleSubmit}
                    className="bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 transition"
                >
                    Tạo hồ sơ hoàn thuế
                </button>
            ) : (
                <p className="font-semibold text-green-400">✓ Yêu cầu của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ trong vài ngày làm việc.</p>
            )}
        </div>
    );
};


const ECommerceModule: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ status: 'match' | 'mismatch' | 'none'; platformTax: number; calculatedTax: number, discrepancy: number } | null>(null);
    const [totalRevenue, setTotalRevenue] = useState<number | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
            setResult(null);
            setTotalRevenue(null);
        }
    };

    const handleReconciliation = () => {
        if (!file) return;
        setIsProcessing(true);
        setTotalRevenue(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) {
                alert("Không thể đọc nội dung tệp.");
                setIsProcessing(false);
                return;
            }

            const saleData = parseCSV(text);

            if (saleData.length === 0) {
                alert("Không tìm thấy dữ liệu hợp lệ trong tệp. Vui lòng kiểm tra định dạng cột: OrderID,Revenue,Status");
                setIsProcessing(false);
                return;
            }

            const successfulRevenue = saleData.filter(r => r.status === 'Completed').reduce((sum, r) => sum + r.revenue, 0);
            setTotalRevenue(successfulRevenue);

            const calculatedTax = successfulRevenue * ECOMMERCE_GOODS_RATE.total;
            
            const totalReportedRevenue = saleData.reduce((sum, r) => sum + r.revenue, 0);
            const platformTax = totalReportedRevenue * ECOMMERCE_GOODS_RATE.total;

            const discrepancy = platformTax - calculatedTax;

            setResult({
                status: discrepancy < 1 ? 'match' : 'mismatch',
                platformTax,
                calculatedTax,
                discrepancy,
            });
            setIsProcessing(false);
        };

        reader.onerror = () => {
            alert("Đã xảy ra lỗi khi đọc tệp.");
            setIsProcessing(false);
        }

        reader.readAsText(file);
    };

    const handleDownloadSample = () => {
        const csvContent = 'data:text/csv;charset=utf-8,' 
            + 'OrderID,Revenue,Status\n'
            + 'A,10000000,Completed\n'
            + 'B,12000000,Completed\n'
            + 'C,1500000,Cancelled\n'
            + 'D,5000000,Completed\n';
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'bao_cao_mau.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(Math.round(value));

    const ResultDisplay = () => {
        if (!result) return null;

        if (result.status === 'match') {
            return (
                <div className="mt-6 text-center bg-green-900/50 p-6 rounded-lg border-l-4 border-green-500">
                    <div className="flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-green-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-300 mt-2">ĐÃ KHỚP</h3>
                    <p className="text-slate-300">Số thuế Sàn khấu trừ và nộp thay là <span className="font-bold">{formatCurrency(result.calculatedTax)} VND</span> đã chính xác.</p>
                </div>
            );
        }

        if (result.status === 'mismatch') {
             return (
                <div className="mt-6 text-center bg-red-900/50 p-6 rounded-lg border-l-4 border-red-500">
                    <div className="flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-red-400">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-red-300 mt-2">CẢNH BÁO: LỆCH {formatCurrency(result.discrepancy)} VND</h3>
                    <p className="mt-2 text-slate-300">Hệ thống phát hiện Sàn đã khấu trừ nhiều hơn số thuế thực tế phải nộp. Nguyên nhân có thể do Sàn chưa bù trừ thuế cho các đơn hàng bị Hủy/Trả lại.</p>
                    <div className="mt-4 text-left text-sm space-y-1">
                        <p className="text-slate-400">Số thuế Sàn báo cáo khấu trừ (ước tính): <span className="font-semibold text-slate-200">{formatCurrency(result.platformTax)}</span></p>
                        <p className="text-slate-400">Số thuế thực tế phải nộp (sau khi trừ đơn hủy): <span className="font-semibold text-slate-200">{formatCurrency(result.calculatedTax)}</span></p>
                    </div>
                </div>
            );
        }
        return null;
    }

    return (
        <Card className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-slate-100">Đối soát & Hoàn thuế TMĐT</h1>
            <p className="text-slate-400 text-center mt-2 mb-6">"Xem và kiểm tra" liệu Shopee, Lazada, TikTok Shop đã khấu trừ và nộp thuế thay cho bạn đúng và đủ chưa?</p>
            
             <div className="my-6 p-4 bg-slate-700/50 border-l-4 border-teal-500 text-slate-300 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-teal-400">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h4 className="font-bold uppercase text-teal-400">Lưu ý: Hiệu lực từ 01/07/2025</h4>
                        <p className="text-sm mt-1">
                           Theo Nghị định 117/2025/NĐ-CP, kể từ ngày 01/07/2025, các sàn TMĐT bắt buộc phải khấu trừ và nộp thuế thay cho người bán.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg mb-4 text-center">
                <p className="text-sm text-slate-400">Chưa có file? <button onClick={handleDownloadSample} className="text-teal-400 font-semibold hover:text-teal-300">Tải tệp CSV mẫu</button> để thử nghiệm.</p>
            </div>
            
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center bg-slate-800/50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-slate-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <label htmlFor="file-upload" className="mt-4 inline-block bg-slate-700 py-2 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-200 hover:bg-slate-600 cursor-pointer">
                    Tải lên báo cáo doanh thu (.csv, .xlsx)
                </label>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv,.xlsx" />
                {file && <p className="mt-2 text-sm text-slate-500">{file.name}</p>}
            </div>

            <div className="mt-6 text-center">
                <button 
                    onClick={handleReconciliation} 
                    disabled={!file || isProcessing}
                    className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 disabled:bg-slate-500 transition-colors"
                >
                    {isProcessing ? 'Đang xử lý...' : 'Đối soát ngay'}
                </button>
            </div>
            {isProcessing && <p className="text-center mt-2 text-slate-400">Trợ lý AI đang đối soát. Vui lòng chờ...</p>}

            <ResultDisplay />

            {result && totalRevenue !== null && totalRevenue > 0 && totalRevenue <= HKD_GROUP1_THRESHOLD && (
                <RefundSection taxAmount={result.calculatedTax} />
            )}

        </Card>
    );
};

export default ECommerceModule;