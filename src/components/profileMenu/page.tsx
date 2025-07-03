'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { label: "Thông tin cá nhân", href: "/ho-so/thong-tin" },
    { label: "Đổi mật khẩu", href: "/ho-so/doi-mat-khau" },
    { label: "Lịch sử giao dịch", href: "/profile/history" },
    { label: "Cài đặt", href: "/profile/settings" },
];

export default function ProfileSidebar() {
    const pathname = usePathname();

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
                                    {/* You can add icons here if you want */}
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