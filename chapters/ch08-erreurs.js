export default {
  id: 10,
  title: 'Gestion des Erreurs',
  icon: '🚨',
  level: 'Avancé',
  stars: '★★★★☆',
  content: () => `
    <div class="chapter-tag">Chapitre 10 · Gestion des Erreurs</div>
    <h1>Gestion<br>des <span class="highlight">Erreurs</span></h1>

    <div class="chapter-intro-card">
      <div class="level-badge level-advanced">🚨</div>
      <div class="chapter-meta">
        <div class="difficulty-stars">★★★★☆</div>
        <h3>try/catch/finally, types d'erreurs, erreurs personnalisées, re-throw</h3>
        <p>Durée estimée : 30 min · 3 quizz inclus</p>
      </div>
    </div>

    <p>Un programme qui ne gère pas les erreurs est un programme qui <strong>plante en silence</strong> — ou pire, qui continue de s'exécuter dans un état invalide. La gestion des erreurs n'est pas optionnelle : c'est ce qui distingue un code de production d'un prototype. Ce chapitre couvre les mécanismes natifs de JavaScript pour détecter, identifier, et propager les erreurs de façon contrôlée.</p>

    <h2>try / catch / finally — L'anatomie d'une zone protégée</h2>

    <p>Le bloc <code>try</code> délimite une zone de code dont l'exécution peut échouer. Si une erreur est lancée (<em>thrown</em>), l'exécution saute immédiatement au bloc <code>catch</code>. Le bloc <code>finally</code> s'exécute <strong>toujours</strong>, qu'il y ait eu erreur ou non — idéal pour nettoyer des ressources.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="kw">try</span> {
  <span class="cmt">// Code qui peut échouer</span>
  <span class="kw">const</span> data <span class="op">=</span> <span class="cls">JSON</span>.<span class="fn">parse</span>(<span class="str">"{ invalide }"</span>); <span class="cmt">// SyntaxError !</span>
  console.<span class="fn">log</span>(data); <span class="cmt">// jamais atteint</span>
} <span class="kw">catch</span> (err) {
  <span class="cmt">// err est l'objet erreur lancé</span>
  console.<span class="fn">log</span>(err.name);    <span class="cmt">// "SyntaxError"</span>
  console.<span class="fn">log</span>(err.message); <span class="cmt">// "Unexpected token i in JSON..."</span>
} <span class="kw">finally</span> {
  <span class="cmt">// Toujours exécuté : nettoyage, fermeture de connexion, etc.</span>
  console.<span class="fn">log</span>(<span class="str">"Nettoyage terminé"</span>);
}

<span class="cmt">// finally s'exécute même si try réussit</span>
<span class="kw">try</span> {
  <span class="kw">const</span> x <span class="op">=</span> <span class="num">1</span> <span class="op">+</span> <span class="num">1</span>;
} <span class="kw">finally</span> {
  console.<span class="fn">log</span>(<span class="str">"Toujours là !"</span>); <span class="cmt">// s'exécute</span>
}</pre>
    </div>

    <div class="info-box tip">
      <div class="info-icon">💡</div>
      <p><strong>finally</strong> s'exécute aussi si le bloc <code>try</code> contient un <code>return</code> ou un <code>break</code>. C'est le seul endroit garanti pour libérer une ressource (fichier ouvert, connexion DB, timer) quoi qu'il arrive.</p>
    </div>

    <h2>Les types d'erreurs natifs</h2>

    <p>JavaScript dispose de plusieurs sous-classes d'<code>Error</code>. Les identifier permet de distinguer une erreur de programmation (à corriger dans le code) d'une erreur d'exécution attendue (à gérer).</p>

    <div class="table-container">
      <table>
        <tr><th>Type</th><th>Cause typique</th></tr>
        <tr><td><code>Error</code></td><td>Classe de base, lancée manuellement avec <code>throw new Error()</code></td></tr>
        <tr><td><code>TypeError</code></td><td>Opération sur un mauvais type : <code>null.propriete</code>, appeler non-fonction</td></tr>
        <tr><td><code>RangeError</code></td><td>Valeur hors plage autorisée : <code>new Array(-1)</code>, stack overflow</td></tr>
        <tr><td><code>ReferenceError</code></td><td>Variable non déclarée : <code>console.log(inexistante)</code></td></tr>
        <tr><td><code>SyntaxError</code></td><td>Code malformé : <code>JSON.parse("invalid")</code>, eval de code invalide</td></tr>
        <tr><td><code>URIError</code></td><td><code>decodeURIComponent('%')</code> — séquence URI malformée</td></tr>
      </table>
    </div>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="cmt">// Identifier le type d'erreur avec instanceof</span>
<span class="kw">try</span> {
  <span class="kw">const</span> user <span class="op">=</span> <span class="kw">null</span>;
  user.nom; <span class="cmt">// TypeError : Cannot read properties of null</span>
} <span class="kw">catch</span> (err) {
  <span class="kw">if</span> (err <span class="kw">instanceof</span> <span class="cls">TypeError</span>) {
    console.<span class="fn">log</span>(<span class="str">"Problème de type :"</span>, err.message);
  } <span class="kw">else if</span> (err <span class="kw">instanceof</span> <span class="cls">SyntaxError</span>) {
    console.<span class="fn">log</span>(<span class="str">"JSON ou code invalide"</span>);
  } <span class="kw">else</span> {
    <span class="kw">throw</span> err; <span class="cmt">// re-lancer les erreurs inconnues</span>
  }
}

<span class="cmt">// Toutes les erreurs partagent ces propriétés</span>
<span class="kw">const</span> err <span class="op">=</span> <span class="kw">new</span> <span class="cls">Error</span>(<span class="str">"Quelque chose s'est mal passé"</span>);
err.name;    <span class="cmt">// "Error"</span>
err.message; <span class="cmt">// "Quelque chose s'est mal passé"</span>
err.stack;   <span class="cmt">// Trace d'appels — précieux pour le débogage</span></pre>
    </div>

    <h2>Erreurs personnalisées — Étendre Error</h2>

    <p>Créer ses propres classes d'erreurs permet de transporter des informations métier (code HTTP, ID de ressource) et de distinguer précisément les erreurs dans les <code>catch</code>. C'est une pratique standard en production.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="cmt">// Créer une erreur personnalisée</span>
<span class="kw">class</span> <span class="cls">ApiError</span> <span class="kw">extends</span> <span class="cls">Error</span> {
  <span class="fn">constructor</span>(message, statusCode, endpoint) {
    <span class="kw">super</span>(message); <span class="cmt">// appelle Error(message)</span>
    <span class="kw">this</span>.name <span class="op">=</span> <span class="str">"ApiError"</span>;
    <span class="kw">this</span>.statusCode <span class="op">=</span> statusCode;
    <span class="kw">this</span>.endpoint <span class="op">=</span> endpoint;
  }
}

<span class="kw">class</span> <span class="cls">ValidationError</span> <span class="kw">extends</span> <span class="cls">Error</span> {
  <span class="fn">constructor</span>(field, message) {
    <span class="kw">super</span>(message);
    <span class="kw">this</span>.name <span class="op">=</span> <span class="str">"ValidationError"</span>;
    <span class="kw">this</span>.field <span class="op">=</span> field;
  }
}

<span class="cmt">// Les utiliser</span>
<span class="kw">function</span> <span class="fn">validerAge</span>(age) {
  <span class="kw">if</span> (<span class="kw">typeof</span> age <span class="op">!==</span> <span class="str">"number"</span>) {
    <span class="kw">throw</span> <span class="kw">new</span> <span class="cls">ValidationError</span>(<span class="str">"age"</span>, <span class="str">"L'âge doit être un nombre"</span>);
  }
  <span class="kw">if</span> (age <span class="op">&lt;</span> <span class="num">0</span> <span class="op">||</span> age <span class="op">></span> <span class="num">150</span>) {
    <span class="kw">throw</span> <span class="kw">new</span> <span class="cls">RangeError</span>(<span class="str">\`Âge invalide : \${age}\`</span>);
  }
  <span class="kw">return</span> <span class="kw">true</span>;
}

<span class="kw">try</span> {
  <span class="fn">validerAge</span>(<span class="str">"vingt"</span>);
} <span class="kw">catch</span> (err) {
  <span class="kw">if</span> (err <span class="kw">instanceof</span> <span class="cls">ValidationError</span>) {
    console.<span class="fn">log</span>(<span class="str">\`Champ invalide: \${err.field} — \${err.message}\`</span>);
    <span class="cmt">// "Champ invalide: age — L'âge doit être un nombre"</span>
  }
}</pre>
    </div>

    <div class="info-box success">
      <div class="info-icon">🎯</div>
      <p>Règle d'or : créez une classe d'erreur par <strong>type de problème métier</strong> (<code>NotFoundError</code>, <code>UnauthorizedError</code>, <code>ValidationError</code>...). Ainsi, un <code>catch</code> en haut de la pile peut décider comment réagir selon le type d'erreur plutôt que d'analyser le message texte.</p>
    </div>

    <h2>Re-throw — Filtrer et propager</h2>

    <p>Un <code>catch</code> ne doit pas forcément tout avaler. Si l'erreur capturée n'est pas celle qu'on sait gérer, il faut la <strong>re-lancer</strong> pour qu'une couche supérieure puisse la traiter — ou qu'elle remonte jusqu'à l'utilisateur.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="kw">function</span> <span class="fn">chargerConfig</span>(json) {
  <span class="kw">try</span> {
    <span class="kw">return</span> <span class="cls">JSON</span>.<span class="fn">parse</span>(json);
  } <span class="kw">catch</span> (err) {
    <span class="cmt">// On ne gère QUE les SyntaxError (JSON malformé)</span>
    <span class="kw">if</span> (err <span class="kw">instanceof</span> <span class="cls">SyntaxError</span>) {
      <span class="kw">throw</span> <span class="kw">new</span> <span class="cls">Error</span>(<span class="str">\`Config invalide : \${err.message}\`</span>);
    }
    <span class="kw">throw</span> err; <span class="cmt">// re-lancer les autres erreurs telles quelles</span>
  }
}

<span class="cmt">// Wrapping d'erreur : ajouter du contexte sans perdre l'original</span>
<span class="kw">class</span> <span class="cls">DatabaseError</span> <span class="kw">extends</span> <span class="cls">Error</span> {
  <span class="fn">constructor</span>(message, cause) {
    <span class="kw">super</span>(message, { cause }); <span class="cmt">// ES2022 : Error.cause</span>
    <span class="kw">this</span>.name <span class="op">=</span> <span class="str">"DatabaseError"</span>;
  }
}

<span class="kw">try</span> {
  <span class="cmt">// opération DB qui échoue...</span>
} <span class="kw">catch</span> (originalErr) {
  <span class="kw">throw</span> <span class="kw">new</span> <span class="cls">DatabaseError</span>(<span class="str">"Impossible de lire l'utilisateur"</span>, originalErr);
  <span class="cmt">// err.cause contient l'erreur originale — précieux pour le debug</span>
}</pre>
    </div>

    <h2>Erreurs avec les Promises et async/await</h2>

    <p>Les Promises ont leur propre mécanisme de gestion d'erreurs. Une Promise rejetée non gérée déclenche un avertissement (ou une erreur) dans Node.js et les navigateurs modernes. Il y a deux styles — les deux sont valides selon le contexte.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
      <pre><span class="cmt">// Style Promise avec .catch()</span>
<span class="fn">fetch</span>(<span class="str">"/api/users"</span>)
  .<span class="fn">then</span>(res <span class="op">=></span> res.<span class="fn">json</span>())
  .<span class="fn">then</span>(data <span class="op">=></span> console.<span class="fn">log</span>(data))
  .<span class="fn">catch</span>(err <span class="op">=></span> console.<span class="fn">error</span>(<span class="str">"Erreur réseau :"</span>, err))
  .<span class="fn">finally</span>(() <span class="op">=></span> <span class="fn">setLoading</span>(<span class="kw">false</span>)); <span class="cmt">// .finally() existe aussi !</span>

<span class="cmt">// Style async/await avec try/catch — plus lisible</span>
<span class="kw">async function</span> <span class="fn">chargerUtilisateur</span>(id) {
  <span class="kw">try</span> {
    <span class="kw">const</span> res <span class="op">=</span> <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">\`/api/users/\${id}\`</span>);

    <span class="kw">if</span> (<span class="op">!</span>res.ok) {
      <span class="kw">throw</span> <span class="kw">new</span> <span class="cls">ApiError</span>(<span class="str">"Utilisateur introuvable"</span>, res.status, res.url);
    }

    <span class="kw">return</span> <span class="kw">await</span> res.<span class="fn">json</span>();
  } <span class="kw">catch</span> (err) {
    <span class="kw">if</span> (err <span class="kw">instanceof</span> <span class="cls">ApiError</span> <span class="op">&amp;&amp;</span> err.statusCode <span class="op">===</span> <span class="num">404</span>) {
      <span class="kw">return</span> <span class="kw">null</span>; <span class="cmt">// cas géré : utilisateur absent</span>
    }
    <span class="kw">throw</span> err; <span class="cmt">// re-lancer le reste (réseau, serveur...)</span>
  }
}</pre>
    </div>

    <div class="info-box danger">
      <div class="info-icon">🚫</div>
      <p>Ne jamais laisser une Promise rejetée sans gestionnaire. Dans Node.js, une <code>UnhandledPromiseRejection</code> peut crasher le processus. Toujours chaîner un <code>.catch()</code> ou utiliser <code>try/catch</code> autour des <code>await</code>.</p>
    </div>

    <div class="challenge-block">
      <div class="challenge-title">⚡ DÉFI PRATIQUE</div>
      <p style="color:#a0a0c0;font-size:14px">Implémentez une fonction <code>parseJSON(str)</code> qui retourne l'objet parsé en cas de succès, ou <code>null</code> si le JSON est invalide — sans jamais laisser l'erreur remonter. Puis créez une classe <code>NotFoundError</code> qui étend <code>Error</code> avec une propriété <code>resource</code>.</p>
      <pre><span class="cmt">// Solution</span>
<span class="kw">function</span> <span class="fn">parseJSON</span>(str) {
  <span class="kw">try</span> {
    <span class="kw">return</span> <span class="cls">JSON</span>.<span class="fn">parse</span>(str);
  } <span class="kw">catch</span> {
    <span class="kw">return</span> <span class="kw">null</span>; <span class="cmt">// catch sans variable — ES2019</span>
  }
}

<span class="fn">parseJSON</span>(<span class="str">'{"ok":true}'</span>); <span class="cmt">// { ok: true }</span>
<span class="fn">parseJSON</span>(<span class="str">"invalide"</span>);    <span class="cmt">// null</span>

<span class="kw">class</span> <span class="cls">NotFoundError</span> <span class="kw">extends</span> <span class="cls">Error</span> {
  <span class="fn">constructor</span>(resource) {
    <span class="kw">super</span>(<span class="str">\`\${resource} introuvable\`</span>);
    <span class="kw">this</span>.name <span class="op">=</span> <span class="str">"NotFoundError"</span>;
    <span class="kw">this</span>.resource <span class="op">=</span> resource;
  }
}

<span class="kw">throw</span> <span class="kw">new</span> <span class="cls">NotFoundError</span>(<span class="str">"Utilisateur #42"</span>);
<span class="cmt">// NotFoundError: Utilisateur #42 introuvable</span></pre>
    </div>
  `,
  quiz: [
    {
      question: "Le bloc finally s'exécute-t-il si le bloc try contient un return ?",
      sub: "Comportement de finally",
      options: [
        "Non, return interrompt tout y compris finally",
        "Oui, finally s'exécute toujours, même après un return dans try",
        "Seulement si le return retourne undefined",
        "Seulement si catch est présent aussi"
      ],
      correct: 1,
      explanation: "✅ Exact ! finally s'exécute TOUJOURS — après un return, un break, ou une erreur. C'est sa garantie fondamentale. C'est pourquoi il est idéal pour libérer des ressources (fermer une connexion, masquer un loader) peu importe ce qui s'est passé."
    },
    {
      question: "Quelle est la bonne façon de distinguer le type d'une erreur dans un catch ?",
      sub: "Identification des erreurs",
      options: [
        "Comparer err.type avec une chaîne : err.type === 'TypeError'",
        "Utiliser err instanceof TypeError (ou autre sous-classe)",
        "Lire err.code qui vaut toujours un nombre unique",
        "Utiliser typeof err === 'TypeError'"
      ],
      correct: 1,
      explanation: "✅ Parfait ! instanceof est la méthode fiable car elle vérifie la chaîne de prototype. err.name est une string modifiable, err.type n'existe pas nativement, et typeof err retourne toujours 'object'. instanceof fonctionne aussi avec vos classes personnalisées qui étendent Error."
    },
    {
      question: "Pourquoi re-lancer une erreur (throw err) dans un catch ?",
      sub: "Pattern re-throw",
      options: [
        "Pour éviter que le programme s'arrête",
        "Pour gérer uniquement les erreurs connues et laisser les autres remonter à une couche supérieure",
        "Parce que catch ne peut traiter qu'une erreur à la fois",
        "Pour convertir l'erreur en string"
      ],
      correct: 1,
      explanation: "✅ Exact ! Un catch ne doit gérer que les erreurs qu'il comprend. Si l'erreur capturée est d'un type inattendu, re-la-lancer (throw err) permet à une couche supérieure — ou au runtime — de la traiter. Avaler silencieusement toutes les erreurs masque des bugs critiques."
    }
  ]
};
