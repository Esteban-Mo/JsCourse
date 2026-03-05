export default {
    id: 16,
    title: 'TypeScript — Bases',
    icon: '🔷',
    level: 'Bonus TypeScript',
    stars: '★★★★☆',
    content: () => `
      <div class="ts-badge">🔷 BONUS · TypeScript</div>
      <div class="chapter-tag">Chapitre 16 · TypeScript</div>
      <h1>TypeScript<br><span class="highlight" style="color:#3178c6">Les Bases</span></h1>
      <div class="chapter-intro-card" style="border-color:rgba(49,120,198,0.3);background:linear-gradient(135deg,var(--surface),rgba(49,120,198,0.05))">
        <div class="level-badge level-typescript">🔷</div>
        <div class="chapter-meta">
          <div class="difficulty-stars" style="color:#3178c6">★★★★☆</div>
          <h3>Types, interfaces, unions, génériques</h3>
          <p>Durée estimée : 40 min · 2 quizz inclus</p>
        </div>
      </div>

      <p>TypeScript est un <strong>superset typé</strong> de JavaScript développé par Microsoft. Il ajoute un système de types statiques qui permet de détecter les erreurs à la compilation plutôt qu'à l'exécution.</p>

      <div class="info-box tip">
        <div class="info-icon">🔷</div>
        <p>Tout JavaScript valide est du TypeScript valide. TS compile vers JS standard — les navigateurs ne l'exécutent pas directement.</p>
      </div>

      <h2>Types de base</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
        <pre><span class="cmt">// Annotations de type</span>
<span class="kw">let</span> prenom<span class="op">:</span> <span class="cls">string</span> <span class="op">=</span> <span class="str">"Alice"</span>;
<span class="kw">let</span> age<span class="op">:</span> <span class="cls">number</span> <span class="op">=</span> <span class="num">25</span>;
<span class="kw">let</span> actif<span class="op">:</span> <span class="cls">boolean</span> <span class="op">=</span> <span class="kw">true</span>;
<span class="kw">let</span> data<span class="op">:</span> <span class="cls">unknown</span>;   <span class="cmt">// type inconnu — plus sûr que any</span>
<span class="kw">let</span> wild<span class="op">:</span> <span class="cls">any</span>;       <span class="cmt">// désactive le type checking ⚠️</span>

<span class="cmt">// Tableaux typés</span>
<span class="kw">const</span> scores<span class="op">:</span> <span class="cls">number</span>[] <span class="op">=</span> [<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>];
<span class="kw">const</span> noms<span class="op">:</span> <span class="cls">Array</span><span class="op">&lt;</span><span class="cls">string</span><span class="op">&gt;</span> <span class="op">=</span> [<span class="str">"Alice"</span>, <span class="str">"Bob"</span>];

<span class="cmt">// Tuple : tableau à longueur et types fixes</span>
<span class="kw">const</span> point<span class="op">:</span> [<span class="cls">number</span>, <span class="cls">number</span>] <span class="op">=</span> [<span class="num">10</span>, <span class="num">20</span>];
<span class="kw">const</span> entry<span class="op">:</span> [<span class="cls">string</span>, <span class="cls">number</span>] <span class="op">=</span> [<span class="str">"age"</span>, <span class="num">25</span>];

<span class="cmt">// Union types</span>
<span class="kw">let</span> id<span class="op">:</span> <span class="cls">string</span> <span class="op">|</span> <span class="cls">number</span>;
id <span class="op">=</span> <span class="str">"abc123"</span>; <span class="cmt">// OK</span>
id <span class="op">=</span> <span class="num">42</span>;       <span class="cmt">// OK</span>
<span class="cmt">// id = true;  ❌ Error !</span>

<span class="cmt">// Literal types</span>
<span class="kw">type</span> <span class="cls">Direction</span> <span class="op">=</span> <span class="str">"nord"</span> <span class="op">|</span> <span class="str">"sud"</span> <span class="op">|</span> <span class="str">"est"</span> <span class="op">|</span> <span class="str">"ouest"</span>;
<span class="kw">let</span> dir<span class="op">:</span> <span class="cls">Direction</span> <span class="op">=</span> <span class="str">"nord"</span>; <span class="cmt">// seules ces 4 valeurs</span></pre>
      </div>

      <h2>Interfaces & Types</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
        <pre><span class="cmt">// Interface : contrat de forme d'un objet</span>
<span class="kw">interface</span> <span class="cls">Utilisateur</span> {
  id<span class="op">:</span> <span class="cls">number</span>;
  nom<span class="op">:</span> <span class="cls">string</span>;
  email<span class="op">?:</span> <span class="cls">string</span>;        <span class="cmt">// propriété optionnelle</span>
  <span class="kw">readonly</span> createdAt<span class="op">:</span> <span class="cls">Date</span>; <span class="cmt">// immuable après création</span>
}

<span class="cmt">// Fonction typée</span>
<span class="kw">function</span> <span class="fn">saluer</span>(user<span class="op">:</span> <span class="cls">Utilisateur</span>)<span class="op">:</span> <span class="cls">string</span> {
  <span class="kw">return</span> <span class="str">\`Bonjour \${user.nom}\`</span>;
}

<span class="cmt">// Type alias (plus flexible)</span>
<span class="kw">type</span> <span class="cls">Point</span> <span class="op">=</span> { x<span class="op">:</span> <span class="cls">number</span>; y<span class="op">:</span> <span class="cls">number</span> };
<span class="kw">type</span> <span class="cls">Point3D</span> <span class="op">=</span> <span class="cls">Point</span> <span class="op">&</span> { z<span class="op">:</span> <span class="cls">number</span> }; <span class="cmt">// intersection</span>

<span class="cmt">// Enum</span>
<span class="kw">enum</span> <span class="cls">Statut</span> {
  Actif <span class="op">=</span> <span class="str">"ACTIF"</span>,
  Inactif <span class="op">=</span> <span class="str">"INACTIF"</span>,
  Banni <span class="op">=</span> <span class="str">"BANNI"</span>
}
<span class="kw">const</span> etat<span class="op">:</span> <span class="cls">Statut</span> <span class="op">=</span> <span class="cls">Statut</span>.Actif;</pre>
      </div>

      <h2>Génériques (Generics)</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
        <pre><span class="cmt">// Générique : fonction qui fonctionne avec n'importe quel type</span>
<span class="kw">function</span> <span class="fn">identity</span><span class="op">&lt;</span><span class="cls">T</span><span class="op">&gt;</span>(value<span class="op">:</span> <span class="cls">T</span>)<span class="op">:</span> <span class="cls">T</span> {
  <span class="kw">return</span> value;
}
<span class="fn">identity</span><span class="op">&lt;</span><span class="cls">string</span><span class="op">&gt;</span>(<span class="str">"hello"</span>); <span class="cmt">// "hello"</span>
<span class="fn">identity</span>(<span class="num">42</span>);               <span class="cmt">// inférence auto → number</span>

<span class="cmt">// Interface générique</span>
<span class="kw">interface</span> <span class="cls">ApiResponse</span><span class="op">&lt;</span><span class="cls">T</span><span class="op">&gt;</span> {
  data<span class="op">:</span> <span class="cls">T</span>;
  status<span class="op">:</span> <span class="cls">number</span>;
  message<span class="op">:</span> <span class="cls">string</span>;
}

<span class="kw">type</span> <span class="cls">UserResponse</span> <span class="op">=</span> <span class="cls">ApiResponse</span><span class="op">&lt;</span><span class="cls">Utilisateur</span><span class="op">&gt;</span>;
<span class="kw">type</span> <span class="cls">ListResponse</span> <span class="op">=</span> <span class="cls">ApiResponse</span><span class="op">&lt;</span><span class="cls">Utilisateur</span>[]<span class="op">&gt;</span>;

<span class="cmt">// Contrainte sur le générique</span>
<span class="kw">function</span> <span class="fn">getProp</span><span class="op">&lt;</span><span class="cls">T</span>, <span class="cls">K</span> <span class="kw">extends</span> <span class="kw">keyof</span> <span class="cls">T</span><span class="op">&gt;</span>(obj<span class="op">:</span> <span class="cls">T</span>, key<span class="op">:</span> <span class="cls">K</span>)<span class="op">:</span> <span class="cls">T</span>[<span class="cls">K</span>] {
  <span class="kw">return</span> obj[key];
}
<span class="fn">getProp</span>({ nom<span class="op">:</span> <span class="str">"Alice"</span>, age<span class="op">:</span> <span class="num">25</span> }, <span class="str">"nom"</span>); <span class="cmt">// "Alice" ✅</span>
<span class="cmt">// getProp({...}, "xyz") ❌ Error : "xyz" n'existe pas</span></pre>
      </div>
    `,
    quiz: [
      {
        question: "Quelle est la différence entre interface et type en TypeScript ?",
        sub: "Fondamentaux TypeScript",
        options: [
          "Ils sont strictement identiques",
          "interface ne peut pas être étendue",
          "type peut représenter des unions/intersections et des primitifs, interface est extensible via declaration merging",
          "type est deprecated depuis TS 5.0"
        ],
        correct: 2,
        explanation: "✅ Exact ! Les deux définissent des formes d'objets, mais type est plus flexible (unions, intersections, primitifs, tuples). interface supporte le 'declaration merging' (plusieurs déclarations fusionnent)."
      },
      {
        question: "Que signifie <T> dans function identity<T>(value: T): T ?",
        sub: "Génériques TypeScript",
        options: [
          "T est un type HTML element",
          "T est un paramètre de type générique — un placeholder pour n'importe quel type",
          "T signifie 'Typed' — le type par défaut de TS",
          "C'est une syntaxe JSX"
        ],
        correct: 1,
        explanation: "✅ Parfait ! <T> déclare un paramètre de type générique. Quand tu appelles identity('hello'), TypeScript infère T = string. Les génériques permettent d'écrire du code réutilisable et type-safe."
      }
    ]
};
