



import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from '../ui/Card';
import { Transaction, BusinessCategory, UserProfile, BusinessSector, InputInvoice, ExpenseCategory, LineItem } from '../../types';
import { HKD_TAX_RATES, HKD_INDICATOR_CODES, HKD_GROUP2_THRESHOLD, HKD_E_INVOICE_THRESHOLD } from '../../constants';
import UserProfileModal from '../profile/UserProfileModal';
import { analyzeInvoiceImage } from '../../services/geminiService';
import InvoiceListItem from './InvoiceListItem';


// (Modal components and other helpers will be defined below the main component)
// ... (DeclarationPreviewModal, MonthPicker, UrgentActionAlert, VATStrategyAdvisor are defined here as in the previous version)

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(Math.round(value));


// ... (UrgentActionAlert, VATStrategyAdvisor, MonthPicker, DeclarationPreviewModal from previous version would go here)
// For brevity, let's assume they exist and focus on the new additions and changes.
const UrgentActionAlert: React.FC<{ annualRevenue: number; sector: BusinessSector }> = ({ annualRevenue, sector }) => {
    const requiresEInvoiceFromCashRegister = annualRevenue > HKD_E_INVOICE_THRESHOLD && sector === BusinessSector.RetailRestaurant;
    if (!requiresEInvoiceFromCashRegister) return null;
    return (
        <div className="my-6 p-4 bg-red-900/50 border-l-4 border-red-500 text-red-300 rounded-r-lg animate-pulse">
            <div className="flex">
                <div className="flex-shrink-0">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                </div>
                <div className="ml-3">
                    <h4 className="font-bold text-red-200">HÀNH ĐỘNG KHẨN CẤP (QUÝ 4/2025)</h4>
                    <p className="text-sm mt-1">Vì doanh thu của bạn <strong>trên 1 tỷ đồng/năm</strong> và thuộc ngành nghề <strong>{sector}</strong>, bạn <strong>BẮT BUỘC</strong> phải lắp đặt và sử dụng <strong>Hóa đơn điện tử khởi tạo từ Máy tính tiền</strong>.</p>
                </div>
            </div>
        </div>
    );
};
const VATStrategyAdvisor: React.FC = () => { /* Same as before */ 
    const [hasInputs, setHasInputs] = useState<boolean | null>(null);
    return (
        <div className="mt-2 space-y-2">
            <p className="text-sm font-medium text-slate-300">Bạn có nhiều hóa đơn đầu vào không (VD: hộ thương mại, bán lẻ)?</p>
            <div className="flex space-x-3">
                <button onClick={() => setHasInputs(true)} className={`px-3 py-1 text-sm rounded-md transition-colors ${hasInputs === true ? 'bg-teal-600 text-white font-bold ring-2 ring-teal-400' : 'bg-slate-600 text-slate-100 hover:bg-slate-500'}`}>Có</button>
                <button onClick={() => setHasInputs(false)} className={`px-3 py-1 text-sm rounded-md transition-colors ${hasInputs === false ? 'bg-teal-600 text-white font-bold ring-2 ring-teal-400' : 'bg-slate-600 text-slate-100 hover:bg-slate-500'}`}>Không</button>
            </div>
            {hasInputs !== null && (
                <div className="mt-2 p-3 text-sm rounded-md bg-slate-700 text-slate-300">
                    <p className="font-bold text-teal-400">Khuyến nghị chiến lược:</p>
                    {hasInputs ? <p>Bạn nên cân nhắc đăng ký nộp thuế GTGT theo phương pháp <strong>Khấu trừ</strong> để tối ưu hóa số thuế phải nộp.</p> : <p>Phương pháp <strong>Trực tiếp (% trên doanh thu)</strong> có thể sẽ có lợi hơn cho bạn.</p>}
                </div>
            )}
        </div>
    );
};
const MonthPicker: React.FC<{ selectedDate: Date; onChange: (date: Date) => void;}> = ({ selectedDate, onChange }) => { /* Same as before */ 
    const [isOpen, setIsOpen] = useState(false);
    const [pickerYear, setPickerYear] = useState(selectedDate.getFullYear());
    const pickerRef = useRef<HTMLDivElement>(null);
    useEffect(() => { const handleClickOutside = (event: MouseEvent) => { if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) { setIsOpen(false); } }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, []);
    const handleMonthSelect = (monthIndex: number) => { const newDate = new Date(pickerYear, monthIndex, 15); if (newDate > new Date()) return; onChange(newDate); setIsOpen(false); };
    const months = ['Thg 1','Thg 2','Thg 3','Thg 4','Thg 5','Thg 6','Thg 7','Thg 8','Thg 9','Thg 10','Thg 11','Thg 12'];
    return (
        <div className="relative" ref={pickerRef}>
            <button onClick={() => { setPickerYear(selectedDate.getFullYear()); setIsOpen(!isOpen); }} className="p-2 border border-slate-600 rounded-lg shadow-sm w-48 text-left flex justify-between items-center bg-slate-800 hover:bg-slate-700 text-slate-200">
                <span>{`Tháng ${selectedDate.getMonth() + 1}, ${selectedDate.getFullYear()}`}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>
            </button>
            {isOpen && (<div className="absolute z-10 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-4">
                <div className="flex justify-between items-center mb-4"><button onClick={() => setPickerYear(y => y - 1)} className="p-1 rounded-full hover:bg-slate-700 text-slate-300">&lt;</button><span className="font-semibold text-slate-200">{pickerYear}</span><button onClick={() => setPickerYear(y => y + 1)} disabled={pickerYear >= new Date().getFullYear()} className="p-1 rounded-full hover:bg-slate-700 disabled:opacity-50 text-slate-300">&gt;</button></div>
                <div className="grid grid-cols-4 gap-2 text-center">{months.map((month, index) => { const isSelected = index === selectedDate.getMonth() && pickerYear === selectedDate.getFullYear(); const isFuture = pickerYear > new Date().getFullYear() || (pickerYear === new Date().getFullYear() && index > new Date().getMonth()); return (<button key={month} onClick={() => handleMonthSelect(index)} disabled={isFuture} className={`p-2 text-sm rounded-lg ${isSelected ? 'bg-teal-600 text-white font-bold' : isFuture ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-700'}`}>{month}</button>);})}</div>
            </div>)}
        </div>
    );
};
const DeclarationPreviewModal: React.FC<{onClose: () => void; transactions: Transaction[]; period: Date; userProfile: UserProfile;}> = ({onClose, transactions, period, userProfile}) => { 
    const [showPdfTip, setShowPdfTip] = useState(false);
    const summary = useMemo(() => {
        const initialSummary = (Object.keys(BusinessCategory) as Array<keyof typeof BusinessCategory>).map(key => ({
             category: BusinessCategory[key],
             indicator: HKD_INDICATOR_CODES[BusinessCategory[key]],
             revenue: 0,
             vat: 0,
             pit: 0
        }));
        
        const result = transactions.reduce((acc, t) => {
            const item = acc.find(i => i.category === t.category);
            if (item) {
                const rates = HKD_TAX_RATES[t.category];
                item.revenue += t.amount;
                item.vat += t.amount * rates.vat;
                item.pit += t.amount * rates.pit;
            }
            return acc;
        }, initialSummary);
        
        return result;

    }, [transactions]);
    const totals = useMemo(() => summary.reduce((acc, item) => ({revenue: acc.revenue + item.revenue, vat: acc.vat + item.vat, pit: acc.pit + item.pit}), { revenue: 0, vat: 0, pit: 0 }), [summary]);
    const handleExportXML = () => {
         const periodStr = `${String(period.getMonth() + 1).padStart(2, '0')}/${period.getFullYear()}`;
        const todayStr = new Date().toLocaleDateString('vi-VN');

        const xmlContent = `
<HSoThueDTu>
    <HSoKhaiThue>
        <TTinChung>
            <TTinDVu>
                <maDVu>ETAX</maDVu>
                <tenDVu>ETAX 1.0</tenDVu>
                <pbanDVu>1.0</pbanDVu>
                <ttinNhaCCapDVu>
                    <mst>0100243255</mst>
                    <ten>TAX HELPER 2026</ten>
                </ttinNhaCCapDVu>
            </TTinDVu>
            <TTinTKhai>
                <maTKhai>01/CNKD</maTKhai>
                <tenTKhai>TỜ KHAI THUẾ ĐỐI VỚI HỘ KINH DOANH, CÁ NHÂN KINH DOANH</tenTKhai>
                <kyKKhai>
                    <kieuKy>T</kieuKy>
                    <ky>Q${Math.floor(period.getMonth() / 3) + 1}/${period.getFullYear()}</ky>
                    <kyTuNgay>${periodStr}</kyTuNgay>
                    <kyDenNgay>${periodStr}</kyDenNgay>
                </kyKKhai>
                <mstNNT>${userProfile.taxCode}</mstNNT>
                <tenNNT>${userProfile.name}</tenNNT>
                <dchiNNT>${userProfile.address}, ${userProfile.district}, ${userProfile.city}</dchiNNT>
                <danhDanhCN>${userProfile.personalId || ''}</danhDanhCN>
            </TTinTKhai>
        </TTinChung>
        <CTieuTKhai>
            ${summary.map(item => `
            <${item.indicator.replace(/\[|\]/g, '')}>
                <ct28>${item.category === BusinessCategory.Distribution ? item.revenue : 0}</ct28>
                <ct29>${[BusinessCategory.ConsumerServices, BusinessCategory.LodgingAndCatering, BusinessCategory.ConstructionNoMaterials, BusinessCategory.AssetRental, BusinessCategory.Brokerage].includes(item.category) ? item.revenue : 0}</ct29>
                <ct30>${[BusinessCategory.ConstructionWithMaterials, BusinessCategory.ProductionTransport].includes(item.category) ? item.revenue : 0}</ct30>
                <ct31>${item.category === BusinessCategory.Other ? item.revenue : 0}</ct31>
            </${item.indicator.replace(/\[|\]/g, '')}>
            `).join('')}
            <tongDoanhThu>${totals.revenue}</tongDoanhThu>
            <tongThueGTGT>${totals.vat}</tongThueGTGT>
            <tongThueTNCN>${totals.pit}</tongThueTNCN>
        </CTieuTKhai>
    </HSoKhaiThue>
</HSoThueDTu>
        `.trim();

        const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `01_CNKD_${userProfile.taxCode}_${period.getFullYear()}.xml`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handlePrint = () => { setShowPdfTip(false); window.print(); };
    const handleDownloadPdf = () => { setShowPdfTip(true); setTimeout(() => window.print(), 100); };

    return (<div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl w-full max-w-4xl text-slate-300">
            <div className="printable-content text-sm bg-white p-4 rounded text-black">
                {/* Modal content from previous version */}
                 <h3 className="text-xl font-bold mb-1 text-center uppercase">Tờ khai thuế đối với hộ kinh doanh, cá nhân kinh doanh</h3>
                 {/* ... all the table and user profile info */}
                 <table className="w-full text-xs border-collapse border border-black">
                    <thead className="bg-gray-100 font-bold text-center">
                        <tr><th rowSpan={2} className="p-1 border border-black">STT</th><th rowSpan={2} className="p-1 border border-black">Nhóm ngành nghề</th><th rowSpan={2} className="p-1 border border-black">Mã chỉ tiêu</th><th colSpan={2} className="p-1 border border-black">Thuế GTGT</th><th colSpan={2} className="p-1 border border-black">Thuế TNCN</th></tr>
                        <tr><th className="p-1 border border-black">Doanh thu</th><th className="p-1 border border-black">Số thuế</th><th className="p-1 border border-black">Doanh thu</th><th className="p-1 border border-black">Số thuế</th></tr>
                    </thead>
                    <tbody>{summary.map((item, index) => (<tr key={item.indicator}><td className="p-1 border border-black text-center">{index + 1}</td><td className="p-1 border border-black">{item.category}</td><td className="p-1 border border-black text-center">{item.indicator}</td><td className="p-1 border border-black text-right">{item.revenue > 0 ? formatCurrency(item.revenue) : ''}</td><td className="p-1 border border-black text-right">{item.vat > 0 ? formatCurrency(item.vat) : ''}</td><td className="p-1 border border-black text-right">{item.revenue > 0 ? formatCurrency(item.revenue) : ''}</td><td className="p-1 border border-black text-right">{item.pit > 0 ? formatCurrency(item.pit) : ''}</td></tr>))}</tbody>
                    <tfoot><tr className="font-bold bg-gray-50"><td colSpan={3} className="p-1 border border-black text-center">Tổng cộng</td><td className="p-1 border border-black text-right">{formatCurrency(totals.revenue)}</td><td className="p-1 border border-black text-right">{formatCurrency(totals.vat)}</td><td className="p-1 border border-black text-right">{formatCurrency(totals.revenue)}</td><td className="p-1 border border-black text-right">{formatCurrency(totals.pit)}</td></tr></tfoot>
                 </table>
            </div>
            <div className="mt-6 flex justify-center items-center space-x-4 no-print relative">
                {showPdfTip && <div className="absolute -top-12 bg-slate-600 text-white text-xs p-2 rounded-md shadow-lg">Trong hộp thoại In, chọn "Save as PDF".</div>}
                <button onClick={handlePrint} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 flex items-center space-x-2 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6 3.069m0 0a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-8.182 8.182a2.25 2.25 0 0 0 3.182 0l2.909-2.909m0 0a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-11.091 2.25a2.25 2.25 0 0 0 3.182 0l2.909-2.909m-8.182 8.182a2.25 2.25 0 0 0 3.182 0l2.909 2.909M3 9.75h18v7.5H3v-7.5Z" /></svg><span>In Tờ khai</span></button>
                <button onClick={handleDownloadPdf} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 flex items-center space-x-2 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg><span>Tải PDF</span></button>
                <button onClick={handleExportXML} className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 flex items-center space-x-2 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg><span>Xuất file XML</span></button>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors no-print"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>
        </div>
    </div>)
};
const AddRevenueWizard: React.FC<{onClose: () => void; onAdd: (transaction: Omit<Transaction, 'id' | 'date'>) => void; initialCategory?: BusinessCategory | null;}> = ({onClose, onAdd, initialCategory}) => { 
    const [step, setStep] = useState(1); 
    const [amount, setAmount] = useState(''); 
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value.replace(/[^0-9]/g, ''); setAmount(v === '' ? '' : new Intl.NumberFormat('vi-VN').format(Number(v))); }; 
    const handleNext = () => setStep(step + 1); 
    
    const handleCategorySelect = (selectedCategory: BusinessCategory) => {
        if (!amount) return;
        onAdd({ amount: Number(amount.replace(/\./g, '')), category: selectedCategory, description: `Doanh thu ${selectedCategory}` }); 
        onClose();
    };

    return <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[100] p-4"><div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl w-full max-w-md">{step === 1 && <div><h3 className="text-xl font-bold text-slate-100 mb-4">Ghi chép Doanh thu (Đầu ra)</h3><input type="text" value={amount} onChange={handleAmountChange} className="w-full text-lg p-3 bg-slate-900 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-100" placeholder="10.000.000" autoFocus inputMode="numeric" /><div className="mt-6 flex justify-end space-x-3"><button onClick={onClose} className="bg-slate-600 text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-500 transition-colors">Hủy</button><button onClick={handleNext} disabled={!amount} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:bg-slate-500 transition-colors">Tiếp</button></div></div>}{step === 2 && <div><h3 className="text-xl font-bold text-slate-100 mb-4">Loại hình Doanh thu:</h3><div className="space-y-3 max-h-80 overflow-y-auto pr-2">{Object.values(BusinessCategory).map(cat => (<button key={cat} onClick={() => handleCategorySelect(cat)} className={`w-full text-left p-4 border border-slate-700 rounded-lg hover:bg-slate-700 transition text-slate-200 relative ${initialCategory === cat ? 'ring-2 ring-teal-400' : ''}`}><p>{cat}</p>{initialCategory === cat && <span className="absolute top-2 right-3 text-xs bg-teal-600 text-white font-semibold px-2 py-0.5 rounded-full">Ngành chính</span>}</button>))}</div></div>}</div></div>
};
const AddExpenseModal: React.FC<{onClose: () => void; onSave: (invoice: Omit<InputInvoice, 'id'>) => void;}> = ({ onClose, onSave }) => {
    const [invoiceData, setInvoiceData] = useState({ date: new Date().toISOString().split('T')[0], supplierName: '', supplierTaxCode: '', description: '', expenseCategory: ExpenseCategory.RawMaterials });
    const [lineItems, setLineItems] = useState<Omit<LineItem, 'id'>[]>([{ name: '', quantity: 1, unitPrice: 0 }]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const handleLineItemChange = (index: number, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
        const updatedItems = [...lineItems];
        // @ts-ignore
        updatedItems[index][field] = value;
        setLineItems(updatedItems);
    };
    const addLineItem = () => setLineItems([...lineItems, { name: '', quantity: 1, unitPrice: 0 }]);
    const removeLineItem = (index: number) => setLineItems(lineItems.filter((_, i) => i !== index));

    const totalAmount = useMemo(() => lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0), [lineItems]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadstart = () => {
                setIsAnalyzing(true);
                setAnalysisError(null);
                setImageUrl(null);
            };

            reader.onloadend = async (event) => {
                const base64String = event.target?.result as string;
                if (base64String) {
                    setImageUrl(base64String);
                    try {
                        const base64Data = base64String.split(',')[1];
                        const mimeType = file.type;
                        const extractedData = await analyzeInvoiceImage(base64Data, mimeType);
                        
                        if (extractedData) {
                            setInvoiceData(prev => ({
                                ...prev,
                                supplierName: extractedData.supplierName || prev.supplierName,
                                supplierTaxCode: extractedData.supplierTaxCode || prev.supplierTaxCode,
                                date: extractedData.date || prev.date,
                            }));
                            if (extractedData.lineItems && extractedData.lineItems.length > 0) {
                                setLineItems(extractedData.lineItems.map((item: any) => ({
                                    name: item.name || '',
                                    quantity: item.quantity || 1,
                                    unitPrice: item.unitPrice || 0,
                                })));
                            }
                        }
                    } catch (error) {
                        setAnalysisError(error instanceof Error ? error.message : "Lỗi không xác định.");
                    } finally {
                        setIsAnalyzing(false);
                    }
                }
            };

            reader.onerror = () => {
                setIsAnalyzing(false);
                setAnalysisError("Không thể đọc tệp hình ảnh.");
            };

            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = () => {
        if (!invoiceData.supplierName || totalAmount <= 0) {
            alert('Vui lòng điền tên Nhà cung cấp và ít nhất một chi tiết hạng mục.');
            return;
        }
        const finalInvoiceData: Omit<InputInvoice, 'id'> = {
            ...invoiceData,
            amount: totalAmount,
            lineItems: lineItems.map(li => ({ ...li, id: `${Date.now()}-${Math.random()}` })),
            imageUrl: imageUrl || undefined,
        };
        onSave(finalInvoiceData);
        onClose();
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[150] p-4">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex-shrink-0">Thêm Chi phí (Hóa đơn Đầu vào)</h3>
                <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
                    {/* Form fields for supplier, date, etc. */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-300">Ngày hóa đơn</label><input type="date" value={invoiceData.date} onChange={e => setInvoiceData(p=>({...p, date:e.target.value}))} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-100" /></div>
                        <div><label className="block text-sm font-medium text-slate-300">Phân loại Chi phí</label><select value={invoiceData.expenseCategory} onChange={e => setInvoiceData(p=>({...p, expenseCategory:e.target.value as ExpenseCategory}))} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-100">{Object.values(ExpenseCategory).map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-300">Tên Nhà cung cấp *</label><input type="text" value={invoiceData.supplierName} onChange={e => setInvoiceData(p=>({...p, supplierName:e.target.value}))} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-100" /></div>
                        <div><label className="block text-sm font-medium text-slate-300">Mã số thuế NCC</label><input type="text" value={invoiceData.supplierTaxCode} onChange={e => setInvoiceData(p=>({...p, supplierTaxCode:e.target.value}))} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-100" /></div>
                    </div>
                     <div><label className="block text-sm font-medium text-slate-300">Ghi chú chung</label><input type="text" value={invoiceData.description} onChange={e => setInvoiceData(p=>({...p, description:e.target.value}))} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-100" /></div>
                    
                    {/* Line Items */}
                    <div className="border-t border-slate-700 pt-4 mt-4">
                        <h4 className="text-lg font-semibold text-slate-200 mb-2">Chi tiết Hạng mục</h4>
                        <div className="space-y-2">
                        {lineItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                <input type="text" placeholder="Tên hạng mục" value={item.name} onChange={e => handleLineItemChange(index, 'name', e.target.value)} className="col-span-5 bg-slate-700 border border-slate-600 p-1 rounded-md text-sm" />
                                <input type="number" placeholder="SL" value={item.quantity} onChange={e => handleLineItemChange(index, 'quantity', Number(e.target.value))} className="col-span-2 bg-slate-700 border border-slate-600 p-1 rounded-md text-sm" />
                                <input type="number" placeholder="Đơn giá" value={item.unitPrice} onChange={e => handleLineItemChange(index, 'unitPrice', Number(e.target.value))} className="col-span-3 bg-slate-700 border border-slate-600 p-1 rounded-md text-sm" />
                                <span className="col-span-1 text-sm text-slate-400 text-right pr-1">{formatCurrency(item.quantity * item.unitPrice)}</span>
                                <button onClick={() => removeLineItem(index)} className="col-span-1 text-red-400 hover:text-red-300">&times;</button>
                            </div>
                        ))}
                        </div>
                        <button onClick={addLineItem} className="mt-2 text-sm text-teal-400 font-semibold hover:text-teal-300">+ Thêm dòng</button>
                    </div>

                    {/* Image Upload */}
                    <div className="border-t border-slate-700 pt-4 mt-4">
                         <label className="block text-sm font-medium text-slate-300 mb-2">Đính kèm ảnh Hóa đơn (tùy chọn)</label>
                         <div className="flex items-center space-x-4">
                            <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} id="invoice-upload" className="hidden" disabled={isAnalyzing}/>
                            <label htmlFor="invoice-upload" className={`cursor-pointer bg-slate-600 text-slate-100 px-3 py-2 rounded-lg hover:bg-slate-500 transition-colors text-sm font-semibold ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {isAnalyzing ? 'Đang phân tích...' : 'Chọn ảnh hoặc Chụp ảnh'}
                            </label>
                            {imageUrl && !isAnalyzing && <img src={imageUrl} alt="Invoice preview" className="h-16 w-16 object-cover rounded-md border-2 border-slate-600" />}
                            {isAnalyzing && <div className="h-16 w-16 flex items-center justify-center"><div className="w-6 h-6 border-2 border-t-teal-400 border-slate-600 rounded-full animate-spin"></div></div>}
                         </div>
                         {analysisError && <p className="text-sm text-red-400 mt-2">{analysisError}</p>}
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center flex-shrink-0">
                    <span className="text-lg font-bold text-slate-100">Tổng cộng: {formatCurrency(totalAmount)}</span>
                    <div className="space-x-3">
                        <button onClick={onClose} className="bg-slate-600 text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-500 transition-colors">Hủy</button>
                        <button onClick={handleSubmit} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">Lưu Chi phí</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface HKDGroup2DashboardProps {
    onReset: () => void;
    sector: BusinessSector;
}

const HKDGroup2Dashboard: React.FC<HKDGroup2DashboardProps> = ({ onReset, sector }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(() => { const saved = localStorage.getItem('hkd-g2-revenue'); return saved ? JSON.parse(saved) : []; });
    const [inputInvoices, setInputInvoices] = useState<InputInvoice[]>(() => { const saved = localStorage.getItem('hkd-g2-expenses'); return saved ? JSON.parse(saved) : []; });
    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => { const saved = localStorage.getItem('user-profile'); return saved ? JSON.parse(saved) : null; });
    
    const [activeTab, setActiveTab] = useState<'revenue' | 'expenses'>('revenue');
    const [showRevenueWizard, setShowRevenueWizard] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showDeclarationModal, setShowDeclarationModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [primaryCategory, setPrimaryCategory] = useState<BusinessCategory | null>(null);

    
    useEffect(() => { localStorage.setItem('hkd-g2-revenue', JSON.stringify(transactions)); }, [transactions]);
    useEffect(() => { localStorage.setItem('hkd-g2-expenses', JSON.stringify(inputInvoices)); }, [inputInvoices]);
    useEffect(() => {
        const savedCategory = localStorage.getItem('hkd-primary-category');
        if (savedCategory) {
            setPrimaryCategory(savedCategory as BusinessCategory);
        }
    }, []);

    const handleProfileSave = () => { const saved = localStorage.getItem('user-profile'); setUserProfile(saved ? JSON.parse(saved) : null); setShowProfileModal(false); if (!userProfile) { setShowDeclarationModal(true); } };
    const handleOpenDeclaration = () => { if (!userProfile || !userProfile.taxCode) { setShowProfileModal(true); } else { setShowDeclarationModal(true); } };
    
    const { periodRevenue, periodExpenses } = useMemo(() => {
        const filterByPeriod = (items: (Transaction | InputInvoice)[]) => {
            const selectedYear = selectedDate.getFullYear();
            if (viewMode === 'year') return items.filter(t => new Date(t.date).getFullYear() === selectedYear);
            if (viewMode === 'month') {
                const selectedMonth = selectedDate.getMonth();
                return items.filter(t => { const tDate = new Date(t.date); return tDate.getMonth() === selectedMonth && tDate.getFullYear() === selectedYear; });
            }
            if (viewMode === 'day') return items.filter(t => new Date(t.date).toDateString() === selectedDate.toDateString());
            return [];
        };
        return {
            periodRevenue: filterByPeriod(transactions) as Transaction[],
            periodExpenses: filterByPeriod(inputInvoices) as InputInvoice[]
        };
    }, [transactions, inputInvoices, selectedDate, viewMode]);

    const totalRevenue = periodRevenue.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = periodExpenses.reduce((sum, i) => sum + i.amount, 0);
    const profitBeforeTax = totalRevenue - totalExpenses;
    const totalTax = periodRevenue.reduce((sum, t) => sum + t.amount * (HKD_TAX_RATES[t.category].vat + HKD_TAX_RATES[t.category].pit), 0);
    const netProfit = profitBeforeTax - totalTax;

    const totalAnnualRevenue = useMemo(() => transactions.filter(t => new Date(t.date).getFullYear() === selectedDate.getFullYear()).reduce((sum, t) => sum + t.amount, 0), [transactions, selectedDate]);
    const isOverGroup2Threshold = totalRevenue > HKD_GROUP2_THRESHOLD;

    const handleAddRevenue = (data: Omit<Transaction, 'id'|'date'>) => setTransactions(prev => [{ ...data, id: Date.now().toString(), date: new Date().toISOString() }, ...prev]);
    const handleAddExpense = (data: Omit<InputInvoice, 'id'>) => {
        setInputInvoices(prev => [{ ...data, id: Date.now().toString() }, ...prev]);
    };
    
    const periodLabel = useMemo(() => { if (viewMode === 'day') return `ngày ${selectedDate.toLocaleDateString('vi-VN')}`; if (viewMode === 'month') return `tháng ${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`; return `năm ${selectedDate.getFullYear()}`; }, [selectedDate, viewMode]);

    return (
        <div className="relative">
             {showProfileModal && <UserProfileModal onClose={handleProfileSave} />}
             {showRevenueWizard && <AddRevenueWizard onClose={() => setShowRevenueWizard(false)} onAdd={handleAddRevenue} initialCategory={primaryCategory} />}
             {showExpenseModal && <AddExpenseModal onClose={() => setShowExpenseModal(false)} onSave={handleAddExpense} />}
             {showDeclarationModal && userProfile && viewMode === 'month' && <DeclarationPreviewModal onClose={() => setShowDeclarationModal(false)} transactions={periodRevenue} period={selectedDate} userProfile={userProfile} />}

            <div className="mb-4 text-center"><button onClick={onReset} className="text-sm text-teal-400 hover:text-teal-300">&larr; Quay lại chọn nhóm</button></div>
            <Card className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">Sổ Kế toán Kỹ thuật số (Nhóm 2)</h2>
                <p className="text-slate-400 text-center mb-6">Quản lý toàn diện doanh thu (đầu ra) và chi phí (đầu vào) của bạn ở một nơi.</p>

                 <div className="my-6 p-4 bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-300 rounded-r-lg">
                    <h4 className="font-bold text-yellow-200">CẢNH BÁO: CẬP NHẬT ĐỊNH DANH CÁ NHÂN (TT 94/2025/TT-BTC)</h4>
                    <p className="text-sm mt-1">
                       Từ <strong>14/10/2025</strong>, mọi tờ khai HKD (bao gồm cả Q4/2025) bắt buộc phải có trường "Định danh cá nhân". Vui lòng cập nhật hồ sơ của bạn ngay để đảm bảo tuân thủ.
                    </p>
                </div>

                <UrgentActionAlert annualRevenue={totalAnnualRevenue} sector={sector} />
                
                {/* Date Picker */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-6 p-2 bg-slate-900 rounded-lg">
                     <div className="flex bg-slate-800 p-1 rounded-lg font-semibold">
                        <button onClick={() => setViewMode('day')} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'day' ? 'bg-slate-600 text-teal-300' : 'text-slate-400'}`}>Theo Ngày</button>
                        <button onClick={() => setViewMode('month')} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'month' ? 'bg-slate-600 text-teal-300' : 'text-slate-400'}`}>Theo Tháng</button>
                        <button onClick={() => setViewMode('year')} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'year' ? 'bg-slate-600 text-teal-300' : 'text-slate-400'}`}>Theo Năm</button>
                    </div>
                     {viewMode === 'day' && <input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={(e) => setSelectedDate(new Date(e.target.value))} className="p-2 border border-slate-600 rounded-lg shadow-sm bg-slate-800 hover:bg-slate-700 text-slate-200" />}
                     {viewMode === 'month' && <MonthPicker selectedDate={selectedDate} onChange={setSelectedDate} />}
                     {viewMode === 'year' && <div className="flex items-center space-x-2"><button onClick={() => setSelectedDate(d => new Date(d.getFullYear() - 1, 0, 15))} className="p-2 rounded-full hover:bg-slate-700 text-slate-300">&lt;</button><span className="font-semibold text-slate-200 w-24 text-center">{selectedDate.getFullYear()}</span><button onClick={() => setSelectedDate(d => new Date(d.getFullYear() + 1, 0, 15))} disabled={selectedDate.getFullYear() >= new Date().getFullYear()} className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-50 text-slate-300">&gt;</button></div>}
                </div>

                {/* Financial Summary */}
                <Card className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="text-center"><p className="text-sm text-slate-400">Doanh thu</p><p className="text-lg font-bold text-teal-400">{formatCurrency(totalRevenue)}</p></div>
                    <div className="text-center"><p className="text-sm text-slate-400">Chi phí</p><p className="text-lg font-bold text-orange-400">{formatCurrency(totalExpenses)}</p></div>
                    <div className="text-center"><p className="text-sm text-slate-400">Lợi nhuận</p><p className="text-lg font-bold text-sky-400">{formatCurrency(profitBeforeTax)}</p></div>
                    <div className="text-center"><p className="text-sm text-slate-400">Thuế tạm nộp</p><p className="text-lg font-bold text-red-400">{formatCurrency(totalTax)}</p></div>
                    <div className="col-span-2 md:col-span-1 text-center bg-slate-800 p-2 rounded-lg"><p className="text-sm font-semibold text-slate-300">Lợi nhuận ròng</p><p className="text-xl font-bold text-green-400">{formatCurrency(netProfit)}</p></div>
                </Card>

                {/* Tabs & Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                     <div className="flex bg-slate-800 p-1 rounded-lg font-semibold self-start sm:self-center">
                        <button onClick={() => setActiveTab('revenue')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'revenue' ? 'bg-slate-600 text-teal-300 shadow' : 'text-slate-400'}`}>Doanh thu (Đầu ra)</button>
                        <button onClick={() => setActiveTab('expenses')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'expenses' ? 'bg-slate-600 text-teal-300 shadow' : 'text-slate-400'}`}>Chi phí (Đầu vào)</button>
                    </div>
                     <div className="flex space-x-3 self-end sm:self-center">
                         <button onClick={() => setShowExpenseModal(true)} className="bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-700 flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg><span>Thêm Chi phí</span></button>
                         <button onClick={() => setShowRevenueWizard(true)} className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg><span>Thêm Doanh thu</span></button>
                    </div>
                </div>

                {/* Ledger Table */}
                 <div className="overflow-y-auto pr-2 border-t border-slate-700 pt-4 min-h-[200px] max-h-[400px]">
                    {activeTab === 'revenue' && (
                        periodRevenue.length === 0 
                        ? <p className="text-center text-slate-500 py-8">Chưa có doanh thu nào trong kỳ.</p>
                        : <ul className="space-y-2">{periodRevenue.map(t => <li key={t.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-md"><div><p className="font-medium">{t.category}</p><p className="text-sm text-slate-400">{new Date(t.date).toLocaleDateString('vi-VN')}</p></div><div className="text-right"><p className="font-semibold text-slate-100">{formatCurrency(t.amount)}</p><p className="text-sm text-red-400">Thuế: {formatCurrency(t.amount * (HKD_TAX_RATES[t.category].vat + HKD_TAX_RATES[t.category].pit))}</p></div></li>)}</ul>
                    )}
                     {activeTab === 'expenses' && (
                        periodExpenses.length === 0 
                        ? <p className="text-center text-slate-500 py-8">Chưa có chi phí nào trong kỳ.</p>
                        : <ul className="space-y-3">{periodExpenses.map(inv => <InvoiceListItem key={inv.id} invoice={inv} />)}</ul>
                    )}
                 </div>
                 {viewMode === 'month' && (
                    <div className="mt-8 text-center border-t border-slate-700 pt-6">
                        <button onClick={handleOpenDeclaration} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 transition-colors shadow-lg">Lập Tờ khai cho {periodLabel}</button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default HKDGroup2Dashboard;