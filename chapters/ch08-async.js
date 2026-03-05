export default {
    id: 11,
    title: 'Async & Promises',
    icon: '🔮',
    level: 'Avancé',
    stars: '★★★★★',
    content: () => `
      <div class="chapter-tag">Chapitre 11 · JavaScript Asynchrone</div>
      <h1>Async &<br><span class="highlight">Promises</span></h1>

      <div class="chapter-intro-card">
        <div class="level-badge level-advanced">🔮</div>
        <div class="chapter-meta">
          <div class="difficulty-stars">★★★★★</div>
          <h3>Callbacks, Promises, async/await, Promise.all/race/any, AbortController</h3>
          <p>Durée estimée : 40 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>JavaScript est <strong>mono-thread</strong> : il ne peut exécuter qu'une seule opération à la fois. Mais les applications modernes ont besoin de faire des requêtes réseau, lire des fichiers, attendre des timers... Comment faire sans bloquer toute l'interface ? C'est le problème que résout la programmation asynchrone.</p>

      <h2>L'analogie du restaurant</h2>

      <p>Imaginez un serveur de restaurant (le thread JavaScript) :</p>
      <ul>
        <li><strong>Bloquant (mauvais)</strong> : Le serveur prend une commande, va en cuisine, ATTEND que le plat soit prêt, revient, puis prend la commande suivante. Personne n'est servi en attendant.</li>
        <li><strong>Non-bloquant (JS)</strong> : Le serveur prend la commande, la transmet en cuisine, puis sert immédiatement d'autres tables. Quand le plat est prêt (callback/Promise), il revient le livrer.</li>
      </ul>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// JS n'attend pas — il continue et revient plus tard</span>
console.<span class="fn">log</span>(<span class="str">"1. Commande prise"</span>);

<span class="fn">setTimeout</span>(() <span class="op">=></span> {
  console.<span class="fn">log</span>(<span class="str">"3. Plat servi (après 2s)"</span>);
}, <span class="num">2000</span>);

console.<span class="fn">log</span>(<span class="str">"2. En attendant, je sers d'autres tables"</span>);

<span class="cmt">// Sortie : 1, 2, 3 (dans cet ordre !)</span>
<span class="cmt">// Jamais : 1, (attente 2s), 3, 2</span></pre>
      </div>

      <h2>Callbacks — Le problème originel</h2>

      <p>Les callbacks (fonctions passées en argument pour être appelées plus tard) étaient la première solution. Mais enchaîner des opérations asynchrones crée la redoutable <em>pyramid of doom</em> :</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// ❌ Callback hell : difficile à lire, à déboguer, à gérer les erreurs</span>
<span class="fn">connexion</span>(user, (errConnexion, session) <span class="op">=></span> {
  <span class="kw">if</span> (errConnexion) { <span class="kw">return</span> console.<span class="fn">error</span>(errConnexion); }

  <span class="fn">chargerProfil</span>(session.id, (errProfil, profil) <span class="op">=></span> {
    <span class="kw">if</span> (errProfil) { <span class="kw">return</span> console.<span class="fn">error</span>(errProfil); }

    <span class="fn">chargerPermissions</span>(profil.role, (errPerms, perms) <span class="op">=></span> {
      <span class="kw">if</span> (errPerms) { <span class="kw">return</span> console.<span class="fn">error</span>(errPerms); }

      <span class="cmt">// Enfin ! On peut faire quelque chose...</span>
      console.<span class="fn">log</span>(<span class="str">"Connecté avec permissions:"</span>, perms);
    });
  });
});
<span class="cmt">// 3 niveaux d'imbrication, gestion d'erreur répétée, illisible...</span></pre>
      </div>

      <h2>Promises — Un contrat pour le futur</h2>

      <p>Une Promise représente une valeur qui n'est <em>pas encore disponible</em> mais qui le sera (ou pas). Elle a exactement trois états :</p>
      <ul>
        <li><strong>pending</strong> : en cours — ni résolue ni rejetée</li>
        <li><strong>fulfilled</strong> : opération réussie — la valeur est disponible</li>
        <li><strong>rejected</strong> : opération échouée — une erreur est disponible</li>
      </ul>
      <p>Une Promise ne peut changer d'état qu'une seule fois, et cet état est définitif.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Créer une Promise</span>
<span class="kw">const</span> <span class="fn">attendre</span> <span class="op">=</span> (ms) <span class="op">=></span> <span class="kw">new</span> <span class="cls">Promise</span>(resolve <span class="op">=></span> <span class="fn">setTimeout</span>(resolve, ms));

<span class="kw">const</span> <span class="fn">charger</span> <span class="op">=</span> (id) <span class="op">=></span> <span class="kw">new</span> <span class="cls">Promise</span>((resolve, reject) <span class="op">=></span> {
  <span class="kw">if</span> (id <span class="op">&lt;=</span> <span class="num">0</span>) {
    <span class="fn">reject</span>(<span class="kw">new</span> <span class="cls">Error</span>(<span class="str">"ID invalide"</span>));
    <span class="kw">return</span>; <span class="cmt">// IMPORTANT : ne pas oublier le return !</span>
  }
  <span class="cmt">// Simuler un délai réseau</span>
  <span class="fn">setTimeout</span>(() <span class="op">=></span> <span class="fn">resolve</span>({ id, nom: <span class="str">"Alice"</span> }), <span class="num">500</span>);
});

<span class="cmt">// Consommer avec .then/.catch/.finally</span>
<span class="fn">charger</span>(<span class="num">1</span>)
  .<span class="fn">then</span>(user <span class="op">=></span> {
    console.<span class="fn">log</span>(<span class="str">"Chargé:"</span>, user.nom);
    <span class="kw">return</span> user.nom.<span class="fn">toUpperCase</span>(); <span class="cmt">// chaîner en retournant une valeur</span>
  })
  .<span class="fn">then</span>(nomMaj <span class="op">=></span> console.<span class="fn">log</span>(<span class="str">"Majuscule:"</span>, nomMaj))
  .<span class="fn">catch</span>(err <span class="op">=></span> console.<span class="fn">error</span>(<span class="str">"Erreur:"</span>, err.message))
  .<span class="fn">finally</span>(() <span class="op">=></span> console.<span class="fn">log</span>(<span class="str">"Terminé (succès ou erreur)"</span>));</pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>Retourner une valeur dans un <code>.then()</code> la transmet au <code>.then()</code> suivant. Retourner une nouvelle Promise dans un <code>.then()</code> attend que cette Promise soit résolue avant de passer au suivant. C'est ce qui permet le chaînage propre.</p>
      </div>

      <h2>Promise.all, .allSettled, .race, .any — Orchestrer les Promises</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> <span class="fn">api</span> <span class="op">=</span> (id, ms) <span class="op">=></span> <span class="kw">new</span> <span class="cls">Promise</span>(res <span class="op">=></span> <span class="fn">setTimeout</span>(() <span class="op">=></span> <span class="fn">res</span>(<span class="str">\`data-\${id}\`</span>), ms));

<span class="cmt">// Promise.all : TOUTES doivent réussir (en parallèle)</span>
<span class="cmt">// Échoue si UNE seule échoue. Résultat dans l'ordre des promesses.</span>
<span class="kw">const</span> [r1, r2, r3] <span class="op">=</span> <span class="kw">await</span> <span class="cls">Promise</span>.<span class="fn">all</span>([
  <span class="fn">api</span>(<span class="num">1</span>, <span class="num">100</span>), <span class="fn">api</span>(<span class="num">2</span>, <span class="num">200</span>), <span class="fn">api</span>(<span class="num">3</span>, <span class="num">300</span>)
]);
<span class="cmt">// Total: 300ms (la plus longue), pas 100+200+300=600ms !</span>

<span class="cmt">// Promise.allSettled : toutes, succès OU échec</span>
<span class="cmt">// Ne rejette jamais. Retourne {status, value/reason} pour chacune.</span>
<span class="kw">const</span> resultats <span class="op">=</span> <span class="kw">await</span> <span class="cls">Promise</span>.<span class="fn">allSettled</span>([
  <span class="fn">api</span>(<span class="num">1</span>, <span class="num">100</span>),
  <span class="cls">Promise</span>.<span class="fn">reject</span>(<span class="kw">new</span> <span class="cls">Error</span>(<span class="str">"Echec"</span>)),
  <span class="fn">api</span>(<span class="num">3</span>, <span class="num">200</span>)
]);
<span class="cmt">// [{status:"fulfilled",value:"data-1"}, {status:"rejected",...}, ...]</span>

<span class="cmt">// Promise.race : LA PREMIÈRE à se résoudre (ou rejeter)</span>
<span class="cmt">// Utile pour les timeouts</span>
<span class="kw">const</span> <span class="fn">avecTimeout</span> <span class="op">=</span> (promise, ms) <span class="op">=></span>
  <span class="cls">Promise</span>.<span class="fn">race</span>([
    promise,
    <span class="kw">new</span> <span class="cls">Promise</span>((_, reject) <span class="op">=></span>
      <span class="fn">setTimeout</span>(() <span class="op">=></span> <span class="fn">reject</span>(<span class="kw">new</span> <span class="cls">Error</span>(<span class="str">"Timeout"</span>)), ms)
    )
  ]);

<span class="cmt">// Promise.any : la première qui RÉUSSIT (ignore les échecs)</span>
<span class="kw">const</span> premier <span class="op">=</span> <span class="kw">await</span> <span class="cls">Promise</span>.<span class="fn">any</span>([
  <span class="cls">Promise</span>.<span class="fn">reject</span>(<span class="str">"fail1"</span>),
  <span class="fn">api</span>(<span class="num">2</span>, <span class="num">300</span>),
  <span class="fn">api</span>(<span class="num">3</span>, <span class="num">100</span>)
]);
<span class="cmt">// "data-3" (la plus rapide qui réussit)</span></pre>
      </div>

      <h2>async/await — Ce que ça fait vraiment</h2>

      <p><code>async/await</code> est du <strong>sucre syntaxique</strong> par-dessus les Promises — pas une technologie différente. Sous le capot, une fonction <code>async</code> retourne toujours une Promise, et <code>await</code> met en pause uniquement cette fonction, pas le thread entier.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Ces deux blocs sont ÉQUIVALENTS</span>

<span class="cmt">// Avec .then()</span>
<span class="kw">function</span> <span class="fn">chargerUserPromise</span>(id) {
  <span class="kw">return</span> <span class="fn">fetch</span>(<span class="str">\`/api/users/\${id}\`</span>)
    .<span class="fn">then</span>(res <span class="op">=></span> {
      <span class="kw">if</span> (<span class="op">!</span>res.ok) <span class="kw">throw new</span> <span class="cls">Error</span>(<span class="str">"Non trouvé"</span>);
      <span class="kw">return</span> res.<span class="fn">json</span>();
    })
    .<span class="fn">then</span>(data <span class="op">=></span> data.nom);
}

<span class="cmt">// Avec async/await — identique sous le capot</span>
<span class="kw">async function</span> <span class="fn">chargerUserAsync</span>(id) {
  <span class="kw">const</span> res <span class="op">=</span> <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">\`/api/users/\${id}\`</span>);
  <span class="kw">if</span> (<span class="op">!</span>res.ok) <span class="kw">throw new</span> <span class="cls">Error</span>(<span class="str">"Non trouvé"</span>);
  <span class="kw">const</span> data <span class="op">=</span> <span class="kw">await</span> res.<span class="fn">json</span>();
  <span class="kw">return</span> data.nom; <span class="cmt">// → wrappé dans une Promise résolue</span>
}

<span class="cmt">// Les deux retournent une Promise !</span>
<span class="fn">chargerUserAsync</span>(<span class="num">1</span>) <span class="kw">instanceof</span> <span class="cls">Promise</span>; <span class="cmt">// true</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Gestion d'erreur avec try/catch</span>
<span class="kw">async function</span> <span class="fn">chargerData</span>(url) {
  <span class="kw">try</span> {
    <span class="kw">const</span> res <span class="op">=</span> <span class="kw">await</span> <span class="fn">fetch</span>(url);

    <span class="kw">if</span> (<span class="op">!</span>res.ok) {
      <span class="kw">throw new</span> <span class="cls">Error</span>(<span class="str">\`HTTP \${res.status}: \${res.statusText}\`</span>);
    }

    <span class="kw">return</span> <span class="kw">await</span> res.<span class="fn">json</span>();

  } <span class="kw">catch</span> (erreur) {
    <span class="kw">if</span> (erreur.name <span class="op">===</span> <span class="str">"AbortError"</span>) {
      console.<span class="fn">log</span>(<span class="str">"Requête annulée"</span>);
    } <span class="kw">else</span> {
      console.<span class="fn">error</span>(<span class="str">"Erreur réseau:"</span>, erreur.message);
    }
    <span class="kw">throw</span> erreur; <span class="cmt">// re-lancer pour que l'appelant puisse gérer</span>
  }
}

<span class="cmt">// ❌ Piège : await séquentiel inutile</span>
<span class="kw">const</span> u1 <span class="op">=</span> <span class="kw">await</span> <span class="fn">chargerData</span>(<span class="str">"/users/1"</span>); <span class="cmt">// attend...</span>
<span class="kw">const</span> u2 <span class="op">=</span> <span class="kw">await</span> <span class="fn">chargerData</span>(<span class="str">"/users/2"</span>); <span class="cmt">// puis attend encore</span>
<span class="cmt">// Total: temps1 + temps2</span>

<span class="cmt">// ✅ En parallèle avec Promise.all</span>
<span class="kw">const</span> [user1, user2] <span class="op">=</span> <span class="kw">await</span> <span class="cls">Promise</span>.<span class="fn">all</span>([
  <span class="fn">chargerData</span>(<span class="str">"/users/1"</span>),
  <span class="fn">chargerData</span>(<span class="str">"/users/2"</span>)
]);
<span class="cmt">// Total: max(temps1, temps2)</span></pre>
      </div>

      <div class="info-box warning">
        <div class="info-icon">⚠️</div>
        <p>Ne mettez <strong>jamais</strong> await dans une boucle forEach — elle ne se comporte pas comme vous l'espérez. Utilisez <code>for...of</code> pour des awaits séquentiels, ou <code>Promise.all</code> avec <code>.map()</code> pour des awaits parallèles.</p>
      </div>

      <h2>AbortController — Annuler une requête en cours</h2>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// AbortController : annuler des opérations async</span>
<span class="kw">const</span> controller <span class="op">=</span> <span class="kw">new</span> <span class="cls">AbortController</span>();
<span class="kw">const</span> signal <span class="op">=</span> controller.signal;

<span class="cmt">// Annuler après 5 secondes</span>
<span class="kw">const</span> timeout <span class="op">=</span> <span class="fn">setTimeout</span>(() <span class="op">=></span> controller.<span class="fn">abort</span>(), <span class="num">5000</span>);

<span class="kw">try</span> {
  <span class="kw">const</span> res <span class="op">=</span> <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">"/api/slow-endpoint"</span>, { signal });
  <span class="fn">clearTimeout</span>(timeout); <span class="cmt">// annuler le timeout si succès</span>
  <span class="kw">const</span> data <span class="op">=</span> <span class="kw">await</span> res.<span class="fn">json</span>();
  console.<span class="fn">log</span>(data);
} <span class="kw">catch</span> (err) {
  <span class="kw">if</span> (err.name <span class="op">===</span> <span class="str">"AbortError"</span>) {
    console.<span class="fn">log</span>(<span class="str">"Requête annulée après 5s"</span>);
  }
}

<span class="cmt">// Cas d'usage React : annuler au démontage du composant</span>
<span class="cmt">// useEffect(() => {</span>
<span class="cmt">//   const controller = new AbortController();</span>
<span class="cmt">//   fetchData({ signal: controller.signal });</span>
<span class="cmt">//   return () => controller.abort(); // cleanup</span>
<span class="cmt">// }, []);</span></pre>
      </div>

      <div class="challenge-block">
        <h3>Défi : Retry avec backoff exponentiel</h3>
        <p>Implémentez une fonction <code>fetchAvecRetry(url, maxTentatives)</code> qui réessaie automatiquement en cas d'échec, avec un délai qui double à chaque tentative (100ms, 200ms, 400ms...).</p>
        <pre><span class="kw">const</span> <span class="fn">attendre</span> <span class="op">=</span> ms <span class="op">=></span> <span class="kw">new</span> <span class="cls">Promise</span>(res <span class="op">=></span> <span class="fn">setTimeout</span>(res, ms));

<span class="kw">async function</span> <span class="fn">fetchAvecRetry</span>(url, maxTentatives <span class="op">=</span> <span class="num">3</span>) {
  <span class="kw">let</span> delai <span class="op">=</span> <span class="num">100</span>;

  <span class="kw">for</span> (<span class="kw">let</span> tentative <span class="op">=</span> <span class="num">1</span>; tentative <span class="op">&lt;=</span> maxTentatives; tentative<span class="op">++</span>) {
    <span class="kw">try</span> {
      console.<span class="fn">log</span>(<span class="str">\`Tentative \${tentative}...\`</span>);
      <span class="kw">const</span> res <span class="op">=</span> <span class="kw">await</span> <span class="fn">fetch</span>(url);
      <span class="kw">if</span> (<span class="op">!</span>res.ok) <span class="kw">throw new</span> <span class="cls">Error</span>(<span class="str">\`HTTP \${res.status}\`</span>);
      <span class="kw">return</span> <span class="kw">await</span> res.<span class="fn">json</span>();
    } <span class="kw">catch</span> (err) {
      <span class="kw">if</span> (tentative <span class="op">===</span> maxTentatives) <span class="kw">throw</span> err;
      console.<span class="fn">log</span>(<span class="str">\`Échec, retry dans \${delai}ms\`</span>);
      <span class="kw">await</span> <span class="fn">attendre</span>(delai);
      delai <span class="op">*=</span> <span class="num">2</span>; <span class="cmt">// backoff exponentiel</span>
    }
  }
}

<span class="cmt">// Usage</span>
<span class="kw">const</span> data <span class="op">=</span> <span class="kw">await</span> <span class="fn">fetchAvecRetry</span>(<span class="str">"/api/unstable"</span>, <span class="num">4</span>);
<span class="cmt">// Tentative 1... Échec, retry dans 100ms</span>
<span class="cmt">// Tentative 2... Échec, retry dans 200ms</span>
<span class="cmt">// Tentative 3... Succès !</span></pre>
      </div>
    `,
    quiz: [
      {
        question: "Qu'est-ce qu'une Promise dans l'état 'pending' ?",
        sub: "Les 3 états d'une Promise",
        options: [
          "La Promise a réussi mais n'a pas encore renvoyé sa valeur",
          "La Promise est en cours d'exécution — ni résolue ni rejetée",
          "La Promise a échoué silencieusement",
          "La Promise attend d'être consommée avec .then()"
        ],
        correct: 1,
        explanation: "✅ Exact ! Une Promise peut être dans 3 états : pending (en cours), fulfilled (réussie avec valeur), rejected (échouée avec raison). Pending signifie que l'opération asynchrone est encore en cours."
      },
      {
        question: "Quelle méthode utiliser pour lancer plusieurs requêtes en parallèle ET obtenir TOUS les résultats (même si certains échouent) ?",
        sub: "Promise.all vs Promise.allSettled",
        options: [
          "Promise.all — elle gère les échecs automatiquement",
          "Promise.allSettled — elle retourne un résultat pour chaque Promise, succès ou échec",
          "Promise.race — elle est la plus rapide",
          "Promise.any — elle ignore les échecs"
        ],
        correct: 1,
        explanation: "✅ Parfait ! Promise.allSettled attend TOUTES les Promises et retourne un tableau de {status:'fulfilled',value} ou {status:'rejected',reason}. Promise.all s'arrête et rejette dès qu'UNE Promise échoue."
      },
      {
        question: "Pourquoi ne faut-il PAS utiliser await dans un .forEach() ?",
        sub: "async/await dans les boucles",
        options: [
          "forEach ne supporte pas les fonctions async",
          "forEach lance les fonctions async mais n'attend pas leur résolution — le code continue sans attendre",
          "forEach cause des memory leaks avec async",
          "Cela génère une SyntaxError"
        ],
        correct: 1,
        explanation: "✅ Exact ! forEach ne comprend pas les Promises retournées par les fonctions async — il les lance mais n'attend pas leur résolution. Le code après forEach continue immédiatement. Utilisez for...of pour des awaits séquentiels, ou Promise.all + .map() pour du parallèle."
      }
    ]
};
