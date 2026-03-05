export default {
    id: 2,
    title: 'Opérateurs',
    icon: '➕',
    level: 'Débutant',
    stars: '★★☆☆☆',
    content: () => `
      <div class="chapter-tag">Chapitre 02 · Les Bases</div>
      <h1>Opérateurs<br>& <span class="highlight">Expressions</span></h1>

      <div class="chapter-intro-card">
        <div class="level-badge level-beginner">➕</div>
        <div class="chapter-meta">
          <div class="difficulty-stars">★★☆☆☆</div>
          <h3>Opérateurs arithmétiques, d'assignation, de comparaison et logiques</h3>
          <p>Durée estimée : 20 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Un opérateur est un symbole qui dit à JavaScript d'effectuer une opération sur une ou plusieurs valeurs. Tu les utilises en permanence : pour calculer, comparer, et combiner des conditions. Maîtriser les nuances entre ces opérateurs évite une large classe de bugs courants.</p>

      <h2>Opérateurs arithmétiques</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> a <span class="op">=</span> <span class="num">10</span>, b <span class="op">=</span> <span class="num">3</span>;

console.<span class="fn">log</span>(a <span class="op">+</span> b);   <span class="cmt">// 13  (addition)</span>
console.<span class="fn">log</span>(a <span class="op">-</span> b);   <span class="cmt">// 7   (soustraction)</span>
console.<span class="fn">log</span>(a <span class="op">*</span> b);   <span class="cmt">// 30  (multiplication)</span>
console.<span class="fn">log</span>(a <span class="op">/</span> b);   <span class="cmt">// 3.33 (division)</span>
console.<span class="fn">log</span>(a <span class="op">%</span> b);   <span class="cmt">// 1   (modulo — reste de la division)</span>
console.<span class="fn">log</span>(a <span class="op">**</span> b);  <span class="cmt">// 1000 (puissance : 10³)</span>

<span class="kw">let</span> x <span class="op">=</span> <span class="num">5</span>;
x<span class="op">++</span>;  <span class="cmt">// x = 6 (incrémentation post-fixe)</span>
x<span class="op">--</span>;  <span class="cmt">// x = 5 (décrémentation post-fixe)</span>
<span class="op">++</span>x;  <span class="cmt">// x = 6 (incrémentation pré-fixe : retourne la nouvelle valeur)</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>Le <strong>modulo</strong> (<code>%</code>) est très utile : tester si un nombre est pair (<code>n % 2 === 0</code>), faire une rotation dans un tableau (<code>index % tableau.length</code>), ou diviser du temps en heures/minutes.</p>
      </div>

      <h2>Opérateurs d'assignation composés</h2>
      <p>Au lieu d'écrire <code>x = x + 5</code>, JavaScript propose une syntaxe raccourcie qui combine l'opérateur et l'assignation en une seule expression.</p>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">let</span> score <span class="op">=</span> <span class="num">10</span>;

score <span class="op">+=</span> <span class="num">5</span>;   <span class="cmt">// score = score + 5  → 15</span>
score <span class="op">-=</span> <span class="num">3</span>;   <span class="cmt">// score = score - 3  → 12</span>
score <span class="op">*=</span> <span class="num">2</span>;   <span class="cmt">// score = score * 2  → 24</span>
score <span class="op">/=</span> <span class="num">4</span>;   <span class="cmt">// score = score / 4  → 6</span>
score <span class="op">%=</span> <span class="num">4</span>;   <span class="cmt">// score = score % 4  → 2</span>
score <span class="op">**=</span> <span class="num">3</span>;  <span class="cmt">// score = score ** 3 → 8</span>

<span class="cmt">// Très courant dans les boucles et les accumulateurs</span>
<span class="kw">let</span> total <span class="op">=</span> <span class="num">0</span>;
<span class="kw">const</span> prix <span class="op">=</span> [<span class="num">10</span>, <span class="num">25</span>, <span class="num">8</span>];
<span class="kw">for</span> (<span class="kw">const</span> p <span class="kw">of</span> prix) total <span class="op">+=</span> p;
console.<span class="fn">log</span>(total); <span class="cmt">// 43</span></pre>
      </div>

      <h2>Opérateurs de comparaison</h2>
      <div class="info-box warning">
        <div class="info-icon">⚠️</div>
        <p>Toujours utiliser <code>===</code> (égalité stricte) plutôt que <code>==</code> (égalité laxiste). Le <code>==</code> fait des conversions de type imprévues !</p>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="num">5</span> <span class="op">===</span> <span class="num">5</span>     <span class="cmt">// true  (strictement égal)</span>
<span class="num">5</span> <span class="op">===</span> <span class="str">"5"</span>  <span class="cmt">// false (types différents)</span>
<span class="num">5</span> <span class="op">==</span> <span class="str">"5"</span>   <span class="cmt">// true  ⚠️ conversion auto !</span>
<span class="num">5</span> <span class="op">!==</span> <span class="num">6</span>    <span class="cmt">// true  (strictement différent)</span>
<span class="num">5</span> <span class="op">></span> <span class="num">3</span>      <span class="cmt">// true</span>
<span class="num">5</span> <span class="op">>=</span> <span class="num">5</span>     <span class="cmt">// true</span></pre>
      </div>

      <h2>Opérateurs logiques</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">true</span> <span class="op">&&</span> <span class="kw">true</span>    <span class="cmt">// true  (ET logique)</span>
<span class="kw">true</span> <span class="op">&&</span> <span class="kw">false</span>   <span class="cmt">// false</span>
<span class="kw">true</span> <span class="op">||</span> <span class="kw">false</span>   <span class="cmt">// true  (OU logique)</span>
<span class="kw">false</span> <span class="op">||</span> <span class="kw">false</span>  <span class="cmt">// false</span>
<span class="op">!</span><span class="kw">true</span>           <span class="cmt">// false (NON logique)</span>

<span class="cmt">// || : retourne la première valeur "truthy" trouvée</span>
<span class="kw">const</span> nom <span class="op">=</span> <span class="str">""</span> <span class="op">||</span> <span class="str">"Invité"</span>;  <span class="cmt">// "Invité" (chaîne vide est falsy)</span>

<span class="cmt">// ?? opérateur nullish coalescing (ES2020)</span>
<span class="cmt">// Ne prend le fallback que si la valeur est null ou undefined</span>
<span class="kw">const</span> val <span class="op">=</span> <span class="kw">null</span> <span class="op">??</span> <span class="str">"défaut"</span>;  <span class="cmt">// "défaut"</span>
<span class="kw">const</span> val2 <span class="op">=</span> <span class="num">0</span> <span class="op">??</span> <span class="str">"défaut"</span>;     <span class="cmt">// 0 (0 n'est pas null !)</span>
<span class="cmt">// → Détaillé au chapitre 07 avec ?. et ??=</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p><code>&&</code> et <code>||</code> ne retournent pas forcément un booléen — ils retournent <strong>l'une des deux valeurs</strong>. <code>a && b</code> retourne <code>a</code> si <code>a</code> est falsy, sinon <code>b</code>. C'est ce qui permet des patterns comme <code>isLoggedIn && showDashboard()</code>.</p>
      </div>

      <div class="challenge-block">
        <div class="challenge-title">⚡ DÉFI PRATIQUE</div>
        <p style="color:#a0a0c0;font-size:14px">Sans exécuter le code, prédis le résultat de chaque expression. Ensuite vérifie dans la console :</p>
        <pre><span class="cmt">// Que vaut chaque ligne ?</span>
<span class="kw">let</span> n <span class="op">=</span> <span class="num">7</span>;
n <span class="op">+=</span> <span class="num">3</span>;
console.<span class="fn">log</span>(n);               <span class="cmt">// ?</span>

console.<span class="fn">log</span>(<span class="num">17</span> <span class="op">%</span> <span class="num">5</span>);          <span class="cmt">// ?</span>
console.<span class="fn">log</span>(<span class="num">2</span> <span class="op">**</span> <span class="num">10</span>);         <span class="cmt">// ?</span>
console.<span class="fn">log</span>(<span class="kw">null</span> <span class="op">??</span> <span class="num">0</span> <span class="op">??</span> <span class="str">"x"</span>); <span class="cmt">// ?</span>
console.<span class="fn">log</span>(<span class="kw">false</span> <span class="op">||</span> <span class="num">0</span> <span class="op">||</span> <span class="str">"ok"</span>); <span class="cmt">// ?</span></pre>
      </div>
    `,
    quiz: [
      {
        question: "Que vaut : 10 % 3 ?",
        sub: "L'opérateur modulo retourne le reste de la division",
        options: ["3", "1", "0", "3.33"],
        correct: 1,
        explanation: "✅ Correct ! 10 ÷ 3 = 3 reste 1. Le modulo (%) retourne le reste de la division euclidienne. Très utile pour tester la parité : n % 2 === 0 signifie que n est pair."
      },
      {
        question: "Pourquoi faut-il préférer === à == ?",
        sub: "Un des pièges classiques de JavaScript",
        options: [
          "=== est plus rapide",
          "=== compare aussi le type, évitant les conversions implicites",
          "== ne fonctionne pas avec les strings",
          "Il n'y a pas de différence"
        ],
        correct: 1,
        explanation: "✅ Exact ! === vérifie à la fois la valeur ET le type. 5 == '5' retourne true alors que 5 === '5' retourne false. Ces conversions silencieuses sont une source majeure de bugs."
      },
      {
        question: "Que retourne : let x = 10; x -= 3; x *= 2; — quelle est la valeur finale de x ?",
        sub: "Opérateurs d'assignation composés",
        options: ["14", "4", "20", "7"],
        correct: 0,
        explanation: "✅ Exact ! x commence à 10. x -= 3 donne 7. Puis x *= 2 donne 14. Les opérateurs composés appliquent l'opération et réassignent en une seule étape."
      }
    ]
};
