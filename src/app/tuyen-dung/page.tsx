'use client'
import Head from 'next/head';
import { FaBriefcase, FaUserTie, FaGraduationCap, FaHandshake, FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';
import careerImage from '../../../public/image/photo-1522071820081-009f0129c71c.avif';
import Footer from '@/components/footer/footer';

export default function CareersPage() {
  const jobOpenings = [
    {
      id: 1,
      title: "Chuyên gia tâm lý lâm sàng",
      type: "Full-time",
      location: "Cần Thơ",
      description: "Tư vấn và trị liệu cho khách hàng, tham gia xây dựng chương trình can thiệp",
      requirements: [
        "Bằng Thạc sĩ Tâm lý học lâm sàng trở lên",
        "Có chứng chỉ hành nghề",
        "Kinh nghiệm 3+ năm"
      ]
    },
    {
      id: 2,
      title: "Kỹ sư AI/NLP",
      type: "Full-time",
      location: "Làm việc từ xa",
      description: "Phát triển hệ thống AI hỗ trợ tư vấn tâm lý và phân tích ngôn ngữ tự nhiên",
      requirements: [
        "Có kinh nghiệm với Python và ML frameworks",
        "Hiểu biết về xử lý ngôn ngữ tự nhiên",
        "Đã từng làm sản phẩm AI ứng dụng là điểm cộng"
      ]
    },
    {
      id: 3,
      title: "Thực tập sinh Content",
      type: "Internship",
      location: "Cần Thơ",
      description: "Viết bài chia sẻ kiến thức tâm lý, nội dung cho blog chữa lành",
      requirements: [
        "Sinh viên ngành Tâm lý học/Báo chí",
        "Kỹ năng viết tốt",
        "Đam mê lĩnh vực sức khỏe tinh thần"
      ]
    }
  ]

  const perks = [
    {
      icon: <FaBriefcase className="text-3xl text-blue-600" />,
      title: "Môi trường linh hoạt",
      description: "Làm việc hybrid hoặc remote tùy vị trí"
    },
    {
      icon: <FaUserTie className="text-3xl text-blue-600" />,
      title: "Phát triển chuyên môn",
      description: "Hỗ trợ chi phí đào tạo và hội thảo"
    },
    {
      icon: <FaGraduationCap className="text-3xl text-blue-600" />,
      title: "Mentorship",
      description: "Được dẫn dắt bởi chuyên gia đầu ngành"
    },
    {
      icon: <FaHandshake className="text-3xl text-blue-600" />,
      title: "Tác động xã hội",
      description: "Góp phần cải thiện sức khỏe cộng đồng"
    }
  ]

  return (
    <div className="min-h-screen bg-blue-50">
      <Head>
        <title>Tuyển dụng - MentalAI</title>
      </Head>

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Cơ hội nghề nghiệp</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Cùng chúng tôi lan tỏa giá trị chăm sóc sức khỏe tinh thần đến cộng đồng
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Tại Sao Gia Nhập Chúng Tôi?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((perk, index) => (
              <div key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">{perk.icon}</div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">{perk.title}</h3>
                <p className="text-blue-600">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-16 bg-blue-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Vị Trí Đang Tuyển</h2>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h3 className="text-xl font-bold text-blue-800">{job.title}</h3>
                  <div className="flex space-x-4 mt-2 md:mt-0">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{job.type}</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{job.location}</span>
                  </div>
                </div>
                <p className="text-blue-700 mb-4">{job.description}</p>
                
                <h4 className="font-bold text-blue-900 mb-2">Yêu cầu:</h4>
                <ul className="list-disc list-inside text-blue-700 space-y-1 mb-6">
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>

                {/* Phần thay thế nút ứng tuyển bằng thông tin email */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <FaEnvelope className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-800 mb-1">Ứng tuyển vị trí này</h4>
                      <p className="text-blue-700 mb-2">
                        Gửi CV và thư giới thiệu đến: <span className="font-bold">hr@mentaiai.vn</span>
                      </p>
                      <p className="text-sm text-blue-600">
                        Tiêu đề email: <span className="font-mono bg-blue-100 px-2 py-1 rounded">[Ứng tuyển] {job.title} - Họ tên</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Phần ứng tuyển mở */}
          <div className="text-center mt-12">
            <div className="bg-white p-6 rounded-xl shadow-md inline-block max-w-2xl">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Ứng tuyển mở</h3>
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-4">
                  <FaEnvelope className="text-blue-600 mr-3 text-2xl" />
                  <span className="text-lg font-medium text-blue-700">hr@mentaiai.vn</span>
                </div>
                <p className="text-blue-700 mb-4">
                  Nếu không tìm thấy vị trí phù hợp nhưng muốn làm việc cùng chúng tôi, hãy gửi CV và mô tả nguyện vọng của bạn.
                </p>
                <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                  Tiêu đề email: <span className="font-mono bg-blue-100 px-2 py-1 rounded">[Ứng tuyển mở] Vị trí quan tâm - Họ tên</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Culture */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image
                src={careerImage}
                alt="Team culture"
                className="rounded-lg shadow-xl w-full"
                width={500}
                height={333}
                layout="responsive"
                objectFit="cover"
                priority
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Văn Hóa Của Chúng Tôi</h2>
              <p className="text-lg text-blue-800 mb-4">
                Tại MentalAI, chúng tôi xây dựng môi trường làm việc:
              </p>
              <ul className="list-disc list-inside text-blue-700 space-y-2 mb-6">
                <li>Tôn trọng sự đa dạng và khác biệt</li>
                <li>Khuyến khích đổi mới sáng tạo</li>
                <li>Cân bằng giữa công việc và cuộc sống</li>
                <li>Lấy con người làm trung tâm</li>
              </ul>
              <p className="text-lg text-blue-800">
                "Chúng tôi tin rằng chỉ khi nhân viên được chăm sóc tốt, họ mới có thể chăm sóc tốt cho cộng đồng."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Quy Trình Tuyển Dụng</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Nộp hồ sơ", desc: "Ứng viên gửi CV qua email hoặc form online" },
              { step: "2", title: "Phỏng vấn", desc: "2 vòng phỏng vấn với HR và quản lý trực tiếp" },
              { step: "3", title: "Đánh giá", desc: "Bài test chuyên môn (nếu có yêu cầu)" },
              { step: "4", title: "Offer", desc: "Thư mời làm việc và thương lượng hợp đồng" }
            ].map((item) => (
              <div key={item.step} className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">{item.title}</h3>
                <p className="text-blue-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}