'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/hooks/useAppDispatch';
import axiosInstance from '@/helpers/api/config';

const ChangePasswordPage: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.currentUser) || null;
    const [userId, setUserId] = useState<string | null>(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setUserId(user.id);
        } else {
            setUserId(null);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token'); // JWT
            const res = await axiosInstance.post(
                '/clients/change-password',
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess(res.data.message || 'Đổi mật khẩu thành công');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Đổi mật khẩu</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        className="w-full border px-3 py-2 rounded"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Mật khẩu mới</label>
                    <input
                        type="password"
                        className="w-full border px-3 py-2 rounded"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        className="w-full border px-3 py-2 rounded"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="text-red-600">{error}</div>}
                {success && <div className="text-green-600">{success}</div>}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Đổi mật khẩu
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordPage;