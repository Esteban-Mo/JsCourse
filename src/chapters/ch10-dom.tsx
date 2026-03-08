import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeSelect = `// Sélectionner un seul élément (le premier match)
const titre = document.querySelector("h1");
const btn   = document.querySelector("#monBouton");    // par id
const card  = document.querySelector(".card.active"); // combiné

// Sélectionner plusieurs éléments → NodeList
const items = document.querySelectorAll(".menu-item");
items.forEach(item => console.log(item.textContent));

// Rechercher dans un sous-arbre
const nav   = document.querySelector("nav");
const liens = nav.querySelectorAll("a"); // liens dans nav uniquement`;

const codeModif = `const el = document.querySelector("#message");

// Contenu texte (sûr, échappe le HTML)
el.textContent = "Bonjour !";
console.log(el.textContent); // "Bonjour !"

// Contenu HTML (⚠️ risque XSS si données utilisateur)
el.innerHTML = "<strong>Bonjour</strong> !";

// Classes CSS
el.classList.add("active");
el.classList.remove("hidden");
el.classList.toggle("open");       // ajoute si absent, retire si présent
el.classList.contains("active");  // → true/false

// Attributs
el.setAttribute("disabled", "");
el.removeAttribute("disabled");
const href = el.getAttribute("href");`;

const codeCreer = `// Créer et insérer des éléments
const li = document.createElement("li");
li.textContent = "Nouvel item";
li.classList.add("item");

const liste = document.querySelector("ul");
liste.append(li);   // ajoute en dernier enfant
liste.prepend(li);  // ajoute en premier enfant

// Supprimer un élément
li.remove();

// Cloner un élément (true = avec ses enfants)
const clone = li.cloneNode(true);`;

const codeEvents1 = `const btn = document.querySelector("#btn");

// Écouter un événement
btn.addEventListener("click", (event) => {
  console.log("Cliqué !", event.target);
  event.preventDefault(); // annule le comportement par défaut (lien, submit…)
});

// Événements courants :
// click, dblclick, mouseenter, mouseleave, mousemove
// keydown, keyup (event.key = "Enter", "Escape"…)
// input, change, submit, focus, blur
// scroll, resize, load, DOMContentLoaded

// Retirer un listener (nécessite une référence à la fonction)
function handleClick(e) { console.log("clic"); }
btn.addEventListener("click", handleClick);
btn.removeEventListener("click", handleClick);`;

const codeEvents2 = `// Délégation d'événements
// Un seul listener sur le parent, on filtre via event.target
const liste = document.querySelector("#ma-liste");

liste.addEventListener("click", (e) => {
  const item = e.target.closest(".item"); // remonte jusqu'au parent .item
  if (!item) return;
  console.log("Item cliqué :", item.dataset.id);
});

// Fonctionne aussi pour les éléments ajoutés dynamiquement !
// → C'est le pattern recommandé pour les listes dynamiques`;

const codeForms = `const form  = document.querySelector("form");
const input = document.querySelector("#nom");

// Lire la valeur
console.log(input.value);          // valeur actuelle
console.log(input.value.trim());  // sans espaces en bords

// Intercepter le submit
form.addEventListener("submit", (e) => {
  e.preventDefault(); // empêche le rechargement de la page
  const nom = input.value.trim();
  if (!nom) {
    input.classList.add("error");
    return;
  }
  console.log(\`Bonjour, \${nom} !\`);
});

// FormData — récupérer tous les champs d'un coup
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  console.log(data.get("nom"), data.get("email"));
});`;

const codeStorage = `// Stocker / lire / supprimer
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme") ?? "light"; // null si absent
localStorage.removeItem("theme");
localStorage.clear(); // vide tout le storage

// Stocker un objet/tableau — JSON requis car storage = strings seulement
const prefs = { theme: "dark", taille: 16 };
localStorage.setItem("prefs", JSON.stringify(prefs));

const saved = JSON.parse(localStorage.getItem("prefs") || "null");
// → { theme: "dark", taille: 16 } ou null`;

const codeChallenge = `// Structure HTML attendue :
// <input id="tache"> <button id="ajouter">+</button>
// <ul id="liste"></ul>

let taches = JSON.parse(localStorage.getItem("taches") || "[]");

function sauvegarder() {
  localStorage.setItem("taches", JSON.stringify(taches));
}
function afficher() {
  document.querySelector("#liste").innerHTML = taches.map((t, i) =>
    \`<li data-i="\${i}">\${t} <button>✕</button></li>\`
  ).join("");
}

document.querySelector("#ajouter").addEventListener("click", () => {
  const val = document.querySelector("#tache").value.trim();
  if (val) { taches.push(val); sauvegarder(); afficher(); }
});
// Délégation pour la suppression
document.querySelector("#liste").addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (li) { taches.splice(+li.dataset.i, 1); sauvegarder(); afficher(); }
});
afficher(); // affichage initial depuis localStorage`;

function Ch07Dom() {
  return (
    <>
      <div className="chapter-tag">Chapitre 07 · DOM &amp; Browser</div>
      <h1>DOM &amp;<br /><span className="highlight">Events</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-intermediate">🌐</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★☆☆</div>
          <h3>Sélection, modification du DOM, événements, formulaires et localStorage</h3>
          <p>Durée estimée : 35 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Le DOM (<em>Document Object Model</em>) est la représentation en mémoire de ta page HTML sous forme d'arbre d'objets JavaScript. C'est l'interface entre ton code JS et le navigateur — tout ce que l'utilisateur voit et interagit avec passe par le DOM.</p>

      <InfoBox type="tip">
        <strong>L'arbre du DOM : Nodes vs Elements</strong><br />
        Conceptuellement, le navigateur transforme chaque balise HTML en un objet JS appelé <code>Element</code>. Mais l'arbre contient aussi des objets <code>Node</code> plus génériques. Par exemple, le texte à l'intérieur d'une balise est un <code>TextNode</code>, et les commentaires HTML sont des <code>CommentNode</code>. Dans 99% des cas, vous manipulerez des <code>Elements</code> (les balises elles-mêmes).
      </InfoBox>

      <h2>Sélectionner des éléments</h2>
      <p>Pour interagir avec un élément de la page (un bouton, un champ texte), il faut d'abord dire au navigateur de le "trouver" dans l'arbre du DOM. Les méthodes modernes utilisent la même syntaxe que les sélecteurs CSS (comme <code>.classe</code> ou <code>#id</code>).</p>
      <p><code>querySelector</code> retourne le <strong>premier</strong> élément correspondant, tandis que <code>querySelectorAll</code> retourne une liste (NodeList) de <strong>tous</strong> les éléments correspondants.</p>

      <CodeBlock language="javascript">{codeSelect}</CodeBlock>

      <InfoBox type="tip">
        Préfère toujours <code>querySelector</code> / <code>querySelectorAll</code> aux anciennes méthodes (<code>getElementById</code>, <code>getElementsByClassName</code>). Elles acceptent n'importe quel sélecteur CSS et ont une API cohérente.
      </InfoBox>

      <h2>Lire et modifier le DOM</h2>
      <p>Une fois l'élément sélectionné, vous tenez entre vos mains un objet JavaScript doté de dizaines de propriétés. Modifier ces propriétés (texte, classes, attributs) met instantanément à jour l'affichage sur la page.</p>

      <CodeBlock language="javascript">{codeModif}</CodeBlock>

      <CodeBlock language="javascript">{codeCreer}</CodeBlock>

      <InfoBox type="warning">
        N'utilise jamais <code>innerHTML</code> avec des données non maîtrisées (saisie utilisateur, données d'une API). Un attaquant pourrait injecter du JS malveillant via une attaque XSS. Utilise toujours <code>textContent</code> pour afficher du texte.
      </InfoBox>

      <h2>Événements</h2>
      <p>Un événement est un signal émis par le navigateur (clic de souris, frappe au clavier, redimensionnement de la fenêtre). JavaScript peut "écouter" ces signaux et exécuter une fonction en réponse grâce à <code>addEventListener</code>.</p>

      <CodeBlock language="javascript">{codeEvents1}</CodeBlock>

      <CodeBlock language="javascript">{codeEvents2}</CodeBlock>

      <InfoBox type="tip">
        <strong>Le bouillonnement (Event Bubbling) et la Délégation</strong><br />
        Quand on clique sur un enfant, l'événement "remonte" (buld) vers tous ses parents. La <strong>délégation d'événements</strong> exploite cela : au lieu d'attacher un écouteur sur 1000 boutons d'une liste, on attache un seul écouteur sur le conteneur parent (<code>&lt;ul&gt;</code>). On vérifie ensuite d'où vient le clic via <code>event.target</code>. C'est beaucoup plus performant et ça fonctionne pour les éléments ajoutés dynamiquement !
      </InfoBox>

      <h2>Formulaires</h2>
      <p>Les formulaires sont le principal moyen de récolter des données utilisateur. En JS, le but est souvent d'intercepter la validation naturelle du formulaire (pour éviter le rechargement de la page) et de vérifier/récupérer les données soi-même.</p>

      <CodeBlock language="javascript">{codeForms}</CodeBlock>

      <h2>localStorage — Persister des données</h2>
      <p>Le localStorage stocke des données texte dans le navigateur, persistantes entre rechargements et sessions (contrairement à sessionStorage qui s'efface à la fermeture de l'onglet).</p>

      <CodeBlock language="javascript">{codeStorage}</CodeBlock>

      <Challenge title="Défi personnel à réaliser : Mini gestionnaire de tâches">
        <p>Liste dynamique avec ajout, suppression et persistance localStorage.</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 10,
  title: 'DOM & Events',
  icon: '🌐',
  level: 'Intermédiaire',
  stars: '★★★☆☆',
  component: Ch07Dom,
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
    },
    {
      question: "Quelle est la différence entre event.target et event.currentTarget ?",
      sub: "Propagation d'événements et cibles",
      options: [
        "Ils sont identiques et interchangeables",
        "event.target est l'élément d'origine du clic, event.currentTarget est l'élément sur lequel le listener est attaché",
        "event.currentTarget est l'élément d'origine, event.target est le parent",
        "event.target est disponible uniquement avec addEventListener"
      ],
      correct: 1,
      explanation: "✅ Exact ! event.target est l'élément réel sur lequel l'événement a été déclenché (ex : le bouton cliqué). event.currentTarget est toujours l'élément sur lequel le listener addEventListener est attaché. Dans la délégation d'événements, currentTarget est le parent (le listener), target est l'enfant cliqué."
    },
    {
      question: "Quelle est la différence entre event.stopPropagation() et event.preventDefault() ?",
      sub: "Contrôle des événements",
      options: [
        "Ils font la même chose",
        "stopPropagation annule le comportement par défaut du navigateur, preventDefault arrête la remontée",
        "stopPropagation arrête la remontée de l'événement dans le DOM, preventDefault annule l'action native du navigateur",
        "stopPropagation supprime le listener, preventDefault le garde"
      ],
      correct: 2,
      explanation: "✅ Exact ! stopPropagation() empêche l'événement de remonter (bubbling) vers les éléments parents — il n'atteint plus les listeners des ancêtres. preventDefault() annule l'action native du navigateur associée à l'événement (ex: empêcher la navigation d'un lien, le rechargement d'un formulaire) mais l'événement continue de se propager."
    },
    {
      question: "Pour retirer un écouteur d'événement avec removeEventListener, quelle condition est indispensable ?",
      sub: "Suppression d'un listener",
      options: [
        "Il faut utiliser le même type d'événement uniquement",
        "Il faut passer une référence à la même fonction exacte utilisée lors de addEventListener",
        "Il faut appeler removeEventListener avant addEventListener",
        "removeEventListener fonctionne avec n'importe quelle fonction anonyme"
      ],
      correct: 1,
      explanation: "✅ Exact ! removeEventListener nécessite une référence identique à la fonction passée à addEventListener. Une fonction anonyme inline ne peut pas être retirée car chaque expression de fonction crée un nouvel objet. Il faut stocker la fonction dans une variable et passer cette variable aux deux appels."
    },
    {
      question: "Quelle est la différence entre l'événement DOMContentLoaded et l'événement load ?",
      sub: "Événements de chargement de la page",
      options: [
        "Ils sont déclenchés simultanément",
        "DOMContentLoaded se déclenche quand le HTML est parsé et le DOM prêt, load attend que toutes les ressources (images, CSS, scripts) soient chargées",
        "load est déclenché avant DOMContentLoaded",
        "DOMContentLoaded est uniquement disponible sur window"
      ],
      correct: 1,
      explanation: "✅ Exact ! DOMContentLoaded se déclenche dès que le HTML est entièrement parsé et le DOM construit, sans attendre les images et feuilles de style — c'est le bon moment pour initialiser des interactions JS. load se déclenche quand TOUT est chargé (images, CSS, iframes…), ce qui peut prendre bien plus longtemps."
    },
    {
      question: "Comment lire et écrire une valeur dans un attribut data-* d'un élément HTML ?",
      sub: "API dataset et attributs data",
      options: [
        "element.getAttribute('data-id') en lecture, element.setAttribute('data-id', val) en écriture uniquement",
        "element.data.id en lecture et écriture",
        "element.dataset.id en lecture, element.dataset.id = val en écriture",
        "document.data('id') en lecture, document.setData('id', val) en écriture"
      ],
      correct: 2,
      explanation: "✅ Exact ! La propriété dataset expose tous les attributs data-* sous forme d'objet. data-user-id est accessible via element.dataset.userId (le tiret est converti en camelCase). On peut lire et écrire : element.dataset.id = '42' crée ou modifie l'attribut data-id dans le HTML."
    }
  ]
};
