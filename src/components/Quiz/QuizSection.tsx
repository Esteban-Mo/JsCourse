import QuizBlock from './QuizBlock';
import type { QuizQuestion, ChapterId } from '../../types';

interface QuizSectionProps {
  questions: QuizQuestion[];
  chapterId: ChapterId;
}

export default function QuizSection({ questions, chapterId }: QuizSectionProps) {
  if (questions.length === 0) return null;
  return (
    <>
      {questions.map((q, idx) => (
        <QuizBlock key={idx} question={q} chapterId={chapterId} quizIdx={idx} />
      ))}
    </>
  );
}
