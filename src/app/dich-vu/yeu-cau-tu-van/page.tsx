'use client';

import type { NextPage } from 'next';
import EmployeeGrid from '../../../components/profileList/profileList';
import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '@/helpers/api/config';

interface Employee {
  id: string;
  avatar: string;
  fullName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  education: string;
  bio?: string;
}

const removeDiacritics = (str: string) =>
  (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const Home: NextPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await axiosInstance.get('/experts/');
        const mappedData = res.data.map((expert: any) => ({
          id: expert.id,
          avatar: expert.avatar,
          fullName: expert.name,
          position: expert.certification,
          department: 'Tư vấn tâm lý',
          education: expert.certification,
          email: expert.email,
          phone: expert.phone,
          bio: expert.bio,
        }));
        setEmployees(mappedData);
        setCurrentPage(1);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách chuyên gia:', error);
      }
    };
    fetchExperts();
  }, []);

  // Lọc theo thanh tìm kiếm (không dấu cho tên)
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    const q = removeDiacritics(searchTerm);
    return employees.filter((e) => {
      const name = removeDiacritics(e.fullName);
      const position = removeDiacritics(e.position);
      const department = removeDiacritics(e.department);
      return (
        name.includes(q) ||
        position.includes(q) ||
        department.includes(q) ||
        (e.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.phone || '').includes(searchTerm)
      );
    });
  }, [employees, searchTerm]);

  // Phân trang dựa trên danh sách đã lọc
  const totalItems = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  // Yêu cầu tư vấn
  const handleRequestConsultation = async (expertId: string) => {
    try {
      const clientData = localStorage.getItem('user');
      const clientId = clientData ? JSON.parse(clientData).id : null;

      if (!clientId) {
        alert('Bạn cần đăng nhập để gửi yêu cầu tư vấn.');
        return;
      }

      const start_time = new Date().toISOString();
      const end_time = new Date(Date.now() + 30 * 60000).toISOString();

      const res = await axiosInstance.post('/appointments', {
        client_id: clientId,
        expert_id: expertId,
        start_time,
        end_time,
        method: 'chat',
      });

      if (res.status === 200 || res.status === 201) {
        alert(res.data.message || 'Yêu cầu tư vấn đã được gửi!');
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert(error.response.data?.message || 'Bạn đã yêu cầu chuyên gia này rồi.');
      } else {
        console.error('Lỗi khi gửi yêu cầu tư vấn:', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu tư vấn.');
      }
    }
  };

  return (
  <div className="bg-gray-50 min-h-screen">
    {/* Header */}
    <div className="max-w-7xl mx-auto px-4 pt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Danh Sách Chuyên Gia
      </h1>
    </div>

    {/* Thanh tìm kiếm */}
    <div className="max-w-7xl mx-auto px-4 pt-6 flex justify-center">
      <div className="relative w-full sm:w-96">
        <input
          type="text"
          placeholder="Tìm theo tên chuyên gia..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <svg
          className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    {/* Danh sách chuyên gia */}
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <EmployeeGrid
        employees={currentItems}
        onRequestConsultation={handleRequestConsultation}
      />
    </div>

    {/* Thanh phân trang */}
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row 
                    sm:items-center sm:justify-between gap-3 border-t border-gray-200 mt-6 pt-6">
      <p className="text-sm text-gray-500">
        Hiển thị {totalItems === 0 ? 0 : indexOfFirstItem + 1}
        {' - '}
        {Math.min(indexOfLastItem, totalItems)}
        {' trong tổng số '}
        {totalItems} chuyên gia
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1 || totalItems === 0}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Trước
        </button>

        <span className="px-3 py-1">
          Trang {totalItems === 0 ? 0 : currentPage} / {totalItems === 0 ? 0 : totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalItems === 0}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  </div>
);

};

export default Home;
