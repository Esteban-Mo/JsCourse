export default {
  id: 18,
  title: 'TypeScript — POO Avancée',
  icon: '🏛️',
  level: 'Bonus TypeScript',
  stars: '★★★★★',
  content: () => `
    <div class="ts-badge">🔷 BONUS · TypeScript</div>
    <div class="chapter-tag">Chapitre 18 · TypeScript POO</div>
    <h1>TypeScript<br><span class="highlight" style="color:#3178c6">POO Avancée</span></h1>

    <div class="chapter-intro-card" style="border-color:rgba(49,120,198,0.3);background:linear-gradient(135deg,var(--surface),rgba(49,120,198,0.05))">
      <div class="level-badge level-typescript">🏛️</div>
      <div class="chapter-meta">
        <div class="difficulty-stars" style="color:#3178c6">★★★★★</div>
        <h3>Classes abstraites, modificateurs, type guards, discriminated unions</h3>
        <p>Durée estimée : 45 min · 2 quizz inclus</p>
      </div>
    </div>

    <p>TypeScript donne des super-pouvoirs à la POO JavaScript. Là où JS te laisse tout faire (et te laisser tout casser), TS enforce des contrats stricts grâce aux <strong>modificateurs d'accès</strong>, aux <strong>classes abstraites</strong> et aux <strong>interfaces</strong>.</p>

    <h2>Modificateurs d'accès</h2>
    <p>En JavaScript, tout est public par défaut — n'importe quel code peut lire ou modifier n'importe quelle propriété d'un objet. TypeScript introduit trois modificateurs pour contrôler l'accès :</p>
    <ul style="color:#a0a0c0;line-height:2.2;padding-left:20px;font-size:15px;margin-bottom:16px">
      <li><code>public</code> (défaut) — accessible partout</li>
      <li><code>private</code> — uniquement accessible à l'intérieur de la classe</li>
      <li><code>protected</code> — accessible dans la classe ET ses sous-classes</li>
      <li><code>readonly</code> — assignable uniquement dans le constructeur</li>
    </ul>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
      <pre><span class="kw">class</span> <span class="cls">CompteBancaire</span> {
  <span class="kw">public</span>   proprietaire<span class="op">:</span> <span class="cls">string</span>;
  <span class="kw">private</span>  solde<span class="op">:</span> <span class="cls">number</span>;       <span class="cmt">// interdit depuis l'extérieur</span>
  <span class="kw">readonly</span> iban<span class="op">:</span> <span class="cls">string</span>;        <span class="cmt">// jamais modifiable après init</span>

  <span class="cmt">// Raccourci : paramètre de constructeur = déclaration + assignation</span>
  <span class="kw">constructor</span>(
    <span class="kw">public</span> proprietaire<span class="op">:</span> <span class="cls">string</span>,
    <span class="kw">private</span> solde<span class="op">:</span> <span class="cls">number</span>,
    <span class="kw">readonly</span> iban<span class="op">:</span> <span class="cls">string</span>
  ) {}

  <span class="fn">deposer</span>(montant<span class="op">:</span> <span class="cls">number</span>)<span class="op">:</span> <span class="kw">void</span> {
    <span class="kw">if</span> (montant <span class="op">&lt;=</span> <span class="num">0</span>) <span class="kw">throw</span> <span class="kw">new</span> <span class="cls">Error</span>(<span class="str">"Montant invalide"</span>);
    <span class="kw">this</span>.solde <span class="op">+=</span> montant;
  }

  <span class="fn">getSolde</span>()<span class="op">:</span> <span class="cls">number</span> {
    <span class="kw">return</span> <span class="kw">this</span>.solde; <span class="cmt">// on expose via une méthode publique</span>
  }
}

<span class="kw">const</span> compte <span class="op">=</span> <span class="kw">new</span> <span class="cls">CompteBancaire</span>(<span class="str">"Alice"</span>, <span class="num">1000</span>, <span class="str">"FR76..."</span>);
compte.<span class="fn">deposer</span>(<span class="num">500</span>);
console.<span class="fn">log</span>(compte.<span class="fn">getSolde</span>()); <span class="cmt">// 1500</span>
<span class="cmt">// compte.solde = 0; ❌ Error: 'solde' is private
// compte.iban = "autre"; ❌ Error: 'iban' is readonly</span></pre>
    </div>

    <h2>Classes abstraites</h2>
    <p>Une classe abstraite est un <strong>modèle incomplet</strong> — elle définit la structure et le comportement commun, mais délègue certaines implémentations aux classes enfants. On ne peut pas instancier une classe abstraite directement.</p>
    <p>C'est idéal pour définir un "contrat" : "toute forme doit savoir calculer son aire, mais chaque forme le fait à sa manière".</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
      <pre><span class="kw">abstract class</span> <span class="cls">Forme</span> {
  <span class="kw">abstract</span> <span class="fn">aire</span>()<span class="op">:</span> <span class="cls">number</span>;      <span class="cmt">// doit être implémenté par les enfants</span>
  <span class="kw">abstract</span> <span class="fn">perimetre</span>()<span class="op">:</span> <span class="cls">number</span>;

  <span class="cmt">// Méthode concrète partagée par tous</span>
  <span class="fn">decrire</span>()<span class="op">:</span> <span class="cls">string</span> {
    <span class="kw">return</span> <span class="str">\`Aire: \${this.aire().toFixed(2)}, Périmètre: \${this.perimetre().toFixed(2)}\`</span>;
  }
}

<span class="kw">class</span> <span class="cls">Cercle</span> <span class="kw">extends</span> <span class="cls">Forme</span> {
  <span class="kw">constructor</span>(<span class="kw">private</span> rayon<span class="op">:</span> <span class="cls">number</span>) { <span class="kw">super</span>(); }
  <span class="fn">aire</span>()      { <span class="kw">return</span> <span class="cls">Math</span>.PI <span class="op">*</span> <span class="kw">this</span>.rayon <span class="op">**</span> <span class="num">2</span>; }
  <span class="fn">perimetre</span>() { <span class="kw">return</span> <span class="num">2</span> <span class="op">*</span> <span class="cls">Math</span>.PI <span class="op">*</span> <span class="kw">this</span>.rayon; }
}

<span class="kw">class</span> <span class="cls">Rectangle</span> <span class="kw">extends</span> <span class="cls">Forme</span> {
  <span class="kw">constructor</span>(<span class="kw">private</span> l<span class="op">:</span> <span class="cls">number</span>, <span class="kw">private</span> h<span class="op">:</span> <span class="cls">number</span>) { <span class="kw">super</span>(); }
  <span class="fn">aire</span>()      { <span class="kw">return</span> <span class="kw">this</span>.l <span class="op">*</span> <span class="kw">this</span>.h; }
  <span class="fn">perimetre</span>() { <span class="kw">return</span> <span class="num">2</span> <span class="op">*</span> (<span class="kw">this</span>.l <span class="op">+</span> <span class="kw">this</span>.h); }
}

<span class="cmt">// new Forme(); ❌ Cannot create instance of abstract class</span>
<span class="kw">const</span> formes<span class="op">:</span> <span class="cls">Forme</span>[] <span class="op">=</span> [<span class="kw">new</span> <span class="cls">Cercle</span>(<span class="num">5</span>), <span class="kw">new</span> <span class="cls">Rectangle</span>(<span class="num">4</span>, <span class="num">6</span>)];
formes.<span class="fn">forEach</span>(f <span class="op">=></span> console.<span class="fn">log</span>(f.<span class="fn">decrire</span>()));</pre>
    </div>

    <h2>Type Guards — rétrécir le type</h2>
    <p>Quand une variable peut être de plusieurs types (union type), TypeScript doit savoir à quel type tu as affaire pour te laisser appeler les bonnes méthodes. Les <strong>type guards</strong> sont des vérifications qui permettent à TS de "rétrécir" (narrow) le type.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
      <pre><span class="cmt">// typeof guard — pour les primitifs</span>
<span class="kw">function</span> <span class="fn">afficher</span>(valeur<span class="op">:</span> <span class="cls">string</span> <span class="op">|</span> <span class="cls">number</span>)<span class="op">:</span> <span class="cls">string</span> {
  <span class="kw">if</span> (<span class="kw">typeof</span> valeur <span class="op">===</span> <span class="str">"string"</span>) {
    <span class="kw">return</span> valeur.<span class="fn">toUpperCase</span>(); <span class="cmt">// TS sait que c'est un string ici</span>
  }
  <span class="kw">return</span> valeur.<span class="fn">toFixed</span>(<span class="num">2</span>);     <span class="cmt">// TS sait que c'est un number ici</span>
}

<span class="cmt">// instanceof guard — pour les classes</span>
<span class="kw">function</span> <span class="fn">calculerAire</span>(forme<span class="op">:</span> <span class="cls">Cercle</span> <span class="op">|</span> <span class="cls">Rectangle</span>)<span class="op">:</span> <span class="cls">number</span> {
  <span class="kw">if</span> (forme <span class="kw">instanceof</span> <span class="cls">Cercle</span>) {
    <span class="kw">return</span> forme.<span class="fn">aire</span>(); <span class="cmt">// TS sait que forme est un Cercle</span>
  }
  <span class="kw">return</span> forme.<span class="fn">aire</span>();   <span class="cmt">// Rectangle ici</span>
}

<span class="cmt">// Type guard personnalisé avec prédicat de type</span>
<span class="kw">interface</span> <span class="cls">Chat</span>  { type<span class="op">:</span> <span class="str">"chat"</span>;  ronronner()<span class="op">:</span> <span class="kw">void</span>; }
<span class="kw">interface</span> <span class="cls">Chien</span> { type<span class="op">:</span> <span class="str">"chien"</span>; aboyer()<span class="op">:</span> <span class="kw">void</span>; }

<span class="kw">function</span> <span class="fn">estUnChat</span>(animal<span class="op">:</span> <span class="cls">Chat</span> <span class="op">|</span> <span class="cls">Chien</span>)<span class="op">:</span> animal <span class="kw">is</span> <span class="cls">Chat</span> {
  <span class="kw">return</span> animal.type <span class="op">===</span> <span class="str">"chat"</span>;
}

<span class="kw">function</span> <span class="fn">parler</span>(animal<span class="op">:</span> <span class="cls">Chat</span> <span class="op">|</span> <span class="cls">Chien</span>) {
  <span class="kw">if</span> (<span class="fn">estUnChat</span>(animal)) {
    animal.<span class="fn">ronronner</span>(); <span class="cmt">// TS sait que c'est un Chat ici ✅</span>
  } <span class="kw">else</span> {
    animal.<span class="fn">aboyer</span>();    <span class="cmt">// TS sait que c'est un Chien ici ✅</span>
  }
}</pre>
    </div>

    <h2>Discriminated Unions</h2>
    <p>Un pattern très puissant : donner à chaque variante d'un union type une propriété <strong>discriminante</strong> (souvent <code>type</code> ou <code>kind</code>) avec une valeur littérale unique. TypeScript peut alors inférer le type exact dans chaque branche d'un switch.</p>

    <div class="code-block">
      <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
      <pre><span class="cmt">// Exemple : gestion d'états d'une requête API</span>
<span class="kw">type</span> <span class="cls">EtatRequete</span> <span class="op">=</span>
  <span class="op">|</span> { etat<span class="op">:</span> <span class="str">"chargement"</span> }
  <span class="op">|</span> { etat<span class="op">:</span> <span class="str">"succes"</span>;  donnees<span class="op">:</span> <span class="cls">string</span>[] }
  <span class="op">|</span> { etat<span class="op">:</span> <span class="str">"erreur"</span>;  message<span class="op">:</span> <span class="cls">string</span> };

<span class="kw">function</span> <span class="fn">afficherEtat</span>(req<span class="op">:</span> <span class="cls">EtatRequete</span>)<span class="op">:</span> <span class="cls">string</span> {
  <span class="kw">switch</span> (req.etat) {
    <span class="kw">case</span> <span class="str">"chargement"</span><span class="op">:</span>
      <span class="kw">return</span> <span class="str">"⏳ Chargement..."</span>;
    <span class="kw">case</span> <span class="str">"succes"</span><span class="op">:</span>
      <span class="kw">return</span> <span class="str">\`✅ \${req.donnees.length} résultats\`</span>; <span class="cmt">// TS sait que donnees existe</span>
    <span class="kw">case</span> <span class="str">"erreur"</span><span class="op">:</span>
      <span class="kw">return</span> <span class="str">\`❌ \${req.message}\`</span>;               <span class="cmt">// TS sait que message existe</span>
  }
}

<span class="cmt">// Si tu oublies un case, TS te prévient (avec --strictNullChecks)</span>
<span class="kw">function</span> <span class="fn">assertNever</span>(x<span class="op">:</span> <span class="kw">never</span>)<span class="op">:</span> <span class="kw">never</span> {
  <span class="kw">throw</span> <span class="kw">new</span> <span class="cls">Error</span>(<span class="str">"Case non géré : "</span> <span class="op">+</span> x);
}</pre>
    </div>

    <div class="info-box success">
      <div class="info-icon">💡</div>
      <p>Les <strong>discriminated unions</strong> sont le pattern TypeScript le plus utilisé dans les bases de code React et Redux. Ils remplacent avantageusement les hiérarchies de classes complexes par des types simples et exhaustifs.</p>
    </div>
  `,
  quiz: [
    {
      question: "Quelle est la différence entre private et # (champs privés JS natifs) en TypeScript ?",
      sub: "Modificateurs d'accès TypeScript",
      options: [
        "Ils sont identiques",
        "private n'existe qu'à la compilation (TS efface), # est natif JS et privé à l'exécution aussi",
        "# est plus lent car vérifié à l'exécution",
        "private empêche l'héritage, # non"
      ],
      correct: 1,
      explanation: "✅ Exact ! private TypeScript disparaît à la compilation — le JS généré n'a aucune protection. Les champs # (ES2022) sont privés même dans le JS compilé, car le runtime les protège. Pour une vraie encapsulation à l'exécution, utilise #."
    },
    {
      question: "Que fait 'animal is Chat' dans le type de retour d'un type guard ?",
      sub: "Prédicats de type (type predicates)",
      options: [
        "Caste l'animal en Chat sans vérification",
        "Indique à TypeScript que si la fonction retourne true, le paramètre est du type Chat dans la branche",
        "Lance une erreur si animal n'est pas un Chat",
        "C'est une syntaxe invalide en TypeScript"
      ],
      correct: 1,
      explanation: "✅ Parfait ! 'animal is Chat' est un prédicat de type. Il dit à TS : \"si cette fonction retourne true, alors le paramètre animal est de type Chat dans le bloc if\". TS utilisera cette info pour faire du narrowing automatique."
    }
  ]
};
