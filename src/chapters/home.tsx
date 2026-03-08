import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import type { Chapter } from '../types';

const MODULES = [
  { emoji: '📦', title: 'Les Bases', desc: 'Variables, types, portée, hoisting, coercition', level: 'Débutant', stars: '★☆☆☆☆', id: 1 },
  { emoji: '🔄', title: 'Contrôle de flux', desc: 'Conditions et boucles', level: 'Débutant', stars: '★★☆☆☆', id: 3 },
  { emoji: '🧩', title: 'Fonctions', desc: 'Déclarations, flèches, closures', level: 'Intermédiaire', stars: '★★★☆☆', id: 5 },
  { emoji: '🗂️', title: 'Tableaux & Objets', desc: 'Structures de données', level: 'Intermédiaire', stars: '★★★☆☆', id: 6 },
  { emoji: '🧰', title: 'Méthodes de tableaux', desc: 'map, filter, reduce, find, flat, sort et chaînage', level: 'Intermédiaire', stars: '★★★☆☆', id: 7 },
  { emoji: '🔤', title: 'Manipulation de chaînes', desc: 'slice, split, replace, template literals, tagged templates', level: 'Intermédiaire', stars: '★★★☆☆', id: 8 },
  { emoji: '📅', title: 'Dates & Intl', desc: 'Date API, formatage localisé, temps relatif', level: 'Intermédiaire', stars: '★★★☆☆', id: 9 },
  { emoji: '🌐', title: 'DOM & Events', desc: 'querySelector, événements, formulaires, localStorage', level: 'Intermédiaire', stars: '★★★☆☆', id: 10 },
  { emoji: '🔍', title: 'Expressions Régulières', desc: 'Patterns, groupes, validation, extraction', level: 'Intermédiaire', stars: '★★★☆☆', id: 11 },
  { emoji: '⚡', title: 'ES6+ Moderne', desc: 'Déstructuration, spread, optional chaining', level: 'Avancé', stars: '★★★★☆', id: 12 },
  { emoji: '🚨', title: 'Gestion des Erreurs', desc: 'try/catch, erreurs custom, re-throw', level: 'Avancé', stars: '★★★★☆', id: 13 },
  { emoji: '🔮', title: 'Async JS', desc: 'Promises, async/await, fetch', level: 'Avancé', stars: '★★★★☆', id: 14 },
  { emoji: '📤', title: 'Modules ES', desc: 'import/export, dynamic import, tree-shaking', level: 'Avancé', stars: '★★★★☆', id: 15 },
  { emoji: '🧪', title: 'Tests avec Jest', desc: 'jest.fn(), jest.mock(), fetch, mocks, coverage', level: 'Avancé', stars: '★★★★☆', id: 16 },
  { emoji: '🌍', title: 'Web APIs modernes', desc: 'IntersectionObserver, Clipboard, Performance API', level: 'Avancé', stars: '★★★★☆', id: 17 },
  { emoji: '🏗️', title: 'POO & Patterns', desc: 'Classes, prototypes, design patterns', level: 'Expert', stars: '★★★★★', id: 18 },
  { emoji: '🌀', title: 'Générateurs & Itérateurs', desc: 'function*, yield, protocole itérable, async generators', level: 'Expert', stars: '★★★★★', id: 19 },
  { emoji: '🚀', title: 'Performance & V8', desc: 'Event loop, optimisations, mémoire', level: 'Expert+', stars: '★★★★★', id: 20 },
  { emoji: '🧮', title: 'Algorithmes fondamentaux', desc: 'Big O, tri, récursion, mémoïsation, structures de données', level: 'Expert+', stars: '★★★★★', id: 21 },
  { emoji: '🔬', title: 'Métaprogrammation', desc: 'Proxy, Reflect, Symbols, WeakMap', level: 'Maître', stars: '★★★★★', id: 22 },
  { emoji: '🧠', title: 'Patterns Avancés', desc: 'Functional JS, monades, currying', level: 'Maître', stars: '★★★★★', id: 23 },
  { emoji: '🔷', title: 'TypeScript — Bases', desc: 'Types, interfaces, unions, génériques', level: 'Bonus TS', stars: '★★★☆☆', id: 24 },
  { emoji: '💎', title: 'TypeScript — Avancé', desc: 'Utility types, mapped types, infer', level: 'Bonus TS', stars: '★★★★★', id: 25 },
  { emoji: '🏛️', title: 'TypeScript — POO', desc: 'Classes abstraites, type guards, discriminated unions', level: 'Bonus TS', stars: '★★★★☆', id: 26 },
  { emoji: '🎨', title: 'TypeScript — Décorateurs', desc: 'Décorateurs, Singleton, Repository, Factory', level: 'Bonus TS', stars: '★★★★★', id: 27 },
  { emoji: '⚙️', title: 'TypeScript — Config', desc: 'tsconfig, strict mode, Vite, ESLint, .d.ts', level: 'Bonus TS', stars: '★★★☆☆', id: 28 },
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
              <div className="module-chapters">{m.level} · {m.stars}</div>
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
