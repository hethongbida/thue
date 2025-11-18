import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';

interface UserProfileModalProps {
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
    const [profile, setProfile] = useState<UserProfile>({
        taxCode: '',
        personalId: '',
        name: '',
        address: '',
        district: '',
        city: '',
        phone: '',
        email: '',
        taxDepartment: '',
    });

    useEffect(() => {
        const savedProfile = localStorage.getItem('user-profile');
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        localStorage.setItem('user-profile', JSON.stringify(profile));
        alert('Đã lưu hồ sơ thành công!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[200] p-4">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-100">Hồ sơ Người nộp thuế</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <p className="text-sm text-slate-400 mb-4">
                    Vui lòng điền đầy đủ thông tin. Dữ liệu này sẽ được tự động điền vào tờ khai khi bạn xuất file.
                </p>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="bg-yellow-900/50 border border-yellow-700/50 p-3 rounded-lg">
                        <label className="block text-sm font-bold text-yellow-300">Định danh cá nhân (CCCD 12 số) *</label>
                        <p className="text-xs text-yellow-400 mb-2">Thông tin bắt buộc theo TT94/2025/TT-BTC từ 14/10/2025</p>
                        <input type="text" name="personalId" value={profile.personalId} onChange={handleChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-100 focus:ring-teal-500 focus:border-teal-500" placeholder="0..." maxLength={12}/>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Mã số thuế *</label>
                            <input type="text" name="taxCode" value={profile.taxCode} onChange={handleChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-100 focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Tên người nộp thuế *</label>
                            <input type="text" name="name" value={profile.name} onChange={handleChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-100 focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300">Địa chỉ</label>
                        <input type="text" name="address" value={profile.address} onChange={handleChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-100 focus:ring-teal-500 focus:border-teal-500" placeholder="Số nhà, đường..." />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Quận/Huyện</label>
                            <input type="text" name="district" value={profile.district} onChange={handleChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-100 focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Tỉnh/Thành phố</label>
                            <input type="text" name="city" value={profile.city} onChange={handleChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-100 focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Điện thoại</label>
                            <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-100 focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Email</label>
                            <input type="email" name="email" value={profile.email} onChange={handleChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-100 focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300">Cơ quan Thuế quản lý</label>
                        <input type="text" name="taxDepartment" value={profile.taxDepartment} onChange={handleChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-100 focus:ring-teal-500 focus:border-teal-500" placeholder="VD: Chi cục Thuế Quận 7 - Cục Thuế TP.HCM" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-slate-600 text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-500 transition-colors">Hủy</button>
                    <button onClick={handleSave} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">Lưu Hồ sơ</button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;