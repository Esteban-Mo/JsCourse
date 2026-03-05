import { useNavigate } from 'react-router-dom';
import type { Chapter, ChapterId } from '../../types';
import { useProgress } from '../../context/ProgressContext';

interface NavButtonsProps {
  prev: Chapter | null;
  next: Chapter | null;
  currentChapterId: ChapterId;
  canComplete: boolean;
}

export default function NavButtons({ prev, next, currentChapterId, canComplete }: NavButtonsProps) {
  const navigate = useNavigate();
  const { markCompleted } = useProgress();

  const goTo = (ch: Chapter) => {
    navigate(ch.id === 'home' ? '/' : `/chapter/${ch.id}`);
  };

  const handleNext = () => {
    if (currentChapterId !== 'home' && canComplete) markCompleted(currentChapterId);
    if (next) goTo(next);
  };

  return (
    <div className="nav-buttons-wrap">
      <div className="nav-buttons">
        {prev && (
          <button className="btn btn-secondary" onClick={() => goTo(prev)}>
            ← {prev.title}
          </button>
        )}
        {next && (
          <button className="btn btn-primary" onClick={handleNext}>
            {next.title} →
          </button>
        )}
      </div>
      {!canComplete && next && (
        <p className="quiz-required-hint">
          Réponds correctement à tous les quizz pour valider ce chapitre.
        </p>
      )}
    </div>
  );
}
