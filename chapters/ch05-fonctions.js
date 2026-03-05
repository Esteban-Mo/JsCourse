export default {
    id: 5,
    title: 'Fonctions',
    icon: '🧩',
    level: 'Intermédiaire',
    stars: '★★★★☆',
    content: () => `
      <div class="chapter-tag">Chapitre 05 · Fonctions</div>
      <h1>Fonctions &<br><span class="highlight">Closures</span></h1>

      <div class="chapter-intro-card">
        <div class="level-badge level-intermediate">🧩</div>
        <div class="chapter-meta">
          <div class="difficulty-stars">★★★★☆</div>
          <h3>First-class, déclarations, this, closures, fonctions pures, HOF</h3>
          <p>Durée estimée : 35 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>En JavaScript, les fonctions sont des <strong>citoyens de première classe</strong> (<em>first-class citizens</em>). Cela signifie qu'une fonction est une valeur comme une autre : elle peut être stockée dans une variable, passée comme argument, retournée par une autre fonction. C'est ce qui rend JavaScript si expressif.</p>

      <h2>Les trois façons de déclarer une fonction</h2>

      <p>Il existe trois syntaxes principales, et leurs différences ne sont pas seulement esthétiques — elles ont des comportements distincts.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// 1. Déclaration de fonction (function declaration)</span>
<span class="cmt">// → HOISTÉE : disponible avant sa définition dans le code</span>
<span class="fn">saluer</span>(<span class="str">"Alice"</span>); <span class="cmt">// ✅ fonctionne ! (hoisting)</span>

<span class="kw">function</span> <span class="fn">saluer</span>(prenom) {
  <span class="kw">return</span> <span class="str">\`Bonjour, \${prenom} !\`</span>;
}

<span class="cmt">// 2. Expression de fonction (function expression)</span>
<span class="cmt">// → NON hoistée : disponible seulement après l'assignation</span>
<span class="kw">const</span> <span class="fn">saluer2</span> <span class="op">=</span> <span class="kw">function</span>(prenom) {
  <span class="kw">return</span> <span class="str">\`Salut, \${prenom} !\`</span>;
};
<span class="cmt">// saluer2("Bob") avant cette ligne → ReferenceError</span>

<span class="cmt">// 3. Fonction fléchée (arrow function, ES6)</span>
<span class="cmt">// → NON hoistée, PAS de this propre, syntaxe concise</span>
<span class="kw">const</span> <span class="fn">saluer3</span> <span class="op">=</span> (prenom) <span class="op">=></span> <span class="str">\`Hey, \${prenom} !\`</span>;

<span class="cmt">// Syntaxes raccourcies de l'arrow function</span>
<span class="kw">const</span> <span class="fn">double</span> <span class="op">=</span> x <span class="op">=></span> x <span class="op">*</span> <span class="num">2</span>;           <span class="cmt">// un paramètre, pas de parenthèses</span>
<span class="kw">const</span> <span class="fn">add</span>    <span class="op">=</span> (a, b) <span class="op">=></span> a <span class="op">+</span> b;       <span class="cmt">// return implicite</span>
<span class="kw">const</span> <span class="fn">getObj</span> <span class="op">=</span> () <span class="op">=></span> ({ key: <span class="str">"val"</span> }); <span class="cmt">// retourner un objet: entourer de ()</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>Le <strong>hoisting</strong> (remontée) : le moteur JS lit tout le fichier avant de l'exécuter, et "remonte" les déclarations de fonctions en haut de leur portée. Cela permet d'appeler une fonction avant de la définir. Les expressions de fonctions et arrow functions sont assignées à des variables — elles ne sont pas hoistées.</p>
      </div>

      <h2>Le mot-clé this — Pourquoi les arrow functions n'en ont pas</h2>

      <p>C'est l'un des sujets les plus déroutants de JavaScript. <code>this</code> ne référence pas toujours ce que vous pensez. Sa valeur dépend de <em>comment</em> la fonction est appelée, pas de <em>où</em> elle est définie — sauf pour les arrow functions.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> minuterie <span class="op">=</span> {
  secondes: <span class="num">0</span>,

  <span class="cmt">// ❌ function classique dans setTimeout : this est perdu</span>
  <span class="fn">demarrerClassique</span>() {
    <span class="fn">setInterval</span>(<span class="kw">function</span>() {
      <span class="kw">this</span>.secondes<span class="op">++</span>; <span class="cmt">// ← this = window (ou undefined en strict)</span>
      console.<span class="fn">log</span>(<span class="kw">this</span>.secondes); <span class="cmt">// NaN !</span>
    }, <span class="num">1000</span>);
  },

  <span class="cmt">// ✅ Arrow function : hérite du this du contexte englobant</span>
  <span class="fn">demarrerArrow</span>() {
    <span class="fn">setInterval</span>(() <span class="op">=></span> {
      <span class="kw">this</span>.secondes<span class="op">++</span>; <span class="cmt">// ← this = minuterie (hérité)</span>
      console.<span class="fn">log</span>(<span class="kw">this</span>.secondes); <span class="cmt">// 1, 2, 3...</span>
    }, <span class="num">1000</span>);
  }
};

minuterie.<span class="fn">demarrerArrow</span>();</pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Les 4 règles de this :</span>

<span class="cmt">// 1. Appel simple → this = global (window) ou undefined (strict)</span>
<span class="kw">function</span> <span class="fn">quiSuisJe</span>() { <span class="kw">return</span> <span class="kw">this</span>; }
<span class="fn">quiSuisJe</span>(); <span class="cmt">// window ou undefined</span>

<span class="cmt">// 2. Méthode d'objet → this = l'objet</span>
<span class="kw">const</span> obj <span class="op">=</span> { nom: <span class="str">"Bob"</span>, <span class="fn">dir</span>() { <span class="kw">return</span> <span class="kw">this</span>.nom; } };
obj.<span class="fn">dir</span>(); <span class="cmt">// "Bob"</span>

<span class="cmt">// 3. new → this = nouvel objet créé</span>
<span class="kw">function</span> <span class="cls">Animal</span>(nom) { <span class="kw">this</span>.nom <span class="op">=</span> nom; }
<span class="kw">const</span> chien <span class="op">=</span> <span class="kw">new</span> <span class="cls">Animal</span>(<span class="str">"Rex"</span>); <span class="cmt">// chien.nom = "Rex"</span>

<span class="cmt">// 4. call/apply/bind → this = valeur explicite</span>
<span class="kw">function</span> <span class="fn">saluer</span>() { <span class="kw">return</span> <span class="str">\`Bonjour \${<span class="kw">this</span>.nom}\`</span>; }
<span class="fn">saluer</span>.<span class="fn">call</span>({ nom: <span class="str">"Alice"</span> }); <span class="cmt">// "Bonjour Alice"</span></pre>
      </div>

      <div class="info-box warning">
        <div class="info-icon">⚠️</div>
        <p>N'utilisez <strong>jamais</strong> une arrow function comme méthode d'objet si vous avez besoin de <code>this</code> ! <code>const obj = { dir: () => this.nom }</code> — ici <code>this</code> n'est pas <code>obj</code> mais le contexte extérieur (souvent <code>undefined</code> en module ES).</p>
      </div>

      <h2>Paramètres — Défaut, rest, et déstructuration</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Paramètres par défaut</span>
<span class="kw">function</span> <span class="fn">creerMessage</span>(texte, auteur <span class="op">=</span> <span class="str">"Anonyme"</span>, urgent <span class="op">=</span> <span class="kw">false</span>) {
  <span class="kw">return</span> <span class="str">\`[\${urgent ? <span class="str">"URGENT"</span> : <span class="str">"INFO"</span>}] \${auteur}: \${texte}\`</span>;
}
<span class="fn">creerMessage</span>(<span class="str">"Bonjour"</span>);               <span class="cmt">// "[INFO] Anonyme: Bonjour"</span>
<span class="fn">creerMessage</span>(<span class="str">"Au feu!"</span>, <span class="str">"Alice"</span>, <span class="kw">true</span>); <span class="cmt">// "[URGENT] Alice: Au feu!"</span>

<span class="cmt">// Paramètre rest (...) : capture le reste des arguments</span>
<span class="kw">function</span> <span class="fn">logTout</span>(label, ...elements) {
  console.<span class="fn">log</span>(label, elements);
}
<span class="fn">logTout</span>(<span class="str">"fruits"</span>, <span class="str">"pomme"</span>, <span class="str">"banane"</span>, <span class="str">"cerise"</span>);
<span class="cmt">// "fruits" ["pomme", "banane", "cerise"]</span>

<span class="cmt">// Déstructuration dans les paramètres</span>
<span class="kw">function</span> <span class="fn">afficherUser</span>({ nom, age, ville <span class="op">=</span> <span class="str">"Inconnue"</span> }) {
  console.<span class="fn">log</span>(<span class="str">\`\${nom}, \${age} ans, de \${ville}\`</span>);
}
<span class="fn">afficherUser</span>({ nom: <span class="str">"Alice"</span>, age: <span class="num">30</span> });
<span class="cmt">// "Alice, 30 ans, de Inconnue"</span></pre>
      </div>

      <h2>Fonctions pures — La prévisibilité comme principe</h2>

      <p>Une fonction pure respecte deux règles : (1) <strong>même entrée → même sortie</strong> toujours, (2) <strong>aucun effet de bord</strong> (ne modifie pas l'extérieur). Les fonctions pures sont testables, prévisibles et composables.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// ❌ Fonction IMPURE : dépend d'un état externe</span>
<span class="kw">let</span> taxe <span class="op">=</span> <span class="num">0.2</span>;
<span class="kw">function</span> <span class="fn">calculerPrixImpure</span>(prix) {
  <span class="kw">return</span> prix <span class="op">*</span> (<span class="num">1</span> <span class="op">+</span> taxe); <span class="cmt">// dépend de taxe externe</span>
}
<span class="cmt">// Si taxe change, même appel → résultat différent</span>

<span class="cmt">// ❌ Fonction IMPURE : modifie ses arguments (effet de bord)</span>
<span class="kw">function</span> <span class="fn">ajouterImpure</span>(tableau, valeur) {
  tableau.<span class="fn">push</span>(valeur); <span class="cmt">// MUTE le tableau original !</span>
  <span class="kw">return</span> tableau;
}

<span class="cmt">// ✅ Fonctions PURES</span>
<span class="kw">function</span> <span class="fn">calculerPrixPure</span>(prix, tauxTaxe) {
  <span class="kw">return</span> prix <span class="op">*</span> (<span class="num">1</span> <span class="op">+</span> tauxTaxe); <span class="cmt">// tout en paramètre</span>
}
<span class="cmt">// calculerPrixPure(100, 0.2) → toujours 120</span>

<span class="kw">function</span> <span class="fn">ajouterPure</span>(tableau, valeur) {
  <span class="kw">return</span> [...tableau, valeur]; <span class="cmt">// nouveau tableau, pas de mutation</span>
}
<span class="kw">const</span> arr1 <span class="op">=</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>];
<span class="kw">const</span> arr2 <span class="op">=</span> <span class="fn">ajouterPure</span>(arr1, <span class="num">4</span>);
<span class="cmt">// arr1 = [1,2,3] (inchangé), arr2 = [1,2,3,4]</span></pre>
      </div>

      <h2>Closures — Le vrai mécanisme expliqué</h2>

      <p>Une closure se forme quand une fonction est créée à l'intérieur d'une autre fonction. La fonction interne <strong>garde une référence vivante</strong> à l'environnement de la fonction externe, même après que celle-ci a terminé son exécution. Ce n'est pas une copie — c'est un lien direct.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">function</span> <span class="fn">creerCompteur</span>(depart <span class="op">=</span> <span class="num">0</span>) {
  <span class="cmt">// "count" vit dans le scope de creerCompteur</span>
  <span class="kw">let</span> count <span class="op">=</span> depart;

  <span class="cmt">// Ces fonctions "ferment" sur count → closure</span>
  <span class="kw">return</span> {
    incrementer: () <span class="op">=></span> <span class="op">++</span>count,
    decrementer: () <span class="op">=></span> <span class="op">--</span>count,
    reset:       () <span class="op">=></span> { count <span class="op">=</span> depart; },
    valeur:      () <span class="op">=></span> count
  };
}

<span class="kw">const</span> compteurA <span class="op">=</span> <span class="fn">creerCompteur</span>(<span class="num">0</span>);
<span class="kw">const</span> compteurB <span class="op">=</span> <span class="fn">creerCompteur</span>(<span class="num">100</span>); <span class="cmt">// scope INDÉPENDANT</span>

compteurA.<span class="fn">incrementer</span>(); <span class="cmt">// 1</span>
compteurA.<span class="fn">incrementer</span>(); <span class="cmt">// 2</span>
compteurB.<span class="fn">incrementer</span>(); <span class="cmt">// 101</span>

console.<span class="fn">log</span>(compteurA.<span class="fn">valeur</span>()); <span class="cmt">// 2</span>
console.<span class="fn">log</span>(compteurB.<span class="fn">valeur</span>()); <span class="cmt">// 101</span>
<span class="cmt">// Chaque appel à creerCompteur crée un scope distinct !</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Piège classique : closure dans une boucle avec var</span>
<span class="kw">const</span> fns <span class="op">=</span> [];

<span class="cmt">// ❌ var : toutes les fonctions partagent le MÊME i</span>
<span class="kw">for</span> (<span class="kw">var</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;</span> <span class="num">3</span>; i<span class="op">++</span>) {
  fns.<span class="fn">push</span>(() <span class="op">=></span> console.<span class="fn">log</span>(i));
}
fns.<span class="fn">forEach</span>(f <span class="op">=></span> <span class="fn">f</span>()); <span class="cmt">// 3, 3, 3 — pas 0, 1, 2 !</span>

<span class="cmt">// ✅ let : chaque itération a son propre scope</span>
<span class="kw">const</span> fns2 <span class="op">=</span> [];
<span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;</span> <span class="num">3</span>; i<span class="op">++</span>) {
  fns2.<span class="fn">push</span>(() <span class="op">=></span> console.<span class="fn">log</span>(i));
}
fns2.<span class="fn">forEach</span>(f <span class="op">=></span> <span class="fn">f</span>()); <span class="cmt">// 0, 1, 2 ✓</span></pre>
      </div>

      <div class="info-box success">
        <div class="info-icon">🎯</div>
        <p>La closure est le mécanisme qui permet : les données privées (module pattern), les fonctions factory, la mémoïsation, les hooks React (useState stocke sa valeur via closure !). Comprendre les closures, c'est comprendre le cœur de JavaScript.</p>
      </div>

      <h2>Fonctions d'ordre supérieur (Higher-Order Functions)</h2>

      <p>Une fonction d'ordre supérieur est une fonction qui <strong>accepte d'autres fonctions comme arguments</strong> ou qui <strong>retourne une fonction</strong>. C'est rendu possible par le fait que les fonctions sont des first-class citizens.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// HOF qui ACCEPTE une fonction</span>
<span class="kw">function</span> <span class="fn">appliquer</span>(valeur, transformation) {
  <span class="kw">return</span> <span class="fn">transformation</span>(valeur);
}
<span class="fn">appliquer</span>(<span class="num">5</span>, x <span class="op">=></span> x <span class="op">*</span> <span class="num">2</span>);  <span class="cmt">// 10</span>
<span class="fn">appliquer</span>(<span class="str">"hello"</span>, s <span class="op">=></span> s.<span class="fn">toUpperCase</span>());  <span class="cmt">// "HELLO"</span>

<span class="cmt">// HOF qui RETOURNE une fonction (factory)</span>
<span class="kw">function</span> <span class="fn">multiplierPar</span>(facteur) {
  <span class="kw">return</span> (nombre) <span class="op">=></span> nombre <span class="op">*</span> facteur; <span class="cmt">// closure sur facteur</span>
}
<span class="kw">const</span> <span class="fn">tripler</span>  <span class="op">=</span> <span class="fn">multiplierPar</span>(<span class="num">3</span>);
<span class="kw">const</span> <span class="fn">centupler</span> <span class="op">=</span> <span class="fn">multiplierPar</span>(<span class="num">100</span>);

<span class="fn">tripler</span>(<span class="num">5</span>);   <span class="cmt">// 15</span>
<span class="fn">centupler</span>(<span class="num">7</span>); <span class="cmt">// 700</span>

<span class="cmt">// Les méthodes tableau sont des HOF</span>
[<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>].<span class="fn">map</span>(<span class="fn">tripler</span>);   <span class="cmt">// [3, 6, 9]</span>
[<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>].<span class="fn">filter</span>(n <span class="op">=></span> n <span class="op">></span> <span class="num">1</span>); <span class="cmt">// [2, 3]</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Exemple réel : un décorateur de fonction (HOF avancé)</span>
<span class="kw">function</span> <span class="fn">avecLog</span>(fn) {
  <span class="kw">return</span> <span class="kw">function</span>(...args) {
    console.<span class="fn">log</span>(<span class="str">\`Appel de \${fn.name} avec\`</span>, args);
    <span class="kw">const</span> result <span class="op">=</span> <span class="fn">fn</span>(...args);
    console.<span class="fn">log</span>(<span class="str">\`Résultat: \${result}\`</span>);
    <span class="kw">return</span> result;
  };
}

<span class="kw">const</span> <span class="fn">addLogged</span> <span class="op">=</span> <span class="fn">avecLog</span>((a, b) <span class="op">=></span> a <span class="op">+</span> b);
<span class="fn">addLogged</span>(<span class="num">3</span>, <span class="num">4</span>);
<span class="cmt">// Appel de (a, b) => a + b avec [3, 4]</span>
<span class="cmt">// Résultat: 7</span></pre>
      </div>

      <div class="challenge-block">
        <h3>Défi : Mémoïsation</h3>
        <p>Implémentez une fonction <code>memoize(fn)</code> qui met en cache les résultats d'une fonction. Si la fonction est appelée avec les mêmes arguments, elle retourne le résultat en cache sans recalculer.</p>
        <pre><span class="kw">function</span> <span class="fn">memoize</span>(fn) {
  <span class="kw">const</span> cache <span class="op">=</span> <span class="kw">new</span> <span class="cls">Map</span>();

  <span class="kw">return</span> <span class="kw">function</span>(...args) {
    <span class="kw">const</span> cle <span class="op">=</span> <span class="cls">JSON</span>.<span class="fn">stringify</span>(args);

    <span class="kw">if</span> (cache.<span class="fn">has</span>(cle)) {
      console.<span class="fn">log</span>(<span class="str">"Cache hit !"</span>);
      <span class="kw">return</span> cache.<span class="fn">get</span>(cle);
    }

    <span class="kw">const</span> result <span class="op">=</span> <span class="fn">fn</span>(...args);
    cache.<span class="fn">set</span>(cle, result);
    <span class="kw">return</span> result;
  };
}

<span class="cmt">// Fibonacci naïf : O(2^n) → avec memoize : O(n)</span>
<span class="kw">const</span> <span class="fn">fib</span> <span class="op">=</span> <span class="fn">memoize</span>(<span class="kw">function</span>(n) {
  <span class="kw">if</span> (n <span class="op">&lt;=</span> <span class="num">1</span>) <span class="kw">return</span> n;
  <span class="kw">return</span> <span class="fn">fib</span>(n <span class="op">-</span> <span class="num">1</span>) <span class="op">+</span> <span class="fn">fib</span>(n <span class="op">-</span> <span class="num">2</span>);
});

<span class="fn">fib</span>(<span class="num">10</span>); <span class="cmt">// calcule</span>
<span class="fn">fib</span>(<span class="num">10</span>); <span class="cmt">// Cache hit ! → 55</span></pre>
      </div>
    `,
    quiz: [
      {
        question: "Pourquoi une arrow function ne doit PAS être utilisée comme méthode d'un objet nécessitant this ?",
        sub: "Le comportement de this dans les arrow functions",
        options: [
          "Les arrow functions sont plus lentes",
          "Les arrow functions n'ont pas leur propre this — elles héritent du this du contexte englobant",
          "Les arrow functions ne peuvent pas accéder aux propriétés d'un objet",
          "Les arrow functions ne supportent pas les paramètres"
        ],
        correct: 1,
        explanation: "✅ Exact ! Une arrow function hérite du this de son contexte lexical (où elle est définie), pas de celui de l'objet qui l'appelle. Comme méthode, this ne serait pas l'objet mais le scope extérieur — souvent window ou undefined."
      },
      {
        question: "Qu'est-ce qui définit une closure en JavaScript ?",
        sub: "Concept fondamental de closure",
        options: [
          "Une fonction qui s'appelle elle-même (récursion)",
          "Une fonction qui ferme son accès aux variables externes",
          "Une fonction interne qui garde une référence vivante à l'environnement de la fonction externe qui l'a créée",
          "Une fonction avec des paramètres par défaut"
        ],
        correct: 2,
        explanation: "✅ Parfait ! Une closure se forme quand une fonction interne maintient un lien vers le scope de sa fonction englobante. Ce n'est pas une copie — c'est un accès direct et persistant, même après que la fonction externe a terminé."
      },
      {
        question: "Que signifie qu'une fonction est 'pure' ?",
        sub: "Fonctions pures et effets de bord",
        options: [
          "La fonction est déclarée avec const et ne peut pas être réassignée",
          "La fonction n'utilise pas de boucles",
          "La fonction retourne toujours le même résultat pour les mêmes arguments ET ne modifie rien à l'extérieur",
          "La fonction ne prend qu'un seul argument"
        ],
        correct: 2,
        explanation: "✅ Exact ! Une fonction pure satisfait deux critères : déterminisme (même input → même output) et absence d'effets de bord (ne modifie pas de variables externes, ne fait pas d'I/O). Cela la rend testable, prévisible et composable."
      }
    ]
};
