export default {
    id: 4,
    title: 'Boucles',
    icon: '🔄',
    level: 'Débutant',
    stars: '★★★☆☆',
    content: () => `
      <div class="chapter-tag">Chapitre 04 · Contrôle de flux</div>
      <h1>Boucles &<br><span class="highlight">Itérations</span></h1>

      <div class="chapter-intro-card">
        <div class="level-badge level-beginner">🔄</div>
        <div class="chapter-meta">
          <div class="difficulty-stars">★★★☆☆</div>
          <h3>for, while, do...while, for...of, for...in, méthodes de tableau</h3>
          <p>Durée estimée : 25 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Les boucles incarnent le principe <strong>DRY</strong> — <em>Don't Repeat Yourself</em>. Sans elles, afficher 1000 lignes d'un tableau nécessiterait 1000 lignes de code. Avec une boucle, c'est 3 lignes. Mais toutes les boucles ne sont pas équivalentes — choisir la bonne est une compétence à part entière.</p>

      <h2>La boucle for — Anatomie d'une boucle classique</h2>

      <p>La boucle <code>for</code> est la plus explicite : chaque partie de son mécanisme est visible. Elle se compose de trois parties séparées par des points-virgules :</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">//     ┌── initialisation   condition    incrément ──┐</span>
<span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">0</span>  ;  i <span class="op">&lt;</span> <span class="num">5</span>   ;  i<span class="op">++</span>) {
  console.<span class="fn">log</span>(<span class="str">\`Tour \${i}\`</span>);
}
<span class="cmt">// Tour 0 → Tour 1 → Tour 2 → Tour 3 → Tour 4</span>
<span class="cmt">//
// Déroulement :
// 1. let i = 0     (une seule fois au début)
// 2. i &lt; 5 ?       (vérifié AVANT chaque tour)
//    → oui : exécute le bloc, puis i++
//    → non : sort de la boucle</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Compter à rebours</span>
<span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">5</span>; i <span class="op">></span> <span class="num">0</span>; i<span class="op">--</span>) {
  console.<span class="fn">log</span>(i);
}
<span class="cmt">// 5, 4, 3, 2, 1</span>

<span class="cmt">// Incrément différent : sauter de 2 en 2</span>
<span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;=</span> <span class="num">10</span>; i <span class="op">+=</span> <span class="num">2</span>) {
  console.<span class="fn">log</span>(i); <span class="cmt">// 0, 2, 4, 6, 8, 10</span>
}

<span class="cmt">// Itérer un tableau par index</span>
<span class="kw">const</span> fruits <span class="op">=</span> [<span class="str">"pomme"</span>, <span class="str">"banane"</span>, <span class="str">"cerise"</span>];
<span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;</span> fruits.length; i<span class="op">++</span>) {
  console.<span class="fn">log</span>(<span class="str">\`\${i}: \${fruits[i]}\`</span>);
}
<span class="cmt">// 0: pomme, 1: banane, 2: cerise</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>Utilisez <code>let</code> (pas <code>var</code>) pour le compteur. Avec <code>var</code>, la variable "fuit" hors de la boucle, ce qui cause des bugs classiques dans les closures et les gestionnaires d'événements.</p>
      </div>

      <h2>while — Boucle à condition préalable</h2>

      <p><code>while</code> répète son bloc tant que la condition est vraie, en la vérifiant <em>avant chaque itération</em>. À utiliser quand vous ne savez pas d'avance combien de tours vous ferez.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Cas d'usage : lire jusqu'à trouver une condition</span>
<span class="kw">let</span> stock <span class="op">=</span> <span class="num">10</span>;

<span class="kw">while</span> (stock <span class="op">></span> <span class="num">0</span>) {
  console.<span class="fn">log</span>(<span class="str">\`Stock restant : \${stock}\`</span>);
  stock<span class="op">--</span>;
}
console.<span class="fn">log</span>(<span class="str">"Rupture de stock !"</span>);

<span class="cmt">// Simuler une recherche</span>
<span class="kw">let</span> tentatives <span class="op">=</span> <span class="num">0</span>;
<span class="kw">let</span> trouve <span class="op">=</span> <span class="kw">false</span>;

<span class="kw">while</span> (<span class="op">!</span>trouve <span class="op">&amp;&amp;</span> tentatives <span class="op">&lt;</span> <span class="num">10</span>) {
  <span class="cmt">// Simuler une recherche aléatoire</span>
  trouve <span class="op">=</span> <span class="cls">Math</span>.<span class="fn">random</span>() <span class="op">></span> <span class="num">0.7</span>;
  tentatives<span class="op">++</span>;
}
console.<span class="fn">log</span>(<span class="str">\`Trouvé en \${tentatives} tentatives\`</span>);</pre>
      </div>

      <div class="info-box danger">
        <div class="info-icon">🔥</div>
        <p>Méfiez-vous des <strong>boucles infinies</strong> ! Si la condition de votre <code>while</code> ne devient jamais fausse, le programme se fige. Assurez-vous toujours qu'une variable change à chaque itération.</p>
      </div>

      <h2>do...while — Exécuter au moins une fois</h2>

      <p><code>do...while</code> évalue la condition <em>après</em> chaque itération. Le bloc s'exécute donc <strong>au minimum une fois</strong>, même si la condition est fausse dès le départ. Cas d'usage typique : demander une saisie utilisateur jusqu'à ce qu'elle soit valide.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// while vs do...while : la différence clé</span>

<span class="cmt">// while : condition false dès le début → 0 exécution</span>
<span class="kw">let</span> x <span class="op">=</span> <span class="num">10</span>;
<span class="kw">while</span> (x <span class="op">&lt;</span> <span class="num">5</span>) {
  console.<span class="fn">log</span>(<span class="str">"while"</span>); <span class="cmt">// jamais exécuté</span>
  x<span class="op">++</span>;
}

<span class="cmt">// do...while : s'exécute AVANT de vérifier → 1 exécution</span>
<span class="kw">let</span> y <span class="op">=</span> <span class="num">10</span>;
<span class="kw">do</span> {
  console.<span class="fn">log</span>(<span class="str">"do...while !"</span>); <span class="cmt">// exécuté une fois</span>
  y<span class="op">++</span>;
} <span class="kw">while</span> (y <span class="op">&lt;</span> <span class="num">5</span>); <span class="cmt">// faux → on s'arrête</span>

<span class="cmt">// Cas d'usage classique : validation de saisie</span>
<span class="kw">let</span> input;
<span class="kw">do</span> {
  input <span class="op">=</span> <span class="fn">prompt</span>(<span class="str">"Entrez un nombre positif :"</span>);
  input <span class="op">=</span> <span class="cls">parseInt</span>(input);
} <span class="kw">while</span> (isNaN(input) <span class="op">||</span> input <span class="op">&lt;=</span> <span class="num">0</span>);
console.<span class="fn">log</span>(<span class="str">\`Vous avez entré : \${input}\`</span>);</pre>
      </div>

      <h2>for...of — L'itérateur moderne</h2>

      <p><code>for...of</code> (ES6) itère sur les <strong>valeurs</strong> de tout objet itérable : tableaux, chaînes, Sets, Maps, générateurs... C'est la façon recommandée d'itérer sur des collections en JavaScript moderne.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Tableaux</span>
<span class="kw">const</span> fruits <span class="op">=</span> [<span class="str">"pomme"</span>, <span class="str">"banane"</span>, <span class="str">"cerise"</span>];
<span class="kw">for</span> (<span class="kw">const</span> fruit <span class="kw">of</span> fruits) {
  console.<span class="fn">log</span>(fruit);
}
<span class="cmt">// pomme, banane, cerise</span>

<span class="cmt">// Chaînes de caractères</span>
<span class="kw">for</span> (<span class="kw">const</span> lettre <span class="kw">of</span> <span class="str">"Bonjour"</span>) {
  console.<span class="fn">log</span>(lettre <span class="op">+</span> <span class="str">"-"</span>);
}
<span class="cmt">// B-o-n-j-o-u-r-</span>

<span class="cmt">// Avec entries() pour avoir index + valeur</span>
<span class="kw">for</span> (<span class="kw">const</span> [index, fruit] <span class="kw">of</span> fruits.<span class="fn">entries</span>()) {
  console.<span class="fn">log</span>(<span class="str">\`\${index}: \${fruit}\`</span>);
}
<span class="cmt">// 0: pomme, 1: banane, 2: cerise</span></pre>
      </div>

      <h2>for...in — Pour les propriétés d'objets (PAS les tableaux !)</h2>

      <p><code>for...in</code> itère sur les <strong>clés énumérables</strong> d'un objet. Il fonctionne sur les tableaux aussi, mais c'est une très mauvaise pratique — voici pourquoi :</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// ✅ Bon usage : itérer les propriétés d'un objet</span>
<span class="kw">const</span> personne <span class="op">=</span> { nom: <span class="str">"Alice"</span>, age: <span class="num">30</span>, ville: <span class="str">"Paris"</span> };

<span class="kw">for</span> (<span class="kw">const</span> cle <span class="kw">in</span> personne) {
  console.<span class="fn">log</span>(<span class="str">\`\${cle}: \${personne[cle]}\`</span>);
}
<span class="cmt">// nom: Alice, age: 30, ville: Paris</span>

<span class="cmt">// ❌ MAUVAIS usage : for...in sur un tableau</span>
<span class="kw">const</span> arr <span class="op">=</span> [<span class="str">"a"</span>, <span class="str">"b"</span>, <span class="str">"c"</span>];
<span class="cls">Array</span>.prototype.customMethod <span class="op">=</span> () <span class="op">=></span> {}; <span class="cmt">// ajouté au prototype</span>

<span class="kw">for</span> (<span class="kw">const</span> i <span class="kw">in</span> arr) {
  console.<span class="fn">log</span>(i); <span class="cmt">// "0", "1", "2", "customMethod" ← BUG !</span>
}
<span class="cmt">// for...in itère AUSSI les propriétés héritées du prototype !</span>

<span class="cmt">// ✅ Utiliser for...of à la place</span>
<span class="kw">for</span> (<span class="kw">const</span> val <span class="kw">of</span> arr) {
  console.<span class="fn">log</span>(val); <span class="cmt">// "a", "b", "c" — seulement les valeurs</span>
}</pre>
      </div>

      <div class="info-box warning">
        <div class="info-icon">⚠️</div>
        <p><code>for...in</code> sur un tableau itère les <em>indices</em> comme des <em>strings</em> ("0", "1", "2") et peut inclure des propriétés héritées du prototype. Utilisez <strong>toujours</strong> <code>for...of</code> pour les tableaux.</p>
      </div>

      <h2>break, continue et boucles étiquetées</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// break : sort complètement de la boucle</span>
<span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;</span> <span class="num">10</span>; i<span class="op">++</span>) {
  <span class="kw">if</span> (i <span class="op">===</span> <span class="num">5</span>) <span class="kw">break</span>;
  console.<span class="fn">log</span>(i); <span class="cmt">// 0, 1, 2, 3, 4</span>
}

<span class="cmt">// continue : saute l'itération courante</span>
<span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;</span> <span class="num">10</span>; i<span class="op">++</span>) {
  <span class="kw">if</span> (i <span class="op">%</span> <span class="num">2</span> <span class="op">===</span> <span class="num">0</span>) <span class="kw">continue</span>; <span class="cmt">// saute les pairs</span>
  console.<span class="fn">log</span>(i); <span class="cmt">// 1, 3, 5, 7, 9</span>
}

<span class="cmt">// Boucles étiquetées (labels) : break/continue sur une boucle externe</span>
externe:
<span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;</span> <span class="num">3</span>; i<span class="op">++</span>) {
  <span class="kw">for</span> (<span class="kw">let</span> j <span class="op">=</span> <span class="num">0</span>; j <span class="op">&lt;</span> <span class="num">3</span>; j<span class="op">++</span>) {
    <span class="kw">if</span> (i <span class="op">===</span> <span class="num">1</span> <span class="op">&amp;&amp;</span> j <span class="op">===</span> <span class="num">1</span>) <span class="kw">break</span> externe; <span class="cmt">// sort des DEUX boucles</span>
    console.<span class="fn">log</span>(<span class="str">\`\${i},\${j}\`</span>);
  }
}
<span class="cmt">// 0,0  0,1  0,2  1,0  (s'arrête à 1,1)</span></pre>
      </div>

      <h2>Méthodes de tableau — Quand éviter les boucles for</h2>

      <p>Pour transformer ou analyser des tableaux, les <strong>méthodes fonctionnelles</strong> (<code>forEach</code>, <code>map</code>, <code>filter</code>...) sont souvent préférables aux boucles <code>for</code> classiques. Elles sont plus expressives et moins sujettes aux bugs d'index.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> nombres <span class="op">=</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>];

<span class="cmt">// ❌ for classique pour transformer : verbeux</span>
<span class="kw">const</span> doubles1 <span class="op">=</span> [];
<span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">0</span>; i <span class="op">&lt;</span> nombres.length; i<span class="op">++</span>) {
  doubles1.<span class="fn">push</span>(nombres[i] <span class="op">*</span> <span class="num">2</span>);
}

<span class="cmt">// ✅ map : lisible, déclaratif, sans mutation</span>
<span class="kw">const</span> doubles2 <span class="op">=</span> nombres.<span class="fn">map</span>(n <span class="op">=></span> n <span class="op">*</span> <span class="num">2</span>);
<span class="cmt">// [2, 4, 6, 8, 10]</span>

<span class="cmt">// forEach : pour les effets de bord (log, DOM...)</span>
nombres.<span class="fn">forEach</span>((n, index) <span class="op">=></span> {
  console.<span class="fn">log</span>(<span class="str">\`[\${index}] = \${n}\`</span>);
});
<span class="cmt">// Attention : forEach ne peut pas être stoppé avec break !</span>

<span class="cmt">// Quand utiliser for...of à la place de forEach ?</span>
<span class="cmt">// → Quand vous avez besoin de break/continue</span>
<span class="cmt">// → Quand vous utilisez await à l'intérieur</span>
<span class="kw">for</span> (<span class="kw">const</span> n <span class="kw">of</span> nombres) {
  <span class="kw">if</span> (n <span class="op">></span> <span class="num">3</span>) <span class="kw">break</span>; <span class="cmt">// impossible avec forEach !</span>
  console.<span class="fn">log</span>(n);
}</pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>Guide de choix : <strong>map/filter/reduce</strong> pour transformer et produire une valeur, <strong>forEach</strong> pour des effets de bord sans besoin de break, <strong>for...of</strong> quand vous avez besoin de break/continue ou d'await, <strong>for</strong> classique quand vous avez besoin de l'index ET de performance maximale.</p>
      </div>

      <div class="challenge-block">
        <h3>Défi : FizzBuzz élaboré</h3>
        <p>Écrivez une boucle qui affiche les nombres de 1 à 50 avec ces règles :</p>
        <ul>
          <li>Multiple de 15 : "FizzBuzz"</li>
          <li>Multiple de 3 seulement : "Fizz"</li>
          <li>Multiple de 5 seulement : "Buzz"</li>
          <li>Sinon : le nombre lui-même</li>
          <li>Bonus : arrêtez la boucle si on atteint 3 "FizzBuzz" avec un label</li>
        </ul>
        <pre><span class="kw">let</span> fizzBuzzCount <span class="op">=</span> <span class="num">0</span>;

boucle:
<span class="kw">for</span> (<span class="kw">let</span> i <span class="op">=</span> <span class="num">1</span>; i <span class="op">&lt;=</span> <span class="num">50</span>; i<span class="op">++</span>) {
  <span class="kw">let</span> resultat;
  <span class="kw">if</span> (i <span class="op">%</span> <span class="num">15</span> <span class="op">===</span> <span class="num">0</span>) {
    resultat <span class="op">=</span> <span class="str">"FizzBuzz"</span>;
    fizzBuzzCount<span class="op">++</span>;
    <span class="kw">if</span> (fizzBuzzCount <span class="op">>=</span> <span class="num">3</span>) <span class="kw">break</span> boucle;
  } <span class="kw">else if</span> (i <span class="op">%</span> <span class="num">3</span> <span class="op">===</span> <span class="num">0</span>) {
    resultat <span class="op">=</span> <span class="str">"Fizz"</span>;
  } <span class="kw">else if</span> (i <span class="op">%</span> <span class="num">5</span> <span class="op">===</span> <span class="num">0</span>) {
    resultat <span class="op">=</span> <span class="str">"Buzz"</span>;
  } <span class="kw">else</span> {
    resultat <span class="op">=</span> i;
  }
  console.<span class="fn">log</span>(resultat);
}
<span class="cmt">// S'arrête après le 3e "FizzBuzz" (i = 45)</span></pre>
      </div>
    `,
    quiz: [
      {
        question: "Quelle est la différence fondamentale entre while et do...while ?",
        sub: "Ordre d'évaluation de la condition",
        options: [
          "while est plus rapide que do...while",
          "do...while évalue la condition avant l'exécution, while après",
          "do...while exécute le bloc au moins une fois, while peut ne jamais l'exécuter",
          "Il n'y a aucune différence pratique"
        ],
        correct: 2,
        explanation: "✅ Exact ! do...while exécute le bloc D'ABORD, puis vérifie la condition. Même si la condition est false dès le départ, le bloc s'est exécuté une fois. while vérifie AVANT, donc peut ne jamais exécuter le bloc."
      },
      {
        question: "Pourquoi ne faut-il PAS utiliser for...in pour itérer un tableau ?",
        sub: "Pièges de for...in",
        options: [
          "for...in est plus lent que for...of",
          "for...in itère les indices comme des strings et peut inclure des propriétés héritées du prototype",
          "for...in ne fonctionne pas sur les tableaux",
          "for...in ne supporte pas break"
        ],
        correct: 1,
        explanation: "✅ Parfait ! for...in donne les clés (indices) comme des strings '0','1','2' et itère aussi les propriétés ajoutées au Array.prototype. C'est for...of qu'il faut utiliser pour les tableaux."
      },
      {
        question: "Quelle méthode de tableau NE peut PAS être interrompue avec break ?",
        sub: "Méthodes fonctionnelles vs boucles",
        options: [
          "for...of",
          "for classique",
          "forEach",
          "for...in"
        ],
        correct: 2,
        explanation: "✅ Exact ! forEach ne peut pas être stoppé avec break — cela lève une SyntaxError. Pour sortir tôt d'une itération de tableau, utilisez for...of avec break, ou des méthodes comme find() ou some() qui s'arrêtent dès qu'une condition est remplie."
      }
    ]
};
