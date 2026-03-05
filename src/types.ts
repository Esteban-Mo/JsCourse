import type { ComponentType } from 'react';

export interface QuizQuestion {
  question: string;
  sub: string;
  options: string[];
  correct: number;
  explanation: string;
}

export type ChapterId = number | 'home';

export interface Chapter {
  id: ChapterId;
  title: string;
  icon: string;
  level: string | null;
  stars?: string;
  component: ComponentType;
  quiz?: QuizQuestion[];
}

export interface NavGroup {
  label: string;
  filter: (ch: Chapter) => boolean;
}
