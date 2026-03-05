export default {
    id: 15,
    title: 'Patterns Fonctionnels',
    icon: '🧠',
    level: 'Maître',
    stars: '★★★★★',
    content: () => `
      <div class="chapter-tag">Chapitre 15 · Maître</div>
      <h1>JavaScript<br><span class="highlight">Fonctionnel</span></h1>
      <div class="chapter-intro-card">
        <div class="level-badge level-master">🧠</div>
        <div class="chapter-meta">
          <div class="difficulty-stars" style="color:var(--danger)">★★★★★</div>
          <h3>Philosophie FP, currying, compose/pipe, mémoïsation, transducers, monades</h3>
          <p>Durée estimée : 55 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>La <strong>programmation fonctionnelle</strong> (FP) n'est pas un langage ni un framework — c'est une philosophie de conception. Elle repose sur trois piliers : <strong>l'immutabilité</strong> (ne pas modifier les données), les <strong>fonctions pures</strong> (même entrée → même sortie, pas d'effets de bord), et la <strong>composition</strong> (construire des comportements complexes en combinant des fonctions simples).</p>

      <h2>La philosophie FP — Pourquoi immuabilité et pureté</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Style IMPÉRATIF : on dit COMMENT faire</span>
<span class="kw">const</span> produits <span class="op">=</span> [
  { nom: <span class="str">"Stylo"</span>, prix: <span class="num">2</span>, stock: <span class="num">50</span> },
  { nom: <span class="str">"Cahier"</span>, prix: <span class="num">5</span>, stock: <span class="num">0</span> },
  { nom: <span class="str">"Règle"</span>, prix: <span class="num">3</span>, stock: <span class="num">20</span> },
];

<span class="cmt">// Impératif : mutation, variables temporaires</span>
<span class="kw">let</span> total <span class="op">=</span> <span class="num">0</span>;
<span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;</span> produits.length; i<span class="op">++</span>) {
  <span class="kw">if</span> (produits[i].stock <span class="op">></span> <span class="num">0</span>) {
    total <span class="op">+=</span> produits[i].prix;
  }
}

<span class="cmt">// Style DÉCLARATIF (FP) : on dit QUOI faire</span>
<span class="kw">const</span> totalFP <span class="op">=</span> produits
  .<span class="fn">filter</span>(p <span class="op">=></span> p.stock <span class="op">></span> <span class="num">0</span>)           <span class="cmt">// garder en stock</span>
  .<span class="fn">map</span>(p <span class="op">=></span> p.prix)                   <span class="cmt">// extraire les prix</span>
  .<span class="fn">reduce</span>((acc, p) <span class="op">=></span> acc <span class="op">+</span> p, <span class="num">0</span>); <span class="cmt">// additionner</span>

<span class="cmt">// FP : lisible comme de la prose, sans variable temporaire muable</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Immutabilité : toujours retourner de nouvelles valeurs</span>
<span class="kw">const</span> state <span class="op">=</span> { utilisateurs: [<span class="str">"Alice"</span>, <span class="str">"Bob"</span>], theme: <span class="str">"light"</span> };

<span class="cmt">// ❌ Mutation directe</span>
state.utilisateurs.<span class="fn">push</span>(<span class="str">"Clara"</span>); <span class="cmt">// mute state !</span>
state.theme <span class="op">=</span> <span class="str">"dark"</span>;

<span class="cmt">// ✅ Immutable updates</span>
<span class="kw">const</span> newState <span class="op">=</span> {
  ...state,
  utilisateurs: [...state.utilisateurs, <span class="str">"Clara"</span>],
  theme: <span class="str">"dark"</span>
};
<span class="cmt">// state est intact, newState est un nouvel objet</span>

<span class="cmt">// Mise à jour imbriquée (immutable)</span>
<span class="kw">const</span> config <span class="op">=</span> { ui: { sidebar: { open: <span class="kw">true</span>, width: <span class="num">250</span> } } };
<span class="kw">const</span> newConfig <span class="op">=</span> {
  ...config,
  ui: { ...config.ui, sidebar: { ...config.ui.sidebar, open: <span class="kw">false</span> } }
};</pre>
      </div>

      <h2>Currying — Pré-charger des arguments</h2>

      <p>Le currying transforme une fonction à N arguments en une chaîne de fonctions à 1 argument. C'est comme une usine de fonctions spécialisées. Intuitivement, imaginez commander un sandwich : au lieu de tout spécifier d'un coup, vous pré-sélectionnez le pain, puis la garniture, puis les extras.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Sans currying</span>
<span class="kw">const</span> <span class="fn">add</span> <span class="op">=</span> (a, b) <span class="op">=></span> a <span class="op">+</span> b;
<span class="fn">add</span>(<span class="num">2</span>, <span class="num">3</span>); <span class="cmt">// 5</span>

<span class="cmt">// Currifiée manuellement : a => b => a + b</span>
<span class="kw">const</span> <span class="fn">addC</span> <span class="op">=</span> (a) <span class="op">=></span> (b) <span class="op">=></span> a <span class="op">+</span> b;

<span class="cmt">// Application partielle : fixer le premier argument</span>
<span class="kw">const</span> <span class="fn">add10</span>  <span class="op">=</span> <span class="fn">addC</span>(<span class="num">10</span>);  <span class="cmt">// b => 10 + b</span>
<span class="kw">const</span> <span class="fn">add100</span> <span class="op">=</span> <span class="fn">addC</span>(<span class="num">100</span>); <span class="cmt">// b => 100 + b</span>

<span class="fn">add10</span>(<span class="num">5</span>);   <span class="cmt">// 15</span>
<span class="fn">add100</span>(<span class="num">7</span>);  <span class="cmt">// 107</span>

<span class="cmt">// Cas concret : filtres réutilisables</span>
<span class="kw">const</span> <span class="fn">superieurA</span> <span class="op">=</span> (min) <span class="op">=></span> (n) <span class="op">=></span> n <span class="op">></span> min;
<span class="kw">const</span> <span class="fn">superieurA5</span>  <span class="op">=</span> <span class="fn">superieurA</span>(<span class="num">5</span>);
<span class="kw">const</span> <span class="fn">superieurA10</span> <span class="op">=</span> <span class="fn">superieurA</span>(<span class="num">10</span>);

[<span class="num">1</span>, <span class="num">5</span>, <span class="num">7</span>, <span class="num">12</span>].<span class="fn">filter</span>(<span class="fn">superieurA5</span>);  <span class="cmt">// [7, 12]</span>
[<span class="num">1</span>, <span class="num">5</span>, <span class="num">7</span>, <span class="num">12</span>].<span class="fn">filter</span>(<span class="fn">superieurA10</span>); <span class="cmt">// [12]</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// curry() générique : accepte n'importe quelle arité</span>
<span class="kw">const</span> <span class="fn">curry</span> <span class="op">=</span> (fn) <span class="op">=></span> {
  <span class="kw">const</span> arité <span class="op">=</span> fn.length;
  <span class="kw">return</span> <span class="kw">function</span> <span class="fn">currié</span>(...args) {
    <span class="kw">return</span> args.length <span class="op">>=</span> arité
      ? <span class="fn">fn</span>(...args)                           <span class="cmt">// assez d'args → appeler</span>
      : (...plus) <span class="op">=></span> <span class="fn">currié</span>(...args, ...plus); <span class="cmt">// sinon → attendre</span>
  };
};

<span class="kw">const</span> <span class="fn">multiply</span> <span class="op">=</span> <span class="fn">curry</span>((a, b, c) <span class="op">=></span> a <span class="op">*</span> b <span class="op">*</span> c);

<span class="fn">multiply</span>(<span class="num">2</span>)(<span class="num">3</span>)(<span class="num">4</span>); <span class="cmt">// 24</span>
<span class="fn">multiply</span>(<span class="num">2</span>, <span class="num">3</span>)(<span class="num">4</span>); <span class="cmt">// 24</span>
<span class="fn">multiply</span>(<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>); <span class="cmt">// 24</span>

<span class="kw">const</span> <span class="fn">doubler</span>  <span class="op">=</span> <span class="fn">multiply</span>(<span class="num">2</span>);    <span class="cmt">// (b, c) => 2 * b * c</span>
<span class="kw">const</span> <span class="fn">doubler6</span> <span class="op">=</span> <span class="fn">multiply</span>(<span class="num">2</span>, <span class="num">3</span>); <span class="cmt">// c => 2 * 3 * c = 6 * c</span>
<span class="fn">doubler6</span>(<span class="num">5</span>); <span class="cmt">// 30</span></pre>
      </div>

      <h2>compose et pipe — Construire des pipelines de transformation</h2>

      <p><strong>compose</strong> applique des fonctions de droite à gauche (ordre mathématique). <strong>pipe</strong> applique de gauche à droite (ordre de lecture naturel). Les deux permettent de créer des transformations complexes à partir de fonctions simples.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// compose : droite à gauche   compose(f, g, h)(x) = f(g(h(x)))</span>
<span class="kw">const</span> <span class="fn">compose</span> <span class="op">=</span> (...fns) <span class="op">=></span> (x) <span class="op">=></span>
  fns.<span class="fn">reduceRight</span>((val, fn) <span class="op">=></span> <span class="fn">fn</span>(val), x);

<span class="cmt">// pipe    : gauche à droite   pipe(f, g, h)(x) = h(g(f(x)))</span>
<span class="kw">const</span> <span class="fn">pipe</span> <span class="op">=</span> (...fns) <span class="op">=></span> (x) <span class="op">=></span>
  fns.<span class="fn">reduce</span>((val, fn) <span class="op">=></span> <span class="fn">fn</span>(val), x);

<span class="cmt">// Fonctions simples et pures</span>
<span class="kw">const</span> <span class="fn">nettoyer</span>    <span class="op">=</span> (s) <span class="op">=></span> s.<span class="fn">trim</span>();
<span class="kw">const</span> <span class="fn">minuscules</span>  <span class="op">=</span> (s) <span class="op">=></span> s.<span class="fn">toLowerCase</span>();
<span class="kw">const</span> <span class="fn">enleverAccents</span> <span class="op">=</span> (s) <span class="op">=></span> s.<span class="fn">normalize</span>(<span class="str">"NFD"</span>).<span class="fn">replace</span>(<span class="op">/</span>[\u0300-\u036f]<span class="op">/</span>g, <span class="str">""</span>);
<span class="kw">const</span> <span class="fn">slug</span>        <span class="op">=</span> (s) <span class="op">=></span> s.<span class="fn">replace</span>(<span class="op">/</span>\s<span class="op">+/</span>g, <span class="str">"-"</span>);

<span class="cmt">// Composer en pipeline lisible</span>
<span class="kw">const</span> <span class="fn">versSlug</span> <span class="op">=</span> <span class="fn">pipe</span>(nettoyer, minuscules, enleverAccents, slug);

<span class="fn">versSlug</span>(<span class="str">"  Bonjour le Monde !  "</span>); <span class="cmt">// "bonjour-le-monde-!"</span>
<span class="fn">versSlug</span>(<span class="str">"Programmation Fonctionnelle"</span>); <span class="cmt">// "programmation-fonctionnelle"</span></pre>
      </div>

      <h2>Mémoïsation — Cacher les résultats coûteux</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Mémoïsation : mettre en cache les résultats</span>
<span class="kw">function</span> <span class="fn">memoize</span>(fn) {
  <span class="kw">const</span> cache <span class="op">=</span> <span class="kw">new</span> <span class="cls">Map</span>();
  <span class="kw">return</span> <span class="kw">function</span>(...args) {
    <span class="kw">const</span> cle <span class="op">=</span> <span class="cls">JSON</span>.<span class="fn">stringify</span>(args);
    <span class="kw">if</span> (cache.<span class="fn">has</span>(cle)) <span class="kw">return</span> cache.<span class="fn">get</span>(cle);
    <span class="kw">const</span> résultat <span class="op">=</span> fn.<span class="fn">apply</span>(<span class="kw">this</span>, args);
    cache.<span class="fn">set</span>(cle, résultat);
    <span class="kw">return</span> résultat;
  };
}

<span class="cmt">// Fibonacci récursif : O(2^n) sans mémo, O(n) avec</span>
<span class="kw">const</span> <span class="fn">fib</span> <span class="op">=</span> <span class="fn">memoize</span>(<span class="kw">function</span>(n) {
  <span class="kw">if</span> (n <span class="op">&lt;=</span> <span class="num">1</span>) <span class="kw">return</span> n;
  <span class="kw">return</span> <span class="fn">fib</span>(n <span class="op">-</span> <span class="num">1</span>) <span class="op">+</span> <span class="fn">fib</span>(n <span class="op">-</span> <span class="num">2</span>);
});

console.<span class="fn">time</span>(<span class="str">"fib"</span>);
<span class="fn">fib</span>(<span class="num">40</span>); <span class="cmt">// Instantané avec mémo</span>
console.<span class="fn">timeEnd</span>(<span class="str">"fib"</span>);

<span class="cmt">// Mémoïsation avec WeakMap (pour les arguments objets)</span>
<span class="kw">function</span> <span class="fn">memoizeWeak</span>(fn) {
  <span class="kw">const</span> cache <span class="op">=</span> <span class="kw">new</span> <span class="cls">WeakMap</span>();
  <span class="kw">return</span> (obj) <span class="op">=></span> {
    <span class="kw">if</span> (<span class="op">!</span>cache.<span class="fn">has</span>(obj)) cache.<span class="fn">set</span>(obj, <span class="fn">fn</span>(obj));
    <span class="kw">return</span> cache.<span class="fn">get</span>(obj);
  };
}
<span class="cmt">// Quand obj est GC, le cache se vide automatiquement !</span></pre>
      </div>

      <h2>Transducers — Composer des reducers efficacement</h2>

      <p>Un <strong>transducer</strong> est un reducer transformé — une fonction qui prend un reducer et retourne un reducer transformé. L'avantage : composer map, filter, et autres transformations en UN SEUL passage sur les données (O(n) au lieu de O(n*k)).</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Sans transducers : 3 passages sur les données</span>
[<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">4</span>,<span class="num">5</span>,<span class="num">6</span>,<span class="num">7</span>,<span class="num">8</span>,<span class="num">9</span>,<span class="num">10</span>]
  .<span class="fn">filter</span>(n <span class="op">=></span> n <span class="op">%</span> <span class="num">2</span> <span class="op">===</span> <span class="num">0</span>)  <span class="cmt">// passage 1</span>
  .<span class="fn">map</span>(n <span class="op">=></span> n <span class="op">*</span> <span class="num">3</span>)           <span class="cmt">// passage 2</span>
  .<span class="fn">filter</span>(n <span class="op">=></span> n <span class="op">></span> <span class="num">10</span>);     <span class="cmt">// passage 3</span>

<span class="cmt">// Avec transducers : UN SEUL passage</span>
<span class="kw">const</span> <span class="fn">filtering</span> <span class="op">=</span> (pred) <span class="op">=></span> (reducer) <span class="op">=></span> (acc, val) <span class="op">=></span>
  pred(val) ? <span class="fn">reducer</span>(acc, val) : acc;

<span class="kw">const</span> <span class="fn">mapping</span> <span class="op">=</span> (fn) <span class="op">=></span> (reducer) <span class="op">=></span> (acc, val) <span class="op">=></span>
  <span class="fn">reducer</span>(acc, <span class="fn">fn</span>(val));

<span class="kw">const</span> <span class="fn">transduce</span> <span class="op">=</span> (transducer, reducer, init, collection) <span class="op">=></span>
  collection.<span class="fn">reduce</span>(<span class="fn">transducer</span>(reducer), init);

<span class="cmt">// Composer les transducers (ordre naturel avec compose)</span>
<span class="kw">const</span> <span class="fn">xform</span> <span class="op">=</span> <span class="fn">compose</span>(
  <span class="fn">filtering</span>(n <span class="op">=></span> n <span class="op">%</span> <span class="num">2</span> <span class="op">===</span> <span class="num">0</span>), <span class="cmt">// filtre pairs</span>
  <span class="fn">mapping</span>(n <span class="op">=></span> n <span class="op">*</span> <span class="num">3</span>),          <span class="cmt">// multiplie par 3</span>
  <span class="fn">filtering</span>(n <span class="op">=></span> n <span class="op">></span> <span class="num">10</span>)       <span class="cmt">// garde > 10</span>
);

<span class="kw">const</span> result <span class="op">=</span> <span class="fn">transduce</span>(xform, (acc, v) <span class="op">=></span> [...acc, v], [], [<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">4</span>,<span class="num">5</span>,<span class="num">6</span>,<span class="num">7</span>,<span class="num">8</span>,<span class="num">9</span>,<span class="num">10</span>]);
<span class="cmt">// [12, 18, 24, 30] — UN SEUL passage !</span></pre>
      </div>

      <h2>La monade Maybe — Gérer null sans if partout</h2>

      <p>Une <em>monade</em> est un design pattern fonctionnel qui encapsule une valeur et fournit des méthodes pour travailler avec elle de façon sûre. La monade <code>Maybe</code> encapsule une valeur qui peut être <code>null</code> ou <code>undefined</code>, et court-circuite toutes les opérations si la valeur est absente.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Maybe monade : une boîte qui sait se comporter quand elle est vide</span>
<span class="kw">class</span> <span class="cls">Maybe</span> {
  <span class="fn">constructor</span>(valeur) {
    <span class="kw">this</span>._valeur <span class="op">=</span> valeur;
  }

  <span class="kw">static</span> <span class="fn">of</span>(valeur)   { <span class="kw">return</span> <span class="kw">new</span> <span class="cls">Maybe</span>(valeur); }
  <span class="kw">static</span> <span class="fn">empty</span>()     { <span class="kw">return</span> <span class="kw">new</span> <span class="cls">Maybe</span>(<span class="kw">null</span>); }

  <span class="fn">estVide</span>()  { <span class="kw">return</span> <span class="kw">this</span>._valeur <span class="op">==</span> <span class="kw">null</span>; }

  <span class="cmt">// map : applique fn si non-vide, sinon ne fait rien</span>
  <span class="fn">map</span>(fn) {
    <span class="kw">return</span> <span class="kw">this</span>.<span class="fn">estVide</span>()
      ? <span class="cls">Maybe</span>.<span class="fn">empty</span>()
      : <span class="cls">Maybe</span>.<span class="fn">of</span>(<span class="fn">fn</span>(<span class="kw">this</span>._valeur));
  }

  <span class="cmt">// getOrElse : extraire la valeur ou un défaut</span>
  <span class="fn">getOrElse</span>(défaut) {
    <span class="kw">return</span> <span class="kw">this</span>.<span class="fn">estVide</span>() ? défaut : <span class="kw">this</span>._valeur;
  }

  <span class="cmt">// chain/flatMap : évite le Maybe(Maybe(val))</span>
  <span class="fn">chain</span>(fn) {
    <span class="kw">return</span> <span class="kw">this</span>.<span class="fn">estVide</span>() ? <span class="cls">Maybe</span>.<span class="fn">empty</span>() : <span class="fn">fn</span>(<span class="kw">this</span>._valeur);
  }
}

<span class="cmt">// Sans Maybe : vérifications null partout</span>
<span class="kw">function</span> <span class="fn">getVilleSansMonade</span>(user) {
  <span class="kw">if</span> (user <span class="op">&amp;&amp;</span> user.adresse <span class="op">&amp;&amp;</span> user.adresse.ville) {
    <span class="kw">return</span> user.adresse.ville.<span class="fn">toUpperCase</span>();
  }
  <span class="kw">return</span> <span class="str">"INCONNUE"</span>;
}

<span class="cmt">// Avec Maybe : pipeline propre, zéro vérification null</span>
<span class="kw">const</span> <span class="fn">getVille</span> <span class="op">=</span> (user) <span class="op">=></span>
  <span class="cls">Maybe</span>.<span class="fn">of</span>(user)
    .<span class="fn">chain</span>(u <span class="op">=></span> <span class="cls">Maybe</span>.<span class="fn">of</span>(u.adresse))
    .<span class="fn">chain</span>(a <span class="op">=></span> <span class="cls">Maybe</span>.<span class="fn">of</span>(a.ville))
    .<span class="fn">map</span>(v <span class="op">=></span> v.<span class="fn">toUpperCase</span>())
    .<span class="fn">getOrElse</span>(<span class="str">"INCONNUE"</span>);

<span class="fn">getVille</span>({ adresse: { ville: <span class="str">"Paris"</span> } }); <span class="cmt">// "PARIS"</span>
<span class="fn">getVille</span>({ adresse: <span class="kw">null</span> });                <span class="cmt">// "INCONNUE"</span>
<span class="fn">getVille</span>(<span class="kw">null</span>);                              <span class="cmt">// "INCONNUE"</span></pre>
      </div>

      <h2>FP Pratique — Patterns dans React et JS moderne</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Partial application : créer des variantes spécialisées</span>
<span class="kw">const</span> <span class="fn">creerValidateur</span> <span class="op">=</span> (min, max) <span class="op">=></span> (valeur) <span class="op">=></span>
  valeur <span class="op">>=</span> min <span class="op">&amp;&amp;</span> valeur <span class="op">&lt;=</span> max;

<span class="kw">const</span> <span class="fn">estAge</span>   <span class="op">=</span> <span class="fn">creerValidateur</span>(<span class="num">0</span>, <span class="num">150</span>);
<span class="kw">const</span> <span class="fn">estScore</span> <span class="op">=</span> <span class="fn">creerValidateur</span>(<span class="num">0</span>, <span class="num">100</span>);
<span class="kw">const</span> <span class="fn">estNote</span>  <span class="op">=</span> <span class="fn">creerValidateur</span>(<span class="num">1</span>, <span class="num">5</span>);

<span class="fn">estAge</span>(<span class="num">25</span>);    <span class="cmt">// true</span>
<span class="fn">estScore</span>(<span class="num">150</span>); <span class="cmt">// false</span>

<span class="cmt">// Point-free style : fonctions sans mentionner leurs arguments</span>
<span class="kw">const</span> doubles <span class="op">=</span> [<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>].<span class="fn">map</span>(x <span class="op">=></span> x <span class="op">*</span> <span class="num">2</span>); <span class="cmt">// avec argument</span>
<span class="kw">const</span> <span class="fn">doubler</span> <span class="op">=</span> <span class="fn">curry</span>((a, b) <span class="op">=></span> a <span class="op">*</span> b)(<span class="num">2</span>);
<span class="kw">const</span> doubles2 <span class="op">=</span> [<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>].<span class="fn">map</span>(doubler);     <span class="cmt">// point-free</span>

<span class="cmt">// Reducer pattern : FP + Redux-like</span>
<span class="kw">const</span> <span class="fn">todoReducer</span> <span class="op">=</span> (state <span class="op">=</span> [], action) <span class="op">=></span> {
  <span class="kw">const</span> handlers <span class="op">=</span> {
    ADD:    (s, a) <span class="op">=></span> [...s, { id: <span class="cls">Date</span>.<span class="fn">now</span>(), texte: a.texte, fait: <span class="kw">false</span> }],
    REMOVE: (s, a) <span class="op">=></span> s.<span class="fn">filter</span>(t <span class="op">=></span> t.id <span class="op">!==</span> a.id),
    TOGGLE: (s, a) <span class="op">=></span> s.<span class="fn">map</span>(t <span class="op">=></span> t.id <span class="op">===</span> a.id ? { ...t, fait: <span class="op">!</span>t.fait } : t),
  };
  <span class="kw">return</span> (handlers[action.type] <span class="op">??</span> (s <span class="op">=></span> s))(state, action);
};</pre>
      </div>

      <div class="info-box success">
        <div class="info-icon">🎯</div>
        <p>La FP n'est pas "tout ou rien". Dans le code React quotidien, vous utilisez déjà de la FP : les hooks (useState, useReducer), les components purs, les sélecteurs Redux, les opérateurs RxJS. Comprendre les principes FP rend ces outils infiniment plus clairs.</p>
      </div>

      <div class="challenge-block">
        <h3>Défi Final : Système de traitement de commandes</h3>
        <p>En utilisant uniquement des fonctions pures, pipe, curry et Maybe, construisez un pipeline de traitement de commandes e-commerce.</p>
        <pre><span class="cmt">// Fonctions pures de validation et transformation</span>
<span class="kw">const</span> <span class="fn">validerCommande</span> <span class="op">=</span> (commande) <span class="op">=></span>
  <span class="cls">Maybe</span>.<span class="fn">of</span>(commande)
    .<span class="fn">chain</span>(c <span class="op">=></span> c.items.length <span class="op">></span> <span class="num">0</span> ? <span class="cls">Maybe</span>.<span class="fn">of</span>(c) : <span class="cls">Maybe</span>.<span class="fn">empty</span>());

<span class="kw">const</span> <span class="fn">appliquerRemise</span> <span class="op">=</span> <span class="fn">curry</span>((pct, commande) <span class="op">=></span> ({
  ...commande,
  total: commande.total <span class="op">*</span> (<span class="num">1</span> <span class="op">-</span> pct <span class="op">/</span> <span class="num">100</span>)
}));

<span class="kw">const</span> <span class="fn">ajouterTVA</span> <span class="op">=</span> (taux) <span class="op">=></span> (commande) <span class="op">=></span> ({
  ...commande,
  total: commande.total <span class="op">*</span> (<span class="num">1</span> <span class="op">+</span> taux)
});

<span class="cmt">// Pipeline complet</span>
<span class="kw">const</span> <span class="fn">traiterCommande</span> <span class="op">=</span> <span class="fn">pipe</span>(
  <span class="fn">validerCommande</span>,
  m <span class="op">=></span> m.<span class="fn">map</span>(<span class="fn">appliquerRemise</span>(<span class="num">10</span>)),  <span class="cmt">// 10% de remise</span>
  m <span class="op">=></span> m.<span class="fn">map</span>(<span class="fn">ajouterTVA</span>(<span class="num">0.2</span>)),      <span class="cmt">// TVA 20%</span>
  m <span class="op">=></span> m.<span class="fn">getOrElse</span>(<span class="kw">null</span>)
);

<span class="kw">const</span> commande <span class="op">=</span> { items: [<span class="str">"livre"</span>], total: <span class="num">100</span> };
console.<span class="fn">log</span>(<span class="fn">traiterCommande</span>(commande));
<span class="cmt">// { items: ["livre"], total: 108 }  (100 * 0.9 * 1.2)</span>

console.<span class="fn">log</span>(<span class="fn">traiterCommande</span>({ items: [], total: <span class="num">0</span> }));
<span class="cmt">// null (commande vide → Maybe.empty)</span></pre>
      </div>
    `,
    quiz: [
      {
        question: "Quelle est la différence entre pipe et compose ?",
        sub: "Composition fonctionnelle",
        options: [
          "pipe est asynchrone, compose est synchrone",
          "pipe applique les fonctions de gauche à droite (ordre naturel), compose de droite à gauche (ordre mathématique)",
          "compose accepte plus de fonctions que pipe",
          "Il n'y a aucune différence fonctionnelle"
        ],
        correct: 1,
        explanation: "✅ Parfait ! pipe(f, g, h)(x) = h(g(f(x))) — vous lisez dans l'ordre naturel. compose(f, g, h)(x) = f(g(h(x))) — ordre mathématique, h s'applique en premier. Les deux composent des fonctions, la direction est différente. En pratique, pipe est plus intuitif."
      },
      {
        question: "Qu'est-ce que le currying et quel est son principal avantage ?",
        sub: "Currying et application partielle",
        options: [
          "Convertir une fonction synchrone en fonction asynchrone",
          "Transformer une fonction à N arguments en chaîne de fonctions à 1 argument, permettant l'application partielle pour créer des fonctions spécialisées",
          "Mémoriser les résultats d'une fonction pour les appels futurs",
          "Exécuter plusieurs fonctions en parallèle"
        ],
        correct: 1,
        explanation: "✅ Exact ! Le currying permet l'application partielle : fixer certains arguments à l'avance pour créer des fonctions spécialisées. add(2) retourne une fonction b => 2 + b. Cela favorise la réutilisabilité et la composition."
      },
      {
        question: "Quelle est la définition d'une monade en programmation fonctionnelle ?",
        sub: "Concept de monade",
        options: [
          "Une classe qui hérite d'une autre classe",
          "Un conteneur qui encapsule une valeur et fournit des méthodes (map, chain) pour transformer cette valeur de façon sûre, en gérant les cas particuliers (null, erreur, async)",
          "Une fonction qui s'appelle elle-même",
          "Un objet avec uniquement des méthodes statiques"
        ],
        correct: 1,
        explanation: "✅ Exact ! Une monade est un wrapper avec map() et chain() (flatMap). La Maybe monade encapsule une valeur potentiellement null et court-circuite les transformations si elle est vide. Les Promises sont des monades async ! Comprendre ce pattern explique pourquoi .then() et .catch() fonctionnent comme ils le font."
      }
    ]
};
