import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch24() {
  return (
    <>
      <div className="chapter-tag">Avancé</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-advanced">📤</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">⭐⭐⭐</div>
          <h3>Modules ES</h3>
          <p>import/export, imports dynamiques, tree-shaking et organisation du code</p>
        </div>
      </div>

      <h2>Export nommé vs export par défaut</h2>
      <CodeBlock language="javascript">{`// --- math.js ---

// Exports nommés (plusieurs par fichier)
export const PI = 3.14159;
export function additionner(a, b) { return a + b; }
export function multiplier(a, b) { return a * b; }

// Export par défaut (un seul par fichier)
export default class Calculatrice {
  résultat = 0;
  ajouter(n) { this.résultat += n; return this; }
  obtenir() { return this.résultat; }
}

// --- main.js ---

// Import nommé — les accolades sont obligatoires
import { PI, additionner, multiplier } from './math.js';

// Import avec alias
import { additionner as add, multiplier as mul } from './math.js';

// Import par défaut — nom libre, pas d'accolades
import Calculatrice from './math.js';
import MaCalc from './math.js'; // même export, nom différent

// Tout importer dans un namespace
import * as Math from './math.js';
Math.PI;          // 3.14159
Math.additionner(2, 3); // 5`}</CodeBlock>

      <InfoBox type="tip">
        Convention : les <strong>exports nommés</strong> sont préférés dans les grandes bases de code
        car ils permettent l'auto-complétion et le tree-shaking plus efficacement.
        L'export par défaut est courant pour les composants React ou les classes principales.
      </InfoBox>

      <h2>Re-exports et barrel files</h2>
      <p>
        Un <strong>barrel file</strong> (souvent <code>index.js</code>) regroupe et ré-exporte
        les exports d'un dossier pour simplifier les imports.
      </p>
      <CodeBlock language="javascript">{`// --- utils/formatters.js ---
export function formatDate(d) { return d.toLocaleDateString('fr-FR'); }
export function formatPrice(n) { return n.toFixed(2) + ' €'; }

// --- utils/validators.js ---
export function isEmail(s) { return /^[^@]+@[^@]+\.[^@]+$/.test(s); }
export function isPhone(s) { return /^0[1-9]\d{8}$/.test(s); }

// --- utils/index.js (barrel) ---
export { formatDate, formatPrice } from './formatters.js';
export { isEmail, isPhone } from './validators.js';
// Ou tout réexporter :
// export * from './formatters.js';
// export * from './validators.js';

// --- composant.js ---
// Import propre depuis un seul endroit
import { formatDate, isEmail } from './utils/index.js';
// Ou même depuis le dossier (Node résout index.js automatiquement)
import { formatDate, isEmail } from './utils';`}</CodeBlock>

      <h2>Imports dynamiques — import()</h2>
      <p>
        <code>import()</code> est une fonction asynchrone qui charge un module
        <strong> à la demande</strong>, sans l'embarquer dans le bundle initial.
        Indispensable pour le <em>code splitting</em>.
      </p>
      <CodeBlock language="javascript">{`// Import statique (chargé au démarrage)
import { parse } from './lourde-librairie.js';

// Import dynamique (chargé seulement quand nécessaire)
async function chargerParser() {
  const { parse } = await import('./lourde-librairie.js');
  return parse;
}

// Cas pratique : charger selon une action utilisateur
button.addEventListener('click', async () => {
  const { Chart } = await import('./chart.js');
  new Chart('#canvas', données);
});

// Chargement conditionnel
async function getModule(lang) {
  const module = await import(\`./locales/\${lang}.js\`);
  return module.default; // les modules dynamiques exposent .default
}

// En React (avec React.lazy)
import { lazy, Suspense } from 'react';
const GrosComposant = lazy(() => import('./GrosComposant.jsx'));
// → Vite/webpack crée un chunk séparé`}</CodeBlock>

      <h2>import.meta — métadonnées du module</h2>
      <CodeBlock language="javascript">{`// URL du module courant
console.log(import.meta.url);
// 'file:///projet/src/utils/math.js' (ou URL HTTP en navigateur)

// Dans Vite : variables d'environnement
import.meta.env.MODE;          // 'development' ou 'production'
import.meta.env.VITE_API_URL;  // variable définie dans .env
import.meta.env.DEV;           // true en développement
import.meta.env.PROD;          // true en production

// Dans Vite : glob imports (importer plusieurs fichiers)
const modules = import.meta.glob('./chapters/*.js');
// { './chapters/ch01.js': () => import('./chapters/ch01.js'), ... }

// Charger tous les modules d'un coup
const modules = import.meta.glob('./chapters/*.js', { eager: true });`}</CodeBlock>

      <h2>ESM vs CommonJS</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>Aspect</th><th>ESM (ES Modules)</th><th>CommonJS (CJS)</th></tr>
          </thead>
          <tbody>
            <tr><td>Syntaxe</td><td><code>import / export</code></td><td><code>require / module.exports</code></td></tr>
            <tr><td>Chargement</td><td>Statique + dynamique</td><td>Synchrone uniquement</td></tr>
            <tr><td>Tree-shaking</td><td>✅ Possible</td><td>❌ Difficile</td></tr>
            <tr><td>Top-level await</td><td>✅ Supporté</td><td>❌ Non</td></tr>
            <tr><td>Navigateur natif</td><td>✅ Oui</td><td>❌ Non</td></tr>
            <tr><td>Environnement</td><td>Navigateur + Node.js</td><td>Node.js principalement</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Tree-shaking</h2>
      <p>
        Le tree-shaking est l'élimination automatique du code mort par le bundler (Vite, Webpack).
        Il ne fonctionne qu'avec les <strong>exports nommés ESM</strong>.
      </p>
      <CodeBlock language="javascript">{`// ✅ Tree-shakeable : seul additionner sera inclus dans le bundle
import { additionner } from './math.js'; // multiplier est éliminé

// ❌ Pas tree-shakeable : tout est importé
const math = require('./math.js');
math.additionner(1, 2);

// ❌ Import * empêche le tree-shaking
import * as math from './math.js';
math.additionner(1, 2);

// Bonnes pratiques pour les libs :
// - Éviter les "side effects" dans les modules
// - Déclarer "sideEffects": false dans package.json
// - Préférer des exports granulaires plutôt qu'un seul gros objet`}</CodeBlock>

      <Challenge title="Refactoring avec modules">
        Refactorise ce code en 3 fichiers modulaires : <code>validators.js</code>,
        <code>formatters.js</code>, et <code>index.js</code> (barrel).
        <CodeBlock language="javascript">{`// monolithe.js — à séparer
function isEmail(s) { return /@/.test(s); }
function isPhone(s) { return /^\d{10}$/.test(s); }
function formatName(n) { return n.trim().toLowerCase(); }
function formatCurrency(n) { return n.toFixed(2) + '€'; }

export { isEmail, isPhone, formatName, formatCurrency };`}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 24,
  title: 'Modules ES',
  icon: '📤',
  level: 'Avancé',
  stars: '⭐⭐⭐',
  component: Ch24,
  quiz: [
    {
      question: 'Combien d\'exports par défaut peut avoir un module ?',
      sub: 'default export vs named exports.',
      options: ['Autant que voulu', 'Zéro', 'Un seul', 'Deux maximum'],
      correct: 2,
      explanation: 'Un module ne peut avoir qu\'un seul export par défaut (export default), mais peut avoir autant d\'exports nommés que nécessaire.',
    },
    {
      question: 'Quelle syntaxe permet de charger un module seulement si nécessaire ?',
      sub: 'Code splitting et lazy loading.',
      options: ['import lazy()', 'require()', 'import()', 'import * as'],
      correct: 2,
      explanation: 'import() est une fonction asynchrone qui charge dynamiquement un module à la demande, permettant le code splitting.',
    },
    {
      question: 'Pourquoi le tree-shaking fonctionne avec ESM mais pas avec CommonJS ?',
      sub: 'Analyse statique des imports.',
      options: [
        'ESM est plus récent',
        'ESM permet l\'analyse statique des imports à la compilation',
        'CommonJS est plus lent',
        'ESM supporte TypeScript'
      ],
      correct: 1,
      explanation: 'Les imports ESM sont statiques (analysables sans exécuter le code), ce qui permet au bundler d\'éliminer les exports non utilisés. CJS utilise require() qui est dynamique.',
    },
  ],
};
