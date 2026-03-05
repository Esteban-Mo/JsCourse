import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CHAPTERS } from '../../chapters';
import QuizSection from '../Quiz/QuizSection';
import NavButtons from './NavButtons';
import CompletionScreen from './CompletionScreen';
import type { ChapterId } from '../../types';
import { useProgress } from '../../context/ProgressContext';

interface ChapterViewProps {
  chapterId: ChapterId;
}

export default function ChapterView({ chapterId }: ChapterViewProps) {
  const idx = CHAPTERS.findIndex(ch => ch.id === chapterId);
  const chapter = idx >= 0 ? CHAPTERS[idx] : null;
  const { markCompleted, answeredQuizzes } = useProgress();

  const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;
  const isLast = idx === CHAPTERS.length - 1;

  // Vrai si toutes les questions du chapitre ont une réponse correcte (ou s'il n'y en a pas)
  const allQuizzesPassed =
    !chapter?.quiz ||
    chapter.quiz.length === 0 ||
    chapter.quiz.every((q, i) => {
      const key = `${chapterId}-${i}`;
      return key in answeredQuizzes && answeredQuizzes[key] === q.correct;
    });

  // Valider le dernier chapitre uniquement si tous les quizz sont réussis
  useEffect(() => {
    if (isLast && typeof chapterId === 'number' && allQuizzesPassed) {
      markCompleted(chapterId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLast, chapterId, allQuizzesPassed]);

  if (!chapter) {
    return (
      <div style={{ padding: '80px 40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: '18px', marginBottom: '24px' }}>
          Chapitre introuvable.
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const ChapterComponent = chapter.component;

  return (
    <div className="chapter-view">
      <ChapterComponent />
      {chapter.quiz && chapter.quiz.length > 0 && (
        <QuizSection questions={chapter.quiz} chapterId={chapterId} />
      )}
      {isLast ? (
        <CompletionScreen />
      ) : (
        <NavButtons
          prev={prev}
          next={next}
          currentChapterId={chapterId}
          canComplete={allQuizzesPassed}
        />
      )}
    </div>
  );
}
