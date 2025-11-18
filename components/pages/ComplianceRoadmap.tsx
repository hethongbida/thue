import React from 'react';
import { AppView } from '../../types';

interface ComplianceRoadmapProps {
  setCurrentView: (view: AppView) => void;
}

const RoadmapItem: React.FC<{
    date: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    actions: { title: string; items: string[]; targetView?: AppView; }[];
    setCurrentView: (view: AppView) => void;
}> = ({ date, title, description, actions, icon, setCurrentView }) => (
    <div className="relative pl-8 sm:pl-32 py-6 group">
        {/* Vertical line and dot */}
        <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-700 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-teal-500 after:border-4 after:box-content after:border-slate-800 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
            <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-28 h-6 mb-3 sm:mb-0 text-white bg-teal-600 rounded-full">{date}</time>
            <div className="flex items-center gap-3">
                <div className="text-teal-400">{icon}</div>
                <h3 className="text-xl font-bold text-slate-100">{title}</h3>
            </div>
        </div>
        <div className="text-slate-400 mb-4">{description}</div>
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-700 space-y-4">
            {actions.map((action, index) => (
                <div key={index}>
                    <h4 className="font-semibold text-slate-200">{action.title}</h4>
                    <ul className="list-disc list-inside text-sm text-slate-400 mt-2 space-y-1">
                        {action.items.map((item, i) => (
                             <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/<strong>/g, '<strong class="text-teal-400">') }}></li>
                        ))}
                    </ul>
                    {action.targetView && (
                         <button onClick={() => setCurrentView(action.targetView!)} className="text-sm text-teal-400 font-semibold hover:text-teal-300 mt-3 transition-colors">
                            Sử dụng công cụ &rarr;
                        </button>
                    )}
                </div>
            ))}
        </div>
    </div>
);

interface RoadmapDataItem {
    date: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    actions: { 
        title: string; 
        items: string[]; 
        targetView?: AppView; 
    }[];
}

const ComplianceRoadmap: React.FC<ComplianceRoadmapProps> = ({ setCurrentView }) => {
    const roadmapData: RoadmapDataItem[] = [
         {
            date: "Từ 01/07/2025",
            title: "Bán hàng Online & Hóa đơn Doanh nghiệp",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>,
            description: "Quy định mới ảnh hưởng trực tiếp đến cách các chủ doanh nghiệp chi tiêu và cách người bán hàng trên Shopee, Lazada được quản lý thuế.",
            actions: [
                {
                    title: "Nếu bạn là Chủ Doanh nghiệp nhỏ (SME):",
                    items: [
                        '<strong>CỰC KỲ QUAN TRỌNG:</strong> Mọi chi phí của công ty, dù chỉ vài nghìn đồng, đều phải <strong>CHUYỂN KHOẢN</strong>. Nếu trả bằng tiền mặt, chi phí đó sẽ không được khấu trừ thuế GTGT, làm tăng số thuế phải nộp.',
                    ],
                    targetView: "corporate"
                },
                 {
                    title: "Nếu bạn bán hàng trên Shopee, Lazada, TikTok Shop:",
                    items: [
                        'Các sàn sẽ tự động giữ lại <strong>1.5% tiền hàng</strong> của bạn để nộp thuế thay. Hãy tính toán lại giá bán để đảm bảo bạn vẫn có lãi.',
                        'Nếu tổng doanh thu của bạn dưới 200 triệu/năm, bạn có thể yêu cầu nhà nước hoàn lại số tiền thuế này vào cuối năm.',
                    ],
                    targetView: "ecommerce"
                },
            ]
        },
        {
            date: "Từ 01/10/2025",
            title: "Ưu đãi Thuế cho Doanh nghiệp nhỏ",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21M3 3h12m6.75 3.75h-1.5" /></svg>,
            description: "Luật mới giúp các doanh nghiệp nhỏ và vừa (SME) và các công ty khởi nghiệp (Startup) giảm bớt gánh nặng thuế.",
            actions: [
                {
                    title: "Nếu bạn là Chủ Doanh nghiệp:",
                    items: [
                        'Kiểm tra doanh thu năm trước để xem công ty bạn có được hưởng mức thuế TNDN ưu đãi (<strong>15% hoặc 17%</strong> thay vì 20%) hay không.',
                        'Nếu là công ty khởi nghiệp sáng tạo, hãy tìm hiểu về gói miễn/giảm thuế đặc biệt kéo dài tới 6 năm.',
                    ],
                    targetView: "corporate"
                }
            ]
        },
        {
            date: "Từ 01/01/2026",
            title: "Lương cao hơn & Hết thời Thuế Khoán",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.253a9.527 9.527 0 0 0-5.225-1.581 9.527 9.527 0 0 0-5.225 1.581c-.16.533-.294 1.064-.39 1.621m5.225a9.38 9.38 0 0 0-2.625.372M3 13.5h3M3.75 17.25h1.5M4.5 21h3M19.5 3h3M18.75 6.75h1.5M18 10.5h3M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 14.5a3.987 3.987 0 0 0-3.951 3.512A8.949 8.949 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
            description: "Cách tính thuế cho người đi làm thay đổi có lợi hơn. Các hộ kinh doanh không còn đóng thuế khoán mà sẽ kê khai theo doanh thu thực tế.",
            actions: [
                {
                    title: "Nếu bạn là Hộ kinh doanh (quán ăn, tạp hóa...):",
                    items: [
                        '<strong>Không còn thuế khoán.</strong> Bạn phải ghi chép doanh thu để xác định mình thuộc nhóm nào.',
                        'Doanh thu dưới 200 triệu/năm: <strong>Được miễn thuế</strong>, nhưng vẫn phải khai báo.',
                        'Doanh thu trên 200 triệu/năm: <strong>Phải nộp thuế</strong> theo % doanh thu và sử dụng hóa đơn điện tử.',
                    ],
                    targetView: "hkd"
                },
                 {
                    title: "Nếu bạn là Người đi làm hưởng lương:",
                    items: [
                        'Bạn sẽ được trừ nhiều tiền hơn từ thu nhập trước khi tính thuế (gọi là giảm trừ gia cảnh), giúp <strong>tăng lương thực nhận hàng tháng</strong>.',
                        'Rà soát lại những người phụ thuộc (cha mẹ, con cái) mà bạn đang đăng ký giảm trừ để đảm bảo họ vẫn đủ điều kiện.',
                    ],
                    targetView: "pit"
                }
            ]
        },
    ];

  return (
    <div className="space-y-8">
      <div className="text-center pt-8 pb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-100 leading-tight">
          Lộ trình Cải cách Thuế 2025-2026
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Dành cho Mọi người</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
          Luật thuế sắp thay đổi lớn. Đừng lo! Dòng thời gian này sẽ giải thích đơn giản những thay đổi chính ảnh hưởng trực tiếp đến bạn.
        </p>
      </div>

       <div className="max-w-4xl mx-auto">
            {roadmapData.map((item, index) => (
                <RoadmapItem 
                    key={index}
                    date={item.date}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    actions={item.actions}
                    setCurrentView={setCurrentView}
                />
            ))}
        </div>

    </div>
  );
};

export default ComplianceRoadmap;
