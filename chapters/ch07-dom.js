export default {
    id: 7,
    title: 'DOM & Events',
    icon: '🌐',
    level: 'Intermédiaire',
    stars: '★★★☆☆',
    content: () => `
      <div class="chapter-tag">Chapitre 07 · DOM & Browser</div>
      <h1>DOM &<br><span class="highlight">Events</span></h1>

      <div class="chapter-intro-card">
        <div class="level-badge level-intermediate">🌐</div>
        <div class="chapter-meta">
          <div class="difficulty-stars">★★★☆☆</div>
          <h3>Sélection, modification du DOM, événements, formulaires et localStorage</h3>
          <p>Durée estimée : 35 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Le DOM (<em>Document Object Model</em>) est la représentation en mémoire de ta page HTML sous forme d'arbre d'objets JavaScript. C'est l'interface entre ton code JS et le navigateur — tout ce que l'utilisateur voit et interagit avec passe par le DOM.</p>

      <h2>Sélectionner des éléments</h2>
      <p>Les deux méthodes modernes à connaître : <code>querySelector</code> retourne le premier élément correspondant au sélecteur CSS, <code>querySelectorAll</code> retourne une NodeList de tous les éléments correspondants.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Sélectionner un seul élément (le premier match)</span>
<span class="kw">const</span> titre = document.<span class="fn">querySelector</span>(<span class="str">"h1"</span>);
<span class="kw">const</span> btn   = document.<span class="fn">querySelector</span>(<span class="str">"#monBouton"</span>);    <span class="cmt">// par id</span>
<span class="kw">const</span> card  = document.<span class="fn">querySelector</span>(<span class="str">".card.active"</span>); <span class="cmt">// combiné</span>

<span class="cmt">// Sélectionner plusieurs éléments → NodeList</span>
<span class="kw">const</span> items = document.<span class="fn">querySelectorAll</span>(<span class="str">".menu-item"</span>);
items.<span class="fn">forEach</span>(item <span class="op">=></span> console.<span class="fn">log</span>(item.textContent));

<span class="cmt">// Rechercher dans un sous-arbre</span>
<span class="kw">const</span> nav   = document.<span class="fn">querySelector</span>(<span class="str">"nav"</span>);
<span class="kw">const</span> liens = nav.<span class="fn">querySelectorAll</span>(<span class="str">"a"</span>); <span class="cmt">// liens dans nav uniquement</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>Préfère toujours <code>querySelector</code> / <code>querySelectorAll</code> aux anciennes méthodes (<code>getElementById</code>, <code>getElementsByClassName</code>). Elles acceptent n'importe quel sélecteur CSS et ont une API cohérente.</p>
      </div>

      <h2>Lire et modifier le DOM</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> el = document.<span class="fn">querySelector</span>(<span class="str">"#message"</span>);

<span class="cmt">// Contenu texte (sûr, échappe le HTML)</span>
el.textContent = <span class="str">"Bonjour !"</span>;
console.<span class="fn">log</span>(el.textContent); <span class="cmt">// "Bonjour !"</span>

<span class="cmt">// Contenu HTML (⚠️ risque XSS si données utilisateur)</span>
el.innerHTML = <span class="str">"&lt;strong&gt;Bonjour&lt;/strong&gt; !"</span>;

<span class="cmt">// Classes CSS</span>
el.classList.<span class="fn">add</span>(<span class="str">"active"</span>);
el.classList.<span class="fn">remove</span>(<span class="str">"hidden"</span>);
el.classList.<span class="fn">toggle</span>(<span class="str">"open"</span>);       <span class="cmt">// ajoute si absent, retire si présent</span>
el.classList.<span class="fn">contains</span>(<span class="str">"active"</span>);  <span class="cmt">// → true/false</span>

<span class="cmt">// Attributs</span>
el.<span class="fn">setAttribute</span>(<span class="str">"disabled"</span>, <span class="str">""</span>);
el.<span class="fn">removeAttribute</span>(<span class="str">"disabled"</span>);
<span class="kw">const</span> href = el.<span class="fn">getAttribute</span>(<span class="str">"href"</span>);</pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Créer et insérer des éléments</span>
<span class="kw">const</span> li = document.<span class="fn">createElement</span>(<span class="str">"li"</span>);
li.textContent = <span class="str">"Nouvel item"</span>;
li.classList.<span class="fn">add</span>(<span class="str">"item"</span>);

<span class="kw">const</span> liste = document.<span class="fn">querySelector</span>(<span class="str">"ul"</span>);
liste.<span class="fn">append</span>(li);   <span class="cmt">// ajoute en dernier enfant</span>
liste.<span class="fn">prepend</span>(li);  <span class="cmt">// ajoute en premier enfant</span>

<span class="cmt">// Supprimer un élément</span>
li.<span class="fn">remove</span>();

<span class="cmt">// Cloner un élément (true = avec ses enfants)</span>
<span class="kw">const</span> clone = li.<span class="fn">cloneNode</span>(<span class="kw">true</span>);</pre>
      </div>

      <div class="info-box warning">
        <div class="info-icon">⚠️</div>
        <p>N'utilise jamais <code>innerHTML</code> avec des données non maîtrisées (saisie utilisateur, données d'une API). Un attaquant pourrait injecter du JS malveillant via une attaque XSS. Utilise toujours <code>textContent</code> pour afficher du texte.</p>
      </div>

      <h2>Événements</h2>
      <p>Un événement est un signal émis par le navigateur (clic, frappe, scroll…). <code>addEventListener</code> permet d'y réagir proprement.</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> btn = document.<span class="fn">querySelector</span>(<span class="str">"#btn"</span>);

<span class="cmt">// Écouter un événement</span>
btn.<span class="fn">addEventListener</span>(<span class="str">"click"</span>, (event) <span class="op">=></span> {
  console.<span class="fn">log</span>(<span class="str">"Cliqué !"</span>, event.target);
  event.<span class="fn">preventDefault</span>(); <span class="cmt">// annule le comportement par défaut (lien, submit…)</span>
});

<span class="cmt">// Événements courants :</span>
<span class="cmt">// click, dblclick, mouseenter, mouseleave, mousemove</span>
<span class="cmt">// keydown, keyup (event.key = "Enter", "Escape"…)</span>
<span class="cmt">// input, change, submit, focus, blur</span>
<span class="cmt">// scroll, resize, load, DOMContentLoaded</span>

<span class="cmt">// Retirer un listener (nécessite une référence à la fonction)</span>
<span class="kw">function</span> <span class="fn">handleClick</span>(e) { console.<span class="fn">log</span>(<span class="str">"clic"</span>); }
btn.<span class="fn">addEventListener</span>(<span class="str">"click"</span>, handleClick);
btn.<span class="fn">removeEventListener</span>(<span class="str">"click"</span>, handleClick);</pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Délégation d'événements</span>
<span class="cmt">// Un seul listener sur le parent, on filtre via event.target</span>
<span class="kw">const</span> liste = document.<span class="fn">querySelector</span>(<span class="str">"#ma-liste"</span>);

liste.<span class="fn">addEventListener</span>(<span class="str">"click"</span>, (e) <span class="op">=></span> {
  <span class="kw">const</span> item = e.target.<span class="fn">closest</span>(<span class="str">".item"</span>); <span class="cmt">// remonte jusqu'au parent .item</span>
  <span class="kw">if</span> (<span class="op">!</span>item) <span class="kw">return</span>;
  console.<span class="fn">log</span>(<span class="str">"Item cliqué :"</span>, item.dataset.id);
});

<span class="cmt">// Fonctionne aussi pour les éléments ajoutés dynamiquement !</span>
<span class="cmt">// → C'est le pattern recommandé pour les listes dynamiques</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>La <strong>délégation d'événements</strong> est plus performante que d'attacher un listener à chaque élément. Elle est surtout indispensable pour les éléments créés dynamiquement, car les listeners attachés avant leur création ne fonctionnent pas rétroactivement.</p>
      </div>

      <h2>Formulaires</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> form  = document.<span class="fn">querySelector</span>(<span class="str">"form"</span>);
<span class="kw">const</span> input = document.<span class="fn">querySelector</span>(<span class="str">"#nom"</span>);

<span class="cmt">// Lire la valeur</span>
console.<span class="fn">log</span>(input.value);          <span class="cmt">// valeur actuelle</span>
console.<span class="fn">log</span>(input.value.<span class="fn">trim</span>());  <span class="cmt">// sans espaces en bords</span>

<span class="cmt">// Intercepter le submit</span>
form.<span class="fn">addEventListener</span>(<span class="str">"submit"</span>, (e) <span class="op">=></span> {
  e.<span class="fn">preventDefault</span>(); <span class="cmt">// empêche le rechargement de la page</span>
  <span class="kw">const</span> nom = input.value.<span class="fn">trim</span>();
  <span class="kw">if</span> (<span class="op">!</span>nom) {
    input.classList.<span class="fn">add</span>(<span class="str">"error"</span>);
    <span class="kw">return</span>;
  }
  console.<span class="fn">log</span>(<span class="str">\`Bonjour, \${nom} !\`</span>);
});

<span class="cmt">// FormData — récupérer tous les champs d'un coup</span>
form.<span class="fn">addEventListener</span>(<span class="str">"submit"</span>, (e) <span class="op">=></span> {
  e.<span class="fn">preventDefault</span>();
  <span class="kw">const</span> data = <span class="kw">new</span> <span class="cls">FormData</span>(form);
  console.<span class="fn">log</span>(data.<span class="fn">get</span>(<span class="str">"nom"</span>), data.<span class="fn">get</span>(<span class="str">"email"</span>));
});</pre>
      </div>

      <h2>localStorage — Persister des données</h2>
      <p>Le localStorage stocke des données texte dans le navigateur, persistantes entre rechargements et sessions (contrairement à sessionStorage qui s'efface à la fermeture de l'onglet).</p>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Stocker / lire / supprimer</span>
localStorage.<span class="fn">setItem</span>(<span class="str">"theme"</span>, <span class="str">"dark"</span>);
<span class="kw">const</span> theme = localStorage.<span class="fn">getItem</span>(<span class="str">"theme"</span>) <span class="op">??</span> <span class="str">"light"</span>; <span class="cmt">// null si absent</span>
localStorage.<span class="fn">removeItem</span>(<span class="str">"theme"</span>);
localStorage.<span class="fn">clear</span>(); <span class="cmt">// vide tout le storage</span>

<span class="cmt">// Stocker un objet/tableau — JSON requis car storage = strings seulement</span>
<span class="kw">const</span> prefs = { theme: <span class="str">"dark"</span>, taille: <span class="num">16</span> };
localStorage.<span class="fn">setItem</span>(<span class="str">"prefs"</span>, <span class="cls">JSON</span>.<span class="fn">stringify</span>(prefs));

<span class="kw">const</span> saved = <span class="cls">JSON</span>.<span class="fn">parse</span>(localStorage.<span class="fn">getItem</span>(<span class="str">"prefs"</span>) <span class="op">||</span> <span class="str">"null"</span>);
<span class="cmt">// → { theme: "dark", taille: 16 } ou null</span></pre>
      </div>

      <div class="challenge-block">
        <div class="challenge-title">⚡ DÉFI PRATIQUE</div>
        <p style="color:#a0a0c0;font-size:14px">Mini gestionnaire de tâches : liste dynamique avec ajout, suppression et persistance localStorage.</p>
        <pre><span class="cmt">// Structure HTML attendue :</span>
<span class="cmt">// &lt;input id="tache"&gt; &lt;button id="ajouter"&gt;+&lt;/button&gt;</span>
<span class="cmt">// &lt;ul id="liste"&gt;&lt;/ul&gt;</span>

<span class="kw">let</span> taches = <span class="cls">JSON</span>.<span class="fn">parse</span>(localStorage.<span class="fn">getItem</span>(<span class="str">"taches"</span>) <span class="op">||</span> <span class="str">"[]"</span>);

<span class="kw">function</span> <span class="fn">sauvegarder</span>() {
  localStorage.<span class="fn">setItem</span>(<span class="str">"taches"</span>, <span class="cls">JSON</span>.<span class="fn">stringify</span>(taches));
}
<span class="kw">function</span> <span class="fn">afficher</span>() {
  document.<span class="fn">querySelector</span>(<span class="str">"#liste"</span>).innerHTML = taches.<span class="fn">map</span>((t, i) <span class="op">=></span>
    <span class="str">\`&lt;li data-i="\${i}"&gt;\${t} &lt;button&gt;✕&lt;/button&gt;&lt;/li&gt;\`</span>
  ).<span class="fn">join</span>(<span class="str">""</span>);
}

document.<span class="fn">querySelector</span>(<span class="str">"#ajouter"</span>).<span class="fn">addEventListener</span>(<span class="str">"click"</span>, () <span class="op">=></span> {
  <span class="kw">const</span> val = document.<span class="fn">querySelector</span>(<span class="str">"#tache"</span>).value.<span class="fn">trim</span>();
  <span class="kw">if</span> (val) { taches.<span class="fn">push</span>(val); <span class="fn">sauvegarder</span>(); <span class="fn">afficher</span>(); }
});
<span class="cmt">// Délégation pour la suppression</span>
document.<span class="fn">querySelector</span>(<span class="str">"#liste"</span>).<span class="fn">addEventListener</span>(<span class="str">"click"</span>, (e) <span class="op">=></span> {
  <span class="kw">const</span> li = e.target.<span class="fn">closest</span>(<span class="str">"li"</span>);
  <span class="kw">if</span> (li) { taches.<span class="fn">splice</span>(<span class="op">+</span>li.dataset.i, <span class="num">1</span>); <span class="fn">sauvegarder</span>(); <span class="fn">afficher</span>(); }
});
<span class="fn">afficher</span>(); <span class="cmt">// affichage initial depuis localStorage</span></pre>
      </div>
    `,
    quiz: [
      {
        question: "Quelle est la méthode recommandée pour écouter un clic sur un bouton ?",
        sub: "L'API événementielle du DOM",
        options: [
          "btn.onclick = function() {}",
          "btn.addEventListener('click', handler)",
          "btn.on('click', handler)",
          "btn.listen('click', handler)"
        ],
        correct: 1,
        explanation: "✅ Correct ! addEventListener est la méthode recommandée — elle peut attacher plusieurs handlers au même événement et supporte removeEventListener. L'assignation directe (onclick =) écrase les handlers existants et ne supporte pas la suppression propre."
      },
      {
        question: "Pourquoi éviter innerHTML avec des données utilisateur ?",
        sub: "Sécurité du DOM",
        options: [
          "innerHTML est plus lent que textContent",
          "innerHTML peut interpréter du HTML injecté comme du code, exposant à des attaques XSS",
          "innerHTML ne fonctionne pas dans tous les navigateurs",
          "innerHTML ne supporte pas les caractères spéciaux"
        ],
        correct: 1,
        explanation: "✅ Exact ! Si un utilisateur saisit <script>malware()</script> et que tu l'insères via innerHTML, le script peut s'exécuter — c'est une attaque XSS (Cross-Site Scripting). Utilise toujours textContent pour afficher du texte dont tu ne contrôles pas la source."
      },
      {
        question: "Qu'est-ce que la délégation d'événements ?",
        sub: "Pattern d'optimisation DOM",
        options: [
          "Attacher un événement à chaque élément de la liste individuellement",
          "Écouter sur un élément parent et identifier l'origine via event.target ou closest()",
          "Utiliser setTimeout pour différer les événements",
          "Dupliquer les listeners sur plusieurs éléments"
        ],
        correct: 1,
        explanation: "✅ Exact ! La délégation pose un seul listener sur le parent. Quand un enfant reçoit un événement, il 'remonte' (bubbling) jusqu'au parent. On utilise event.target ou closest() pour identifier l'élément d'origine. C'est plus performant et ça fonctionne avec les éléments ajoutés dynamiquement."
      }
    ]
};
