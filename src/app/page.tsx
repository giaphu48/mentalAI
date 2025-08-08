// pages/index.js
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>

      {/* Hero Section */}
      <div className="bg-green-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
                Chăm sóc sức khỏe tinh thần của bạn
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Kết nối với các chuyên gia tâm lý hàng đầu để được tư vấn và hỗ trợ 
                trong mọi vấn đề cuộc sống.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/booking" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300">
                  Đặt lịch tư vấn ngay
                </Link>
                <Link href="/services" className="border-2 border-green-500 text-green-500 hover:bg-green-50 font-bold py-3 px-6 rounded-lg text-center transition duration-300">
                  Tìm hiểu dịch vụ
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/images/hero-image.png" 
                alt="Tư vấn tâm lý" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Dịch vụ của chúng tôi</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Các dịch vụ tư vấn chuyên nghiệp được thiết kế để hỗ trợ bạn trong mọi khía cạnh cuộc sống
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="text-green-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Tư vấn cá nhân</h3>
              <p className="text-gray-600">
                Giải quyết các vấn đề cá nhân, căng thẳng, lo âu, trầm cảm và các rối loạn tâm lý khác.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="text-green-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Tư vấn gia đình</h3>
              <p className="text-gray-600">
                Hỗ trợ giải quyết mâu thuẫn gia đình, vấn đề hôn nhân và nuôi dạy con cái.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="text-green-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Tư vấn nghề nghiệp</h3>
              <p className="text-gray-600">
                Định hướng nghề nghiệp, giải quyết căng thẳng công việc và cân bằng cuộc sống.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <img 
                src="/images/about-image.jpg" 
                alt="Về chúng tôi" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Về chúng tôi</h2>
              <p className="text-gray-600 mb-4">
                Tâm An là trung tâm tư vấn tâm lý uy tín với đội ngũ chuyên gia giàu kinh nghiệm, 
                được đào tạo bài bản và có chứng chỉ hành nghề.
              </p>
              <p className="text-gray-600 mb-6">
                Chúng tôi cam kết mang lại dịch vụ chất lượng cao với phương châm "Lắng nghe - Thấu hiểu - Đồng hành".
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Đội ngũ chuyên gia trình độ cao</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Bảo mật thông tin tuyệt đối</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Phương pháp khoa học, hiệu quả</p>
                </div>
              </div>
              <Link href="/about" className="inline-block mt-8 text-green-500 font-semibold hover:text-green-600 transition duration-300">
                Tìm hiểu thêm →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Khách hàng nói về chúng tôi</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những phản hồi từ khách hàng đã sử dụng dịch vụ của Tâm An
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                  <img src="/images/client1.jpg" alt="Khách hàng" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Nguyễn Thị Mai</h4>
                  <p className="text-gray-500 text-sm">Nhân viên văn phòng</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Sau 3 tháng tư vấn, tôi đã vượt qua được giai đoạn trầm cảm nặng. Cảm ơn chuyên gia đã đồng hành cùng tôi."
              </p>
              <div className="flex mt-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                  <img src="/images/client2.jpg" alt="Khách hàng" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Trần Văn Nam</h4>
                  <p className="text-gray-500 text-sm">Doanh nhân</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Tư vấn nghề nghiệp giúp tôi tìm lại đam mê và định hướng phát triển bản thân rõ ràng hơn."
              </p>
              <div className="flex mt-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                  <img src="/images/client3.jpg" alt="Khách hàng" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Lê Thị Hương</h4>
                  <p className="text-gray-500 text-sm">Giáo viên</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Tư vấn gia đình đã giúp vợ chồng tôi hiểu nhau hơn và giải quyết được nhiều mâu thuẫn."
              </p>
              <div className="flex mt-4 text-yellow-400">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng bắt đầu hành trình chữa lành?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng bạn
          </p>
          <Link href="/booking" className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300">
            Đặt lịch tư vấn ngay
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Tâm An</h3>
              <p className="text-gray-400">
                Trung tâm tư vấn tâm lý uy tín, chất lượng hàng đầu Việt Nam
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liên kết</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">Trang chủ</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-white transition duration-300">Dịch vụ</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition duration-300">Về chúng tôi</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition duration-300">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition duration-300">Liên hệ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Dịch vụ</h4>
              <ul className="space-y-2">
                <li><Link href="/services/personal" className="text-gray-400 hover:text-white transition duration-300">Tư vấn cá nhân</Link></li>
                <li><Link href="/services/family" className="text-gray-400 hover:text-white transition duration-300">Tư vấn gia đình</Link></li>
                <li><Link href="/services/career" className="text-gray-400 hover:text-white transition duration-300">Tư vấn nghề nghiệp</Link></li>
                <li><Link href="/services/online" className="text-gray-400 hover:text-white transition duration-300">Tư vấn trực tuyến</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liên hệ</h4>
              <address className="text-gray-400 not-italic">
                <p className="mb-2">Số 123, Đường ABC, Quận XYZ, TP.HCM</p>
                <p className="mb-2">Email: info@taman.com</p>
                <p className="mb-2">Điện thoại: (028) 1234 5678</p>
                <p>Hotline: 0909 123 456</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Tâm An. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </>
  )
}