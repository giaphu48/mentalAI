"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/helpers/api/config";

export type Blog = {
  id: number;
  title: string;
  content?: string;
  category?: string | null;
  date?: string | null;
  read_time?: string | null;
};

const formatVNDate = (value?: string | null) => {
  if (!value) return "-";
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d.toLocaleDateString("vi-VN");
  return value as string;
};

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 5; // số dòng mỗi trang

  const fetchBlogs = async () => {
    try {
      const res = await axiosInstance.get<Blog[]>(`/blogs`);
      setBlogs(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Tải danh sách blog thất bại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài blog này?")) return;
    try {
      await axiosInstance.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Xóa không thành công. Vui lòng thử lại!");
    }
  };

  // Lọc theo từ khóa: tiêu đề / chuyên mục / thời lượng đọc / ngày
  const filtered = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    if (!s) return blogs;
    return blogs.filter((b) =>
      [
        b.title,
        b.category || "",
        b.read_time || "",
        formatVNDate(b.date),
      ]
        .filter(Boolean)
        .some((v) => (v || "").toLowerCase().includes(s))
    );
  }, [blogs, searchTerm]);

  // Phân trang (giống trang chuyên gia)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  // Nếu xóa ở trang cuối khiến trang trống -> lùi trang (giống trang chuyên gia)
  useEffect(() => {
    if (!loading && currentItems.length === 0 && currentPage > 1) {
      setCurrentPage((p) => Math.max(1, p - 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, loading]);

  const getSerialNumber = (idxInPage: number) =>
    indexOfFirstItem + idxInPage + 1;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header + Search (đồng bộ bố cục) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ BLOG</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, chuyên mục, thời lượng đọc, ngày..."
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

        {/* Bảng dữ liệu */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-sm text-gray-600">Đang tải danh sách...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Chuyên mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Đọc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Không có bài viết nào.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {getSerialNumber(idx)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        <div className="font-medium line-clamp-2">{b.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {b.category || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {formatVNDate(b.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {b.read_time || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/dich-vu/blog/${b.id}`}
                            className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                          >
                            Xem
                          </Link>
                          <Link
                            href={`/admin/blogs/${b.id}`}
                            className="px-3 py-1 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md"
                          >
                            Sửa
                          </Link>
                          <button
                            className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded-md"
                            onClick={() => handleDelete(b.id)}
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
              Hiển thị {filtered.length === 0 ? 0 : indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filtered.length)} trong tổng số{" "}
              {filtered.length} bài viết
            </p>
            <div className="flex items-center space-x-2">
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}

        
        <div className="mt-6">
          <Link
            href="/admin/blogs/them"
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
          >
            Thêm blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogsPage;
