export interface Option {
  text: string;
  value: number;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "Bạn cảm thấy thế nào khi ở trong một bữa tiệc đông người?",
    options: [
      { text: "Rất thoải mái và hào hứng", value: 3 },
      { text: "Thoải mái nhưng đôi khi cần nghỉ ngơi", value: 2 },
      { text: "Cảm thấy mệt mỏi và muốn về sớm", value: 1 },
    ],
  },
  {
    id: 2,
    text: "Khi gặp vấn đề khó khăn, bạn thường:",
    options: [
      { text: "Tìm kiếm sự giúp đỡ từ người khác", value: 3 },
      { text: "Cân nhắc giữa tự giải quyết và nhờ giúp đỡ", value: 2 },
      { text: "Tự mình suy nghĩ và giải quyết", value: 1 },
    ],
  },
  // Thêm các câu hỏi khác...
];