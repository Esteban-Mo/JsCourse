export default {
  id: 1,
  title: 'Variables & Types',
  icon: '📦',
  level: 'Débutant',
  stars: '★★☆☆☆',
  content: () => `
    <div class="chapter-tag">Chapitre 01 · Les Bases</div>
    <h1>Variables<br>& <span class="highlight">Types</span></h1>

    <div class="chapter-intro-card">
      <div class="level-badge level-beginner">📦</div>
      <div class="chapter-meta">
        <div class="difficulty-stars">★★☆☆☆</div>
        <h3>Variables & Types de données</h3>
        <p>Durée estimée : 25 min · 3 quizz inclus</p>
      </div>
    </div>

    <h2>Qu'est-ce qu'une variable ?</h2>
    <p>Imagine une variable comme une <strong>boîte étiquetée</strong> dans la mémoire de ton ordinateur. La boîte a un nom (l'étiquette), et elle contient une valeur. À tout moment, tu peux regarder ce qu'il y a dedans, ou remplacer son contenu.</p>
    <p>En JavaScript, tu as <strong>trois mots-clés</strong> pour créer une boîte : <code>var</code>, <code>let</code> et <code>const</code>. Ils ont des comportements très différents — comprendre ces différences est fondamental.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="cmt">// const : une boîte scellée — la valeur ne change pas</span>
<span class="kw">const</span> PI <span class="op">=</span> <span class="num">3.14159</span>;
<span class="cmt">// PI = 3; ❌ TypeError: Assignment to constant variable</span>

<span class="cmt">// let : une boîte normale — on peut changer son contenu</span>
<span class="kw">let</span> score <span class="op">=</span> <span class="num">0</span>;
score <span class="op">=</span> <span class="num">100</span>; <span class="cmt">// ✅ OK</span>
score <span class="op">+=</span> <span class="num">50</span>; <span class="cmt">// score vaut maintenant 150</span>

<span class="cmt">// var : l'ancienne façon — à éviter (on verra pourquoi)</span>
<span class="kw">var</span> ancien <span class="op">=</span> <span class="str">"danger"</span>;</pre>
    </div>

    <div class="info-box tip">
      <div class="info-icon">💡</div>
      <p><strong>Règle d'or :</strong> utilise toujours <code>const</code> par défaut. Passe à <code>let</code> uniquement si tu sais que la valeur va changer. N'utilise jamais <code>var</code> dans du code moderne.</p>
    </div>

    <h2>La portée (scope) — où vit ta variable ?</h2>
    <p>La portée définit <strong>où dans le code</strong> une variable est accessible. C'est l'une des sources de bugs les plus fréquentes pour les débutants.</p>
    <p><code>let</code> et <code>const</code> ont une portée de <strong>bloc</strong> — elles n'existent qu'à l'intérieur des accolades <code>{}</code> qui les contiennent. <code>var</code> a une portée de <strong>fonction</strong>, ce qui est moins prévisible.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="cmt">// Portée de bloc avec let/const</span>
{
  <span class="kw">let</span> message <span class="op">=</span> <span class="str">"je suis dans le bloc"</span>;
  console.<span class="fn">log</span>(message); <span class="cmt">// ✅ "je suis dans le bloc"</span>
}
<span class="cmt">// console.log(message); ❌ ReferenceError : message n'existe plus</span>

<span class="cmt">// Problème classique avec var</span>
<span class="kw">for</span> (<span class="kw">var</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;</span> <span class="num">3</span>; i<span class="op">++</span>) { <span class="cmt">/* ... */</span> }
console.<span class="fn">log</span>(i); <span class="cmt">// ⚠️ 3 — i "s'échappe" du bloc !</span>

<span class="cmt">// Avec let : comportement attendu</span>
<span class="kw">for</span> (<span class="kw">let</span> j <span class="op">=</span> <span class="num">0</span>; j <span class="op">&lt;</span> <span class="num">3</span>; j<span class="op">++</span>) { <span class="cmt">/* ... */</span> }
<span class="cmt">// console.log(j); ❌ ReferenceError — j est mort à la fin du for</span></pre>
    </div>

    <h2>Le Hoisting — les variables "remontent"</h2>
    <p>JavaScript a un comportement déroutant appelé <strong>hoisting</strong> (levage) : avant d'exécuter ton code, le moteur JS lit toutes les déclarations et les "remonte" en haut de leur portée. Mais attention — seule la <em>déclaration</em> remonte, pas la <em>valeur</em>.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="cmt">// Avec var : la variable existe mais vaut undefined</span>
console.<span class="fn">log</span>(nom); <span class="cmt">// undefined (pas d'erreur — var est hoistée)</span>
<span class="kw">var</span> nom <span class="op">=</span> <span class="str">"Alice"</span>;
console.<span class="fn">log</span>(nom); <span class="cmt">// "Alice"</span>

<span class="cmt">// Ce que JS fait en réalité (mentalement) :</span>
<span class="kw">var</span> nom;           <span class="cmt">// déclaration remontée → undefined</span>
console.<span class="fn">log</span>(nom); <span class="cmt">// undefined</span>
nom <span class="op">=</span> <span class="str">"Alice"</span>;     <span class="cmt">// l'assignation reste en place</span>

<span class="cmt">// Avec let/const : Zone Morte Temporelle (TDZ)</span>
<span class="cmt">// console.log(age); ❌ ReferenceError : Cannot access before initialization</span>
<span class="kw">let</span> age <span class="op">=</span> <span class="num">25</span>;
console.<span class="fn">log</span>(age); <span class="cmt">// ✅ 25</span></pre>
    </div>

    <div class="info-box warning">
      <div class="info-icon">⚠️</div>
      <p>La <strong>Zone Morte Temporelle (TDZ)</strong> est la zone entre le début du bloc et la ligne de déclaration d'un <code>let</code>/<code>const</code>. Accéder à la variable dans cette zone lance une <code>ReferenceError</code> — c'est en fait un comportement <em>voulu</em> qui te protège des bugs.</p>
    </div>

    <h2>Les types de données</h2>
    <p>En JavaScript, <strong>chaque valeur a un type</strong>. Le moteur JS sait si c'est un nombre, du texte, un booléen, etc. Il y a 7 types primitifs (immuables, copiés par valeur) et 1 type objet (copié par référence).</p>

    <div class="table-container">
      <table>
        <tr><th>Type</th><th>Exemple</th><th>Description</th></tr>
        <tr><td><code>string</code></td><td><code>"Bonjour"</code></td><td>Du texte, délimité par <code>""</code>, <code>''</code> ou <code>\`\`</code></td></tr>
        <tr><td><code>number</code></td><td><code>42, 3.14, NaN, Infinity</code></td><td>Entier ET décimal — JS n'a qu'un seul type numérique</td></tr>
        <tr><td><code>boolean</code></td><td><code>true, false</code></td><td>Vrai ou faux — résultat d'une comparaison</td></tr>
        <tr><td><code>null</code></td><td><code>null</code></td><td>Absence de valeur <em>intentionnelle</em> — "je sais qu'il n'y a rien"</td></tr>
        <tr><td><code>undefined</code></td><td><code>undefined</code></td><td>Variable déclarée mais non initialisée — "valeur inconnue"</td></tr>
        <tr><td><code>bigint</code></td><td><code>9007199254740991n</code></td><td>Entiers arbitrairement grands (suffixe <code>n</code>)</td></tr>
        <tr><td><code>symbol</code></td><td><code>Symbol("id")</code></td><td>Identifiant unique et immuable</td></tr>
        <tr><td><code>object</code></td><td><code>{}, [], function</code></td><td>Données complexes — copié par référence</td></tr>
      </table>
    </div>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="cmt">// typeof : connaître le type d'une valeur</span>
console.<span class="fn">log</span>(<span class="kw">typeof</span> <span class="str">"hello"</span>);     <span class="cmt">// "string"</span>
console.<span class="fn">log</span>(<span class="kw">typeof</span> <span class="num">42</span>);          <span class="cmt">// "number"</span>
console.<span class="fn">log</span>(<span class="kw">typeof</span> <span class="kw">true</span>);        <span class="cmt">// "boolean"</span>
console.<span class="fn">log</span>(<span class="kw">typeof</span> <span class="kw">undefined</span>);   <span class="cmt">// "undefined"</span>
console.<span class="fn">log</span>(<span class="kw">typeof</span> <span class="kw">null</span>);        <span class="cmt">// "object" ← bug historique de JS !</span>
console.<span class="fn">log</span>(<span class="kw">typeof</span> {});          <span class="cmt">// "object"</span>
console.<span class="fn">log</span>(<span class="kw">typeof</span> <span class="fn">function</span>(){}); <span class="cmt">// "function"</span></pre>
    </div>

    <h2>null vs undefined — la nuance importante</h2>
    <p>Ces deux valeurs sont souvent confondues mais représentent des concepts différents :</p>
    <ul style="color:#a0a0c0;line-height:2;padding-left:20px;font-size:15px;margin-bottom:16px">
      <li><code>undefined</code> = JavaScript dit "cette variable existe, mais je ne sais pas sa valeur"</li>
      <li><code>null</code> = le développeur dit "cette variable existe, et intentionnellement elle ne contient rien"</li>
    </ul>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="kw">let</span> utilisateur;          <span class="cmt">// undefined — pas encore chargé</span>
utilisateur <span class="op">=</span> <span class="kw">null</span>;       <span class="cmt">// null — intentionnellement vide (ex: déconnecté)</span>

<span class="cmt">// Comparaison == (lâche) vs === (stricte)</span>
console.<span class="fn">log</span>(<span class="kw">null</span> <span class="op">==</span>  <span class="kw">undefined</span>); <span class="cmt">// true  — JavaScript les "égalise" avec ==</span>
console.<span class="fn">log</span>(<span class="kw">null</span> <span class="op">===</span> <span class="kw">undefined</span>); <span class="cmt">// false — types différents avec ===</span>

<span class="cmt">// Dans la pratique : toujours utiliser ===</span>
<span class="kw">if</span> (utilisateur <span class="op">===</span> <span class="kw">null</span>) {
  console.<span class="fn">log</span>(<span class="str">"Utilisateur déconnecté"</span>);
}</pre>
    </div>

    <h2>NaN — Not a Number</h2>
    <p><code>NaN</code> est une valeur spéciale de type <code>number</code> qui représente le résultat d'une opération mathématique invalide. Son comportement est piégeux.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="kw">const</span> resultat <span class="op">=</span> <span class="num">0</span> <span class="op">/</span> <span class="num">0</span>;       <span class="cmt">// NaN</span>
<span class="kw">const</span> invalide <span class="op">=</span> <span class="cls">parseInt</span>(<span class="str">"abc"</span>); <span class="cmt">// NaN</span>

<span class="cmt">// Le piège classique</span>
console.<span class="fn">log</span>(resultat <span class="op">===</span> resultat); <span class="cmt">// false ← NaN n'est JAMAIS égal à lui-même !</span>

<span class="cmt">// La bonne façon de vérifier</span>
console.<span class="fn">log</span>(<span class="cls">Number</span>.<span class="fn">isNaN</span>(resultat));  <span class="cmt">// true ✅</span>
console.<span class="fn">log</span>(<span class="fn">isNaN</span>(<span class="str">"hello"</span>));           <span class="cmt">// true ⚠️ isNaN() convertit d'abord en Number</span>
console.<span class="fn">log</span>(<span class="cls">Number</span>.<span class="fn">isNaN</span>(<span class="str">"hello"</span>));  <span class="cmt">// false ✅ Number.isNaN() est plus strict</span></pre>
    </div>

    <h2>La coercition de types — attention aux surprises</h2>
    <p>JavaScript <strong>convertit automatiquement</strong> les types dans certaines situations. C'est la coercition implicite. Elle peut produire des résultats surprenants si tu ne la comprends pas.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="cmt">// L'opérateur + est ambigu : addition OU concaténation</span>
console.<span class="fn">log</span>(<span class="num">1</span> <span class="op">+</span> <span class="str">"2"</span>);       <span class="cmt">// "12" — number converti en string</span>
console.<span class="fn">log</span>(<span class="str">"5"</span> <span class="op">-</span> <span class="num">2</span>);       <span class="cmt">// 3   — string converti en number</span>
console.<span class="fn">log</span>(<span class="kw">true</span> <span class="op">+</span> <span class="kw">true</span>);   <span class="cmt">// 2   — true vaut 1</span>
console.<span class="fn">log</span>(<span class="kw">false</span> <span class="op">+</span> <span class="num">1</span>);    <span class="cmt">// 1   — false vaut 0</span>

<span class="cmt">// Valeurs "falsy" : converties en false dans un contexte booléen</span>
<span class="cmt">// false, 0, "", null, undefined, NaN</span>
<span class="kw">if</span> (<span class="num">0</span>)        { <span class="cmt">/* jamais exécuté */</span> }
<span class="kw">if</span> (<span class="str">""</span>)       { <span class="cmt">/* jamais exécuté */</span> }
<span class="kw">if</span> (<span class="kw">null</span>)     { <span class="cmt">/* jamais exécuté */</span> }

<span class="cmt">// Valeurs "truthy" : tout le reste</span>
<span class="kw">if</span> (<span class="str">"0"</span>)     { <span class="cmt">/* exécuté ! "0" est une string non-vide */</span> }
<span class="kw">if</span> ([])      { <span class="cmt">/* exécuté ! un tableau vide est truthy */</span> }

<span class="cmt">// Conversion explicite (préférable)</span>
<span class="cls">Number</span>(<span class="str">"42"</span>);     <span class="cmt">// 42</span>
<span class="cls">String</span>(<span class="num">42</span>);       <span class="cmt">// "42"</span>
<span class="cls">Boolean</span>(<span class="num">0</span>);       <span class="cmt">// false</span>
<span class="cls">Boolean</span>(<span class="str">"hello"</span>); <span class="cmt">// true</span></pre>
    </div>

    <div class="info-box danger">
      <div class="info-icon">🚫</div>
      <p>Toujours utiliser <code>===</code> (égalité stricte) plutôt que <code>==</code> (égalité lâche avec coercition). <code>"1" == 1</code> est <code>true</code> en JS — ce genre de comparaison est une source de bugs.</p>
    </div>

    <h2>Template literals — les strings modernes</h2>
    <p>Les template literals utilisent les backticks (<code>\`</code>) au lieu des guillemets. Ils permettent d'<strong>insérer des expressions directement</strong> dans une chaîne et d'écrire du texte sur plusieurs lignes.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="kw">const</span> prenom <span class="op">=</span> <span class="str">"Alice"</span>;
<span class="kw">const</span> age <span class="op">=</span> <span class="num">25</span>;

<span class="cmt">// Concaténation classique — difficile à lire</span>
<span class="str">"Bonjour "</span> <span class="op">+</span> prenom <span class="op">+</span> <span class="str">", tu as "</span> <span class="op">+</span> age <span class="op">+</span> <span class="str">" ans."</span>;

<span class="cmt">// Template literal — beaucoup plus lisible</span>
<span class="str">\`Bonjour \${prenom}, tu as \${age} ans.\`</span>;

<span class="cmt">// On peut mettre n'importe quelle expression dans \${ }</span>
<span class="str">\`Dans 10 ans tu auras \${age + 10} ans.\`</span>;
<span class="str">\`Tu es \${age >= 18 ? "majeur" : "mineur"}.\`</span>;

<span class="cmt">// Multilignes : les sauts de ligne sont préservés</span>
<span class="kw">const</span> html <span class="op">=</span> <span class="str">\`
  &lt;div class="carte"&gt;
    &lt;h2&gt;\${prenom}&lt;/h2&gt;
    &lt;p&gt;Âge : \${age}&lt;/p&gt;
  &lt;/div&gt;
\`</span>;</pre>
    </div>

    <div class="challenge-block">
      <div class="challenge-title">⚡ DÉFI PRATIQUE</div>
      <p style="color:#a0a0c0;font-size:14px">Déclare une variable <code>nom</code> avec ton prénom, une variable <code>annee</code> avec ton année de naissance (2024 - ton âge), et affiche dans la console : <strong>"Bonjour [nom], tu es né en [annee] et tu as [age] ans."</strong> en utilisant un template literal et en calculant l'âge dynamiquement.</p>
    </div>
  `,
  quiz: [
    {
      question: "Pourquoi préfère-t-on let et const à var ?",
      sub: "Portée et comportement des variables",
      options: [
        "var est plus lent à l'exécution",
        "let/const ont une portée de bloc prévisible et évitent les bugs de hoisting/TDZ",
        "var ne fonctionne pas dans les navigateurs modernes",
        "let et const sont plus courts à écrire"
      ],
      correct: 1,
      explanation: "✅ Exact ! let/const sont limités au bloc {} qui les contient, ce qui évite les 'fuites' de variables. Ils ont aussi la TDZ qui protège contre l'utilisation avant déclaration — un bug fréquent avec var."
    },
    {
      question: "Que retourne typeof null en JavaScript ?",
      sub: "Un cas historique de JS",
      options: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correct: 2,
      explanation: "✅ Surprenant mais vrai ! typeof null retourne \"object\" — c'est un bug dans les tout premiers jours de JavaScript (1995) qui n'a jamais été corrigé pour ne pas casser l'existant."
    },
    {
      question: "Quelle est la valeur de : console.log(1 + '2') ?",
      sub: "Coercition de types en JavaScript",
      options: ["3", '"12"', '"3"', "NaN"],
      correct: 1,
      explanation: "✅ C'est '12' (string) ! Quand + rencontre un string et un number, il convertit le number en string et les concatène. Pour additionner, utilise Number('2') d'abord : 1 + Number('2') = 3."
    }
  ]
};
