'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/helpers/api/config';
import ProgressBar from '@/components/progressBar/progressBar';

// --- Types ---
type DimensionKey = 'EI' | 'SN' | 'TF' | 'JP';

type MBTIOption = {
  option_text: string;
  value: number; // +1 nghiêng về chữ cái đầu, -1 nghiêng về chữ cái sau (ví dụ EI: +1 => E, -1 => I)
};

type MBTIQuestion = {
  id: number | string;
  dimension: DimensionKey;
  question: string;
  options: MBTIOption[];
};

export default function MBTIQuizPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<MBTIQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch questions from API ---
  useEffect(() => {
    const abort = new AbortController();

    async function fetchQuestions() {
      try {
        setLoading(true);
        setError(null);

        // Đổi endpoint này cho khớp với backend của bạn
        const res = await axiosInstance.get<MBTIQuestion[]>('/tests/quiz', {
          signal: abort.signal,
        });

        console.log('MBTI questions fetched:', res.data);

        // (Tuỳ backend) đảm bảo dữ liệu hợp lệ và đúng kiểu
        const data = Array.isArray(res.data) ? res.data : [];
        if (!data.length) {
          throw new Error('Không nhận được câu hỏi MBTI.');
        }

        // (Optional) Sắp xếp theo id nếu cần
        // data.sort((a, b) => Number(a.id) - Number(b.id));

        setQuestions(data);
        setCurrentIndex(0);
        setAnswers([]);
      } catch (err: any) {
        if (err?.name === 'CanceledError') return; // request bị hủy khi unmount
        setError(err?.message || 'Lỗi tải câu hỏi MBTI.');
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
    return () => abort.abort();
  }, []);

  // --- Helpers ---
  const total = questions.length;

  const currentQuestion = useMemo(
    () => (total > 0 && currentIndex < total ? questions[currentIndex] : null),
    [questions, currentIndex, total]
  );

  const calculateMBTI = (answers: number[], qs: MBTIQuestion[]): string => {
    const dimensions: Record<DimensionKey, number> = {
      EI: 0, // Extraversion vs Introversion
      SN: 0, // Sensing vs Intuition
      TF: 0, // Thinking vs Feeling
      JP: 0, // Judging vs Perceiving
    };

    qs.forEach((q, i) => {
      const val = answers[i] ?? 0;
      dimensions[q.dimension] += val;
    });

    return [
      dimensions.EI >= 0 ? 'E' : 'I',
      dimensions.SN >= 0 ? 'S' : 'N',
      dimensions.TF >= 0 ? 'T' : 'F',
      dimensions.JP >= 0 ? 'J' : 'P',
    ].join('');
  };

  const handleAnswer = (value: number) => {
    if (!currentQuestion) return;

    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    // Chuyển sang câu tiếp theo hoặc tính kết quả
    const nextIndex = currentIndex + 1;
    if (nextIndex < total) {
      setCurrentIndex(nextIndex);
    } else {
      const result = calculateMBTI(newAnswers, questions);
      router.push(`/services/mbti-test/results?type=${result}`);
    }
  };

  // --- UI states ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="text-gray-700">Đang tải câu hỏi MBTI…</div>
      </div>
    );
  }

  if (error || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-red-600 font-semibold mb-2">Có lỗi xảy ra</div>
          <div className="text-gray-600 mb-4">{error ?? 'Không có câu hỏi để hiển thị.'}</div>
          <button
            onClick={() => location.reload()}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-indigo-50 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <ProgressBar current={currentIndex + 1} total={total} />

        <div className="mt-8">
          <div className="mb-4 text-sm text-indigo-600 font-medium">
            {currentQuestion.dimension === 'EI'
              ? 'Hướng ngoại (E) vs Hướng nội (I)'
              : currentQuestion.dimension === 'SN'
              ? 'Giác quan (S) vs Trực giác (N)'
              : currentQuestion.dimension === 'TF'
              ? 'Lý trí (T) vs Cảm xúc (F)'
              : 'Nguyên tắc (J) vs Linh hoạt (P)'}
          </div>

          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-3 border border-gray-200 rounded-lg hover:bg-indigo-50 transition text-left"
              >
                {option.option_text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
