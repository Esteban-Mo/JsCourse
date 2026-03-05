export default {
    id: 3,
    title: 'Conditions',
    icon: '🔀',
    level: 'Débutant',
    stars: '★★★☆☆',
    content: () => `
      <div class="chapter-tag">Chapitre 03 · Contrôle de flux</div>
      <h1>Conditions &<br><span class="highlight">Décisions</span></h1>

      <div class="chapter-intro-card">
        <div class="level-badge level-beginner">🔀</div>
        <div class="chapter-meta">
          <div class="difficulty-stars">★★★☆☆</div>
          <h3>if/else, truthy/falsy, ternaire, switch et object lookup</h3>
          <p>Durée estimée : 25 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Un programme qui exécute toujours les mêmes instructions n'est pas très utile. Les conditions permettent à votre code de <strong>prendre des décisions</strong> en fonction des données. C'est le fondement même de la logique informatique.</p>

      <h2>if / else — La décision binaire</h2>

      <p>Imaginez un vigile à l'entrée d'une boîte de nuit : il regarde l'âge, et en fonction, laisse entrer ou non. C'est exactement ce que fait <code>if/else</code> — évaluer une condition et choisir un chemin d'exécution.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Structure de base : if (condition) { ... } else { ... }</span>
<span class="kw">const</span> age <span class="op">=</span> <span class="num">20</span>;

<span class="kw">if</span> (age <span class="op">>=</span> <span class="num">18</span>) {
  console.<span class="fn">log</span>(<span class="str">"Bienvenue !"</span>);   <span class="cmt">// ce bloc s'exécute</span>
} <span class="kw">else</span> {
  console.<span class="fn">log</span>(<span class="str">"Accès refusé"</span>);  <span class="cmt">// ce bloc est ignoré</span>
}
<span class="cmt">// → "Bienvenue !"</span></pre>
      </div>

      <p>On peut enchaîner plusieurs conditions avec <code>else if</code> pour gérer plus de deux cas :</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> score <span class="op">=</span> <span class="num">75</span>;

<span class="kw">if</span> (score <span class="op">>=</span> <span class="num">90</span>) {
  console.<span class="fn">log</span>(<span class="str">"Excellent !"</span>);   <span class="cmt">// ≥ 90</span>
} <span class="kw">else if</span> (score <span class="op">>=</span> <span class="num">70</span>) {
  console.<span class="fn">log</span>(<span class="str">"Bien !"</span>);         <span class="cmt">// entre 70 et 89</span>
} <span class="kw">else if</span> (score <span class="op">>=</span> <span class="num">50</span>) {
  console.<span class="fn">log</span>(<span class="str">"Passable"</span>);       <span class="cmt">// entre 50 et 69</span>
} <span class="kw">else</span> {
  console.<span class="fn">log</span>(<span class="str">"À améliorer"</span>);   <span class="cmt">// &lt; 50</span>
}
<span class="cmt">// → "Bien !" (score = 75)</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>JS évalue les conditions <strong>de haut en bas</strong> et s'arrête au premier <code>if</code> ou <code>else if</code> vrai. L'ordre des conditions est donc crucial — placez les cas les plus spécifiques en premier.</p>
      </div>

      <h2>Truthy et Falsy — Ce que JS considère comme "vrai"</h2>

      <p>En JavaScript, une condition ne doit pas forcément être un booléen strict. Le moteur JS <strong>convertit automatiquement</strong> toute valeur en booléen. C'est le concept de <em>truthy</em> (converti en <code>true</code>) et <em>falsy</em> (converti en <code>false</code>).</p>

      <p>Il n'existe que <strong>6 valeurs falsy</strong> en JavaScript. Tout le reste est truthy :</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Les 6 valeurs FALSY (converties en false)</span>
<span class="kw">if</span> (<span class="kw">false</span>)     { } <span class="cmt">// false littéral</span>
<span class="kw">if</span> (<span class="num">0</span>)        { } <span class="cmt">// zéro</span>
<span class="kw">if</span> (<span class="str">""</span>)       { } <span class="cmt">// chaîne vide</span>
<span class="kw">if</span> (<span class="kw">null</span>)     { } <span class="cmt">// null</span>
<span class="kw">if</span> (<span class="kw">undefined</span>){ } <span class="cmt">// undefined</span>
<span class="kw">if</span> (<span class="cls">NaN</span>)      { } <span class="cmt">// Not a Number</span>

<span class="cmt">// Tout le reste est TRUTHY</span>
<span class="kw">if</span> (<span class="str">"0"</span>)      { console.<span class="fn">log</span>(<span class="str">"truthy!"</span>); } <span class="cmt">// "0" = chaîne non vide</span>
<span class="kw">if</span> ([])        { console.<span class="fn">log</span>(<span class="str">"truthy!"</span>); } <span class="cmt">// tableau vide = truthy</span>
<span class="kw">if</span> ({})        { console.<span class="fn">log</span>(<span class="str">"truthy!"</span>); } <span class="cmt">// objet vide = truthy</span>
<span class="kw">if</span> (<span class="num">-1</span>)       { console.<span class="fn">log</span>(<span class="str">"truthy!"</span>); } <span class="cmt">// tout nombre ≠ 0</span></pre>
      </div>

      <div class="info-box warning">
        <div class="info-icon">⚠️</div>
        <p>Piège classique : <code>[] == false</code> est <code>true</code> en comparaison lâche (==), mais <code>if ([])</code> entre dans le bloc car un tableau est truthy ! Utilisez toujours <code>===</code> pour éviter ces surprises.</p>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Usage pratique du truthy/falsy</span>
<span class="kw">const</span> username <span class="op">=</span> <span class="str">""</span>;
<span class="kw">const</span> displayName <span class="op">=</span> username <span class="op">||</span> <span class="str">"Invité"</span>;
<span class="cmt">// username est falsy → displayName = "Invité"</span>

<span class="kw">const</span> items <span class="op">=</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>];
<span class="kw">if</span> (items.length) {
  console.<span class="fn">log</span>(<span class="str">"Le panier n'est pas vide"</span>);
}
<span class="cmt">// items.length = 3 → truthy → on entre dans le if</span>

<span class="cmt">// Vérifier si une valeur existe</span>
<span class="kw">function</span> <span class="fn">traiter</span>(data) {
  <span class="kw">if</span> (<span class="op">!</span>data) {
    <span class="kw">return</span> <span class="str">"Aucune donnée"</span>;
  }
  <span class="kw">return</span> data.<span class="fn">toUpperCase</span>();
}</pre>
      </div>

      <h2>Guard Clauses — Sortir tôt pour un code plus lisible</h2>

      <p>Le pattern <strong>guard clause</strong> (ou "early return") consiste à traiter les cas d'erreur ou cas limites <em>en premier</em> avec un <code>return</code> immédiat, pour éviter l'imbrication profonde de <code>if/else</code>. C'est l'une des techniques les plus importantes pour écrire du code propre.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// ❌ Style "pyramide de la mort" — difficile à lire</span>
<span class="kw">function</span> <span class="fn">traiterCommande</span>(user, panier) {
  <span class="kw">if</span> (user) {
    <span class="kw">if</span> (user.estConnecte) {
      <span class="kw">if</span> (panier.length <span class="op">></span> <span class="num">0</span>) {
        <span class="kw">if</span> (user.solde <span class="op">>=</span> panier.total) {
          <span class="cmt">// Enfin, la vraie logique...</span>
          <span class="kw">return</span> <span class="fn">passerCommande</span>(user, panier);
        }
      }
    }
  }
}

<span class="cmt">// ✅ Style guard clause — lisible et plat</span>
<span class="kw">function</span> <span class="fn">traiterCommande</span>(user, panier) {
  <span class="kw">if</span> (<span class="op">!</span>user)              <span class="kw">return</span> <span class="str">"Utilisateur requis"</span>;
  <span class="kw">if</span> (<span class="op">!</span>user.estConnecte)  <span class="kw">return</span> <span class="str">"Connectez-vous d'abord"</span>;
  <span class="kw">if</span> (<span class="op">!</span>panier.length)     <span class="kw">return</span> <span class="str">"Panier vide"</span>;
  <span class="kw">if</span> (user.solde <span class="op">&lt;</span> panier.total) <span class="kw">return</span> <span class="str">"Solde insuffisant"</span>;

  <span class="cmt">// La vraie logique est claire et non imbriquée</span>
  <span class="kw">return</span> <span class="fn">passerCommande</span>(user, panier);
}</pre>
      </div>

      <div class="info-box success">
        <div class="info-icon">🎯</div>
        <p>La règle d'or : <strong>gérez les cas d'erreur en premier</strong>, retournez immédiatement, et laissez le "happy path" (le cas normal) à la fin, non imbriqué. Votre code sera deux fois plus lisible.</p>
      </div>

      <h2>L'opérateur ternaire — if/else en une ligne</h2>

      <p>Le ternaire est un raccourci pour <code>if/else</code> simple. La syntaxe est : <code>condition ? valeurSiVrai : valeurSiFaux</code>. Il est particulièrement utile pour assigner une valeur conditionnellement.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Cas d'usage idéal : assigner une valeur</span>
<span class="kw">const</span> age <span class="op">=</span> <span class="num">20</span>;
<span class="kw">const</span> statut <span class="op">=</span> age <span class="op">>=</span> <span class="num">18</span> <span class="op">?</span> <span class="str">"majeur"</span> <span class="op">:</span> <span class="str">"mineur"</span>;
<span class="cmt">// statut = "majeur"</span>

<span class="cmt">// Dans une template literal</span>
console.<span class="fn">log</span>(<span class="str">\`Vous êtes \${age <span class="op">>=</span> <span class="num">18</span> ? <span class="str">"majeur"</span> : <span class="str">"mineur"</span>}\`</span>);

<span class="cmt">// Dans du JSX (React)</span>
<span class="cmt">// return &lt;div&gt;{isLoggedIn ? &lt;Dashboard /&gt; : &lt;Login /&gt;}&lt;/div&gt;</span></pre>
      </div>

      <div class="info-box warning">
        <div class="info-icon">⚠️</div>
        <p>N'imbriquez <strong>jamais</strong> les ternaires ! <code>a ? b ? c : d : e</code> est illisible. Si vous avez plus de deux cas, utilisez <code>if/else</code> ou un objet lookup (voir plus bas).</p>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// ❌ Ternaire imbriqué illisible</span>
<span class="kw">const</span> label <span class="op">=</span> score <span class="op">>=</span> <span class="num">90</span> <span class="op">?</span> <span class="str">"A"</span> <span class="op">:</span> score <span class="op">>=</span> <span class="num">70</span> <span class="op">?</span> <span class="str">"B"</span> <span class="op">:</span> score <span class="op">>=</span> <span class="num">50</span> <span class="op">?</span> <span class="str">"C"</span> <span class="op">:</span> <span class="str">"F"</span>;

<span class="cmt">// ✅ if/else lisible pour plusieurs cas</span>
<span class="kw">function</span> <span class="fn">getLabel</span>(score) {
  <span class="kw">if</span> (score <span class="op">>=</span> <span class="num">90</span>) <span class="kw">return</span> <span class="str">"A"</span>;
  <span class="kw">if</span> (score <span class="op">>=</span> <span class="num">70</span>) <span class="kw">return</span> <span class="str">"B"</span>;
  <span class="kw">if</span> (score <span class="op">>=</span> <span class="num">50</span>) <span class="kw">return</span> <span class="str">"C"</span>;
  <span class="kw">return</span> <span class="str">"F"</span>;
}</pre>
      </div>

      <h2>switch / case — Comparer une valeur à plusieurs cas</h2>

      <p><code>switch</code> est idéal quand vous comparez <strong>une même variable</strong> à plusieurs valeurs exactes. Il utilise <code>===</code> (comparaison stricte) en interne.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> jour <span class="op">=</span> <span class="str">"Lundi"</span>;

<span class="kw">switch</span> (jour) {
  <span class="kw">case</span> <span class="str">"Lundi"</span>:
  <span class="kw">case</span> <span class="str">"Mardi"</span>:
  <span class="kw">case</span> <span class="str">"Mercredi"</span>:
  <span class="kw">case</span> <span class="str">"Jeudi"</span>:
    console.<span class="fn">log</span>(<span class="str">"Jour de semaine"</span>);
    <span class="kw">break</span>; <span class="cmt">// IMPORTANT : arrête l'exécution</span>
  <span class="kw">case</span> <span class="str">"Vendredi"</span>:
    console.<span class="fn">log</span>(<span class="str">"TGIF !"</span>);
    <span class="kw">break</span>;
  <span class="kw">case</span> <span class="str">"Samedi"</span>:
  <span class="kw">case</span> <span class="str">"Dimanche"</span>:
    console.<span class="fn">log</span>(<span class="str">"Weekend !"</span>);
    <span class="kw">break</span>;
  <span class="kw">default</span>:
    console.<span class="fn">log</span>(<span class="str">"Jour inconnu"</span>);
}
<span class="cmt">// → "Jour de semaine" (Lundi matche, break arrête)</span></pre>
      </div>

      <p>Le <strong>fall-through</strong> est le comportement par lequel, sans <code>break</code>, l'exécution continue dans les cases suivants. C'est rarement ce que vous voulez, mais parfois utile :</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Fall-through intentionnel : accumuler des actions</span>
<span class="kw">const</span> niveau <span class="op">=</span> <span class="num">2</span>;
<span class="kw">let</span> droits <span class="op">=</span> [];

<span class="kw">switch</span> (niveau) {
  <span class="kw">case</span> <span class="num">3</span>:
    droits.<span class="fn">push</span>(<span class="str">"admin"</span>);   <span class="cmt">// fall-through intentionnel</span>
  <span class="kw">case</span> <span class="num">2</span>:
    droits.<span class="fn">push</span>(<span class="str">"editor"</span>);  <span class="cmt">// fall-through intentionnel</span>
  <span class="kw">case</span> <span class="num">1</span>:
    droits.<span class="fn">push</span>(<span class="str">"viewer"</span>);
    <span class="kw">break</span>;
}
<span class="cmt">// niveau 2 → droits = ["editor", "viewer"]</span>
<span class="cmt">// niveau 3 → droits = ["admin", "editor", "viewer"]</span></pre>
      </div>

      <div class="info-box danger">
        <div class="info-icon">🔥</div>
        <p>Oublier un <code>break</code> est l'un des bugs les plus fréquents avec <code>switch</code>. Si vous voulez du fall-through intentionnel, ajoutez un commentaire <code>// fall-through</code> pour que les autres développeurs (et vous dans 6 mois) comprennent que c'est voulu.</p>
      </div>

      <h2>Object Lookup — L'alternative moderne au switch</h2>

      <p>Un objet JavaScript peut servir de <strong>table de correspondance</strong> (lookup table). C'est souvent plus élégant qu'un long <code>switch</code> quand les cas correspondent à des valeurs statiques.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// ❌ switch verbeux</span>
<span class="kw">function</span> <span class="fn">getEmojiSwitch</span>(fruit) {
  <span class="kw">switch</span> (fruit) {
    <span class="kw">case</span> <span class="str">"pomme"</span>: <span class="kw">return</span> <span class="str">"🍎"</span>;
    <span class="kw">case</span> <span class="str">"banane"</span>: <span class="kw">return</span> <span class="str">"🍌"</span>;
    <span class="kw">case</span> <span class="str">"cerise"</span>: <span class="kw">return</span> <span class="str">"🍒"</span>;
    <span class="kw">default</span>: <span class="kw">return</span> <span class="str">"❓"</span>;
  }
}

<span class="cmt">// ✅ Object lookup — concis et extensible</span>
<span class="kw">const</span> EMOJI_MAP <span class="op">=</span> {
  pomme:  <span class="str">"🍎"</span>,
  banane: <span class="str">"🍌"</span>,
  cerise: <span class="str">"🍒"</span>,
};

<span class="kw">const</span> <span class="fn">getEmoji</span> <span class="op">=</span> (fruit) <span class="op">=></span> EMOJI_MAP[fruit] <span class="op">??</span> <span class="str">"❓"</span>;

<span class="fn">getEmoji</span>(<span class="str">"pomme"</span>);  <span class="cmt">// "🍎"</span>
<span class="fn">getEmoji</span>(<span class="str">"mangue"</span>); <span class="cmt">// "❓" (nullish fallback)</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Object lookup avec des fonctions — très puissant !</span>
<span class="kw">const</span> ACTIONS <span class="op">=</span> {
  increment: (state) <span class="op">=></span> ({ ...state, count: state.count <span class="op">+</span> <span class="num">1</span> }),
  decrement: (state) <span class="op">=></span> ({ ...state, count: state.count <span class="op">-</span> <span class="num">1</span> }),
  reset:     (state) <span class="op">=></span> ({ ...state, count: <span class="num">0</span> }),
};

<span class="kw">function</span> <span class="fn">reducer</span>(state, action) {
  <span class="kw">const</span> handler <span class="op">=</span> ACTIONS[action.type];
  <span class="kw">return</span> handler ? <span class="fn">handler</span>(state) : state;
}
<span class="cmt">// Pattern utilisé par Redux !</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>Règle pratique : utilisez <code>switch</code> quand les cas impliquent des <strong>blocs de code complexes</strong>, et l'object lookup quand chaque cas retourne simplement une <strong>valeur ou appelle une fonction</strong>.</p>
      </div>

      <div class="challenge-block">
        <h3>Défi : Calculatrice de tarifs</h3>
        <p>Écrivez une fonction <code>calculerTarif(age, estMembre)</code> qui retourne le prix d'entrée selon ces règles :</p>
        <ul>
          <li>Moins de 6 ans : gratuit (0€)</li>
          <li>6-17 ans : 5€ (3€ si membre)</li>
          <li>18-64 ans : 12€ (9€ si membre)</li>
          <li>65 ans et plus : 8€ (6€ si membre)</li>
        </ul>
        <p>Utilisez les guard clauses et un object lookup pour les tarifs membres.</p>
        <pre><span class="cmt">// Votre solution ici</span>
<span class="kw">function</span> <span class="fn">calculerTarif</span>(age, estMembre) {
  <span class="cmt">// Guard clause</span>
  <span class="kw">if</span> (age <span class="op">&lt;</span> <span class="num">6</span>) <span class="kw">return</span> <span class="num">0</span>;

  <span class="cmt">// Trouver la tranche d'âge</span>
  <span class="kw">const</span> <span class="fn">getTranche</span> <span class="op">=</span> () <span class="op">=></span> {
    <span class="kw">if</span> (age <span class="op">&lt;=</span> <span class="num">17</span>) <span class="kw">return</span> <span class="str">"enfant"</span>;
    <span class="kw">if</span> (age <span class="op">&lt;=</span> <span class="num">64</span>) <span class="kw">return</span> <span class="str">"adulte"</span>;
    <span class="kw">return</span> <span class="str">"senior"</span>;
  };

  <span class="kw">const</span> TARIFS <span class="op">=</span> {
    enfant: { normal: <span class="num">5</span>,  membre: <span class="num">3</span>  },
    adulte: { normal: <span class="num">12</span>, membre: <span class="num">9</span>  },
    senior: { normal: <span class="num">8</span>,  membre: <span class="num">6</span>  },
  };

  <span class="kw">const</span> tarif <span class="op">=</span> TARIFS[<span class="fn">getTranche</span>()];
  <span class="kw">return</span> estMembre ? tarif.membre : tarif.normal;
}</pre>
      </div>
    `,
    quiz: [
      {
        question: "Parmi ces valeurs, laquelle est TRUTHY en JavaScript ?",
        sub: "Concept truthy/falsy",
        options: ["0", '""  (chaîne vide)', "[] (tableau vide)", "null"],
        correct: 2,
        explanation: "✅ Exact ! Un tableau vide [] est truthy — il ne figure pas dans la liste des 6 valeurs falsy (false, 0, \"\", null, undefined, NaN). Seule une valeur vide au sens primitif est falsy."
      },
      {
        question: "Sans le mot-clé break dans un switch, que se passe-t-il ?",
        sub: "Comportement fall-through du switch",
        options: [
          "Une SyntaxError est levée",
          "Le switch s'arrête automatiquement après le premier case",
          "L'exécution continue dans les cases suivants (fall-through)",
          "Le default s'exécute immédiatement"
        ],
        correct: 2,
        explanation: "✅ Exact ! Sans break, JS continue d'exécuter les cases suivants — c'est le comportement 'fall-through'. Il peut être intentionnel (partage de code entre cases) ou un bug. Toujours documenter si intentionnel !"
      },
      {
        question: "Quelle est la principale raison d'utiliser le pattern 'guard clause' ?",
        sub: "Bonnes pratiques de lisibilité",
        options: [
          "Pour améliorer les performances du code",
          "Pour éviter l'imbrication profonde de if/else et rendre le code plus lisible",
          "Pour remplacer complètement les try/catch",
          "Pour que le code s'exécute en parallèle"
        ],
        correct: 1,
        explanation: "✅ Parfait ! Le guard clause consiste à retourner tôt pour les cas d'erreur, ce qui évite la 'pyramide de la mort' (if imbriqués) et laisse le chemin normal (happy path) lisible et non imbriqué."
      }
    ]
};
