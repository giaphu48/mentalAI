'use client'
import Head from 'next/head'
import { FaHeart, FaUsers, FaShieldAlt, FaLightbulb } from 'react-icons/fa'
import Image from 'next/image';
import aboutImage from '../../../public/image/photo-1573497620053-ea5300f94f21.avif';
import Footer from '@/components/footer/footer';

export default function AboutPage() {
  const features = [
    {
      icon: <FaHeart className="text-4xl text-blue-700" />,
      title: "Sứ mệnh",
      description: "Mang lại giải pháp chăm sóc sức khỏe tinh thần dễ tiếp cận cho mọi người"
    },
    {
      icon: <FaUsers className="text-4xl text-blue-700" />,
      title: "Đội ngũ",
      description: "20+ chuyên gia tâm lý giàu kinh nghiệm và kỹ sư AI hàng đầu"
    },
    {
      icon: <FaShieldAlt className="text-4xl text-blue-700" />,
      title: "Cam kết",
      description: "Bảo mật thông tin tuyệt đối và hiệu quả lâu dài"
    },
    {
      icon: <FaLightbulb className="text-4xl text-blue-700" />,
      title: "Công nghệ",
      description: "Ứng dụng AI tiên tiến trong phân tích và hỗ trợ tâm lý"
    }
  ]

  return (
    <div className="min-h-screen bg-blue-50">
      <Head>
        <title>Giới thiệu - </title>
      </Head>

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Về Chúng Tôi</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Hành trình mang đến sự bình an trong tâm trí và trái tim
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image
                src={aboutImage}
                alt="Our story"
                className="rounded-lg shadow-xl w-full"
                placeholder="blur"
                priority
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Câu Chuyện Của Chúng Tôi</h2>
              <p className="text-lg text-blue-800 mb-4">
                MentalAI được thành lập năm 2020 với sứ mệnh phá vỡ rào cản trong tiếp cận dịch vụ sức khỏe tâm thần tại Việt Nam.
              </p>
              <p className="text-lg text-blue-800 mb-4">
                Xuất phát từ trải nghiệm cá nhân của người sáng lập khi chứng kiến những khó khăn tâm lý trong cộng đồng, chúng tôi quyết tâm xây dựng một nền tảng kết hợp giữa công nghệ và chuyên môn tâm lý.
              </p>
              <p className="text-lg text-blue-800">
                Đến nay, chúng tôi đã đồng hành cùng hơn 50.000 khách hàng với tỷ lệ hài lòng 95%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-blue-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Tại Sao Chọn Chúng Tôi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">{feature.title}</h3>
                <p className="text-blue-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng bắt đầu hành trình chữa lành?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Hãy để chúng tôi đồng hành cùng bạn vượt qua những khó khăn tâm lý
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}