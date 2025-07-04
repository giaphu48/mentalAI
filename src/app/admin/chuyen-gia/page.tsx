'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axiosInstance from '@/helpers/api/config';

type Expert = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  certification: string;
  role: string;
};

const getSerialNumber = (index: number) => index + 1;

const ExpertManagementPage = () => {

  const [experts, setExpert] = useState<Expert[]>([]);

  useEffect(() => {
    const fetchExperts = async() => {
        try{
          const res = await axiosInstance.get(`/experts/`);
          setExpert(res.data);
        }
        catch(err){
          console.error(err);
        }
    }
    fetchExperts();
  },[]);

  return (
    <div className="p-6">
      {/* Card */}
      <div className="bg-white rounded shadow mb-6">
        <div className="px-6 py-4 border-b">
          <h4 className="text-xl font-bold mt-2 uppercase flex items-center gap-2">
            QUẢN LÝ TÀI KHOẢN <i className="fas fa-user" />
          </h4>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full table-fixed border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Tên chuyên gia</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">SĐT</th>
                <th className="border px-4 py-2">Bằng cấp</th>
                <th className="border px-4 py-2">Phân quyền</th>
                <th className="border px-4 py-2">Thay đổi</th>
              </tr>
            </thead>
            <tbody>
              {experts.map((expert) => (
                <tr key={expert.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{getSerialNumber(experts.findIndex(u => u.id === expert.id))}</td>
                  <td className="border px-4 py-2">{expert.full_name}</td>
                  <td className="border px-4 py-2">{expert.email}</td>
                  <td className="border px-4 py-2">{expert.phone}</td>
                  <td className="border px-4 py-2">{expert.certification}</td>
                  <td className="border px-4 py-2">{expert.role}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <Link
                      href={`/admin/taikhoan/sua/id=${expert.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Sửa
                    </Link>
                    <Link
                      href={`/admin/taikhoan/xoa/id=${expert.id}`}
                      onClick={(e) => {
                        if (!confirm('Bạn có thật sự muốn xóa ?')) e.preventDefault();
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Xóa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card Thêm */}
      <div className="bg-white rounded shadow">
        <div className="px-6 py-4 border-b">
          <h5 className="text-md font-semibold mt-2">Tùy chỉnh:</h5>
        </div>
        <div className="p-6">
          <Link
            href="/admin/taikhoan/them"
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
          >
            Thêm Tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpertManagementPage;
