'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '@/helpers/api/config';
import Image from 'next/image';
import {
  FaCalendarAlt,
  FaRegClock,
  FaChevronLeft
} from 'react-icons/fa';
import Footer from '@/components/footer/footer';

type BlogPost = {
  title: string;
  content: string;
  category: string;
  image_url?: string;
  date: string;
  read_time: string;
};

const formatVNDate = (value?: string | null) => {
  if (!value) return '-';
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d.toLocaleDateString('vi-VN');
  return value ?? '-';
};

export default function BlogDetail() {
  const router = useRouter();
  const params = useParams();
  const id = useMemo(() => {
    const raw = (params as Record<string, unknown>)?.id;
    return Array.isArray(raw) ? raw[0] : (raw as string | undefined);
  }, [params]);

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogPostById = async () => {
      try {
        if (!id) return;
        const response = await axiosInstance.get(`/blogs/${id}`);
        setBlog(response.data as BlogPost);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPostById();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-xl text-blue-800">Đang tải bài viết...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-xl text-blue-800">Bài viết không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Nút quay lại */}
      <div className="container mx-auto px-4 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-700 hover:text-blue-900 transition"
        >
          <FaChevronLeft className="mr-2" />
          Quay lại danh sách bài viết
        </button>
      </div>

      {/* Bài viết chi tiết */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Tiêu đề & metadata */}
          <div className="mb-8 text-center">
            {blog.category && (
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
                {blog.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-wrap justify-center items-center text-blue-600 gap-4 mb-6">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span>{formatVNDate(blog.date)}</span>
              </div>
              <div className="flex items-center">
                <FaRegClock className="mr-2" />
                <span>{blog.read_time}</span>
              </div>
            </div>
          </div>

          {/* Hình ảnh tối ưu (không bị mờ) */}
          {blog.image_url && (
            <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
              {/* Khung tỉ lệ để tránh kéo giãn chiều cao cố định */}
              <div className="relative w-full aspect-[16/9] bg-blue-200">
                <Image
                  src={blog.image_url}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  // sizes giúp Next chọn bản phù hợp theo viewport/DPR
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
                  // priority: true nếu đây là ảnh hero cần tải ngay trên fold
                  priority
                  // Có thể thêm blurDataURL nếu backend hỗ trợ
                  // placeholder="blur"
                  // blurDataURL="/placeholder.jpg"
                />
              </div>
            </div>
          )}

          {/* Nội dung (nhớ sanitize nếu là dữ liệu từ API) */}
          <div
            className="prose max-w-none text-blue-800"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>

      <Footer />
    </div>
  );
}
