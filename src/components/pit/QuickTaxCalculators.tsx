import React, { useState, useMemo } from 'react';
import { HKD_TAX_RATES } from '../../constants';
import { BusinessCategory } from '../../types';

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(value));

const handleNumericInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
        setter('');
        return;
    }
    const formattedValue = new Intl.NumberFormat('vi-VN').format(Number(value));
    setter(formattedValue);
};

const parseFormattedNumber = (value: string): number => {
    return Number(String(value).replace(/\./g, ''));
};

const inputStyles = "mt-1 block w-full border border-slate-600 rounded-md shadow-sm p-2 bg-slate-700 text-slate-100 focus:ring-teal-500 focus:border-teal-500";
const labelStyles = "block text-sm font-medium text-slate-300";
const resultStyles = "mt-4 text-center p-4 rounded-lg font-bold bg-slate-700/50";


const BusinessIncomeTax: React.FC = () => {
    const [revenue, setRevenue] = useState('');
    const [category, setCategory] = useState<BusinessCategory>(BusinessCategory.ConsumerServices);

    const taxAmount = useMemo(() => {
        const numRevenue = parseFormattedNumber(revenue);
        if (numRevenue <= 0) return { vat: 0, pit: 0, total: 0 };
        const rates = HKD_TAX_RATES[category];
        return {
            vat: numRevenue * rates.vat,
            pit: numRevenue * rates.pit,
            total: numRevenue * (rates.vat + rates.pit)
        };
    }, [revenue, category]);
    
    return (
        <div>
            <p className="text-slate-400 mb-4">Ước tính thuế GTGT và TNCN cho cá nhân kinh doanh (không thuộc HKD) theo phương pháp tính thuế theo tỷ lệ trên doanh thu.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="bizRevenue" className={labelStyles}>Doanh thu (VND)</label>
                    <input type="text" id="bizRevenue" value={revenue} onChange={handleNumericInputChange(setRevenue)} className={inputStyles} placeholder="50.000.000" inputMode="numeric"/>
                </div>
                 <div>
                    <label htmlFor="bizCategory" className={labelStyles}>Ngành nghề</label>
                    <select id="bizCategory" value={category} onChange={e => setCategory(e.target.value as BusinessCategory)} className={inputStyles}>
                        {Object.values(BusinessCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>
            {revenue && (
                 <div className={`${resultStyles} text-lg text-teal-300`}>
                    <p>Thuế GTGT: {formatCurrency(taxAmount.vat)}</p>
                    <p>Thuế TNCN: {formatCurrency(taxAmount.pit)}</p>
                    <p className="border-t border-slate-600 mt-2 pt-2">Tổng thuế phải nộp: {formatCurrency(taxAmount.total)}</p>
                </div>
            )}
        </div>
    );
};


const PropertyRentalTax: React.FC = () => {
    const [rentalIncome, setRentalIncome] = useState('');
    const rates = HKD_TAX_RATES[BusinessCategory.AssetRental];

    const taxAmount = useMemo(() => {
        const income = parseFormattedNumber(rentalIncome);
        if (income <= 0) return { vat: 0, pit: 0, total: 0 };
        return {
            vat: income * rates.vat,
            pit: income * rates.pit,
            total: income * (rates.vat + rates.pit)
        };
    }, [rentalIncome]);

    return(
        <div>
            <p className="text-slate-400 mb-4">Tính thuế cho cá nhân có thu nhập từ cho thuê tài sản (nhà, đất, xe...). Thuế suất là 5% GTGT và 5% TNCN trên doanh thu.</p>
            <div>
                <label htmlFor="rentalIncome" className={labelStyles}>Doanh thu cho thuê (VND)</label>
                <input type="text" id="rentalIncome" value={rentalIncome} onChange={handleNumericInputChange(setRentalIncome)} className={`${inputStyles} md:w-1/2`} placeholder="20.000.000" inputMode="numeric"/>
            </div>
            {rentalIncome && (
                <div className={`${resultStyles} text-lg text-teal-300`}>
                    <p>Thuế GTGT (5%): {formatCurrency(taxAmount.vat)}</p>
                    <p>Thuế TNCN (5%): {formatCurrency(taxAmount.pit)}</p>
                    <p className="border-t border-slate-600 mt-2 pt-2">Tổng thuế phải nộp: {formatCurrency(taxAmount.total)}</p>
                </div>
            )}
        </div>
    );
}

const CapitalInvestmentTax: React.FC = () => {
    const [dividends, setDividends] = useState('');
    const taxRate = 0.05; // 5%

    const taxAmount = useMemo(() => {
        const income = parseFormattedNumber(dividends);
        return income > 0 ? income * taxRate : 0;
    }, [dividends]);

    return (
        <div>
            <p className="text-slate-400 mb-4">Tính thuế suất 5% trên thu nhập từ đầu tư vốn, ví dụ như cổ tức được chia.</p>
            <div>
                <label htmlFor="dividends" className={labelStyles}>Cổ tức / Lợi nhuận được chia (VND)</label>
                <input type="text" id="dividends" value={dividends} onChange={handleNumericInputChange(setDividends)} className={`${inputStyles} md:w-1/2`} placeholder="50.000.000" inputMode="numeric" />
            </div>
            {dividends && (
                 <div className={`${resultStyles} text-xl text-teal-300`}>
                    Số thuế phải nộp: {formatCurrency(taxAmount)}
                </div>
            )}
        </div>
    )
};


const SecuritiesTransferTax: React.FC = () => {
    const [salePrice, setSalePrice] = useState('');
    const taxRate = 0.001; // 0.1%

    const taxAmount = useMemo(() => {
        const price = parseFormattedNumber(salePrice);
        return price > 0 ? price * taxRate : 0;
    }, [salePrice]);

    return (
        <div>
            <p className="text-slate-400 mb-4">Tính thuế suất 0.1% trên giá trị chuyển nhượng (giá bán) của mỗi lần giao dịch chứng khoán. <span className="font-semibold text-teal-400">Lưu ý:</span> Đề xuất áp thuế 20% trên lãi đã được Bộ Tài chính rút lại.</p>
            <div>
                <label htmlFor="salePrice" className={labelStyles}>Giá bán chứng khoán (VND)</label>
                <input type="text" id="salePrice" value={salePrice} onChange={handleNumericInputChange(setSalePrice)} className={`${inputStyles} md:w-1/2`} placeholder="100.000.000" inputMode="numeric"/>
            </div>
            {salePrice && (
                 <div className={`${resultStyles} text-xl text-teal-300`}>
                    Số thuế phải nộp: {formatCurrency(taxAmount)}
                </div>
            )}
        </div>
    )
};

const CryptoTax: React.FC = () => {
    const [salePrice, setSalePrice] = useState('');
    const taxRate = 0.001; // Proposed 0.1%

    const taxAmount = useMemo(() => {
        const price = parseFormattedNumber(salePrice);
        return price > 0 ? price * taxRate : 0;
    }, [salePrice]);

    return (
        <div>
            <p className="text-slate-400 mb-4">
                <span className="font-semibold text-orange-400">[DỰ THẢO]</span> Lần đầu tiên, cơ quan thuế đề xuất áp thuế đối với tài sản số. Mức thuế dự kiến là 0.1% trên doanh thu chuyển nhượng, tương tự như chứng khoán.
            </p>
            <div>
                <label htmlFor="cryptoSalePrice" className={labelStyles}>Giá trị giao dịch (VND)</label>
                <input type="text" id="cryptoSalePrice" value={salePrice} onChange={handleNumericInputChange(setSalePrice)} className={`${inputStyles} md:w-1/2`} placeholder="100.000.000" inputMode="numeric"/>
            </div>
            {salePrice && (
                 <div className={`${resultStyles} text-xl text-teal-300`}>
                    Số thuế phải nộp (dự kiến): {formatCurrency(taxAmount)}
                </div>
            )}
        </div>
    )
};


const CapitalContributionTax: React.FC = () => {
    const [salePrice, setSalePrice] = useState('');
    const [costPrice, setCostPrice] = useState('');
    const taxRate = 0.20; // 20%

    const { profit, taxAmount } = useMemo(() => {
        const sale = parseFormattedNumber(salePrice);
        const cost = parseFormattedNumber(costPrice);
        const profit = sale - cost;
        const taxAmount = profit > 0 ? profit * taxRate : 0;
        return { profit, taxAmount };
    }, [salePrice, costPrice]);

    return (
        <div>
            <p className="text-slate-400 mb-4">Tính thuế 20% trên thu nhập tính thuế (Giá bán - Giá mua) từ việc chuyển nhượng vốn góp. Không nộp thuế nếu chuyển nhượng ngang giá hoặc lỗ.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="capitalSalePrice" className={labelStyles}>Giá bán (VND)</label>
                    <input type="text" id="capitalSalePrice" value={salePrice} onChange={handleNumericInputChange(setSalePrice)} className={inputStyles} placeholder="1.200.000.000" inputMode="numeric"/>
                </div>
                <div>
                    <label htmlFor="capitalCostPrice" className={labelStyles}>Giá vốn/Giá mua (VND)</label>
                    <input type="text" id="capitalCostPrice" value={costPrice} onChange={handleNumericInputChange(setCostPrice)} className={inputStyles} placeholder="1.000.000.000" inputMode="numeric"/>
                </div>
            </div>
             {salePrice && costPrice && (
                 <div className={`${resultStyles} text-lg ${profit > 0 ? 'text-teal-300' : 'text-slate-300'}`}>
                    {profit > 0 ? `Lợi nhuận: ${formatCurrency(profit)} | Thuế phải nộp: ${formatCurrency(taxAmount)}` : "Không phát sinh thuế do không có lợi nhuận."}
                </div>
            )}
        </div>
    );
};

const RealEstateFee: React.FC = () => {
    const [govPrice, setGovPrice] = useState('');
    const taxRate = 0.005; // 0.5%

    const taxAmount = useMemo(() => {
        const price = parseFormattedNumber(govPrice);
        return price > 0 ? price * taxRate : 0;
    }, [govPrice]);
    
    return (
        <div>
            <p className="text-slate-400 mb-4">Tính lệ phí trước bạ 0.5% khi đăng ký quyền sở hữu nhà, quyền sử dụng đất. <span className="font-semibold">Lưu ý:</span> Mức giá tính lệ phí là giá theo Bảng giá đất của UBND tỉnh/thành phố, không phải giá trị hợp đồng.</p>
            <div>
                <label htmlFor="govPrice" className={labelStyles}>Giá tính LPTB theo Bảng giá nhà nước (VND)</label>
                 <input type="text" id="govPrice" value={govPrice} onChange={handleNumericInputChange(setGovPrice)} className={`${inputStyles} md:w-1/2`} placeholder="2.000.000.000" inputMode="numeric"/>
            </div>
             <p className="text-sm mt-2">
                <a href="#" className="text-teal-400 hover:text-teal-300" onClick={e => e.preventDefault()}>Tra cứu Bảng giá đất của 63 tỉnh thành (tính năng sắp ra mắt)</a>
            </p>
            {govPrice && (
                 <div className={`${resultStyles} text-xl text-teal-300`}>
                    Lệ phí trước bạ phải nộp: {formatCurrency(taxAmount)}
                </div>
            )}
        </div>
    )
};


const QuickTaxCalculators: React.FC = () => {
    const [activeTab, setActiveTab] = useState('business');

    const tabs = [
        { id: 'business', label: 'Từ Kinh doanh (Cá nhân)', component: <BusinessIncomeTax /> },
        { id: 'rental', label: 'Cho thuê Tài sản', component: <PropertyRentalTax /> },
        { id: 'investment', label: 'Từ Đầu tư Vốn', component: <CapitalInvestmentTax /> },
        { id: 'securities', label: 'Chuyển nhượng Cổ phiếu', component: <SecuritiesTransferTax /> },
        { id: 'crypto', label: 'Tài sản số (Crypto)', component: <CryptoTax /> },
        { id: 'capital', label: 'Chuyển nhượng Vốn góp', component: <CapitalContributionTax /> },
        { id: 'realestate', label: 'LPTB Nhà đất', component: <RealEstateFee /> },
    ];

    return (
        <div>
            <div className="border-b border-slate-700">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                     {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${activeTab === tab.id ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="pt-6">
                {tabs.find(tab => tab.id === activeTab)?.component}
            </div>
        </div>
    );
};

export default QuickTaxCalculators;