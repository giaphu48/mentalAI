'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '@/helpers/api/config';

type Expert = {
  id: string;
  name: string;
  email: string;
  phone: string;
  certification: string;
  role: string;
};

const ExpertManagementPage = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 5; // số dòng mỗi trang

  const fetchExperts = async () => {
    try {
      const res = await axiosInstance.get(`/experts/`);
      // res.data: [{ id, name, email, phone, certification, role }, ...]
      setExperts(res.data);
    } catch (err) {
      console.error(err);
      alert('Tải danh sách chuyên gia thất bại!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lọc theo tên/email/SĐT/bằng cấp/role
  const filtered = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    if (!s) return experts;
    return experts.filter((e) =>
      [e.name, e.email, e.phone, e.certification, e.role]
        .filter(Boolean)
        .some((v) => (v || '').toLowerCase().includes(s))
    );
  }, [experts, searchTerm]);

  // Cắt dữ liệu theo trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  // Nếu xóa ở trang cuối khiến trang trống -> lùi trang
  useEffect(() => {
    if (!loading && currentItems.length === 0 && currentPage > 1) {
      setCurrentPage((p) => Math.max(1, p - 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, loading]);

  const getSerialNumber = (idxInPage: number) => indexOfFirstItem + idxInPage + 1;

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chuyên gia này?')) return;
    try {
      await axiosInstance.delete(`/experts/${id}`);
      setExperts((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert('Xóa thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ CHUYÊN GIA</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT, bằng cấp, phân quyền..."
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
              />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-sm text-gray-600">Đang tải danh sách...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên chuyên gia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bằng cấp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phân quyền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Không có chuyên gia phù hợp.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((expert, idx) => (
                    <tr key={expert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">{getSerialNumber(idx)}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{expert.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{expert.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{expert.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{expert.certification}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{expert.role}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/chuyen-gia/${expert.id}`}
                            className="px-3 py-1 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md"
                          >
                            Sửa
                          </Link>
                          <button
                            className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded-md"
                            onClick={() => handleDelete(expert.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Phân trang */}
        {!loading && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
            <p className="text-sm text-gray-500">
              Hiển thị {filtered.length === 0 ? 0 : indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filtered.length)} trong tổng số {filtered.length} chuyên gia
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-3 py-1">Trang {currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}

        {/* Khu vực thêm mới */}
        <div className="mt-6">
          <Link
            href="/admin/chuyen-gia/them"
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
          >
            Thêm chuyên gia
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpertManagementPage;
