"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/helpers/api/config";

const AddBlogPage = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "",
        read_time: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        if (!f) {
            setImageFile(null);
            setImagePreview(null);
            return;
        }
        if (!f.type.startsWith("image/")) {
            setError("Vui lòng chọn đúng định dạng ảnh.");
            return;
        }
        if (f.size > 5 * 1024 * 1024) {
            setError("Ảnh quá lớn (tối đa 5MB).");
            return;
        }
        setError(null);
        setImageFile(f);
        setImagePreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title.trim()) return setError("Vui lòng nhập tiêu đề");
        if (!form.content.trim()) return setError("Vui lòng nhập nội dung");
        if (!imageFile) return setError("Vui lòng chọn ảnh");

        try {
            setError(null);

            const fd = new FormData();
            fd.append("title", form.title);
            fd.append("content", form.content);
            if (form.category) fd.append("category", form.category);
            if (form.read_time) fd.append("read_time", String(form.read_time));
            fd.append("image", imageFile);

            await axiosInstance.post("/blogs", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Thêm bài viết thành công!");
            router.push("/admin/blogs");
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.error || "Thêm bài viết thất bại");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Thêm Bài Viết</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block font-medium mb-1">Tiêu đề <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Chuyên mục</label>
                    <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Ví dụ: Kỹ năng sống"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block font-medium mb-1">Thời lượng đọc</label>
                        <input
                            type="text"
                            name="read_time"
                            value={form.read_time}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Ví dụ: 5 phút"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-1">Hình ảnh</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm"
                    />
                    {imagePreview && (
                        <div className="mt-3">
                            <div className="text-xs text-gray-500 mb-1">Xem trước:</div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imagePreview}
                                alt="preview"
                                className="h-32 w-auto rounded border object-cover"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block font-medium mb-1">Nội dung <span className="text-red-500">*</span></label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        rows={10}
                        className="w-full border rounded px-3 py-2"
                        placeholder={"<p>Nội dung HTML hoặc Markdown...</p>"}
                        required
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                    >
                        Thêm bài viết
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Quay lại
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBlogPage;
