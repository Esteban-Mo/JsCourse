import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ChapterId } from '../types';

interface ProgressState {
  xp: number;
  completedChapters: Set<ChapterId>;
  answeredQuizzes: Record<string, number>;
  shuffleSeed: number;
  selectedQuestions: Record<string, number[]>;
}

interface ProgressContextValue extends ProgressState {
  addXP: (amount: number) => void;
  markCompleted: (id: ChapterId) => void;
  recordQuizAnswer: (chapterId: ChapterId, quizIdx: number, answer: number) => void;
  isCompleted: (id: ChapterId) => boolean;
  hasAnsweredQuiz: (chapterId: ChapterId, quizIdx: number) => boolean;
  resetProgress: () => void;
  resetChapterQuizzes: (chapterId: ChapterId, xpToRemove: number) => void;
  initQuestionSelection: (chapterId: ChapterId, totalCount: number, pickCount?: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function newSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

function pickRandom(total: number, count: number): number[] {
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, Math.min(count, total)).sort((a, b) => a - b);
}

function loadState(): ProgressState {
  try {
    const xp = parseInt(localStorage.getItem('jscours_xp') ?? '0', 10) || 0;
    const completed = JSON.parse(localStorage.getItem('jscours_completed') ?? '[]') as ChapterId[];
    const quizzes = JSON.parse(localStorage.getItem('jscours_quizzes') ?? '{}') as Record<string, number>;
    const storedSeed = parseInt(localStorage.getItem('jscours_seed') ?? '0', 10);
    const shuffleSeed = storedSeed || newSeed();
    const selectedQuestions = JSON.parse(localStorage.getItem('jscours_selections') ?? '{}') as Record<string, number[]>;
    return { xp, completedChapters: new Set(completed), answeredQuizzes: quizzes, shuffleSeed, selectedQuestions };
  } catch {
    return { xp: 0, completedChapters: new Set(), answeredQuizzes: {}, shuffleSeed: newSeed(), selectedQuestions: {} };
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadState);

  useEffect(() => {
    localStorage.setItem('jscours_xp', String(state.xp));
    localStorage.setItem('jscours_completed', JSON.stringify([...state.completedChapters]));
    localStorage.setItem('jscours_quizzes', JSON.stringify(state.answeredQuizzes));
    localStorage.setItem('jscours_seed', String(state.shuffleSeed));
    localStorage.setItem('jscours_selections', JSON.stringify(state.selectedQuestions));
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

  const initQuestionSelection = (chapterId: ChapterId, totalCount: number, pickCount = 3) => {
    const key = String(chapterId);
    setState(s => {
      const existing = s.selectedQuestions[key];
      if (existing && existing.length === Math.min(pickCount, totalCount)) return s;
      const selected = pickRandom(totalCount, pickCount);
      return { ...s, selectedQuestions: { ...s.selectedQuestions, [key]: selected } };
    });
  };

  const resetChapterQuizzes = (chapterId: ChapterId, xpToRemove: number) => {
    const key = String(chapterId);
    setState(s => {
      const newAnswered = { ...s.answeredQuizzes };
      Object.keys(newAnswered)
        .filter(k => k.startsWith(`${chapterId}-`))
        .forEach(k => delete newAnswered[k]);
      const newCompleted = new Set(s.completedChapters);
      newCompleted.delete(chapterId);
      const newSelections = { ...s.selectedQuestions };
      delete newSelections[key];
      return {
        ...s,
        xp: Math.max(0, s.xp - xpToRemove),
        answeredQuizzes: newAnswered,
        completedChapters: newCompleted,
        selectedQuestions: newSelections,
      };
    });
  };

  const resetProgress = () => {
    localStorage.removeItem('jscours_xp');
    localStorage.removeItem('jscours_completed');
    localStorage.removeItem('jscours_quizzes');
    localStorage.removeItem('jscours_selections');
    localStorage.removeItem('jscours_exam_sel');
    localStorage.removeItem('jscours_exam_ans');
    localStorage.removeItem('jscours_exam_seed');
    const seed = newSeed();
    localStorage.setItem('jscours_seed', String(seed));
    setState({ xp: 0, completedChapters: new Set(), answeredQuizzes: {}, shuffleSeed: seed, selectedQuestions: {} });
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
      initQuestionSelection,
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
