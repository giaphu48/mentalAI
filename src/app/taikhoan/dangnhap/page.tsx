"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import OTPModal from '@/components/otp/otp';
import { useDispatch } from 'react-redux';
import { loginSuccess } from "@/lib/features/user/userSlice";

const loginPage: React.FC = () => {

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
      const res = await axios.post("http://localhost:3025/clients/login", form);
      const { token, user } = res.data;

      console.log("Login successful:", user);

      if (user.is_verified) {
        localStorage.setItem("token", token);
        dispatch(loginSuccess(user));
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/";
      } else {
        setError("Tài khoản chưa xác minh. Vui lòng xác minh OTP.");
        setShowOTPModal(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br px-2 sm:px-4">
      <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-blue-700">ĐĂNG NHẬP</h2>
        <form className="space-y-4 sm:space-y-6">
          <div>
            <label className="block mb-1 sm:mb-2 font-semibold text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              placeholder="Nhập email"
              required
            />
          </div>
          <div>
            <label className="block mb-1 sm:mb-2 font-semibold text-gray-700" htmlFor="password">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              onChange={(e) => setForm({ ...form, password_hash: e.target.value })}
              value={form.password_hash}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <button
            type="submit"
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
            onClick={handleLogin}
            disabled={loading}
          >
            Đăng nhập
          </button>
        </form>
        <div className="my-4 sm:my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 sm:mx-4 text-gray-400 text-xs sm:text-sm">hoặc</span>
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
          Đăng nhập với Google
        </button>
        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link href="/taikhoan/dangky" className="text-blue-600 font-medium hover:underline">
            Đăng ký
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
}

export default loginPage;
