import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { CorporateSector } from '../../types';
import { CORPORATE_TAX_INCENTIVES, STANDARD_CIT_RATE, VAT_NON_CASH_THRESHOLD } from '../../constants';

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

const sectorGroups: Record<string, CorporateSector[]> = {
    "Doanh nghiệp Nhỏ & Vừa (SME), Startup": [
        CorporateSector.SME_Tier1,
        CorporateSector.SME_Tier2,
        CorporateSector.Startup,
    ],
    "Lĩnh vực Ưu đãi Đặc biệt khác": [
        CorporateSector.Software,
        CorporateSector.HighTech,
        CorporateSector.HighTechAgriculture,
        CorporateSector.SocialEnterprise,
    ],
    "Ngành nghề Thông thường": [
        CorporateSector.Standard,
    ],
    "Nông, Lâm nghiệp và Thủy sản": [
        CorporateSector.CropAndAnimalProduction,
        CorporateSector.ForestryAndLogging,
        CorporateSector.FishingAndAquaculture,
    ],
    "Khai khoáng": [
        CorporateSector.MiningOfCoal,
        CorporateSector.MiningOfCrudePetroleumAndNaturalGas,
        CorporateSector.MiningOfMetalOres,
        CorporateSector.OtherMiningAndQuarrying,
        CorporateSector.MiningSupportServiceActivities,
    ],
    "Công nghiệp Chế biến, Chế tạo": [
        CorporateSector.FoodProcessing,
        CorporateSector.BeverageProduction,
        CorporateSector.TextileProduction,
        CorporateSector.WoodProcessing,
        CorporateSector.PaperProduction,
        CorporateSector.PrintingAndReproduction,
        CorporateSector.CokeAndRefinedPetroleum,
        CorporateSector.ChemicalProduction,
        CorporateSector.PharmaceuticalProduction,
        CorporateSector.RubberAndPlastic,
        CorporateSector.NonMetallicMineral,
        CorporateSector.BasicMetalProduction,
        CorporateSector.FabricatedMetal,
        CorporateSector.ElectronicsAndOptics,
        CorporateSector.ElectricalEquipment,
        CorporateSector.MachineryAndEquipment,
        CorporateSector.MotorVehicleProduction,
        CorporateSector.OtherTransportEquipment,
        CorporateSector.FurnitureProduction,
        CorporateSector.OtherManufacturing,
        CorporateSector.RepairAndInstallationOfMachinery,
    ],
    "Cung cấp Nước, Năng lượng & Xử lý rác thải": [
        CorporateSector.ElectricitySupply,
        CorporateSector.WaterCollectionAndSupply,
        CorporateSector.WasteCollectionAndTreatment,
    ],
    "Xây dựng": [
        CorporateSector.BuildingConstruction,
        CorporateSector.CivilEngineeringConstruction,
        CorporateSector.SpecializedConstructionActivities,
    ],
    "Thương mại, Bán buôn, Bán lẻ": [
        CorporateSector.WholesaleTrade,
        CorporateSector.RetailTrade,
        CorporateSector.RepairOfMotorVehicles,
    ],
    "Vận tải & Kho bãi": [
        CorporateSector.LandTransport,
        CorporateSector.WaterwayTransport,
        CorporateSector.AirTransport,
        CorporateSector.WarehousingAndSupport,
        CorporateSector.PostalAndCourier,
    ],
     "Dịch vụ Lưu trú và Ăn uống": [
        CorporateSector.Accommodation,
        CorporateSector.FoodAndBeverageService,
    ],
    "Thông tin và Truyền thông": [
        CorporateSector.PublishingActivities,
        CorporateSector.FilmAndBroadcasting,
        CorporateSector.Telecommunications,
        CorporateSector.ITAndComputerServices,
        CorporateSector.InformationService,
    ],
    "Tài chính, Ngân hàng và Bảo hiểm": [
        CorporateSector.FinancialService,
    ],
    "Kinh doanh Bất động sản": [
        CorporateSector.RealEstate,
    ],
    "Dịch vụ Chuyên môn, Khoa học & Công nghệ": [
        CorporateSector.LegalAndAccounting,
        CorporateSector.ManagementConsultancy,
        CorporateSector.ArchitecturalAndEngineering,
        CorporateSector.ScientificResearch,
        CorporateSector.AdvertisingAndMarketResearch,
        CorporateSector.OtherProfessionalScientific,
        CorporateSector.VeterinaryActivities,
    ],
    "Dịch vụ Hành chính và Hỗ trợ": [
        CorporateSector.RentalOfMachinery,
        CorporateSector.EmploymentActivities,
        CorporateSector.TravelAgency,
        CorporateSector.SecurityAndInvestigation,
        CorporateSector.BuildingAndLandscape,
        CorporateSector.OfficeAdminAndSupport,
    ],
    "Giáo dục và Đào tạo": [
        CorporateSector.Education,
    ],
    "Y tế và Hoạt động Xã hội": [
        CorporateSector.HumanHealth,
        CorporateSector.ResidentialCare,
        CorporateSector.SocialWork,
    ],
    "Nghệ thuật, Vui chơi và Giải trí": [
        CorporateSector.ArtsAndEntertainment,
        CorporateSector.LibrariesAndMuseums,
        CorporateSector.GamblingAndBetting,
        CorporateSector.SportsAndRecreation,
    ],
     "Dịch vụ khác": [
        CorporateSector.MembershipOrganizations,
        CorporateSector.RepairOfComputers,
        CorporateSector.OtherPersonalServices,
    ]
};


const CorporateTaxModule: React.FC = () => {
    const [revenue, setRevenue] = useState('');
    const [expenses, setExpenses] = useState('');
    const [selectedSector, setSelectedSector] = useState<CorporateSector>(CorporateSector.SME_Tier1);

    const incentive = useMemo(() => {
        return CORPORATE_TAX_INCENTIVES.find(inc => inc.sector === selectedSector);
    }, [selectedSector]);
    
    const taxRate = incentive?.preferentialRate === -1 ? STANDARD_CIT_RATE : (incentive?.preferentialRate ?? STANDARD_CIT_RATE);

    const { taxableIncome, taxAmount } = useMemo(() => {
        const numRevenue = parseFormattedNumber(revenue);
        const numExpenses = parseFormattedNumber(expenses);
        const taxableIncome = Math.max(0, numRevenue - numExpenses);
        
        const taxAmount = taxableIncome * taxRate;
        return { taxableIncome, taxAmount };
    }, [revenue, expenses, taxRate]);

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Lập kế hoạch Thuế TNDN</h1>
                <p className="mt-2 text-lg text-slate-400">"Cú xoay" chiến lược hậu GMT và các quy định tuân thủ mới.</p>
            </div>
            
            <div className="my-6 p-4 bg-red-900/50 border-l-4 border-red-500 text-red-300 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h4 className="font-bold uppercase text-red-200">Cảnh báo "Sốc Tuân thủ" (Hiệu lực 01/07/2025)</h4>
                        <p className="text-sm mt-1">
                           <strong>Bãi bỏ ngưỡng 20 triệu tiền mặt cho khấu trừ VAT.</strong> Kể từ 01/07/2025, <span className="font-semibold">TẤT CẢ</span> các giao dịch B2B, không phân biệt giá trị, bắt buộc phải có chứng từ thanh toán <span className="font-semibold">không dùng tiền mặt</span> mới đủ điều kiện khấu trừ VAT.
                           <br/>
                           <span className="italic">Hệ quả kép: Quy định này gián tiếp siết chặt cả chi phí được trừ của Thuế TNDN.</span>
                        </p>
                    </div>
                </div>
            </div>

            <Card className="max-w-4xl mx-auto">
                 <h2 className="text-2xl font-bold mb-6 text-slate-100">Công cụ Ước tính & Tra cứu Ưu đãi Thuế TNDN</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <label htmlFor="sector" className="block text-sm font-medium text-slate-300">1. Lựa chọn Lĩnh vực/Ngành nghề kinh doanh</label>
                        <select
                            id="sector"
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value as CorporateSector)}
                            className="mt-1 block w-full border border-slate-600 rounded-md shadow-sm p-2 bg-slate-700 text-slate-100 focus:ring-teal-500 focus:border-teal-500"
                        >
                           {Object.entries(sectorGroups).map(([groupLabel, sectors]) => (
                                <optgroup label={`--- ${groupLabel} ---`} key={groupLabel}>
                                    {sectors.map(sector => (
                                        <option key={sector} value={sector}>{sector}</option>
                                    ))}
                                </optgroup>
                           ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="citRevenue" className="block text-sm font-medium text-slate-300">2. Tổng Doanh thu (VND)</label>
                        <input
                            type="text"
                            id="citRevenue"
                            value={revenue}
                            onChange={handleNumericInputChange(setRevenue)}
                            className="mt-1 block w-full border border-slate-600 rounded-md shadow-sm p-2 bg-slate-700 text-slate-100 focus:ring-teal-500 focus:border-teal-500"
                            placeholder="2.500.000.000"
                            inputMode="numeric"
                        />
                    </div>
                    <div>
                        <label htmlFor="citExpenses" className="block text-sm font-medium text-slate-300">3. Tổng Chi phí được trừ (VND)</label>
                        <input
                            type="text"
                            id="citExpenses"
                            value={expenses}
                            onChange={handleNumericInputChange(setExpenses)}
                            className="mt-1 block w-full border border-slate-600 rounded-md shadow-sm p-2 bg-slate-700 text-slate-100 focus:ring-teal-500 focus:border-teal-500"
                            placeholder="1.800.000.000"
                            inputMode="numeric"
                        />
                    </div>
                </div>

                 <div className="mb-8 p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                    <h3 className="text-lg font-bold text-teal-400 mb-2">Thông tin Ưu đãi Thuế áp dụng</h3>
                    {incentive ? (
                        <div className="space-y-2 text-slate-300">
                             <p><strong>Thuế suất ưu đãi:</strong> <span className="text-xl font-bold text-teal-300">{incentive.preferentialRate === -1 ? 'Theo mức phổ thông' : `${(incentive.preferentialRate * 100).toFixed(0)}%`}</span> (thay vì {STANDARD_CIT_RATE * 100}%)</p>
                             <p><strong>Miễn thuế:</strong> {incentive.exemptionYears} năm</p>
                             <p><strong>Giảm 50% thuế:</strong> {incentive.reductionYears} năm tiếp theo</p>
                             <p className="text-sm"><strong>Điều kiện:</strong> {incentive.conditions}</p>
                        </div>
                    ) : (
                        <p className="text-slate-400">Không có ưu đãi đặc biệt. Áp dụng thuế suất TNDN phổ thông là <span className="font-bold">{STANDARD_CIT_RATE * 100}%</span>.</p>
                    )}
                </div>

                {revenue && expenses && (
                    <div className="text-center p-6 rounded-lg bg-slate-900 border-t-4 border-teal-500 space-y-2">
                        <p className="text-lg text-slate-300">Thu nhập tính thuế:</p> 
                        <p className="text-3xl font-bold text-slate-100">{formatCurrency(taxableIncome)}</p>
                        <p className="text-lg text-slate-300 pt-4">Số thuế TNDN ước tính (với thuế suất {taxRate * 100}%):</p>
                        <p className="text-4xl font-extrabold text-teal-400">{formatCurrency(taxAmount)}</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default CorporateTaxModule;