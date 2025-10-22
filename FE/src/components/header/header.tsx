'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axiosInstance from '@/helpers/api/config';
import { Bell, Menu, X } from 'lucide-react';
import '../../styles/global.css';

interface Client {
  id: string;
  name: string;
  avatar?: string;
  gender: string;
  dob: Date | string;
}

interface UserProfile extends Client {
  role: 'client' | 'expert' | 'admin';
}

interface Notification {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function Header() {
  // UI state
  const [serviceOpen, setServiceOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Data state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Refs for outside-click handling
  const serviceRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!profile;

  const avatarSrc = useMemo(() => {
    if (!profile) return '/image/user.jpg';
    return profile.role === 'admin' ? '/image/user.jpg' : profile.avatar || '/image/user.jpg';
  }, [profile]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  // Load profile
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await axiosInstance.get('/users/me', { signal: ac.signal });
        setProfile(res.data);
      } catch (err) {
        setProfile(null);
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.error('❌ Error fetching user profile:', err);
        }
      }
    })();
    return () => ac.abort();
  }, []);

  // Fetch notifications (polling nhẹ)
  const fetchNotifications = useCallback(async (signal?: AbortSignal) => {
    try {
      if (!profile?.id) return;
      const res = await axiosInstance.get(`/notifications/${profile.id}`, { signal });
      setNotifications(res.data || []);
    } catch (err) {
      if (!(err instanceof DOMException && (err as DOMException).name === 'AbortError')) {
        console.error('❌ Error fetching notifications:', err);
      }
    }
  }, [profile?.id]);

  useEffect(() => {
    if (!profile?.id) return;

    const ac = new AbortController();
    fetchNotifications(ac.signal);

    const interval = window.setInterval(() => fetchNotifications(), 60_000);
    return () => {
      ac.abort();
      window.clearInterval(interval);
    };
  }, [profile?.id, fetchNotifications]);

  // ✅ FIX: mark as read
  const markNotificationsAsRead = useCallback(async () => {
    if (!profile?.id || unreadCount === 0) return;
    try {
      const res = await axiosInstance.put(`/notifications/read/${profile.id}`);
      if (res.status === 200) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      }
    } catch (err) {
      console.error('❌ Error marking notifications as read:', err);
    }
  }, [profile?.id, unreadCount]);

  // Close menus on outside click or Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (serviceRef.current && !serviceRef.current.contains(target)) setServiceOpen(false);
      if (notifRef.current && !notifRef.current.contains(target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(target)) setUserDropdownOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServiceOpen(false);
        setNotifOpen(false);
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Open one menu should close others (desktop)
  const toggleService = useCallback(() => {
    setServiceOpen((v) => {
      const next = !v;
      if (next) {
        setNotifOpen(false);
        setUserDropdownOpen(false);
      }
      return next;
    });
  }, []);

  const toggleNotif = useCallback(() => {
    setNotifOpen((v) => {
      const next = !v;
      if (next) {
        setServiceOpen(false);
        setUserDropdownOpen(false);
        // ✅ Gọi mark-as-read khi mở khay và có unread
        markNotificationsAsRead();
      }
      return next;
    });
  }, [markNotificationsAsRead]);

  const toggleUser = useCallback(() => {
    setUserDropdownOpen((v) => {
      const next = !v;
      if (next) {
        setServiceOpen(false);
        setNotifOpen(false);
      }
      return next;
    });
  }, []);

  const toggleMobile = useCallback(() => setMobileMenuOpen((v) => !v), []);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/users/logout', {}, { withCredentials: true });
      localStorage.removeItem('persist:root');
      localStorage.removeItem('user');
      window.location.assign('/');
    } catch (err) {
      console.error('❌ Logout failed:', err);
    }
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" aria-label="Trang chủ">
              <Image src="/image/logo.png" alt="Logo" width={160} height={48} priority className="h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Chính">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Trang chủ</Link>
            <Link href="/about-us" className="text-gray-700 hover:text-blue-600 font-medium">Giới thiệu</Link>

            <div className="relative" ref={serviceRef}>
              <button
                onClick={toggleService}
                className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                aria-haspopup="menu"
                aria-expanded={serviceOpen}
                aria-controls="services-menu"
              >
                Dịch vụ
              </button>

              {serviceOpen && (
                <div
                  id="services-menu"
                  role="menu"
                  className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                >
                  <Link href="/services/counseling" className="block px-4 py-2 text-gray-700 hover:bg-blue-50" role="menuitem">
                    Tư vấn tâm lý
                  </Link>
                  <Link href="/services/mbti-test/quiz" className="block px-4 py-2 text-gray-700 hover:bg-blue-50" role="menuitem">
                    Trắc nghiệm tính cách
                  </Link>
                  <Link href="/services/counseling-request" className="block px-4 py-2 text-gray-700 hover:bg-blue-50" role="menuitem">
                    Yêu cầu chuyên gia tư vấn
                  </Link>
                  <Link href="/services/blogs" className="block px-4 py-2 text-gray-700 hover:bg-blue-50" role="menuitem">
                    Blog chữa lành
                  </Link>
                </div>
              )}
            </div>

            <Link href="/careers" className="text-gray-700 hover:text-blue-600 font-medium">Tuyển dụng</Link>
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            {isLoggedIn && profile && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={toggleNotif}
                  className="relative p-2 text-gray-600 hover:text-blue-600"
                  aria-haspopup="menu"
                  aria-expanded={notifOpen}
                  aria-controls="notif-menu"
                  aria-label="Thông báo"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 grid place-items-center rounded-full" aria-live="polite">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div id="notif-menu" role="menu" className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    {notifications.length > 0 ? (
                      <div className="max-h-80 overflow-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b">
                            <p className="leading-snug">{n.message}</p>
                            <time className="block mt-1 text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</time>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">Không có thông báo</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User Section */}
            {isLoggedIn && profile ? (
              <div className="relative" ref={userRef}>
                <button onClick={toggleUser} className="flex items-center gap-2" aria-haspopup="menu" aria-expanded={userDropdownOpen} aria-controls="user-menu">
                  <Image src={avatarSrc} alt="User Avatar" width={36} height={36} className="w-9 h-9 rounded-full object-cover border-2 border-blue-100" />
                  <span className="text-sm font-medium text-gray-700">{profile.role === 'admin' ? 'Admin' : profile.name}</span>
                </button>

                {userDropdownOpen && (
                  <div id="user-menu" role="menu" className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                    {profile.role === 'client' && (
                      <>
                        <Link href="/profiles/informations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" role="menuitem">Hồ sơ</Link>
                        <Link href="/profiles/diaries" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" role="menuitem">Nhật ký cảm xúc</Link>
                      </>
                    )}
                    {profile.role === 'expert' && (
                      <>
                        <Link href="/experts/information" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" role="menuitem">Hồ sơ</Link>
                        <Link href="/experts/request-management" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" role="menuitem">Yêu cầu tư vấn</Link>
                      </>
                    )}
                    {profile.role === 'admin' && (
                      <>
                        <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" role="menuitem">Trang quản trị</Link>
                      </>
                    )}
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem">Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/accounts/sign-in" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Bắt đầu
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600"
            onClick={toggleMobile}
            aria-label="Mở/đóng menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden mt-3 border-t pt-3 space-y-3">
            <Link href="/" className="block text-gray-700 hover:text-blue-600 font-medium">Trang chủ</Link>
            <Link href="/gioi-thieu" className="block text-gray-700 hover:text-blue-600 font-medium">Giới thiệu</Link>

            <details className="group">
              <summary className="list-none cursor-pointer text-gray-700 hover:text-blue-600 font-medium flex items-center justify-between">
                <span>Dịch vụ</span>
                <span className="transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="mt-2 pl-3 space-y-2">
                <Link href="/services/counseling" className="block text-gray-700 hover:text-blue-600">Tư vấn tâm lý cùng AI</Link>
                <Link href="/services/mbti-test/quiz" className="block text-gray-700 hover:text-blue-600">Trắc nghiệm tâm lý</Link>
                <Link href="/services/counseling-request" className="block text-gray-700 hover:text-blue-600">Yêu cầu chuyên gia tư vấn</Link>
                <Link href="/services/blogs" className="block text-gray-700 hover:text-blue-600">Blog chữa lành</Link>
              </div>
            </details>

            <Link href="/careers" className="block text-gray-700 hover:text-blue-600 font-medium">Tuyển dụng</Link>

            {/* Mobile user section */}
            {isLoggedIn && profile ? (
              <div className="mt-4 border-t pt-3">
                <div className="flex items-center gap-3">
                  <Image src={avatarSrc} alt="User Avatar" width={36} height={36} className="w-9 h-9 rounded-full object-cover border-2 border-blue-100" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">{profile.role === 'admin' ? 'Admin' : profile.name}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {profile.role === 'client' && (
                    <>
                      <Link href="/profiles/informations" className="block text-gray-700 hover:text-blue-600">Hồ sơ</Link>
                      <Link href="/profiles/diaries" className="block text-gray-700 hover:text-blue-600">Nhật ký cảm xúc</Link>
                    </>
                  )}
                  {profile.role === 'expert' && (
                    <>
                      <Link href="/experts/information" className="block text-gray-700 hover:text-blue-600">Hồ sơ</Link>
                      <Link href="/experts/request-management" className="block text-gray-700 hover:text-blue-600">Yêu cầu tư vấn</Link>
                    </>
                  )}
                  {profile.role === 'admin' && (
                    <>
                      <Link href="/admin" className="block text-gray-700 hover:text-blue-600">Trang quản trị</Link>
                    </>
                  )}
                  <button onClick={logout} className="w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg">Đăng xuất</button>
                </div>
              </div>
            ) : (
              <Link href="/accounts/sign-in" className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium text-center">
                Bắt đầu
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
