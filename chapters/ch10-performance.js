export default {
    id: 13,
    title: 'Performance & V8',
    icon: '🚀',
    level: 'Expert',
    stars: '★★★★★',
    content: () => `
      <div class="chapter-tag">Chapitre 13 · Expert+</div>
      <h1>Performance<br>& <span class="highlight">Moteur V8</span></h1>
      <div class="chapter-intro-card">
        <div class="level-badge level-expert">🚀</div>
        <div class="chapter-meta">
          <div class="difficulty-stars" style="color:#f78c4a">★★★★★</div>
          <h3>Event Loop, V8/JIT, fuites mémoire, debounce/throttle, WeakRef</h3>
          <p>Durée estimée : 45 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Comprendre comment JavaScript s'exécute sous le capot vous permet d'écrire du code non seulement correct, mais aussi rapide et économe en mémoire. Ce chapitre démystifie l'Event Loop, le compilateur JIT de V8, et les patterns essentiels de performance.</p>

      <h2>L'Event Loop — Visualisation complète</h2>

      <p>JavaScript est mono-thread mais non-bloquant grâce à un mécanisme précis. Voici l'ordre exact d'exécution :</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">text</div></div>
        <pre><span class="cmt">┌─────────────────────────────────────────────────────────┐
│                    THREAD JAVASCRIPT                    │
│                                                         │
│  ┌─────────────┐    ┌──────────────┐  ┌─────────────┐  │
│  │  Call Stack │    │  Web APIs    │  │  Queues     │  │
│  │  (exécution)│    │  (async I/O) │  │             │  │
│  │             │    │              │  │ Microtasks  │  │
│  │  fn3()      │    │  setTimeout  │  │  Promise    │  │
│  │  fn2()      │    │  fetch       │  │  queueMicro │  │
│  │  fn1()      │    │  addEventListener│              │  │
│  │  [global]   │    │              │  │ Macrotasks  │  │
│  └─────────────┘    └──────────────┘  │  setTimeout │  │
│                           │           │  setInterval│  │
│                           └──────────▶│  I/O events │  │
│                                       └─────────────┘  │
│                                                         │
│  Priorité : Stack → Microtasks → Macrotasks (1 à la fois)
└─────────────────────────────────────────────────────────┘</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Démonstration de l'ordre d'exécution</span>
console.<span class="fn">log</span>(<span class="str">"1 — Synchrone (Call Stack)"</span>);

<span class="fn">setTimeout</span>(() <span class="op">=></span> console.<span class="fn">log</span>(<span class="str">"5 — Macrotask (setTimeout 0)"</span>), <span class="num">0</span>);

<span class="cls">Promise</span>.<span class="fn">resolve</span>()
  .<span class="fn">then</span>(() <span class="op">=></span> console.<span class="fn">log</span>(<span class="str">"3 — Microtask (Promise.then)"</span>))
  .<span class="fn">then</span>(() <span class="op">=></span> console.<span class="fn">log</span>(<span class="str">"4 — Microtask (Promise.then chaîné)"</span>));

<span class="fn">queueMicrotask</span>(() <span class="op">=></span> console.<span class="fn">log</span>(<span class="str">"3b — Microtask (queueMicrotask)"</span>));

console.<span class="fn">log</span>(<span class="str">"2 — Synchrone (Call Stack)"</span>);

<span class="cmt">// Sortie dans l'ordre :
// 1 — Synchrone (Call Stack)
// 2 — Synchrone (Call Stack)
// 3 — Microtask (Promise.then)
// 3b — Microtask (queueMicrotask)
// 4 — Microtask (Promise.then chaîné)
// 5 — Macrotask (setTimeout 0)</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>La règle clé : après chaque tâche synchrone et après chaque macrotask, <strong>toute la file des microtasks</strong> est vidée avant de passer à la macrotask suivante. C'est pourquoi des microtasks récursives peuvent bloquer le rendu du navigateur !</p>
      </div>

      <h2>V8 et les Hidden Classes — Comment JIT compile votre code</h2>

      <p>V8 (le moteur JS de Chrome/Node) utilise la compilation <strong>Just-In-Time (JIT)</strong> : il observe votre code pendant qu'il s'exécute et génère du code machine optimisé pour les chemins fréquents. Sa stratégie clé repose sur les <em>hidden classes</em>.</p>

      <p>V8 crée en interne une "hidden class" (ou "shape") pour chaque structure d'objet unique. Les objets qui partagent la même structure partagent la même hidden class → accès aux propriétés ultra-rapide.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// ❌ Instabilité de shape : V8 crée de nouvelles hidden classes</span>
<span class="kw">function</span> <span class="cls">PointInstable</span>(x, y) {
  <span class="kw">this</span>.x <span class="op">=</span> x;
  <span class="kw">if</span> (y) <span class="kw">this</span>.y <span class="op">=</span> y; <span class="cmt">// ajout conditionnel = nouvelle shape !</span>
}
<span class="cmt">// new PointInstable(1, 2) → Shape {x, y}</span>
<span class="cmt">// new PointInstable(1)    → Shape {x} ← différente !</span>
<span class="cmt">// V8 ne peut pas optimiser car les shapes divergent</span>

<span class="cmt">// ✅ Shape stable : une seule hidden class pour tous les objets</span>
<span class="kw">function</span> <span class="cls">PointStable</span>(x, y) {
  <span class="kw">this</span>.x <span class="op">=</span> x;
  <span class="kw">this</span>.y <span class="op">=</span> y <span class="op">??</span> <span class="num">0</span>; <span class="cmt">// toujours défini → même shape</span>
}
<span class="cmt">// Toutes les instances → Shape {x, y} ← V8 optimise !</span>

<span class="cmt">// ❌ Ajouter des propriétés après construction = nouvelle shape</span>
<span class="kw">const</span> obj <span class="op">=</span> {};
obj.x <span class="op">=</span> <span class="num">1</span>; <span class="cmt">// Shape → {x}</span>
obj.y <span class="op">=</span> <span class="num">2</span>; <span class="cmt">// Shape → {x, y} ← transition !</span>
obj.z <span class="op">=</span> <span class="num">3</span>; <span class="cmt">// Shape → {x, y, z} ← transition !</span>

<span class="cmt">// ✅ Définir toutes les propriétés dès la création</span>
<span class="kw">const</span> obj2 <span class="op">=</span> { x: <span class="num">1</span>, y: <span class="num">2</span>, z: <span class="num">3</span> }; <span class="cmt">// une seule shape dès le départ</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Mesurer les performances avec performance.now()</span>
<span class="kw">function</span> <span class="fn">mesurer</span>(label, fn) {
  <span class="kw">const</span> debut <span class="op">=</span> performance.<span class="fn">now</span>();
  fn();
  <span class="kw">const</span> fin <span class="op">=</span> performance.<span class="fn">now</span>();
  console.<span class="fn">log</span>(<span class="str">\`\${label}: \${(fin - debut).<span class="fn">toFixed</span>(3)}ms\`</span>);
}

<span class="cmt">// Points instables vs stables : x10 plus lent !</span>
<span class="fn">mesurer</span>(<span class="str">"Instable"</span>, () <span class="op">=></span> {
  <span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;</span> <span class="num">1_000_000</span>; i<span class="op">++</span>) <span class="kw">new</span> <span class="cls">PointInstable</span>(i, i <span class="op">%</span> <span class="num">2</span> ? i : <span class="kw">undefined</span>);
});
<span class="fn">mesurer</span>(<span class="str">"Stable  "</span>, () <span class="op">=></span> {
  <span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;</span> <span class="num">1_000_000</span>; i<span class="op">++</span>) <span class="kw">new</span> <span class="cls">PointStable</span>(i, i);
});</pre>
      </div>

      <h2>Fuites mémoire — Les trois coupables habituels</h2>

      <p>Le Garbage Collector (GC) de JS libère automatiquement la mémoire des objets qui n'ont plus de références. Mais certains patterns empêchent le GC de faire son travail.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// ❌ FUITE 1 : Event listener jamais supprimé</span>
<span class="kw">function</span> <span class="fn">setupBug</span>() {
  <span class="kw">const</span> donneesMassives <span class="op">=</span> <span class="kw">new</span> <span class="cls">Array</span>(<span class="num">1_000_000</span>).<span class="fn">fill</span>({ data: <span class="str">"..."</span> });

  document.<span class="fn">addEventListener</span>(<span class="str">"click"</span>, () <span class="op">=></span> {
    console.<span class="fn">log</span>(donneesMassives[<span class="num">0</span>]); <span class="cmt">// closure sur donneesMassives</span>
    <span class="cmt">// donneesMassives reste en mémoire TANT QUE le listener existe !</span>
  });
  <span class="cmt">// setupBug() termine, mais la closure garde donneesMassives en vie</span>
}

<span class="cmt">// ✅ Solution : référencer le handler pour le supprimer</span>
<span class="kw">function</span> <span class="fn">setupOk</span>() {
  <span class="kw">const</span> handler <span class="op">=</span> (e) <span class="op">=></span> console.<span class="fn">log</span>(<span class="str">"clic"</span>, e.target);
  document.<span class="fn">addEventListener</span>(<span class="str">"click"</span>, handler);

  <span class="cmt">// Retourner ou stocker la fonction de nettoyage</span>
  <span class="kw">return</span> () <span class="op">=></span> document.<span class="fn">removeEventListener</span>(<span class="str">"click"</span>, handler);
}
<span class="kw">const</span> cleanup <span class="op">=</span> <span class="fn">setupOk</span>();
<span class="cmt">// Plus tard... cleanup() pour libérer la mémoire</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// ❌ FUITE 2 : Cache infini (Map qui grandit sans limite)</span>
<span class="kw">const</span> cache <span class="op">=</span> <span class="kw">new</span> <span class="cls">Map</span>(); <span class="cmt">// grandit à l'infini !</span>
<span class="kw">function</span> <span class="fn">calculerEtCacher</span>(objet) {
  <span class="kw">if</span> (<span class="op">!</span>cache.<span class="fn">has</span>(objet)) cache.<span class="fn">set</span>(objet, <span class="fn">calculerLourd</span>(objet));
  <span class="kw">return</span> cache.<span class="fn">get</span>(objet);
}

<span class="cmt">// ✅ Solution : WeakMap libère automatiquement quand l'objet est GC</span>
<span class="kw">const</span> cacheWeak <span class="op">=</span> <span class="kw">new</span> <span class="cls">WeakMap</span>();
<span class="kw">function</span> <span class="fn">calculerEtCacherWeak</span>(objet) {
  <span class="kw">if</span> (<span class="op">!</span>cacheWeak.<span class="fn">has</span>(objet)) cacheWeak.<span class="fn">set</span>(objet, <span class="fn">calculerLourd</span>(objet));
  <span class="kw">return</span> cacheWeak.<span class="fn">get</span>(objet);
}
<span class="cmt">// Quand 'objet' n'a plus de références, WeakMap libère automatiquement</span>

<span class="cmt">// ❌ FUITE 3 : Noeud DOM détaché mais référencé</span>
<span class="kw">let</span> refDetachee;
<span class="kw">function</span> <span class="fn">attacherElement</span>() {
  <span class="kw">const</span> div <span class="op">=</span> document.<span class="fn">createElement</span>(<span class="str">"div"</span>);
  refDetachee <span class="op">=</span> div; <span class="cmt">// ← garde une référence externe</span>
  document.body.<span class="fn">appendChild</span>(div);
  document.body.<span class="fn">removeChild</span>(div); <span class="cmt">// ← retiré du DOM</span>
  <span class="cmt">// div n'est plus dans le DOM MAIS refDetachee le garde en vie !</span>
}
<span class="cmt">// Solution : refDetachee = null quand on n'en a plus besoin</span></pre>
      </div>

      <h2>Debounce et Throttle — Contrôler la fréquence d'exécution</h2>

      <p>Certains événements (scroll, resize, keyup) se déclenchent des dizaines de fois par seconde. Exécuter une fonction coûteuse à chaque événement peut freezer l'interface. Debounce et throttle sont les deux solutions.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// DEBOUNCE : attend que l'utilisateur arrête d'agir</span>
<span class="cmt">// Analogie : minuterie qui se réinitialise à chaque frappe</span>
<span class="cmt">// Si silence > délai → exécute. Idéal pour : recherche en temps réel</span>
<span class="kw">function</span> <span class="fn">debounce</span>(fn, delaiMs) {
  <span class="kw">let</span> timer <span class="op">=</span> <span class="kw">null</span>;
  <span class="kw">return</span> <span class="kw">function</span>(...args) {
    <span class="fn">clearTimeout</span>(timer);
    timer <span class="op">=</span> <span class="fn">setTimeout</span>(() <span class="op">=></span> <span class="fn">fn</span>.<span class="fn">apply</span>(<span class="kw">this</span>, args), delaiMs);
  };
}

<span class="cmt">// Usage : chercher seulement 300ms après la dernière frappe</span>
<span class="kw">const</span> rechercherDebounced <span class="op">=</span> <span class="fn">debounce</span>((terme) <span class="op">=></span> {
  console.<span class="fn">log</span>(<span class="str">\`Recherche: "\${terme}"\`</span>);
  <span class="cmt">// appel API...</span>
}, <span class="num">300</span>);

<span class="cmt">// Typing "hello" → 5 événements mais UN SEUL appel API</span>
input.<span class="fn">addEventListener</span>(<span class="str">"input"</span>, e <span class="op">=></span> <span class="fn">rechercherDebounced</span>(e.target.value));</pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// THROTTLE : exécute au maximum une fois par intervalle</span>
<span class="cmt">// Analogie : une soupape qui laisse passer une requête max par seconde</span>
<span class="cmt">// Idéal pour : scroll tracking, resize, jeux</span>
<span class="kw">function</span> <span class="fn">throttle</span>(fn, intervalleMs) {
  <span class="kw">let</span> dernierAppel <span class="op">=</span> <span class="num">0</span>;
  <span class="kw">return</span> <span class="kw">function</span>(...args) {
    <span class="kw">const</span> maintenant <span class="op">=</span> <span class="cls">Date</span>.<span class="fn">now</span>();
    <span class="kw">if</span> (maintenant <span class="op">-</span> dernierAppel <span class="op">>=</span> intervalleMs) {
      dernierAppel <span class="op">=</span> maintenant;
      <span class="fn">fn</span>.<span class="fn">apply</span>(<span class="kw">this</span>, args);
    }
  };
}

<span class="cmt">// Usage : position de scroll max 10 fois par seconde</span>
<span class="kw">const</span> onScrollThrottled <span class="op">=</span> <span class="fn">throttle</span>(() <span class="op">=></span> {
  console.<span class="fn">log</span>(<span class="str">\`scrollY: \${window.scrollY}\`</span>);
}, <span class="num">100</span>);

window.<span class="fn">addEventListener</span>(<span class="str">"scroll"</span>, onScrollThrottled);

<span class="cmt">// Comparaison :
// Debounce : attend la fin de l'activité, puis exécute UNE fois
// Throttle  : exécute régulièrement pendant l'activité</span></pre>
      </div>

      <h2>WeakRef et FinalizationRegistry — Mémoire avancée</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// WeakRef : référence qui n'empêche PAS le Garbage Collector</span>
<span class="kw">let</span> objetLourd <span class="op">=</span> { data: <span class="kw">new</span> <span class="cls">Array</span>(<span class="num">1_000_000</span>).<span class="fn">fill</span>(<span class="num">0</span>) };
<span class="kw">const</span> ref <span class="op">=</span> <span class="kw">new</span> <span class="cls">WeakRef</span>(objetLourd);

<span class="cmt">// Utiliser l'objet via deref()</span>
<span class="kw">const</span> donnees <span class="op">=</span> ref.<span class="fn">deref</span>();
<span class="kw">if</span> (donnees) {
  console.<span class="fn">log</span>(donnees.data.length); <span class="cmt">// 1_000_000</span>
}

<span class="cmt">// Si on libère la seule référence forte :</span>
objetLourd <span class="op">=</span> <span class="kw">null</span>;
<span class="cmt">// Le GC PEUT maintenant collecter l'objet</span>
<span class="cmt">// ref.deref() retournera undefined après la collecte</span>

<span class="cmt">// FinalizationRegistry : être notifié quand un objet est GC</span>
<span class="kw">const</span> registry <span class="op">=</span> <span class="kw">new</span> <span class="cls">FinalizationRegistry</span>((cle) <span class="op">=></span> {
  console.<span class="fn">log</span>(<span class="str">\`Objet \${cle} collecté par le GC\`</span>);
  cache.<span class="fn">delete</span>(cle); <span class="cmt">// nettoyer le cache</span>
});

<span class="kw">function</span> <span class="fn">creerEtEnregistrer</span>(cle, objet) {
  registry.<span class="fn">register</span>(objet, cle);
  <span class="kw">return</span> <span class="kw">new</span> <span class="cls">WeakRef</span>(objet);
}</pre>
      </div>

      <div class="info-box warning">
        <div class="info-icon">⚠️</div>
        <p><code>WeakRef</code> et <code>FinalizationRegistry</code> sont des outils avancés. N'en dépendez pas pour la logique métier — le moment de collecte GC est imprévisible. Utilisez-les seulement pour des optimisations mémoire (caches, etc.).</p>
      </div>

      <div class="challenge-block">
        <h3>Défi : Scheduler de tâches</h3>
        <p>Implémentez un scheduler qui exécute des tâches par batch pour éviter de bloquer le thread principal. Utilisez <code>setTimeout(fn, 0)</code> pour céder la main à l'Event Loop entre chaque batch.</p>
        <pre><span class="kw">async function</span> <span class="fn">traiterParBatch</span>(items, traiteur, taillesBatch <span class="op">=</span> <span class="num">100</span>) {
  <span class="kw">const</span> resultats <span class="op">=</span> [];

  <span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;</span> items.length; i <span class="op">+=</span> taillesBatch) {
    <span class="kw">const</span> batch <span class="op">=</span> items.<span class="fn">slice</span>(i, i <span class="op">+</span> taillesBatch);

    <span class="cmt">// Traiter le batch</span>
    <span class="kw">const</span> batchResultats <span class="op">=</span> batch.<span class="fn">map</span>(traiteur);
    resultats.<span class="fn">push</span>(...batchResultats);

    <span class="cmt">// Céder la main à l'Event Loop (permet le rendu UI)</span>
    <span class="kw">await new</span> <span class="cls">Promise</span>(resolve <span class="op">=></span> <span class="fn">setTimeout</span>(resolve, <span class="num">0</span>));

    <span class="kw">const</span> pct <span class="op">=</span> <span class="cls">Math</span>.<span class="fn">min</span>(((i <span class="op">+</span> taillesBatch) <span class="op">/</span> items.length <span class="op">*</span> <span class="num">100</span>), <span class="num">100</span>);
    console.<span class="fn">log</span>(<span class="str">\`Progression: \${pct.<span class="fn">toFixed</span>(0)}%\`</span>);
  }

  <span class="kw">return</span> resultats;
}

<span class="cmt">// Usage : traiter 100 000 items sans freezer l'UI</span>
<span class="kw">const</span> donnees <span class="op">=</span> <span class="cls">Array</span>.<span class="fn">from</span>({ length: <span class="num">100_000</span> }, (_, i) <span class="op">=></span> i);
<span class="kw">const</span> resultats <span class="op">=</span> <span class="kw">await</span> <span class="fn">traiterParBatch</span>(
  donnees,
  n <span class="op">=></span> n <span class="op">*</span> n, <span class="cmt">// traitement par élément</span>
  <span class="num">1000</span>         <span class="cmt">// taille du batch</span>
);</pre>
      </div>
    `,
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
      }
    ]
};
