import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeChallengeMonorepo = `// tsconfig.base.json — partagé par tous les packages
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true
  }
}

// packages/frontend/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM"],
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}

// packages/backend/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "module": "CommonJS",
    "outDir": "./dist"
  },
  "include": ["src"]
}`;

const codeChallengeDts = `// Supposons une lib JS : lib-calcul.js
// function calculer(op, a, b) { ... }
// function arrondir(n, decimales) { ... }
// const PRECISION = 2;

// À écrire : lib-calcul.d.ts
declare module "lib-calcul" {
  type Operation = "add" | "sub" | "mul" | "div";

  export function calculer(op: Operation, a: number, b: number): number;
  export function arrondir(n: number, decimales?: number): number;
  export const PRECISION: number;
}

// Étendre les types globaux
declare global {
  interface Window {
    debugMode: boolean;
    appVersion: string;
  }

  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: "development" | "production" | "test";
      readonly DATABASE_URL: string;
      readonly API_KEY?: string;
    }
  }
}

export {};  // Nécessaire pour que ce soit un module`;

const codeTsConfig = `{
  "compilerOptions": {

    // ─── CIBLE & MODULE ──────────────────────────────
    "target": "ES2022",           // vers quel JS compiler (ES5, ES6, ESNext…)
    "module": "ESNext",           // système de modules (CommonJS, ESNext, Node16)
    "moduleResolution": "bundler", // comment résoudre les imports
    "lib": ["ES2022", "DOM"],     // bibliothèques disponibles (DOM = window, fetch…)

    // ─── SÉCURITÉ (activer tout ça !) ────────────────
    "strict": true,                // active TOUS les checks stricts ci-dessous :
    "noImplicitAny": true,         // interdit les any implicites
    "strictNullChecks": true,      // null/undefined doivent être gérés explicitement
    "noUncheckedIndexedAccess": true, // arr[0] peut être undefined
    "exactOptionalPropertyTypes": true, // prop?: string ≠ prop: string|undefined

    // ─── QUALITÉ DU CODE ─────────────────────────────
    "noUnusedLocals": true,        // erreur si variable locale inutilisée
    "noUnusedParameters": true,    // erreur si paramètre inutilisé
    "noImplicitReturns": true,     // toutes les branches doivent retourner
    "noFallthroughCasesInSwitch": true, // pas de case sans break/return

    // ─── CHEMINS & SORTIES ───────────────────────────
    "rootDir": "./src",            // dossier source
    "outDir": "./dist",            // dossier de sortie
    "sourceMap": true,             // génère .map pour le debugging
    "declaration": true,           // génère les fichiers .d.ts

    // ─── ALIAS DE CHEMINS ────────────────────────────
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],          // import depuis '@/utils' au lieu de '../../utils'
      "@components/*": ["./src/components/*"]
    }
  },
  "include": ["src/**/*"],        // fichiers à compiler
  "exclude": ["node_modules", "dist"]
}`;

const codeStrictMode = `// Sans strict : TS accepte tout ça
function greet(name) {                  // any implicite — dangereux
  return name.toUpperCase();
}
greet(null);                           // crash à l'exécution !

// Avec strict : TS interdit ça
function greet(name: string): string { // types obligatoires
  return name.toUpperCase();
}
// greet(null); ❌ Argument of type 'null' is not assignable to 'string'

// strictNullChecks en pratique
function trouverUser(id: number): User | null { return null; }

const user = trouverUser(1);
// user.nom ❌ Object is possibly 'null'
user?.nom;          // ✅ optional chaining
user!.nom;          // ✅ non-null assertion (si tu es CERTAIN qu'il existe)
if (user) user.nom; // ✅ type guard classique`;

const codeDts = `// monModule.d.ts — décrit une lib JS externe
declare module "ma-lib-js" {
  export function calculer(a: number, b: number): number;
  export const VERSION: string;
}

// global.d.ts — étendre les types globaux
declare global {
  interface Window {
    monAnalytics: { track(event: string): void };
  }
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      API_KEY: string;
    }
  }
}

// Installer les types d'une lib populaire
// npm install -D @types/lodash @types/node @types/react`;

const codeVite = `# Créer un projet Vite + TypeScript
npm create vite@latest mon-projet -- --template vanilla-ts

# Structure générée :
# ├── src/
# │   ├── main.ts
# │   └── vite-env.d.ts
# ├── tsconfig.json
# └── vite.config.ts

# Scripts utiles dans package.json :
# "dev"   : "vite"              → serveur de dev rapide
# "build" : "tsc && vite build" → vérif types + build
# "check" : "tsc --noEmit"      → vérifie les types sans compiler`;

const codeEslintInstall = `# Installation
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`;

const codeEslintConfig = `// eslint.config.js (flat config — ESLint 9+)
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: { parser: tsparser },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/no-floating-promises": "error", // oubli d'await !
    }
  }
];`;

function Ch20TsConfig() {
  return (
    <>
      <div className="chapter-tag">Chapitre 20 · Configuration &amp; Écosystème</div>
      <h1>TypeScript<br /><span className="highlight">Config &amp; Écosystème</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-typescript">⚙️</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★☆☆</div>
          <h3>tsconfig.json, strict mode, paths, .d.ts, Vite, ESLint</h3>
          <p>Durée estimée : 40 min · 2 quizz inclus</p>
        </div>
      </div>

      <p>Comprendre TypeScript c'est bien, savoir le <strong>configurer et l'intégrer</strong> dans un vrai projet c'est encore mieux. Le fichier <code>tsconfig.json</code> est le cerveau de ton projet TS — il dit au compilateur quoi vérifier, comment compiler, et où trouver les fichiers.</p>

      <h2>tsconfig.json — anatomie complète</h2>

      <p>Créé avec <code>npx tsc --init</code>, ce fichier JSON contrôle tout le comportement du compilateur TypeScript.</p>

      <CodeBlock language="json">{codeTsConfig}</CodeBlock>

      <InfoBox type="tip">
        Pour les <strong>monorepos</strong> (plusieurs packages dans un dépôt), crée un <code>tsconfig.base.json</code> à la racine avec les options communes, puis chaque package étend avec <code>"extends": "../../tsconfig.base.json"</code>. Cela évite la duplication et garantit la cohérence des paramètres dans tout le projet.
      </InfoBox>

      <h2>Le mode strict — pourquoi l'activer ?</h2>

      <p>Le mode strict est le paramètre le plus important. Il active plusieurs vérifications qui semblent contraignantes au début mais <strong>éliminent des classes entières de bugs</strong>.</p>

      <CodeBlock language="typescript">{codeStrictMode}</CodeBlock>

      <InfoBox type="warning">
        Si tu migres un <strong>projet JavaScript existant</strong> vers TypeScript, n'active pas <code>strict: true</code> d'un coup — tu te retrouveras avec des centaines d'erreurs. Active les flags un par un : commence par <code>noImplicitAny</code>, puis <code>strictNullChecks</code>, etc. La migration progressive est la clé d'une adoption réussie.
      </InfoBox>

      <h2>Fichiers de déclaration .d.ts</h2>

      <p>Les fichiers <code>.d.ts</code> sont des <strong>descriptions de types</strong> sans implémentation. Ils permettent à TypeScript de connaître les types d'une bibliothèque JavaScript existante — sans que la lib ait été écrite en TS.</p>

      <CodeBlock language="typescript">{codeDts}</CodeBlock>

      <InfoBox type="tip">
        Avant d'écrire un fichier <code>.d.ts</code>, vérifie si les types existent déjà sur <strong>DefinitelyTyped</strong> : <code>npm install -D @types/nom-du-package</code>. Plus de 8 000 bibliothèques populaires ont des types maintenus par la communauté. Si les types n'existent pas, crée un fichier <code>declarations.d.ts</code> dans ton projet.
      </InfoBox>

      <h2>TypeScript avec Vite (setup moderne)</h2>

      <p>Vite est le bundler le plus rapide aujourd'hui. Il supporte TypeScript nativement — mais il utilise <strong>esbuild</strong> pour compiler (très rapide) sans vérifier les types. Pour les types, lance <code>tsc --noEmit</code> séparément.</p>

      <CodeBlock language="bash">{codeVite}</CodeBlock>

      <InfoBox type="success">
        Dans ta CI/CD, ajoute toujours <code>tsc --noEmit</code> comme étape de validation avant le build. Cela garantit que chaque déploiement passe la vérification des types, même si Vite compile sans les vérifier. Un pipeline typique : <code>tsc --noEmit &amp;&amp; eslint . &amp;&amp; vite build</code>.
      </InfoBox>

      <h2>ESLint + TypeScript — la qualité automatique</h2>

      <p>ESLint analyse ton code et signale les problèmes de style et de logique. Avec le plugin TypeScript, il peut utiliser les informations de types pour détecter des bugs encore plus subtils.</p>

      <CodeBlock language="bash">{codeEslintInstall}</CodeBlock>

      <CodeBlock language="javascript">{codeEslintConfig}</CodeBlock>

      <InfoBox type="success">
        <strong>Stack recommandée en 2025 :</strong> <code>Vite</code> (bundler) + <code>TypeScript</code> strict + <code>ESLint</code> + <code>Prettier</code> (formatage) + <code>Vitest</code> (tests). C'est la base de la quasi-totalité des projets modernes — React, Vue, Svelte, Node.js.
      </InfoBox>

      <Challenge title="Défi : Configuration monorepo TypeScript">
        <p>Crée une configuration TypeScript pour un monorepo avec un <code>tsconfig.base.json</code> commun et deux packages — <code>frontend</code> (Vite + React, DOM) et <code>backend</code> (Node.js, CommonJS). Chaque package étend la config de base et surcharge uniquement ce dont il a besoin.</p>
        <CodeBlock language="json">{codeChallengeMonorepo}</CodeBlock>
      </Challenge>

      <Challenge title="Défi : Écrire un fichier .d.ts pour une lib JS">
        <p>Crée un fichier de déclaration <code>.d.ts</code> pour une bibliothèque JS existante (<code>lib-calcul.js</code>) avec des types précis. Étend aussi les types globaux <code>Window</code> et <code>NodeJS.ProcessEnv</code> pour un projet full-stack.</p>
        <CodeBlock language="typescript">{codeChallengeDts}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 20,
  title: 'TypeScript — Config & Éco',
  icon: '⚙️',
  level: 'Bonus TS',
  stars: '★★★☆☆',
  component: Ch20TsConfig,
  quiz: [
    {
      question: "Que fait exactement 'tsc --noEmit' ?",
      sub: "Compilation TypeScript",
      options: [
        "Compile mais sans optimiser le code",
        "Vérifie les types sans générer de fichiers JS — parfait pour la CI",
        "Supprime les fichiers .js existants",
        "Désactive la vérification des types nuls"
      ],
      correct: 1,
      explanation: "✅ Exact ! --noEmit demande à tsc de faire toute la vérification de types mais sans écrire un seul fichier. C'est idéal dans les scripts CI/CD ou en pre-commit hook pour s'assurer que le code est correct sans polluer le dossier dist."
    },
    {
      question: "Pourquoi Vite n'utilise pas tsc pour compiler en développement ?",
      sub: "Écosystème TypeScript moderne",
      options: [
        "Vite ne supporte pas TypeScript",
        "tsc est trop lent — Vite utilise esbuild (Go) qui compile sans vérifier les types, 100x plus rapide",
        "tsc génère du code incompatible avec les navigateurs",
        "C'est un choix politique de Vite"
      ],
      correct: 1,
      explanation: "✅ Parfait ! esbuild est écrit en Go et strip simplement les annotations TypeScript sans les vérifier — ce qui le rend 10 à 100x plus rapide que tsc. En dev, la vitesse prime. Pour la rigueur, tsc --noEmit tourne en parallèle ou avant le build."
    },
    {
      question: "Quelle est la différence entre l'option `target` et l'option `lib` dans tsconfig.json ?",
      sub: "Options target et lib",
      options: [
        "target et lib contrôlent tous les deux la version de JavaScript générée",
        "target définit la version JS compilée en sortie ; lib déclare quelles APIs sont disponibles dans l'environnement d'exécution",
        "lib définit la version JS compilée ; target déclare les APIs disponibles",
        "target s'applique aux modules, lib aux classes"
      ],
      correct: 1,
      explanation: "✅ Exact ! `target: 'ES2022'` dit à tsc de générer du JavaScript compatible ES2022 (syntaxe des classes, optional chaining natif, etc.). `lib: ['ES2022', 'DOM']` dit à TypeScript quelles APIs existent à l'exécution — sans 'DOM', il ne connaît pas window, fetch ou document. Les deux peuvent être combinés indépendamment."
    },
    {
      question: "À quoi servent les options `baseUrl` et `paths` dans tsconfig.json ?",
      sub: "Alias de chemins d'importation",
      options: [
        "baseUrl définit le dossier de sortie, paths les fichiers à inclure",
        "Elles permettent de créer des alias d'importation pour éviter les chemins relatifs profonds comme '../../../../utils'",
        "baseUrl définit l'URL du serveur de développement",
        "paths remplace node_modules pour la résolution des modules"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Avec `baseUrl: '.'` et `paths: { '@/*': ['./src/*'] }`, tu peux écrire `import { utils } from '@/utils'` au lieu de `import { utils } from '../../../utils'`. Cela rend les imports plus lisibles et résistants aux restructurations de dossiers. Attention : le bundler (Vite, webpack) doit aussi être configuré pour résoudre ces alias."
    },
    {
      question: "Que fait l'option `strict: true` dans tsconfig.json ?",
      sub: "Mode strict TypeScript",
      options: [
        "Active uniquement strictNullChecks",
        "Active un ensemble de vérifications rigoureuses incluant noImplicitAny, strictNullChecks, strictFunctionTypes et d'autres",
        "Interdit l'utilisation du type any dans tout le projet",
        "Force tous les fichiers à utiliser 'use strict' JavaScript"
      ],
      correct: 1,
      explanation: "✅ Exact ! `strict: true` est un raccourci qui active plusieurs flags en même temps : noImplicitAny, strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitThis et alwaysStrict. C'est la configuration recommandée car elle élimine les catégories entières de bugs les plus courants."
    },
    {
      question: "Quel est le rôle d'un fichier `.d.ts` (fichier de déclaration) ?",
      sub: "Fichiers de déclaration TypeScript",
      options: [
        "Contenir du code TypeScript compilé prêt pour le navigateur",
        "Décrire les types d'un module JavaScript sans contenir d'implémentation — permettre à TS de typer des libs JS existantes",
        "Remplacer le fichier tsconfig.json pour la configuration",
        "Définir les variables d'environnement accessibles dans le projet"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Les fichiers .d.ts sont des 'stubs de types' purs : ils décrivent l'interface publique d'un module (fonctions, classes, constantes) sans aucune implémentation. C'est ce que contiennent les packages @types/xxx (lodash, node, react) — ils permettent à TypeScript de valider ton code contre des bibliothèques écrites en JavaScript."
    },
    {
      question: "Pourquoi utiliser `skipLibCheck: true` dans tsconfig.json et dans quel contexte est-ce recommandé ?",
      sub: "Option skipLibCheck",
      options: [
        "Pour ignorer les erreurs dans ton propre code — utile en développement rapide",
        "Pour ignorer les erreurs de types dans les fichiers .d.ts des dépendances — utile quand des libs tierces ont des types incompatibles",
        "Pour désactiver la vérification de lib complètement et accélérer la compilation",
        "Pour sauter la génération des fichiers .d.ts en sortie"
      ],
      correct: 1,
      explanation: "✅ Exact ! skipLibCheck: true dit à tsc d'ignorer les erreurs dans tous les fichiers .d.ts — notamment ceux de node_modules. C'est utile quand deux dépendances ont des versions de types incompatibles entre elles, ce qui est fréquent. Cela n'affecte pas la vérification de ton propre code. La plupart des projets modernes l'activent pour éviter des blocages sur des erreurs hors de leur contrôle."
    }
  ]
};
