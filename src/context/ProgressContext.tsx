import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ChapterId } from '../types';

interface ProgressState {
  xp: number;
  completedChapters: Set<ChapterId>;
  answeredQuizzes: Record<string, number>;
  shuffleSeed: number;
}

interface ProgressContextValue extends ProgressState {
  addXP: (amount: number) => void;
  markCompleted: (id: ChapterId) => void;
  recordQuizAnswer: (chapterId: ChapterId, quizIdx: number, answer: number) => void;
  isCompleted: (id: ChapterId) => boolean;
  hasAnsweredQuiz: (chapterId: ChapterId, quizIdx: number) => boolean;
  resetProgress: () => void;
  resetChapterQuizzes: (chapterId: ChapterId, xpToRemove: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function newSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

function loadState(): ProgressState {
  try {
    const xp = parseInt(localStorage.getItem('jscours_xp') ?? '0', 10) || 0;
    const completed = JSON.parse(localStorage.getItem('jscours_completed') ?? '[]') as ChapterId[];
    const quizzes = JSON.parse(localStorage.getItem('jscours_quizzes') ?? '{}') as Record<string, number>;
    const storedSeed = parseInt(localStorage.getItem('jscours_seed') ?? '0', 10);
    const shuffleSeed = storedSeed || newSeed();
    return { xp, completedChapters: new Set(completed), answeredQuizzes: quizzes, shuffleSeed };
  } catch {
    return { xp: 0, completedChapters: new Set(), answeredQuizzes: {}, shuffleSeed: newSeed() };
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadState);

  useEffect(() => {
    localStorage.setItem('jscours_xp', String(state.xp));
    localStorage.setItem('jscours_completed', JSON.stringify([...state.completedChapters]));
    localStorage.setItem('jscours_quizzes', JSON.stringify(state.answeredQuizzes));
    localStorage.setItem('jscours_seed', String(state.shuffleSeed));
  }, [state]);

  const addXP = (amount: number) => {
    setState(s => ({ ...s, xp: s.xp + amount }));
  };

  const markCompleted = (id: ChapterId) => {
    setState(s => {
      if (s.completedChapters.has(id)) return s;
      return { ...s, completedChapters: new Set([...s.completedChapters, id]) };
    });
  };

  const recordQuizAnswer = (chapterId: ChapterId, quizIdx: number, answer: number) => {
    const key = `${chapterId}-${quizIdx}`;
    setState(s => {
      if (key in s.answeredQuizzes) return s;
      return { ...s, answeredQuizzes: { ...s.answeredQuizzes, [key]: answer } };
    });
  };

  const isCompleted = (id: ChapterId) => state.completedChapters.has(id);

  const hasAnsweredQuiz = (chapterId: ChapterId, quizIdx: number) =>
    `${chapterId}-${quizIdx}` in state.answeredQuizzes;

  const resetChapterQuizzes = (chapterId: ChapterId, xpToRemove: number) => {
    setState(s => {
      const newAnswered = { ...s.answeredQuizzes };
      Object.keys(newAnswered)
        .filter(k => k.startsWith(`${chapterId}-`))
        .forEach(k => delete newAnswered[k]);
      const newCompleted = new Set(s.completedChapters);
      newCompleted.delete(chapterId);
      return {
        ...s,
        xp: Math.max(0, s.xp - xpToRemove),
        answeredQuizzes: newAnswered,
        completedChapters: newCompleted,
      };
    });
  };

  const resetProgress = () => {
    // Vider le localStorage immédiatement pour éviter toute race condition
    localStorage.removeItem('jscours_xp');
    localStorage.removeItem('jscours_completed');
    localStorage.removeItem('jscours_quizzes');
    const seed = newSeed();
    localStorage.setItem('jscours_seed', String(seed));
    setState({ xp: 0, completedChapters: new Set(), answeredQuizzes: {}, shuffleSeed: seed });
  };

  return (
    <ProgressContext.Provider value={{
      ...state,
      addXP,
      markCompleted,
      recordQuizAnswer,
      isCompleted,
      hasAnsweredQuiz,
      resetProgress,
      resetChapterQuizzes,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
