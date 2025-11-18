import React from 'react';
import Card from '../ui/Card';
import PITCalculator from '../pit/PITCalculator';
import DependentManager from '../pit/DependentManager';
import QuickTaxCalculators from '../pit/QuickTaxCalculators';

const PITModule: React.FC = () => {
    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Công cụ Thuế Thu nhập Cá nhân (TNCN)</h1>
                <p className="mt-2 text-lg text-slate-400">Tính toán, so sánh và quản lý các nghĩa vụ thuế cá nhân của bạn.</p>
            </div>
            
            <Card>
                <h2 className="text-2xl font-bold mb-4 text-slate-100">So sánh Lương 2025 vs 2026</h2>
                <PITCalculator />
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-4 text-slate-100">Quản lý Người phụ thuộc (NPT)</h2>
                <DependentManager />
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-4 text-slate-100">Các công cụ tính thuế nhanh khác</h2>
                <QuickTaxCalculators />
            </Card>
        </div>
    );
};

export default PITModule;