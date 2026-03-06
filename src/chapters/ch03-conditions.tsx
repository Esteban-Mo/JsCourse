import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeIfElse1 = `// Structure de base : if (condition) { ... } else { ... }
const age = 20;

if (age >= 18) {
  console.log("Bienvenue !");   // ce bloc s'exécute
} else {
  console.log("Accès refusé");  // ce bloc est ignoré
}
// → "Bienvenue !"`;

const codeIfElse2 = `const score = 75;

if (score >= 90) {
  console.log("Excellent !");   // ≥ 90
} else if (score >= 70) {
  console.log("Bien !");        // entre 70 et 89
} else if (score >= 50) {
  console.log("Passable");      // entre 50 et 69
} else {
  console.log("À améliorer");   // < 50
}
// → "Bien !" (score = 75)`;

const codeFalsy = `// Les 6 valeurs FALSY (converties en false)
if (false)     { } // false littéral
if (0)         { } // zéro
if ("")        { } // chaîne vide
if (null)      { } // null
if (undefined) { } // undefined
if (NaN)       { } // Not a Number

// Tout le reste est TRUTHY
if ("0")  { console.log("truthy!"); } // "0" = chaîne non vide
if ([])   { console.log("truthy!"); } // tableau vide = truthy
if ({})   { console.log("truthy!"); } // objet vide = truthy
if (-1)   { console.log("truthy!"); } // tout nombre ≠ 0`;

const codeTruthyUsage = `// Usage pratique du truthy/falsy
const username = "";
const displayName = username || "Invité";
// username est falsy → displayName = "Invité"

const items = [1, 2, 3];
if (items.length) {
  console.log("Le panier n'est pas vide");
}
// items.length = 3 → truthy → on entre dans le if

// Vérifier si une valeur existe
function traiter(data) {
  if (!data) {
    return "Aucune donnée";
  }
  return data.toUpperCase();
}`;

const codeGuard = `// ❌ Style "pyramide de la mort" — difficile à lire
function traiterCommande(user, panier) {
  if (user) {
    if (user.estConnecte) {
      if (panier.length > 0) {
        if (user.solde >= panier.total) {
          // Enfin, la vraie logique...
          return passerCommande(user, panier);
        }
      }
    }
  }
}

// ✅ Style guard clause — lisible et plat
function traiterCommande(user, panier) {
  if (!user)              return "Utilisateur requis";
  if (!user.estConnecte)  return "Connectez-vous d'abord";
  if (!panier.length)     return "Panier vide";
  if (user.solde < panier.total) return "Solde insuffisant";

  // La vraie logique est claire et non imbriquée
  return passerCommande(user, panier);
}`;

const codeTernaire1 = `// Cas d'usage idéal : assigner une valeur
const age = 20;
const statut = age >= 18 ? "majeur" : "mineur";
// statut = "majeur"

// Dans une template literal
console.log(\`Vous êtes \${age >= 18 ? "majeur" : "mineur"}\`);

// Dans du JSX (React)
// return <div>{isLoggedIn ? <Dashboard /> : <Login />}</div>`;

const codeTernaire2 = `// ❌ Ternaire imbriqué illisible
const label = score >= 90 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : "F";

// ✅ if/else lisible pour plusieurs cas
function getLabel(score) {
  if (score >= 90) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return "F";
}`;

const codeSwitch1 = `const jour = "Lundi";

switch (jour) {
  case "Lundi":
  case "Mardi":
  case "Mercredi":
  case "Jeudi":
    console.log("Jour de semaine");
    break; // IMPORTANT : arrête l'exécution
  case "Vendredi":
    console.log("TGIF !");
    break;
  case "Samedi":
  case "Dimanche":
    console.log("Weekend !");
    break;
  default:
    console.log("Jour inconnu");
}
// → "Jour de semaine" (Lundi matche, break arrête)`;

const codeSwitch2 = `// Fall-through intentionnel : accumuler des actions
const niveau = 2;
let droits = [];

switch (niveau) {
  case 3:
    droits.push("admin");   // fall-through intentionnel
  case 2:
    droits.push("editor");  // fall-through intentionnel
  case 1:
    droits.push("viewer");
    break;
}
// niveau 2 → droits = ["editor", "viewer"]
// niveau 3 → droits = ["admin", "editor", "viewer"]`;

const codeLookup1 = `// ❌ switch verbeux
function getEmojiSwitch(fruit) {
  switch (fruit) {
    case "pomme":  return "🍎";
    case "banane": return "🍌";
    case "cerise": return "🍒";
    default:       return "❓";
  }
}

// ✅ Object lookup — concis et extensible
const EMOJI_MAP = {
  pomme:  "🍎",
  banane: "🍌",
  cerise: "🍒",
};

const getEmoji = (fruit) => EMOJI_MAP[fruit] ?? "❓";

getEmoji("pomme");  // "🍎"
getEmoji("mangue"); // "❓" (nullish fallback)`;

const codeLookup2 = `// Object lookup avec des fonctions — très puissant !
const ACTIONS = {
  increment: (state) => ({ ...state, count: state.count + 1 }),
  decrement: (state) => ({ ...state, count: state.count - 1 }),
  reset:     (state) => ({ ...state, count: 0 }),
};

function reducer(state, action) {
  const handler = ACTIONS[action.type];
  return handler ? handler(state) : state;
}
// Pattern utilisé par Redux !`;

const codeChallenge = `function calculerTarif(age, estMembre) {
  // Guard clause
  if (age < 6) return 0;

  // Trouver la tranche d'âge
  const getTranche = () => {
    if (age <= 17) return "enfant";
    if (age <= 64) return "adulte";
    return "senior";
  };

  const TARIFS = {
    enfant: { normal: 5,  membre: 3 },
    adulte: { normal: 12, membre: 9 },
    senior: { normal: 8,  membre: 6 },
  };

  const tarif = TARIFS[getTranche()];
  return estMembre ? tarif.membre : tarif.normal;
}`;

function Ch03Conditions() {
  return (
    <>
      <div className="chapter-tag">Chapitre 03 · Contrôle de flux</div>
      <h1>Conditions &amp;<br /><span className="highlight">Décisions</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-beginner">🔀</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★☆☆☆</div>
          <h3>if/else, truthy/falsy, ternaire, switch et object lookup</h3>
          <p>Durée estimée : 25 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Un programme qui exécute toujours les mêmes instructions n'est pas très utile. Les conditions permettent à votre code de <strong>prendre des décisions</strong> en fonction des données. C'est le fondement même de la logique informatique.</p>

      <h2>if / else — La décision binaire</h2>

      <p>Imaginez un vigile à l'entrée d'une boîte de nuit : il regarde l'âge, et en fonction, laisse entrer ou non. C'est exactement ce que fait <code>if/else</code> — évaluer une condition et choisir un chemin d'exécution.</p>

      <CodeBlock language="javascript">{codeIfElse1}</CodeBlock>

      <p>On peut enchaîner plusieurs conditions avec <code>else if</code> pour gérer plus de deux cas :</p>

      <CodeBlock language="javascript">{codeIfElse2}</CodeBlock>

      <InfoBox type="tip">
        JS évalue les conditions <strong>de haut en bas</strong> et s'arrête au premier <code>if</code> ou <code>else if</code> vrai. L'ordre des conditions est donc crucial — placez les cas les plus spécifiques en premier.
      </InfoBox>

      <h2>Truthy et Falsy — Ce que JS considère comme "vrai"</h2>

      <p>En JavaScript, une condition ne doit pas forcément être un booléen strict. Le moteur JS <strong>convertit automatiquement</strong> toute valeur en booléen. C'est le concept de <em>truthy</em> (converti en <code>true</code>) et <em>falsy</em> (converti en <code>false</code>).</p>

      <p>Il n'existe que <strong>6 valeurs falsy</strong> en JavaScript. Tout le reste est truthy :</p>

      <CodeBlock language="javascript">{codeFalsy}</CodeBlock>

      <InfoBox type="warning">
        Piège classique : <code>[] == false</code> est <code>true</code> en comparaison lâche (==), mais <code>if ([])</code> entre dans le bloc car un tableau est truthy ! Utilisez toujours <code>===</code> pour éviter ces surprises.
      </InfoBox>

      <CodeBlock language="javascript">{codeTruthyUsage}</CodeBlock>

      <h2>Guard Clauses — Sortir tôt pour un code plus lisible</h2>

      <p>Le pattern <strong>guard clause</strong> (ou "early return") consiste à traiter les cas d'erreur ou cas limites <em>en premier</em> avec un <code>return</code> immédiat, pour éviter l'imbrication profonde de <code>if/else</code>. C'est l'une des techniques les plus importantes pour écrire du code propre.</p>

      <CodeBlock language="javascript">{codeGuard}</CodeBlock>

      <InfoBox type="success">
        La règle d'or : <strong>gérez les cas d'erreur en premier</strong>, retournez immédiatement, et laissez le "happy path" (le cas normal) à la fin, non imbriqué. Votre code sera deux fois plus lisible.
      </InfoBox>

      <h2>L'opérateur ternaire — if/else en une ligne</h2>

      <p>Le ternaire est un raccourci pour <code>if/else</code> simple. La syntaxe est : <code>condition ? valeurSiVrai : valeurSiFaux</code>. Il est particulièrement utile pour assigner une valeur conditionnellement.</p>

      <CodeBlock language="javascript">{codeTernaire1}</CodeBlock>

      <InfoBox type="warning">
        N'imbriquez <strong>jamais</strong> les ternaires ! <code>a ? b ? c : d : e</code> est illisible. Si vous avez plus de deux cas, utilisez <code>if/else</code> ou un objet lookup (voir plus bas).
      </InfoBox>

      <CodeBlock language="javascript">{codeTernaire2}</CodeBlock>

      <h2>switch / case — Comparer une valeur à plusieurs cas</h2>

      <p><code>switch</code> est idéal quand vous comparez <strong>une même variable</strong> à plusieurs valeurs exactes. Il utilise <code>===</code> (comparaison stricte) en interne.</p>

      <CodeBlock language="javascript">{codeSwitch1}</CodeBlock>

      <p>Le <strong>fall-through</strong> est le comportement par lequel, sans <code>break</code>, l'exécution continue dans les cases suivants. C'est rarement ce que vous voulez, mais parfois utile :</p>

      <CodeBlock language="javascript">{codeSwitch2}</CodeBlock>

      <InfoBox type="danger">
        Oublier un <code>break</code> est l'un des bugs les plus fréquents avec <code>switch</code>. Si vous voulez du fall-through intentionnel, ajoutez un commentaire <code>// fall-through</code> pour que les autres développeurs (et vous dans 6 mois) comprennent que c'est voulu.
      </InfoBox>

      <h2>Object Lookup — L'alternative moderne au switch</h2>

      <p>Un objet JavaScript peut servir de <strong>table de correspondance</strong> (lookup table). C'est souvent plus élégant qu'un long <code>switch</code> quand les cas correspondent à des valeurs statiques.</p>

      <CodeBlock language="javascript">{codeLookup1}</CodeBlock>

      <CodeBlock language="javascript">{codeLookup2}</CodeBlock>

      <InfoBox type="tip">
        Règle pratique : utilisez <code>switch</code> quand les cas impliquent des <strong>blocs de code complexes</strong>, et l'object lookup quand chaque cas retourne simplement une <strong>valeur ou appelle une fonction</strong>.
      </InfoBox>

      <Challenge title="Défi : Calculatrice de tarifs">
        <p>Écrivez une fonction <code>calculerTarif(age, estMembre)</code> qui retourne le prix d'entrée selon ces règles :</p>
        <ul>
          <li>Moins de 6 ans : gratuit (0€)</li>
          <li>6-17 ans : 5€ (3€ si membre)</li>
          <li>18-64 ans : 12€ (9€ si membre)</li>
          <li>65 ans et plus : 8€ (6€ si membre)</li>
        </ul>
        <p>Utilisez les guard clauses et un object lookup pour les tarifs membres.</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 3,
  title: 'Conditions',
  icon: '🔀',
  level: 'Débutant',
  stars: '★★☆☆☆',
  component: Ch03Conditions,
  quiz: [
    {
      question: "Parmi ces valeurs, laquelle est TRUTHY en JavaScript ?",
      sub: "Concept truthy/falsy",
      options: ["0", '"" (chaîne vide)', "[] (tableau vide)", "null"],
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
    },
    {
      question: "Que retourne : false && console.log('exécuté') ?",
      sub: "Court-circuit avec && dans les conditions",
      options: [
        "console.log s'exécute et affiche 'exécuté'",
        "false — console.log n'est jamais appelé grâce au court-circuit",
        "undefined",
        "Une TypeError"
      ],
      correct: 1,
      explanation: "✅ Exact ! && évalue de gauche à droite et s'arrête dès qu'il trouve une valeur falsy. false étant falsy, la partie droite (console.log) n'est jamais évaluée. C'est le court-circuit : inutile d'aller plus loin si le résultat est déjà déterminé."
    },
    {
      question: "Comment vérifier proprement si une variable est un tableau ?",
      sub: "Vérification de type avec Array.isArray()",
      options: [
        "typeof [] === 'array'",
        "[] instanceof Array (toujours fiable)",
        "Array.isArray([])",
        "typeof [] === 'object'"
      ],
      correct: 2,
      explanation: "✅ Exact ! Array.isArray() est la méthode recommandée. typeof [] retourne 'object' (pas 'array'). instanceof peut échouer entre différents contextes (iframes). Array.isArray() fonctionne dans tous les cas."
    },
    {
      question: "Que signifie !!valeur en JavaScript ?",
      sub: "Double négation — conversion en booléen",
      options: [
        "Cela lève une SyntaxError",
        "Cela compare valeur à elle-même",
        "Cela convertit valeur en son équivalent booléen (true ou false)",
        "Cela inverse la valeur deux fois, ce qui ne change rien"
      ],
      correct: 2,
      explanation: "✅ Correct ! !!valeur est une conversion explicite en booléen. Le premier ! convertit en booléen inversé, le second ! réinverse. !!0 = false, !!'hello' = true, !!null = false. C'est équivalent à Boolean(valeur) mais plus court."
    },
    {
      question: "Avec l'optional chaining, que retourne user?.adresse?.ville si user est null ?",
      sub: "Optional chaining dans les conditions",
      options: [
        "Une TypeError : Cannot read properties of null",
        "null",
        "undefined",
        "false"
      ],
      correct: 2,
      explanation: "✅ Exact ! L'optional chaining ?. court-circuite dès qu'il rencontre null ou undefined et retourne undefined (pas null, pas une erreur). user?.adresse?.ville avec user = null retourne donc undefined sans lever d'exception."
    },
    {
      question: "Quel est le problème principal avec les ternaires imbriqués ?",
      sub: "Lisibilité du code conditionnel",
      options: [
        "Ils sont plus lents que les if/else",
        "Ils ne fonctionnent pas dans tous les navigateurs",
        "Ils sont illisibles et difficiles à maintenir — un if/else est préférable au-delà de 2 cas",
        "Ils ne peuvent pas retourner de valeurs complexes"
      ],
      correct: 2,
      explanation: "✅ Parfait ! a ? b ? c : d : e est légal mais extrêmement difficile à lire et à déboguer. Le ternaire est idéal pour un choix binaire simple ; dès qu'il y a plus de deux cas, un if/else ou un object lookup est bien plus lisible."
    }
  ]
};
