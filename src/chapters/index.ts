import type { Chapter, NavGroup } from '../types';
import { chapter as home } from './home';
import { chapter as ch01 } from './ch01-variables';
import { chapter as ch02 } from './ch02-operateurs';
import { chapter as ch03 } from './ch03-conditions';
import { chapter as ch04 } from './ch04-boucles';
import { chapter as ch05 } from './ch05-fonctions';
import { chapter as ch06 } from './ch06-tableaux-objets';
import { chapter as ch07 } from './ch07-methodes-tableaux';
import { chapter as ch08 } from './ch08-chaines';
import { chapter as ch09 } from './ch09-dates-intl';
import { chapter as ch10 } from './ch10-dom';
import { chapter as ch11 } from './ch11-regex';
import { chapter as ch12 } from './ch12-es6';
import { chapter as ch13 } from './ch13-erreurs';
import { chapter as ch14 } from './ch14-async';
import { chapter as ch15 } from './ch15-modules-es';
import { chapter as ch16 } from './ch16-tests-vitest';
import { chapter as ch17 } from './ch17-web-apis';
import { chapter as ch18 } from './ch18-poo';
import { chapter as ch19 } from './ch19-generateurs';
import { chapter as ch20 } from './ch20-performance';
import { chapter as ch21 } from './ch21-algorithmes';
import { chapter as ch22 } from './ch22-metaprogrammation';
import { chapter as ch23 } from './ch23-patterns';
import { chapter as ch24 } from './ch24-ts-bases';
import { chapter as ch25 } from './ch25-ts-avance';
import { chapter as ch26 } from './ch26-ts-poo';
import { chapter as ch27 } from './ch27-ts-decorateurs';
import { chapter as ch28 } from './ch28-ts-config';

export const CHAPTERS: Chapter[] = [
  home,
  // Débutant
  ch01, ch02, ch03, ch04,
  // Intermédiaire
  ch05, ch06, ch07, ch08, ch09, ch10, ch11,
  // Avancé
  ch12, ch13, ch14, ch15, ch16, ch17,
  // Expert
  ch18, ch19,
  // Expert+
  ch20, ch21,
  // Maître
  ch22, ch23,
  // TypeScript
  ch24, ch25, ch26, ch27, ch28,
];

export const GROUPS: NavGroup[] = [
  { label: 'Accueil',       filter: (ch: Chapter) => ch.id === 'home' },
  { label: 'Débutant',      filter: (ch: Chapter) => ch.level === 'Débutant' },
  { label: 'Intermédiaire', filter: (ch: Chapter) => ch.level === 'Intermédiaire' },
  { label: 'Avancé',        filter: (ch: Chapter) => ch.level === 'Avancé' },
  { label: 'Expert',        filter: (ch: Chapter) => ch.level?.startsWith('Expert') ?? false },
  { label: 'Maître 🔥',     filter: (ch: Chapter) => ch.level === 'Maître' },
  { label: '🔷 TypeScript', filter: (ch: Chapter) => ch.level === 'Bonus TS' },
];
