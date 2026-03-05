import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeDestruct1 = `// Déstructuration d'objet : cas de base
const user = { nom: "Alice", age: 30, ville: "Paris", role: "admin" };

// Avant ES6
const nom1  = user.nom;
const age1  = user.age;

// Avec déstructuration
const { nom, age } = user; // extrait nom et age

// Renommer à la volée : prop: nouveauNom
const { nom: prenom, age: annees } = user;
// prenom = "Alice", annees = 30

// Valeur par défaut si la propriété n'existe pas
const { theme = "light", langue = "fr" } = user;
// theme = "light" (user.theme est undefined)

// Ignorer des propriétés avec rest
const { role, ...profil } = user;
// role = "admin", profil = { nom, age, ville }`;

const codeDestruct2 = `// Déstructuration imbriquée
const config = {
  serveur: { host: "localhost", port: 3000 },
  db: { nom: "maDB", ssl: true }
};

const { serveur: { host, port }, db: { nom: nomDB } } = config;
// host = "localhost", port = 3000, nomDB = "maDB"

// Déstructuration de tableau
const [premier, deuxieme, , quatrieme, ...reste] = [10, 20, 30, 40, 50, 60];
// premier=10, deuxieme=20, (30 ignoré), quatrieme=40, reste=[50,60]

// Swap de variables sans variable temporaire !
let a = 1, b = 2;
[a, b] = [b, a];
// a = 2, b = 1`;

const codeDestruct3 = `// Déstructuration dans les paramètres de fonction
// Avant : function creerUser(options) { const nom = options.nom; ... }

function creerUser({ nom, age, role = "user", actif = true }) {
  return { nom, age, role, actif, createdAt: new Date() };
}

creerUser({ nom: "Bob", age: 25 });
// { nom:"Bob", age:25, role:"user", actif:true, createdAt:... }

// Très courant dans React
// function Button({ label, onClick, disabled = false }) {
//   return <button onClick={onClick} disabled={disabled}>{label}</button>;
// }`;

const codeSpreadRest = `// SPREAD — étaler
const arr1 = [1, 2, 3];
const arr2 = [4, 5];

// Dans un tableau
const fusionné = [...arr1, ...arr2, 6]; // [1,2,3,4,5,6]

// Dans un appel de fonction
Math.max(...arr1);  // Math.max(1, 2, 3) → 3

// Cloner/fusionner des objets
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 99, c: 3 };
const merged = { ...obj1, ...obj2 }; // { a:1, b:99, c:3 }
// b de obj2 écrase b de obj1

// REST — rassembler
function somme(premier, ...reste) {
  // reste est un vrai tableau
  return premier + reste.reduce((a, b) => a + b, 0);
}
somme(1, 2, 3, 4); // premier=1, reste=[2,3,4] → 10`;

const codeModules1 = `// math.js — exports nommés
export const PI = 3.14159;
export function carre(x) { return x ** 2; }
export function cube(x)   { return x ** 3; }

// Export par défaut — une seule valeur principale
export default function aire(r) { return PI * r ** 2; }

// main.js — imports
import aire from "./math.js";          // import par défaut
import { PI, carre } from "./math.js"; // imports nommés
import { cube as puissance3 } from "./math.js"; // renommer
import * as math from "./math.js";    // tout importer

aire(5);          // 78.53...
carre(4);        // 16
math.cube(3);    // 27`;

const codeModules2 = `// Import statique (en haut de fichier) — chargé immédiatement
import { carre } from "./math.js";

// Import dynamique — chargé seulement quand appelé
async function chargerModule() {
  const math = await import("./math.js");
  console.log(math.carre(5)); // 25
}

// Destructurer directement
const { carre, cube } = await import("./math.js");`;

const codeModules3 = `// Cas d'usage réels

// 1. Charger un module lourd seulement si nécessaire
async function exporterPDF() {
  const { genererPDF } = await import("./pdf-generator.js");
  return genererPDF(document);
}

// 2. Module conditionnel selon l'environnement
const utils = await import(
  isMobile() ? "./utils-mobile.js" : "./utils-desktop.js"
);

// 3. Lazy loading d'une route (React, Vue, etc.)
// const Dashboard = lazy(() => import('./Dashboard.jsx'));
// → le composant n'est téléchargé que quand l'utilisateur y navigue`;

const codeSymbol = `// Chaque Symbol est unique
const sym1 = Symbol("id");
const sym2 = Symbol("id");
sym1 === sym2; // false — toujours !

// Cas d'usage : clé de propriété non-collisionnelle
const ID = Symbol("userId");
const user = { nom: "Alice", [ID]: 42 };

user[ID];              // 42
user.nom;              // "Alice"
Object.keys(user);    // ["nom"] — Symbol invisible !
JSON.stringify(user); // '{"nom":"Alice"}' — Symbol ignoré

// Symbol.for : registre global (même Symbol partout)
const s1 = Symbol.for("app.id");
const s2 = Symbol.for("app.id");
s1 === s2; // true — registre global !`;

const codeMap = `// Map : clés de tout type, ordre garanti
const cache = new Map();

const cle1 = { id: 1 }; // objet comme clé !
cache.set(cle1, "données Alice");
cache.set("string-key", 42);
cache.set(123, true);

cache.get(cle1);     // "données Alice"
cache.has("string-key"); // true
cache.size;           // 3

// Itérer une Map
for (const [cle, valeur] of cache) {
  console.log(cle, "→", valeur);
}

// Avantages de Map vs objet simple :
// - Clés de tout type (pas seulement string/Symbol)
// - Pas de collision avec les propriétés héritées
// - .size natif (objet → Object.keys().length)
// - Performances meilleures pour ajouts/suppressions fréquents`;

const codeSet = `// Set : collection de valeurs UNIQUES
const vus = new Set();
vus.add(1); vus.add(2); vus.add(2); vus.add(3);
vus.size; // 3 (les doublons sont ignorés)

// Dédupliquer un tableau — façon moderne
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)]; // [1, 2, 3, 4]

// Opérations ensemblistes
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// Union
const union = new Set([...setA, ...setB]);  // {1,2,3,4,5,6}

// Intersection
const inter = new Set([...setA].filter(x => setB.has(x))); // {3,4}

// Différence (A - B)
const diff = new Set([...setA].filter(x => !setB.has(x))); // {1,2}`;

const codeOptChain = `const user = {
  profil: {
    avatar: "img.png",
    scores: [85, 92, 78]
  },
  greeting() { return "Bonjour !"; }
};

// Optional chaining sur propriétés
user?.profil?.avatar;          // "img.png"
user?.settings?.theme;        // undefined (pas d'erreur !)

// Sur des méthodes
user?.greeting();               // "Bonjour !"
user?.nonExistant();           // undefined (pas TypeError)

// Sur des indices de tableau
user?.profil?.scores?.[0];    // 85
user?.profil?.tags?.[0];      // undefined`;

const codeNullish = `// ?? vs || : la différence est CRUCIALE
const score = 0;  // valeur légitimement à 0

// ❌ || prend le fallback si score est FALSY (0 est falsy !)
const a = score || 100;  // 100 ← FAUX, 0 est une valeur valide !

// ✅ ?? prend le fallback seulement si null ou undefined
const b = score ?? 100;  // 0 ← correct !

// Combinaison ?. et ??
const theme = user?.settings?.theme ?? "dark";
// "dark" car user.settings n'existe pas

// Assignation nullish (??=)
let config = null;
config ??= { theme: "light" }; // assigne seulement si null/undefined
// config = { theme: "light" }

config ??= { theme: "dark" };  // ignoré car config n'est plus null
// config = { theme: "light" } (inchangé)`;

const codeChallenge = `const users = [
  { id: 1, nom: "Alice", ville: "Paris",     actif: true  },
  { id: 2, nom: "Bob",   ville: "Lyon",      actif: false },
  { id: 3, nom: "Clara", ville: "Paris",     actif: true  },
  { id: 4, nom: "David", ville: "Marseille", actif: true  },
];

// Map id → nom
const userMap = new Map(
  users.map(({ id, nom }) => [id, nom])
);
// Map { 1 => "Alice", 2 => "Bob", ... }
userMap.get(3); // "Clara"

// Set de villes uniques (actifs seulement)
const villesActifs = new Set(
  users
    .filter(({ actif }) => actif)
    .map(({ ville }) => ville)
);
// Set { "Paris", "Marseille" }`;

function Ch09Es6() {
  return (
    <>
      <div className="chapter-tag">Chapitre 09 · JavaScript Moderne</div>
      <h1>ES6+ &amp;<br /><span className="highlight">Fonctionnalités</span><br />Modernes</h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-advanced">⚡</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★☆</div>
          <h3>Destructuring, spread/rest, modules, Symbol, Map/Set, ?. et ??</h3>
          <p>Durée estimée : 30 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>ES6 (2015) a transformé JavaScript. Depuis, une nouvelle version sort chaque année. Ce chapitre couvre les fonctionnalités qui ont le plus grand impact sur la lisibilité et la robustesse du code au quotidien.</p>

      <h2>Déstructuration — Extraire avec élégance</h2>

      <p>La déstructuration permet d'extraire des valeurs d'objets et de tableaux en une seule expression. C'est du sucre syntaxique, mais il rend le code considérablement plus lisible.</p>

      <CodeBlock language="javascript">{codeDestruct1}</CodeBlock>

      <CodeBlock language="javascript">{codeDestruct2}</CodeBlock>

      <CodeBlock language="javascript">{codeDestruct3}</CodeBlock>

      <h2>Spread et Rest — La même syntaxe, deux contextes</h2>

      <p><code>...</code> est lu de manière opposée selon le contexte : <strong>spread</strong> "étale" une valeur (dans un appel, un tableau, un objet), <strong>rest</strong> "rassemble" des valeurs (dans une déstructuration, des paramètres).</p>

      <CodeBlock language="javascript">{codeSpreadRest}</CodeBlock>

      <h2>Modules ES — Pourquoi ils existent et comment les utiliser</h2>

      <p>Avant les modules, tout le code JS dans un navigateur partageait le même scope global — une catastrophe avec de grandes applications. Les modules ES créent un <strong>scope isolé</strong> par fichier et permettent d'exporter/importer explicitement ce qui est nécessaire.</p>

      <CodeBlock language="javascript">{codeModules1}</CodeBlock>

      <InfoBox type="tip">
        Différence clé : <strong>export default</strong> = une seule valeur principale par module, importée sans accolades et renommable librement. <strong>export nommé</strong> = plusieurs valeurs, importées avec accolades et le nom exact (ou avec <code>as</code>).
      </InfoBox>

      <h2>Dynamic Import — Charger un module à la demande</h2>

      <p>Les imports statiques (en haut de fichier) sont résolus au chargement. Le <strong>dynamic import</strong> — <code>import()</code> — est une fonction qui charge un module <em>à l'exécution</em>, quand on en a besoin. Elle retourne une Promise. C'est le mécanisme derrière le lazy loading et le code splitting (React, Vite, Webpack).</p>

      <CodeBlock language="javascript">{codeModules2}</CodeBlock>

      <CodeBlock language="javascript">{codeModules3}</CodeBlock>

      <InfoBox type="warning">
        Le dynamic import retourne une Promise — il faut donc <code>await</code> ou <code>.then()</code>. Le chemin passé en argument peut être une expression (variable, ternaire), contrairement aux imports statiques qui ne supportent que les chemins littéraux.
      </InfoBox>

      <h2>Symbol — Des clés vraiment uniques</h2>

      <p>Un <code>Symbol</code> est une valeur primitive unique et immuable. Contrairement aux chaînes ou nombres, deux Symbols sont toujours différents, même s'ils ont la même description.</p>

      <CodeBlock language="javascript">{codeSymbol}</CodeBlock>

      <h2>Map et Set — Quand les objets et tableaux ne suffisent pas</h2>

      <p><code>Map</code> est une collection de paires clé-valeur où <strong>les clés peuvent être de n'importe quel type</strong> (y compris des objets). <code>Set</code> est une collection de valeurs <strong>uniques</strong>. Ils sont plus adaptés que les objets/tableaux pour certains cas.</p>

      <CodeBlock language="javascript">{codeMap}</CodeBlock>

      <CodeBlock language="javascript">{codeSet}</CodeBlock>

      <h2>Optional Chaining ?. et Nullish Coalescing ?? — En profondeur</h2>

      <p><code>?.</code> court-circuite l'évaluation si la valeur à gauche est <code>null</code> ou <code>undefined</code>, retournant <code>undefined</code>. C'est différent de <code>||</code> qui court-circuite sur toute valeur <em>falsy</em>.</p>

      <CodeBlock language="javascript">{codeOptChain}</CodeBlock>

      <CodeBlock language="javascript">{codeNullish}</CodeBlock>

      <InfoBox type="warning">
        Mémorisez cette règle : utilisez <code>??</code> quand <code>0</code>, <code>""</code> ou <code>false</code> sont des valeurs valides. Utilisez <code>||</code> uniquement quand vous voulez vraiment rejeter toutes les valeurs falsy.
      </InfoBox>

      <Challenge title="Défi : Pipeline de données">
        <p>Avec une liste d'utilisateurs, construisez un Map qui associe chaque ID à son nom, et un Set de toutes les villes uniques des utilisateurs actifs. Utilisez la déstructuration dans les boucles.</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 9,
  title: 'ES6+ Moderne',
  icon: '⚡',
  level: 'Avancé',
  stars: '★★★★☆',
  component: Ch09Es6,
  quiz: [
    {
      question: "Quelle est la différence entre ?? et || pour les valeurs par défaut ?",
      sub: "Nullish Coalescing vs OR logique",
      options: [
        "?? est plus récent mais identique à ||",
        "|| utilise le fallback si la valeur est falsy (0, '', false inclus), ?? seulement si null ou undefined",
        "?? ne fonctionne que sur les objets",
        "|| est plus performant que ??"
      ],
      correct: 1,
      explanation: "✅ Exact ! C'est la différence cruciale. score || 100 retourne 100 même si score = 0 (car 0 est falsy). score ?? 100 retourne 0 car 0 n'est pas null ni undefined. Utilisez ?? quand 0, '' ou false sont des valeurs légitimes."
    },
    {
      question: "Pourquoi Map est-il préférable à un objet simple pour certains cas ?",
      sub: "Map vs objet JavaScript",
      options: [
        "Map consomme moins de mémoire",
        "Map permet d'utiliser n'importe quel type comme clé, a une taille native (.size), et évite les collisions avec Object.prototype",
        "Map supporte les méthodes .map() et .filter()",
        "Map est plus rapide que les objets dans tous les cas"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Map offre trois avantages concrets : les clés peuvent être des objets (pas seulement des strings), .size donne la taille directement, et il n'y a pas de risque de collision avec des propriétés héritées comme 'constructor' ou 'toString'."
    },
    {
      question: "En déstructuration d'objet, que signifie { nom: prenom } ?",
      sub: "Renommage en déstructuration",
      options: [
        "Extraire nom et l'appeler aussi nom, avec prenom comme alias ignoré",
        "Créer un objet avec les propriétés nom et prenom",
        "Extraire la propriété nom de l'objet et la stocker dans une variable nommée prenom",
        "Cela cause une SyntaxError"
      ],
      correct: 2,
      explanation: "✅ Exact ! La syntaxe { source: destination } en déstructuration signifie : prends la propriété 'source' de l'objet et mets-la dans une variable locale nommée 'destination'. Ici, on extrait obj.nom dans une variable prenom."
    }
  ]
};
