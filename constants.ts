import { PITBracket, BusinessCategory, CorporateSector, TaxIncentive } from './types';

// Personal Income Tax Constants (2026 Proposed)
export const PERSONAL_DEDUCTION_2026 = 15500000;
export const DEPENDENT_DEDUCTION_2026 = 6200000;
export const DEPENDENT_INCOME_LIMIT = 1000000;

export const PIT_BRACKETS_2026: PITBracket[] = [
  { limit: 10000000, rate: 0.05 },
  { limit: 30000000, rate: 0.15 },
  { limit: 60000000, rate: 0.25 },
  { limit: 100000000, rate: 0.30 },
  { limit: Infinity, rate: 0.35 },
];

// Personal Income Tax Constants (2025 Current)
export const PERSONAL_DEDUCTION_2025 = 11000000;
export const DEPENDENT_DEDUCTION_2025 = 4400000;

export const PIT_BRACKETS_2025: PITBracket[] = [
    { limit: 5000000, rate: 0.05 },
    { limit: 10000000, rate: 0.10 },
    { limit: 18000000, rate: 0.15 },
    { limit: 32000000, rate: 0.20 },
    { limit: 52000000, rate: 0.25 },
    { limit: 80000000, rate: 0.30 },
    { limit: Infinity, rate: 0.35 },
];

// Household Business (HKD) Constants
export const HKD_GROUP1_THRESHOLD = 200000000;
export const HKD_GROUP2_THRESHOLD = 3000000000;
export const HKD_E_INVOICE_THRESHOLD = 1000000000; // 1 tỷ VND

export const HKD_TAX_RATES: { [key in BusinessCategory]: { vat: number; pit: number } } = {
    [BusinessCategory.Distribution]: { vat: 0.01, pit: 0.005 },
    [BusinessCategory.ConsumerServices]: { vat: 0.05, pit: 0.02 },
    [BusinessCategory.LodgingAndCatering]: { vat: 0.05, pit: 0.02 }, // TT40: Khách sạn, massage, karaoke, ăn uống...
    [BusinessCategory.ConstructionNoMaterials]: { vat: 0.05, pit: 0.02 },
    [BusinessCategory.ConstructionWithMaterials]: { vat: 0.03, pit: 0.015 },
    [BusinessCategory.AssetRental]: { vat: 0.05, pit: 0.05 },
    [BusinessCategory.ProductionTransport]: { vat: 0.03, pit: 0.015 },
    [BusinessCategory.Brokerage]: { vat: 0.05, pit: 0.02 }, // TT40: Dịch vụ và xây dựng không bao thầu NVL
    [BusinessCategory.Other]: { vat: 0.02, pit: 0.01 }, // TT40: HĐ KD khác
};

// Maps business categories to the official indicator codes on the 01/CNKD form
export const HKD_INDICATOR_CODES: { [key in BusinessCategory]: string } = {
    [BusinessCategory.Distribution]: '[28]',
    [BusinessCategory.ConsumerServices]: '[29]',
    [BusinessCategory.LodgingAndCatering]: '[29]',
    [BusinessCategory.ConstructionNoMaterials]: '[29]',
    [BusinessCategory.ConstructionWithMaterials]: '[30]',
    [BusinessCategory.AssetRental]: '[29]', // Falls under services code
    [BusinessCategory.ProductionTransport]: '[30]',
    [BusinessCategory.Brokerage]: '[29]', // Falls under services code
    [BusinessCategory.Other]: '[31]',
};

// Corporate Income Tax (TNDN) Constants
export const STANDARD_CIT_RATE = 0.20;
export const VAT_NON_CASH_THRESHOLD = 5000000; // New rule from 01/07/2025

export const CORPORATE_TAX_INCENTIVES: TaxIncentive[] = [
    {
        sector: CorporateSector.Software,
        preferentialRate: 0.10,
        exemptionYears: 4,
        reductionYears: 9,
        conditions: "Dự án mới sản xuất phần mềm. Miễn 4 năm, giảm 50% trong 9 năm tiếp theo kể từ khi có thu nhập chịu thuế.",
    },
    {
        sector: CorporateSector.HighTech,
        preferentialRate: 0.10,
        exemptionYears: 4,
        reductionYears: 9,
        conditions: "Dự án mới trong lĩnh vực CNC, công nghiệp hỗ trợ. Miễn 4 năm, giảm 50% trong 9 năm tiếp theo.",
    },
     {
        sector: CorporateSector.HighTechAgriculture,
        preferentialRate: 0.10,
        exemptionYears: 4,
        reductionYears: 9,
        conditions: "Dự án tại địa bàn KTXH đặc biệt khó khăn, khu công nghệ cao. Miễn 4 năm, giảm 50% trong 9 năm tiếp theo.",
    },
    {
        sector: CorporateSector.SocialEnterprise,
        preferentialRate: 0.10,
        exemptionYears: 4,
        reductionYears: 9,
        conditions: "Doanh nghiệp xã hội sử dụng >51% lợi nhuận để tái đầu tư. Miễn/giảm thuế áp dụng cho phần lợi nhuận này.",
    },
     {
        sector: CorporateSector.Startup,
        preferentialRate: -1, // Not rate-based, but exemption/reduction applies
        exemptionYears: 2,
        reductionYears: 4,
        conditions: "Doanh nghiệp Khởi nghiệp Sáng tạo được miễn thuế 02 năm đầu và giảm 50% trong 04 năm tiếp theo.",
    },
    {
        sector: CorporateSector.SME_Tier1,
        preferentialRate: 0.15,
        exemptionYears: 3,
        reductionYears: 0,
        conditions: "Doanh nghiệp Nhỏ và Vừa (SME) có doanh thu năm không quá 3 tỷ đồng được miễn thuế 03 năm đầu và áp dụng thuế suất 15% (thay vì 20%) từ 01/10/2025.",
    },
     {
        sector: CorporateSector.SME_Tier2,
        preferentialRate: 0.17,
        exemptionYears: 3,
        reductionYears: 0,
        conditions: "Doanh nghiệp Nhỏ và Vừa (SME) có doanh thu năm trên 3 tỷ đến 50 tỷ đồng được miễn thuế 03 năm đầu và áp dụng thuế suất 17% (thay vì 20%) từ 01/10/2025.",
    }
];


// E-commerce Tax Withholding Rates
export const ECOMMERCE_GOODS_RATE = { vat: 0.01, pit: 0.005, total: 0.015 };
export const ECOMMERCE_SERVICES_RATE = { vat: 0.05, pit: 0.02, total: 0.07 };