'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/languageContext";
import { RootState } from '@/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from "lucide-react"; // ⬅️ Thêm icon

const MENU = {
  vi: {
    info: "Thông tin cá nhân",
    password: "Đổi mật khẩu",
    emotional_diaries: "Nhật ký cảm xúc",
    profile: "Hồ sơ",
    schedule: "Lịch tư vấn",
    change_password: "Đổi mật khẩu"
  },
  en: {
    info: "Personal Information",
    password: "Change Password",
    emotional_diaries: "Emotional diaries",
    profile: "Profile",
    schedule: "Consultation Schedule",
    change_password: "Change Password"
  },
};

export default function ProfileSidebar() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const user = useSelector((state: RootState) => state.user.currentUser) || null;
  const t = MENU[language];

  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems =
    user?.role === "expert"
      ? [
        { label: t.profile, href: "/chuyen-gia/ho-so" },
        { label: t.schedule, href: "/chuyen-gia/lich" },
        { label: t.change_password, href: "/chuyen-gia/doi-mat-khau" },
      ]
      : [
        { label: t.info, href: "/ho-so/thong-tin" },
        { label: t.password, href: "/ho-so/doi-mat-khau" },
        { label: t.emotional_diaries, href: "/ho-so/nhat-ky" },
      ];

  return (
    <aside
      className={`h-250 bg-gradient-to-b from-blue-50 to-white shadow-xl rounded-xl transition-all duration-300
      relative
      ${collapsed ? "w-20 p-4 pt-16" : "w-72 p-8 pt-16 "}
      `}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 right-4 bg-white border rounded-full shadow p-1 hover:bg-gray-100 transition"
        aria-label={collapsed ? "Mở rộng" : "Thu gọn"}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <nav>
        <ul className="space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-3 rounded-lg font-semibold transition
                  ${isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-blue-100"}
                  ${collapsed ? "justify-center px-2" : ""}
                `}
                  title={item.label}
                >
                  {!collapsed && item.label}
                  {collapsed && <span className="sr-only">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
