import { useEffect } from 'react';
import QuizBlock from './QuizBlock';
import type { QuizQuestion, ChapterId } from '../../types';
import { useProgress } from '../../context/ProgressContext';

interface QuizSectionProps {
  questions: QuizQuestion[];
  chapterId: ChapterId;
}

const PICK = 3;

export default function QuizSection({ questions, chapterId }: QuizSectionProps) {
  const { answeredQuizzes, resetChapterQuizzes, selectedQuestions, initQuestionSelection } = useProgress();

  const key = String(chapterId);
  const selection = selectedQuestions[key];

  // Initialise la sélection aléatoire si elle n'existe pas encore ou est invalide
  useEffect(() => {
    if (questions.length === 0) return;
    const isValidSelection = selection &&
      selection.length === Math.min(PICK, questions.length) &&
      selection.every(i => i >= 0 && i < questions.length);

    if (!isValidSelection) {
      initQuestionSelection(chapterId, questions.length, PICK);
    }
  }, [chapterId, selection, questions.length, initQuestionSelection]);

  if (questions.length === 0 || !selection || selection.length === 0) return null;

  const picked = selection
    .map(i => ({ q: questions[i], actualIdx: i }))
    .filter(item => item.q !== undefined);

  const answeredCount = picked.filter(({ actualIdx }) => `${chapterId}-${actualIdx}` in answeredQuizzes).length;
  const xpEarned = picked.reduce((acc, { q, actualIdx }) => {
    const k = `${chapterId}-${actualIdx}`;
    return acc + (answeredQuizzes[k] === q.correct ? 25 : 0);
  }, 0);

  const handleReset = () => resetChapterQuizzes(chapterId, xpEarned);

  return (
    <>
      {picked.map(({ q, actualIdx }) => (
        <QuizBlock key={actualIdx} question={q} chapterId={chapterId} quizIdx={actualIdx} />
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
