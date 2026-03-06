import QuizBlock from './QuizBlock';
import type { QuizQuestion, ChapterId } from '../../types';
import { useProgress } from '../../context/ProgressContext';

interface QuizSectionProps {
  questions: QuizQuestion[];
  chapterId: ChapterId;
}

export default function QuizSection({ questions, chapterId }: QuizSectionProps) {
  const { answeredQuizzes, resetChapterQuizzes } = useProgress();

  if (questions.length === 0) return null;

  const answeredCount = questions.filter((_, i) => `${chapterId}-${i}` in answeredQuizzes).length;
  const xpEarned = questions.reduce((acc, q, i) => {
    const key = `${chapterId}-${i}`;
    return acc + (answeredQuizzes[key] === q.correct ? 25 : 0);
  }, 0);

  const handleReset = () => {
    resetChapterQuizzes(chapterId, xpEarned);
  };

  return (
    <>
      {questions.map((q, idx) => (
        <QuizBlock key={idx} question={q} chapterId={chapterId} quizIdx={idx} />
      ))}
      {answeredCount > 0 && (
        <div className="quiz-retry-wrap">
          <button className="quiz-retry-btn" onClick={handleReset}>
            🔄 Réessayer le quiz
          </button>
        </div>
      )}
    </>
  );
}
