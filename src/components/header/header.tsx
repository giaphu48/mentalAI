'use client';

import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/hooks/useAppDispatch';
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

interface UserProfile extends Client {
  role: 'client' | 'expert' | 'admin';
}

export default function Header() {
  const user = useSelector((state: RootState) => state.user.currentUser) || null;
  const [langOpen, setLangOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { language, setLanguage } = useLanguage();
  type Language = keyof typeof MENU;
  const t = MENU[language as Language];
  const avatarSrc = profile?.role === 'admin'
    ? '/image/user.jpg'
    : profile?.avatar || '/image/user.jpg';

  useEffect(() => {
    const fetchUser = async () => {
      if (!user || !user.role) return;
      try {
        const res = await axiosInstance.get('/users/me');
        setProfile({ ...res.data, role: user.role });
        setIsLoggedIn(true);
      } catch (err) {
        console.error('❌ Error fetching user profile:', err);
      }
    };
    fetchUser();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(e.target as Node)) {
        setServiceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logout = async() => {
    try {
      await axiosInstance.post('http://localhost:3025/users/logout', {}, {
        withCredentials: true
      });
      window.location.reload();
      localStorage.removeItem('persist:root');
    }
    catch(err){
      console.error(err);
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img 
                src="/image/logo.png" 
                alt="Logo" 
                className="h-12 w-auto" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {t.home}
            </Link>
            
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {t.about}
            </Link>
            
            <div className="relative" ref={serviceDropdownRef}>
              <button
                onClick={() => setServiceOpen(!serviceOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {t.services}
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${serviceOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {serviceOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  <Link 
                    href="/dich-vu/tu-van" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setServiceOpen(false)}
                  >
                    {t.consulting}
                  </Link>
                  <Link 
                    href="/psychological-test" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setServiceOpen(false)}
                  >
                    {t.psychological_test}
                  </Link>
                  <Link 
                    href="/appointment" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setServiceOpen(false)}
                  >
                    {t.appointment_with_experts}
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/careers" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {t.careers}
            </Link>
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <Globe className="w-5 h-5" />
                <span className="ml-1 text-sm font-medium">{t.languages[language]}</span>
              </button>
              
              {langOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                  <button 
                    onClick={() => { setLanguage('vi'); setLangOpen(false); }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
                  >
                    {MENU.vi.languages.vi}
                  </button>
                  <button 
                    onClick={() => { setLanguage('en'); setLangOpen(false); }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
                  >
                    {MENU.vi.languages.en}
                  </button>
                </div>
              )}
            </div>

            {/* User Section */}
            {isLoggedIn && profile ? (
              <div className="relative">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2"
                >
                  <img 
                    src={avatarSrc} 
                    alt="User Avatar" 
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-100"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {profile.role === 'admin' ? 'Admin' : profile.name}
                  </span>
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                    {profile.role === 'client' && (
                      <>
                        <Link 
                          href="/ho-so/thong-tin" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          {t.profile}
                        </Link>
                        <Link 
                          href="/ho-so/nhat-ky" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          {t.emotional_diary}
                        </Link>
                      </>
                    )}
                    {profile.role === 'expert' && (
                      <>
                        <Link 
                          href="/chuyen-gia/ho-so" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          Hồ sơ
                        </Link>
                        <Link 
                          href="/chuyen-gia/lich" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          Lịch tư vấn
                        </Link>
                      </>
                    )}
                    {profile.role === 'admin' && (
                      <>
                        <Link 
                          href="/admin" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          Trang quản trị
                        </Link>
                        <Link 
                          href="/admin/khach-hang" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          Quản lý người dùng
                        </Link>
                      </>
                    )}
                    <Link 
                      href={profile.role === 'client' 
                        ? '/ho-so/doi-mat-khau' 
                        : profile.role === 'expert' 
                          ? '/chuyen-gia/doi-mat-khau' 
                          : '/admin/doi-mat-khau'
                      } 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      {t.change_password}
                    </Link>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/tai-khoan/dang-nhap" 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {t.start}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3 border-t pt-4">
            <Link 
              href="/" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.home}
            </Link>
            
            <Link 
              href="/about" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.about}
            </Link>
            
            <button 
              onClick={() => setServiceOpen(!serviceOpen)}
              className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              <span>{t.services}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${serviceOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {serviceOpen && (
              <div className="ml-4 space-y-2 mt-1">
                <Link 
                  href="/dich-vu/tu-van" 
                  className="block py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.consulting}
                </Link>
                <Link 
                  href="/psychological-test" 
                  className="block py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.psychological_test}
                </Link>
                <Link 
                  href="/appointment" 
                  className="block py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.appointment_with_experts}
                </Link>
              </div>
            )}
            
            <Link 
              href="/careers" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.careers}
            </Link>

            {/* Mobile Language Switcher */}
            <div className="pt-2 border-t mt-2">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <Globe className="w-5 h-5 mr-2" />
                <span>{t.languages[language]}</span>
              </button>
              
              {langOpen && (
                <div className="ml-7 mt-1 space-y-1">
                  <button 
                    onClick={() => { setLanguage('vi'); setLangOpen(false); }}
                    className="block w-full py-1 text-left text-gray-600 hover:text-blue-600"
                  >
                    {MENU.vi.languages.vi}
                  </button>
                  <button 
                    onClick={() => { setLanguage('en'); setLangOpen(false); }}
                    className="block w-full py-1 text-left text-gray-600 hover:text-blue-600"
                  >
                    {MENU.vi.languages.en}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile User Section */}
            {isLoggedIn && profile ? (
              <div className="pt-2 border-t mt-2 space-y-2">
                {profile.role === 'client' && (
                  <>
                    <Link 
                      href="/ho-so/thong-tin" 
                      className="block py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t.profile}
                    </Link>
                    <Link 
                      href="/ho-so/nhat-ky" 
                      className="block py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t.emotional_diary}
                    </Link>
                  </>
                )}
                {profile.role === 'expert' && (
                  <>
                    <Link 
                      href="/chuyen-gia/ho-so" 
                      className="block py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Hồ sơ
                    </Link>
                    <Link 
                      href="/chuyen-gia/lich" 
                      className="block py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Lịch tư vấn
                    </Link>
                  </>
                )}
                {profile.role === 'admin' && (
                  <>
                    <Link 
                      href="/admin" 
                      className="block py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Trang quản trị
                    </Link>
                    <Link 
                      href="/admin/khach-hang" 
                      className="block py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Quản lý người dùng
                    </Link>
                  </>
                )}
                <Link 
                  href={
                    profile.role === 'client' 
                      ? '/ho-so/doi-mat-khau' 
                      : profile.role === 'expert' 
                        ? '/chuyen-gia/doi-mat-khau' 
                        : '/admin/doi-mat-khau'
                  } 
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.change_password}
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-600 hover:text-red-800 py-2"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <Link 
                href="/tai-khoan/dang-nhap" 
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg mt-3 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.start}
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}