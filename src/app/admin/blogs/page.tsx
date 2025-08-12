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
  return value;
};

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  const getSerialNumber = (index: number) => index + 1;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<Blog[]>(`/blogs`);
      setBlogs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
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

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return blogs.filter((b) => {
      const okQ = keyword
        ? (b.title?.toLowerCase().includes(keyword) ||
           b.category?.toLowerCase().includes(keyword) ||
           b.read_time?.toLowerCase().includes(keyword))
        : true;
      const okCat = category ? b.category === category : true;
      return okQ && okCat;
    });
  }, [blogs, q, category]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => b.category && set.add(b.category));
    return Array.from(set);
  }, [blogs]);

  return (
    <div className="p-6">
      <div className="bg-white rounded shadow mb-6">
        <div className="px-6 py-4 border-b">
          <h4 className="text-xl font-bold mt-2 uppercase flex items-center gap-2">
            QUẢN LÝ BÀI VIẾT <i className="fas fa-newspaper" />
          </h4>
        </div>

        <div className="px-6 py-4 flex flex-col lg:flex-row gap-3 items-start lg:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tiêu đề, chuyên mục, thời lượng đọc..."
            className="w-full lg:w-1/2 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Tất cả chuyên mục</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={fetchBlogs}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
          >
            Làm mới
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full table-fixed border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 w-14">#</th>
                <th className="border px-4 py-2">Tiêu đề</th>
                <th className="border px-4 py-2 w-40">Chuyên mục</th>
                <th className="border px-4 py-2 w-32">Ngày</th>
                <th className="border px-4 py-2 w-28">Đọc</th>
                <th className="border px-4 py-2 w-44">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="border px-4 py-6 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border px-4 py-6 text-center text-gray-500">
                    Không có bài viết nào.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">
                      {getSerialNumber(blogs.findIndex((x) => x.id === b.id))}
                    </td>
                    <td className="border px-4 py-2">
                      <div className="font-medium line-clamp-2">{b.title}</div>
                    </td>
                    <td className="border px-4 py-2">{b.category || "-"}</td>
                    <td className="border px-4 py-2">{formatVNDate(b.date)}</td>
                    <td className="border px-4 py-2">{b.read_time || "-"}</td>
                    <td className="border px-4 py-2 space-x-2 whitespace-nowrap">
                      <Link
                        href={`/blogs/${b.id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Xem
                      </Link>
                      <Link
                        href={`/admin/blogs/${b.id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <div className="px-6 py-4 border-b">
          <h5 className="text-md font-semibold mt-2">Tùy chỉnh:</h5>
        </div>
        <div className="p-6 flex items-center gap-3">
          <Link
            href="/admin/blogs/them"
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
          >
            Thêm Bài viết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogsPage;
