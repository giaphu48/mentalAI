'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import axiosInstance from '@/helpers/api/config'
import { 
  FaCalendarAlt, 
  FaRegNewspaper, 
  FaRegEnvelope,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaRegComment,
  FaBookmark
} from 'react-icons/fa'
import Footer from '@/components/footer/footer'

const formatVNDate = (value?: string | null) => {
  if (!value) return "-";
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d.toLocaleDateString("vi-VN");
  return value;
};

const HealingBlog = () => {
  // Danh sách bài viết đầy đủ
  type Post = {
    id: string
    title: string
    content: string
    category: string
    imageUrl?: string
    date: string
    readTime: string
    comments?: number
    saved?: number
  }

  const [allPosts, setAllPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get('/blogs/')
        setAllPosts(res.data)
      } catch (error) {
        setAllPosts([])
      }
    }
    fetchPosts()
  }, [])

  // State cho phân trang và tìm kiếm
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const postsPerPage = 3

  // Lọc bài viết theo danh mục và tìm kiếm
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Tính toán phân trang
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  // Danh mục bài viết
  const categories = ['Tất cả', ...new Set(allPosts.map(post => post.category))]

  return (
    <div className="min-h-screen bg-blue-50">
      <Head>
        <title>Blog Chữa Lành - Tâm Lý An Nhiên</title>
      </Head>

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <FaRegNewspaper className="text-4xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog Chữa Lành</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Kiến thức tâm lý và những câu chuyện truyền cảm hứng cho hành trình phát triển bản thân
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Thanh tìm kiếm và lọc */}
          <div className="mb-12 bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <FaSearch className="absolute left-3 top-3 text-blue-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              
              <select
                className="border border-blue-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setCurrentPage(1)
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Danh sách bài viết */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition hover:-translate-y-1"
                >
                  {post.imageUrl ? (
                    <div className="h-48 bg-blue-200 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900 opacity-30"></div>
                      <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                        [Hình ảnh: {post.title}]
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-blue-100 flex items-center justify-center text-blue-800">
                      <FaRegNewspaper className="text-4xl" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <div className="flex items-center text-blue-600 text-sm">
                        <FaCalendarAlt className="mr-1" />
                        <span>{formatVNDate(post.date)}</span>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-blue-800 mb-3">{post.title}</h2>
                    
                    <div 
                      className="text-blue-700 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }}
                    />
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-600">{post.readTime}</span>
                    </div>
                    
                    <a
                      href={`/dich-vu/blog/${post.id}`}
                      className="mt-4 w-full block bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg transition text-center"
                    >
                      Đọc toàn bộ
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-blue-800">Không tìm thấy bài viết phù hợp</p>
              </div>
            )}
          </div>

          {/* Phân trang */}
          {filteredPosts.length > postsPerPage && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400' : 'text-blue-700 hover:bg-blue-100'}`}
              >
                <FaChevronLeft />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Hiển thị tối đa 5 trang, ưu tiên trang hiện tại ở giữa
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-full ${currentPage === pageNum ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-100'}`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2">...</span>
              )}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-10 h-10 rounded-full ${currentPage === totalPages ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-100'}`}
                >
                  {totalPages}
                </button>
              )}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-700 hover:bg-blue-100'}`}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default HealingBlog