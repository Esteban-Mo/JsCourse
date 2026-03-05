export default {
    id: 9,
    title: 'ES6+ & Moderne',
    icon: '⚡',
    level: 'Avancé',
    stars: '★★★★☆',
    content: () => `
      <div class="chapter-tag">Chapitre 09 · JavaScript Moderne</div>
      <h1>ES6+ &<br><span class="highlight">Fonctionnalités</span><br>Modernes</h1>

      <div class="chapter-intro-card">
        <div class="level-badge level-advanced">⚡</div>
        <div class="chapter-meta">
          <div class="difficulty-stars">★★★★★</div>
          <h3>Destructuring, spread/rest, modules, Symbol, Map/Set, ?. et ??</h3>
          <p>Durée estimée : 30 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>ES6 (2015) a transformé JavaScript. Depuis, une nouvelle version sort chaque année. Ce chapitre couvre les fonctionnalités qui ont le plus grand impact sur la lisibilité et la robustesse du code au quotidien.</p>

      <h2>Déstructuration — Extraire avec élégance</h2>

      <p>La déstructuration permet d'extraire des valeurs d'objets et de tableaux en une seule expression. C'est du sucre syntaxique, mais il rend le code considérablement plus lisible.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Déstructuration d'objet : cas de base</span>
<span class="kw">const</span> user <span class="op">=</span> { nom: <span class="str">"Alice"</span>, age: <span class="num">30</span>, ville: <span class="str">"Paris"</span>, role: <span class="str">"admin"</span> };

<span class="cmt">// Avant ES6</span>
<span class="kw">const</span> nom1  <span class="op">=</span> user.nom;
<span class="kw">const</span> age1  <span class="op">=</span> user.age;

<span class="cmt">// Avec déstructuration</span>
<span class="kw">const</span> { nom, age } <span class="op">=</span> user; <span class="cmt">// extrait nom et age</span>

<span class="cmt">// Renommer à la volée : prop: nouveauNom</span>
<span class="kw">const</span> { nom: prenom, age: annees } <span class="op">=</span> user;
<span class="cmt">// prenom = "Alice", annees = 30</span>

<span class="cmt">// Valeur par défaut si la propriété n'existe pas</span>
<span class="kw">const</span> { theme <span class="op">=</span> <span class="str">"light"</span>, langue <span class="op">=</span> <span class="str">"fr"</span> } <span class="op">=</span> user;
<span class="cmt">// theme = "light" (user.theme est undefined)</span>

<span class="cmt">// Ignorer des propriétés avec rest</span>
<span class="kw">const</span> { role, ...profil } <span class="op">=</span> user;
<span class="cmt">// role = "admin", profil = { nom, age, ville }</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Déstructuration imbriquée</span>
<span class="kw">const</span> config <span class="op">=</span> {
  serveur: { host: <span class="str">"localhost"</span>, port: <span class="num">3000</span> },
  db: { nom: <span class="str">"maDB"</span>, ssl: <span class="kw">true</span> }
};

<span class="kw">const</span> { serveur: { host, port }, db: { nom: nomDB } } <span class="op">=</span> config;
<span class="cmt">// host = "localhost", port = 3000, nomDB = "maDB"</span>

<span class="cmt">// Déstructuration de tableau</span>
<span class="kw">const</span> [premier, deuxieme, , quatrieme, ...reste] <span class="op">=</span> [<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">40</span>, <span class="num">50</span>, <span class="num">60</span>];
<span class="cmt">// premier=10, deuxieme=20, (30 ignoré), quatrieme=40, reste=[50,60]</span>

<span class="cmt">// Swap de variables sans variable temporaire !</span>
<span class="kw">let</span> a <span class="op">=</span> <span class="num">1</span>, b <span class="op">=</span> <span class="num">2</span>;
[a, b] <span class="op">=</span> [b, a];
<span class="cmt">// a = 2, b = 1</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Déstructuration dans les paramètres de fonction</span>
<span class="cmt">// Avant : function creerUser(options) { const nom = options.nom; ... }</span>

<span class="kw">function</span> <span class="fn">creerUser</span>({ nom, age, role <span class="op">=</span> <span class="str">"user"</span>, actif <span class="op">=</span> <span class="kw">true</span> }) {
  <span class="kw">return</span> { nom, age, role, actif, createdAt: <span class="kw">new</span> <span class="cls">Date</span>() };
}

<span class="fn">creerUser</span>({ nom: <span class="str">"Bob"</span>, age: <span class="num">25</span> });
<span class="cmt">// { nom:"Bob", age:25, role:"user", actif:true, createdAt:... }</span>

<span class="cmt">// Très courant dans React</span>
<span class="cmt">// function Button({ label, onClick, disabled = false }) {</span>
<span class="cmt">//   return &lt;button onClick={onClick} disabled={disabled}&gt;{label}&lt;/button&gt;;</span>
<span class="cmt">// }</span></pre>
      </div>

      <h2>Spread et Rest — La même syntaxe, deux contextes</h2>

      <p><code>...</code> est lu de manière opposée selon le contexte : <strong>spread</strong> "étale" une valeur (dans un appel, un tableau, un objet), <strong>rest</strong> "rassemble" des valeurs (dans une déstructuration, des paramètres).</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// SPREAD — étaler</span>
<span class="kw">const</span> arr1 <span class="op">=</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>];
<span class="kw">const</span> arr2 <span class="op">=</span> [<span class="num">4</span>, <span class="num">5</span>];

<span class="cmt">// Dans un tableau</span>
<span class="kw">const</span> fusionné <span class="op">=</span> [...arr1, ...arr2, <span class="num">6</span>]; <span class="cmt">// [1,2,3,4,5,6]</span>

<span class="cmt">// Dans un appel de fonction</span>
<span class="cls">Math</span>.<span class="fn">max</span>(...arr1);  <span class="cmt">// Math.max(1, 2, 3) → 3</span>

<span class="cmt">// Cloner/fusionner des objets</span>
<span class="kw">const</span> obj1 <span class="op">=</span> { a: <span class="num">1</span>, b: <span class="num">2</span> };
<span class="kw">const</span> obj2 <span class="op">=</span> { b: <span class="num">99</span>, c: <span class="num">3</span> };
<span class="kw">const</span> merged <span class="op">=</span> { ...obj1, ...obj2 }; <span class="cmt">// { a:1, b:99, c:3 }</span>
<span class="cmt">// b de obj2 écrase b de obj1</span>

<span class="cmt">// REST — rassembler</span>
<span class="kw">function</span> <span class="fn">somme</span>(premier, ...reste) {
  <span class="cmt">// reste est un vrai tableau</span>
  <span class="kw">return</span> premier <span class="op">+</span> reste.<span class="fn">reduce</span>((a, b) <span class="op">=></span> a <span class="op">+</span> b, <span class="num">0</span>);
}
<span class="fn">somme</span>(<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>); <span class="cmt">// premier=1, reste=[2,3,4] → 10</span></pre>
      </div>

      <h2>Modules ES — Pourquoi ils existent et comment les utiliser</h2>

      <p>Avant les modules, tout le code JS dans un navigateur partageait le même scope global — une catastrophe avec de grandes applications. Les modules ES créent un <strong>scope isolé</strong> par fichier et permettent d'exporter/importer explicitement ce qui est nécessaire.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// math.js — exports nommés</span>
<span class="kw">export const</span> PI <span class="op">=</span> <span class="num">3.14159</span>;
<span class="kw">export function</span> <span class="fn">carre</span>(x) { <span class="kw">return</span> x <span class="op">**</span> <span class="num">2</span>; }
<span class="kw">export function</span> <span class="fn">cube</span>(x)   { <span class="kw">return</span> x <span class="op">**</span> <span class="num">3</span>; }

<span class="cmt">// Export par défaut — une seule valeur principale</span>
<span class="kw">export default function</span> <span class="fn">aire</span>(r) { <span class="kw">return</span> PI <span class="op">*</span> r <span class="op">**</span> <span class="num">2</span>; }

<span class="cmt">// main.js — imports</span>
<span class="kw">import</span> aire <span class="kw">from</span> <span class="str">"./math.js"</span>;          <span class="cmt">// import par défaut</span>
<span class="kw">import</span> { PI, carre } <span class="kw">from</span> <span class="str">"./math.js"</span>; <span class="cmt">// imports nommés</span>
<span class="kw">import</span> { cube <span class="kw">as</span> puissance3 } <span class="kw">from</span> <span class="str">"./math.js"</span>; <span class="cmt">// renommer</span>
<span class="kw">import</span> * <span class="kw">as</span> math <span class="kw">from</span> <span class="str">"./math.js"</span>;    <span class="cmt">// tout importer</span>

<span class="fn">aire</span>(<span class="num">5</span>);          <span class="cmt">// 78.53...</span>
<span class="fn">carre</span>(<span class="num">4</span>);        <span class="cmt">// 16</span>
math.<span class="fn">cube</span>(<span class="num">3</span>);   <span class="cmt">// 27</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>Différence clé : <strong>export default</strong> = une seule valeur principale par module, importée sans accolades et renommable librement. <strong>export nommé</strong> = plusieurs valeurs, importées avec accolades et le nom exact (ou avec <code>as</code>).</p>
      </div>

      <h2>Dynamic Import — Charger un module à la demande</h2>

      <p>Les imports statiques (en haut de fichier) sont résolus au chargement. Le <strong>dynamic import</strong> — <code>import()</code> — est une fonction qui charge un module <em>à l'exécution</em>, quand on en a besoin. Elle retourne une Promise. C'est le mécanisme derrière le lazy loading et le code splitting (React, Vite, Webpack).</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Import statique (en haut de fichier) — chargé immédiatement</span>
<span class="kw">import</span> { carre } <span class="kw">from</span> <span class="str">"./math.js"</span>;

<span class="cmt">// Import dynamique — chargé seulement quand appelé</span>
<span class="kw">async function</span> <span class="fn">chargerModule</span>() {
  <span class="kw">const</span> math <span class="op">=</span> <span class="kw">await</span> <span class="fn">import</span>(<span class="str">"./math.js"</span>);
  console.<span class="fn">log</span>(math.<span class="fn">carre</span>(<span class="num">5</span>)); <span class="cmt">// 25</span>
}

<span class="cmt">// Destructurer directement</span>
<span class="kw">const</span> { carre, cube } <span class="op">=</span> <span class="kw">await</span> <span class="fn">import</span>(<span class="str">"./math.js"</span>);</pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Cas d'usage réels</span>

<span class="cmt">// 1. Charger un module lourd seulement si nécessaire</span>
<span class="kw">async function</span> <span class="fn">exporterPDF</span>() {
  <span class="kw">const</span> { genererPDF } <span class="op">=</span> <span class="kw">await</span> <span class="fn">import</span>(<span class="str">"./pdf-generator.js"</span>);
  <span class="kw">return</span> <span class="fn">genererPDF</span>(document);
}

<span class="cmt">// 2. Module conditionnel selon l'environnement</span>
<span class="kw">const</span> utils <span class="op">=</span> <span class="kw">await</span> <span class="fn">import</span>(
  <span class="fn">isMobile</span>() ? <span class="str">"./utils-mobile.js"</span> : <span class="str">"./utils-desktop.js"</span>
);

<span class="cmt">// 3. Lazy loading d'une route (React, Vue, etc.)</span>
<span class="cmt">// const Dashboard = lazy(() => import('./Dashboard.jsx'));</span>
<span class="cmt">// → le composant n'est téléchargé que quand l'utilisateur y navigue</span></pre>
      </div>

      <div class="info-box warning">
        <div class="info-icon">⚠️</div>
        <p>Le dynamic import retourne une Promise — il faut donc <code>await</code> ou <code>.then()</code>. Le chemin passé en argument peut être une expression (variable, ternaire), contrairement aux imports statiques qui ne supportent que les chemins littéraux.</p>
      </div>

      <h2>Symbol — Des clés vraiment uniques</h2>

      <p>Un <code>Symbol</code> est une valeur primitive unique et immuable. Contrairement aux chaînes ou nombres, deux Symbols sont toujours différents, même s'ils ont la même description.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Chaque Symbol est unique</span>
<span class="kw">const</span> sym1 <span class="op">=</span> <span class="cls">Symbol</span>(<span class="str">"id"</span>);
<span class="kw">const</span> sym2 <span class="op">=</span> <span class="cls">Symbol</span>(<span class="str">"id"</span>);
sym1 <span class="op">===</span> sym2; <span class="cmt">// false — toujours !</span>

<span class="cmt">// Cas d'usage : clé de propriété non-collisionnelle</span>
<span class="kw">const</span> ID <span class="op">=</span> <span class="cls">Symbol</span>(<span class="str">"userId"</span>);
<span class="kw">const</span> user <span class="op">=</span> { nom: <span class="str">"Alice"</span>, [ID]: <span class="num">42</span> };

user[ID];              <span class="cmt">// 42</span>
user.nom;              <span class="cmt">// "Alice"</span>
<span class="cls">Object</span>.<span class="fn">keys</span>(user);    <span class="cmt">// ["nom"] — Symbol invisible !</span>
<span class="cls">JSON</span>.<span class="fn">stringify</span>(user); <span class="cmt">// '{"nom":"Alice"}' — Symbol ignoré</span>

<span class="cmt">// Symbol.for : registre global (même Symbol partout)</span>
<span class="kw">const</span> s1 <span class="op">=</span> <span class="cls">Symbol</span>.<span class="fn">for</span>(<span class="str">"app.id"</span>);
<span class="kw">const</span> s2 <span class="op">=</span> <span class="cls">Symbol</span>.<span class="fn">for</span>(<span class="str">"app.id"</span>);
s1 <span class="op">===</span> s2; <span class="cmt">// true — registre global !</span></pre>
      </div>

      <h2>Map et Set — Quand les objets et tableaux ne suffisent pas</h2>

      <p><code>Map</code> est une collection de paires clé-valeur où <strong>les clés peuvent être de n'importe quel type</strong> (y compris des objets). <code>Set</code> est une collection de valeurs <strong>uniques</strong>. Ils sont plus adaptés que les objets/tableaux pour certains cas.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Map : clés de tout type, ordre garanti</span>
<span class="kw">const</span> cache <span class="op">=</span> <span class="kw">new</span> <span class="cls">Map</span>();

<span class="kw">const</span> cle1 <span class="op">=</span> { id: <span class="num">1</span> }; <span class="cmt">// objet comme clé !</span>
cache.<span class="fn">set</span>(cle1, <span class="str">"données Alice"</span>);
cache.<span class="fn">set</span>(<span class="str">"string-key"</span>, <span class="num">42</span>);
cache.<span class="fn">set</span>(<span class="num">123</span>, <span class="kw">true</span>);

cache.<span class="fn">get</span>(cle1);     <span class="cmt">// "données Alice"</span>
cache.<span class="fn">has</span>(<span class="str">"string-key"</span>); <span class="cmt">// true</span>
cache.size;           <span class="cmt">// 3</span>

<span class="cmt">// Itérer une Map</span>
<span class="kw">for</span> (<span class="kw">const</span> [cle, valeur] <span class="kw">of</span> cache) {
  console.<span class="fn">log</span>(cle, <span class="str">"→"</span>, valeur);
}

<span class="cmt">// Avantages de Map vs objet simple :</span>
<span class="cmt">// - Clés de tout type (pas seulement string/Symbol)</span>
<span class="cmt">// - Pas de collision avec les propriétés héritées</span>
<span class="cmt">// - .size natif (objet → Object.keys().length)</span>
<span class="cmt">// - Performances meilleures pour ajouts/suppressions fréquents</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Set : collection de valeurs UNIQUES</span>
<span class="kw">const</span> vus <span class="op">=</span> <span class="kw">new</span> <span class="cls">Set</span>();
vus.<span class="fn">add</span>(<span class="num">1</span>); vus.<span class="fn">add</span>(<span class="num">2</span>); vus.<span class="fn">add</span>(<span class="num">2</span>); vus.<span class="fn">add</span>(<span class="num">3</span>);
vus.size; <span class="cmt">// 3 (les doublons sont ignorés)</span>

<span class="cmt">// Dédupliquer un tableau — façon moderne</span>
<span class="kw">const</span> arr <span class="op">=</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">3</span>, <span class="num">4</span>];
<span class="kw">const</span> unique <span class="op">=</span> [...<span class="kw">new</span> <span class="cls">Set</span>(arr)]; <span class="cmt">// [1, 2, 3, 4]</span>

<span class="cmt">// Opérations ensemblistes</span>
<span class="kw">const</span> setA <span class="op">=</span> <span class="kw">new</span> <span class="cls">Set</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>]);
<span class="kw">const</span> setB <span class="op">=</span> <span class="kw">new</span> <span class="cls">Set</span>([<span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>, <span class="num">6</span>]);

<span class="cmt">// Union</span>
<span class="kw">const</span> union <span class="op">=</span> <span class="kw">new</span> <span class="cls">Set</span>([...setA, ...setB]);  <span class="cmt">// {1,2,3,4,5,6}</span>

<span class="cmt">// Intersection</span>
<span class="kw">const</span> inter <span class="op">=</span> <span class="kw">new</span> <span class="cls">Set</span>([...setA].<span class="fn">filter</span>(x <span class="op">=></span> setB.<span class="fn">has</span>(x))); <span class="cmt">// {3,4}</span>

<span class="cmt">// Différence (A - B)</span>
<span class="kw">const</span> diff <span class="op">=</span> <span class="kw">new</span> <span class="cls">Set</span>([...setA].<span class="fn">filter</span>(x <span class="op">=></span> <span class="op">!</span>setB.<span class="fn">has</span>(x))); <span class="cmt">// {1,2}</span></pre>
      </div>

      <h2>Optional Chaining ?. et Nullish Coalescing ?? — En profondeur</h2>

      <p><code>?.</code> court-circuite l'évaluation si la valeur à gauche est <code>null</code> ou <code>undefined</code>, retournant <code>undefined</code>. C'est différent de <code>||</code> qui court-circuite sur toute valeur <em>falsy</em>.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> user <span class="op">=</span> {
  profil: {
    avatar: <span class="str">"img.png"</span>,
    scores: [<span class="num">85</span>, <span class="num">92</span>, <span class="num">78</span>]
  },
  <span class="fn">greeting</span>() { <span class="kw">return</span> <span class="str">"Bonjour !"</span>; }
};

<span class="cmt">// Optional chaining sur propriétés</span>
user<span class="op">?.</span>profil<span class="op">?.</span>avatar;          <span class="cmt">// "img.png"</span>
user<span class="op">?.</span>settings<span class="op">?.</span>theme;        <span class="cmt">// undefined (pas d'erreur !)</span>

<span class="cmt">// Sur des méthodes</span>
user<span class="op">?.</span><span class="fn">greeting</span>();               <span class="cmt">// "Bonjour !"</span>
user<span class="op">?.</span><span class="fn">nonExistant</span>();           <span class="cmt">// undefined (pas TypeError)</span>

<span class="cmt">// Sur des indices de tableau</span>
user<span class="op">?.</span>profil<span class="op">?.</span>scores<span class="op">?.</span>[<span class="num">0</span>];    <span class="cmt">// 85</span>
user<span class="op">?.</span>profil<span class="op">?.</span>tags<span class="op">?.</span>[<span class="num">0</span>];      <span class="cmt">// undefined</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// ?? vs || : la différence est CRUCIALE</span>
<span class="kw">const</span> score <span class="op">=</span> <span class="num">0</span>;  <span class="cmt">// valeur légitimement à 0</span>

<span class="cmt">// ❌ || prend le fallback si score est FALSY (0 est falsy !)</span>
<span class="kw">const</span> a <span class="op">=</span> score <span class="op">||</span> <span class="num">100</span>;  <span class="cmt">// 100 ← FAUX, 0 est une valeur valide !</span>

<span class="cmt">// ✅ ?? prend le fallback seulement si null ou undefined</span>
<span class="kw">const</span> b <span class="op">=</span> score <span class="op">??</span> <span class="num">100</span>;  <span class="cmt">// 0 ← correct !</span>

<span class="cmt">// Combinaison ?. et ??</span>
<span class="kw">const</span> theme <span class="op">=</span> user<span class="op">?.</span>settings<span class="op">?.</span>theme <span class="op">??</span> <span class="str">"dark"</span>;
<span class="cmt">// "dark" car user.settings n'existe pas</span>

<span class="cmt">// Assignation nullish (??=)</span>
<span class="kw">let</span> config <span class="op">=</span> <span class="kw">null</span>;
config <span class="op">??=</span> { theme: <span class="str">"light"</span> }; <span class="cmt">// assigne seulement si null/undefined</span>
<span class="cmt">// config = { theme: "light" }</span>

config <span class="op">??=</span> { theme: <span class="str">"dark"</span> };  <span class="cmt">// ignoré car config n'est plus null</span>
<span class="cmt">// config = { theme: "light" } (inchangé)</span></pre>
      </div>

      <div class="info-box warning">
        <div class="info-icon">⚠️</div>
        <p>Mémorisez cette règle : utilisez <code>??</code> quand <code>0</code>, <code>""</code> ou <code>false</code> sont des valeurs valides. Utilisez <code>||</code> uniquement quand vous voulez vraiment rejeter toutes les valeurs falsy.</p>
      </div>

      <div class="challenge-block">
        <h3>Défi : Pipeline de données</h3>
        <p>Avec une liste d'utilisateurs, construisez un Map qui associe chaque ID à son nom, et un Set de toutes les villes uniques. Utilisez la déstructuration dans les boucles.</p>
        <pre><span class="kw">const</span> users <span class="op">=</span> [
  { id: <span class="num">1</span>, nom: <span class="str">"Alice"</span>, ville: <span class="str">"Paris"</span>,     actif: <span class="kw">true</span>  },
  { id: <span class="num">2</span>, nom: <span class="str">"Bob"</span>,   ville: <span class="str">"Lyon"</span>,      actif: <span class="kw">false</span> },
  { id: <span class="num">3</span>, nom: <span class="str">"Clara"</span>,ville: <span class="str">"Paris"</span>,     actif: <span class="kw">true</span>  },
  { id: <span class="num">4</span>, nom: <span class="str">"David"</span>,ville: <span class="str">"Marseille"</span>, actif: <span class="kw">true</span>  },
];

<span class="cmt">// Map id → nom</span>
<span class="kw">const</span> userMap <span class="op">=</span> <span class="kw">new</span> <span class="cls">Map</span>(
  users.<span class="fn">map</span>(({ id, nom }) <span class="op">=></span> [id, nom])
);
<span class="cmt">// Map { 1 => "Alice", 2 => "Bob", ... }</span>
userMap.<span class="fn">get</span>(<span class="num">3</span>); <span class="cmt">// "Clara"</span>

<span class="cmt">// Set de villes uniques (actifs seulement)</span>
<span class="kw">const</span> villesActifs <span class="op">=</span> <span class="kw">new</span> <span class="cls">Set</span>(
  users
    .<span class="fn">filter</span>(({ actif }) <span class="op">=></span> actif)
    .<span class="fn">map</span>(({ ville }) <span class="op">=></span> ville)
);
<span class="cmt">// Set { "Paris", "Marseille" }</span></pre>
      </div>
    `,
    quiz: [
      {
        question: "Quelle est la différence entre ?? et || pour les valeurs par défaut ?",
        sub: "Nullish Coalescing vs OR logique",
        options: [
          "?? est plus récent mais identique à ||",
          "|| utilise le fallback si la valeur est falsy (0, '', false inclus), ?? seulement si null ou undefined",
          "?? ne fonctionne que sur les objets",
          "|| est plus performant que ??"
        ],
        correct: 1,
        explanation: "✅ Exact ! C'est la différence cruciale. score || 100 retourne 100 même si score = 0 (car 0 est falsy). score ?? 100 retourne 0 car 0 n'est pas null ni undefined. Utilisez ?? quand 0, '' ou false sont des valeurs légitimes."
      },
      {
        question: "Pourquoi Map est-il préférable à un objet simple pour certains cas ?",
        sub: "Map vs objet JavaScript",
        options: [
          "Map consomme moins de mémoire",
          "Map permet d'utiliser n'importe quel type comme clé, a une taille native (.size), et évite les collisions avec Object.prototype",
          "Map supporte les méthodes .map() et .filter()",
          "Map est plus rapide que les objets dans tous les cas"
        ],
        correct: 1,
        explanation: "✅ Parfait ! Map offre trois avantages concrets : les clés peuvent être des objets (pas seulement des strings), .size donne la taille directement, et il n'y a pas de risque de collision avec des propriétés héritées comme 'constructor' ou 'toString'."
      },
      {
        question: "En déstructuration d'objet, que signifie { nom: prenom } ?",
        sub: "Renommage en déstructuration",
        options: [
          "Extraire nom et l'appeler aussi nom, avec prenom comme alias ignoré",
          "Créer un objet avec les propriétés nom et prenom",
          "Extraire la propriété nom de l'objet et la stocker dans une variable nommée prenom",
          "Cela cause une SyntaxError"
        ],
        correct: 2,
        explanation: "✅ Exact ! La syntaxe { source: destination } en déstructuration signifie : prends la propriété 'source' de l'objet et mets-la dans une variable locale nommée 'destination'. Ici, on extrait obj.nom dans une variable prenom."
      }
    ]
};
