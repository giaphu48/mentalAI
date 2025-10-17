'use client';

import { useEffect, useState, useMemo } from 'react';
import { FaDollarSign, FaCalendar, FaClipboardList, FaComments } from 'react-icons/fa';
import axiosInstance from '@/helpers/api/config';

// Helper: nhận diện dữ liệu trả về là mảng hay object có {count}
const getCountFromResponse = (data: any): number => {
  if (Array.isArray(data)) return data.length;
  if (data && typeof data === 'object') {
    // ưu tiên data.count, hoặc data.total, hoặc số đầu tiên tìm thấy
    if (typeof data.count === 'number') return data.count;
    if (typeof data.total === 'number') return data.total;
  }
  return 0;
};

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [customers, setCustomers] = useState(0);
  const [experts, setExperts] = useState(0);
  const [blogs, setBlogs] = useState(0);
  const [questions, setQuestions] = useState(0);

  // TODO: Nếu backend khác URL, sửa lại các endpoint dưới đây cho đúng hệ thống của bạn.
  const ENDPOINTS = useMemo(
    () => ({
      customers: '/clients',
      experts: '/experts',
      blogs: '/blogs',
      questions: '/tests',
    }),
    []
  );

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setErr(null);
      try {
        const [r1, r2, r3, r4] = await Promise.all([
          axiosInstance.get(ENDPOINTS.customers),
          axiosInstance.get(ENDPOINTS.experts),
          axiosInstance.get(ENDPOINTS.blogs),
          axiosInstance.get(ENDPOINTS.questions),
        ]);
        setCustomers(getCountFromResponse(r1.data));
        setExperts(getCountFromResponse(r2.data));
        setBlogs(getCountFromResponse(r3.data));
        setQuestions(getCountFromResponse(r4.data));
      } catch (e) {
        console.error(e);
        setErr('Không tải được số liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [ENDPOINTS]);

  const stats = [
    {
      title: 'Khách hàng',
      value: customers,
      icon: <FaCalendar className="text-gray-300 text-2xl" />,
      border: 'border-l-blue-500',
      text: 'text-blue-600',
    },
    {
      title: 'Chuyên gia',
      value: experts,
      icon: <FaCalendar className="text-gray-300 text-2xl" />,
      border: 'border-l-blue-500',
      text: 'text-blue-600',
    },
    {
      title: 'Số blog',
      value: blogs,
      icon: <FaClipboardList className="text-gray-300 text-2xl" />,
      border: 'border-l-cyan-500',
      text: 'text-cyan-600',
    },
    {
      title: 'Số câu trắc nghiệm',
      value: questions,
      icon: <FaClipboardList className="text-gray-300 text-2xl" />,
      border: 'border-l-cyan-500',
      text: 'text-cyan-600',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h4 className="text-xl font-bold uppercase">Thống kê</h4>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      </div>

      {loading ? (
        // Skeleton đơn giản khi đang tải
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="card shadow border-l-4 border-gray-200 py-4 px-5 bg-white rounded-lg animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="w-24 h-3 bg-gray-200 rounded mb-2" />
                <div className="w-6 h-6 bg-gray-200 rounded" />
              </div>
              <div className="w-16 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
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
                  <div className="text-lg font-bold text-gray-800">
                    {Number(stat.value).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
