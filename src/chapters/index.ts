import type { Chapter, NavGroup } from '../types';
import { chapter as home } from './home';
import { chapter as ch01 } from './ch01-variables';
import { chapter as ch02 } from './ch02-operateurs';
import { chapter as ch03 } from './ch03-conditions';
import { chapter as ch04 } from './ch04-boucles';
import { chapter as ch05 } from './ch05-fonctions';
import { chapter as ch06 } from './ch06-tableaux-objets';
import { chapter as ch07 } from './ch07-dom';
import { chapter as ch08 } from './ch08-regex';
import { chapter as ch09 } from './ch09-es6';
import { chapter as ch10 } from './ch10-erreurs';
import { chapter as ch11 } from './ch11-async';
import { chapter as ch12 } from './ch12-poo';
import { chapter as ch13 } from './ch13-performance';
import { chapter as ch14 } from './ch14-metaprogrammation';
import { chapter as ch15 } from './ch15-patterns';
import { chapter as ch16 } from './ch16-ts-bases';
import { chapter as ch17 } from './ch17-ts-avance';
import { chapter as ch18 } from './ch18-ts-poo';
import { chapter as ch19 } from './ch19-ts-decorateurs';
import { chapter as ch20 } from './ch20-ts-config';

export const CHAPTERS: Chapter[] = [
  home,
  ch01, ch02, ch03, ch04, ch05,
  ch06, ch07, ch08, ch09, ch10,
  ch11, ch12, ch13, ch14, ch15,
  ch16, ch17, ch18, ch19, ch20,
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
