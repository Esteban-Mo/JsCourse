import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch25() {
  return (
    <>
      <div className="chapter-tag">Avancé</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-advanced">🧪</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">⭐⭐⭐</div>
          <h3>Tests avec Vitest</h3>
          <p>Écrire des tests unitaires fiables avec Vitest, mocks et tests asynchrones</p>
        </div>
      </div>

      <h2>Pourquoi tester ?</h2>
      <p>
        Les tests automatisés permettent de <strong>détecter les régressions</strong> immédiatement,
        de <strong>documenter le comportement attendu</strong> du code, et de refactoriser
        en toute confiance. Un bon test décrit ce que fait le code, pas comment il le fait.
      </p>
      <InfoBox type="tip">
        Vitest est le testeur standard dans l'écosystème Vite. Il utilise la même config que Vite,
        supporte TypeScript nativement et est ~10× plus rapide que Jest grâce à esbuild.
      </InfoBox>

      <h2>Structure de base : describe / it / expect</h2>
      <CodeBlock language="javascript">{`// math.js
export function additionner(a, b) { return a + b; }
export function diviser(a, b) {
  if (b === 0) throw new Error('Division par zéro');
  return a / b;
}

// math.test.js
import { describe, it, expect } from 'vitest';
import { additionner, diviser } from './math.js';

describe('additionner', () => {
  it('additionne deux nombres positifs', () => {
    expect(additionner(2, 3)).toBe(5);
  });

  it('additionne des nombres négatifs', () => {
    expect(additionner(-1, -2)).toBe(-3);
  });

  it('additionne zéro', () => {
    expect(additionner(5, 0)).toBe(5);
  });
});

describe('diviser', () => {
  it('divise correctement', () => {
    expect(diviser(10, 2)).toBe(5);
  });

  it('lève une erreur pour une division par zéro', () => {
    expect(() => diviser(5, 0)).toThrow('Division par zéro');
  });
});`}</CodeBlock>

      <h2>Les matchers essentiels</h2>
      <CodeBlock language="javascript">{`// Égalité stricte (primitives)
expect(2 + 2).toBe(4);
expect('hello').toBe('hello');

// Égalité profonde (objets, tableaux)
expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });
expect([1, 2, 3]).toEqual([1, 2, 3]);

// Contenu partiel
expect({ a: 1, b: 2, c: 3 }).toMatchObject({ a: 1 });
expect(['a', 'b', 'c']).toContain('b');
expect('Bonjour monde').toContain('monde');

// Existence et type
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect(42).toBeDefined();
expect(true).toBeTruthy();
expect(0).toBeFalsy();

// Nombres
expect(3.14).toBeCloseTo(3.14159, 1); // précision
expect(10).toBeGreaterThan(5);
expect(3).toBeLessThanOrEqual(3);

// Tableaux et longueur
expect([1, 2, 3]).toHaveLength(3);

// Erreurs
expect(() => JSON.parse('invalid')).toThrow();
expect(() => JSON.parse('invalid')).toThrow(SyntaxError);

// Négation avec not
expect(null).not.toBe(undefined);
expect([]).not.toContain(1);`}</CodeBlock>

      <h2>Hooks : setup et teardown</h2>
      <CodeBlock language="javascript">{`import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

describe('Panier', () => {
  let panier;

  // Exécuté avant CHAQUE test du groupe
  beforeEach(() => {
    panier = { articles: [], total: 0 };
  });

  // Exécuté après CHAQUE test (nettoyage)
  afterEach(() => {
    // ex: vider un mock, fermer une connexion
  });

  // Exécuté UNE FOIS avant tous les tests (setup coûteux)
  beforeAll(async () => {
    await db.connect();
  });

  // Exécuté UNE FOIS après tous les tests
  afterAll(async () => {
    await db.disconnect();
  });

  it('est vide initialement', () => {
    expect(panier.articles).toHaveLength(0);
    expect(panier.total).toBe(0);
  });

  it('ajoute un article', () => {
    panier.articles.push({ nom: 'Livre', prix: 15 });
    expect(panier.articles).toHaveLength(1);
  });
});`}</CodeBlock>

      <h2>Mocks avec vi</h2>
      <p>
        Un mock remplace une dépendance par une version contrôlée pour isoler le code testé.
      </p>
      <CodeBlock language="javascript">{`import { vi, describe, it, expect } from 'vitest';

// Espionner une fonction (spy)
const maFn = vi.fn();
maFn(42);
expect(maFn).toHaveBeenCalledTimes(1);
expect(maFn).toHaveBeenCalledWith(42);

// Définir une valeur de retour
const fetchMock = vi.fn().mockResolvedValue({ data: [1, 2, 3] });
const résultat = await fetchMock();
expect(résultat.data).toEqual([1, 2, 3]);

// Mocker un module entier
vi.mock('./api.js', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, nom: 'Alice' }),
}));

// Mocker des fonctions globales
vi.spyOn(global, 'fetch').mockResolvedValue({
  ok: true,
  json: async () => ({ status: 'ok' }),
});

// Restaurer après le test
afterEach(() => {
  vi.restoreAllMocks();
});`}</CodeBlock>

      <h2>Tests asynchrones</h2>
      <CodeBlock language="javascript">{`import { describe, it, expect } from 'vitest';

// async/await — le plus lisible
it('charge les données utilisateur', async () => {
  const user = await fetchUser(1);
  expect(user.nom).toBe('Alice');
  expect(user.id).toBeGreaterThan(0);
});

// Tester une promesse rejetée
it('lève une erreur si l\'utilisateur est introuvable', async () => {
  await expect(fetchUser(999)).rejects.toThrow('Utilisateur non trouvé');
});

// Tester avec un timeout (Vitest attend par défaut 5s)
it('opération longue', async () => {
  const résultat = await opérationLente();
  expect(résultat).toBe('terminé');
}, 10000); // timeout personnalisé en ms

// Faux timers (éviter d'attendre vraiment)
import { vi } from 'vitest';

it('déclenche après un délai', () => {
  vi.useFakeTimers();
  const callback = vi.fn();
  setTimeout(callback, 1000);

  vi.advanceTimersByTime(1000);
  expect(callback).toHaveBeenCalledOnce();

  vi.useRealTimers();
});`}</CodeBlock>

      <h2>Configuration Vitest</h2>
      <CodeBlock language="javascript">{`// vite.config.js / vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Environnement : 'node' (défaut), 'jsdom' (DOM simulé), 'happy-dom'
    environment: 'jsdom',

    // Fichiers de test
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],

    // Coverage (npm run coverage)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: { lines: 80 },
    },

    // Globals (évite d'importer describe/it/expect)
    globals: true,
  },
});

// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",        // interface graphique
    "test:run": "vitest run",         // une seule exécution (CI)
    "coverage": "vitest run --coverage"
  }
}`}</CodeBlock>

      <Challenge title="Tester une fonction de validation">
        Écris les tests pour cette fonction de validation d'email :
        <CodeBlock language="javascript">{`// validator.js
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// validator.test.js — à compléter
import { describe, it, expect } from 'vitest';
import { isValidEmail } from './validator.js';

describe('isValidEmail', () => {
  // Tester les cas valides, invalides, et les cas limites
});`}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 25,
  title: 'Tests avec Vitest',
  icon: '🧪',
  level: 'Avancé',
  stars: '⭐⭐⭐',
  component: Ch25,
  quiz: [
    {
      question: 'Quelle est la différence entre toBe() et toEqual() ?',
      sub: 'Comparaison de valeurs en Vitest.',
      options: [
        'Aucune différence',
        'toBe() utilise === (référence), toEqual() compare en profondeur',
        'toEqual() est plus strict que toBe()',
        'toBe() fonctionne seulement pour les nombres'
      ],
      correct: 1,
      explanation: 'toBe() utilise === (identité), donc deux objets distincts avec le même contenu ne seront pas égaux. toEqual() compare la structure en profondeur.',
    },
    {
      question: 'Quel hook s\'exécute avant CHAQUE test dans un describe ?',
      sub: 'Setup et teardown en Vitest.',
      options: ['beforeAll()', 'beforeEach()', 'setup()', 'init()'],
      correct: 1,
      explanation: 'beforeEach() s\'exécute avant chaque test individuel. beforeAll() ne s\'exécute qu\'une fois avant tous les tests du groupe.',
    },
    {
      question: 'Comment tester qu\'une fonction async lève une erreur ?',
      sub: 'Assertions sur les promesses rejetées.',
      options: [
        'expect(fn()).toThrow()',
        'try/catch dans le test',
        'await expect(fn()).rejects.toThrow()',
        'expect(await fn()).toThrow()'
      ],
      correct: 2,
      explanation: 'Pour les fonctions async, il faut utiliser await expect(fn()).rejects.toThrow(). Sans await, la promesse ne serait pas résolue avant la fin du test.',
    },
  ],
};
