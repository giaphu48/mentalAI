'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import axiosInstance from '@/helpers/api/config';

interface RequestItem {
  id: string;
  clientId: string;
  expertId: string;
  fullName: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  status: string;
  chatSessionId: string;
}

type Role = 'expert' | 'admin' | 'client' | string;

interface StoredUser {
  id: string;
  role?: Role | Role[];
}

const ConsultationRequests = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expertId, setExpertId] = useState<string | null>(null);

  const router = useRouter();
  const itemsPerPage = 5;

  // 🔥 FIX: lấy user từ localStorage trong useEffect
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) {
        alert('Bạn cần đăng nhập để tiếp tục.');
        router.replace('/');
        return;
      }

      const user = JSON.parse(raw) as StoredUser;
      setExpertId(user.id);

      const role = user.role;

      const isExpert =
        (typeof role === 'string' && role.toLowerCase() === 'expert') ||
        (Array.isArray(role) && role.map((r) => r.toLowerCase()).includes('expert'));

      if (!isExpert) {
        alert('Bạn không có quyền truy cập trang này.');
        router.replace('/');
        return;
      }
    } catch (e) {
      console.error('Lỗi user:', e);
      router.replace('/');
    }
  }, [router]);

  // 🔥 FIX: chỉ gọi API khi có expertId
  useEffect(() => {
    if (expertId) {
      fetchRequests();
    }
  }, [expertId]);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get(`/appointments/expert/${expertId}`);

      const mappedData = response.data.map((item: any) => ({
        id: item.id,
        clientId: item.client_id,
        expertId: item.expert_id,
        fullName: item.fullName,
        gender:
          item.gender === 'male'
            ? 'Nam'
            : item.gender === 'female'
            ? 'Nữ'
            : 'Khác',
        dob: item.dob
          ? new Date(item.dob).toLocaleDateString('vi-VN')
          : '',
        phone: item.phone,
        email: item.email,
        chatSessionId: item.session_id,
        status:
          item.status === 'confirmed'
            ? 'Đã chấp nhận'
            : item.status === 'rejected'
            ? 'Đã từ chối'
            : item.status === 'done'
            ? 'Đã hoàn thành'
            : 'Chờ xử lý',
      }));

      setRequests(mappedData);
    } catch (error) {
      console.error('Lỗi fetch:', error);
    }
  };

  const handleAccept = async (appointmentId: string, clientId: string, expertId: string) => {
    try {
      const res = await axiosInstance.put(`/appointments/${appointmentId}/accept`, {
        clientId,
        expertId,
      });

      if (res.status === 200) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === appointmentId ? { ...r, status: 'Đã chấp nhận' } : r
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (appointmentId: string) => {
    try {
      const res = await axiosInstance.put(`/appointments/${appointmentId}/reject`);

      if (res.status === 200) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === appointmentId ? { ...r, status: 'Đã từ chối' } : r
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDone = async (appointmentId: string) => {
    try {
      const res = await axiosInstance.put(`/appointments/${appointmentId}/done`);

      if (res.status === 200) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === appointmentId ? { ...r, status: 'Đã hoàn thành' } : r
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredRequests = requests.filter(
    (request) =>
      (request.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request.phone || '').includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">

        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Danh sách yêu cầu tư vấn</h1>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border px-3 py-2 rounded"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((r, i) => (
              <tr key={r.id}>
                <td>{indexOfFirstItem + i + 1}</td>
                <td>{r.fullName}</td>
                <td>{r.status}</td>
                <td>
                  {r.status === 'Chờ xử lý' && (
                    <>
                      <button onClick={() => handleAccept(r.id, r.clientId, r.expertId)}>
                        Accept
                      </button>
                      <button onClick={() => handleReject(r.id)}>
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          Trang {currentPage}/{totalPages}
        </div>
      </div>
    </div>
  );
};

export default ConsultationRequests;