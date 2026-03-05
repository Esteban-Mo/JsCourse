import { CodeBlock, InfoBox } from '../components/content';
import type { Chapter } from '../types';

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
          <div className="difficulty-stars">★★★★★</div>
          <h3>tsconfig.json, strict mode, paths, .d.ts, Vite, ESLint</h3>
          <p>Durée estimée : 40 min · 2 quizz inclus</p>
        </div>
      </div>

      <p>Comprendre TypeScript c'est bien, savoir le <strong>configurer et l'intégrer</strong> dans un vrai projet c'est encore mieux. Le fichier <code>tsconfig.json</code> est le cerveau de ton projet TS — il dit au compilateur quoi vérifier, comment compiler, et où trouver les fichiers.</p>

      <h2>tsconfig.json — anatomie complète</h2>

      <p>Créé avec <code>npx tsc --init</code>, ce fichier JSON contrôle tout le comportement du compilateur TypeScript.</p>

      <CodeBlock language="json">{codeTsConfig}</CodeBlock>

      <h2>Le mode strict — pourquoi l'activer ?</h2>

      <p>Le mode strict est le paramètre le plus important. Il active plusieurs vérifications qui semblent contraignantes au début mais <strong>éliminent des classes entières de bugs</strong>.</p>

      <CodeBlock language="typescript">{codeStrictMode}</CodeBlock>

      <h2>Fichiers de déclaration .d.ts</h2>

      <p>Les fichiers <code>.d.ts</code> sont des <strong>descriptions de types</strong> sans implémentation. Ils permettent à TypeScript de connaître les types d'une bibliothèque JavaScript existante — sans que la lib ait été écrite en TS.</p>

      <CodeBlock language="typescript">{codeDts}</CodeBlock>

      <h2>TypeScript avec Vite (setup moderne)</h2>

      <p>Vite est le bundler le plus rapide aujourd'hui. Il supporte TypeScript nativement — mais il utilise <strong>esbuild</strong> pour compiler (très rapide) sans vérifier les types. Pour les types, lance <code>tsc --noEmit</code> séparément.</p>

      <CodeBlock language="bash">{codeVite}</CodeBlock>

      <h2>ESLint + TypeScript — la qualité automatique</h2>

      <p>ESLint analyse ton code et signale les problèmes de style et de logique. Avec le plugin TypeScript, il peut utiliser les informations de types pour détecter des bugs encore plus subtils.</p>

      <CodeBlock language="bash">{codeEslintInstall}</CodeBlock>

      <CodeBlock language="javascript">{codeEslintConfig}</CodeBlock>

      <InfoBox type="success">
        <strong>Stack recommandée en 2025 :</strong> <code>Vite</code> (bundler) + <code>TypeScript</code> strict + <code>ESLint</code> + <code>Prettier</code> (formatage) + <code>Vitest</code> (tests). C'est la base de la quasi-totalité des projets modernes — React, Vue, Svelte, Node.js.
      </InfoBox>
    </>
  );
}

export const chapter: Chapter = {
  id: 20,
  title: 'TypeScript — Config & Éco',
  icon: '⚙️',
  level: 'Bonus TS',
  stars: '★★★★★',
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
    }
  ]
};
