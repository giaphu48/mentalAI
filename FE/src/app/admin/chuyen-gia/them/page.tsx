"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/helpers/api/config";

export default function AddExpertPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    phone: "",
    name: "",
    password_hash: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear lỗi khi nhập lại
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = "Vui lòng nhập họ tên";

    if (!form.email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email không hợp lệ";

    if (!form.phone) newErrors.phone = "Vui lòng nhập số điện thoại";

    if (!form.password_hash)
      newErrors.password_hash = "Vui lòng nhập mật khẩu";
    else if (
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(form.password_hash)
    ) {
      newErrors.password_hash =
        "Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
    }

    return newErrors;
  };

  const register = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/experts/register", {
        email: form.email,
        phone: form.phone,
        name: form.name,
        password_hash: form.password_hash,
      });

      alert("Thêm tài khoản thành công!");
      setForm({ email: "", phone: "", name: "", password_hash: "" });
      router.push("/admin/chuyen-gia");

    } catch (error: any) {
      if (error.response?.data?.field && error.response?.data?.message) {
        setErrors((prev) => ({
          ...prev,
          [error.response.data.field]: error.response.data.message,
        }));
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await register();
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h4 className="mt-2 text-lg font-bold flex items-center gap-2">
          THÊM CHUYÊN GIA
          <i className="fas fa-user text-gray-600"></i>
        </h4>
      </div>

      {/* Body */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ và tên */}
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              name="password_hash"
              value={form.password_hash}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.password_hash && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_hash}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
            <a
              href="/admin/khach-hang"
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md"
            >
              Quay lại
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
