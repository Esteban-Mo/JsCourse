import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import type { Chapter } from '../types';

const MODULES = [
  { emoji: '📦', title: 'Les Bases', desc: 'Variables, types, portée, hoisting, coercition', level: 'Débutant', chap: '2 chapitres', id: 1 },
  { emoji: '🔄', title: 'Contrôle de flux', desc: 'Conditions et boucles', level: 'Débutant', chap: '2 chapitres', id: 3 },
  { emoji: '🧩', title: 'Fonctions', desc: 'Déclarations, flèches, closures', level: 'Intermédiaire', chap: '1 chapitre', id: 5 },
  { emoji: '🗂️', title: 'Tableaux & Objets', desc: 'Structures de données', level: 'Intermédiaire', chap: '1 chapitre', id: 6 },
  { emoji: '🌐', title: 'DOM & Events', desc: 'querySelector, événements, formulaires, localStorage', level: 'Intermédiaire', chap: '1 chapitre', id: 7 },
  { emoji: '🔍', title: 'Expressions Régulières', desc: 'Patterns, groupes, validation, extraction', level: 'Intermédiaire', chap: '1 chapitre', id: 8 },
  { emoji: '⚡', title: 'ES6+ Moderne', desc: 'Déstructuration, spread, optional chaining', level: 'Avancé', chap: '1 chapitre', id: 9 },
  { emoji: '🚨', title: 'Gestion des Erreurs', desc: 'try/catch, erreurs custom, re-throw', level: 'Avancé', chap: '1 chapitre', id: 10 },
  { emoji: '🔮', title: 'Async JS', desc: 'Promises, async/await, fetch', level: 'Avancé', chap: '1 chapitre', id: 11 },
  { emoji: '🏗️', title: 'POO & Patterns', desc: 'Classes, prototypes, design patterns', level: 'Expert', chap: '1 chapitre', id: 12 },
  { emoji: '🚀', title: 'Performance & V8', desc: 'Event loop, optimisations, mémoire', level: 'Expert+', chap: '1 chapitre', id: 13 },
  { emoji: '🔬', title: 'Métaprogrammation', desc: 'Proxy, Reflect, Symbols, WeakMap', level: 'Maître', chap: '1 chapitre', id: 14 },
  { emoji: '🧠', title: 'Patterns Avancés', desc: 'Functional JS, monades, currying', level: 'Maître', chap: '1 chapitre', id: 15 },
  { emoji: '🔷', title: 'TypeScript — Bases', desc: 'Types, interfaces, unions, génériques', level: 'Bonus TS', chap: '1 chapitre', id: 16 },
  { emoji: '💎', title: 'TypeScript — Avancé', desc: 'Utility types, mapped types, infer', level: 'Bonus TS', chap: '1 chapitre', id: 17 },
  { emoji: '🏛️', title: 'TypeScript — POO', desc: 'Classes abstraites, type guards, discriminated unions', level: 'Bonus TS', chap: '1 chapitre', id: 18 },
  { emoji: '🎨', title: 'TypeScript — Décorateurs', desc: 'Décorateurs, Singleton, Repository, Factory', level: 'Bonus TS', chap: '1 chapitre', id: 19 },
  { emoji: '⚙️', title: 'TypeScript — Config', desc: 'tsconfig, strict mode, Vite, ESLint, .d.ts', level: 'Bonus TS', chap: '1 chapitre', id: 20 },
];

function levelCls(level: string): string {
  if (level.startsWith('Expert')) return 'expert-card';
  if (level === 'Maître') return 'master-card';
  if (level === 'Bonus TS') return 'ts-card';
  return '';
}

function Home() {
  const { isCompleted } = useProgress();
  return (
    <>
      <div className="chapter-tag">Bienvenue</div>
      <h1>Maîtrise<br /><span className="highlight">JavaScript</span><br />de A à Z</h1>
      <p className="intro-text">
        Un cours complet, interactif et progressif. Des fondamentaux aux niveaux maître — avec des quizz pour tester tes connaissances à chaque étape.
      </p>
      <div className="home-grid">
        {MODULES.map(m => {
          const completed = isCompleted(m.id);
          const cls = `module-card ${levelCls(m.level)}${completed ? ' completed-card' : ''}`;
          return (
            <Link key={m.id} to={`/chapter/${m.id}`} className={cls}>
              {completed && <span className="module-completed-badge">✓</span>}
              <span className="module-emoji">{m.emoji}</span>
              <div className="module-title">{m.title}</div>
              <p className="module-desc">{m.desc}</p>
              <div className="module-chapters">{m.level} · {m.chap}</div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export const chapter: Chapter = {
  id: 'home',
  title: 'Accueil',
  icon: '🏠',
  level: null,
  component: Home,
};
