export type AppView = 'home' | 'hkd' | 'pit' | 'ecommerce' | 'corporate';

export enum HKDGroup {
  Group1 = 'Group 1 (<= 200M VND/year)',
  Group2 = 'Group 2 (200M - 3B VND/year)',
  Group3 = 'Group 3 (> 3B VND/year)',
  Undetermined = 'Undetermined',
}

export enum BusinessSector {
    RetailRestaurant = 'Bán lẻ, Ăn uống, Khách sạn, Dịch vụ tiêu dùng',
    Manufacturing = 'Sản xuất, Xây dựng, Vận tải',
    Services = 'Dịch vụ chuyên nghiệp, Cho thuê tài sản',
    Other = 'Ngành nghề khác'
}

export enum CorporateSector {
    // Special Incentivized Sectors
    Software = 'Sản xuất phần mềm',
    HighTech = 'Công nghệ cao, Công nghiệp hỗ trợ',
    HighTechAgriculture = 'Nông nghiệp ứng dụng công nghệ cao',
    SocialEnterprise = 'Doanh nghiệp xã hội',
    Startup = 'Doanh nghiệp Khởi nghiệp Sáng tạo',
    SME_Tier1 = 'SME - Doanh thu <= 3 tỷ/năm',
    SME_Tier2 = 'SME - Doanh thu > 3 tỷ đến 50 tỷ/năm',


    // Standard Sectors (VSIC based)
    Standard = 'Ngành nghề thông thường (không ưu đãi)',
    
    // Section A: AGRICULTURE, FORESTRY AND FISHING
    CropAndAnimalProduction = 'Nông nghiệp và hoạt động dịch vụ có liên quan',
    ForestryAndLogging = 'Lâm nghiệp và hoạt động dịch vụ có liên quan',
    FishingAndAquaculture = 'Khai thác, nuôi trồng thủy sản',

    // Section B: MINING AND QUARRYING
    MiningOfCoal = 'Khai thác than cứng và than non',
    MiningOfCrudePetroleumAndNaturalGas = 'Khai thác dầu thô và khí đốt tự nhiên',
    MiningOfMetalOres = 'Khai thác quặng kim loại',
    OtherMiningAndQuarrying = 'Khai khoáng khác (đá, cát, sỏi, đất sét...)',
    MiningSupportServiceActivities = 'Hoạt động dịch vụ hỗ trợ khai khoáng',

    // Section C: MANUFACTURING
    FoodProcessing = 'Chế biến thực phẩm',
    BeverageProduction = 'Sản xuất đồ uống',
    TextileProduction = 'Sản xuất vải, trang phục, da',
    WoodProcessing = 'Chế biến gỗ và sản phẩm từ gỗ, tre, nứa',
    PaperProduction = 'Sản xuất giấy và sản phẩm từ giấy',
    PrintingAndReproduction = 'In, sao chép bản ghi các loại',
    CokeAndRefinedPetroleum = 'Sản xuất than cốc, sản phẩm dầu mỏ tinh chế',
    ChemicalProduction = 'Sản xuất hóa chất và sản phẩm hóa chất',
    PharmaceuticalProduction = 'Sản xuất thuốc, hóa dược và dược liệu',
    RubberAndPlastic = 'Sản xuất sản phẩm từ cao su và plastic',
    NonMetallicMineral = 'Sản xuất sản phẩm từ khoáng phi kim loại khác',
    BasicMetalProduction = 'Sản xuất kim loại',
    FabricatedMetal = 'Sản xuất sản phẩm từ kim loại đúc sẵn',
    ElectronicsAndOptics = 'Sản xuất sản phẩm điện tử, máy vi tính và sản phẩm quang học',
    ElectricalEquipment = 'Sản xuất thiết bị điện',
    MachineryAndEquipment = 'Sản xuất máy móc, thiết bị chưa được phân vào đâu',
    MotorVehicleProduction = 'Sản xuất ô tô, xe máy, xe có động cơ khác',
    OtherTransportEquipment = 'Sản xuất phương tiện vận tải khác',
    FurnitureProduction = 'Sản xuất giường, tủ, bàn, ghế',
    OtherManufacturing = 'Công nghiệp chế biến, chế tạo khác',
    RepairAndInstallationOfMachinery = 'Sửa chữa, bảo dưỡng và lắp đặt máy móc và thiết bị',

    // Section D: ELECTRICITY, GAS, STEAM AND AIR CONDITIONING SUPPLY
    ElectricitySupply = 'Sản xuất và phân phối điện, khí đốt, nước nóng, hơi nước',

    // Section E: WATER SUPPLY; SEWERAGE, WASTE MANAGEMENT
    WaterCollectionAndSupply = 'Khai thác, xử lý và cung cấp nước',
    WasteCollectionAndTreatment = 'Hoạt động thu gom và xử lý rác thải',

    // Section F: CONSTRUCTION
    BuildingConstruction = 'Xây dựng nhà các loại',
    CivilEngineeringConstruction = 'Xây dựng công trình kỹ thuật dân dụng',
    SpecializedConstructionActivities = 'Hoạt động xây dựng chuyên dụng',

    // Section G: WHOLESALE AND RETAIL TRADE; REPAIR OF MOTOR VEHICLES
    WholesaleTrade = 'Bán buôn (trừ ô tô, mô tô, xe máy)',
    RetailTrade = 'Bán lẻ (trừ ô tô, mô tô, xe máy)',
    RepairOfMotorVehicles = 'Bán, sửa chữa ô tô, mô tô, xe máy và xe có động cơ khác',

    // Section H: TRANSPORTATION AND STORAGE
    LandTransport = 'Vận tải đường bộ, đường sắt',
    WaterwayTransport = 'Vận tải đường thủy',
    AirTransport = 'Vận tải hàng không',
    WarehousingAndSupport = 'Kho bãi và các hoạt động hỗ trợ cho vận tải',
    PostalAndCourier = 'Bưu chính và chuyển phát',

    // Section I: ACCOMMODATION AND FOOD SERVICE ACTIVITIES
    Accommodation = 'Dịch vụ lưu trú',
    FoodAndBeverageService = 'Dịch vụ ăn uống',

    // Section J: INFORMATION AND COMMUNICATION
    PublishingActivities = 'Hoạt động xuất bản',
    FilmAndBroadcasting = 'Hoạt động điện ảnh, sản xuất chương trình truyền hình, ghi âm',
    Telecommunications = 'Hoạt động viễn thông',
    ITAndComputerServices = 'Lập trình máy vi tính, dịch vụ tư vấn và các hoạt động khác liên quan đến máy vi tính',
    InformationService = 'Hoạt động dịch vụ thông tin',

    // Section K: FINANCIAL, BANKING AND INSURANCE ACTIVITIES
    FinancialService = 'Hoạt động tài chính, ngân hàng và bảo hiểm',

    // Section L: REAL ESTATE ACTIVITIES
    RealEstate = 'Hoạt động kinh doanh bất động sản',

    // Section M: PROFESSIONAL, SCIENTIFIC AND TECHNICAL ACTIVITIES
    LegalAndAccounting = 'Hoạt động pháp luật, kế toán và kiểm toán',
    ManagementConsultancy = 'Hoạt động của trụ sở văn phòng; hoạt động tư vấn quản lý',
    ArchitecturalAndEngineering = 'Hoạt động kiến trúc; kiểm tra và phân tích kỹ thuật',
    ScientificResearch = 'Nghiên cứu khoa học và phát triển',
    AdvertisingAndMarketResearch = 'Quảng cáo, nghiên cứu thị trường',
    OtherProfessionalScientific = 'Hoạt động chuyên môn, khoa học và công nghệ khác',
    VeterinaryActivities = 'Hoạt động thú y',

    // Section N: ADMINISTRATIVE AND SUPPORT SERVICE ACTIVITIES
    RentalOfMachinery = 'Cho thuê máy móc, thiết bị, đồ dùng',
    EmploymentActivities = 'Hoạt động dịch vụ lao động và việc làm',
    TravelAgency = 'Hoạt động của các đại lý du lịch, kinh doanh tour du lịch',
    SecurityAndInvestigation = 'Dịch vụ bảo vệ và điều tra',
    BuildingAndLandscape = 'Dịch vụ vệ sinh nhà cửa và các công trình khác',
    OfficeAdminAndSupport = 'Dịch vụ hành chính và hỗ trợ văn phòng',

    // Section P: EDUCATION AND TRAINING
    Education = 'Giáo dục và đào tạo',

    // Section Q: HUMAN HEALTH AND SOCIAL WORK ACTIVITIES
    HumanHealth = 'Hoạt động y tế',
    ResidentialCare = 'Hoạt động chăm sóc, điều dưỡng tập trung',
    SocialWork = 'Hoạt động trợ giúp xã hội',

    // Section R: ARTS, ENTERTAINMENT AND RECREATION
    ArtsAndEntertainment = 'Hoạt động sáng tác, nghệ thuật và giải trí',
    LibrariesAndMuseums = 'Hoạt động của thư viện, lưu trữ, bảo tàng',
    GamblingAndBetting = 'Hoạt động xổ số, cá cược và đánh bạc',
    SportsAndRecreation = 'Hoạt động thể thao, vui chơi và giải trí',

    // Section S: OTHER SERVICE ACTIVITIES
    MembershipOrganizations = 'Hoạt động của các hiệp hội, tổ chức khác',
    RepairOfComputers = 'Sửa chữa máy vi tính, đồ dùng cá nhân và gia đình',
    OtherPersonalServices = 'Hoạt động dịch vụ phục vụ cá nhân khác (giặt là, cắt tóc, gội đầu...)'
}


export interface TaxIncentive {
    sector: CorporateSector;
    preferentialRate: number;
    exemptionYears: number;
    reductionYears: number; // Years with 50% reduction
    conditions: string;
}


export interface PITBracket {
  limit: number;
  rate: number;
}

export interface Dependent {
  id: string;
  name: string;
  monthlyIncome: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isStreaming?: boolean;
}

export enum BusinessCategory {
    Distribution = 'Phân phối, cung cấp hàng hóa (bán lẻ, bán buôn, tạp hóa)',
    LodgingAndCatering = 'Dịch vụ lưu trú, ăn uống (nhà hàng, khách sạn, quán ăn, cafe)',
    ConsumerServices = 'Dịch vụ khác (sửa chữa, spa, cắt tóc, giặt là, cho thuê LĐ)',
    ConstructionNoMaterials = 'Xây dựng (không bao thầu nguyên vật liệu)',
    ConstructionWithMaterials = 'Xây dựng (có bao thầu nguyên vật liệu)',
    AssetRental = 'Cho thuê tài sản (nhà, mặt bằng, xe, tài sản khác)',
    ProductionTransport = 'Sản xuất, vận tải, dịch vụ có gắn với hàng hóa',
    Brokerage = 'Đại lý, môi giới',
    Other = 'Hoạt động kinh doanh khác',
}

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    category: BusinessCategory;
    description: string;
}

export interface UserProfile {
    taxCode: string;
    personalId?: string; // Định danh cá nhân (CCCD)
    name: string;
    address: string;
    district: string;
    city: string;
    phone: string;
    email: string;
    taxDepartment: string; // Cơ quan thuế
    hkdSector?: BusinessSector; // Ngành nghề chính của HKD
}

export enum ExpenseCategory {
    RawMaterials = 'Nguyên vật liệu, hàng hóa',
    ToolsAndSupplies = 'Công cụ, dụng cụ',
    Rent = 'Chi phí thuê mặt bằng',
    Staff = 'Chi phí nhân viên',
    Marketing = 'Chi phí marketing, quảng cáo',
    OfficeSupplies = 'Chi phí văn phòng phẩm',
    Utilities = 'Điện, nước, internet',
    Transportation = 'Chi phí vận chuyển, đi lại',
    Other = 'Chi phí khác',
}

export interface LineItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
}


export interface InputInvoice {
    id: string;
    date: string;
    supplierName: string;
    supplierTaxCode: string;
    description: string;
    amount: number; // Total amount, calculated from line items
    expenseCategory: ExpenseCategory;
    lineItems: LineItem[];
    imageUrl?: string; // Base64 or URL of the uploaded image
}


export interface PurchaseListItem {
    id: string;
    itemName: string;
    quantity: string;
    unit: string;
    price: number;
    amount: number;
}