'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import OTPModal from '@/components/otp/otp'; // đảm bảo đường dẫn đúng

type Gender = 'male' | 'female' | 'other';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    name: '',
    gender: '' as Gender | '',
    password_hash: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.email) newErrors.email = 'Vui lòng nhập Email';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ';
    if (!form.phone) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!form.name) newErrors.name = 'Vui lòng nhập họ tên';
    if (!form.gender) newErrors.gender = 'Vui lòng chọn giới tính';
    if (!form.password_hash) newErrors.password_hash = 'Vui lòng nhập mật khẩu';
    if (form.password_hash !== form.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';
    return newErrors;
  };

  const register = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3025/clients/register', {
        email: form.email,
        phone: form.phone,
        name: form.name,
        gender: form.gender,
        password_hash: form.password_hash,
      });

      // ✅ Gửi OTP sau khi đăng ký thành công
      setShowOTPModal(true);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrors({ ...errors, email: error.response.data.message });
      } else {
        alert('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await register();
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto mt-8 md:mt-12 px-4 py-8 border border-gray-200 rounded-2xl bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center text-blue-700">ĐĂNG KÝ</h2>
        <form onSubmit={handleSubmit} noValidate>
          {[{ label: 'Email', name: 'email', type: 'email', placeholder: 'Nhập email' },
            { label: 'Số điện thoại', name: 'phone', type: 'tel', placeholder: 'Nhập số điện thoại' },
            { label: 'Họ tên', name: 'name', type: 'text', placeholder: 'Nhập họ tên' }
          ].map(({ label, name, type, placeholder }) => (
            <div className="mb-5" key={name}>
              <label className="block mb-1 font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={(form as any)[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 border rounded-lg text-base border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name]}</p>}
            </div>
          ))}

          <div className="mb-5">
            <label className="block mb-1 font-medium text-gray-700">Giới tính</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-base border-gray-300 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
            {errors.gender && <p className="text-sm text-red-600 mt-1">{errors.gender}</p>}
          </div>

          {[{ label: 'Mật khẩu', name: 'password_hash', placeholder: 'Nhập mật khẩu' },
            { label: 'Nhập lại mật khẩu', name: 'confirmPassword', placeholder: 'Nhập lại mật khẩu' }
          ].map(({ label, name, placeholder }) => (
            <div className="mb-5" key={name}>
              <label className="block mb-1 font-medium text-gray-700">{label}</label>
              <input
                type="password"
                name={name}
                value={(form as any)[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 border rounded-lg text-base border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
              {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name]}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link href="/taikhoan/dangnhap" className="text-blue-600 font-medium hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>

      {/* ✅ Modal xác thực OTP với email từ form */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={form.email}
      />
    </>
  );
};

export default RegisterPage;
