export default {
  id: 20,
  title: 'TypeScript — Config & Éco',
  icon: '⚙️',
  level: 'Bonus TypeScript',
  stars: '★★★★★',
  content: () => `
    <div class="ts-badge">🔷 BONUS · TypeScript</div>
    <div class="chapter-tag">Chapitre 20 · Configuration & Écosystème</div>
    <h1>TypeScript<br><span class="highlight" style="color:#3178c6">Config & Écosystème</span></h1>

    <div class="chapter-intro-card" style="border-color:rgba(49,120,198,0.3);background:linear-gradient(135deg,var(--surface),rgba(49,120,198,0.05))">
      <div class="level-badge level-typescript">⚙️</div>
      <div class="chapter-meta">
        <div class="difficulty-stars" style="color:#3178c6">★★★★★</div>
        <h3>tsconfig.json, strict mode, paths, .d.ts, Vite, ESLint</h3>
        <p>Durée estimée : 40 min · 2 quizz inclus</p>
      </div>
    </div>

    <p>Comprendre TypeScript c'est bien, savoir le <strong>configurer et l'intégrer</strong> dans un vrai projet c'est encore mieux. Le fichier <code>tsconfig.json</code> est le cerveau de ton projet TS — il dit au compilateur quoi vérifier, comment compiler, et où trouver les fichiers.</p>

    <h2>tsconfig.json — anatomie complète</h2>
    <p>Créé avec <code>npx tsc --init</code>, ce fichier JSON contrôle tout le comportement du compilateur TypeScript.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">json</div></div>
      <pre>{
  <span class="str">"compilerOptions"</span>: {

    <span class="cmt">// ─── CIBLE & MODULE ──────────────────────────────</span>
    <span class="str">"target"</span>: <span class="str">"ES2022"</span>,      <span class="cmt">// vers quel JS compiler (ES5, ES6, ESNext…)</span>
    <span class="str">"module"</span>: <span class="str">"ESNext"</span>,      <span class="cmt">// système de modules (CommonJS, ESNext, Node16)</span>
    <span class="str">"moduleResolution"</span>: <span class="str">"bundler"</span>, <span class="cmt">// comment résoudre les imports</span>
    <span class="str">"lib"</span>: [<span class="str">"ES2022"</span>, <span class="str">"DOM"</span>], <span class="cmt">// bibliothèques disponibles (DOM = window, fetch…)</span>

    <span class="cmt">// ─── SÉCURITÉ (activer tout ça !) ────────────────</span>
    <span class="str">"strict"</span>: <span class="kw">true</span>,           <span class="cmt">// active TOUS les checks stricts ci-dessous :</span>
    <span class="str">"noImplicitAny"</span>: <span class="kw">true</span>,    <span class="cmt">// interdit les any implicites</span>
    <span class="str">"strictNullChecks"</span>: <span class="kw">true</span>, <span class="cmt">// null/undefined doivent être gérés explicitement</span>
    <span class="str">"noUncheckedIndexedAccess"</span>: <span class="kw">true</span>, <span class="cmt">// arr[0] peut être undefined</span>
    <span class="str">"exactOptionalPropertyTypes"</span>: <span class="kw">true</span>, <span class="cmt">// prop?: string ≠ prop: string|undefined</span>

    <span class="cmt">// ─── QUALITÉ DU CODE ─────────────────────────────</span>
    <span class="str">"noUnusedLocals"</span>: <span class="kw">true</span>,   <span class="cmt">// erreur si variable locale inutilisée</span>
    <span class="str">"noUnusedParameters"</span>: <span class="kw">true</span>, <span class="cmt">// erreur si paramètre inutilisé</span>
    <span class="str">"noImplicitReturns"</span>: <span class="kw">true</span>, <span class="cmt">// toutes les branches doivent retourner</span>
    <span class="str">"noFallthroughCasesInSwitch"</span>: <span class="kw">true</span>, <span class="cmt">// pas de case sans break/return</span>

    <span class="cmt">// ─── CHEMINS & SORTIES ───────────────────────────</span>
    <span class="str">"rootDir"</span>: <span class="str">"./src"</span>,       <span class="cmt">// dossier source</span>
    <span class="str">"outDir"</span>: <span class="str">"./dist"</span>,       <span class="cmt">// dossier de sortie</span>
    <span class="str">"sourceMap"</span>: <span class="kw">true</span>,        <span class="cmt">// génère .map pour le debugging</span>
    <span class="str">"declaration"</span>: <span class="kw">true</span>,      <span class="cmt">// génère les fichiers .d.ts</span>

    <span class="cmt">// ─── ALIAS DE CHEMINS ────────────────────────────</span>
    <span class="str">"baseUrl"</span>: <span class="str">"."</span>,
    <span class="str">"paths"</span>: {
      <span class="str">"@/*"</span>: [<span class="str">"./src/*"</span>],      <span class="cmt">// import depuis '@/utils' au lieu de '../../utils'</span>
      <span class="str">"@components/*"</span>: [<span class="str">"./src/components/*"</span>]
    }
  },
  <span class="str">"include"</span>: [<span class="str">"src/**/*"</span>],   <span class="cmt">// fichiers à compiler</span>
  <span class="str">"exclude"</span>: [<span class="str">"node_modules"</span>, <span class="str">"dist"</span>]
}</pre>
    </div>

    <h2>Le mode strict — pourquoi l'activer ?</h2>
    <p>Le mode strict est le paramètre le plus important. Il active plusieurs vérifications qui semblent contraignantes au début mais <strong>éliminent des classes entières de bugs</strong>.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
      <pre><span class="cmt">// Sans strict : TS accepte tout ça</span>
<span class="kw">function</span> <span class="fn">greet</span>(name) {                  <span class="cmt">// any implicite — dangereux</span>
  <span class="kw">return</span> name.<span class="fn">toUpperCase</span>();
}
<span class="fn">greet</span>(<span class="kw">null</span>);                           <span class="cmt">// crash à l'exécution !</span>

<span class="cmt">// Avec strict : TS interdit ça</span>
<span class="kw">function</span> <span class="fn">greet</span>(name<span class="op">:</span> <span class="cls">string</span>)<span class="op">:</span> <span class="cls">string</span> { <span class="cmt">// types obligatoires</span>
  <span class="kw">return</span> name.<span class="fn">toUpperCase</span>();
}
<span class="cmt">// greet(null); ❌ Argument of type 'null' is not assignable to 'string'</span>

<span class="cmt">// strictNullChecks en pratique</span>
<span class="kw">function</span> <span class="fn">trouverUser</span>(id<span class="op">:</span> <span class="cls">number</span>)<span class="op">:</span> <span class="cls">User</span> <span class="op">|</span> <span class="kw">null</span> { <span class="kw">return</span> <span class="kw">null</span>; }

<span class="kw">const</span> user <span class="op">=</span> <span class="fn">trouverUser</span>(<span class="num">1</span>);
<span class="cmt">// user.nom ❌ Object is possibly 'null'</span>
user<span class="op">?.</span>nom;          <span class="cmt">// ✅ optional chaining</span>
user<span class="op">!</span>.nom;          <span class="cmt">// ✅ non-null assertion (si tu es CERTAIN qu'il existe)</span>
<span class="kw">if</span> (user) user.nom; <span class="cmt">// ✅ type guard classique</span></pre>
    </div>

    <h2>Fichiers de déclaration .d.ts</h2>
    <p>Les fichiers <code>.d.ts</code> sont des <strong>descriptions de types</strong> sans implémentation. Ils permettent à TypeScript de connaître les types d'une bibliothèque JavaScript existante — sans que la lib ait été écrite en TS.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
      <pre><span class="cmt">// monModule.d.ts — décrit une lib JS externe</span>
<span class="kw">declare</span> <span class="kw">module</span> <span class="str">"ma-lib-js"</span> {
  <span class="kw">export function</span> <span class="fn">calculer</span>(a<span class="op">:</span> <span class="cls">number</span>, b<span class="op">:</span> <span class="cls">number</span>)<span class="op">:</span> <span class="cls">number</span>;
  <span class="kw">export const</span> VERSION<span class="op">:</span> <span class="cls">string</span>;
}

<span class="cmt">// global.d.ts — étendre les types globaux</span>
<span class="kw">declare global</span> {
  <span class="kw">interface</span> <span class="cls">Window</span> {
    monAnalytics<span class="op">:</span> { <span class="fn">track</span>(event<span class="op">:</span> <span class="cls">string</span>)<span class="op">:</span> <span class="kw">void</span> };
  }
  <span class="kw">namespace</span> NodeJS {
    <span class="kw">interface</span> <span class="cls">ProcessEnv</span> {
      DATABASE_URL<span class="op">:</span> <span class="cls">string</span>;
      API_KEY<span class="op">:</span> <span class="cls">string</span>;
    }
  }
}

<span class="cmt">// Installer les types d'une lib populaire</span>
<span class="cmt">// npm install -D @types/lodash @types/node @types/react</span></pre>
    </div>

    <h2>TypeScript avec Vite (setup moderne)</h2>
    <p>Vite est le bundler le plus rapide aujourd'hui. Il supporte TypeScript nativement — mais il utilise <strong>esbuild</strong> pour compiler (très rapide) sans vérifier les types. Pour les types, lance <code>tsc --noEmit</code> séparément.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">bash</div></div>
      <pre><span class="cmt"># Créer un projet Vite + TypeScript</span>
npm create vite@latest mon-projet -- --template vanilla-ts

<span class="cmt"># Structure générée :</span>
<span class="cmt"># ├── src/</span>
<span class="cmt"># │   ├── main.ts</span>
<span class="cmt"># │   └── vite-env.d.ts</span>
<span class="cmt"># ├── tsconfig.json</span>
<span class="cmt"># └── vite.config.ts</span>

<span class="cmt"># Scripts utiles dans package.json :</span>
<span class="cmt"># "dev"   : "vite"              → serveur de dev rapide</span>
<span class="cmt"># "build" : "tsc && vite build" → vérif types + build</span>
<span class="cmt"># "check" : "tsc --noEmit"      → vérifie les types sans compiler</span></pre>
    </div>

    <h2>ESLint + TypeScript — la qualité automatique</h2>
    <p>ESLint analyse ton code et signale les problèmes de style et de logique. Avec le plugin TypeScript, il peut utiliser les informations de types pour détecter des bugs encore plus subtils.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">bash</div></div>
      <pre><span class="cmt"># Installation</span>
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin</pre>
    </div>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="cmt">// eslint.config.js (flat config — ESLint 9+)</span>
<span class="kw">import</span> tseslint <span class="kw">from</span> <span class="str">"@typescript-eslint/eslint-plugin"</span>;
<span class="kw">import</span> tsparser <span class="kw">from</span> <span class="str">"@typescript-eslint/parser"</span>;

<span class="kw">export default</span> [
  {
    files: [<span class="str">"**/*.ts"</span>],
    languageOptions: { parser: tsparser },
    plugins: { <span class="str">"@typescript-eslint"</span>: tseslint },
    rules: {
      <span class="str">"@typescript-eslint/no-explicit-any"</span>: <span class="str">"error"</span>,
      <span class="str">"@typescript-eslint/no-unused-vars"</span>: <span class="str">"error"</span>,
      <span class="str">"@typescript-eslint/prefer-nullish-coalescing"</span>: <span class="str">"warn"</span>,
      <span class="str">"@typescript-eslint/no-floating-promises"</span>: <span class="str">"error"</span>, <span class="cmt">// oubli d'await !</span>
    }
  }
];</pre>
    </div>

    <div class="info-box success">
      <div class="info-icon">🚀</div>
      <p><strong>Stack recommandée en 2025 :</strong> <code>Vite</code> (bundler) + <code>TypeScript</code> strict + <code>ESLint</code> + <code>Prettier</code> (formatage) + <code>Vitest</code> (tests). C'est la base de la quasi-totalité des projets modernes — React, Vue, Svelte, Node.js.</p>
    </div>
  `,
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
