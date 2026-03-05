export default {
    id: 14,
    title: 'Métaprogrammation',
    icon: '🔬',
    level: 'Maître',
    stars: '★★★★★',
    content: () => `
      <div class="chapter-tag">Chapitre 14 · Maître</div>
      <h1>Méta-<br><span class="highlight">programmation</span></h1>
      <div class="chapter-intro-card">
        <div class="level-badge level-master">🔬</div>
        <div class="chapter-meta">
          <div class="difficulty-stars" style="color:var(--danger)">★★★★★</div>
          <h3>Proxy, Reflect, Symbol.iterator, Symbol.toPrimitive, Générateurs</h3>
          <p>Durée estimée : 50 min · 3 quizz inclus</p>
        </div>
      </div>

      <div class="info-box danger">
        <div class="info-icon">🔥</div>
        <p>La métaprogrammation, c'est du <strong>code qui modifie le comportement d'autre code</strong>. Ces outils sont utilisés dans les entrailles de Vue.js (réactivité), MobX, Immer, et des ORMs comme Prisma. Comprendre ce chapitre, c'est comprendre comment les frameworks fonctionnent vraiment.</p>
      </div>

      <h2>Proxy — Intercepter toutes les opérations sur un objet</h2>

      <p>Un <code>Proxy</code> enveloppe un objet cible et peut intercepter (via des <em>traps</em>) toutes les opérations fondamentales : lecture, écriture, suppression, appel de fonction, instanciation... Il est au cœur de la réactivité de Vue 3.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Traps disponibles (les plus importants)</span>
<span class="kw">const</span> handler <span class="op">=</span> {
  <span class="cmt">// get : intercepte la LECTURE d'une propriété</span>
  <span class="fn">get</span>(target, prop, receiver) {
    console.<span class="fn">log</span>(<span class="str">\`Lecture de "\${prop}"\`</span>);
    <span class="kw">return</span> <span class="fn">Reflect</span>.<span class="fn">get</span>(target, prop, receiver); <span class="cmt">// comportement par défaut</span>
  },

  <span class="cmt">// set : intercepte l'ÉCRITURE d'une propriété</span>
  <span class="fn">set</span>(target, prop, value, receiver) {
    console.<span class="fn">log</span>(<span class="str">\`Écriture: \${prop} = \${value}\`</span>);
    <span class="kw">if</span> (<span class="kw">typeof</span> value <span class="op">!==</span> <span class="kw">typeof</span> target[prop] <span class="op">&amp;&amp;</span> prop <span class="kw">in</span> target) {
      <span class="kw">throw new</span> <span class="cls">TypeError</span>(<span class="str">\`Type incorrect pour \${prop}\`</span>);
    }
    <span class="kw">return</span> <span class="fn">Reflect</span>.<span class="fn">set</span>(target, prop, value, receiver);
  },

  <span class="cmt">// has : intercepte l'opérateur "in"</span>
  <span class="fn">has</span>(target, prop) {
    console.<span class="fn">log</span>(<span class="str">\`Vérification: "\${prop}" in objet\`</span>);
    <span class="kw">return</span> <span class="fn">Reflect</span>.<span class="fn">has</span>(target, prop);
  },

  <span class="cmt">// deleteProperty : intercepte delete obj.prop</span>
  <span class="fn">deleteProperty</span>(target, prop) {
    <span class="kw">if</span> (prop.<span class="fn">startsWith</span>(<span class="str">"_"</span>)) <span class="kw">throw new</span> <span class="cls">Error</span>(<span class="str">"Propriété protégée"</span>);
    <span class="kw">return</span> <span class="fn">Reflect</span>.<span class="fn">deleteProperty</span>(target, prop);
  }
};

<span class="kw">const</span> obj <span class="op">=</span> <span class="kw">new</span> <span class="cls">Proxy</span>({ nom: <span class="str">"Alice"</span>, age: <span class="num">30</span> }, handler);
obj.nom;            <span class="cmt">// Log: Lecture de "nom" → "Alice"</span>
obj.age <span class="op">=</span> <span class="num">31</span>;        <span class="cmt">// Log: Écriture: age = 31</span>
<span class="str">"nom"</span> <span class="kw">in</span> obj;       <span class="cmt">// Log: Vérification: "nom" in objet → true</span>
<span class="cmt">// obj.age = "trente" → TypeError !</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Cas concret : validation de schéma avec Proxy</span>
<span class="kw">function</span> <span class="fn">creerObjetValide</span>(schema) {
  <span class="kw">return</span> (donnees) <span class="op">=></span> <span class="kw">new</span> <span class="cls">Proxy</span>(donnees, {
    <span class="fn">set</span>(target, prop, value) {
      <span class="kw">const</span> regle <span class="op">=</span> schema[prop];
      <span class="kw">if</span> (<span class="op">!</span>regle) <span class="kw">throw new</span> <span class="cls">Error</span>(<span class="str">\`Propriété inconnue: \${prop}\`</span>);
      <span class="kw">if</span> (<span class="kw">typeof</span> value <span class="op">!==</span> regle.type) {
        <span class="kw">throw new</span> <span class="cls">TypeError</span>(<span class="str">\`\${prop} doit être \${regle.type}\`</span>);
      }
      <span class="kw">if</span> (regle.<span class="fn">min</span> <span class="op">!==</span> <span class="kw">undefined</span> <span class="op">&amp;&amp;</span> value <span class="op">&lt;</span> regle.min) {
        <span class="kw">throw new</span> <span class="cls">RangeError</span>(<span class="str">\`\${prop} minimum: \${regle.min}\`</span>);
      }
      target[prop] <span class="op">=</span> value;
      <span class="kw">return</span> <span class="kw">true</span>;
    }
  });
}

<span class="kw">const</span> userSchema <span class="op">=</span> {
  nom:  { type: <span class="str">"string"</span> },
  age:  { type: <span class="str">"number"</span>, min: <span class="num">0</span> },
  email:{ type: <span class="str">"string"</span> }
};

<span class="kw">const</span> user <span class="op">=</span> <span class="fn">creerObjetValide</span>(userSchema)({});
user.nom <span class="op">=</span> <span class="str">"Alice"</span>;  <span class="cmt">// OK</span>
user.age <span class="op">=</span> <span class="num">30</span>;      <span class="cmt">// OK</span>
<span class="cmt">// user.age = -5  → RangeError: age minimum: 0</span>
<span class="cmt">// user.age = "trente" → TypeError: age doit être number</span></pre>
      </div>

      <h2>Reflect — Le miroir des Proxy traps</h2>

      <p><code>Reflect</code> est un objet qui expose les opérations fondamentales de JS comme des fonctions. Il "reflète" exactement ce que font les opérateurs natifs (<code>.</code>, <code>in</code>, <code>delete</code>...) mais sous forme appelable. Son rôle principal : restaurer le comportement par défaut dans un Proxy trap.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Reflect : équivalents fonctionnels des opérations JS</span>
<span class="kw">const</span> obj <span class="op">=</span> { a: <span class="num">1</span>, b: <span class="num">2</span> };

<span class="cmt">// Reflect.get(target, prop) ≡ target[prop]</span>
<span class="fn">Reflect</span>.<span class="fn">get</span>(obj, <span class="str">"a"</span>);         <span class="cmt">// 1</span>

<span class="cmt">// Reflect.set(target, prop, value) ≡ target[prop] = value</span>
<span class="fn">Reflect</span>.<span class="fn">set</span>(obj, <span class="str">"c"</span>, <span class="num">3</span>);      <span class="cmt">// true (succès)</span>

<span class="cmt">// Reflect.has(target, prop) ≡ prop in target</span>
<span class="fn">Reflect</span>.<span class="fn">has</span>(obj, <span class="str">"a"</span>);         <span class="cmt">// true</span>

<span class="cmt">// Reflect.deleteProperty ≡ delete target[prop]</span>
<span class="fn">Reflect</span>.<span class="fn">deleteProperty</span>(obj, <span class="str">"b"</span>); <span class="cmt">// true</span>

<span class="cmt">// Reflect.ownKeys ≡ Object.getOwnPropertyNames + Symbols</span>
<span class="fn">Reflect</span>.<span class="fn">ownKeys</span>(obj);            <span class="cmt">// ["a", "c"]</span>

<span class="cmt">// Pourquoi utiliser Reflect dans un Proxy ?</span>
<span class="cmt">// Parce que Reflect.get passe correctement le receiver (this),</span>
<span class="cmt">// ce que target[prop] ne fait pas toujours !</span>
<span class="kw">const</span> proxy <span class="op">=</span> <span class="kw">new</span> <span class="cls">Proxy</span>(obj, {
  <span class="fn">get</span>(target, prop, receiver) {
    <span class="cmt">// ✅ Correct : passe le proxy comme receiver</span>
    <span class="kw">return</span> <span class="fn">Reflect</span>.<span class="fn">get</span>(target, prop, receiver);
    <span class="cmt">// ❌ Parfois incorrect : ne passe pas receiver</span>
    <span class="cmt">// return target[prop];</span>
  }
});</pre>
      </div>

      <h2>Symbol.iterator — Rendre n'importe quel objet itérable</h2>

      <p>En implémentant la méthode <code>[Symbol.iterator]</code>, vous rendez un objet compatible avec <code>for...of</code>, le spread operator, la déstructuration, <code>Array.from()</code>, etc.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Un objet Range itérable</span>
<span class="kw">class</span> <span class="cls">Range</span> {
  <span class="fn">constructor</span>(debut, fin, pas <span class="op">=</span> <span class="num">1</span>) {
    <span class="kw">this</span>.debut <span class="op">=</span> debut;
    <span class="kw">this</span>.fin <span class="op">=</span> fin;
    <span class="kw">this</span>.pas <span class="op">=</span> pas;
  }

  [<span class="cls">Symbol</span>.iterator]() {
    <span class="kw">let</span> courant <span class="op">=</span> <span class="kw">this</span>.debut;
    <span class="kw">const</span> { fin, pas } <span class="op">=</span> <span class="kw">this</span>;

    <span class="kw">return</span> {
      <span class="fn">next</span>() {
        <span class="kw">if</span> (courant <span class="op">&lt;=</span> fin) {
          <span class="kw">const</span> value <span class="op">=</span> courant;
          courant <span class="op">+=</span> pas;
          <span class="kw">return</span> { value, done: <span class="kw">false</span> };
        }
        <span class="kw">return</span> { value: <span class="kw">undefined</span>, done: <span class="kw">true</span> };
      }
    };
  }
}

<span class="cmt">// Maintenant utilisable partout où on attend un itérable</span>
<span class="kw">const</span> r <span class="op">=</span> <span class="kw">new</span> <span class="cls">Range</span>(<span class="num">1</span>, <span class="num">10</span>, <span class="num">2</span>);

<span class="kw">for</span> (<span class="kw">const</span> n <span class="kw">of</span> r) { process.stdout.<span class="fn">write</span>(n <span class="op">+</span> <span class="str">" "</span>); }
<span class="cmt">// 1 3 5 7 9</span>

[...r];           <span class="cmt">// [1, 3, 5, 7, 9]</span>
<span class="kw">const</span> [a, b, c] <span class="op">=</span> r; <span class="cmt">// a=1, b=3, c=5</span>
<span class="cls">Array</span>.<span class="fn">from</span>(r);   <span class="cmt">// [1, 3, 5, 7, 9]</span></pre>
      </div>

      <h2>Symbol.toPrimitive — Contrôler la conversion de type</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">class</span> <span class="cls">Monnaie</span> {
  <span class="fn">constructor</span>(montant, devise <span class="op">=</span> <span class="str">"EUR"</span>) {
    <span class="kw">this</span>.montant <span class="op">=</span> montant;
    <span class="kw">this</span>.devise <span class="op">=</span> devise;
  }

  [<span class="cls">Symbol</span>.toPrimitive](hint) {
    <span class="cmt">// hint: "number", "string", ou "default"</span>
    <span class="kw">if</span> (hint <span class="op">===</span> <span class="str">"number"</span>) {
      <span class="kw">return</span> <span class="kw">this</span>.montant; <span class="cmt">// utilisé dans les opérations mathématiques</span>
    }
    <span class="kw">if</span> (hint <span class="op">===</span> <span class="str">"string"</span>) {
      <span class="kw">return</span> <span class="str">\`\${<span class="kw">this</span>.montant} \${<span class="kw">this</span>.devise}\`</span>; <span class="cmt">// utilisé dans les strings</span>
    }
    <span class="kw">return</span> <span class="kw">this</span>.montant; <span class="cmt">// "default" (==, +, etc.)</span>
  }
}

<span class="kw">const</span> prix <span class="op">=</span> <span class="kw">new</span> <span class="cls">Monnaie</span>(<span class="num">42.5</span>);

<span class="str">\`Prix: \${prix}\`</span>;  <span class="cmt">// "Prix: 42.5 EUR" (hint: "string")</span>
prix <span class="op">+</span> <span class="num">10</span>;          <span class="cmt">// 52.5 (hint: "default")</span>
prix <span class="op">*</span> <span class="num">2</span>;           <span class="cmt">// 85 (hint: "number")</span>
prix <span class="op">></span> <span class="num">40</span>;          <span class="cmt">// true</span></pre>
      </div>

      <h2>Générateurs — Fonctions qui peuvent être pausées</h2>

      <p>Une <em>fonction générateur</em> (<code>function*</code>) peut être <strong>pausée</strong> à chaque <code>yield</code> et <strong>reprise</strong> plus tard. Elle retourne un itérateur — parfait pour générer des séquences infinies ou des séquences paresseuses (lazy).</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Générateur basique</span>
<span class="kw">function</span>* <span class="fn">compter</span>(debut <span class="op">=</span> <span class="num">0</span>) {
  <span class="kw">let</span> n <span class="op">=</span> debut;
  <span class="kw">while</span> (<span class="kw">true</span>) { <span class="cmt">// séquence INFINIE — pas de problème !</span>
    <span class="kw">yield</span> n<span class="op">++</span>; <span class="cmt">// pause ici, retourne n, puis continue quand .next()</span>
  }
}

<span class="kw">const</span> gen <span class="op">=</span> <span class="fn">compter</span>(<span class="num">1</span>);
gen.<span class="fn">next</span>(); <span class="cmt">// { value: 1, done: false }</span>
gen.<span class="fn">next</span>(); <span class="cmt">// { value: 2, done: false }</span>
gen.<span class="fn">next</span>(); <span class="cmt">// { value: 3, done: false }</span>
<span class="cmt">// Jamais { done: true } car boucle infinie</span>

<span class="cmt">// Générateur fini</span>
<span class="kw">function</span>* <span class="fn">fibonacci</span>() {
  <span class="kw">let</span> [a, b] <span class="op">=</span> [<span class="num">0</span>, <span class="num">1</span>];
  <span class="kw">while</span> (<span class="kw">true</span>) {
    <span class="kw">yield</span> a;
    [a, b] <span class="op">=</span> [b, a <span class="op">+</span> b];
  }
}

<span class="cmt">// Prendre les 10 premiers Fibonacci</span>
<span class="kw">function</span> <span class="fn">take</span>(gen, n) {
  <span class="kw">const</span> result <span class="op">=</span> [];
  <span class="kw">for</span> (<span class="kw">const</span> val <span class="kw">of</span> gen) {
    result.<span class="fn">push</span>(val);
    <span class="kw">if</span> (result.length <span class="op">>=</span> n) <span class="kw">break</span>;
  }
  <span class="kw">return</span> result;
}

<span class="fn">take</span>(<span class="fn">fibonacci</span>(), <span class="num">10</span>); <span class="cmt">// [0,1,1,2,3,5,8,13,21,34]</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// WeakMap pour données privées (alternative à #)</span>
<span class="kw">const</span> _privé <span class="op">=</span> <span class="kw">new</span> <span class="cls">WeakMap</span>();

<span class="kw">class</span> <span class="cls">Compte</span> {
  <span class="fn">constructor</span>(propriétaire, solde) {
    <span class="cmt">// Stocker les données privées dans WeakMap</span>
    _privé.<span class="fn">set</span>(<span class="kw">this</span>, { solde, historique: [] });
    <span class="kw">this</span>.propriétaire <span class="op">=</span> propriétaire; <span class="cmt">// public</span>
  }

  <span class="fn">déposer</span>(montant) {
    <span class="kw">if</span> (montant <span class="op">&lt;=</span> <span class="num">0</span>) <span class="kw">throw new</span> <span class="cls">Error</span>(<span class="str">"Montant invalide"</span>);
    <span class="kw">const</span> data <span class="op">=</span> _privé.<span class="fn">get</span>(<span class="kw">this</span>);
    data.solde <span class="op">+=</span> montant;
    data.historique.<span class="fn">push</span>({ type: <span class="str">"dépôt"</span>, montant, date: <span class="kw">new</span> <span class="cls">Date</span>() });
    <span class="kw">return</span> <span class="kw">this</span>;
  }

  <span class="kw">get</span> <span class="fn">solde</span>() { <span class="kw">return</span> _privé.<span class="fn">get</span>(<span class="kw">this</span>).solde; }
  <span class="kw">get</span> <span class="fn">historique</span>() { <span class="kw">return</span> [..._privé.<span class="fn">get</span>(<span class="kw">this</span>).historique]; }
}

<span class="kw">const</span> c <span class="op">=</span> <span class="kw">new</span> <span class="cls">Compte</span>(<span class="str">"Alice"</span>, <span class="num">1000</span>);
c.<span class="fn">déposer</span>(<span class="num">500</span>).<span class="fn">déposer</span>(<span class="num">200</span>);
console.<span class="fn">log</span>(c.solde); <span class="cmt">// 1700</span>
<span class="cmt">// Impossible d'accéder directement à _privé.get(c) depuis l'extérieur</span>
<span class="cmt">// (sauf si on a accès à la variable _privé)</span></pre>
      </div>

      <div class="challenge-block">
        <h3>Défi : Objet Observable réactif</h3>
        <p>Combinez Proxy et le pattern Observer pour créer une fonction <code>observable(obj)</code> qui notifie automatiquement tous les abonnés quand une propriété change.</p>
        <pre><span class="kw">function</span> <span class="fn">observable</span>(obj) {
  <span class="kw">const</span> abonnes <span class="op">=</span> <span class="kw">new</span> <span class="cls">Map</span>(); <span class="cmt">// prop → Set de callbacks</span>

  <span class="kw">const</span> proxy <span class="op">=</span> <span class="kw">new</span> <span class="cls">Proxy</span>(obj, {
    <span class="fn">set</span>(target, prop, value) {
      <span class="kw">const</span> ancienneValeur <span class="op">=</span> target[prop];
      <span class="kw">const</span> ok <span class="op">=</span> <span class="fn">Reflect</span>.<span class="fn">set</span>(target, prop, value);

      <span class="kw">if</span> (ok <span class="op">&amp;&amp;</span> ancienneValeur <span class="op">!==</span> value) {
        abonnes.<span class="fn">get</span>(prop)<span class="op">?.</span><span class="fn">forEach</span>(fn <span class="op">=></span> <span class="fn">fn</span>(value, ancienneValeur));
        abonnes.<span class="fn">get</span>(<span class="str">"*"</span>)<span class="op">?.</span><span class="fn">forEach</span>(fn <span class="op">=></span> <span class="fn">fn</span>(prop, value, ancienneValeur));
      }
      <span class="kw">return</span> ok;
    }
  });

  proxy.<span class="fn">abonner</span> <span class="op">=</span> (prop, callback) <span class="op">=></span> {
    <span class="kw">if</span> (<span class="op">!</span>abonnes.<span class="fn">has</span>(prop)) abonnes.<span class="fn">set</span>(prop, <span class="kw">new</span> <span class="cls">Set</span>());
    abonnes.<span class="fn">get</span>(prop).<span class="fn">add</span>(callback);
    <span class="kw">return</span> () <span class="op">=></span> abonnes.<span class="fn">get</span>(prop).<span class="fn">delete</span>(callback);
  };

  <span class="kw">return</span> proxy;
}

<span class="kw">const</span> etat <span class="op">=</span> <span class="fn">observable</span>({ theme: <span class="str">"light"</span>, langue: <span class="str">"fr"</span>, count: <span class="num">0</span> });

etat.<span class="fn">abonner</span>(<span class="str">"theme"</span>, (nv, anc) <span class="op">=></span> console.<span class="fn">log</span>(<span class="str">\`Thème: \${anc} → \${nv}\`</span>));
etat.<span class="fn">abonner</span>(<span class="str">"*"</span>, (prop, nv) <span class="op">=></span> console.<span class="fn">log</span>(<span class="str">\`Changement: \${prop} = \${nv}\`</span>));

etat.theme <span class="op">=</span> <span class="str">"dark"</span>;
<span class="cmt">// "Thème: light → dark"</span>
<span class="cmt">// "Changement: theme = dark"</span></pre>
      </div>
    `,
    quiz: [
      {
        question: "Quel est le rôle de l'API Reflect par rapport aux Proxy traps ?",
        sub: "Reflect API et Proxy",
        options: [
          "Reflect est une alternative plus rapide aux Proxy traps",
          "Reflect expose les opérations fondamentales de JS comme fonctions, permettant de restaurer le comportement par défaut dans un trap tout en passant correctement le receiver",
          "Reflect permet de créer des Proxy sans handler",
          "Reflect annule les effets des Proxy traps"
        ],
        correct: 1,
        explanation: "✅ Exact ! Reflect fournit des méthodes qui correspondent exactement aux Proxy traps (Reflect.get, Reflect.set, etc.). Dans un trap, Reflect.get(target, prop, receiver) est préférable à target[prop] car il passe correctement le receiver (le proxy lui-même), évitant des bugs avec les getters qui utilisent this."
      },
      {
        question: "Quelle est la différence entre function* (générateur) et une fonction normale ?",
        sub: "Fonctions génératrices",
        options: [
          "Les générateurs sont des fonctions async",
          "Les générateurs peuvent être mis en pause à chaque yield et reprises plus tard — ils retournent un itérateur, pas une valeur directe",
          "Les générateurs s'exécutent en parallèle",
          "Les générateurs ne peuvent pas utiliser de variables locales"
        ],
        correct: 1,
        explanation: "✅ Parfait ! Une fonction* retourne un objet itérateur immédiatement sans exécuter le corps. Chaque appel à .next() exécute jusqu'au prochain yield, pause, et retourne {value, done}. Idéal pour les séquences infinies, la programmation paresseuse, et les co-routines."
      },
      {
        question: "Pourquoi utiliser WeakMap pour stocker des données privées d'une classe ?",
        sub: "WeakMap vs champs privés #",
        options: [
          "WeakMap est plus rapide que les champs privés #",
          "WeakMap permet d'utiliser des symboles comme clés",
          "Les données dans un WeakMap sont automatiquement libérées quand l'instance est collectée par le GC, évitant les fuites mémoire — et elles sont inaccessibles sans la référence au WeakMap",
          "WeakMap supporte l'héritage contrairement aux champs #"
        ],
        correct: 2,
        explanation: "✅ Exact ! Avec WeakMap, quand l'instance (la clé) n'a plus de référence forte, le GC libère automatiquement les données associées. Les champs # (ES2022) sont souvent préférables pour leur simplicité et leurs performances, mais WeakMap reste utile pour les cas où la gestion mémoire automatique est critique."
      }
    ]
};
