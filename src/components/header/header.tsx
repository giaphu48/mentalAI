'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';
import Image from 'next/image';
import '../../styles/global.css';
import { useLanguage } from '@/context/languageContext';
import Avatar from '../../../public/image/user.jpg';

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
  // Add other fields as needed
}



export default function Header() {
  const [langOpen, setLangOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const [client, setClient] = useState<Client | null>(null);
  const { language, setLanguage } = useLanguage();
  type Language = keyof typeof MENU;
  const t = MENU[language as Language];
  const toggleLang = () => setLangOpen((prev) => !prev);
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('token')
  const avatarSrc = client?.avatar || Avatar;
  
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:3025/clients/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error('Failed to fetch user');
        return;
      }

      const data = await res.json();
      setClient(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn]);

  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between p-4">
      <div className="logo flex-shrink-0">
        <Link href="/">
        <Image src="/image/logo.png" alt="Logo" width={120} height={70} />
        </Link>
      </div>
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-4">
        <Link href="/" className="flex items-center">{t.home}</Link>
        <Link href="/" className="flex items-center">{t.about}</Link>
        <div className="relative">
        <button
          className="flex items-center space-x-1 focus:outline-none cursor-pointer"
          type="button"
          onClick={() => setServiceOpen((prev) => !prev)}
          aria-expanded={serviceOpen}
        >
          <span>{t.services}</span>
          <ChevronDown className="w-3 h-4 ml-1" />
        </button>
        {serviceOpen && (
          <div
          className="absolute left-0 mt-2 w-56 bg-white border rounded shadow-lg z-20"
          tabIndex={-1}
          ref={serviceDropdownRef}
          >
          <Link
            href="/services/consulting"
            className="block px-4 py-2 hover:bg-gray-100"
            onClick={() => setServiceOpen(false)}
          >
            {t.consulting}
          </Link>
          <Link
            href="/"
            className="block px-4 py-2 hover:bg-gray-100"
            onClick={() => setServiceOpen(false)}
          >
            {t.psychological_test}
          </Link>
          <Link
            href="/"
            className="block px-4 py-2 hover:bg-gray-100"
            onClick={() => setServiceOpen(false)}
          >
            {t.appointment_with_experts}
          </Link>
          <Link href="/" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setServiceOpen(false)}>
            {t.emotional_diary}
          </Link>
          </div>
        )}
        </div>
        <Link href="/contact" className="flex items-center">{t.careers}</Link>
      </nav>
      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {client ? (
        <div className="relative">
  <button
    className="flex items-center space-x-2"
    onClick={() => setUserDropdownOpen((prev) => !prev)}
    type="button"
  >
    <Image
      src={avatarSrc}
      alt="User Avatar"
      width={32}
      height={32}
      className="rounded-full object-cover"
    />
    <span className="text-sm font-medium">{client.name}</span>
    <ChevronDown className="w-4 h-4" />
  </button>
  {userDropdownOpen && (
    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-40">
      <Link href="/ho-so/thong-tin" className="block px-4 py-2 hover:bg-gray-100">Hồ sơ</Link>
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        }}
      >
        Đăng xuất
      </button>
    </div>
  )}
</div>
        ) : (
        <button
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition-colors flex justify-end cursor-pointer"
          type="button"
          onClick={() => window.location.href = '/taikhoan/dangnhap'}
        >
          Bắt đầu
        </button>
        )}

        {/* Language Switcher */}
        <div className="relative">
        <button
          className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 text-sm"
          onClick={toggleLang}
          type="button"
        >
          <Globe className="w-4 h-4" />
          <span>{t.languages[language]}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {langOpen && (
          <ul className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-30">
          <li>
            <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setLanguage('vi');
              setLangOpen(false);
            }}
            >
            {MENU.vi.languages.vi}
            </button>
          </li>
          <li>
            <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setLanguage('en');
              setLangOpen(false);
            }}
            >
            {MENU.vi.languages.en}
            </button>
          </li>
          </ul>
        )}
        </div>
      </div>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex items-center p-2"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-label="Open menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
      <div className="md:hidden bg-white border-t shadow-lg px-4 pb-4 z-40">
        <nav className="flex flex-col space-y-2 mt-2">
        <Link href="/" className="py-2" onClick={() => setMobileMenuOpen(false)}>{t.home}</Link>
        <Link href="/" className="py-2" onClick={() => setMobileMenuOpen(false)}>{t.about}</Link>
        <div className="relative">
          <button
          className="flex items-center space-x-1 w-full py-2"
          type="button"
          onClick={() => setServiceOpen((prev) => !prev)}
          aria-expanded={serviceOpen}
          >
          <span>{t.services}</span>
          <ChevronDown className="w-3 h-4 ml-1" />
          </button>
          {serviceOpen && (
          <div className="ml-4 mt-1 flex flex-col space-y-1">
            <Link
            href="/services/consulting"
            className="block px-2 py-1 hover:bg-gray-100"
            onClick={() => {
              setServiceOpen(false);
              setMobileMenuOpen(false);
            }}
            >
            {t.consulting}
            </Link>
            <Link
            href="/"
            className="block px-2 py-1 hover:bg-gray-100"
            onClick={() => {
              setServiceOpen(false);
              setMobileMenuOpen(false);
            }}
            >
            {t.psychological_test}
            </Link>
            <Link
            href="/"
            className="block px-2 py-1 hover:bg-gray-100"
            onClick={() => {
              setServiceOpen(false);
              setMobileMenuOpen(false);
            }}
            >
            {t.appointment_with_experts}
            </Link>
            <Link
            href="/"
            className="block px-2 py-1 hover:bg-gray-100"
            onClick={() => {
              setServiceOpen(false);
              setMobileMenuOpen(false);
            }}
            >
            {t.emotional_diary}
            </Link>
          </div>
          )}
        </div>
        <Link href="/contact" className="py-2" onClick={() => setMobileMenuOpen(false)}>{t.careers}</Link>
        {client ? (
          <div className="relative group mt-2">
          <button className="flex items-center space-x-2 w-full py-2">
            <Image
            src={avatarSrc}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover"
            />
            <span className="text-sm font-medium">{client.name}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="ml-4 mt-1 flex flex-col space-y-1">
            <Link
            href="/taikhoan/profile"
            className="block px-2 py-1 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(false)}
            >
            Hồ sơ
            </Link>
            <button
            className="block text-left px-2 py-1 hover:bg-gray-100"
            onClick={() => {
              localStorage.removeItem('token');
              setMobileMenuOpen(false);
              window.location.href = '/';
            }}
            >
            Đăng xuất
            </button>
          </div>
          </div>
        ) : (
          <button
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition-colors mt-2"
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            window.location.href = '/taikhoan/dangnhap';
          }}
          >
          Bắt đầu
          </button>
        )}
        {/* Language Switcher */}
        <div className="relative mt-2">
          <button
          className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 text-sm w-full"
          onClick={toggleLang}
          type="button"
          >
          <Globe className="w-4 h-4" />
          <span>{t.languages[language]}</span>
          <ChevronDown className="w-4 h-4" />
          </button>
          {langOpen && (
          <ul className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-30">
            <li>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
              setLanguage('vi');
              setLangOpen(false);
              setMobileMenuOpen(false);
              }}
            >
              {MENU.vi.languages.vi}
            </button>
            </li>
            <li>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
              setLanguage('en');
              setLangOpen(false);
              setMobileMenuOpen(false);
              }}
            >
              {MENU.vi.languages.en}
            </button>
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
