export default {
  id: 19,
  title: 'TypeScript — Décorateurs',
  icon: '🎨',
  level: 'Bonus TypeScript',
  stars: '★★★★★',
  content: () => `
    <div class="ts-badge">🔷 BONUS · TypeScript</div>
    <div class="chapter-tag">Chapitre 19 · Décorateurs & Patterns</div>
    <h1>TypeScript<br><span class="highlight" style="color:#3178c6">Décorateurs & Patterns</span></h1>

    <div class="chapter-intro-card" style="border-color:rgba(49,120,198,0.3);background:linear-gradient(135deg,var(--surface),rgba(49,120,198,0.05))">
      <div class="level-badge level-typescript">🎨</div>
      <div class="chapter-meta">
        <div class="difficulty-stars" style="color:#3178c6">★★★★★</div>
        <h3>Décorateurs, Singleton, Repository, Factory, DI</h3>
        <p>Durée estimée : 50 min · 2 quizz inclus</p>
      </div>
    </div>

    <p>Les décorateurs sont une fonctionnalité avancée de TypeScript (et du futur ECMAScript) qui permettent d'<strong>annoter et modifier</strong> des classes, méthodes ou propriétés de manière déclarative. C'est la syntaxe derrière des frameworks comme <strong>Angular, NestJS ou TypeORM</strong>.</p>

    <div class="info-box warning">
      <div class="info-icon">⚠️</div>
      <p>Pour utiliser les décorateurs, active <code>"experimentalDecorators": true</code> dans ton <code>tsconfig.json</code>. Les décorateurs TC39 Stage 3 (standard) ont une syntaxe légèrement différente.</p>
    </div>

    <h2>Décorateur de classe</h2>
    <p>Un décorateur de classe est une <strong>fonction qui reçoit le constructeur</strong> de la classe et peut le modifier ou l'enrober. Il s'applique avec la syntaxe <code>@NomDuDecorateur</code> juste avant la classe.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
      <pre><span class="cmt">// Un décorateur simple : ajoute un timestamp de création</span>
<span class="kw">function</span> <span class="fn">Horodatable</span>(constructeur<span class="op">:</span> <span class="cls">Function</span>) {
  constructeur.prototype.createdAt <span class="op">=</span> <span class="kw">new</span> <span class="cls">Date</span>();
}

<span class="op">@</span><span class="fn">Horodatable</span>
<span class="kw">class</span> <span class="cls">Utilisateur</span> {
  <span class="kw">constructor</span>(<span class="kw">public</span> nom<span class="op">:</span> <span class="cls">string</span>) {}
}

<span class="kw">const</span> u <span class="op">=</span> <span class="kw">new</span> <span class="cls">Utilisateur</span>(<span class="str">"Alice"</span>);
console.<span class="fn">log</span>((u <span class="kw">as</span> <span class="kw">any</span>).createdAt); <span class="cmt">// Date de création ✅</span>

<span class="cmt">// Décorateur factory : avec paramètres</span>
<span class="kw">function</span> <span class="fn">Log</span>(prefixe<span class="op">:</span> <span class="cls">string</span>) {
  <span class="kw">return</span> <span class="kw">function</span>(constructeur<span class="op">:</span> <span class="cls">Function</span>) {
    console.<span class="fn">log</span>(<span class="str">\`[\${prefixe}] Classe \${constructeur.name} définie\`</span>);
  };
}

<span class="op">@</span><span class="fn">Log</span>(<span class="str">"DEBUG"</span>)
<span class="kw">class</span> <span class="cls">Service</span> {}
<span class="cmt">// → [DEBUG] Classe Service définie</span></pre>
    </div>

    <h2>Décorateur de méthode</h2>
    <p>Un décorateur de méthode intercepte l'appel à une méthode. C'est très utile pour ajouter de la <strong>journalisation, du cache, de la gestion d'erreurs</strong> ou de la validation sans modifier la méthode elle-même.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
      <pre><span class="cmt">// Décorateur qui mesure le temps d'exécution</span>
<span class="kw">function</span> <span class="fn">Mesurer</span>(
  target<span class="op">:</span> <span class="kw">any</span>,
  nomMethode<span class="op">:</span> <span class="cls">string</span>,
  descripteur<span class="op">:</span> <span class="cls">PropertyDescriptor</span>
) {
  <span class="kw">const</span> original <span class="op">=</span> descripteur.value;

  descripteur.value <span class="op">=</span> <span class="kw">function</span>(...args<span class="op">:</span> <span class="kw">any</span>[]) {
    <span class="kw">const</span> debut <span class="op">=</span> <span class="cls">performance</span>.<span class="fn">now</span>();
    <span class="kw">const</span> resultat <span class="op">=</span> original.<span class="fn">apply</span>(<span class="kw">this</span>, args);
    <span class="kw">const</span> fin <span class="op">=</span> <span class="cls">performance</span>.<span class="fn">now</span>();
    console.<span class="fn">log</span>(<span class="str">\`\${nomMethode} : \${(fin - debut).toFixed(2)}ms\`</span>);
    <span class="kw">return</span> resultat;
  };
  <span class="kw">return</span> descripteur;
}

<span class="cmt">// Décorateur qui mémoïse (cache) les résultats</span>
<span class="kw">function</span> <span class="fn">Memoize</span>(target<span class="op">:</span> <span class="kw">any</span>, key<span class="op">:</span> <span class="cls">string</span>, desc<span class="op">:</span> <span class="cls">PropertyDescriptor</span>) {
  <span class="kw">const</span> cache <span class="op">=</span> <span class="kw">new</span> <span class="cls">Map</span>();
  <span class="kw">const</span> original <span class="op">=</span> desc.value;
  desc.value <span class="op">=</span> <span class="kw">function</span>(...args<span class="op">:</span> <span class="kw">any</span>[]) {
    <span class="kw">const</span> cle <span class="op">=</span> <span class="cls">JSON</span>.<span class="fn">stringify</span>(args);
    <span class="kw">if</span> (cache.<span class="fn">has</span>(cle)) <span class="kw">return</span> cache.<span class="fn">get</span>(cle);
    <span class="kw">const</span> res <span class="op">=</span> original.<span class="fn">apply</span>(<span class="kw">this</span>, args);
    cache.<span class="fn">set</span>(cle, res);
    <span class="kw">return</span> res;
  };
}

<span class="kw">class</span> <span class="cls">Calculateur</span> {
  <span class="op">@</span><span class="fn">Mesurer</span>
  <span class="op">@</span><span class="fn">Memoize</span>
  <span class="fn">fibonacci</span>(n<span class="op">:</span> <span class="cls">number</span>)<span class="op">:</span> <span class="cls">number</span> {
    <span class="kw">if</span> (n <span class="op">&lt;=</span> <span class="num">1</span>) <span class="kw">return</span> n;
    <span class="kw">return</span> <span class="kw">this</span>.<span class="fn">fibonacci</span>(n <span class="op">-</span> <span class="num">1</span>) <span class="op">+</span> <span class="kw">this</span>.<span class="fn">fibonacci</span>(n <span class="op">-</span> <span class="num">2</span>);
  }
}</pre>
    </div>

    <h2>Pattern Singleton avec TypeScript</h2>
    <p>Le Singleton garantit qu'une classe n'a <strong>qu'une seule instance</strong> dans toute l'application. C'est utile pour les connexions DB, les stores, les services de configuration.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
      <pre><span class="kw">class</span> <span class="cls">ConfigService</span> {
  <span class="kw">private static</span> instance<span class="op">:</span> <span class="cls">ConfigService</span> <span class="op">|</span> <span class="kw">null</span> <span class="op">=</span> <span class="kw">null</span>;
  <span class="kw">private</span> config<span class="op">:</span> <span class="cls">Record</span><span class="op">&lt;</span><span class="cls">string</span>, <span class="cls">string</span><span class="op">&gt;</span> <span class="op">=</span> {};

  <span class="kw">private</span> <span class="kw">constructor</span>() {
    <span class="cmt">// constructeur privé — impossible de faire new ConfigService()</span>
    this.config <span class="op">=</span> { env: <span class="str">"production"</span>, version: <span class="str">"1.0"</span> };
  }

  <span class="kw">static</span> <span class="fn">getInstance</span>()<span class="op">:</span> <span class="cls">ConfigService</span> {
    <span class="kw">if</span> (<span class="op">!</span><span class="cls">ConfigService</span>.instance) {
      <span class="cls">ConfigService</span>.instance <span class="op">=</span> <span class="kw">new</span> <span class="cls">ConfigService</span>();
    }
    <span class="kw">return</span> <span class="cls">ConfigService</span>.instance;
  }

  <span class="fn">get</span>(cle<span class="op">:</span> <span class="cls">string</span>)<span class="op">:</span> <span class="cls">string</span> {
    <span class="kw">return</span> <span class="kw">this</span>.config[cle] <span class="op">??</span> <span class="str">""</span>;
  }
}

<span class="kw">const</span> config1 <span class="op">=</span> <span class="cls">ConfigService</span>.<span class="fn">getInstance</span>();
<span class="kw">const</span> config2 <span class="op">=</span> <span class="cls">ConfigService</span>.<span class="fn">getInstance</span>();
console.<span class="fn">log</span>(config1 <span class="op">===</span> config2); <span class="cmt">// true — même instance</span></pre>
    </div>

    <h2>Pattern Repository</h2>
    <p>Le Repository <strong>abstrait l'accès aux données</strong>. Au lieu que ton code métier parle directement à une DB, il parle à un repository — ce qui te permet de changer de DB ou de mocker facilement en tests.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
      <pre><span class="kw">interface</span> <span class="cls">IUserRepository</span> {
  <span class="fn">findById</span>(id<span class="op">:</span> <span class="cls">number</span>)<span class="op">:</span> <span class="cls">Promise</span><span class="op">&lt;</span><span class="cls">User</span> <span class="op">|</span> <span class="kw">null</span><span class="op">&gt;</span>;
  <span class="fn">findAll</span>()<span class="op">:</span> <span class="cls">Promise</span><span class="op">&lt;</span><span class="cls">User</span>[]<span class="op">&gt;</span>;
  <span class="fn">save</span>(user<span class="op">:</span> <span class="cls">User</span>)<span class="op">:</span> <span class="cls">Promise</span><span class="op">&lt;</span><span class="cls">User</span><span class="op">&gt;</span>;
  <span class="fn">delete</span>(id<span class="op">:</span> <span class="cls">number</span>)<span class="op">:</span> <span class="cls">Promise</span><span class="op">&lt;</span><span class="kw">void</span><span class="op">&gt;</span>;
}

<span class="cmt">// Implémentation en mémoire (parfaite pour les tests)</span>
<span class="kw">class</span> <span class="cls">InMemoryUserRepository</span> <span class="kw">implements</span> <span class="cls">IUserRepository</span> {
  <span class="kw">private</span> users<span class="op">:</span> <span class="cls">User</span>[] <span class="op">=</span> [];

  <span class="kw">async</span> <span class="fn">findById</span>(id<span class="op">:</span> <span class="cls">number</span>) {
    <span class="kw">return</span> <span class="kw">this</span>.users.<span class="fn">find</span>(u <span class="op">=></span> u.id <span class="op">===</span> id) <span class="op">??</span> <span class="kw">null</span>;
  }
  <span class="kw">async</span> <span class="fn">findAll</span>() { <span class="kw">return</span> [...<span class="kw">this</span>.users]; }
  <span class="kw">async</span> <span class="fn">save</span>(user<span class="op">:</span> <span class="cls">User</span>) {
    <span class="kw">this</span>.users.<span class="fn">push</span>(user);
    <span class="kw">return</span> user;
  }
  <span class="kw">async</span> <span class="fn">delete</span>(id<span class="op">:</span> <span class="cls">number</span>) {
    <span class="kw">this</span>.users <span class="op">=</span> <span class="kw">this</span>.users.<span class="fn">filter</span>(u <span class="op">=></span> u.id <span class="op">!==</span> id);
  }
}

<span class="cmt">// Le service métier ne connaît que l'interface — pas l'implémentation</span>
<span class="kw">class</span> <span class="cls">UserService</span> {
  <span class="kw">constructor</span>(<span class="kw">private</span> repo<span class="op">:</span> <span class="cls">IUserRepository</span>) {}

  <span class="kw">async</span> <span class="fn">promouvoir</span>(id<span class="op">:</span> <span class="cls">number</span>) {
    <span class="kw">const</span> user <span class="op">=</span> <span class="kw">await</span> <span class="kw">this</span>.repo.<span class="fn">findById</span>(id);
    <span class="kw">if</span> (<span class="op">!</span>user) <span class="kw">throw</span> <span class="kw">new</span> <span class="cls">Error</span>(<span class="str">"Utilisateur introuvable"</span>);
    user.role <span class="op">=</span> <span class="str">"admin"</span>;
    <span class="kw">return</span> <span class="kw">this</span>.repo.<span class="fn">save</span>(user);
  }
}</pre>
    </div>

    <div class="info-box tip">
      <div class="info-icon">💡</div>
      <p>Le pattern Repository est la base de l'<strong>architecture hexagonale</strong> (Ports & Adapters). Ton code métier (le cœur) ne sait jamais si les données viennent d'une PostgreSQL, MongoDB ou d'un simple tableau en mémoire — il parle uniquement à l'interface.</p>
    </div>
  `,
  quiz: [
    {
      question: "Dans quel ordre s'appliquent plusieurs décorateurs empilés sur une méthode ?",
      sub: "Ordre d'exécution des décorateurs",
      options: [
        "De haut en bas (le premier déclaré s'exécute en premier)",
        "De bas en haut (le plus proche de la méthode s'exécute en premier)",
        "L'ordre est aléatoire",
        "Tous s'appliquent simultanément"
      ],
      correct: 1,
      explanation: "✅ Exact ! Les décorateurs s'évaluent de haut en bas (comme des fonctions), mais s'appliquent de bas en haut. @A @B methode() → B est appliqué en premier sur la méthode, puis A enrobe le résultat. Comme une composition de fonctions : A(B(methode))."
    },
    {
      question: "Pourquoi le constructeur d'un Singleton est-il privé ?",
      sub: "Pattern Singleton",
      options: [
        "Pour des raisons de performance",
        "Pour empêcher l'appel de super() dans les sous-classes",
        "Pour forcer le passage par getInstance() et garantir l'unicité de l'instance",
        "C'est une convention mais pas obligatoire"
      ],
      correct: 2,
      explanation: "✅ Parfait ! Le constructeur privé rend impossible new MonSingleton() depuis l'extérieur. L'unique façon d'obtenir l'objet est MonSingleton.getInstance(), qui vérifie si une instance existe déjà et la réutilise — garantissant l'unicité."
    }
  ]
};
