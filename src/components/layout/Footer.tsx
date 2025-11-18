import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-4">Tax Helper 2026</h3>
            <p className="text-slate-400">
              Đơn giản hóa nghĩa vụ thuế của bạn trong bối cảnh cải cách pháp lý năm 2026.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-teal-400">Về chúng tôi</a></li>
              <li><a href="#" className="text-slate-400 hover:text-teal-400">Bảng giá</a></li>
              <li><a href="#" className="text-slate-400 hover:text-teal-400">Hướng dẫn</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-4">Pháp lý</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-teal-400">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="text-slate-400 hover:text-teal-400">Chính sách bảo mật</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Tax Helper Vietnam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;