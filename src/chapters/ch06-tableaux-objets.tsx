import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeRef = `// ❌ Ce n'est PAS une copie — c'est un alias !
const arr1 = [1, 2, 3];
const arr2 = arr1; // arr2 pointe vers le MÊME tableau

arr2.push(4);
console.log(arr1); // [1, 2, 3, 4] ← arr1 a changé !
console.log(arr1 === arr2); // true (même référence)

// ✅ Copie superficielle (shallow copy)
const arr3 = [...arr1];   // spread
const arr4 = arr1.slice(); // slice sans arguments
const arr5 = Array.from(arr1); // Array.from

arr3.push(99);
console.log(arr1); // [1, 2, 3, 4] — inchangé !
console.log(arr3); // [1, 2, 3, 4, 99]`;

const codeDeepCopy = `// Piège de la copie superficielle avec objets imbriqués
const original = { nom: "Alice", adresse: { ville: "Paris" } };
const copie = { ...original }; // copie superficielle

copie.adresse.ville = "Lyon"; // modifie l'objet PARTAGÉ
console.log(original.adresse.ville); // "Lyon" ← bug !

// ✅ Copie profonde avec structuredClone (moderne)
const vrai_clone = structuredClone(original);
vrai_clone.adresse.ville = "Marseille";
console.log(original.adresse.ville); // "Lyon" ← inchangé ✓`;

const codeMutation = `const nombres = [3, 1, 4, 1, 5];

// Méthodes MUTANTES (modifient le tableau original)
nombres.push(9);    // ajoute à la fin       → mute
nombres.pop();       // retire le dernier     → mute
nombres.shift();     // retire le premier     → mute
nombres.unshift(0); // ajoute au début       → mute
nombres.sort();      // trie en place         → mute
nombres.reverse();  // inverse en place      → mute
nombres.splice(1, 2); // retire/insère       → mute

// Méthodes IMMUTABLES (retournent un nouveau tableau)
const a = nombres.map(x => x * 2);    // nouveau tableau
const b = nombres.filter(x => x > 3); // nouveau tableau
const c = nombres.slice(1, 3);        // nouveau tableau
const d = [...nombres].sort();        // copier puis trier !`;

const codeMapFilter = `const produits = [
  { nom: "Stylo",   prix: 2,  qte: 10 },
  { nom: "Cahier",  prix: 5,  qte: 3  },
  { nom: "Règle",   prix: 3,  qte: 7  },
];

// map : transforme chaque élément → nouveau tableau de MÊME longueur
const noms = produits.map(p => p.nom);
// ["Stylo", "Cahier", "Règle"]

const avecTotal = produits.map(p => ({ ...p, total: p.prix * p.qte }));
// [{nom:"Stylo",prix:2,qte:10,total:20}, ...]

// filter : garde les éléments qui satisfont la condition
const chers = produits.filter(p => p.prix > 2);
// [{nom:"Cahier",...}, {nom:"Règle",...}]

// Chaîner map et filter
const nomsChers = produits
  .filter(p => p.prix > 2)
  .map(p => p.nom);
// ["Cahier", "Règle"]`;

const codeReduce = `// reduce : accumule une valeur — le couteau suisse !
// reduce(callback, valeurInitiale)
// callback(accumulateur, elementCourant) → nouvel accumulateur

const nombres = [1, 2, 3, 4, 5];

// Étape par étape :
// acc=0, n=1 → 0+1 = 1
// acc=1, n=2 → 1+2 = 3
// acc=3, n=3 → 3+3 = 6
// acc=6, n=4 → 6+4 = 10
// acc=10,n=5 → 10+5= 15  ← résultat final
const somme = nombres.reduce((acc, n) => acc + n, 0);
// 15

// reduce pour construire un objet
const inventaire = produits.reduce((acc, p) => {
  acc[p.nom] = p.qte;
  return acc;
}, {});
// { Stylo: 10, Cahier: 3, Règle: 7 }

// reduce pour calculer le total du panier
const totalPanier = produits.reduce((acc, p) => acc + p.prix * p.qte, 0);
// 2*10 + 5*3 + 3*7 = 20 + 15 + 21 = 56`;

const codeSort = `// ❌ Piège : sort par défaut = tri lexicographique
[10, 9, 2, 21, 100].sort();
// [10, 100, 2, 21, 9] — "10" < "2" lexicographiquement !

// ✅ Tri numérique avec comparateur
[10, 9, 2, 21, 100].sort((a, b) => a - b);
// [2, 9, 10, 21, 100] ✓ (a-b: positif → b avant a)

[10, 9, 2, 21, 100].sort((a, b) => b - a);
// [100, 21, 10, 9, 2] — ordre décroissant

// Trier des objets par propriété
const users = [
  { nom: "Charlie", age: 30 },
  { nom: "Alice",   age: 25 },
  { nom: "Bob",     age: 35 },
];

// Par age
[...users].sort((a, b) => a.age - b.age);

// Par nom (alphabétique, accents inclus)
[...users].sort((a, b) => a.nom.localeCompare(b.nom));`;

const codeFindSome = `const users = [
  { id: 1, nom: "Alice", actif: true  },
  { id: 2, nom: "Bob",   actif: false },
  { id: 3, nom: "Clara", actif: true  },
];

// find : premier élément qui correspond (ou undefined)
users.find(u => u.id === 2);       // {id:2, nom:"Bob"...}

// findIndex : index du premier correspondant (ou -1)
users.findIndex(u => u.id === 2); // 1

// some : au moins UN satisfait ?
users.some(u => u.actif);   // true (Alice est active)

// every : TOUS satisfont ?
users.every(u => u.actif);  // false (Bob est inactif)

// flat : aplatit les tableaux imbriqués
[1, [2, 3], [4, [5, 6]]].flat();    // [1, 2, 3, 4, [5, 6]]
[1, [2, 3], [4, [5, 6]]].flat(Infinity); // [1, 2, 3, 4, 5, 6]

// flatMap : map puis flat (très utile)
["Bonjour monde", "Hello world"]
  .flatMap(s => s.split(" "));
// ["Bonjour", "monde", "Hello", "world"]`;

const codeObjets1 = `const config = { theme: "dark", langue: "fr", version: 2 };

// Notation pointée vs crochet
config.theme;          // "dark"   (clé littérale connue)
config["theme"];       // "dark"   (identique)

const cle = "langue";
config[cle];           // "fr"    (clé dynamique — variable)

// Propriétés calculées (computed properties)
const champ = "nom";
const user = { [champ]: "Alice", age: 30 };
// { nom: "Alice", age: 30 }

// Object.freeze : rend un objet immuable
const CONSTANTES = Object.freeze({
  PI:    3.14159,
  E:     2.71828,
  MAX:   1000
});
CONSTANTES.PI = 99; // silencieusement ignoré (strict mode: TypeError)
console.log(CONSTANTES.PI); // 3.14159`;

const codeObjets2 = `// Object.assign vs spread : fusionner des objets
const defauts     = { theme: "light", taille: 14, langue: "fr" };
const preferences = { theme: "dark", notifications: true };

// Object.assign mute le premier argument
const config1 = Object.assign({}, defauts, preferences);

// Spread : plus lisible, immuable
const config2 = { ...defauts, ...preferences };
// { theme: "dark", taille: 14, langue: "fr", notifications: true }
// Les propriétés de droite écrasent celles de gauche

// Récupérer clés, valeurs, entrées
Object.keys(config2);    // ["theme", "taille", "langue", "notifications"]
Object.values(config2);  // ["dark", 14, "fr", true]
Object.entries(config2); // [["theme","dark"], ["taille",14], ...]

// Transformer un objet avec entries + fromEntries
const majuscules = Object.fromEntries(
  Object.entries(config2).map(([k, v]) => [k.toUpperCase(), v])
);
// { THEME: "dark", TAILLE: 14, ... }`;

const codeES2022 = `// at() — accès avec index négatif (ES2022)
const fruits = ["pomme", "banane", "cerise"];

// Avant : fruits[fruits.length - 1] — verbeux
fruits.at(-1);  // "cerise" (dernier élément)
fruits.at(-2);  // "banane"
fruits.at(0);   // "pomme" (fonctionne aussi en positif)

// Fonctionne aussi sur les strings
"Bonjour".at(-1); // "r"`;

const codeES2023 = `// with() — remplacer un élément SANS muter (ES2023)
const scores = [10, 20, 30, 40];

// ❌ Mutation classique
scores[2] = 99; // modifie le tableau original

// ✅ with() : retourne un NOUVEAU tableau
const nouveauScores = scores.with(2, 99);
// nouveauScores = [10, 20, 99, 40]

// Fonctionne aussi avec index négatif
const scores2 = [10, 20, 30];
scores2.with(-1, 99); // [10, 20, 99]`;

const codeHasOwn = `// Object.hasOwn() — remplacement moderne de hasOwnProperty (ES2022)
const user = { nom: "Alice", age: 30 };

// ❌ hasOwnProperty : peut être écrasé, verbeux
user.hasOwnProperty("nom");  // true (mais fragile)

// ✅ Object.hasOwn() : méthode statique, toujours fiable
Object.hasOwn(user, "nom");    // true
Object.hasOwn(user, "email");  // false
Object.hasOwn(user, "toString"); // false (hérité du prototype)

// Cas d'usage : filtrer les propriétés propres d'un objet
const propres = Object.keys(user).filter(k => Object.hasOwn(user, k));
// ["nom", "age"]`;

const codeChallenge = `const transactions = [
  { type: "achat", categorie: "tech",  montant: 299 },
  { type: "achat", categorie: "livre", montant: 25  },
  { type: "vente", categorie: "tech",  montant: 150 },
  { type: "achat", categorie: "tech",  montant: 89  },
  { type: "achat", categorie: "livre", montant: 40  },
];

// Total des achats
const totalAchats = transactions
  .filter(t => t.type === "achat")
  .reduce((acc, t) => acc + t.montant, 0);
// 453

// Max par catégorie
const maxParCat = transactions.reduce((acc, t) => {
  acc[t.categorie] = Math.max(acc[t.categorie] || 0, t.montant);
  return acc;
}, {});
// { tech: 299, livre: 40 }`;

function Ch06TableauxObjets() {
  return (
    <>
      <div className="chapter-tag">Chapitre 06 · Structures de données</div>
      <h1>Tableaux &amp;<br /><span className="highlight">Objets</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-intermediate">🗂️</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★☆☆</div>
          <h3>Référence vs copie, mutation, map/filter/reduce, sort, objets avancés</h3>
          <p>Durée estimée : 35 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Les tableaux et objets sont les structures de données fondamentales de JavaScript. Mais ils se comportent différemment des types primitifs (nombres, chaînes). Comprendre la différence entre <strong>valeur</strong> et <strong>référence</strong> est essentiel pour éviter des bugs très difficiles à détecter.</p>

      <h2>Le piège de la référence — const ne protège pas vos données</h2>

      <p>En JavaScript, les objets et tableaux sont passés <strong>par référence</strong>. Quand vous assignez un tableau à une variable, vous ne copiez pas les données — vous copiez <em>l'adresse</em> en mémoire. <code>const</code> empêche de réassigner la variable, mais pas de modifier ce qu'elle pointe.</p>

      <CodeBlock language="javascript">{codeRef}</CodeBlock>

      <InfoBox type="danger">
        Les copies <strong>superficielles</strong> (spread, slice) ne copient qu'un niveau. Si votre tableau contient des objets, les objets imbriqués sont toujours partagés par référence ! Utilisez <code>structuredClone()</code> pour une copie profonde.
      </InfoBox>

      <CodeBlock language="javascript">{codeDeepCopy}</CodeBlock>

      <h2>Mutation vs Immutabilité — Méthodes qui mutent vs méthodes qui retournent</h2>

      <p>Certaines méthodes de tableau <strong>modifient le tableau en place</strong> (mutation), d'autres retournent un <strong>nouveau tableau</strong> sans toucher à l'original. Savoir lesquelles est crucial.</p>

      <CodeBlock language="javascript">{codeMutation}</CodeBlock>

      <h2>map, filter, reduce — La triade des méthodes fonctionnelles</h2>

      <p>Ces trois méthodes couvrent la grande majorité des transformations de données. Comprendre <code>reduce</code> en particulier est un rite de passage — c'est la plus puissante mais aussi la plus confusante.</p>

      <CodeBlock language="javascript">{codeMapFilter}</CodeBlock>

      <CodeBlock language="javascript">{codeReduce}</CodeBlock>

      <h2>sort — Le piège de comparaison par défaut</h2>

      <p>Le comportement par défaut de <code>.sort()</code> est contre-intuitif : il convertit tous les éléments en <strong>chaînes</strong> et les compare en ordre lexicographique (comme un dictionnaire). Pour des nombres, c'est un désastre.</p>

      <CodeBlock language="javascript">{codeSort}</CodeBlock>

      <h2>find, findIndex, some, every, flat</h2>

      <CodeBlock language="javascript">{codeFindSome}</CodeBlock>

      <h2>Objets — Accès, propriétés calculées, et immutabilité</h2>

      <CodeBlock language="javascript">{codeObjets1}</CodeBlock>

      <CodeBlock language="javascript">{codeObjets2}</CodeBlock>

      <InfoBox type="tip">
        <code>Object.entries()</code> + <code>Object.fromEntries()</code> est le pattern pour transformer les propriétés d'un objet de façon immutable — l'équivalent de <code>.map()</code> pour les tableaux, mais pour les objets.
      </InfoBox>

      <h2>Méthodes récentes — ES2022 / ES2023</h2>

      <p>Ces méthodes sont désormais disponibles dans tous les navigateurs modernes et Node.js 18+. Elles comblent des manques gênants et méritent d'être connues.</p>

      <CodeBlock language="javascript">{codeES2022}</CodeBlock>

      <CodeBlock language="javascript">{codeES2023}</CodeBlock>

      <CodeBlock language="javascript">{codeHasOwn}</CodeBlock>

      <InfoBox type="tip">
        Ces trois méthodes sont conçues pour écrire du code <strong>immutable et défensif</strong>. <code>at()</code> évite les erreurs d'index hors-limites sur les indices négatifs, <code>with()</code> permet des mises à jour sans mutation, et <code>Object.hasOwn()</code> ne peut pas être écrasé par accident.
      </InfoBox>

      <Challenge title="Défi : Agrégateur de données">
        <p>Vous avez une liste de transactions. Calculez : le total des achats, le nombre de ventes par catégorie, et la transaction la plus élevée par catégorie.</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 6,
  title: 'Tableaux & Objets',
  icon: '🗂️',
  level: 'Intermédiaire',
  stars: '★★★☆☆',
  component: Ch06TableauxObjets,
  quiz: [
    {
      question: "Quel est le résultat de [10, 9, 2, 100].sort() en JavaScript ?",
      sub: "Comportement du tri par défaut",
      options: [
        "[2, 9, 10, 100]",
        "[100, 10, 9, 2]",
        "[10, 100, 2, 9]",
        "Une erreur est lancée"
      ],
      correct: 2,
      explanation: "✅ Exact ! Par défaut, .sort() convertit les éléments en strings et les compare lexicographiquement. '10' < '100' < '2' < '9' car le tri compare caractère par caractère. Pour un tri numérique, utilisez .sort((a, b) => a - b)."
    },
    {
      question: "Quelle méthode crée une VRAIE copie profonde d'un objet imbriqué ?",
      sub: "Copie vs référence",
      options: [
        "{ ...objet }",
        "Object.assign({}, objet)",
        "objet.slice()",
        "structuredClone(objet)"
      ],
      correct: 3,
      explanation: "✅ Parfait ! structuredClone() (ES2022) est la seule méthode native qui crée une copie profonde récursive. Le spread {...} et Object.assign() font des copies superficielles : les objets imbriqués sont encore partagés par référence."
    },
    {
      question: "Quelle est la différence entre .find() et .filter() ?",
      sub: "Méthodes de recherche dans les tableaux",
      options: [
        "find est plus rapide, filter est plus précis",
        "find retourne le premier élément correspondant (ou undefined), filter retourne un nouveau tableau de TOUS les éléments correspondants",
        "filter s'arrête au premier match, find continue",
        "Il n'y a pas de différence"
      ],
      correct: 1,
      explanation: "✅ Exact ! .find() retourne la valeur du premier élément qui satisfait la condition et s'arrête (court-circuit). .filter() parcourt tout le tableau et retourne un nouveau tableau avec TOUS les éléments satisfaisant la condition."
    },
    {
      question: "Que vaut const [a, b = 10] = [5] après cette déstructuration ?",
      sub: "Déstructuration de tableau avec valeur par défaut",
      options: [
        "a = 5, b = undefined",
        "a = 5, b = 10",
        "a = undefined, b = 10",
        "Une erreur est lancée car le tableau n'a qu'un élément"
      ],
      correct: 1,
      explanation: "✅ Exact ! Lors de la déstructuration de tableau, une valeur par défaut (= 10) est utilisée uniquement si l'élément correspondant est undefined. Ici le tableau [5] a un premier élément (5) mais pas de deuxième, donc b prend la valeur par défaut 10."
    },
    {
      question: "Quelle est la différence entre Object.assign({}, a, b) et { ...a, ...b } ?",
      sub: "Object.assign vs spread pour fusionner des objets",
      options: [
        "Aucune différence, ils sont totalement équivalents",
        "Object.assign() mute le premier argument, le spread crée toujours un nouvel objet sans mutation",
        "Le spread est plus lent que Object.assign()",
        "Object.assign() copie en profondeur, le spread ne copie qu'un niveau"
      ],
      correct: 1,
      explanation: "✅ Correct ! Object.assign(cible, ...) modifie et retourne l'objet cible — si la cible est un objet existant, il est muté. Avec { ...a, ...b }, un nouvel objet est toujours créé. Les deux font une copie superficielle (un seul niveau), mais Object.assign peut être dangereux si on oublie le {} vide comme premier argument."
    },
    {
      question: "Que fait Array.from({ length: 3 }, (_, i) => i * 2) ?",
      sub: "Array.from() avec une fonction de mapping",
      options: [
        "Retourne un tableau vide",
        "Lance une erreur car { length: 3 } n'est pas un tableau",
        "Retourne [0, 2, 4]",
        "Retourne [0, 1, 2]"
      ],
      correct: 2,
      explanation: "✅ Exact ! Array.from() accepte tout objet array-like (avec une propriété length) et un deuxième argument optionnel de mapping. { length: 3 } crée un tableau de 3 éléments undefined, puis le callback (_, i) => i * 2 transforme chaque index : 0*2=0, 1*2=2, 2*2=4. Très utile pour générer des tableaux sans boucle."
    },
    {
      question: "Quelle syntaxe utilise les 'propriétés raccourcies' (shorthand) en JavaScript ?",
      sub: "Syntaxe raccourcie des propriétés d'objet",
      options: [
        "const nom = 'Alice'; const obj = { nom: nom };",
        "const nom = 'Alice'; const obj = { nom };",
        "const nom = 'Alice'; const obj = { 'nom' };",
        "const nom = 'Alice'; const obj = Object.create({ nom });"
      ],
      correct: 1,
      explanation: "✅ Exact ! Depuis ES6, si la variable et la propriété ont le même nom, on peut écrire { nom } au lieu de { nom: nom }. C'est la syntaxe de propriété raccourcie (shorthand property). Elle fonctionne aussi pour les méthodes : { saluer() {} } au lieu de { saluer: function() {} }."
    },
    {
      question: "Quelle est la principale limitation de JSON.stringify() / JSON.parse() pour la sérialisation d'objets ?",
      sub: "Limitations de JSON.stringify et JSON.parse",
      options: [
        "JSON ne supporte pas les tableaux imbriqués",
        "JSON.stringify() perd les fonctions, undefined, Symbol, et les références circulaires provoquent une erreur",
        "JSON.parse() ne peut pas reconstruire les objets avec des méthodes",
        "Les deux réponses B et C sont correctes"
      ],
      correct: 3,
      explanation: "✅ Exact ! JSON a plusieurs limitations importantes : les fonctions et undefined sont silencieusement omises (ou converties en null dans un tableau), les Symbol sont ignorés, et les références circulaires lancent une TypeError. JSON.parse() reconstruit un objet plain sans prototype ni méthodes — une instance de classe devient un objet littéral ordinaire."
    }
  ]
};
