'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/languageContext';
import {
  FaHome,
  FaUser,
  FaUsers,
} from 'react-icons/fa';

const TEXT = {
  vi: {
    brand: 'MentalAI',
    functions: 'Chức năng',
    home: 'Trang chủ',
    customer: 'Quản lý khách hàng',
    expert: 'Quản lý chuyên gia'
  },
  en: {
    brand: 'MentalAI',
    functions: 'Functions',
    home: 'Dashboard',
    customer: 'Customer Management',
    expert: 'Expert Management'
  },
};

const Sidebar = () => {
  const { language } = useLanguage();
  const t = TEXT[language];


  return (
    <ul className="bg-gradient-to-b from-blue-800 to-blue-900 text-white w-64 min-h-screen px-2 py-4 space-y-2">
      {/* Brand */}
      <Link href="/admin" className="flex items-center justify-center mb-6">
        <div className="text-lg font-bold tracking-wider">{t.brand}</div>
      </Link>

      <hr className="border-gray-700" />

      {/* Header */}
      <div className="text-sm font-semibold uppercase text-gray-300 px-2">
        {t.functions}
      </div>

      {/* Nav Items */}
      <SidebarItem href="/admin" icon={<FaHome />} text={t.home} />
      <SidebarItem href="/admin/khach-hang" icon={<FaUsers />} text={t.customer} />
      <SidebarItem href="/admin/chuyen-gia" icon={<FaUser/>} text={t.expert}/> 
      <SidebarItem href="/admin/blogs" icon={<FaUser/>} text='Quản lý Blog'/> 

      {/* Toggle button placeholder (optional expand/collapse) */}
      {/* <div className="hidden md:flex justify-center mt-6">
        <button className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500" />
      </div> */}
    </ul>
  );
};

const SidebarItem = ({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center px-3 py-2 rounded transition-colors ${
          isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
        }`}
      >
        <span className="text-lg mr-3">{icon}</span>
        <span className="text-sm">{text}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
