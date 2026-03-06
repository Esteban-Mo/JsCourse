import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CHAPTERS } from '../../chapters';
import QuizSection from '../Quiz/QuizSection';
import NavButtons from './NavButtons';
import CompletionScreen from './CompletionScreen';
import type { ChapterId } from '../../types';
import { useProgress } from '../../context/ProgressContext';

interface TocItem {
  id: string;
  text: string;
}

interface ChapterViewProps {
  chapterId: ChapterId;
}

export default function ChapterView({ chapterId }: ChapterViewProps) {
  const idx = CHAPTERS.findIndex(ch => ch.id === chapterId);
  const chapter = idx >= 0 ? CHAPTERS[idx] : null;
  const { markCompleted, answeredQuizzes, selectedQuestions } = useProgress();

  const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;
  const isLast = idx === CHAPTERS.length - 1;

  const contentRef = useRef<HTMLDivElement>(null);
  const [readingTime, setReadingTime] = useState<number | null>(null);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeTocId, setActiveTocId] = useState<string | null>(null);

  // Vrai si toutes les questions sélectionnées sont réussies (ou s'il n'y en a pas)
  const selection = selectedQuestions[String(chapterId)] ?? [];
  const allQuizzesPassed =
    !chapter?.quiz ||
    chapter.quiz.length === 0 ||
    selection.length === 0 ||
    selection.every(i => {
      const key = `${chapterId}-${i}`;
      return key in answeredQuizzes && answeredQuizzes[key] === chapter!.quiz![i].correct;
    });

  // Réinitialise la ref quand on change de chapitre (évite les faux confettis)
  const prevPassedRef = useRef(allQuizzesPassed);
  useEffect(() => {
    prevPassedRef.current = allQuizzesPassed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  // Confetti : se déclenche uniquement lors du passage false → true
  useEffect(() => {
    if (allQuizzesPassed && !prevPassedRef.current && chapter?.quiz?.length && selection.length > 0) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#f7c948', '#7c6af7', '#4af7a8'],
      });
    }
    prevPassedRef.current = allQuizzesPassed;
  }, [allQuizzesPassed, chapter?.quiz?.length]);

  // Valide automatiquement le chapitre dès que tous les quizz sélectionnés sont réussis
  useEffect(() => {
    if (
      typeof chapterId === 'number' &&
      chapter?.quiz?.length &&
      selection.length > 0 &&
      allQuizzesPassed
    ) {
      markCompleted(chapterId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allQuizzesPassed, chapterId, selection.length]);

  // Calcul du temps de lecture + extraction du sommaire depuis le DOM
  useEffect(() => {
    setReadingTime(null);
    setTocItems([]);
    setActiveTocId(null);

    const raf = requestAnimationFrame(() => {
      if (!contentRef.current) return;

      // Temps de lecture (~200 mots/min)
      const text = contentRef.current.innerText ?? '';
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      setReadingTime(Math.max(1, Math.ceil(words / 200)));

      // Sommaire depuis les <h2>
      const headings = Array.from(contentRef.current.querySelectorAll('h2'));
      const items = headings.map((h, i) => {
        const id = `toc-section-${i}`;
        h.id = id;
        return { id, text: h.textContent?.trim() ?? '' };
      }).filter(item => item.text);
      setTocItems(items);
      if (items.length > 0) setActiveTocId(items[0].id);
    });

    return () => cancelAnimationFrame(raf);
  }, [chapterId]);

  // Highlight de la section active dans le TOC
  useEffect(() => {
    if (tocItems.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveTocId(entry.target.id);
        }
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );
    tocItems.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tocItems]);

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
      {readingTime !== null && (
        <div className="reading-time-chip">⏱ ~{readingTime} min de lecture</div>
      )}
      <div ref={contentRef}>
        <ChapterComponent />
      </div>
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

      {/* Table des matières sticky (portail, uniquement sur grands écrans) */}
      {tocItems.length > 1 && createPortal(
        <nav className="toc-panel" aria-label="Sommaire du chapitre">
          <div className="toc-title">Sommaire</div>
          {tocItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`toc-item${activeTocId === item.id ? ' active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {item.text}
            </a>
          ))}
        </nav>,
        document.body
      )}
    </div>
  );
}
