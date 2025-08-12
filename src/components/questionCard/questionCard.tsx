import { Question } from '@/data/question';

interface QuestionCardProps {
  question: Question;
  onAnswer: (index: number) => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition duration-200"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}