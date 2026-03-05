export default {
    id: 6,
    title: 'Tableaux & Objets',
    icon: '🗂️',
    level: 'Intermédiaire',
    stars: '★★★★☆',
    content: () => `
      <div class="chapter-tag">Chapitre 06 · Structures de données</div>
      <h1>Tableaux &<br><span class="highlight">Objets</span></h1>

      <div class="chapter-intro-card">
        <div class="level-badge level-intermediate">🗂️</div>
        <div class="chapter-meta">
          <div class="difficulty-stars">★★★★☆</div>
          <h3>Référence vs copie, mutation, map/filter/reduce, sort, objets avancés</h3>
          <p>Durée estimée : 35 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Les tableaux et objets sont les structures de données fondamentales de JavaScript. Mais ils se comportent différemment des types primitifs (nombres, chaînes). Comprendre la différence entre <strong>valeur</strong> et <strong>référence</strong> est essentiel pour éviter des bugs très difficiles à détecter.</p>

      <h2>Le piège de la référence — const ne protège pas vos données</h2>

      <p>En JavaScript, les objets et tableaux sont passés <strong>par référence</strong>. Quand vous assignez un tableau à une variable, vous ne copiez pas les données — vous copiez <em>l'adresse</em> en mémoire. <code>const</code> empêche de réassigner la variable, mais pas de modifier ce qu'elle pointe.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// ❌ Ce n'est PAS une copie — c'est un alias !</span>
<span class="kw">const</span> arr1 <span class="op">=</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>];
<span class="kw">const</span> arr2 <span class="op">=</span> arr1; <span class="cmt">// arr2 pointe vers le MÊME tableau</span>

arr2.<span class="fn">push</span>(<span class="num">4</span>);
console.<span class="fn">log</span>(arr1); <span class="cmt">// [1, 2, 3, 4] ← arr1 a changé !</span>
console.<span class="fn">log</span>(arr1 <span class="op">===</span> arr2); <span class="cmt">// true (même référence)</span>

<span class="cmt">// ✅ Copie superficielle (shallow copy)</span>
<span class="kw">const</span> arr3 <span class="op">=</span> [...arr1];   <span class="cmt">// spread</span>
<span class="kw">const</span> arr4 <span class="op">=</span> arr1.<span class="fn">slice</span>(); <span class="cmt">// slice sans arguments</span>
<span class="kw">const</span> arr5 <span class="op">=</span> <span class="cls">Array</span>.<span class="fn">from</span>(arr1); <span class="cmt">// Array.from</span>

arr3.<span class="fn">push</span>(<span class="num">99</span>);
console.<span class="fn">log</span>(arr1); <span class="cmt">// [1, 2, 3, 4] — inchangé !</span>
console.<span class="fn">log</span>(arr3); <span class="cmt">// [1, 2, 3, 4, 99]</span></pre>
      </div>

      <div class="info-box danger">
        <div class="info-icon">🔥</div>
        <p>Les copies <strong>superficielles</strong> (spread, slice) ne copient qu'un niveau. Si votre tableau contient des objets, les objets imbriqués sont toujours partagés par référence ! Utilisez <code>structuredClone()</code> pour une copie profonde.</p>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Piège de la copie superficielle avec objets imbriqués</span>
<span class="kw">const</span> original <span class="op">=</span> { nom: <span class="str">"Alice"</span>, adresse: { ville: <span class="str">"Paris"</span> } };
<span class="kw">const</span> copie <span class="op">=</span> { ...original }; <span class="cmt">// copie superficielle</span>

copie.adresse.ville <span class="op">=</span> <span class="str">"Lyon"</span>; <span class="cmt">// modifie l'objet PARTAGÉ</span>
console.<span class="fn">log</span>(original.adresse.ville); <span class="cmt">// "Lyon" ← bug !</span>

<span class="cmt">// ✅ Copie profonde avec structuredClone (moderne)</span>
<span class="kw">const</span> vrai_clone <span class="op">=</span> <span class="fn">structuredClone</span>(original);
vrai_clone.adresse.ville <span class="op">=</span> <span class="str">"Marseille"</span>;
console.<span class="fn">log</span>(original.adresse.ville); <span class="cmt">// "Lyon" ← inchangé ✓</span></pre>
      </div>

      <h2>Mutation vs Immutabilité — Méthodes qui mutent vs méthodes qui retournent</h2>

      <p>Certaines méthodes de tableau <strong>modifient le tableau en place</strong> (mutation), d'autres retournent un <strong>nouveau tableau</strong> sans toucher à l'original. Savoir lesquelles est crucial.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> nombres <span class="op">=</span> [<span class="num">3</span>, <span class="num">1</span>, <span class="num">4</span>, <span class="num">1</span>, <span class="num">5</span>];

<span class="cmt">// Méthodes MUTANTES (modifient le tableau original)</span>
nombres.<span class="fn">push</span>(<span class="num">9</span>);    <span class="cmt">// ajoute à la fin       → mute</span>
nombres.<span class="fn">pop</span>();       <span class="cmt">// retire le dernier     → mute</span>
nombres.<span class="fn">shift</span>();     <span class="cmt">// retire le premier     → mute</span>
nombres.<span class="fn">unshift</span>(<span class="num">0</span>); <span class="cmt">// ajoute au début       → mute</span>
nombres.<span class="fn">sort</span>();      <span class="cmt">// trie en place         → mute</span>
nombres.<span class="fn">reverse</span>();  <span class="cmt">// inverse en place      → mute</span>
nombres.<span class="fn">splice</span>(<span class="num">1</span>, <span class="num">2</span>); <span class="cmt">// retire/insère        → mute</span>

<span class="cmt">// Méthodes IMMUTABLES (retournent un nouveau tableau)</span>
<span class="kw">const</span> a <span class="op">=</span> nombres.<span class="fn">map</span>(x <span class="op">=></span> x <span class="op">*</span> <span class="num">2</span>);    <span class="cmt">// nouveau tableau</span>
<span class="kw">const</span> b <span class="op">=</span> nombres.<span class="fn">filter</span>(x <span class="op">=></span> x <span class="op">></span> <span class="num">3</span>); <span class="cmt">// nouveau tableau</span>
<span class="kw">const</span> c <span class="op">=</span> nombres.<span class="fn">slice</span>(<span class="num">1</span>, <span class="num">3</span>);        <span class="cmt">// nouveau tableau</span>
<span class="kw">const</span> d <span class="op">=</span> [...nombres].<span class="fn">sort</span>();        <span class="cmt">// copier puis trier !</span></pre>
      </div>

      <h2>map, filter, reduce — La triade des méthodes fonctionnelles</h2>

      <p>Ces trois méthodes couvrent la grande majorité des transformations de données. Comprendre <code>reduce</code> en particulier est un rite de passage — c'est la plus puissante mais aussi la plus confusante.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> produits <span class="op">=</span> [
  { nom: <span class="str">"Stylo"</span>,   prix: <span class="num">2</span>,  qte: <span class="num">10</span> },
  { nom: <span class="str">"Cahier"</span>,  prix: <span class="num">5</span>,  qte: <span class="num">3</span>  },
  { nom: <span class="str">"Règle"</span>,   prix: <span class="num">3</span>,  qte: <span class="num">7</span>  },
];

<span class="cmt">// map : transforme chaque élément → nouveau tableau de MÊME longueur</span>
<span class="kw">const</span> noms <span class="op">=</span> produits.<span class="fn">map</span>(p <span class="op">=></span> p.nom);
<span class="cmt">// ["Stylo", "Cahier", "Règle"]</span>

<span class="kw">const</span> avecTotal <span class="op">=</span> produits.<span class="fn">map</span>(p <span class="op">=></span> ({ ...p, total: p.prix <span class="op">*</span> p.qte }));
<span class="cmt">// [{nom:"Stylo",prix:2,qte:10,total:20}, ...]</span>

<span class="cmt">// filter : garde les éléments qui satisfont la condition</span>
<span class="kw">const</span> chers <span class="op">=</span> produits.<span class="fn">filter</span>(p <span class="op">=></span> p.prix <span class="op">></span> <span class="num">2</span>);
<span class="cmt">// [{nom:"Cahier",...}, {nom:"Règle",...}]</span>

<span class="cmt">// Chaîner map et filter</span>
<span class="kw">const</span> nomsChers <span class="op">=</span> produits
  .<span class="fn">filter</span>(p <span class="op">=></span> p.prix <span class="op">></span> <span class="num">2</span>)
  .<span class="fn">map</span>(p <span class="op">=></span> p.nom);
<span class="cmt">// ["Cahier", "Règle"]</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// reduce : accumule une valeur — le couteau suisse !</span>
<span class="cmt">// reduce(callback, valeurInitiale)</span>
<span class="cmt">// callback(accumulateur, elementCourant) → nouvel accumulateur</span>

<span class="kw">const</span> nombres <span class="op">=</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>];

<span class="cmt">// Étape par étape :</span>
<span class="cmt">// acc=0, n=1 → 0+1 = 1</span>
<span class="cmt">// acc=1, n=2 → 1+2 = 3</span>
<span class="cmt">// acc=3, n=3 → 3+3 = 6</span>
<span class="cmt">// acc=6, n=4 → 6+4 = 10</span>
<span class="cmt">// acc=10,n=5 → 10+5= 15  ← résultat final</span>
<span class="kw">const</span> somme <span class="op">=</span> nombres.<span class="fn">reduce</span>((acc, n) <span class="op">=></span> acc <span class="op">+</span> n, <span class="num">0</span>);
<span class="cmt">// 15</span>

<span class="cmt">// reduce pour construire un objet</span>
<span class="kw">const</span> inventaire <span class="op">=</span> produits.<span class="fn">reduce</span>((acc, p) <span class="op">=></span> {
  acc[p.nom] <span class="op">=</span> p.qte;
  <span class="kw">return</span> acc;
}, {});
<span class="cmt">// { Stylo: 10, Cahier: 3, Règle: 7 }</span>

<span class="cmt">// reduce pour calculer le total du panier</span>
<span class="kw">const</span> totalPanier <span class="op">=</span> produits.<span class="fn">reduce</span>((acc, p) <span class="op">=></span> acc <span class="op">+</span> p.prix <span class="op">*</span> p.qte, <span class="num">0</span>);
<span class="cmt">// 2*10 + 5*3 + 3*7 = 20 + 15 + 21 = 56</span></pre>
      </div>

      <h2>sort — Le piège de comparaison par défaut</h2>

      <p>Le comportement par défaut de <code>.sort()</code> est contre-intuitif : il convertit tous les éléments en <strong>chaînes</strong> et les compare en ordre lexicographique (comme un dictionnaire). Pour des nombres, c'est un désastre.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// ❌ Piège : sort par défaut = tri lexicographique</span>
[<span class="num">10</span>, <span class="num">9</span>, <span class="num">2</span>, <span class="num">21</span>, <span class="num">100</span>].<span class="fn">sort</span>();
<span class="cmt">// [10, 100, 2, 21, 9] — "10" &lt; "2" lexicographiquement !</span>

<span class="cmt">// ✅ Tri numérique avec comparateur</span>
[<span class="num">10</span>, <span class="num">9</span>, <span class="num">2</span>, <span class="num">21</span>, <span class="num">100</span>].<span class="fn">sort</span>((a, b) <span class="op">=></span> a <span class="op">-</span> b);
<span class="cmt">// [2, 9, 10, 21, 100] ✓ (a-b: positif → b avant a)</span>

[<span class="num">10</span>, <span class="num">9</span>, <span class="num">2</span>, <span class="num">21</span>, <span class="num">100</span>].<span class="fn">sort</span>((a, b) <span class="op">=></span> b <span class="op">-</span> a);
<span class="cmt">// [100, 21, 10, 9, 2] — ordre décroissant</span>

<span class="cmt">// Trier des objets par propriété</span>
<span class="kw">const</span> users <span class="op">=</span> [
  { nom: <span class="str">"Charlie"</span>, age: <span class="num">30</span> },
  { nom: <span class="str">"Alice"</span>,   age: <span class="num">25</span> },
  { nom: <span class="str">"Bob"</span>,     age: <span class="num">35</span> },
];

<span class="cmt">// Par age</span>
[...users].<span class="fn">sort</span>((a, b) <span class="op">=></span> a.age <span class="op">-</span> b.age);

<span class="cmt">// Par nom (alphabétique, accents inclus)</span>
[...users].<span class="fn">sort</span>((a, b) <span class="op">=></span> a.nom.<span class="fn">localeCompare</span>(b.nom));</pre>
      </div>

      <h2>find, findIndex, some, every, flat</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> users <span class="op">=</span> [
  { id: <span class="num">1</span>, nom: <span class="str">"Alice"</span>, actif: <span class="kw">true</span>  },
  { id: <span class="num">2</span>, nom: <span class="str">"Bob"</span>,   actif: <span class="kw">false</span> },
  { id: <span class="num">3</span>, nom: <span class="str">"Clara"</span>, actif: <span class="kw">true</span>  },
];

<span class="cmt">// find : premier élément qui correspond (ou undefined)</span>
users.<span class="fn">find</span>(u <span class="op">=></span> u.id <span class="op">===</span> <span class="num">2</span>);       <span class="cmt">// {id:2, nom:"Bob"...}</span>

<span class="cmt">// findIndex : index du premier correspondant (ou -1)</span>
users.<span class="fn">findIndex</span>(u <span class="op">=></span> u.id <span class="op">===</span> <span class="num">2</span>); <span class="cmt">// 1</span>

<span class="cmt">// some : au moins UN satisfait ?</span>
users.<span class="fn">some</span>(u <span class="op">=></span> u.actif);   <span class="cmt">// true (Alice est active)</span>

<span class="cmt">// every : TOUS satisfont ?</span>
users.<span class="fn">every</span>(u <span class="op">=></span> u.actif);  <span class="cmt">// false (Bob est inactif)</span>

<span class="cmt">// flat : aplatit les tableaux imbriqués</span>
[<span class="num">1</span>, [<span class="num">2</span>, <span class="num">3</span>], [<span class="num">4</span>, [<span class="num">5</span>, <span class="num">6</span>]]].<span class="fn">flat</span>();    <span class="cmt">// [1, 2, 3, 4, [5, 6]]</span>
[<span class="num">1</span>, [<span class="num">2</span>, <span class="num">3</span>], [<span class="num">4</span>, [<span class="num">5</span>, <span class="num">6</span>]]].<span class="fn">flat</span>(<span class="cls">Infinity</span>); <span class="cmt">// [1, 2, 3, 4, 5, 6]</span>

<span class="cmt">// flatMap : map puis flat (très utile)</span>
[<span class="str">"Bonjour monde"</span>, <span class="str">"Hello world"</span>]
  .<span class="fn">flatMap</span>(s <span class="op">=></span> s.<span class="fn">split</span>(<span class="str">" "</span>));
<span class="cmt">// ["Bonjour", "monde", "Hello", "world"]</span></pre>
      </div>

      <h2>Objets — Accès, propriétés calculées, et immutabilité</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> config <span class="op">=</span> { theme: <span class="str">"dark"</span>, langue: <span class="str">"fr"</span>, version: <span class="num">2</span> };

<span class="cmt">// Notation pointée vs crochet</span>
config.theme;          <span class="cmt">// "dark"   (clé littérale connue)</span>
config[<span class="str">"theme"</span>];      <span class="cmt">// "dark"   (identique)</span>

<span class="kw">const</span> cle <span class="op">=</span> <span class="str">"langue"</span>;
config[cle];           <span class="cmt">// "fr"    (clé dynamique — variable)</span>

<span class="cmt">// Propriétés calculées (computed properties)</span>
<span class="kw">const</span> champ <span class="op">=</span> <span class="str">"nom"</span>;
<span class="kw">const</span> user <span class="op">=</span> { [champ]: <span class="str">"Alice"</span>, age: <span class="num">30</span> };
<span class="cmt">// { nom: "Alice", age: 30 }</span>

<span class="cmt">// Object.freeze : rend un objet immuable</span>
<span class="kw">const</span> CONSTANTES <span class="op">=</span> <span class="cls">Object</span>.<span class="fn">freeze</span>({
  PI:    <span class="num">3.14159</span>,
  E:     <span class="num">2.71828</span>,
  MAX:   <span class="num">1000</span>
});
CONSTANTES.PI <span class="op">=</span> <span class="num">99</span>; <span class="cmt">// silencieusement ignoré (strict mode: TypeError)</span>
console.<span class="fn">log</span>(CONSTANTES.PI); <span class="cmt">// 3.14159</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Object.assign vs spread : fusionner des objets</span>
<span class="kw">const</span> defauts <span class="op">=</span> { theme: <span class="str">"light"</span>, taille: <span class="num">14</span>, langue: <span class="str">"fr"</span> };
<span class="kw">const</span> preferences <span class="op">=</span> { theme: <span class="str">"dark"</span>, notifications: <span class="kw">true</span> };

<span class="cmt">// Object.assign mute le premier argument</span>
<span class="kw">const</span> config1 <span class="op">=</span> <span class="cls">Object</span>.<span class="fn">assign</span>({}, defauts, preferences);

<span class="cmt">// Spread : plus lisible, immuable</span>
<span class="kw">const</span> config2 <span class="op">=</span> { ...defauts, ...preferences };
<span class="cmt">// { theme: "dark", taille: 14, langue: "fr", notifications: true }</span>
<span class="cmt">// Les propriétés de droite écrasent celles de gauche</span>

<span class="cmt">// Récupérer clés, valeurs, entrées</span>
<span class="cls">Object</span>.<span class="fn">keys</span>(config2);    <span class="cmt">// ["theme", "taille", "langue", "notifications"]</span>
<span class="cls">Object</span>.<span class="fn">values</span>(config2);  <span class="cmt">// ["dark", 14, "fr", true]</span>
<span class="cls">Object</span>.<span class="fn">entries</span>(config2); <span class="cmt">// [["theme","dark"], ["taille",14], ...]</span>

<span class="cmt">// Transformer un objet avec entries + fromEntries</span>
<span class="kw">const</span> majuscules <span class="op">=</span> <span class="cls">Object</span>.<span class="fn">fromEntries</span>(
  <span class="cls">Object</span>.<span class="fn">entries</span>(config2).<span class="fn">map</span>(([k, v]) <span class="op">=></span> [k.<span class="fn">toUpperCase</span>(), v])
);
<span class="cmt">// { THEME: "dark", TAILLE: 14, ... }</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p><code>Object.entries()</code> + <code>Object.fromEntries()</code> est le pattern pour transformer les propriétés d'un objet de façon immutable — l'équivalent de <code>.map()</code> pour les tableaux, mais pour les objets.</p>
      </div>

      <h2>Méthodes récentes — ES2022 / ES2023</h2>

      <p>Ces méthodes sont désormais disponibles dans tous les navigateurs modernes et Node.js 18+. Elles comblent des manques gênants et méritent d'être connues.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// at() — accès avec index négatif (ES2022)</span>
<span class="kw">const</span> fruits <span class="op">=</span> [<span class="str">"pomme"</span>, <span class="str">"banane"</span>, <span class="str">"cerise"</span>];

<span class="cmt">// Avant : fruits[fruits.length - 1] — verbeux</span>
fruits.<span class="fn">at</span>(<span class="op">-</span><span class="num">1</span>);  <span class="cmt">// "cerise" (dernier élément)</span>
fruits.<span class="fn">at</span>(<span class="op">-</span><span class="num">2</span>);  <span class="cmt">// "banane"</span>
fruits.<span class="fn">at</span>(<span class="num">0</span>);   <span class="cmt">// "pomme" (fonctionne aussi en positif)</span>

<span class="cmt">// Fonctionne aussi sur les strings</span>
<span class="str">"Bonjour"</span>.<span class="fn">at</span>(<span class="op">-</span><span class="num">1</span>); <span class="cmt">// "r"</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// with() — remplacer un élément SANS muter (ES2023)</span>
<span class="kw">const</span> scores <span class="op">=</span> [<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">40</span>];

<span class="cmt">// ❌ Mutation classique</span>
scores[<span class="num">2</span>] <span class="op">=</span> <span class="num">99</span>; <span class="cmt">// modifie le tableau original</span>

<span class="cmt">// ✅ with() : retourne un NOUVEAU tableau</span>
<span class="kw">const</span> nouveauScores <span class="op">=</span> scores.<span class="fn">with</span>(<span class="num">2</span>, <span class="num">99</span>);
<span class="cmt">// scores = [10, 20, 99, 40] (muté au-dessus pour l'exemple)</span>
<span class="cmt">// nouveauScores = [10, 20, 99, 40]</span>

<span class="cmt">// Fonctionne aussi avec index négatif</span>
<span class="kw">const</span> scores2 <span class="op">=</span> [<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>];
scores2.<span class="fn">with</span>(<span class="op">-</span><span class="num">1</span>, <span class="num">99</span>); <span class="cmt">// [10, 20, 99]</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Object.hasOwn() — remplacement moderne de hasOwnProperty (ES2022)</span>
<span class="kw">const</span> user <span class="op">=</span> { nom: <span class="str">"Alice"</span>, age: <span class="num">30</span> };

<span class="cmt">// ❌ hasOwnProperty : peut être écrasé, verbeux</span>
user.<span class="fn">hasOwnProperty</span>(<span class="str">"nom"</span>);  <span class="cmt">// true (mais fragile)</span>

<span class="cmt">// ✅ Object.hasOwn() : méthode statique, toujours fiable</span>
<span class="cls">Object</span>.<span class="fn">hasOwn</span>(user, <span class="str">"nom"</span>);    <span class="cmt">// true</span>
<span class="cls">Object</span>.<span class="fn">hasOwn</span>(user, <span class="str">"email"</span>);  <span class="cmt">// false</span>
<span class="cls">Object</span>.<span class="fn">hasOwn</span>(user, <span class="str">"toString"</span>); <span class="cmt">// false (hérité du prototype)</span>

<span class="cmt">// Cas d'usage : filtrer les propriétés propres d'un objet</span>
<span class="kw">const</span> propres <span class="op">=</span> <span class="cls">Object</span>.<span class="fn">keys</span>(user).<span class="fn">filter</span>(k <span class="op">=></span> <span class="cls">Object</span>.<span class="fn">hasOwn</span>(user, k));
<span class="cmt">// ["nom", "age"]</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>Ces trois méthodes sont conçues pour écrire du code <strong>immutable et défensif</strong>. <code>at()</code> évite les erreurs d'index hors-limites sur les indices négatifs, <code>with()</code> permet des mises à jour sans mutation, et <code>Object.hasOwn()</code> ne peut pas être écrasé par accident.</p>
      </div>

      <div class="challenge-block">
        <h3>Défi : Agrégateur de données</h3>
        <p>Vous avez une liste de transactions. Calculez : le total des achats, le nombre de ventes par catégorie, et la transaction la plus élevée par catégorie.</p>
        <pre><span class="kw">const</span> transactions <span class="op">=</span> [
  { type: <span class="str">"achat"</span>, categorie: <span class="str">"tech"</span>,   montant: <span class="num">299</span> },
  { type: <span class="str">"achat"</span>, categorie: <span class="str">"livre"</span>,  montant: <span class="num">25</span>  },
  { type: <span class="str">"vente"</span>, categorie: <span class="str">"tech"</span>,   montant: <span class="num">150</span> },
  { type: <span class="str">"achat"</span>, categorie: <span class="str">"tech"</span>,   montant: <span class="num">89</span>  },
  { type: <span class="str">"achat"</span>, categorie: <span class="str">"livre"</span>,  montant: <span class="num">40</span>  },
];

<span class="cmt">// Total des achats</span>
<span class="kw">const</span> totalAchats <span class="op">=</span> transactions
  .<span class="fn">filter</span>(t <span class="op">=></span> t.type <span class="op">===</span> <span class="str">"achat"</span>)
  .<span class="fn">reduce</span>((acc, t) <span class="op">=></span> acc <span class="op">+</span> t.montant, <span class="num">0</span>);
<span class="cmt">// 453</span>

<span class="cmt">// Max par catégorie</span>
<span class="kw">const</span> maxParCat <span class="op">=</span> transactions.<span class="fn">reduce</span>((acc, t) <span class="op">=></span> {
  acc[t.categorie] <span class="op">=</span> <span class="cls">Math</span>.<span class="fn">max</span>(acc[t.categorie] <span class="op">||</span> <span class="num">0</span>, t.montant);
  <span class="kw">return</span> acc;
}, {});
<span class="cmt">// { tech: 299, livre: 40 }</span></pre>
      </div>
    `,
    quiz: [
      {
        question: "Quel est le résultat de [10, 9, 2, 100].sort() en JavaScript ?",
        sub: "Comportement du tri par défaut",
        options: [
          "[2, 9, 10, 100]",
          "[100, 10, 9, 2]",
          "[10, 100, 2, 9]",
          "Une erreur est lancée"
        ],
        correct: 2,
        explanation: "✅ Exact ! Par défaut, .sort() convertit les éléments en strings et les compare lexicographiquement. '10' < '100' < '2' < '9' car le tri compare caractère par caractère. Pour un tri numérique, utilisez .sort((a, b) => a - b)."
      },
      {
        question: "Quelle méthode crée une VRAIE copie profonde d'un objet imbriqué ?",
        sub: "Copie vs référence",
        options: [
          "{ ...objet }",
          "Object.assign({}, objet)",
          "objet.slice()",
          "structuredClone(objet)"
        ],
        correct: 3,
        explanation: "✅ Parfait ! structuredClone() (ES2022) est la seule méthode native qui crée une copie profonde récursive. Le spread {...} et Object.assign() font des copies superficielles : les objets imbriqués sont encore partagés par référence."
      },
      {
        question: "Quelle est la différence entre .find() et .filter() ?",
        sub: "Méthodes de recherche dans les tableaux",
        options: [
          "find est plus rapide, filter est plus précis",
          "find retourne le premier élément correspondant (ou undefined), filter retourne un nouveau tableau de TOUS les éléments correspondants",
          "filter s'arrête au premier match, find continue",
          "Il n'y a pas de différence"
        ],
        correct: 1,
        explanation: "✅ Exact ! .find() retourne la valeur du premier élément qui satisfait la condition et s'arrête (court-circuit). .filter() parcourt tout le tableau et retourne un nouveau tableau avec TOUS les éléments satisfaisant la condition."
      }
    ]
};
