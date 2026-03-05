import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ChapterId } from '../types';

interface ProgressState {
  xp: number;
  completedChapters: Set<ChapterId>;
  answeredQuizzes: Record<string, number>;
}

interface ProgressContextValue extends ProgressState {
  addXP: (amount: number) => void;
  markCompleted: (id: ChapterId) => void;
  recordQuizAnswer: (chapterId: ChapterId, quizIdx: number, answer: number) => void;
  isCompleted: (id: ChapterId) => boolean;
  hasAnsweredQuiz: (chapterId: ChapterId, quizIdx: number) => boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function loadState(): ProgressState {
  try {
    const xp = parseInt(localStorage.getItem('jscours_xp') ?? '0', 10) || 0;
    const completed = JSON.parse(localStorage.getItem('jscours_completed') ?? '[]') as ChapterId[];
    const quizzes = JSON.parse(localStorage.getItem('jscours_quizzes') ?? '{}') as Record<string, number>;
    return { xp, completedChapters: new Set(completed), answeredQuizzes: quizzes };
  } catch {
    return { xp: 0, completedChapters: new Set(), answeredQuizzes: {} };
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadState);

  useEffect(() => {
    localStorage.setItem('jscours_xp', String(state.xp));
    localStorage.setItem('jscours_completed', JSON.stringify([...state.completedChapters]));
    localStorage.setItem('jscours_quizzes', JSON.stringify(state.answeredQuizzes));
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

  return (
    <ProgressContext.Provider value={{
      ...state,
      addXP,
      markCompleted,
      recordQuizAnswer,
      isCompleted,
      hasAnsweredQuiz,
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
