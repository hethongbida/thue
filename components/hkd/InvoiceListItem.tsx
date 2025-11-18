import React from 'react';
import { InputInvoice, LineItem } from '../../types';

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(Math.round(value));

interface InvoiceListItemProps {
    invoice: InputInvoice;
}

const InvoiceListItem: React.FC<InvoiceListItemProps> = ({ invoice }) => {
    return (
        <li className="bg-slate-800 p-4 rounded-lg flex items-start gap-4">
            {invoice.imageUrl && <img src={invoice.imageUrl} alt="Hóa đơn" className="w-16 h-16 object-cover rounded-md flex-shrink-0" />}
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-slate-200">{invoice.supplierName}</p>
                        <p className="text-sm text-slate-400">{invoice.expenseCategory}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg text-orange-400">{formatCurrency(invoice.amount)}</p>
                        <p className="text-sm text-slate-500">{new Date(invoice.date).toLocaleDateString('vi-VN')}</p>
                    </div>
                </div>
                <details className="mt-2 text-sm">
                    <summary className="cursor-pointer text-slate-500">Xem chi tiết ({invoice.lineItems.length})</summary>
                    <ul className="mt-2 space-y-1 pl-4 border-l border-slate-700">
                        {invoice.lineItems.map((li: LineItem) => (
                            <li key={li.id} className="flex justify-between text-slate-400">
                                <span>{li.name} ({li.quantity} x {formatCurrency(li.unitPrice)})</span>
                                <span>{formatCurrency(li.quantity * li.unitPrice)}</span>
                            </li>
                        ))}
                    </ul>
                </details>
            </div>
        </li>
    );
};

export default InvoiceListItem;
