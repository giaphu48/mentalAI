'use client';

import Link from "next/link";
import { useState } from "react";
import axiosInstance from '@/helpers/api/config';
import OTPModal from '@/components/otp/otp';
import { useDispatch } from 'react-redux';
import { loginSuccess } from "@/lib/features/user/userSlice";
import { useLanguage } from '@/context/languageContext';

const TEXT = {
  vi: {
    title: "ĐĂNG NHẬP",
    email: "Email",
    password: "Mật khẩu",
    placeholderEmail: "Nhập email",
    placeholderPassword: "Nhập mật khẩu",
    login: "Đăng nhập",
    loggingIn: "Đang đăng nhập...",
    or: "hoặc",
    googleLogin: "Đăng nhập với Google",
    noAccount: "Chưa có tài khoản?",
    register: "Đăng ký",
    unverified: "Tài khoản chưa xác minh. Vui lòng xác minh OTP.",
    loginFailed: "Đăng nhập thất bại",
  },
  en: {
    title: "LOGIN",
    email: "Email",
    password: "Password",
    placeholderEmail: "Enter email",
    placeholderPassword: "Enter password",
    login: "Login",
    loggingIn: "Logging in...",
    or: "or",
    googleLogin: "Login with Google",
    noAccount: "Don't have an account?",
    register: "Register",
    unverified: "Account is not verified. Please verify with OTP.",
    loginFailed: "Login failed",
  },
};

const LoginPage: React.FC = () => {
  const { language } = useLanguage();
  const t = TEXT[language];

  const [form, setForm] = useState({
    email: '',
    password_hash: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post("clients/login", form);
      const { token, user } = res.data;

      if (user.is_verified) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(loginSuccess(user));
        window.location.href = "/";
      } else {
        setError(t.unverified);
        setShowOTPModal(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br px-2 sm:px-4">
        <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-blue-700">
            {t.title}
          </h2>
          {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
          <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block mb-1 sm:mb-2 font-semibold text-gray-700">
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                placeholder={t.placeholderEmail}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 sm:mb-2 font-semibold text-gray-700">
                {t.password}
              </label>
              <input
                id="password"
                type="password"
                value={form.password_hash}
                onChange={(e) => setForm({ ...form, password_hash: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                placeholder={t.placeholderPassword}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 0',
                background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: 1,
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {loading ? t.loggingIn : t.login}
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
            <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
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
            {t.googleLogin}
          </button>

          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
            {t.noAccount}{' '}
            <Link href="/taikhoan/dangky" className="text-blue-600 font-medium hover:underline">
              {t.register}
            </Link>
          </p>
        </div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={form.email}
      />
    </>
  );
};

export default LoginPage;
