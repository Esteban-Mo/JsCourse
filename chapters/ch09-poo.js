export default {
    id: 12,
    title: 'POO & Patterns',
    icon: '🏗️',
    level: 'Expert',
    stars: '★★★★★',
    content: () => `
      <div class="chapter-tag">Chapitre 12 · Expert</div>
      <h1>POO &<br><span class="highlight">Design Patterns</span></h1>
      <div class="chapter-intro-card">
        <div class="level-badge level-expert">🏗️</div>
        <div class="chapter-meta">
          <div class="difficulty-stars" style="color:#f78c4a">★★★★★</div>
          <h3>Prototypes, classes ES6+, champs privés, mixins, Observer, Builder</h3>
          <p>Durée estimée : 40 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>JavaScript n'est pas un langage orienté objet classique — c'est un langage à <strong>prototypes</strong>. Les <em>classes</em> introduites en ES6 sont du sucre syntaxique par-dessus ce système. Pour vraiment maîtriser la POO en JS, il faut comprendre les prototypes d'abord.</p>

      <h2>La chaîne de prototypes — Comment JS gère l'héritage</h2>

      <p>Chaque objet en JavaScript a une propriété interne <code>[[Prototype]]</code> (accessible via <code>__proto__</code> ou <code>Object.getPrototypeOf()</code>) qui pointe vers un autre objet. Quand vous accédez à une propriété, JS cherche dans l'objet, puis dans son prototype, puis dans le prototype du prototype... jusqu'à <code>null</code>.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Création manuelle avec Object.create</span>
<span class="kw">const</span> animal <span class="op">=</span> {
  <span class="fn">respirer</span>() { <span class="kw">return</span> <span class="str">\`\${<span class="kw">this</span>.nom} respire\`</span>; },
  <span class="fn">toString</span>() { <span class="kw">return</span> <span class="str">\`[Animal: \${<span class="kw">this</span>.nom}]\`</span>; }
};

<span class="cmt">// chien hérite de animal via le prototype</span>
<span class="kw">const</span> chien <span class="op">=</span> <span class="cls">Object</span>.<span class="fn">create</span>(animal);
chien.nom <span class="op">=</span> <span class="str">"Rex"</span>;
chien.<span class="fn">aboyer</span> <span class="op">=</span> <span class="kw">function</span>() { <span class="kw">return</span> <span class="str">"Woof!"</span>; };

chien.<span class="fn">respirer</span>(); <span class="cmt">// "Rex respire" ← trouvé dans animal</span>
chien.<span class="fn">aboyer</span>();   <span class="cmt">// "Woof!" ← trouvé dans chien lui-même</span>

<span class="cmt">// Inspection de la chaîne</span>
<span class="cls">Object</span>.<span class="fn">getPrototypeOf</span>(chien) <span class="op">===</span> animal; <span class="cmt">// true</span>
<span class="cmt">// chien → animal → Object.prototype → null</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Les classes ES6 SONT des prototypes — regardez sous le capot</span>
<span class="kw">class</span> <span class="cls">Animal</span> {
  <span class="fn">constructor</span>(nom) { <span class="kw">this</span>.nom <span class="op">=</span> nom; }
  <span class="fn">respirer</span>() { <span class="kw">return</span> <span class="str">\`\${<span class="kw">this</span>.nom} respire\`</span>; }
}

<span class="cmt">// Équivaut à :</span>
<span class="kw">function</span> <span class="cls">Animal</span>(nom) { <span class="kw">this</span>.nom <span class="op">=</span> nom; }
<span class="cls">Animal</span>.prototype.<span class="fn">respirer</span> <span class="op">=</span> <span class="kw">function</span>() {
  <span class="kw">return</span> <span class="str">\`\${<span class="kw">this</span>.nom} respire\`</span>;
};

<span class="cmt">// Preuve :</span>
<span class="kw">typeof</span> <span class="cls">Animal</span>; <span class="cmt">// "function" — pas un vrai type "class" !</span>
<span class="kw">const</span> chat <span class="op">=</span> <span class="kw">new</span> <span class="cls">Animal</span>(<span class="str">"Mimi"</span>);
chat.<span class="fn">respirer</span> <span class="op">===</span> <span class="cls">Animal</span>.prototype.<span class="fn">respirer</span>; <span class="cmt">// true</span></pre>
      </div>

      <h2>Classes ES6+ — Syntaxe complète</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">class</span> <span class="cls">Vehicule</span> {
  <span class="cmt">// Champs publics (déclarés avant constructor)</span>
  marque <span class="op">=</span> <span class="str">"Inconnue"</span>;

  <span class="cmt">// Champs privés (ES2022) — vraiment inaccessibles de l'extérieur</span>
  #vitesse <span class="op">=</span> <span class="num">0</span>;
  #carburant <span class="op">=</span> <span class="num">100</span>;

  <span class="cmt">// Champ et méthode statiques (appartiennent à la classe, pas aux instances)</span>
  <span class="kw">static</span> nombreInstances <span class="op">=</span> <span class="num">0</span>;
  <span class="kw">static</span> <span class="fn">comparer</span>(a, b) { <span class="kw">return</span> a.#vitesse <span class="op">-</span> b.#vitesse; }

  <span class="fn">constructor</span>(marque, modele) {
    <span class="kw">this</span>.marque <span class="op">=</span> marque;
    <span class="kw">this</span>.modele <span class="op">=</span> modele;
    <span class="cls">Vehicule</span>.nombreInstances<span class="op">++</span>;
  }

  <span class="cmt">// Getter : accès comme propriété</span>
  <span class="kw">get</span> <span class="fn">infos</span>() {
    <span class="kw">return</span> <span class="str">\`\${<span class="kw">this</span>.marque} \${<span class="kw">this</span>.modele} @ \${<span class="kw">this</span>.#vitesse}km/h\`</span>;
  }

  <span class="cmt">// Setter : validation à l'assignation</span>
  <span class="kw">set</span> <span class="fn">vitesse</span>(v) {
    <span class="kw">if</span> (v <span class="op">&lt;</span> <span class="num">0</span>) <span class="kw">throw new</span> <span class="cls">RangeError</span>(<span class="str">"Vitesse négative impossible"</span>);
    <span class="kw">if</span> (v <span class="op">></span> <span class="num">250</span>) <span class="kw">throw new</span> <span class="cls">RangeError</span>(<span class="str">"Vitesse max: 250km/h"</span>);
    <span class="kw">this</span>.#vitesse <span class="op">=</span> v;
  }

  <span class="kw">get</span> <span class="fn">vitesse</span>() { <span class="kw">return</span> <span class="kw">this</span>.#vitesse; }
}

<span class="kw">const</span> voiture <span class="op">=</span> <span class="kw">new</span> <span class="cls">Vehicule</span>(<span class="str">"Tesla"</span>, <span class="str">"Model 3"</span>);
voiture.vitesse <span class="op">=</span> <span class="num">120</span>;    <span class="cmt">// passe par le setter</span>
console.<span class="fn">log</span>(voiture.infos); <span class="cmt">// "Tesla Model 3 @ 120km/h"</span>
<span class="cmt">// voiture.#vitesse → SyntaxError !</span></pre>
      </div>

      <h2>Héritage avec extends et super</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">class</span> <span class="cls">Animal</span> {
  <span class="fn">constructor</span>(nom, energie <span class="op">=</span> <span class="num">100</span>) {
    <span class="kw">this</span>.nom <span class="op">=</span> nom;
    <span class="kw">this</span>.energie <span class="op">=</span> energie;
  }

  <span class="fn">manger</span>(quantite) {
    <span class="kw">this</span>.energie <span class="op">+=</span> quantite;
    <span class="kw">return</span> <span class="kw">this</span>; <span class="cmt">// retourner this pour le chaînage</span>
  }

  <span class="fn">toString</span>() { <span class="kw">return</span> <span class="str">\`\${<span class="kw">this</span>.nom} (\${<span class="kw">this</span>.energie} énergie)\`</span>; }
}

<span class="kw">class</span> <span class="cls">Chien</span> <span class="kw">extends</span> <span class="cls">Animal</span> {
  <span class="fn">constructor</span>(nom, race) {
    <span class="kw">super</span>(nom, <span class="num">150</span>); <span class="cmt">// OBLIGATOIRE avant this en classe enfant</span>
    <span class="kw">this</span>.race <span class="op">=</span> race;
  }

  <span class="cmt">// Surcharge de méthode (override)</span>
  <span class="fn">toString</span>() {
    <span class="kw">return</span> <span class="str">\`\${<span class="kw">super</span>.<span class="fn">toString</span>()} [Race: \${<span class="kw">this</span>.race}]\`</span>;
    <span class="cmt">// super.toString() appelle la version du parent</span>
  }

  <span class="fn">aboyer</span>() { <span class="kw">return</span> <span class="str">\`\${<span class="kw">this</span>.nom}: Woof!\`</span>; }
}

<span class="kw">const</span> rex <span class="op">=</span> <span class="kw">new</span> <span class="cls">Chien</span>(<span class="str">"Rex"</span>, <span class="str">"Berger Allemand"</span>);
rex.<span class="fn">manger</span>(<span class="num">20</span>).<span class="fn">manger</span>(<span class="num">10</span>); <span class="cmt">// chaînage !</span>
console.<span class="fn">log</span>(rex.<span class="fn">toString</span>()); <span class="cmt">// "Rex (180 énergie) [Race: Berger Allemand]"</span>
rex <span class="kw">instanceof</span> <span class="cls">Animal</span>; <span class="cmt">// true (héritage)</span></pre>
      </div>

      <div class="info-box warning">
        <div class="info-icon">⚠️</div>
        <p><code>super()</code> doit être appelé avant toute référence à <code>this</code> dans le constructeur d'une classe enfant. C'est parce que le constructeur parent est responsable de créer l'objet <code>this</code> (via le prototype). Sans super(), <code>this</code> n'est pas encore initialisé.</p>
      </div>

      <h2>Mixins — Composition d'héritage multiple</h2>

      <p>JavaScript n'a pas d'héritage multiple, mais on peut simuler la composition de comportements avec des <strong>mixins</strong> : des fonctions qui ajoutent des méthodes à une classe.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Mixins : fonctions qui "enrichissent" une classe</span>
<span class="kw">const</span> Serializable <span class="op">=</span> (SuperClass) <span class="op">=></span> <span class="kw">class extends</span> SuperClass {
  <span class="fn">toJSON</span>() { <span class="kw">return</span> <span class="cls">JSON</span>.<span class="fn">stringify</span>(<span class="kw">this</span>); }
  <span class="kw">static</span> <span class="fn">fromJSON</span>(json) { <span class="kw">return</span> <span class="cls">Object</span>.<span class="fn">assign</span>(<span class="kw">new</span> <span class="kw">this</span>(), <span class="cls">JSON</span>.<span class="fn">parse</span>(json)); }
};

<span class="kw">const</span> Loggable <span class="op">=</span> (SuperClass) <span class="op">=></span> <span class="kw">class extends</span> SuperClass {
  <span class="fn">log</span>(msg) {
    console.<span class="fn">log</span>(<span class="str">\`[\${<span class="kw">this</span>.constructor.name}] \${msg}\`</span>);
  }
};

<span class="cmt">// Appliquer plusieurs mixins</span>
<span class="kw">class</span> <span class="cls">User</span> <span class="kw">extends</span> <span class="fn">Serializable</span>(<span class="fn">Loggable</span>(<span class="cls">Animal</span>)) {
  <span class="fn">constructor</span>(nom, email) {
    <span class="kw">super</span>(nom);
    <span class="kw">this</span>.email <span class="op">=</span> email;
  }
}

<span class="kw">const</span> u <span class="op">=</span> <span class="kw">new</span> <span class="cls">User</span>(<span class="str">"Alice"</span>, <span class="str">"alice@ex.com"</span>);
u.<span class="fn">log</span>(<span class="str">"Connectée"</span>);    <span class="cmt">// [User] Connectée</span>
u.<span class="fn">toJSON</span>();           <span class="cmt">// '{"nom":"Alice","email":"alice@ex.com",...}'</span>
u.<span class="fn">manger</span>(<span class="num">10</span>);         <span class="cmt">// hérité d'Animal ✓</span></pre>
      </div>

      <h2>Pattern Observer — Architecture événementielle</h2>

      <p>L'Observer est l'un des patterns les plus utilisés en développement web. Il permet à des objets (<em>observateurs</em>) de s'abonner à des événements d'un autre objet (<em>sujet</em>) sans couplage fort. C'est le fondement de React, Vue, Redux, Node.js EventEmitter...</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">class</span> <span class="cls">EventEmitter</span> {
  #handlers <span class="op">=</span> <span class="kw">new</span> <span class="cls">Map</span>();

  <span class="fn">on</span>(event, callback) {
    <span class="kw">if</span> (<span class="op">!</span><span class="kw">this</span>.#handlers.<span class="fn">has</span>(event)) {
      <span class="kw">this</span>.#handlers.<span class="fn">set</span>(event, <span class="kw">new</span> <span class="cls">Set</span>());
    }
    <span class="kw">this</span>.#handlers.<span class="fn">get</span>(event).<span class="fn">add</span>(callback);
    <span class="cmt">// Retourner une fonction de désabonnement (unsubscribe)</span>
    <span class="kw">return</span> () <span class="op">=></span> <span class="kw">this</span>.<span class="fn">off</span>(event, callback);
  }

  <span class="fn">off</span>(event, callback) {
    <span class="kw">this</span>.#handlers.<span class="fn">get</span>(event)<span class="op">?.</span><span class="fn">delete</span>(callback);
  }

  <span class="fn">emit</span>(event, data) {
    <span class="kw">this</span>.#handlers.<span class="fn">get</span>(event)<span class="op">?.</span><span class="fn">forEach</span>(fn <span class="op">=></span> <span class="fn">fn</span>(data));
  }

  <span class="fn">once</span>(event, callback) {
    <span class="kw">const</span> wrapper <span class="op">=</span> (data) <span class="op">=></span> {
      <span class="fn">callback</span>(data);
      <span class="kw">this</span>.<span class="fn">off</span>(event, wrapper);
    };
    <span class="kw">this</span>.<span class="fn">on</span>(event, wrapper);
  }
}

<span class="cmt">// Usage</span>
<span class="kw">const</span> bus <span class="op">=</span> <span class="kw">new</span> <span class="cls">EventEmitter</span>();

<span class="kw">const</span> annuler <span class="op">=</span> bus.<span class="fn">on</span>(<span class="str">"user:login"</span>, (user) <span class="op">=></span> {
  console.<span class="fn">log</span>(<span class="str">\`Bienvenue \${user.nom}\`</span>);
});

bus.<span class="fn">once</span>(<span class="str">"app:init"</span>, () <span class="op">=></span> console.<span class="fn">log</span>(<span class="str">"Init (une seule fois)"</span>));

bus.<span class="fn">emit</span>(<span class="str">"user:login"</span>, { nom: <span class="str">"Alice"</span> }); <span class="cmt">// "Bienvenue Alice"</span>
bus.<span class="fn">emit</span>(<span class="str">"app:init"</span>); <span class="cmt">// "Init (une seule fois)"</span>
bus.<span class="fn">emit</span>(<span class="str">"app:init"</span>); <span class="cmt">// rien (déjà retiré)</span>

<span class="fn">annuler</span>(); <span class="cmt">// désabonnement propre</span></pre>
      </div>

      <h2>Pattern Builder — Construction d'objets complexes</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Builder : construire étape par étape avec une API fluide</span>
<span class="kw">class</span> <span class="cls">RequeteBuilder</span> {
  #config <span class="op">=</span> {
    methode: <span class="str">"GET"</span>,
    headers: {},
    timeout: <span class="num">5000</span>,
  };

  <span class="fn">url</span>(url) {
    <span class="kw">this</span>.#config.url <span class="op">=</span> url;
    <span class="kw">return</span> <span class="kw">this</span>; <span class="cmt">// retourner this pour le chaînage fluide</span>
  }

  <span class="fn">methode</span>(m) { <span class="kw">this</span>.#config.methode <span class="op">=</span> m; <span class="kw">return</span> <span class="kw">this</span>; }

  <span class="fn">header</span>(cle, valeur) {
    <span class="kw">this</span>.#config.headers[cle] <span class="op">=</span> valeur;
    <span class="kw">return</span> <span class="kw">this</span>;
  }

  <span class="fn">corps</span>(data) {
    <span class="kw">this</span>.#config.corps <span class="op">=</span> <span class="cls">JSON</span>.<span class="fn">stringify</span>(data);
    <span class="kw">this</span>.<span class="fn">header</span>(<span class="str">"Content-Type"</span>, <span class="str">"application/json"</span>);
    <span class="kw">return</span> <span class="kw">this</span>;
  }

  <span class="fn">timeout</span>(ms) { <span class="kw">this</span>.#config.timeout <span class="op">=</span> ms; <span class="kw">return</span> <span class="kw">this</span>; }

  <span class="kw">async</span> <span class="fn">envoyer</span>() {
    <span class="kw">const</span> { url, methode, headers, corps, timeout } <span class="op">=</span> <span class="kw">this</span>.#config;
    <span class="kw">const</span> res <span class="op">=</span> <span class="kw">await</span> <span class="fn">fetch</span>(url, { method: methode, headers, body: corps });
    <span class="kw">return</span> res.<span class="fn">json</span>();
  }
}

<span class="cmt">// API fluide lisible comme de la prose</span>
<span class="kw">const</span> data <span class="op">=</span> <span class="kw">await</span> <span class="kw">new</span> <span class="cls">RequeteBuilder</span>()
  .<span class="fn">url</span>(<span class="str">"/api/users"</span>)
  .<span class="fn">methode</span>(<span class="str">"POST"</span>)
  .<span class="fn">header</span>(<span class="str">"Authorization"</span>, <span class="str">"Bearer token123"</span>)
  .<span class="fn">corps</span>({ nom: <span class="str">"Alice"</span>, age: <span class="num">30</span> })
  .<span class="fn">timeout</span>(<span class="num">3000</span>)
  .<span class="fn">envoyer</span>();</pre>
      </div>

      <div class="challenge-block">
        <h3>Défi : Store réactif (mini-Redux)</h3>
        <p>Implémentez un <code>Store</code> qui combine l'Observer pattern et l'immutabilité. Il doit permettre de dispatcher des actions et notifier les abonnés à chaque changement d'état.</p>
        <pre><span class="kw">class</span> <span class="cls">Store</span> {
  #etat;
  #reducer;
  #abonnes <span class="op">=</span> <span class="kw">new</span> <span class="cls">Set</span>();

  <span class="fn">constructor</span>(reducer, etatInitial) {
    <span class="kw">this</span>.#reducer <span class="op">=</span> reducer;
    <span class="kw">this</span>.#etat <span class="op">=</span> etatInitial;
  }

  <span class="fn">getEtat</span>() { <span class="kw">return</span> <span class="kw">this</span>.#etat; }

  <span class="fn">dispatcher</span>(action) {
    <span class="kw">this</span>.#etat <span class="op">=</span> <span class="kw">this</span>.#reducer(<span class="kw">this</span>.#etat, action);
    <span class="kw">this</span>.#abonnes.<span class="fn">forEach</span>(fn <span class="op">=></span> <span class="fn">fn</span>(<span class="kw">this</span>.#etat));
  }

  <span class="fn">abonner</span>(fn) {
    <span class="kw">this</span>.#abonnes.<span class="fn">add</span>(fn);
    <span class="kw">return</span> () <span class="op">=></span> <span class="kw">this</span>.#abonnes.<span class="fn">delete</span>(fn); <span class="cmt">// unsubscribe</span>
  }
}

<span class="cmt">// Reducer pur</span>
<span class="kw">const</span> <span class="fn">compteurReducer</span> <span class="op">=</span> (etat <span class="op">=</span> { count: <span class="num">0</span> }, action) <span class="op">=></span> {
  <span class="kw">const</span> actions <span class="op">=</span> {
    INCREMENT: () <span class="op">=></span> ({ ...etat, count: etat.count <span class="op">+</span> <span class="num">1</span> }),
    DECREMENT: () <span class="op">=></span> ({ ...etat, count: etat.count <span class="op">-</span> <span class="num">1</span> }),
    RESET:     () <span class="op">=></span> ({ count: <span class="num">0</span> }),
  };
  <span class="kw">return</span> (actions[action.type] <span class="op">??</span> (() <span class="op">=></span> etat))();
};

<span class="kw">const</span> store <span class="op">=</span> <span class="kw">new</span> <span class="cls">Store</span>(compteurReducer, { count: <span class="num">0</span> });
<span class="kw">const</span> off <span class="op">=</span> store.<span class="fn">abonner</span>(etat <span class="op">=></span> console.<span class="fn">log</span>(<span class="str">"État:"</span>, etat.count));

store.<span class="fn">dispatcher</span>({ type: <span class="str">"INCREMENT"</span> }); <span class="cmt">// État: 1</span>
store.<span class="fn">dispatcher</span>({ type: <span class="str">"INCREMENT"</span> }); <span class="cmt">// État: 2</span>
<span class="fn">off</span>(); <span class="cmt">// désabonnement</span></pre>
      </div>
    `,
    quiz: [
      {
        question: "Qu'est-ce que la chaîne de prototypes en JavaScript ?",
        sub: "Mécanisme d'héritage par prototype",
        options: [
          "Une liste ordonnée de classes parentes",
          "Un mécanisme où chaque objet pointe vers un objet 'prototype', et JS remonte cette chaîne pour trouver une propriété",
          "Les méthodes héritées d'Object.prototype uniquement",
          "Un système de cache pour les propriétés d'objets"
        ],
        correct: 1,
        explanation: "✅ Exact ! Chaque objet JS a un [[Prototype]] interne. Quand vous accédez à une propriété, JS cherche dans l'objet, puis dans son prototype, puis dans le prototype du prototype... jusqu'à null. Les classes ES6 sont du sucre syntaxique par-dessus ce mécanisme."
      },
      {
        question: "Pourquoi les getters/setters sont-ils utiles dans une classe ?",
        sub: "Accesseurs dans les classes ES6",
        options: [
          "Ils améliorent les performances de l'objet",
          "Ils permettent d'accéder à une propriété via une syntaxe simple (obj.prop) tout en exécutant de la logique (validation, calcul) en coulisses",
          "Ils rendent les propriétés accessibles depuis les sous-classes uniquement",
          "Ils remplacent complètement les propriétés publiques"
        ],
        correct: 1,
        explanation: "✅ Parfait ! Les getters/setters permettent d'encapsuler la logique derrière une interface simple. Un setter peut valider les données avant de les stocker, calculer des valeurs dérivées, ou déclencher des effets. L'utilisateur de la classe voit juste obj.vitesse = 120."
      },
      {
        question: "Quel est l'avantage principal du pattern Observer ?",
        sub: "Design pattern Observer",
        options: [
          "Il améliore les performances en évitant les appels de fonctions",
          "Il permet de découpler l'émetteur d'événements des récepteurs — l'émetteur n'a pas besoin de connaître ses abonnés",
          "Il remplace la gestion d'erreurs try/catch",
          "Il crée automatiquement des copies d'objets"
        ],
        correct: 1,
        explanation: "✅ Exact ! L'Observer découple le producteur (sujet/émetteur) des consommateurs (observateurs/abonnés). Le sujet émet des événements sans savoir qui écoute. C'est le fondement de React, Redux, Vue, et Node.js EventEmitter."
      }
    ]
};
