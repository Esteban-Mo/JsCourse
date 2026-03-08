import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch24() {
  return (
    <>
      <div className="chapter-tag">Avancé</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-advanced">📤</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★☆</div>
          <h3>Modules ES</h3>
          <p>import/export, imports dynamiques, tree-shaking et organisation du code</p>
        </div>
      </div>

      <h2>L'histoire des modules — pourquoi ça a mis si longtemps</h2>
      <p>
        Aujourd'hui, diviser son code en fichiers avec <code>import</code> et <code>export</code>{' '}
        semble évident. Mais JavaScript a existé pendant des années <em>sans</em> système de
        modules natif. Tout le code d'une page web s'exécutait dans un seul espace global —
        et les variables de bibliothèques différentes se marchaient dessus.
      </p>
      <p>
        Les développeurs ont d'abord inventé le pattern <strong>IIFE</strong> (Immediately Invoked
        Function Expression) pour créer de l'isolation. Puis Node.js a introduit{' '}
        <strong>CommonJS</strong> en 2009 avec <code>require()</code>. Le format <strong>AMD</strong>{' '}
        (Asynchronous Module Definition) a tenté de résoudre le chargement asynchrone dans le
        navigateur. Il a fallu attendre <strong>ES2015 (ES6)</strong> pour avoir enfin un système
        de modules standardisé et natif : les <strong>ES Modules (ESM)</strong>.
      </p>
      <CodeBlock language="javascript">{`// ❌ L'ancienne époque : tout est global, les collisions sont inévitables
var utils = { format: function() {} };    // jQuery, Lodash, ton code... tout dans window

// Pattern IIFE — isolation manuelle via une fonction auto-exécutée
var MonModule = (function() {
  var _privé = 'secret'; // non accessible dehors
  return {
    getPrivé: function() { return _privé; }
  };
})();

// CommonJS (Node.js, 2009) — synchrone
const path = require('path');
module.exports = { maFonction };

// ES Modules (2015) — le standard actuel
import { maFonction } from './utils.js';
export const maConstante = 42;`}</CodeBlock>

      <InfoBox type="tip">
        <strong>La portée du module (module scope).</strong> Dans un ES Module, les variables
        déclarées au niveau supérieur <em>ne sont PAS globales</em>. Elles sont privées au module.
        C'est le comportement inverse des anciens scripts. Pour partager quelque chose, tu dois
        explicitement l'exporter. Cette isolation est la grande victoire des modules.
      </InfoBox>

      <h2>Export nommé vs export par défaut</h2>
      <p>
        Il existe deux façons d'exporter depuis un module, et le choix entre elles a des
        implications sur la lisibilité, le refactoring et les performances (tree-shaking).
        Comprendre la différence est essentiel pour organiser une grande base de code.
      </p>
      <p>
        Les <strong>exports nommés</strong> sont explicites : l'importeur doit utiliser le nom
        exact. Si tu renommes la fonction exportée, le compilateur TypeScript (ou ESLint) te
        signale immédiatement toutes les utilisations cassées — c'est le comportement le plus
        sûr. Les <strong>exports par défaut</strong> laissent l'importeur choisir n'importe quel
        nom, ce qui est pratique pour les composants React ou les classes principales, mais
        rend le refactoring plus difficile.
      </p>
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
        Convention dans les grandes bases de code : préférez les <strong>exports nommés</strong>.
        Ils permettent l'auto-complétion de l'IDE, facilitent le refactoring automatique, et sont
        mieux supportés par le tree-shaking. L'export par défaut est courant pour les composants
        React (un fichier = un composant = un export par défaut) ou les classes principales d'une
        bibliothèque.
      </InfoBox>

      <h2>Re-exports et barrel files</h2>
      <p>
        Imagine un projet avec des dizaines de fonctions utilitaires réparties dans une dizaine de
        fichiers. Sans organisation, chaque composant de l'app devrait écrire des imports comme{' '}
        <code>import {'{'} formatDate {'}'} from '../../utils/formatters.js'</code> et{' '}
        <code>import {'{'} isEmail {'}'} from '../../utils/validators.js'</code>. Fastidieux et
        fragile.
      </p>
      <p>
        Le pattern <strong>barrel file</strong> résout ça : un fichier <code>index.js</code> dans
        le dossier qui ré-exporte tout ce que le dossier expose publiquement. Les consommateurs
        importent depuis un seul endroit. Si tu déplaces une fonction d'un sous-fichier à un autre,
        seul le barrel change — les imports des consommateurs restent intacts.
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

      <InfoBox type="warning">
        <strong>Attention aux imports circulaires.</strong> Si <code>A.js</code> importe depuis{' '}
        <code>B.js</code>, et <code>B.js</code> importe depuis <code>A.js</code>, tu as une
        dépendance circulaire. JavaScript gère ça en partie (il ne plante pas), mais les valeurs
        peuvent être <code>undefined</code> au moment de l'évaluation initiale. Les barrel files
        augmentent ce risque si on n'est pas vigilant. Solution : dessine le graphe de dépendances
        de ton projet — si tu vois des cycles, restructure le code pour les éliminer.
      </InfoBox>

      <h2>Imports dynamiques — import()</h2>
      <p>
        Les imports statiques (<code>import ... from ...</code>) en haut d'un fichier sont résolus{' '}
        <em>avant</em> l'exécution du code. Le bundler les embarque tous dans le bundle initial.
        C'est parfait pour le code toujours nécessaire, mais pénalisant pour le reste : pourquoi
        charger une librairie de graphiques si l'utilisateur n'a pas encore cliqué sur le bouton
        "Afficher le graphique" ?
      </p>
      <p>
        <code>import()</code> est une fonction asynchrone qui charge un module <strong>à la
        demande</strong>. Le bundler (Vite, Webpack) crée un fichier JavaScript séparé (un "chunk")
        qui n'est téléchargé que quand <code>import()</code> est appelé. C'est ce qu'on appelle
        le <strong>code splitting</strong> — diviser le bundle en morceaux chargés selon les
        besoins.
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

      <p>
        Remarque que <code>import()</code> retourne une <strong>Promise</strong> qui se résout
        vers l'objet module complet. L'export par défaut est accessible via <code>.default</code>,
        et les exports nommés via leur nom directement (destructuration). C'est pourquoi on voit
        souvent <code>const {'{'} Chart {'}'} = await import(...)</code> pour les exports nommés,
        et <code>const module = await import(...); module.default</code> pour le défaut.
      </p>

      <h2>import.meta — métadonnées du module</h2>
      <p>
        <code>import.meta</code> est un objet spécial qui expose des{' '}
        <strong>informations sur le module courant lui-même</strong> — pas le code qu'il contient,
        mais le fichier : son URL, son environnement d'exécution. C'est l'équivalent ESM de
        <code>__filename</code> et <code>__dirname</code> en CommonJS. La propriété{' '}
        <code>import.meta.url</code> est standard, mais les bundlers comme Vite y ajoutent leurs
        propres propriétés.
      </p>
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

      <h2>ESM vs CommonJS — pourquoi la différence est profonde</h2>
      <p>
        La différence entre <code>require()</code> et <code>import</code> n'est pas seulement
        syntaxique — elle est <strong>architecturale</strong>. <code>require()</code> est
        synchrone : quand Node.js rencontre un <code>require()</code>, il <em>bloque</em> l'exécution
        jusqu'à ce que le fichier soit lu et évalué. C'est simple et prévisible, mais ça veut
        dire qu'on ne peut pas faire d'<code>await</code> au top-level d'un module CJS.
      </p>
      <p>
        Les imports ESM sont <strong>statiques</strong> : le moteur JS analyse tous les imports
        avant l'exécution, construit un graphe de dépendances complet, puis charge les modules en
        parallèle si possible. C'est plus complexe, mais ça permet le top-level await, le
        tree-shaking, et le chargement parallèle. C'est aussi pourquoi tu ne peux pas mettre{' '}
        <code>import</code> à l'intérieur d'un <code>if</code> ou d'une fonction — sa position
        doit être connue statiquement.
      </p>
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

      <InfoBox type="tip">
        <strong>.mjs vs .js et "type": "module".</strong> Par défaut, Node.js traite les fichiers
        <code>.js</code> comme CommonJS. Pour utiliser ESM, deux options : nommer le fichier{' '}
        <code>.mjs</code> (ES Module explicite), ou ajouter <code>"type": "module"</code> dans
        <code>package.json</code> (tous les <code>.js</code> deviennent ESM). Vite gère ça
        automatiquement pour le navigateur, mais comprendre la distinction est important pour les
        scripts Node.js et les bibliothèques.
      </InfoBox>

      <h2>Tree-shaking — comment les bundlers éliminent le code mort</h2>
      <p>
        Imagine une bibliothèque avec 200 fonctions utilitaires. Tu n'en utilises que 3. Sans
        tree-shaking, les 200 fonctions seraient embarquées dans ton bundle — 197 fonctions qui
        chargent inutilement dans le navigateur de l'utilisateur. Le tree-shaking élimine le{' '}
        <strong>code mort</strong> (dead code) : le code exporté mais jamais importé nulle part.
      </p>
      <p>
        Le tree-shaking n'est possible qu'avec ESM parce que les imports ESM sont{' '}
        <strong>statiques et analysables</strong> : le bundler peut lire le code <em>sans
        l'exécuter</em> et déterminer exactement quels exports sont utilisés. Avec{' '}
        <code>require()</code>, les imports peuvent être dynamiques (une variable dans le chemin,
        une condition…), donc le bundler ne peut pas savoir à l'avance ce qui sera chargé.
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

      <p>
        Un <strong>side effect</strong> est du code qui s'exécute au moment de l'import et qui
        modifie quelque chose en dehors du module (ajouter un écouteur global, modifier{' '}
        <code>window</code>, enregistrer un plugin…). Les bundlers sont conservateurs : si un
        module a des side effects potentiels, ils le gardent dans le bundle même si aucun export
        n'est utilisé. Déclarer <code>"sideEffects": false</code> dans <code>package.json</code>{' '}
        dit au bundler que tes modules sont "purs" et peuvent être éliminés librement.
      </p>

      <InfoBox type="warning">
        <strong>Les exports par défaut et le tree-shaking.</strong> Un export par défaut exporte
        un seul objet. Si cet objet est une classe ou un objet littéral avec plusieurs méthodes,
        le bundler ne peut pas tree-shaker les méthodes individuelles — il prend ou laisse
        l'objet entier. C'est l'une des raisons pour lesquelles les bibliothèques modernes
        préfèrent les exports nommés granulaires plutôt qu'un seul objet exporté par défaut.
      </InfoBox>

      <Challenge title="Défi personnel à réaliser : Refactoring avec modules">
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
  id: 15,
  title: 'Modules ES',
  icon: '📤',
  level: 'Avancé',
  stars: '★★★★☆',
  component: Ch24,
  quiz: [
    {
      question: 'Combien d\'exports par défaut peut avoir un module ?',
      sub: 'default export vs named exports.',
      options: ['Autant que voulu', 'Zéro', 'Un seul', 'Deux maximum'],
      correct: 2,
      explanation: '✅ Exact ! Un module ne peut avoir qu\'un seul export par défaut (export default), mais peut avoir autant d\'exports nommés que nécessaire. Tenter deux export default dans le même fichier est une erreur de syntaxe.',
    },
    {
      question: 'Quelle syntaxe permet de charger un module seulement si nécessaire ?',
      sub: 'Code splitting et lazy loading.',
      options: ['import lazy()', 'require()', 'import()', 'import * as'],
      correct: 2,
      explanation: '✅ Exact ! import() est une fonction asynchrone qui retourne une Promise et charge dynamiquement un module à la demande. Le bundler crée un fichier chunk séparé qui n\'est téléchargé que quand import() est appelé — c\'est le principe du code splitting.',
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
      explanation: '💡 Les imports ESM sont statiques : leur position est connue avant l\'exécution, le bundler peut donc analyser le graphe de dépendances complet sans exécuter le code. require() de CJS est dynamique (peut être dans un if, recevoir une variable…), rendant l\'analyse statique impossible.',
    },
    {
      question: 'Quelle syntaxe permet de ré-exporter un export nommé depuis un autre module dans un barrel file ?',
      sub: 'Re-export et barrel files.',
      options: [
        'import { formatDate } from "./formatters.js"; module.exports = { formatDate };',
        'export { formatDate } from "./formatters.js";',
        'export import { formatDate } from "./formatters.js";',
        're-export { formatDate } from "./formatters.js";',
      ],
      correct: 1,
      explanation: '✅ Exact ! La syntaxe export { nom } from "module" est une ré-exportation directe — elle importe ET exporte en une seule instruction, sans que la valeur soit disponible localement dans le fichier barrel. C\'est la base des barrel files (fichiers index.js qui regroupent et ré-exportent les exports publics d\'un dossier).',
    },
    {
      question: 'Que se passe-t-il quand deux modules s\'importent mutuellement (import circulaire) ?',
      sub: 'Dépendances circulaires dans les ES Modules.',
      options: [
        'JavaScript lève une erreur et refuse de charger les modules',
        'Les modules se chargent normalement sans aucun problème',
        'JavaScript gère partiellement la situation : certaines valeurs peuvent être undefined lors de l\'évaluation initiale',
        'Seul le premier module est chargé, le second est ignoré',
      ],
      correct: 2,
      explanation: '💡 JavaScript ne plante pas sur les imports circulaires, mais le résultat peut être surprenant : quand A importe de B qui importe de A, JavaScript retourne une version "incomplète" de A à B (les exports déclarés mais pas encore évalués sont undefined). Cela cause souvent des bugs difficiles à tracer. La solution est de restructurer le code pour éliminer les cycles de dépendances.',
    },
    {
      question: 'Que contient import.meta.url dans un ES Module chargé dans le navigateur ?',
      sub: 'import.meta expose les métadonnées du module courant.',
      options: [
        'Le nom du fichier sans chemin (ex: "math.js")',
        'Le chemin relatif depuis la racine du projet',
        'L\'URL complète du module courant (ex: "https://example.com/src/utils/math.js")',
        'undefined — import.meta.url n\'est disponible que dans Node.js',
      ],
      correct: 2,
      explanation: '✅ Exact ! import.meta.url contient l\'URL absolue complète du module en cours d\'exécution — c\'est l\'équivalent ESM de __filename en CommonJS (mais en URL, pas en chemin système). Dans le navigateur : "https://example.com/src/utils/math.js". Dans Node.js : "file:///projet/src/utils/math.js". Vite y ajoute ses propres propriétés comme import.meta.env pour les variables d\'environnement.',
    },
    {
      question: 'Les ES Modules sont-ils en mode strict par défaut ?',
      sub: 'Mode strict et portée des modules.',
      options: [
        'Non, il faut ajouter "use strict" explicitement',
        'Oui, tous les ES Modules sont automatiquement en mode strict',
        'Seulement si le fichier s\'appelle .mjs',
        'Seulement avec TypeScript',
      ],
      correct: 1,
      explanation: '✅ Exact ! Tous les ES Modules sont automatiquement en mode strict ("use strict") — il est inutile et redondant de l\'écrire. Le mode strict désactive les comportements historiquement problématiques : pas de variables non déclarées, this vaut undefined (pas window) dans les fonctions ordinaires, certaines syntaxes réservées sont interdites. C\'est l\'une des caractéristiques fondamentales qui distinguent ESM des anciens scripts.',
    },
    {
      question: 'Quelle condition rend une fonction ou variable éligible au tree-shaking par un bundler ?',
      sub: 'Tree-shaking et code mort.',
      options: [
        'La fonction doit être exportée avec export default',
        'La fonction doit être déclarée avec const (pas function)',
        'La fonction est exportée mais jamais importée ailleurs dans le projet',
        'La fonction doit avoir moins de 10 lignes de code',
      ],
      correct: 2,
      explanation: '✅ Exact ! Le tree-shaking élimine le "code mort" : les exports qui ne sont jamais importés dans tout le projet. Si math.js exporte additionner() et multiplier(), mais que seul additionner() est importé quelque part, multiplier() sera éliminé du bundle final. Condition supplémentaire : le module ne doit pas avoir de "side effects" (ou déclarer "sideEffects": false dans package.json) — sinon le bundler l\'inclut par sécurité.',
    },
  ],
};
