'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/languageContext";

const MENU = {
  vi: {
    info: "Thông tin cá nhân",
    password: "Đổi mật khẩu",
    emotional_diaries: "Nhật ký cảm xúc"
    
  },
  en: {
    info: "Personal Information",
    password: "Change Password",
    emotional_diaries: "Emotional diaries"
  },
};

export default function ProfileSidebar() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = MENU[language];

  const menuItems = [
    { label: t.info, href: "/ho-so/thong-tin" },
    { label: t.password, href: "/ho-so/doi-mat-khau" },
    { label: t.emotional_diaries, href: "/ho-so/nhat-ky" },
  ];

  return (
    <aside className="w-72 h-screen bg-gradient-to-b from-blue-50 to-white shadow-xl rounded-xl p-8">
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-3 rounded-lg font-semibold transition
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow"
                          : "text-gray-700 hover:bg-blue-100"
                      }
                  `}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
