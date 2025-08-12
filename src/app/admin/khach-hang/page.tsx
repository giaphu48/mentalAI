'use client';

import Link from 'next/link';
import { useEffect, useState} from 'react';
import axiosInstance from '@/helpers/api/config';

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};



const ClientManagementPage = () => {

    const [users, setUsers] = useState<User[]>([]);
    const getSerialNumber = (index: number) => index + 1;

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                await axiosInstance.delete(`/clients/${id}`);
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
    const fetchUser = async () => {
        try{
            const res = await axiosInstance.get(`/clients/`);
            setUsers(res.data);
        }
        catch(err){
            console.error(err);
        }
    }
    fetchUser();
  }, []);

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
                <th className="border px-4 py-2">STT</th>
                <th className="border px-4 py-2">Tên người dùng</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">SĐT</th>
                <th className="border px-4 py-2">Phân quyền</th>
                <th className="border px-4 py-2">Thay đổi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{getSerialNumber(users.findIndex(u => u.id === user.id))}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.phone}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <Link
                      href={`/admin/khach-hang/${user.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Xóa
                    </button>
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
            href="/admin/khach-hang/them"
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
          >
            Thêm Tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientManagementPage;
