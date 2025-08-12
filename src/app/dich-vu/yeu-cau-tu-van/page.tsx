'use client';

import type { NextPage } from 'next';
import EmployeeGrid from '../../../components/profileList/profileList';
import { useEffect, useState } from 'react';
import axiosInstance from '@/helpers/api/config';

interface Employee {
  id: string; // UUID từ backend
  avatar: string;
  fullName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  education: string;
}

const Home: NextPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Lấy danh sách chuyên gia
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await axiosInstance.get('/experts/');

        const mappedData = res.data.map((expert: any) => ({
          id: expert.id, // cần trả về từ backend là UUID
          avatar: expert.avatar,
          fullName: expert.name,
          position: expert.certification,
          department: 'Tư vấn tâm lý',
          education: expert.certification,
          email: expert.email,
          phone: expert.phone,
        }));

        setEmployees(mappedData);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách chuyên gia:', error);
      }
    };

    fetchExperts();
  }, []);

  // Xử lý khi bấm nút yêu cầu tư vấn
  const handleRequestConsultation = async (expertId: string) => {
    try {
      // Lấy client_id từ localStorage (hoặc từ context auth)
      const clientData = localStorage.getItem('user');
      const clientId = clientData ? JSON.parse(clientData).id : null;


      if (!clientId) {
        alert('Bạn cần đăng nhập để gửi yêu cầu tư vấn.');
        return;
      }

      const start_time = new Date().toISOString();
      const end_time = new Date(Date.now() + 30 * 60000).toISOString(); // +30 phút

      const res = await axiosInstance.post('/appointments', {
        client_id: clientId,
        expert_id: expertId,
        start_time,
        end_time,
        method: 'chat', // hoặc 'video'
      });

      if (res.status === 200 || res.status === 201) {
        alert('Yêu cầu tư vấn đã được gửi!');
      } else {
        alert(res.data.message || 'Gửi yêu cầu thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu tư vấn:', error);
      alert('Có lỗi xảy ra khi gửi yêu cầu tư vấn.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <EmployeeGrid
        employees={employees}
        onRequestConsultation={handleRequestConsultation}
      />
    </div>
  );
};

export default Home;
