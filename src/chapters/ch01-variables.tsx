import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const CODE_BASICS = `// const : une boîte scellée — la valeur ne change pas
const PI = 3.14159;
// PI = 3; ❌ TypeError: Assignment to constant variable

// let : une boîte normale — on peut changer son contenu
let score = 0;
score = 100; // ✅ OK
score += 50; // score vaut maintenant 150

// var : l'ancienne façon — à éviter (on verra pourquoi)
var ancien = "danger";`;

const CODE_SCOPE = `// Portée de bloc avec let/const
{
  let message = "je suis dans le bloc";
  console.log(message); // ✅ "je suis dans le bloc"
}
// console.log(message); ❌ ReferenceError : message n'existe plus

// Problème classique avec var
for (var i = 0; i < 3; i++) { /* ... */ }
console.log(i); // ⚠️ 3 — i "s'échappe" du bloc !

// Avec let : comportement attendu
for (let j = 0; j < 3; j++) { /* ... */ }
// console.log(j); ❌ ReferenceError — j est mort à la fin du for`;

const CODE_HOISTING = `// Avec var : la variable existe mais vaut undefined
console.log(nom); // undefined (pas d'erreur — var est hoistée)
var nom = "Alice";
console.log(nom); // "Alice"

// Ce que JS fait en réalité (mentalement) :
var nom;           // déclaration remontée → undefined
console.log(nom); // undefined
nom = "Alice";     // l'assignation reste en place

// Avec let/const : Zone Morte Temporelle (TDZ)
// console.log(age); ❌ ReferenceError : Cannot access before initialization
let age = 25;
console.log(age); // ✅ 25`;

const CODE_TYPEOF = `// typeof : connaître le type d'une valeur
console.log(typeof "hello");      // "string"
console.log(typeof 42);           // "number"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object" ← bug historique de JS !
console.log(typeof {});           // "object"
console.log(typeof function(){}); // "function"`;

const CODE_NULL_UNDEFINED = `let utilisateur;          // undefined — pas encore chargé
utilisateur = null;       // null — intentionnellement vide (ex: déconnecté)

// Comparaison == (lâche) vs === (stricte)
console.log(null ==  undefined); // true  — JavaScript les "égalise" avec ==
console.log(null === undefined); // false — types différents avec ===

// Dans la pratique : toujours utiliser ===
if (utilisateur === null) {
  console.log("Utilisateur déconnecté");
}`;

const CODE_NAN = `const resultat = 0 / 0;        // NaN
const invalide = parseInt("abc"); // NaN

// Le piège classique
console.log(resultat === resultat); // false ← NaN n'est JAMAIS égal à lui-même !

// La bonne façon de vérifier
console.log(Number.isNaN(resultat));  // true ✅
console.log(isNaN("hello"));          // true ⚠️ isNaN() convertit d'abord en Number
console.log(Number.isNaN("hello"));   // false ✅ Number.isNaN() est plus strict`;

const CODE_COERCION = `// L'opérateur + est ambigu : addition OU concaténation
console.log(1 + "2");       // "12" — number converti en string
console.log("5" - 2);       // 3   — string converti en number
console.log(true + true);   // 2   — true vaut 1
console.log(false + 1);     // 1   — false vaut 0

// Valeurs "falsy" : converties en false dans un contexte booléen
// false, 0, "", null, undefined, NaN
if (0)    { /* jamais exécuté */ }
if ("")   { /* jamais exécuté */ }
if (null) { /* jamais exécuté */ }

// Valeurs "truthy" : tout le reste
if ("0")  { /* exécuté ! "0" est une string non-vide */ }
if ([])   { /* exécuté ! un tableau vide est truthy */ }

// Conversion explicite (préférable)
Number("42");     // 42
String(42);       // "42"
Boolean(0);       // false
Boolean("hello"); // true`;

const CODE_TEMPLATE = `const prenom = "Alice";
const age = 25;

// Concaténation classique — difficile à lire
"Bonjour " + prenom + ", tu as " + age + " ans.";

// Template literal — beaucoup plus lisible
\`Bonjour \${prenom}, tu as \${age} ans.\`;

// On peut mettre n'importe quelle expression dans \${ }
\`Dans 10 ans tu auras \${age + 10} ans.\`;
\`Tu es \${age >= 18 ? "majeur" : "mineur"}.\`;

// Multilignes : les sauts de ligne sont préservés
const html = \`
  <div class="carte">
    <h2>\${prenom}</h2>
    <p>Âge : \${age}</p>
  </div>
\`;`;

function Ch01Variables() {
  return (
    <>
      <div className="chapter-tag">Chapitre 01 · Les Bases</div>
      <h1>Variables<br />& <span className="highlight">Types</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-beginner">📦</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★☆☆☆☆</div>
          <h3>Variables & Types de données</h3>
          <p>Durée estimée : 25 min · 3 quizz inclus</p>
        </div>
      </div>

      <h2>Qu'est-ce qu'une variable ?</h2>
      <p>
        Imagine une variable comme une <strong>boîte étiquetée</strong> dans la mémoire de ton ordinateur. La boîte a un nom (l'étiquette), et elle contient une valeur. À tout moment, tu peux regarder ce qu'il y a dedans, ou remplacer son contenu.
      </p>
      <p>
        En JavaScript, tu as <strong>trois mots-clés</strong> pour créer une boîte : <code>var</code>, <code>let</code> et <code>const</code>. Ils ont des comportements très différents — comprendre ces différences est fondamental.
      </p>
      <CodeBlock language="javascript">{CODE_BASICS}</CodeBlock>

      <InfoBox type="tip">
        <strong>Règle d'or :</strong> utilise toujours <code>const</code> par défaut. Passe à <code>let</code> uniquement si tu sais que la valeur va changer. N'utilise jamais <code>var</code> dans du code moderne.
      </InfoBox>

      <h2>La portée (scope) — où vit ta variable ?</h2>
      <p>
        La portée définit <strong>où dans le code</strong> une variable est accessible. C'est l'une des sources de bugs les plus fréquentes pour les débutants.
      </p>
      <p>
        <code>let</code> et <code>const</code> ont une portée de <strong>bloc</strong> — elles n'existent qu'à l'intérieur des accolades <code>{'{}'}</code> qui les contiennent. <code>var</code> a une portée de <strong>fonction</strong>, ce qui est moins prévisible.
      </p>
      <CodeBlock language="javascript">{CODE_SCOPE}</CodeBlock>

      <h2>Le Hoisting — les variables "remontent"</h2>
      <p>
        JavaScript a un comportement déroutant appelé <strong>hoisting</strong> (levage) : avant d'exécuter ton code, le moteur JS lit toutes les déclarations et les "remonte" en haut de leur portée. Mais attention — seule la <em>déclaration</em> remonte, pas la <em>valeur</em>.
      </p>
      <CodeBlock language="javascript">{CODE_HOISTING}</CodeBlock>

      <InfoBox type="warning">
        La <strong>Zone Morte Temporelle (TDZ)</strong> est la zone entre le début du bloc et la ligne de déclaration d'un <code>let</code>/<code>const</code>. Accéder à la variable dans cette zone lance une <code>ReferenceError</code> — c'est un comportement <em>voulu</em> qui te protège des bugs.
      </InfoBox>

      <h2>Les types de données</h2>
      <p>
        En JavaScript, <strong>chaque valeur a un type</strong>. Il y a 7 types primitifs (immuables, copiés par valeur) et 1 type objet (copié par référence).
      </p>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Type</th><th>Exemple</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>string</code></td><td><code>"Bonjour"</code></td><td>Du texte, délimité par <code>""</code>, <code>''</code> ou <code>{"`"}</code></td></tr>
            <tr><td><code>number</code></td><td><code>42, 3.14, NaN, Infinity</code></td><td>Entier ET décimal — JS n'a qu'un seul type numérique</td></tr>
            <tr><td><code>boolean</code></td><td><code>true, false</code></td><td>Vrai ou faux — résultat d'une comparaison</td></tr>
            <tr><td><code>null</code></td><td><code>null</code></td><td>Absence de valeur <em>intentionnelle</em></td></tr>
            <tr><td><code>undefined</code></td><td><code>undefined</code></td><td>Variable déclarée mais non initialisée</td></tr>
            <tr><td><code>bigint</code></td><td><code>9007199254740991n</code></td><td>Entiers arbitrairement grands (suffixe <code>n</code>)</td></tr>
            <tr><td><code>symbol</code></td><td><code>Symbol("id")</code></td><td>Identifiant unique et immuable</td></tr>
            <tr><td><code>object</code></td><td><code>{'{}'}, [], function</code></td><td>Données complexes — copié par référence</td></tr>
          </tbody>
        </table>
      </div>

      <CodeBlock language="javascript">{CODE_TYPEOF}</CodeBlock>

      <h2>null vs undefined — la nuance importante</h2>
      <p>Ces deux valeurs sont souvent confondues mais représentent des concepts différents :</p>
      <ul style={{ color: '#a0a0c0', lineHeight: 2, paddingLeft: '20px', fontSize: '15px', marginBottom: '16px' }}>
        <li><code>undefined</code> = JavaScript dit "cette variable existe, mais je ne sais pas sa valeur"</li>
        <li><code>null</code> = le développeur dit "cette variable existe, et intentionnellement elle ne contient rien"</li>
      </ul>
      <CodeBlock language="javascript">{CODE_NULL_UNDEFINED}</CodeBlock>

      <h2>NaN — Not a Number</h2>
      <p>
        <code>NaN</code> est une valeur spéciale de type <code>number</code> qui représente le résultat d'une opération mathématique invalide. Son comportement est piégeux.
      </p>
      <CodeBlock language="javascript">{CODE_NAN}</CodeBlock>

      <h2>La coercition de types — attention aux surprises</h2>
      <p>
        JavaScript <strong>convertit automatiquement</strong> les types dans certaines situations. C'est la coercition implicite. Elle peut produire des résultats surprenants si tu ne la comprends pas.
      </p>
      <CodeBlock language="javascript">{CODE_COERCION}</CodeBlock>

      <InfoBox type="danger">
        Toujours utiliser <code>===</code> (égalité stricte) plutôt que <code>==</code> (égalité lâche avec coercition). <code>"1" == 1</code> est <code>true</code> en JS — ce genre de comparaison est une source de bugs.
      </InfoBox>

      <h2>Template literals — les strings modernes</h2>
      <p>
        Les template literals utilisent les backticks (<code>`</code>) au lieu des guillemets. Ils permettent d'<strong>insérer des expressions directement</strong> dans une chaîne et d'écrire du texte sur plusieurs lignes.
      </p>
      <CodeBlock language="javascript">{CODE_TEMPLATE}</CodeBlock>

      <Challenge title="Défi personnel à réaliser">
        <p style={{ color: '#a0a0c0', fontSize: '14px' }}>
          Déclare une variable <code>nom</code> avec ton prénom, une variable <code>annee</code> avec ton année de naissance (2024 - ton âge), et affiche dans la console : <strong>"Bonjour [nom], tu es né en [annee] et tu as [age] ans."</strong> en utilisant un template literal et en calculant l'âge dynamiquement.
        </p>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 1,
  title: 'Variables & Types',
  icon: '📦',
  level: 'Débutant',
  stars: '★☆☆☆☆',
  component: Ch01Variables,
  quiz: [
    {
      question: "Pourquoi préfère-t-on let et const à var ?",
      sub: "Portée et comportement des variables",
      options: [
        "var est plus lent à l'exécution",
        "let/const ont une portée de bloc prévisible et évitent les bugs de hoisting/TDZ",
        "var ne fonctionne pas dans les navigateurs modernes",
        "let et const sont plus courts à écrire"
      ],
      correct: 1,
      explanation: "✅ Exact ! let/const sont limités au bloc {} qui les contient, ce qui évite les 'fuites' de variables. Ils ont aussi la TDZ qui protège contre l'utilisation avant déclaration — un bug fréquent avec var."
    },
    {
      question: "Que retourne typeof null en JavaScript ?",
      sub: "Un cas historique de JS",
      options: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correct: 2,
      explanation: "✅ Surprenant mais vrai ! typeof null retourne \"object\" — c'est un bug dans les tout premiers jours de JavaScript (1995) qui n'a jamais été corrigé pour ne pas casser l'existant."
    },
    {
      question: "Quelle est la valeur de : console.log(1 + '2') ?",
      sub: "Coercition de types en JavaScript",
      options: ["3", '"12"', '"3"', "NaN"],
      correct: 1,
      explanation: "✅ C'est '12' (string) ! Quand + rencontre un string et un number, il convertit le number en string et les concatène. Pour additionner, utilise Number('2') d'abord : 1 + Number('2') = 3."
    },
    {
      question: "Que retourne typeof function(){} en JavaScript ?",
      sub: "L'opérateur typeof",
      options: ['"object"', '"function"', '"callable"', '"undefined"'],
      correct: 1,
      explanation: "✅ Exact ! typeof retourne \"function\" pour les fonctions, même si techniquement les fonctions sont des objets en JavaScript. C'est l'une des rares exceptions où typeof ne retourne pas \"object\" pour un type non-primitif."
    },
    {
      question: "Quelle est la différence entre number et bigint en JavaScript ?",
      sub: "Types numériques",
      options: [
        "bigint est un alias de number, il n'y a aucune différence",
        "number peut représenter des décimaux, bigint uniquement des entiers arbitrairement grands",
        "bigint est plus rapide que number pour les calculs",
        "number est limité à 100 chiffres, bigint est illimité"
      ],
      correct: 1,
      explanation: "✅ Exact ! number couvre les entiers ET les décimaux, mais est limité à 2^53-1 pour les entiers exacts. bigint (suffixe n : 9007199254740992n) représente des entiers arbitrairement grands, sans limite de taille, mais sans décimaux."
    },
    {
      question: "Que se passe-t-il si on exécute : const obj = { a: 1 }; obj.a = 2; ?",
      sub: "const avec les objets",
      options: [
        "Une TypeError est levée car obj est déclaré avec const",
        "obj.a vaut maintenant 2 — const n'empêche pas la mutation des propriétés",
        "obj.a reste 1 — les propriétés sont figées automatiquement",
        "Le code ne compile pas"
      ],
      correct: 1,
      explanation: "✅ Correct ! const empêche la réassignation de la variable (obj = {} lancerait une TypeError), mais les propriétés de l'objet restent modifiables. Pour figer un objet, utilise Object.freeze(obj)."
    },
    {
      question: "Deux Symbols créés avec la même description sont-ils égaux ?",
      sub: "Unicité des Symbols",
      options: [
        "Oui, Symbol('id') === Symbol('id') vaut true",
        "Non, chaque Symbol() est unique — Symbol('id') === Symbol('id') vaut false",
        "Cela dépend de si la description est une string ou un number",
        "Oui, mais seulement avec l'égalité lâche =="
      ],
      correct: 1,
      explanation: "✅ Parfait ! Chaque appel à Symbol() crée une valeur unique et immuable, même si la description est identique. Symbol('id') === Symbol('id') retourne false. C'est précisément l'intérêt des Symbols : garantir des identifiants uniques."
    },
    {
      question: "Que vaut : `Résultat : ${2 + 3 * 4}` ?",
      sub: "Expressions dans les template literals",
      options: [
        '"Résultat : 20"',
        '"Résultat : 14"',
        '"Résultat : 2+3*4"',
        "Une SyntaxError"
      ],
      correct: 1,
      explanation: "✅ Exact ! À l'intérieur de ${}, n'importe quelle expression JavaScript est évaluée — y compris avec les règles de précédence. 3 * 4 = 12, puis 2 + 12 = 14. Le template literal produit donc la string \"Résultat : 14\"."
    }
  ]
};
