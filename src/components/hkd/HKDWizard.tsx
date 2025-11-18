import React, { useState } from 'react';
import Card from '../ui/Card';
import { HKDGroup, BusinessSector, BusinessCategory } from '../../types';
import { HKD_GROUP1_THRESHOLD, HKD_GROUP2_THRESHOLD, HKD_TAX_RATES } from '../../constants';

interface HKDWizardProps {
  onGroupSelect: (group: HKDGroup, sector: BusinessSector) => void;
}

const parseVND = (value: string): number => {
    return Number(String(value).replace(/\./g, ''));
};

const formatVND = (value: number | string): string => {
    if (value === '' || value === null || isNaN(Number(value))) return '';
    return new Intl.NumberFormat('vi-VN').format(Number(value));
};

interface DetailedChoice {
    label: string;
    description: string;
    category: BusinessCategory;
    mappedSector: BusinessSector;
}

const HKDWizard: React.FC<HKDWizardProps> = ({ onGroupSelect }) => {
    const [revenueStr, setRevenueStr] = useState('');
    const [selectedChoice, setSelectedChoice] = useState<DetailedChoice | null>(null);

    const handleSubmit = () => {
        const numRevenue = parseVND(revenueStr);
        if (isNaN(numRevenue) || numRevenue <= 0 || !selectedChoice) {
            alert("Vui lòng nhập doanh thu dự kiến và chọn một lĩnh vực kinh doanh.");
            return;
        }

        let group: HKDGroup;
        if (numRevenue <= HKD_GROUP1_THRESHOLD) {
            group = HKDGroup.Group1;
        } else if (numRevenue <= HKD_GROUP2_THRESHOLD) {
            group = HKDGroup.Group2;
        } else {
            group = HKDGroup.Group3;
        }

        localStorage.setItem('hkd-primary-category', selectedChoice.category);
        onGroupSelect(group, selectedChoice.mappedSector);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        setRevenueStr(rawValue === '' ? '' : formatVND(rawValue));
    };

    const detailedSectorChoices = [
        {
            groupTitle: 'Phân phối, Cung cấp Hàng hóa',
            items: [
                {
                    label: 'Bán lẻ, Tạp hóa, Thương mại',
                    description: 'Cửa hàng tiện lợi, bán hàng online, siêu thị mini, bán buôn...',
                    category: BusinessCategory.Distribution,
                    mappedSector: BusinessSector.RetailRestaurant,
                }
            ]
        },
        {
            groupTitle: 'Dịch vụ',
            items: [
                {
                    label: 'Ăn uống, Lưu trú, Du lịch',
                    description: 'Quán ăn, nhà hàng, quán cafe, khách sạn, homestay, đại lý tour...',
                    category: BusinessCategory.LodgingAndCatering,
                    mappedSector: BusinessSector.RetailRestaurant,
                },
                {
                    label: 'Dịch vụ Tiêu dùng & Sửa chữa',
                    description: 'Sửa xe, cắt tóc, spa, giặt là, dịch vụ vệ sinh...',
                    category: BusinessCategory.ConsumerServices,
                    mappedSector: BusinessSector.RetailRestaurant,
                },
                {
                    label: 'Dịch vụ Chuyên môn, Cho thuê Tài sản',
                    description: 'Tư vấn, thiết kế, môi giới, cho thuê nhà, xe, mặt bằng...',
                    category: BusinessCategory.AssetRental,
                    mappedSector: BusinessSector.Services,
                },
                 {
                    label: 'Xây dựng (không bao thầu nguyên vật liệu)',
                    description: 'Cung cấp dịch vụ nhân công xây dựng, lắp đặt, sửa chữa.',
                    category: BusinessCategory.ConstructionNoMaterials,
                    mappedSector: BusinessSector.Services
                },
            ]
        },
        {
            groupTitle: 'Sản xuất, Xây dựng, Vận tải',
            items: [
                 {
                    label: 'Sản xuất, Xây dựng, Vận tải',
                    description: 'Xưởng gia công, thợ xây dựng, dịch vụ vận chuyển hàng hóa...',
                    category: BusinessCategory.ProductionTransport,
                    mappedSector: BusinessSector.Manufacturing,
                },
                 {
                    label: 'Xây dựng (có bao thầu nguyên vật liệu)',
                    description: 'Nhận thầu trọn gói cả nhân công và vật tư để xây dựng.',
                    category: BusinessCategory.ConstructionWithMaterials,
                    mappedSector: BusinessSector.Manufacturing,
                },
            ]
        },
         {
            groupTitle: 'Ngành nghề khác',
            items: [
                {
                    label: 'Ngành nghề khác',
                    description: 'Các hoạt động kinh doanh không thuộc nhóm trên.',
                    category: BusinessCategory.Other,
                    mappedSector: BusinessSector.Other,
                },
            ]
        }
    ];


    return (
        <Card className="max-w-3xl mx-auto">
             <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2 text-center">Chào bạn, người kinh doanh!</h2>
                <p className="text-slate-400 mb-6 text-center">Để chúng tôi có thể hỗ trợ tốt nhất, vui lòng cung cấp hai thông tin dưới đây.</p>

                {/* Revenue Input */}
                <div className="mb-8">
                    <label className="block text-lg font-semibold text-slate-200 mb-3 text-center">1. Doanh thu dự kiến trong một năm của bạn là bao nhiêu?</label>
                    <div className="flex flex-col items-center">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                value={revenueStr}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: 500.000.000"
                                className="w-full text-center text-lg p-3 bg-slate-900 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-100 transition"
                                inputMode="numeric"
                                autoFocus
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">VND</span>
                        </div>
                         <div className="mt-3 text-xs text-slate-500 space-y-1 text-center">
                            <p><strong>Nhóm 1:</strong> &le; {formatVND(HKD_GROUP1_THRESHOLD)} VND (Miễn thuế)</p>
                            <p><strong>Nhóm 2:</strong> &le; {formatVND(HKD_GROUP2_THRESHOLD)} VND (Nộp thuế %)</p>
                            <p><strong>Nhóm 3:</strong> &gt; {formatVND(HKD_GROUP2_THRESHOLD)} VND (Như Doanh nghiệp)</p>
                        </div>
                    </div>
                </div>

                {/* Sector Selection */}
                <div className="border-t border-slate-700/70 pt-8">
                    <h2 className="text-lg font-semibold text-slate-100 mb-4 text-center">2. Lĩnh vực kinh doanh chính của bạn là gì?</h2>
                     <div className="space-y-6">
                        {detailedSectorChoices.map(group => (
                            <div key={group.groupTitle}>
                                <h3 className="text-lg font-semibold text-teal-400 mb-3 text-left">{group.groupTitle}</h3>
                                <div className="space-y-3">
                                    {group.items.map(choice => {
                                        const rates = HKD_TAX_RATES[choice.category];
                                        const formattedRates = `VAT: ${rates.vat * 100}% | TNCN: ${rates.pit * 100}%`;
                                        const isSelected = selectedChoice?.category === choice.category;
                                        return (
                                            <button
                                                key={choice.label}
                                                onClick={() => setSelectedChoice(choice)}
                                                className={`w-full text-left p-4 border rounded-lg hover:bg-slate-700/80 transition text-slate-200 bg-slate-800/50 ${isSelected ? 'ring-2 ring-teal-400 border-teal-400' : 'border-slate-700'}`}
                                            >
                                                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                                    <div>
                                                        <p className="font-semibold text-slate-100">{choice.label}</p>
                                                        <p className="text-sm text-slate-400 mt-1">{choice.description}</p>
                                                    </div>
                                                     <p className="text-xs sm:text-sm text-teal-300 font-mono bg-slate-900/70 px-2 py-1 rounded mt-2 sm:mt-0 whitespace-nowrap">{formattedRates}</p>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-slate-700/70">
                     <button
                        onClick={handleSubmit}
                        disabled={!revenueStr || !selectedChoice}
                        className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition disabled:bg-slate-500 disabled:cursor-not-allowed"
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default HKDWizard;