import React from 'react';
import Card from '../ui/Card';

interface HKDGroup3InfoProps {
    onReset: () => void;
}

const HKDGroup3Info: React.FC<HKDGroup3InfoProps> = ({ onReset }) => {
    return (
        <div>
            <div className="mb-4 text-center">
                <button onClick={onReset} className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                    &larr; Quay lại chọn nhóm
                </button>
            </div>
            <Card className="max-w-2xl mx-auto text-center">
                <div className="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-teal-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715.07-2.846a.75.75 0 0 1 .92.058l1.458 1.458a.75.75 0 0 1 .058.92l-2.846.07a.75.75 0 0 1-.978-.978l.07-2.846a.75.75 0 0 1 .92-.058l1.458 1.458a.75.75 0 0 1 .058.92Z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Tư vấn Chuyển đổi Chiến lược</h2>
                <p className="text-slate-400 mb-6">
                    Với doanh thu <strong>trên 3 tỷ đồng/năm</strong>, kể từ 01/01/2026, bạn không còn là hộ kinh doanh nữa, mà phải <strong>vận hành như một doanh nghiệp siêu nhỏ</strong>.
                </p>
                <div className="bg-red-900/50 border-l-4 border-red-500 p-4 text-left rounded-r-lg space-y-2">
                    <p className="font-semibold text-red-300">
                       <strong className="text-red-200">HÀNH ĐỘNG KHẨN CẤP:</strong> Thuê dịch vụ kế toán chuyên nghiệp hoặc cử người đi học ngay lập tức.
                    </p>
                     <p className="text-sm text-red-300">
                        <strong className="text-red-200">Thay đổi Lớn nhất:</strong> Thuế TNCN sẽ không còn tính theo % doanh thu. Thay vào đó, bạn sẽ nộp <strong>17% trên LỢI NHUẬN</strong> (Doanh thu - Chi phí). Hóa đơn đầu vào lúc này là "sinh mạng" của bạn để chứng minh chi phí.
                    </p>
                </div>
                <p className="text-sm text-slate-500 mt-4">
                    Ứng dụng này được tối ưu cho Nhóm 1 & 2. Để tuân thủ đúng và đủ, Nhóm 3 cần một hệ thống kế toán chuyên nghiệp.
                </p>
            </Card>
        </div>
    );
};

export default HKDGroup3Info;