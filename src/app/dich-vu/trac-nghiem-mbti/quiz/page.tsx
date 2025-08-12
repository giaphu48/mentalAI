'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/progressBar/progressBar';
import { mbtiQuestions } from '@/data/mbtiQuestions';

export default function MBTIQuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const router = useRouter();

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentIndex < mbtiQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const result = calculateMBTI(newAnswers);
      router.push(`/dich-vu/trac-nghiem-mbti/results?type=${result}`);
    }
  };

  const calculateMBTI = (answers: number[]): string => {
    const dimensions = {
      EI: 0, // Extraversion vs Introversion
      SN: 0, // Sensing vs Intuition
      TF: 0, // Thinking vs Feeling
      JP: 0  // Judging vs Perceiving
    };

    mbtiQuestions.forEach((q, i) => {
      dimensions[q.dimension] += answers[i];
    });

    return [
      dimensions.EI >= 0 ? 'E' : 'I',
      dimensions.SN >= 0 ? 'S' : 'N',
      dimensions.TF >= 0 ? 'T' : 'F',
      dimensions.JP >= 0 ? 'J' : 'P'
    ].join('');
  };

  const currentQuestion = mbtiQuestions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <ProgressBar current={currentIndex + 1} total={mbtiQuestions.length} />
        
        <div className="mt-8">
          <div className="mb-4 text-sm text-indigo-600 font-medium">
            {currentQuestion.dimension === 'EI' ? 'Hướng ngoại (E) vs Hướng nội (I)' :
             currentQuestion.dimension === 'SN' ? 'Giác quan (S) vs Trực giác (N)' :
             currentQuestion.dimension === 'TF' ? 'Lý trí (T) vs Cảm xúc (F)' : 
             'Nguyên tắc (J) vs Linh hoạt (P)'}
          </div>
          
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-3 border border-gray-200 rounded-lg hover:bg-indigo-50 transition"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}