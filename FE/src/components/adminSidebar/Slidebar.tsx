'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/languageContext';
import { FaHome, FaUser, FaUsers, FaBlog, FaFile } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TEXT = {
  vi: {
    brand: 'MentalAI',
    functions: 'Chức năng',
    home: 'Trang chủ',
    customer: 'Quản lý khách hàng',
    expert: 'Quản lý chuyên gia',
    blog: 'Quản lý Blog',
    test: 'Quản lý trắc nghiệm'
  },
  en: {
    brand: 'MentalAI',
    functions: 'Functions',
    home: 'Dashboard',
    customer: 'Customer Management',
    expert: 'Expert Management',
    blog: 'Blog Management',
    test: 'Test Management'
  },
};

const Sidebar = () => {
  const { language } = useLanguage();
  const t = TEXT[language];

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-b from-blue-800 to-blue-900 text-white w-64 min-h-screen px-4 py-6 flex flex-col"
    >
      {/* Brand */}
      <Link href="/admin" className="flex items-center justify-start mb-8 group">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white"
        >
          {t.brand}
        </motion.div>
      </Link>

      <hr className="border-blue-600 mb-6" />

      {/* Header */}
      <div className="text-xs font-semibold uppercase text-blue-300 px-2 mb-4 tracking-wider">
        {t.functions}
      </div>

      {/* Nav Items */}
      <nav className="space-y-1 flex-1">
        <SidebarItem href="/admin" icon={<FaHome />} text={t.home} />
        <SidebarItem href="/admin/khach-hang" icon={<FaUsers />} text={t.customer} />
        <SidebarItem href="/admin/chuyen-gia" icon={<FaUser />} text={t.expert} />
        <SidebarItem href="/admin/blogs" icon={<FaBlog />} text={t.blog} />
        <SidebarItem href="/admin/trac-nghiem" icon={<FaFile />} text={t.test} />
      </nav>

      {/* Footer/Collapse button */}
      <div className="pt-4 border-t border-blue-700">
        <button className="flex items-center justify-between w-full px-3 py-2 text-sm text-blue-200 hover:text-white transition-colors">
          <span>{language === 'vi' ? 'Thu gọn' : 'Collapse'}</span>
          <FiChevronRight className="text-lg" />
        </button>
      </div>
    </motion.div>
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
    <motion.li whileHover={{ scale: 1.02 }} className="list-none">
      <Link
        href={href}
        className={`flex items-center px-3 py-3 rounded-lg transition-all ${
          isActive 
            ? 'bg-blue-600 shadow-lg' 
            : 'hover:bg-blue-700/50 hover:shadow-md'
        }`}
      >
        <span className={`text-lg mr-3 ${isActive ? 'text-white' : 'text-blue-200'}`}>
          {icon}
        </span>
        <span className="text-sm font-medium">{text}</span>
        {isActive && (
          <motion.span 
            layoutId="sidebar-active-indicator"
            className="ml-auto w-1 h-6 bg-white rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </Link>
    </motion.li>
  );
};

export default Sidebar;