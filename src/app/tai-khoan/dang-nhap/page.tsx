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
    title: "Đăng nhập",
    subtitle: "Chào mừng bạn trở lại",
    email: "Email",
    password: "Mật khẩu",
    login: "Đăng nhập",
    loggingIn: "Đang đăng nhập...",
    or: "Hoặc đăng nhập bằng",
    googleLogin: "Tiếp tục với Google",
    noAccount: "Chưa có tài khoản?",
    register: "Đăng ký ngay",
    unverified: "Tài khoản chưa xác minh. Vui lòng xác minh OTP.",
    loginFailed: "Đăng nhập thất bại",
    forgotPassword: "Quên mật khẩu?"
  },
  en: {
    title: "Login",
    subtitle: "Welcome back",
    email: "Email",
    password: "Password",
    login: "Login",
    loggingIn: "Logging in...",
    or: "Or sign in with",
    googleLogin: "Continue with Google",
    noAccount: "Don't have an account?",
    register: "Sign up now",
    unverified: "Account is not verified. Please verify with OTP.",
    loginFailed: "Login failed",
    forgotPassword: "Forgot password?"
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
      const res = await axiosInstance.post("users/login", form);
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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="hidden md:block md:w-1/2 bg-green-600">
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-4">{language === 'vi' ? 'Chào mừng trở lại' : 'Welcome back'}</h3>
                  <h2 className="text-3xl font-bold mb-6">Tâm An</h2>
                  <p className="mb-8">
                    {language === 'vi' 
                      ? 'Đồng hành cùng bạn trên hành trình chăm sóc sức khỏe tinh thần'
                      : 'Accompanying you on your mental health journey'}
                  </p>
                  <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
                  <p className="text-sm opacity-80">
                    {language === 'vi'
                      ? 'Chưa có tài khoản?'
                      : 'Don\'t have an account?'}
                  </p>
                  <Link 
                    href="/tai-khoan/dang-ky" 
                    className="inline-block mt-2 px-6 py-2 border-2 border-white text-white font-medium rounded-full hover:bg-white hover:text-green-600 transition duration-300"
                  >
                    {t.register}
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>
                <p className="mt-2 text-gray-600">{t.subtitle}</p>
              </div>
              
              {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
                  <input
                    type="password"
                    value={form.password_hash}
                    onChange={(e) => setForm({ ...form, password_hash: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <div className="text-right mt-1">
                    <Link href="/quen-mat-khau" className="text-sm text-green-600 hover:underline">
                      {t.forgotPassword}
                    </Link>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-6 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.loggingIn}
                    </span>
                  ) : (
                    t.login
                  )}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      {t.or}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                    {t.googleLogin}
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center md:hidden">
                <p className="text-sm text-gray-600">
                  {t.noAccount}{' '}
                  <Link href="/tai-khoan/dang-ky" className="text-green-600 font-medium hover:underline">
                    {t.register}
                  </Link>
                </p>
              </div>
            </div>
          </div>
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