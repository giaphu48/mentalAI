'use client';
import Head from 'next/head';
import { useState } from 'react';
import Image from 'next/image';
import teamImage from '../../public/image/photo-1573497019940-1c28c88b4f3e.avif';
import Footer from '@/components/footer/footer'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home')

  const services = [
    {
      id: 1,
      title: 'Tư vấn tâm lý cùng AI',
      icon: '🤖',
      description: 'Trò chuyện 24/7 với AI thấu hiểu, bảo mật tuyệt đối',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      title: 'Tư vấn cùng chuyên gia',
      icon: '🧑⚕️',
      description: 'Được hỗ trợ bởi bác sĩ tâm lý có chứng chỉ',
      bgColor: 'bg-blue-100'
    },
    {
      id: 3,
      title: 'Trắc nghiệm MBTI',
      icon: '📊',
      description: 'Khám phá tính cách qua bài kiểm tra chuẩn quốc tế',
      bgColor: 'bg-blue-50'
    },
    {
      id: 4,
      title: 'Blog chữa lành',
      icon: '✍️',
      description: 'Kiến thức tâm lý và câu chuyện truyền cảm hứng',
      bgColor: 'bg-blue-100'
    }
  ]

  return (
    <div className="min-h-screen bg-blue-50">
      <Head>
        <title>MentalAI - Chăm sóc sức khỏe tinh thần</title>
        <meta name="description" content="Dịch vụ tư vấn tâm lý cùng AI và chuyên gia" />
      </Head>

      {/* Hero Banner */}
      <section className="bg-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Chăm sóc sức khỏe tinh thần</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Công nghệ AI và chuyên gia tâm lý đồng hành cùng bạn vượt qua căng thẳng, khám phá bản thân
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-green-400 hover:bg-green-500 text-blue-900 font-bold py-3 px-6 rounded-full text-lg transition">
              Trò chuyện cùng AI
            </button>
            <button className="bg-blue-900 hover:bg-blue-800 border-2 border-white text-white font-bold py-3 px-6 rounded-full text-lg transition">
              Trò chuyện cùng chuyên gia
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Dịch Vụ Của Chúng Tôi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className={`${service.bgColor} p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer hover:-translate-y-1`}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">{service.title}</h3>
                <p className="text-blue-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-blue-100">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
            <Image
              src={teamImage}
              alt="Team chuyên gia"
              className="rounded-lg shadow-xl w-full max-w-md mx-auto"
              width={500}
              height={333}
              priority
            />
            </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Về Chúng Tôi</h2>
            <p className="text-lg text-blue-800 mb-6">
              Chúng tôi mang lại giải pháp tâm lý toàn diện kết hợp công nghệ và con người. Cam kết bảo mật và đồng hành dài lâu.
            </p>
            <button className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full border-2 border-blue-800 transition">
              Xem thêm
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}