"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/helpers/api/config";

type Errors = { [key: string]: string };

export default function AddBlogPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    read_time: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  // Danh sách chuyên mục
  const categories = [
    { value: "", label: "Chọn chuyên mục" },
    { value: "Kỹ năng sống", label: "Kỹ năng sống" },
    { value: "Sức khỏe tinh thần", label: "Sức khỏe tinh thần" },
    { value: "Phát triển cá nhân", label: "Phát triển cá nhân" },
    { value: "Quan hệ xã hội & giao tiếp", label: "Quan hệ xã hội & giao tiếp" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setErrors((prev) => ({ ...prev, image: "" }));

    if (!f) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (!f.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Vui lòng chọn đúng định dạng ảnh." }));
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Ảnh quá lớn (tối đa 5MB)." }));
      return;
    }

    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const validate = (): Errors => {
    const newErrors: Errors = {};

    if (!form.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề";
    if (!form.content.trim()) newErrors.content = "Vui lòng nhập nội dung";
    if (!imageFile) newErrors.image = "Vui lòng chọn ảnh";
    if (!form.category) newErrors.category = "Vui lòng chọn chuyên mục";

    if (form.read_time && form.read_time.length > 30) {
      newErrors.read_time = "Thời lượng đọc quá dài (tối đa 30 ký tự).";
    }

    return newErrors;
  };

  const createBlog = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("content", form.content.trim());
      fd.append("category", form.category);
      if (form.read_time) fd.append("read_time", String(form.read_time).trim());
      if (imageFile) fd.append("image", imageFile);

      await axiosInstance.post("/blogs", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Thêm bài viết thành công!");
      setForm({ title: "", content: "", category: "", read_time: "" });
      setImageFile(null);
      setImagePreview(null);
      router.push("/admin/blogs");
    } catch (error: any) {
      if (error?.response?.data?.field && error?.response?.data?.message) {
        setErrors((prev) => ({
          ...prev,
          [error.response.data.field]: error.response.data.message,
        }));
      } else if (error?.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Thêm bài viết thất bại. Vui lòng thử lại.");
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
    await createBlog();
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h4 className="mt-2 text-lg font-bold flex items-center gap-2">
          THÊM BÀI VIẾT
          <i className="fas fa-feather-alt text-gray-600"></i>
        </h4>
      </div>

      {/* Body */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tiêu đề */}
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Nhập tiêu đề bài viết"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Chuyên mục */}
          <div>
            <label className="block text-sm font-medium mb-1">Chuyên mục <span className="text-red-500">*</span></label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Thời lượng đọc */}
          <div>
            <label className="block text-sm font-medium mb-1">Thời lượng đọc</label>
            <input
              type="text"
              name="read_time"
              value={form.read_time}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Ví dụ: 5 phút"
            />
            {errors.read_time && <p className="text-red-500 text-sm mt-1">{errors.read_time}</p>}
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium mb-1">Hình ảnh <span className="text-red-500">*</span></label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm" />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            {imagePreview && (
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-1">Xem trước:</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="preview" className="h-32 w-auto rounded border object-cover" />
              </div>
            )}
          </div>

          {/* Nội dung */}
          <div>
            <label className="block text-sm font-medium mb-1">Nội dung <span className="text-red-500">*</span></label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={10}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="<p>Nội dung HTML hoặc Markdown...</p>"
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
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
            <a href="/admin/blogs" className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md">
              Quay lại
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
