'use client';

import React, { use, useEffect, useState } from 'react';
import axiosInstance from '@/helpers/api/config';
import { useSelector } from 'react-redux';
import { RootState } from '@/hooks/useAppDispatch';

function formatDateToInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function ThongTinPage() {
    const user = useSelector((state: RootState) => state.user.currentUser) || null;
    const [userId, setUserId] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [editing, setEditing] = useState(true);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [birthday, setBirthday] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            if (!userId) {
                setMessage('Không tìm thấy người dùng.');
                setLoading(false);
                return;
            }
            await axiosInstance.put(`/clients/${userId}`, {
                name: form.name,
                email: form.email,
                phone: form.phone,
            });
            setEditing(false);
            setMessage('Cập nhật thông tin thành công!');
        } catch (error: any) {
            setMessage('Có lỗi xảy ra khi cập nhật thông tin.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditing(true);
        setMessage('');
    };

    useEffect(() => {
        const getInfoUser = async (): Promise<void> => {
            if (!user) return;

            setUserId(user.id);
            

            setLoading(true);
            try {
                const res = await axiosInstance.get(`/clients/getbyid/${user.id}`);
                setForm({
                name: res.data.name || '',
                email: res.data.email !== 'none' ? user.email : '',
                phone: res.data.phone !== 'none' ? user.phone : '',
            });
                setName(res.data.name);
                setGender(res.data.gender);
                setBirthday(formatDateToInput(res.data.dob));
            } catch (error: any) {
                console.log(error);
                if (error?.response?.status === 404) {
                    setEditMode(false);
                }
            } finally {
                setLoading(false);
            }
        };

        getInfoUser();
    }, [user]);




    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Chỉnh sửa thông tin cá nhân</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Họ và tên</label>
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
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Số điện thoại</label>
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
                <div className="flex justify-center">
                    {editing ? (
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Lưu thay đổi
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
}
