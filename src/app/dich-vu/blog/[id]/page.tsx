'use client'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axiosInstance from '@/helpers/api/config'
import Link from 'next/link'
import {
  FaCalendarAlt,
  FaRegClock,
  FaChevronLeft
} from 'react-icons/fa'
import Footer from '@/components/footer/footer'

type BlogPost = {
  title: string
  content: string
  category: string
  image_url?: string
  date: string
  read_time: string
}

const formatVNDate = (value?: string | null) => {
  if (!value) return "-";
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d.toLocaleDateString("vi-VN");
  return value;
};

export default function BlogDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

useEffect(() => {
  const fetchBlogPostById = async () => {
    try {
      if (!id) return
      const response = await axiosInstance.get(`/blogs/${id}`)
      setBlogPosts([response.data])
    } catch (error) {
      console.error('Error fetching blog post:', error)
      setBlogPosts([])
    }
  }
  fetchBlogPostById()
}, [])

  if (!blogPosts.length) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-xl text-blue-800">Bài viết không tồn tại</p>
      </div>
    )
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
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
              {blogPosts[0].category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">{blogPosts[0].title}</h1>

            <div className="flex flex-wrap justify-center items-center text-blue-600 gap-4 mb-6">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span>{formatVNDate(blogPosts[0].date)}</span>
              </div>
              <div className="flex items-center">
                <FaRegClock className="mr-2" />
                <span>{blogPosts[0].read_time}</span>
              </div>
            </div>
          </div>

          {/* Hình ảnh */}
          {blogPosts[0].image_url && (
            <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
              <div className="h-64 md:h-96 bg-blue-200">
                <img
                  src={blogPosts[0].image_url}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Nội dung (nhớ sanitize nếu là dữ liệu từ API) */}
          <div
            className="prose max-w-none text-blue-800"
            dangerouslySetInnerHTML={{ __html: blogPosts[0].content }}
          />
        </div>
      </article>

      <Footer />
    </div>
  )
}
