export interface MBTIQuestion {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  text: string;
  options: {
    text: string;
    value: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  }[];
}

export const mbtiQuestions: MBTIQuestion[] = [
  // ==== EI ====
  {
    id: 1,
    dimension: 'EI',
    text: "Bạn thường cảm thấy thế nào sau một buổi tiệc đông người?",
    options: [
      { text: "Tràn đầy năng lượng, muốn đi tiếp", value: 3 },
      { text: "Hơi mệt nhưng vui", value: 1 },
      { text: "Kiệt sức, cần thời gian một mình", value: -3 }
    ]
  },
  {
    id: 2,
    dimension: 'EI',
    text: "Khi tham gia hoạt động nhóm, bạn thường...",
    options: [
      { text: "Chủ động dẫn dắt và nói nhiều", value: 3 },
      { text: "Tham gia vừa phải", value: 1 },
      { text: "Ít nói và chủ yếu lắng nghe", value: -3 }
    ]
  },
  {
    id: 3,
    dimension: 'EI',
    text: "Cuối tuần, bạn thích...",
    options: [
      { text: "Ra ngoài gặp gỡ nhiều người", value: 3 },
      { text: "Vừa ra ngoài vừa ở nhà", value: 1 },
      { text: "Ở nhà đọc sách, xem phim", value: -3 }
    ]
  },
  {
    id: 4,
    dimension: 'EI',
    text: "Khi gặp người lạ, bạn...",
    options: [
      { text: "Dễ bắt chuyện và tạo không khí", value: 3 },
      { text: "Cần một chút thời gian làm quen", value: 1 },
      { text: "Ngại mở lời trước", value: -3 }
    ]
  },
  {
    id: 5,
    dimension: 'EI',
    text: "Bạn cảm thấy vui hơn khi...",
    options: [
      { text: "Tham gia sự kiện sôi động", value: 3 },
      { text: "Có cả lúc náo nhiệt và lúc yên tĩnh", value: 1 },
      { text: "Dành thời gian yên bình một mình", value: -3 }
    ]
  },
  {
    id: 6,
    dimension: 'EI',
    text: "Khi học điều mới, bạn thích...",
    options: [
      { text: "Thảo luận với nhiều người", value: 3 },
      { text: "Kết hợp tự học và thảo luận", value: 1 },
      { text: "Tự tìm hiểu một mình", value: -3 }
    ]
  },
  {
    id: 7,
    dimension: 'EI',
    text: "Trong môi trường mới, bạn...",
    options: [
      { text: "Nhanh chóng hòa nhập và kết bạn", value: 3 },
      { text: "Quan sát rồi mới bắt chuyện", value: 1 },
      { text: "Chỉ trò chuyện khi ai đó bắt chuyện trước", value: -3 }
    ]
  },

  // ==== SN ====
  {
    id: 8,
    dimension: 'SN',
    text: "Khi học một kỹ năng mới, bạn thích...",
    options: [
      { text: "Học qua các bước thực tế cụ thể", value: -3 },
      { text: "Kết hợp ví dụ và lý thuyết", value: -1 },
      { text: "Tìm hiểu khái niệm và ý tưởng lớn", value: 3 }
    ]
  },
  {
    id: 9,
    dimension: 'SN',
    text: "Bạn thường chú ý nhiều hơn đến...",
    options: [
      { text: "Chi tiết cụ thể, thực tế", value: -3 },
      { text: "Cả chi tiết lẫn khả năng tiềm ẩn", value: -1 },
      { text: "Xu hướng và khả năng tương lai", value: 3 }
    ]
  },
  {
    id: 10,
    dimension: 'SN',
    text: "Khi kể lại một câu chuyện, bạn...",
    options: [
      { text: "Mô tả chi tiết bối cảnh, thời gian, địa điểm", value: -3 },
      { text: "Mô tả vừa đủ và nêu ý chính", value: -1 },
      { text: "Nói về ý nghĩa và cảm xúc chính", value: 3 }
    ]
  },
  {
    id: 11,
    dimension: 'SN',
    text: "Bạn tin tưởng hơn vào...",
    options: [
      { text: "Những gì đã được kiểm chứng", value: -3 },
      { text: "Cân nhắc cả thực tế và khả năng mới", value: -1 },
      { text: "Ý tưởng mới và dự đoán", value: 3 }
    ]
  },
  {
    id: 12,
    dimension: 'SN',
    text: "Khi đọc sách, bạn thích...",
    options: [
      { text: "Sách hướng dẫn, thông tin cụ thể", value: -3 },
      { text: "Cả sách thực tế và tiểu thuyết", value: -1 },
      { text: "Tiểu thuyết, triết lý, ý tưởng trừu tượng", value: 3 }
    ]
  },
  {
    id: 13,
    dimension: 'SN',
    text: "Bạn phản ứng thế nào khi nghe thông tin mới?",
    options: [
      { text: "Kiểm tra tính xác thực ngay", value: -3 },
      { text: "Cân nhắc rồi tìm hiểu thêm", value: -1 },
      { text: "Tưởng tượng các khả năng mở ra", value: 3 }
    ]
  },
  {
    id: 14,
    dimension: 'SN',
    text: "Bạn thường đánh giá cao...",
    options: [
      { text: "Kinh nghiệm thực tiễn", value: -3 },
      { text: "Cả kinh nghiệm và sáng tạo", value: -1 },
      { text: "Sáng tạo và tầm nhìn", value: 3 }
    ]
  },

  // ==== TF ====
  {
    id: 15,
    dimension: 'TF',
    text: "Khi phải ra quyết định khó khăn, bạn dựa vào...",
    options: [
      { text: "Logic và dữ liệu", value: -3 },
      { text: "Cân bằng giữa lý trí và cảm xúc", value: -1 },
      { text: "Cảm xúc và tác động đến người khác", value: 3 }
    ]
  },
  {
    id: 16,
    dimension: 'TF',
    text: "Khi góp ý cho người khác, bạn thường...",
    options: [
      { text: "Nói thẳng vấn đề để cải thiện", value: -3 },
      { text: "Vừa thẳng thắn vừa khéo léo", value: -1 },
      { text: "Dùng lời nhẹ nhàng để không làm họ buồn", value: 3 }
    ]
  },
  {
    id: 17,
    dimension: 'TF',
    text: "Bạn coi trọng điều gì hơn trong công việc?",
    options: [
      { text: "Hiệu quả và năng suất", value: -3 },
      { text: "Cả hiệu quả và sự hài lòng của mọi người", value: -1 },
      { text: "Mối quan hệ và sự hòa hợp", value: 3 }
    ]
  },
  {
    id: 18,
    dimension: 'TF',
    text: "Bạn dễ đồng cảm với người khác khi...",
    options: [
      { text: "Hiểu rõ nguyên nhân vấn đề", value: -3 },
      { text: "Vừa hiểu nguyên nhân vừa chia sẻ cảm xúc", value: -1 },
      { text: "Cảm nhận ngay cảm xúc của họ", value: 3 }
    ]
  },
  {
    id: 19,
    dimension: 'TF',
    text: "Trong tranh luận, bạn thường...",
    options: [
      { text: "Tập trung vào lập luận logic", value: -3 },
      { text: "Cố gắng cân bằng logic và sự hòa hợp", value: -1 },
      { text: "Ưu tiên giữ hòa khí", value: 3 }
    ]
  },
  {
    id: 20,
    dimension: 'TF',
    text: "Bạn tin rằng công lý nên dựa trên...",
    options: [
      { text: "Quy tắc và bằng chứng", value: -3 },
      { text: "Cân nhắc cả luật và hoàn cảnh", value: -1 },
      { text: "Hoàn cảnh và cảm xúc liên quan", value: 3 }
    ]
  },
  {
    id: 21,
    dimension: 'TF',
    text: "Bạn đánh giá thành công dựa trên...",
    options: [
      { text: "Thành tích và kết quả", value: -3 },
      { text: "Cả kết quả và sự hài lòng của mọi người", value: -1 },
      { text: "Niềm vui và cảm giác hạnh phúc", value: 3 }
    ]
  },

  // ==== JP ====
  {
    id: 22,
    dimension: 'JP',
    text: "Khi đi du lịch, bạn thường...",
    options: [
      { text: "Lên kế hoạch chi tiết từng ngày", value: -3 },
      { text: "Lên kế hoạch cơ bản nhưng linh hoạt", value: -1 },
      { text: "Đi tùy hứng, không theo kế hoạch cố định", value: 3 }
    ]
  },
  {
    id: 23,
    dimension: 'JP',
    text: "Khi làm việc, bạn thích...",
    options: [
      { text: "Hoàn thành từng việc theo thứ tự", value: -3 },
      { text: "Vừa có kế hoạch vừa linh hoạt đổi", value: -1 },
      { text: "Làm việc theo cảm hứng", value: 3 }
    ]
  },
  {
    id: 24,
    dimension: 'JP',
    text: "Bạn phản ứng thế nào khi kế hoạch thay đổi bất ngờ?",
    options: [
      { text: "Khó chịu, muốn quay lại kế hoạch cũ", value: -3 },
      { text: "Chấp nhận và điều chỉnh", value: -1 },
      { text: "Thích thú với sự thay đổi", value: 3 }
    ]
  },
  {
    id: 25,
    dimension: 'JP',
    text: "Bạn cảm thấy an tâm hơn khi...",
    options: [
      { text: "Có kế hoạch rõ ràng", value: -3 },
      { text: "Có định hướng nhưng không quá chặt", value: -1 },
      { text: "Tự do quyết định từng bước", value: 3 }
    ]
  },
  {
    id: 26,
    dimension: 'JP',
    text: "Khi làm việc nhóm, bạn muốn...",
    options: [
      { text: "Có timeline rõ ràng và tuân thủ", value: -3 },
      { text: "Có kế hoạch nhưng có thể điều chỉnh", value: -1 },
      { text: "Làm việc linh hoạt theo tình huống", value: 3 }
    ]
  },
  {
    id: 27,
    dimension: 'JP',
    text: "Bạn thường xử lý công việc...",
    options: [
      { text: "Theo thứ tự ưu tiên đã định", value: -3 },
      { text: "Kết hợp ưu tiên và cảm hứng", value: -1 },
      { text: "Theo cảm hứng và ý tưởng mới", value: 3 }
    ]
  },
  {
    id: 28,
    dimension: 'JP',
    text: "Khi hoàn thành công việc sớm, bạn sẽ...",
    options: [
      { text: "Kiểm tra và hoàn thiện chi tiết", value: -3 },
      { text: "Xem lại và chuẩn bị cho việc khác", value: -1 },
      { text: "Bắt tay ngay vào việc mới", value: 3 }
    ]
  }
];
