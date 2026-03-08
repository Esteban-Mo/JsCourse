import React from 'react';
import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function EventLoopDiagram() {
  const box = (color: string): React.CSSProperties => ({
    background: `rgba(${color}, 0.1)`,
    border: `1px solid rgba(${color}, 0.35)`,
    borderRadius: 4,
    padding: '4px 8px',
    marginBottom: 4,
    color: '#e2e8f0',
    fontSize: 12,
    textAlign: 'center',
  });
  return (
    <div style={{ background: 'var(--surface)', border: '2px solid var(--accent)', borderRadius: 12, padding: '20px 16px', margin: '16px 0' }}>
      <div style={{ textAlign: 'center', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: 2, fontSize: 12, marginBottom: 16 }}>
        ── THREAD JAVASCRIPT ──
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>

        {/* Call Stack */}
        <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 10 }}>
            <div style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: 13 }}>Call Stack</div>
            <div style={{ color: 'var(--muted)', fontSize: 11 }}>(exécution)</div>
          </div>
          {['fn3()', 'fn2()', 'fn1()', '[global]'].map(fn => (
            <div key={fn} style={box('96,165,250')}>{fn}</div>
          ))}
        </div>

        {/* Web APIs */}
        <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 10 }}>
            <div style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: 13 }}>Web APIs</div>
            <div style={{ color: 'var(--muted)', fontSize: 11 }}>(async I/O)</div>
          </div>
          {['setTimeout', 'fetch', 'addEventListener'].map(api => (
            <div key={api} style={box('167,139,250')}>{api}</div>
          ))}
        </div>

        {/* Arrow */}
        <div style={{ color: 'var(--accent)', fontSize: 22, flexShrink: 0, lineHeight: 1 }}>→</div>

        {/* Queues */}
        <div style={{ flex: 1.2, border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 10 }}>
            <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: 13 }}>Queues</div>
          </div>
          <div style={{ fontSize: 11, color: '#fcd34d', fontWeight: 'bold', marginBottom: 4 }}>⚡ Microtasks</div>
          {['Promise.then', 'queueMicrotask'].map(t => (
            <div key={t} style={{ ...box('252,211,77'), fontSize: 11, marginBottom: 3 }}>{t}</div>
          ))}
          <div style={{ fontSize: 11, color: '#f87171', fontWeight: 'bold', margin: '8px 0 4px' }}>⏱ Macrotasks</div>
          {['setTimeout', 'setInterval', 'I/O events'].map(t => (
            <div key={t} style={{ ...box('248,113,113'), fontSize: 11, marginBottom: 3 }}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(52, 211, 153, 0.1)',
          border: '1px dashed #34d399',
          borderRadius: 8,
          padding: '8px 16px',
          color: '#34d399',
          fontSize: 12,
        }}>
          <strong>🔄 L'Event Loop</strong> interroge en continu : <em style={{ opacity: 0.8 }}>"Le Call Stack est-il vide ?"</em><br />
          Si oui → elle insère les <strong>Microtasks</strong>, le rendu, puis UNE seule <strong>Macrotask</strong>.
        </div>
      </div>

      <div style={{ marginTop: 14, textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
        Priorité :&nbsp;
        <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Stack</span>
        {' → '}
        <span style={{ color: '#fcd34d', fontWeight: 'bold' }}>Microtasks</span>
        {' → '}
        <span style={{ color: '#f87171', fontWeight: 'bold' }}>Macrotasks</span>
        <span style={{ opacity: 0.6 }}> (1 à la fois)</span>
      </div>
    </div>
  );
}

const codeEventLoop = `// Démonstration de l'ordre d'exécution
console.log("1 — Synchrone (Call Stack)");

setTimeout(() => console.log("5 — Macrotask (setTimeout 0)"), 0);

Promise.resolve()
  .then(() => console.log("3 — Microtask (Promise.then)"))
  .then(() => console.log("4 — Microtask (Promise.then chaîné)"));

queueMicrotask(() => console.log("3b — Microtask (queueMicrotask)"));

console.log("2 — Synchrone (Call Stack)");

// Sortie dans l'ordre :
// 1 — Synchrone (Call Stack)
// 2 — Synchrone (Call Stack)
// 3 — Microtask (Promise.then)
// 3b — Microtask (queueMicrotask)
// 4 — Microtask (Promise.then chaîné)
// 5 — Macrotask (setTimeout 0)`;

const codeHiddenClasses = `// ❌ Instabilité de shape : V8 crée de nouvelles hidden classes
function PointInstable(x, y) {
  this.x = x;
  if (y) this.y = y; // ajout conditionnel = nouvelle shape !
}
// new PointInstable(1, 2) → Shape {x, y}
// new PointInstable(1)    → Shape {x} ← différente !
// V8 ne peut pas optimiser car les shapes divergent

// ✅ Shape stable : une seule hidden class pour tous les objets
function PointStable(x, y) {
  this.x = x;
  this.y = y ?? 0; // toujours défini → même shape
}
// Toutes les instances → Shape {x, y} ← V8 optimise !

// ❌ Ajouter des propriétés après construction = nouvelle shape
const obj = {};
obj.x = 1; // Shape → {x}
obj.y = 2; // Shape → {x, y} ← transition !
obj.z = 3; // Shape → {x, y, z} ← transition !

// ✅ Définir toutes les propriétés dès la création
const obj2 = { x: 1, y: 2, z: 3 }; // une seule shape dès le départ`;

const codeMesurer = `// Mesurer les performances avec performance.now()
function mesurer(label, fn) {
  const debut = performance.now();
  fn();
  const fin = performance.now();
  console.log(\`\${label}: \${(fin - debut).toFixed(3)}ms\`);
}

// Points instables vs stables : x10 plus lent !
mesurer("Instable", () => {
  for (let i = 0; i < 1_000_000; i++) new PointInstable(i, i % 2 ? i : undefined);
});
mesurer("Stable  ", () => {
  for (let i = 0; i < 1_000_000; i++) new PointStable(i, i);
});`;

const codeFuites1 = `// ❌ FUITE 1 : Event listener jamais supprimé
function setupBug() {
  const donneesMassives = new Array(1_000_000).fill({ data: "..." });

  document.addEventListener("click", () => {
    console.log(donneesMassives[0]); // closure sur donneesMassives
    // donneesMassives reste en mémoire TANT QUE le listener existe !
  });
  // setupBug() termine, mais la closure garde donneesMassives en vie
}

// ✅ Solution : référencer le handler pour le supprimer
function setupOk() {
  const handler = (e) => console.log("clic", e.target);
  document.addEventListener("click", handler);

  // Retourner ou stocker la fonction de nettoyage
  return () => document.removeEventListener("click", handler);
}
const cleanup = setupOk();
// Plus tard... cleanup() pour libérer la mémoire`;

const codeFuites2 = `// ❌ FUITE 2 : Cache infini (Map qui grandit sans limite)
const cache = new Map(); // grandit à l'infini !
function calculerEtCacher(objet) {
  if (!cache.has(objet)) cache.set(objet, calculerLourd(objet));
  return cache.get(objet);
}

// ✅ Solution : WeakMap libère automatiquement quand l'objet est GC
const cacheWeak = new WeakMap();
function calculerEtCacherWeak(objet) {
  if (!cacheWeak.has(objet)) cacheWeak.set(objet, calculerLourd(objet));
  return cacheWeak.get(objet);
}
// Quand 'objet' n'a plus de références, WeakMap libère automatiquement

// ❌ FUITE 3 : Noeud DOM détaché mais référencé
let refDetachee;
function attacherElement() {
  const div = document.createElement("div");
  refDetachee = div; // ← garde une référence externe
  document.body.appendChild(div);
  document.body.removeChild(div); // ← retiré du DOM
  // div n'est plus dans le DOM MAIS refDetachee le garde en vie !
}
// Solution : refDetachee = null quand on n'en a plus besoin`;

const codeDebounce = `// DEBOUNCE : attend que l'utilisateur arrête d'agir
// Analogie : minuterie qui se réinitialise à chaque frappe
// Si silence > délai → exécute. Idéal pour : recherche en temps réel
function debounce(fn, delaiMs) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delaiMs);
  };
}

// Usage : chercher seulement 300ms après la dernière frappe
const rechercherDebounced = debounce((terme) => {
  console.log(\`Recherche: "\${terme}"\`);
  // appel API...
}, 300);

// Typing "hello" → 5 événements mais UN SEUL appel API
input.addEventListener("input", e => rechercherDebounced(e.target.value));`;

const codeThrottle = `// THROTTLE : exécute au maximum une fois par intervalle
// Analogie : une soupape qui laisse passer une requête max par seconde
// Idéal pour : scroll tracking, resize, jeux
function throttle(fn, intervalleMs) {
  let dernierAppel = 0;
  return function(...args) {
    const maintenant = Date.now();
    if (maintenant - dernierAppel >= intervalleMs) {
      dernierAppel = maintenant;
      fn.apply(this, args);
    }
  };
}

// Usage : position de scroll max 10 fois par seconde
const onScrollThrottled = throttle(() => {
  console.log(\`scrollY: \${window.scrollY}\`);
}, 100);

window.addEventListener("scroll", onScrollThrottled);

// Comparaison :
// Debounce : attend la fin de l'activité, puis exécute UNE fois
// Throttle  : exécute régulièrement pendant l'activité`;

const codeWeakRef = `// WeakRef : référence qui n'empêche PAS le Garbage Collector
let objetLourd = { data: new Array(1_000_000).fill(0) };
const ref = new WeakRef(objetLourd);

// Utiliser l'objet via deref()
const donnees = ref.deref();
if (donnees) {
  console.log(donnees.data.length); // 1_000_000
}

// Si on libère la seule référence forte :
objetLourd = null;
// Le GC PEUT maintenant collecter l'objet
// ref.deref() retournera undefined après la collecte

// FinalizationRegistry : être notifié quand un objet est GC
const registry = new FinalizationRegistry((cle) => {
  console.log(\`Objet \${cle} collecté par le GC\`);
  cache.delete(cle); // nettoyer le cache
});

function creerEtEnregistrer(cle, objet) {
  registry.register(objet, cle);
  return new WeakRef(objet);
}`;

const codeChallenge = `async function traiterParBatch(items, traiteur, taillesBatch = 100) {
  const resultats = [];

  for (let i = 0; i < items.length; i += taillesBatch) {
    const batch = items.slice(i, i + taillesBatch);

    // Traiter le batch
    const batchResultats = batch.map(traiteur);
    resultats.push(...batchResultats);

    // Céder la main à l'Event Loop (permet le rendu UI)
    await new Promise(resolve => setTimeout(resolve, 0));

    const pct = Math.min(((i + taillesBatch) / items.length * 100), 100);
    console.log(\`Progression: \${pct.toFixed(0)}%\`);
  }

  return resultats;
}

// Usage : traiter 100 000 items sans freezer l'UI
const donnees = Array.from({ length: 100_000 }, (_, i) => i);
const resultats = await traiterParBatch(
  donnees,
  n => n * n, // traitement par élément
  1000        // taille du batch
);`;

function Ch13Performance() {
  return (
    <>
      <div className="chapter-tag">Chapitre 13 · Expert+</div>
      <h1>Performance<br />&amp; <span className="highlight">Moteur V8</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-expert">🚀</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★★</div>
          <h3>Event Loop, V8/JIT, fuites mémoire, debounce/throttle, WeakRef</h3>
          <p>Durée estimée : 45 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Comprendre comment JavaScript s'exécute sous le capot vous permet d'écrire du code non seulement correct, mais aussi rapide et économe en mémoire. Ce chapitre démystifie l'Event Loop, le compilateur JIT de V8, et les patterns essentiels de performance.</p>

      <h2>L'Event Loop — Explication complète</h2>

      <p>
        JavaScript s'exécute dans un seul <em>thread</em>, ce qui signifie qu'il ne peut faire qu'une seule chose à la fois.
        Pourtant, il reste <strong>non-bloquant</strong> (il ne plante pas pendant un téléchargement) grâce à <strong>l'Event Loop</strong> (la boucle d'événements)
        et aux composants externes fournis par l'environnement (le navigateur web ou Node.js).
      </p>

      <h3>1. Le Call Stack (La pile d'appels)</h3>
      <p>
        C'est ici que le code <strong>synchrone</strong> s'exécute. JavaScript lit le script et empile tour à tour les fonctions sollicitées.
        Lorsqu'une fonction est achevée, elle est dépilée (retirée). Si cette pile contient trop d'appels (ex: boucle infinie récursive),
        elle finit par exploser en retournant l'erreur : <em>Maximum call stack size exceeded</em>.
      </p>

      <h3>2. Les Web APIs (L'environnement asynchrone)</h3>
      <p>
        Le moteur JavaScript (V8) ne gère pas lui-même le temps (<code>setTimeout</code>), le réseau (<code>fetch</code>), ou le DOM.
        Lorsqu'il rencontre une de ces fonctions, il délègue la tâche au navigateur (ou à C++ côté Node.js) qui va traiter cela <strong>en arrière-plan</strong>.
        Le Call Stack se libère aussitôt, permettant à JS de passer à la ligne suivante.
      </p>

      <h3>3. La file des Microtasks (Priorité haute) ⚡</h3>
      <p>
        Les microtasks sont destinées au code asynchrone urgent, devant s'exécuter <strong>dès que possible</strong>,
        après la ligne de code en cours, mais avant de rendre le contrôle au navigateur. On y retrouve toutes les résolutions
        de <strong>Promises</strong> (<code>.then()</code>, <code>.catch()</code>), le mot clé <code>await</code>, et la fonction native <code>queueMicrotask()</code>.
      </p>

      <h3>4. La file des Macrotasks (Priorité normale) ⏱</h3>
      <p>
        Les macrotasks regroupent tout le reste du travail "différé" : les callbacks de <code>setTimeout</code>/<code>setInterval</code>,
        et les événements du DOM (comme la réaction à un clic utilisateur ou au scroll).
      </p>

      <InfoBox type="success">
        <h4>L'algorithme de l'Event Loop (Ordre strict)</h4>
        <ol style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>Exécuter le code synchrone présent dans le <strong>Call Stack</strong> jusqu'à ce qu'il soit entièrement vide.</li>
          <li>Vider <strong>ENTIÈREMENT</strong> la file des <strong>Microtasks</strong> (y compris les nouvelles microtasks programmées par des microtasks en train de s'exécuter).</li>
          <li>Mettre à jour le rendu de l'interface (si le navigateur estime qu'il est temps de redessiner l'écran).</li>
          <li>Prendre <strong>UNE SEULE</strong> et unique <strong>Macrotask</strong> dans sa file et l'exécuter.</li>
          <li>Recommencer au point 1.</li>
        </ol>
      </InfoBox>

      <EventLoopDiagram />
      <br />

      <CodeBlock language="javascript">{codeEventLoop}</CodeBlock>

      <InfoBox type="warning">
        Attention au piège des <strong>Microtasks</strong> ! <br />
        Puisque l'Event Loop vide <em>toute</em> la file des microtasks d'un seul coup sans interruption, si une Promise enchaîne continuellement ou récursivement d'autres Promises (créant des microtasks à l'infini), le navigateur ne pourra jamais passer à l'étape du rafraîchissement d'interface : <strong>l'onglet freezera purement et simplement !</strong>
      </InfoBox>

      <h2>V8 et les Hidden Classes — Comment JIT compile votre code</h2>

      <p>V8 (le moteur JS de Chrome/Node) utilise la compilation <strong>Just-In-Time (JIT)</strong> : il observe votre code pendant qu'il s'exécute et génère du code machine optimisé. Sa stratégie clé repose sur les <em>hidden classes</em> : les objets qui partagent la même structure partagent la même hidden class → accès aux propriétés ultra-rapide.</p>

      <CodeBlock language="javascript">{codeHiddenClasses}</CodeBlock>

      <CodeBlock language="javascript">{codeMesurer}</CodeBlock>

      <h2>Fuites mémoire — Les trois coupables habituels</h2>

      <p>Le Garbage Collector (GC) libère automatiquement la mémoire des objets sans références. Mais certains patterns empêchent le GC de faire son travail.</p>

      <CodeBlock language="javascript">{codeFuites1}</CodeBlock>

      <CodeBlock language="javascript">{codeFuites2}</CodeBlock>

      <h2>Debounce et Throttle — Contrôler la fréquence d'exécution</h2>

      <p>Certains événements (scroll, resize, keyup) se déclenchent des dizaines de fois par seconde. Exécuter une fonction coûteuse à chaque événement peut freezer l'interface.</p>

      <CodeBlock language="javascript">{codeDebounce}</CodeBlock>

      <CodeBlock language="javascript">{codeThrottle}</CodeBlock>

      <h2>WeakRef et FinalizationRegistry — Mémoire avancée</h2>

      <p>Traditionnellement, tant qu'une variable fait référence à un objet, ce dernier ne peut pas être nettoyé par le Garbage Collector (GC). L'objet <code>WeakRef</code> (référence faible) permet de pointer vers un objet sans empêcher sa destruction s'il n'est plus utilisé ailleurs. Combiné au <code>FinalizationRegistry</code>, il permet de réagir au moment exact où le navigateur supprime la donnée en mémoire.</p>

      <CodeBlock language="javascript">{codeWeakRef}</CodeBlock>

      <InfoBox type="warning">
        <code>WeakRef</code> et <code>FinalizationRegistry</code> sont des outils avancés. N'en dépendez pas pour la logique métier — le moment de collecte GC est imprévisible. Utilisez-les seulement pour des optimisations mémoire (caches, etc.).
      </InfoBox>

      <Challenge title="Défi personnel à réaliser : Scheduler de tâches">
        <p>Implémentez un scheduler qui exécute des tâches par batch pour éviter de bloquer le thread principal. Utilisez <code>setTimeout(fn, 0)</code> pour céder la main à l'Event Loop entre chaque batch.</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 20,
  title: 'Performance & V8',
  icon: '🚀',
  level: 'Expert',
  stars: '★★★★★',
  component: Ch13Performance,
  quiz: [
    {
      question: "Dans l'Event Loop, quelle est la priorité d'exécution correcte ?",
      sub: "Ordre de l'Event Loop JS",
      options: [
        "Macrotasks → Synchrone → Microtasks",
        "Synchrone (Call Stack) → Macrotasks → Microtasks",
        "Synchrone (Call Stack) → Microtasks → Macrotasks (une à la fois)",
        "Microtasks → Synchrone → Macrotasks"
      ],
      correct: 2,
      explanation: "✅ Exact ! L'ordre est : (1) Code synchrone dans le Call Stack, (2) Toute la file des Microtasks (Promises, queueMicrotask), (3) UNE Macrotask (setTimeout, I/O), puis retour aux Microtasks. Les Microtasks ont toujours priorité sur les Macrotasks."
    },
    {
      question: "Quelle est la différence entre debounce et throttle ?",
      sub: "Optimisation des événements fréquents",
      options: [
        "Debounce est pour les clics, throttle pour le scroll",
        "Debounce exécute après une pause d'activité (attente de silence), throttle exécute régulièrement pendant l'activité (limite de fréquence)",
        "Throttle est plus performant que debounce dans tous les cas",
        "Ce sont deux noms pour la même technique"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Debounce = attendre que l'utilisateur s'arrête (recherche live : exécuter seulement après 300ms de silence). Throttle = exécuter au maximum N fois par seconde (scroll tracker : max 10 fois/s). Chacun a son cas d'usage."
    },
    {
      question: "Pourquoi les 'hidden classes' de V8 sont-elles importantes pour les performances ?",
      sub: "Optimisations JIT de V8",
      options: [
        "Elles réduisent la consommation mémoire des objets",
        "Elles permettent à V8 de générer du code machine optimisé pour les accès aux propriétés — des objets avec la même structure partagent la même hidden class",
        "Elles activent la parallélisation du code JS",
        "Elles permettent au GC de collecter la mémoire plus rapidement"
      ],
      correct: 1,
      explanation: "✅ Exact ! V8 crée des 'hidden classes' (shapes) pour tracker la structure des objets. Quand tous vos objets ont la même structure (mêmes propriétés dans le même ordre), ils partagent une hidden class et V8 peut compiler du code machine ultra-optimisé. Des structures instables (propriétés conditionnelles) cassent cette optimisation."
    },
    {
      question: "Quel est le principal rôle de requestAnimationFrame par rapport à setTimeout pour les animations ?",
      sub: "Animations et rendu",
      options: [
        "requestAnimationFrame est plus rapide car il s'exécute toutes les 1ms",
        "requestAnimationFrame synchronise les mises à jour visuelles avec le cycle de rafraîchissement du navigateur (60fps), évitant les frames perdues et économisant la batterie",
        "requestAnimationFrame fonctionne dans un Web Worker, contrairement à setTimeout",
        "requestAnimationFrame est simplement un alias de setTimeout avec 16ms de délai"
      ],
      correct: 1,
      explanation: "✅ Exact ! requestAnimationFrame planifie le callback juste avant que le navigateur repeigne l'écran. Il s'adapte automatiquement au taux de rafraîchissement (60Hz, 120Hz...), se met en pause quand l'onglet est caché, et aligne les mises à jour sur le pipeline de rendu — évitant les calculs inutiles que setTimeout ne peut pas faire."
    },
    {
      question: "Quelle limitation fondamentale s'applique aux Web Workers ?",
      sub: "Web Workers",
      options: [
        "Les Web Workers ne peuvent pas exécuter de code JavaScript complexe",
        "Les Web Workers n'ont pas accès au DOM, à window, ni aux variables globales du thread principal",
        "Les Web Workers sont limités à 1 seconde d'exécution",
        "Les Web Workers ne peuvent pas utiliser fetch ou XMLHttpRequest"
      ],
      correct: 1,
      explanation: "✅ Exact ! Les Web Workers s'exécutent dans un thread séparé totalement isolé. Ils n'ont aucun accès au DOM, à window, à document, ni aux variables du thread principal. La communication se fait uniquement via postMessage(). En revanche, ils peuvent utiliser fetch, XMLHttpRequest, IndexedDB et les Web APIs non-DOM."
    },
    {
      question: "Qu'est-ce que le 'layout thrashing' et comment l'éviter ?",
      sub: "Optimisation du rendu DOM",
      options: [
        "Un crash du navigateur causé par trop d'éléments DOM",
        "L'alternance lecture/écriture DOM dans une boucle qui force le navigateur à recalculer le layout à chaque itération",
        "L'utilisation excessive de flexbox ou grid qui ralentit le rendu",
        "Un débordement de la pile d'appels causé par des manipulations DOM récursives"
      ],
      correct: 1,
      explanation: "✅ Correct ! Le layout thrashing survient quand on lit une propriété géométrique (offsetHeight, getBoundingClientRect) puis qu'on modifie le DOM, puis qu'on relit, forçant un reflow synchrone à chaque cycle. La solution : grouper toutes les lectures d'abord, puis toutes les écritures. requestAnimationFrame ou des librairies comme FastDOM automatisent ce batching."
    },
    {
      question: "Quel est l'avantage des event listeners passifs (passive: true) ?",
      sub: "Event listeners et performance",
      options: [
        "Les listeners passifs s'exécutent dans un Web Worker",
        "Les listeners passifs informent le navigateur qu'on n'appellera pas preventDefault(), lui permettant d'optimiser le défilement sans attendre le handler",
        "Les listeners passifs sont automatiquement supprimés après le premier déclenchement",
        "Les listeners passifs consomment moins de mémoire que les listeners normaux"
      ],
      correct: 1,
      explanation: "✅ Exact ! Sans { passive: true }, le navigateur doit attendre que le handler scroll ou touchstart se termine avant de défiler — car il ne sait pas si preventDefault() sera appelé. Avec { passive: true }, il sait qu'on ne bloquera jamais le défilement natif et peut optimiser immédiatement. Gain typique : 60fps stable sur mobile contre saccades."
    },
    {
      question: "Quelle structure de données faut-il préférer à Map pour éviter les fuites mémoire dans un cache d'objets ?",
      sub: "Gestion mémoire avancée",
      options: [
        "Set, car il ne stocke que des clés sans valeurs associées",
        "Un tableau ordinaire avec indexOf pour la recherche",
        "WeakMap, car ses clés sont détenues faiblement et libérées automatiquement par le GC quand l'objet-clé n'a plus d'autres références",
        "Object.create(null) pour éviter la chaîne de prototypes"
      ],
      correct: 2,
      explanation: "✅ Parfait ! Map maintient des références fortes vers ses clés — un objet en clé de Map ne sera jamais collecté par le GC tant que le Map existe, causant une fuite mémoire si le cache grossit indéfiniment. WeakMap détient ses clés faiblement : quand l'objet-clé n'est plus référencé ailleurs, le GC peut le collecter et WeakMap libère automatiquement l'entrée associée."
    }
  ]
};
