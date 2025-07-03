'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/helpers/api/config';
import { useSelector } from 'react-redux';
import { RootState } from '@/hooks/useAppDispatch';
import { useLanguage } from '@/context/languageContext';

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
    avatarSuccess: 'Cập nhật avatar thành công!',
    avatarError: 'Có lỗi xảy ra khi cập nhật avatar.',
    gender: 'Giới tính',
    birthday: 'Ngày sinh',
    selectGender: 'Chọn giới tính',
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác',
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
  const [message, setMessage] = useState('');
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  const enableEdit = () => {
    setEditing(true);
    setMessage('');
  };

  useEffect(() => {
  console.log("Editing changed:", editing);
}, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (!userId) {
        setMessage(t.notFound);
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
      setMessage(t.success);
      fetchUserInfo();
    } catch (error) {
      setMessage(t.error);
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
      setMessage('');

      try {
        if (!userId) {
          setMessage(t.notFound);
          return;
        }

        const res = await axiosInstance.post(`/clients/${userId}/avatar`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setAvatar(res.data.avatarUrl);
        setMessage(t.avatarSuccess);
      } catch (error) {
        setMessage(t.avatarError);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center w-full">{t.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={avatarSrc}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            {editing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
                </svg>
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">{t.name}</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t.email}</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t.phone}</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t.gender}</label>
          <select
            name="gender"
            value={gender}
            onChange={e => setGender(e.target.value)}
            disabled={!editing}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">{t.selectGender}</option>
            <option value="male">{t.male}</option>
            <option value="female">{t.female}</option>
            <option value="other">{t.other}</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">{t.birthday}</label>
          <input
            type="date"
            name="dob"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            disabled={!editing}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="flex justify-center">
          {editing ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? t.updating : t.save}
            </button>
          ) : (
            <button
              type="button"
              onClick={enableEdit}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              {t.edit}
            </button>
          )}
        </div>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
