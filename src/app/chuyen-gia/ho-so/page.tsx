'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/helpers/api/config';
import { useSelector } from 'react-redux';
import { RootState } from '@/hooks/useAppDispatch';
import { FiEdit2, FiSave, FiUpload, FiUser, FiMail, FiPhone, FiCalendar, FiChevronDown, FiAward, FiInfo, FiX } from 'react-icons/fi';

function formatDateToInput(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const TEXT = {
  title: 'HỒ SƠ CHUYÊN GIA',
  name: 'Họ và tên',
  email: 'Email',
  phone: 'Số điện thoại',
  save: 'Lưu thay đổi',
  edit: 'Chỉnh sửa',
  cancel: 'Hủy',
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
  certification: 'Bằng cấp',
  selectCertification: 'Chọn bằng cấp',
  bachelor: 'Cử nhân',
  master: 'Thạc sĩ',
  phd: 'Tiến sĩ',
  bio: 'Giới thiệu (Bio)',
  bioPlaceholder: 'Nhập mô tả ngắn về bản thân',
  changeAvatar: 'Đổi ảnh đại diện',
};

type Msg = { text: string; type: 'success' | 'error' | '' };

export default function ExpertProfilePage() {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    avatar: '',
    name: '',
    email: '',
    phone: '',
    bio: '',
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<Msg>({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [certification, setCertification] = useState<string>('');

  const avatarSrc = avatar || user?.profile?.avatar || '/image/user.jpg';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchUserInfo = async () => {
    if (!user) return;

    setUserId(user.id);
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/experts/getbyid/${user.id}`);
      setForm({
        avatar: res.data?.avatar || user.profile?.avatar || '/image/user.jpg',
        name: res.data?.name || '',
        email: res.data?.email !== 'none' ? user.email : '',
        phone: res.data?.phone || '',
        bio: res.data?.bio || '',
      });
      setGender(res.data?.gender || '');
      setBirthday(formatDateToInput(res.data?.dob));
      setCertification(res.data?.certification || '');
      setAvatar(res.data?.avatar || user.profile?.avatar || '/image/user.jpg');
    } catch (error: any) {
      console.error(error);
      setMessage({ text: TEXT.error, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user?.id]);

  const enableEdit = () => {
    setEditing(true);
    setMessage({ text: '', type: '' });
  };

  const cancelEdit = () => {
    setEditing(false);
    setMessage({ text: '', type: '' });
    fetchUserInfo();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      if (!userId) {
        setMessage({ text: TEXT.notFound, type: 'error' });
        return;
      }

      await axiosInstance.put(`/experts/${userId}`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        gender,
        certification,
        dob: birthday,
        bio: form.bio,
      });
      setEditing(false);
      setMessage({ text: TEXT.success, type: 'success' });
      fetchUserInfo();
    } catch (error) {
      setMessage({ text: TEXT.error, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'Ảnh quá lớn (>5MB)', type: 'error' });
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      setLoading(true);
      setMessage({ text: '', type: '' });

      try {
        if (!userId) {
          setMessage({ text: TEXT.notFound, type: 'error' });
          return;
        }

        const res = await axiosInstance.post(`/experts/${userId}/avatar`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setAvatar(res.data?.avatarUrl);
        setForm(prev => ({ ...prev, avatar: res.data?.avatarUrl }));
        setMessage({ text: TEXT.avatarSuccess, type: 'success' });
      } catch (error) {
        setMessage({ text: TEXT.avatarError, type: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{TEXT.title}</h1>
      </div>

      <form id="expert-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/image/user.jpg'; }}
              />
            </div>
            {editing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <div className="text-white text-center p-2">
                  <FiUpload className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">{TEXT.changeAvatar}</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center"><FiUser className="mr-2" /> {TEXT.name}</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-4 py-2 border rounded-lg ${editing ? 'bg-white' : 'bg-gray-100'}`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center"><FiMail className="mr-2" /> {TEXT.email}</label>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center"><FiPhone className="mr-2" /> {TEXT.phone}</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-4 py-2 border rounded-lg ${editing ? 'bg-white' : 'bg-gray-100'}`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{TEXT.gender}</label>
            <div className="relative">
              <select
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={!editing}
                className={`w-full px-4 py-2 border rounded-lg appearance-none ${editing ? 'bg-white' : 'bg-gray-100'}`}
                required
              >
                <option value="">{TEXT.selectGender}</option>
                <option value="male">{TEXT.male}</option>
                <option value="female">{TEXT.female}</option>
                <option value="other">{TEXT.other}</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center"><FiAward className="mr-2" /> {TEXT.certification}</label>
            <div className="relative">
              <select
                name="certification"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                disabled={!editing}
                className={`w-full px-4 py-2 border rounded-lg appearance-none ${editing ? 'bg-white' : 'bg-gray-100'}`}
                required
              >
                <option value="">{TEXT.selectCertification}</option>
                <option value="Cử nhân">{TEXT.bachelor}</option>
                <option value="Thạc sĩ">{TEXT.master}</option>
                <option value="Tiến sĩ">{TEXT.phd}</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center"><FiCalendar className="mr-2" /> {TEXT.birthday}</label>
            <input
              type="date"
              name="dob"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              disabled={!editing}
              className={`w-full px-4 py-2 border rounded-lg ${editing ? 'bg-white' : 'bg-gray-100'}`}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center"><FiInfo className="mr-2" /> {TEXT.bio}</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            disabled={!editing}
            className={`w-full px-4 py-2 border rounded-lg ${editing ? 'bg-white' : 'bg-gray-100'}`}
            rows={4}
            placeholder={TEXT.bioPlaceholder}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          {editing ? (
            <>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <FiX className="mr-2" /> {TEXT.cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7" />
                    </svg>
                    {TEXT.updating}
                  </span>
                ) : (
                  <span className="flex items-center"><FiSave className="mr-2" /> {TEXT.save}</span>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={enableEdit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FiEdit2 className="mr-2" /> {TEXT.edit}
            </button>
          )}
        </div>
      </form>

      {message.text && (
        <div className={`mt-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
