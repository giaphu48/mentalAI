'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/helpers/api/config';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';
import '../../styles/global.css';
import { useLanguage } from '@/context/languageContext';

const MENU = {
  vi: {
    home: 'Trang chủ',
    about: 'Giới thiệu',
    services: 'Dịch vụ',
    consulting: 'Tư vấn tâm lý cùng AI',
    psychological_test: 'Trắc nghiệm tâm lý',
    emotional_diary: 'Nhật ký cảm xúc',
    appointment_with_experts: 'Đặt lịch hẹn với chuyên gia',
    careers: 'Tuyển dụng',
    start: 'Bắt đầu',
    profile: 'Hồ sơ',
    change_password: 'Đổi mật khẩu',
    logout: 'Đăng xuất',
    languages: {
      vi: 'Tiếng Việt',
      en: 'English',
    },
  },
  en: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    consulting: 'Consulting',
    psychological_test: 'Psychological Test',
    emotional_diary: 'Emotional Diary',
    appointment_with_experts: 'Appointment with Experts',
    careers: 'Careers',
    start: 'Get Started',
    profile: 'Profile',
    change_password: 'Change Password',
    logout: 'Logout',
    languages: {
      vi: 'Vietnamese',
      en: 'English',
    },
  },
};

interface Client {
  id: string;
  name: string;
  avatar?: string;
  gender: string;
  dob: Date;
}

export default function Header() {
  const [langOpen, setLangOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { language, setLanguage } = useLanguage();
  type Language = keyof typeof MENU;
  const t = MENU[language as Language];
  const avatarSrc = client?.avatar || '/image/user.jpg';

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/clients/me');
        setClient(res.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (token) {
      setIsLoggedIn(true);
      fetchUser();
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <div className="logo flex-shrink-0">
          <Link href="/">
            <img src="/image/logo.png" alt="Logo" width={120} height={70} />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex justify-center items-center space-x-4">
          <Link href="/">{t.home}</Link>
          <Link href="/">{t.about}</Link>
          <div className="relative">
            <button
              aria-haspopup="true"
              aria-expanded={serviceOpen}
              onClick={() => setServiceOpen((prev) => !prev)}
              type="button"
              className="flex items-center space-x-1"
            >
              <span>{t.services}</span>
              <ChevronDown className="w-3 h-4 ml-1" />
            </button>
            {serviceOpen && (
              <div
                ref={serviceDropdownRef}
                className="absolute left-0 mt-2 w-56 bg-white border rounded shadow-lg z-20"
              >
                <Link href="/services/consulting" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setServiceOpen(false)}>{t.consulting}</Link>
                <Link href="/" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setServiceOpen(false)}>{t.psychological_test}</Link>
                <Link href="/" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setServiceOpen(false)}>{t.appointment_with_experts}</Link>
              </div>
            )}
          </div>
          <Link href="/contact">{t.careers}</Link>
        </nav>

        {/* Right - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn && client ? (
            <div className="relative">
              <button className="flex items-center space-x-2" onClick={() => setUserDropdownOpen((prev) => !prev)}>
                <img src={avatarSrc} alt="Avatar" className="w-10 h-10 rounded-full object-cover border" />
                {client?.name && <span className="text-sm font-medium">{client.name}</span>}
                <ChevronDown className="w-4 h-4" />
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-40">
                  <Link href="/ho-so/thong-tin" className="block px-4 py-2 hover:bg-gray-100">{t.profile}</Link>
                  <Link href="/ho-so/doi-mat-khau" className="block px-4 py-2 hover:bg-gray-100">{t.change_password}</Link>
                  <Link href="/ho-so/nhat-ky" className="block px-4 py-2 hover:bg-gray-100">{t.emotional_diary}</Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={logout}>{t.logout}</button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => (window.location.href = '/taikhoan/dangnhap')}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition-colors"
            >
              {t.start}
            </button>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 text-sm" onClick={() => setLangOpen((prev) => !prev)}>
              <Globe className="w-4 h-4" />
              <span>{t.languages[language]}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {langOpen && (
              <ul className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-30">
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setLanguage('vi'); setLangOpen(false); }}>{MENU.vi.languages.vi}</button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setLanguage('en'); setLangOpen(false); }}>{MENU.vi.languages.en}</button>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden flex items-center p-2" onClick={() => setMobileMenuOpen((prev) => !prev)} aria-label="Open menu">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg px-4 pb-4 z-40">
          <nav className="flex flex-col space-y-2 mt-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>{t.home}</Link>
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>{t.about}</Link>
            <button onClick={() => setServiceOpen((prev) => !prev)} className="flex items-center space-x-1">
              <span>{t.services}</span>
              <ChevronDown className="w-3 h-4 ml-1" />
            </button>
            {serviceOpen && (
              <div className="ml-4 mt-1 flex flex-col space-y-1">
                <Link href="/services/consulting" onClick={() => setMobileMenuOpen(false)}>{t.consulting}</Link>
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>{t.psychological_test}</Link>
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>{t.appointment_with_experts}</Link>
              </div>
            )}
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>{t.careers}</Link>

            {isLoggedIn && client ? (
              <>
                <Link href="/ho-so/thong-tin" onClick={() => setMobileMenuOpen(false)}>{t.profile}</Link>
                <button onClick={logout} className="text-left">{t.logout}</button>
              </>
            ) : (
              <button onClick={() => { setMobileMenuOpen(false); window.location.href = '/taikhoan/dangnhap'; }} className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 mt-2">
                {t.start}
              </button>
            )}

            {/* Mobile Language Switcher */}
            <div className="relative mt-2">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 text-sm w-full" onClick={() => setLangOpen((prev) => !prev)}>
                <Globe className="w-4 h-4" />
                <span>{t.languages[language]}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {langOpen && (
                <ul className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-30">
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setLanguage('vi'); setLangOpen(false); setMobileMenuOpen(false); }}>{MENU.vi.languages.vi}</button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setLanguage('en'); setLangOpen(false); setMobileMenuOpen(false); }}>{MENU.vi.languages.en}</button>
                  </li>
                </ul>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
