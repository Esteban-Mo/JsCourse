import { CHAPTERS } from '../../chapters';
import QuizSection from '../Quiz/QuizSection';
import NavButtons from './NavButtons';
import CompletionScreen from './CompletionScreen';
import type { ChapterId } from '../../types';

interface ChapterViewProps {
  chapterId: ChapterId;
}

export default function ChapterView({ chapterId }: ChapterViewProps) {
  const idx = CHAPTERS.findIndex(ch => ch.id === chapterId);
  const chapter = idx >= 0 ? CHAPTERS[idx] : null;

  if (!chapter) {
    return <p style={{ color: '#a0a0c0', padding: '40px' }}>Chapitre introuvable.</p>;
  }

  const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;
  const isLast = idx === CHAPTERS.length - 1;

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
        <NavButtons prev={prev} next={next} currentChapterId={chapterId} />
      )}
    </div>
  );
}
