'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/hooks/useAppDispatch';
import axiosInstance from '@/helpers/api/config';
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';

type Role = 'expert' | 'admin' | 'client' | string;

interface StoredUser {
  id: string;
  role?: Role | Role[]; // linh hoạt: có thể là string hoặc mảng
}

const ChangePasswordPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.currentUser) || null;
  const [userId, setUserId] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: '',
  });

  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) {
        alert('Bạn cần đăng nhập để tiếp tục.');
        router.replace('/');
        return;
      }

      const user = JSON.parse(raw) as StoredUser;
      const role = user.role;

      const isExpert =
        (typeof role === 'string' && role.toLowerCase() === 'expert') ||
        (Array.isArray(role) && role.map((r) => r.toLowerCase()).includes('expert'));

      if (!isExpert) {
        alert('Bạn không có quyền truy cập trang này. Chỉ dành cho chuyên gia.');
        router.replace('/');
        return;
      }
    } catch (e) {
      console.error('Không đọc được thông tin người dùng:', e);
      alert('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
      router.replace('/');
      return;
    } finally {

    }
  }, [router]);

  useEffect(() => {
    setUserId(user ? user.id : null);
  }, [user]);

  // Đánh giá độ mạnh mật khẩu
  const strength = useMemo(() => {
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Za-z]/.test(newPassword)) s++;
    if (/\d/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++; // ký tự đặc biệt
    return s; // 0..4
  }, [newPassword]);

  const isWeak = newPassword.length > 0 && strength < 3;

  const validate = () => {
    if (!userId) {
      setMsg({ type: 'error', text: 'Không tìm thấy người dùng.' });
      return false;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return false;
    }
    if (isWeak) {
      setMsg({
        type: 'error',
        text: 'Mật khẩu quá yếu. Tối thiểu 8 ký tự, có chữ và số.',
      });
      return false;
    }
    return true;
  };

  const clearForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await axiosInstance.post('/users/change-password', {
        currentPassword,
        newPassword,
        userId,
      });
      setMsg({ type: 'success', text: res?.data?.message || 'Đổi mật khẩu thành công' });
      clearForm();
    } catch (err: any) {
      setMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Có lỗi xảy ra',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    clearForm();
    setMsg({ type: '', text: '' });
  };

  const strengthLabel =
    strength >= 4 ? 'Mạnh' : strength === 3 ? 'Tốt' : strength === 2 ? 'Trung bình' : 'Yếu';
  const strengthPercent = (strength / 4) * 100;

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">ĐỔI MẬT KHẨU</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mật khẩu hiện tại */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <FiLock className="mr-2" /> Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showCurrent ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <FiShield className="mr-2" /> Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showNew ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Strength meter */}
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all"
                style={{ width: `${strengthPercent}%` }}
              />
            </div>
            <p className={`text-xs mt-1 ${isWeak ? 'text-red-600' : 'text-gray-500'}`}>
              Tối thiểu 8 ký tự, có chữ và số • {strengthLabel}
            </p>
          </div>
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              onPaste={(e) => e.preventDefault()}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* Thông báo */}
        {msg.text && (
          <div
            className={`mt-2 p-4 rounded-lg flex items-start gap-2 ${
              msg.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {msg.type === 'success' ? (
              <FiCheckCircle className="mt-0.5" />
            ) : (
              <FiAlertCircle className="mt-0.5" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Nút hành động */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FiLock /> Đổi mật khẩu
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
