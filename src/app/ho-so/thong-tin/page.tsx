'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/helpers/api/config';
import { useSelector } from 'react-redux';
import { RootState } from '@/hooks/useAppDispatch';
import { useLanguage } from '@/context/languageContext';
import { FiEdit2, FiSave, FiUpload, FiUser, FiMail, FiPhone, FiCalendar, FiChevronDown } from 'react-icons/fi';

function formatDateToInput(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const TEXT = {
  vi: {
    title: 'THÔNG TIN CÁ NHÂN',
    name: 'Họ và tên',
    email: 'Email',
    phone: 'Số điện thoại',
    save: 'Lưu thay đổi',
    edit: 'Chỉnh sửa',
    updating: 'Đang lưu...',
    success: 'Cập nhật thông tin thành công!',
    error: 'Có lỗi xảy ra khi cập nhật thông tin.',
    notFound: 'Không tìm thấy người dùng.',
    avatarSuccess: 'Cập nhật ảnh đại diện thành công!',
    avatarError: 'Có lỗi xảy ra khi cập nhật ảnh đại diện.',
    gender: 'Giới tính',
    birthday: 'Ngày sinh',
    selectGender: 'Chọn giới tính',
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác',
    changeAvatar: 'Đổi ảnh đại diện',
    cancel: 'Hủy bỏ',
  },
  en: {
    title: 'PERSONAL INFORMATION',
    name: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    save: 'Save Changes',
    edit: 'Edit',
    updating: 'Saving...',
    success: 'Information updated successfully!',
    error: 'An error occurred while updating.',
    notFound: 'User not found.',
    avatarSuccess: 'Avatar updated successfully!',
    avatarError: 'Error updating avatar.',
    gender: 'Gender',
    birthday: 'Date of Birth',
    selectGender: 'Select gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    changeAvatar: 'Change Avatar',
    cancel: 'Cancel',
  },
};

export default function ThongTinPage() {
  const { language } = useLanguage();
  const t = TEXT[language];

  const user = useSelector((state: RootState) => state.user.currentUser);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    avatar: '',
    name: '',
    email: '',
    phone: '',
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<string>('');
  const [gender, setGender] = useState<string>('');

  const avatarSrc = avatar || user?.profile?.avatar || '/image/user.jpg';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchUserInfo = async () => {
    if (!user) return;

    setUserId(user.id);
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/clients/getbyid/${user.id}`);
      setForm({
        avatar: res.data.avatar || user.profile?.avatar || '/image/user.jpg',
        name: res.data.name || '',
        email: res.data.email !== 'none' ? user.email : '',
        phone: res.data.phone
      });
      setGender(res.data.gender || '');
      setBirthday(formatDateToInput(res.data.dob));
      setAvatar(res.data.avatar || user.profile?.avatar || '/image/user.jpg');
    } catch (error: any) {
      console.error(error);
      setMessage({ text: t.error, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  const enableEdit = () => {
    setEditing(true);
    setMessage({ text: '', type: '' });
  };

  const cancelEdit = () => {
    setEditing(false);
    fetchUserInfo(); // Reset form to original values
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      if (!userId) {
        setMessage({ text: t.notFound, type: 'error' });
        return;
      }

      await axiosInstance.put(`/clients/${userId}`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        gender,
        dob: birthday,
      });
      setEditing(false);
      setMessage({ text: t.success, type: 'success' });
      fetchUserInfo();
    } catch (error) {
      setMessage({ text: t.error, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('avatar', file);

      setLoading(true);
      setMessage({ text: '', type: '' });

      try {
        if (!userId) {
          setMessage({ text: t.notFound, type: 'error' });
          return;
        }

        const res = await axiosInstance.post(`/clients/${userId}/avatar`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setAvatar(res.data.avatarUrl);
        setMessage({ text: t.avatarSuccess, type: 'success' });
      } catch (error) {
        setMessage({ text: t.avatarError, type: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/image/user.jpg';
                }}
              />
            </div>
            
            {editing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <div className="text-white text-center p-2">
                  <FiUpload className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">{t.changeAvatar}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiUser className="mr-2" /> {t.name}
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                editing ? 'bg-white' : 'bg-gray-100'
              }`}
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiMail className="mr-2" /> {t.email}
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiPhone className="mr-2" /> {t.phone}
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                editing ? 'bg-white' : 'bg-gray-100'
              }`}
              required
            />
          </div>

          {/* Gender Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t.gender}</label>
            <div className="relative">
              <select
                name="gender"
                value={gender}
                onChange={e => setGender(e.target.value)}
                disabled={!editing}
                className={`w-full px-4 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  editing ? 'bg-white' : 'bg-gray-100'
                }`}
                required
              >
                <option value="">{t.selectGender}</option>
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
                <option value="other">{t.other}</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Birthday Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiCalendar className="mr-2" /> {t.birthday}
            </label>
            <input
              type="date"
              name="dob"
              value={birthday}
              onChange={e => setBirthday(e.target.value)}
              disabled={!editing}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                editing ? 'bg-white' : 'bg-gray-100'
              }`}
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          {editing ? (
            <>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.updating}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FiSave className="mr-2" /> {t.save}
                  </span>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={enableEdit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FiEdit2 className="mr-2" /> {t.edit}
            </button>
          )}
        </div>
      </form>

      {/* Status Message */}
      {message.text && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}