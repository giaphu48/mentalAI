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
  role?: Role | Role[]; // linh hoạt: có thể là string hoặc mảng
}

const ConsultationRequests = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const expertData = localStorage.getItem('user');
  const expertId = expertData ? JSON.parse(expertData).id : null;
  const itemsPerPage = 5; // số dòng mỗi trang

  const filteredRequests = requests.filter(
    (request) =>
      (request.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request.phone || '').includes(searchTerm)
  );

  // Cắt dữ liệu theo trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) {
        alert('Bạn cần đăng nhập để tiếp tục.');
        router.replace('/');
        return;
      }

      const user = JSON.parse(raw) as StoredUser;
      const role = user.role;

      const isExpert =
        (typeof role === 'string' && role.toLowerCase() === 'expert') ||
        (Array.isArray(role) && role.map((r) => r.toLowerCase()).includes('expert'));

      if (!isExpert) {
        alert('Bạn không có quyền truy cập trang này. Chỉ dành cho chuyên gia.');
        router.replace('/');
        return;
      }
    } catch (e) {
      console.error('Không đọc được thông tin người dùng:', e);
      alert('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
      router.replace('/');
      return;
    } finally {

    }
  }, [router]);

  const fetchRequests = async () => {
    if (!expertId) return;

    try {
      const response = await axiosInstance.get(`/appointments/expert/${expertId}`);
      const mappedData = response.data.map((item: any) => ({
        id: item.id,
        clientId: item.client_id,
        expertId: item.expert_id,
        fullName: item.fullName,
        gender: item.gender === 'male' ? 'Nam' : item.gender === 'female' ? 'Nữ' : 'Khác',
        dob: item.dob ? new Date(item.dob).toLocaleDateString('vi-VN') : '',
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

      console.log(mappedData)
      setRequests(mappedData);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách yêu cầu tư vấn:', error);
    }
  };

  const handleAccept = async (appointmentId: string, clientId: string, expertId: string) => {
    try {
      const res = await axiosInstance.put(`/appointments/${appointmentId}/accept`, {
        clientId,
        expertId
      });

      if (res.status === 200) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === appointmentId ? { ...r, status: 'Đã chấp nhận' } : r
          )
        );
        alert('Đã chấp nhận yêu cầu và tạo phòng chat.');
      }
    } catch (error) {
      console.error('Lỗi khi chấp nhận yêu cầu:', error);
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
        alert('Đã từ chối yêu cầu.');
      }
    } catch (error) {
      console.error('Lỗi khi từ chối yêu cầu:', error);
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
        alert('Đã hoàn thành yêu cầu.');
      }
    } catch (error) {
      console.error('Lỗi khi hoàn thành yêu cầu:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Danh sách yêu cầu tư vấn</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc SĐT..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset về trang 1 khi tìm kiếm
              }}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((request, index) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{request.fullName}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {request.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{request.gender}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{request.dob}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {request.phone}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
    ${request.status === 'Đã chấp nhận'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'Đã từ chối'
                            ? 'bg-red-100 text-red-800'
                            : request.status === 'Đã hoàn thành'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <td className="px-6 py-4 text-sm font-medium">
                        {request.status === 'Đã hoàn thành' ? (
                          <span className="text-gray-500 italic">Phiên tư vấn đã kết thúc</span>
                        ) : request.status === 'Đã từ chối' ? (
                          <span className="text-gray-500 italic">Đã từ chối yêu cầu</span>
                        ) : request.status === 'Đã chấp nhận' ? (
                          <div className="flex space-x-2">
                            <button
                              className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                              onClick={() => router.push(`/dich-vu/tu-van/voi-chuyen-gia/${request.chatSessionId}`)}
                            >
                              Chat
                            </button>
                            <button
                              className="px-3 py-1 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                              onClick={() => router.push(`/view/nhat-ky-cam-xuc/${request.clientId}`)}
                            >
                              Xem nhật ký
                            </button>
                            <button
                              className="px-3 py-1 text-white bg-green-600 hover:bg-green-700 rounded-md"
                              onClick={() => handleDone(request.id)}
                            >
                              Hoàn thành
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              className="px-3 py-1 text-white bg-green-600 hover:bg-green-700 rounded-md"
                              onClick={() => handleAccept(request.id, request.clientId, request.expertId)}
                            >
                              Chấp nhận
                            </button>
                            <button
                              className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded-md"
                              onClick={() => handleReject(request.id)}
                            >
                              Từ chối
                            </button>
                          </div>
                        )}
                      </td>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredRequests.length)} trong tổng số {filteredRequests.length} kết quả
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Trước
            </button>
            <span className="px-3 py-1">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRequests;
