'use client';

import React, { useState } from 'react';
import axiosInstance from '@/helpers/api/config';
import Link from 'next/link';
import OTPModal from '@/components/otp/otp';
import { useLanguage } from '@/context/languageContext';

const TEXT = {
  vi: {
    title: 'ĐĂNG KÝ',
    email: 'Email',
    phone: 'Số điện thoại',
    name: 'Họ tên',
    password: 'Mật khẩu',
    confirmPassword: 'Nhập lại mật khẩu',
    register: 'Đăng ký',
    loggingIn: 'Đang đăng ký...',
    or: 'Hoặc',
    loginwithgoogle: 'Đăng nhập với Google',
    alreadyAccount: 'Đã có tài khoản?',
    login: 'Đăng nhập',
    invalidEmail: 'Email không hợp lệ',
    emptyField: 'Vui lòng nhập',
    passwordMismatch: 'Mật khẩu không khớp',
    failed: 'Đăng ký thất bại. Vui lòng thử lại.',
  },
  en: {
    title: 'REGISTER',
    email: 'Email',
    phone: 'Phone Number',
    name: 'Full Name',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    register: 'Register',
    loggingIn: 'Registering...',
    or: "Or",
    loginwithgoogle: 'Log in with Google',
    alreadyAccount: 'Already have an account?',
    login: 'Login',
    invalidEmail: 'Invalid email format',
    emptyField: 'Please enter',
    passwordMismatch: 'Passwords do not match',
    failed: 'Registration failed. Please try again.',
  },
};

const RegisterPage: React.FC = () => {
  const { language } = useLanguage();
  const t = TEXT[language];

  const [form, setForm] = useState({
    email: '',
    phone: '',
    name: '',
    password_hash: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.email) newErrors.email = `${t.emptyField} ${t.email}`;
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = t.invalidEmail;
    if (!form.phone) newErrors.phone = `${t.emptyField} ${t.phone}`;
    if (!form.name) newErrors.name = `${t.emptyField} ${t.name}`;
    if (!form.password_hash) newErrors.password_hash = `${t.emptyField} ${t.password}`;
    if (form.password_hash !== form.confirmPassword)
      newErrors.confirmPassword = t.passwordMismatch;
    return newErrors;
  };

  const register = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/clients/register', {
        email: form.email,
        phone: form.phone,
        name: form.name,
        password_hash: form.password_hash,
      });

      setShowOTPModal(true);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrors({ ...errors, email: error.response.data.message });
      } else {
        alert(t.failed);
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
        <h2 className="text-2xl font-bold mb-8 text-center text-blue-700">{t.title}</h2>
        <form onSubmit={handleSubmit} noValidate>
          {[
            { label: t.email, name: 'email', type: 'email', placeholder: t.email },
            { label: t.phone, name: 'phone', type: 'tel', placeholder: t.phone },
            { label: t.name, name: 'name', type: 'text', placeholder: t.name },
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

          {[{ label: t.password, name: 'password_hash' }, { label: t.confirmPassword, name: 'confirmPassword' }].map(
            ({ label, name }) => (
              <div className="mb-5" key={name}>
                <label className="block mb-1 font-medium text-gray-700">{label}</label>
                <input
                  type="password"
                  name={name}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  placeholder={label}
                  className="w-full px-3 py-2 border rounded-lg text-base border-gray-300 focus:ring-2 focus:ring-blue-400"
                />
                {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name]}</p>}
              </div>
            )
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? t.loggingIn : t.register}
          </button>
        </form>
        <div className="my-4 sm:my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 sm:mx-4 text-gray-400 text-xs sm:text-sm">{t.or}</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition text-sm sm:text-base"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                d="M44.5 20H24V28.5H36.9C36.1 32 33.1 35 28.5 35C23.3 35 19 30.7 19 25.5C19 20.3 23.3 16 28.5 16C30.7 16 32.7 16.8 34.2 18.1L39.1 13.2C36.3 10.7 32.7 9 28.5 9C18.8 9 11 16.8 11 26.5C11 36.2 18.8 44 28.5 44C37.2 44 44.5 36.7 44.5 28C44.5 26.7 44.4 25.4 44.2 24.2L44.5 20Z"
                fill="#4285F4"
              />
              <path
                d="M6.3 14.7L12.7 19.6C14.7 16.2 18.3 13.9 22.5 13.9C24.7 13.9 26.7 14.7 28.2 16L33.1 11.1C30.3 8.6 26.7 7 22.5 7C14.8 7 8.1 13.7 8.1 21.4C8.1 23.2 8.5 24.9 9.2 26.4L6.3 14.7Z"
                fill="#34A853"
              />
              <path
                d="M22.5 41C26.7 41 30.3 39.4 33.1 36.9L28.2 32C26.7 33.3 24.7 34.1 22.5 34.1C18.3 34.1 14.7 31.8 12.7 28.4L6.3 33.3C8.1 36.7 14.8 41 22.5 41Z"
                fill="#FBBC05"
              />
              <path
                d="M44.5 20H24V28.5H36.9C36.1 32 33.1 35 28.5 35C23.3 35 19 30.7 19 25.5C19 20.3 23.3 16 28.5 16C30.7 16 32.7 16.8 34.2 18.1L39.1 13.2C36.3 10.7 32.7 9 28.5 9C18.8 9 11 16.8 11 26.5C11 36.2 18.8 44 28.5 44C37.2 44 44.5 36.7 44.5 28C44.5 26.7 44.4 25.4 44.2 24.2L44.5 20Z"
                fill="#4285F4"
              />
            </g>
          </svg>
          {t.loginwithgoogle}
        </button>
        <p className="mt-6 text-center text-sm text-gray-600">
          {t.alreadyAccount}{' '}
          <Link href="/taikhoan/dangnhap" className="text-blue-600 font-medium hover:underline">
            {t.login}
          </Link>
        </p>
      </div>

      <OTPModal isOpen={showOTPModal} onClose={() => setShowOTPModal(false)} email={form.email} />
    </>
  );
};

export default RegisterPage;
