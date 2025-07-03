'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/hooks/useAppDispatch';
import axiosInstance from '@/helpers/api/config';
import { useLanguage } from '@/context/languageContext';

const TEXT = {
  vi: {
    title: 'ĐỔI MẬT KHẨU',
    current: 'Mật khẩu hiện tại',
    new: 'Mật khẩu mới',
    confirm: 'Xác nhận mật khẩu mới',
    submit: 'Đổi mật khẩu',
    success: 'Đổi mật khẩu thành công',
    error: 'Có lỗi xảy ra',
    mismatch: 'Mật khẩu xác nhận không khớp',
  },
  en: {
    title: 'CHANGE PASSWORD',
    current: 'Current Password',
    new: 'New Password',
    confirm: 'Confirm New Password',
    submit: 'Change Password',
    success: 'Password changed successfully',
    error: 'An error occurred',
    mismatch: 'Password confirmation does not match',
  },
};

const ChangePasswordPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const t = TEXT[language];

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
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError(t.mismatch);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axiosInstance.post(
        '/clients/change-password',
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(res.data.message || t.success);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || t.error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center w-full">{t.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">{t.current}</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t.new}</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t.confirm}</label>
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
        <div className='flex justify-center'>
        <button
          type="submit"
          className=" bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t.submit}
        </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
