'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const mbtiDescriptions = {
  ISTJ: {
    title: "Người Trách Nhiệm",
    description: "Thực tế, nguyên tắc, và tận tâm. Bạn đáng tin cậy, có tổ chức và luôn hoàn thành nhiệm vụ đúng hạn."
  },
  ISFJ: {
    title: "Người Bảo Vệ",
    description: "Chu đáo, tận tâm và giàu lòng trắc ẩn. Bạn quan tâm sâu sắc đến người khác và sẵn sàng hy sinh vì tập thể."
  },
  INFJ: {
    title: "Người Truyền Cảm Hứng Yên Lặng",
    description: "Sâu sắc, hướng tới giá trị và lý tưởng. Bạn có khả năng thấu hiểu người khác và mong muốn tạo ra sự thay đổi tích cực."
  },
  INTJ: {
    title: "Nhà Chiến Lược",
    description: "Tầm nhìn dài hạn, logic và quyết đoán. Bạn giỏi lập kế hoạch và tìm ra giải pháp sáng tạo cho vấn đề phức tạp."
  },
  ISTP: {
    title: "Người Thợ Lành Nghề",
    description: "Linh hoạt, thực tế và thích khám phá. Bạn giỏi phân tích tình huống và ứng biến nhanh chóng."
  },
  ISFP: {
    title: "Người Nghệ Sĩ",
    description: "Nhạy cảm, sáng tạo và yêu cái đẹp. Bạn trân trọng khoảnh khắc hiện tại và tự do trong biểu đạt bản thân."
  },
  INFP: {
    title: "Người Lý Tưởng Hóa",
    description: "Mơ mộng, sáng tạo và đầy lòng trắc ẩn. Bạn sống theo giá trị cá nhân và luôn mong muốn giúp đỡ người khác."
  },
  INTP: {
    title: "Nhà Tư Duy",
    description: "Phân tích, tò mò và độc lập. Bạn yêu thích ý tưởng mới và luôn tìm kiếm sự hiểu biết sâu sắc."
  },
  ESTP: {
    title: "Người Hành Động",
    description: "Năng động, táo bạo và thích thử thách. Bạn giỏi ứng biến và tận dụng cơ hội ngay khi xuất hiện."
  },
  ESFP: {
    title: "Người Trình Diễn",
    description: "Hòa đồng, vui vẻ và lạc quan. Bạn yêu thích trải nghiệm mới và truyền năng lượng tích cực cho mọi người."
  },
  ENFP: {
    title: "Người Truyền Cảm Hứng",
    description: "Nhiệt huyết, sáng tạo và đầy ý tưởng. Bạn khuyến khích người khác khám phá tiềm năng của họ."
  },
  ENTP: {
    title: "Người Khởi Xướng",
    description: "Sáng tạo, hoạt ngôn và thích thử thách tư duy. Bạn giỏi nhìn vấn đề ở nhiều góc độ và tìm cách đổi mới."
  },
  ESTJ: {
    title: "Người Quản Lý",
    description: "Thực tế, quyết đoán và có tổ chức. Bạn giỏi lãnh đạo, quản lý công việc và duy trì trật tự."
  },
  ESFJ: {
    title: "Người Quan Tâm",
    description: "Thân thiện, chu đáo và tận tụy. Bạn ưu tiên sự hòa hợp và luôn hỗ trợ mọi người xung quanh."
  },
  ENFJ: {
    title: "Người Lãnh Đạo Truyền Cảm Hứng",
    description: "Nhiệt tình, giàu lòng trắc ẩn và định hướng con người. Bạn giỏi truyền động lực và kết nối cộng đồng."
  },
  ENTJ: {
    title: "Nhà Điều Hành",
    description: "Quyết đoán, chiến lược và định hướng kết quả. Bạn giỏi tổ chức và dẫn dắt để đạt mục tiêu lớn."
  }
};


export default function MBTIResultsPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as keyof typeof mbtiDescriptions || 'ISTJ';
  const result = mbtiDescriptions[type];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h1 className="text-3xl font-bold">Kết Quả Trắc Nghiệm MBTI</h1>
          <div className="text-5xl font-bold mt-4">{type}</div>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{result.title}</h2>
          <p className="text-gray-700 mb-6">{result.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">Điểm mạnh</h3>
              <ul className="list-disc pl-5 text-blue-700">
                <li>Chi tiết và thực tế</li>
                <li>Kiên định và đáng tin cậy</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-800 mb-2">Nghề nghiệp phù hợp</h3>
              <ul className="list-disc pl-5 text-purple-700">
                <li>Quản lý dự án</li>
                <li>Kế toán</li>
              </ul>
            </div>
          </div>
          
          <Link 
            href="/dich-vu/trac-nghiem-mbti/quiz"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 px-6 rounded-lg transition"
          >
            Làm lại bài test
          </Link>
        </div>
      </div>
    </div>
  );
}