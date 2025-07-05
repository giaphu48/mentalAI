'use client';

import { FaDollarSign, FaCalendar, FaClipboardList, FaComments } from 'react-icons/fa';

const DashboardPage = () => {
  const stats = [
    {
      title: 'Khách hàng',
      value: '120', // ví dụ, thay bằng props
      icon: <FaCalendar className="text-gray-300 text-2xl" />,
      border: 'border-l-blue-500',
      text: 'text-blue-600',
    },
    {
      title: 'Chuyên gia',
      value: '12',
      icon: <FaCalendar className="text-gray-300 text-2xl" />,
      border: 'border-l-blue-500',
      text: 'text-blue-600',
    },
    {
      title: 'Số blog',
      value: '18',
      icon: <FaClipboardList className="text-gray-300 text-2xl" />,
      border: 'border-l-cyan-500',
      text: 'text-cyan-600',
    },
    {
      title: 'Giày',
      value: '145',
      icon: <FaClipboardList className="text-gray-300 text-2xl" />,
      border: 'border-l-cyan-500',
      text: 'text-cyan-600',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h4 className="text-xl font-bold uppercase">Thống kê</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`card shadow ${stat.border} border-l-4 py-4 px-5 bg-white rounded-lg`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className={`text-xs font-bold uppercase mb-1 ${stat.text}`}>
                  {stat.title}
                </div>
                <div className="text-lg font-bold text-gray-800">{stat.value}</div>
              </div>
              <div>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
