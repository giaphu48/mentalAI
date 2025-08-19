"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/helpers/api/config";
import { useParams } from "next/navigation";

export default function EditExpertPage() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    name: "",
    password_hash: "",
  });
  const [birthday, setBirthday] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [certification, setCertification] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const params = useParams();
  const userId = params?.id as string;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = "Vui lòng nhập họ tên";

    if (!form.email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email không hợp lệ";

    if (!form.phone) newErrors.phone = "Vui lòng nhập số điện thoại";

    if (form.password_hash) {
      if (
        !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(form.password_hash)
      ) {
        newErrors.password_hash =
          "Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
      }
    }

    return newErrors;
  };

  const fetchUserInfo = async () => {
    if (!userId) return;
    try {
      const res = await axiosInstance.get(`/experts/getbyid/${userId}`);
      setForm({
        email: res.data.email || "",
        phone: res.data.phone || "",
        name: res.data.name || "",
        password_hash: "", // luôn để trống để tránh double hash
      });
      setGender(res.data.gender || "");
      setBirthday(res.data.dob ? res.data.dob.split("T")[0] : "");
      setCertification(res.data.certification || "");
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  if (!userId) {
    alert("Không tìm thấy người dùng");
    return;
  }

  try {
    await axiosInstance.put(`/experts/${userId}`, { 
      name: form.name,
        email: form.email,
        phone: form.phone,
        gender,
        dob: birthday,
        certification,
     });

    if (form.password_hash.trim() !== "") {
      axiosInstance.put(`/users/change-password-admin/${userId}`, {
        newPassword: form.password_hash,
      });
    }
    alert("✅ Thay đổi thông tin thành công!");
    // fetchUserInfo();
  } catch (error) {
    console.error("API error:", error);
    alert("❌ Có lỗi xảy ra khi cập nhật thông tin!");
  }
};

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h4 className="mt-2 text-lg font-bold flex items-center gap-2">
          THAY ĐỔI THÔNG TIN
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

          {/* Ngày sinh */}
          <div>
            <label className="block mb-1 font-medium">Sinh nhật</label>
            <input
              type="date"
              name="dob"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium mb-1">Giới tính</label>
            <select
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div>
          <label className="block mb-1 font-medium">Bằng cấp</label>
          <select
            name="certification"
            value={certification}
            onChange={e => setCertification(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Chọn bằng cấp</option>
            <option value="Cử nhân">Cử nhân</option>
            <option value="Thạc sĩ">Thạc sĩ</option>
            <option value="Tiến sĩ">Tiến sĩ</option>
          </select>
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
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md`}
            >
              Xác nhận
            </button>
            <a
              href="/admin/chuyen-gia"
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
