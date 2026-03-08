import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeImperatifVsFp = `// Style IMPÉRATIF : on dit COMMENT faire
const produits = [
  { nom: "Stylo", prix: 2, stock: 50 },
  { nom: "Cahier", prix: 5, stock: 0 },
  { nom: "Règle", prix: 3, stock: 20 },
];

// Impératif : mutation, variables temporaires
let total = 0;
for (let i = 0; i < produits.length; i++) {
  if (produits[i].stock > 0) {
    total += produits[i].prix;
  }
}

// Style DÉCLARATIF (FP) : on dit QUOI faire
const totalFP = produits
  .filter(p => p.stock > 0)           // garder en stock
  .map(p => p.prix)                   // extraire les prix
  .reduce((acc, p) => acc + p, 0); // additionner

// FP : lisible comme de la prose, sans variable temporaire muable`;

const codeImmutabilite = `// Immutabilité : toujours retourner de nouvelles valeurs
const state = { utilisateurs: ["Alice", "Bob"], theme: "light" };

// ❌ Mutation directe
state.utilisateurs.push("Clara"); // mute state !
state.theme = "dark";

// ✅ Immutable updates
const newState = {
  ...state,
  utilisateurs: [...state.utilisateurs, "Clara"],
  theme: "dark"
};
// state est intact, newState est un nouvel objet

// Mise à jour imbriquée (immutable)
const config = { ui: { sidebar: { open: true, width: 250 } } };
const newConfig = {
  ...config,
  ui: { ...config.ui, sidebar: { ...config.ui.sidebar, open: false } }
};`;

const codeCurry1 = `// Sans currying
const add = (a, b) => a + b;
add(2, 3); // 5

// Currifiée manuellement : a => b => a + b
const addC = (a) => (b) => a + b;

// Application partielle : fixer le premier argument
const add10  = addC(10);  // b => 10 + b
const add100 = addC(100); // b => 100 + b

add10(5);   // 15
add100(7);  // 107

// Cas concret : filtres réutilisables
const superieurA = (min) => (n) => n > min;
const superieurA5  = superieurA(5);
const superieurA10 = superieurA(10);

[1, 5, 7, 12].filter(superieurA5);  // [7, 12]
[1, 5, 7, 12].filter(superieurA10); // [12]`;

const codeCurry2 = `// curry() générique : accepte n'importe quelle arité
const curry = (fn) => {
  const arité = fn.length;
  return function currié(...args) {
    return args.length >= arité
      ? fn(...args)                           // assez d'args → appeler
      : (...plus) => currié(...args, ...plus); // sinon → attendre
  };
};

const multiply = curry((a, b, c) => a * b * c);

multiply(2)(3)(4); // 24
multiply(2, 3)(4); // 24
multiply(2, 3, 4); // 24

const doubler  = multiply(2);    // (b, c) => 2 * b * c
const doubler6 = multiply(2, 3); // c => 2 * 3 * c = 6 * c
doubler6(5); // 30`;

const codePipe = `// compose : droite à gauche   compose(f, g, h)(x) = f(g(h(x)))
const compose = (...fns) => (x) =>
  fns.reduceRight((val, fn) => fn(val), x);

// pipe    : gauche à droite   pipe(f, g, h)(x) = h(g(f(x)))
const pipe = (...fns) => (x) =>
  fns.reduce((val, fn) => fn(val), x);

// Fonctions simples et pures
const nettoyer    = (s) => s.trim();
const minuscules  = (s) => s.toLowerCase();
const enleverAccents = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const slug        = (s) => s.replace(/\s+/g, "-");

// Composer en pipeline lisible
const versSlug = pipe(nettoyer, minuscules, enleverAccents, slug);

versSlug("  Bonjour le Monde !  "); // "bonjour-le-monde-!"
versSlug("Programmation Fonctionnelle"); // "programmation-fonctionnelle"`;

const codeMemo = `// Mémoïsation : mettre en cache les résultats
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const cle = JSON.stringify(args);
    if (cache.has(cle)) return cache.get(cle);
    const résultat = fn.apply(this, args);
    cache.set(cle, résultat);
    return résultat;
  };
}

// Fibonacci récursif : O(2^n) sans mémo, O(n) avec
const fib = memoize(function(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

console.time("fib");
fib(40); // Instantané avec mémo
console.timeEnd("fib");

// Mémoïsation avec WeakMap (pour les arguments objets)
function memoizeWeak(fn) {
  const cache = new WeakMap();
  return (obj) => {
    if (!cache.has(obj)) cache.set(obj, fn(obj));
    return cache.get(obj);
  };
}
// Quand obj est GC, le cache se vide automatiquement !`;

const codeTransducers = `// Sans transducers : 3 passages sur les données
[1,2,3,4,5,6,7,8,9,10]
  .filter(n => n % 2 === 0)  // passage 1
  .map(n => n * 3)           // passage 2
  .filter(n => n > 10);     // passage 3

// Avec transducers : UN SEUL passage
const filtering = (pred) => (reducer) => (acc, val) =>
  pred(val) ? reducer(acc, val) : acc;

const mapping = (fn) => (reducer) => (acc, val) =>
  reducer(acc, fn(val));

const transduce = (transducer, reducer, init, collection) =>
  collection.reduce(transducer(reducer), init);

// Composer les transducers (ordre naturel avec compose)
const xform = compose(
  filtering(n => n % 2 === 0), // filtre pairs
  mapping(n => n * 3),          // multiplie par 3
  filtering(n => n > 10)       // garde > 10
);

const result = transduce(xform, (acc, v) => [...acc, v], [], [1,2,3,4,5,6,7,8,9,10]);
// [12, 18, 24, 30] — UN SEUL passage !`;

const codeMaybe = `// Maybe monade : une boîte qui sait se comporter quand elle est vide
class Maybe {
  constructor(valeur) {
    this._valeur = valeur;
  }

  static of(valeur)   { return new Maybe(valeur); }
  static empty()     { return new Maybe(null); }

  estVide()  { return this._valeur == null; }

  // map : applique fn si non-vide, sinon ne fait rien
  map(fn) {
    return this.estVide()
      ? Maybe.empty()
      : Maybe.of(fn(this._valeur));
  }

  // getOrElse : extraire la valeur ou un défaut
  getOrElse(défaut) {
    return this.estVide() ? défaut : this._valeur;
  }

  // chain/flatMap : évite le Maybe(Maybe(val))
  chain(fn) {
    return this.estVide() ? Maybe.empty() : fn(this._valeur);
  }
}

// Avec Maybe : pipeline propre, zéro vérification null
const getVille = (user) =>
  Maybe.of(user)
    .chain(u => Maybe.of(u.adresse))
    .chain(a => Maybe.of(a.ville))
    .map(v => v.toUpperCase())
    .getOrElse("INCONNUE");

getVille({ adresse: { ville: "Paris" } }); // "PARIS"
getVille({ adresse: null });                // "INCONNUE"
getVille(null);                              // "INCONNUE"`;

const codePratique = `// Partial application : créer des variantes spécialisées
const creerValidateur = (min, max) => (valeur) =>
  valeur >= min && valeur <= max;

const estAge   = creerValidateur(0, 150);
const estScore = creerValidateur(0, 100);
const estNote  = creerValidateur(1, 5);

estAge(25);    // true
estScore(150); // false

// Reducer pattern : FP + Redux-like
const todoReducer = (state = [], action) => {
  const handlers = {
    ADD:    (s, a) => [...s, { id: Date.now(), texte: a.texte, fait: false }],
    REMOVE: (s, a) => s.filter(t => t.id !== a.id),
    TOGGLE: (s, a) => s.map(t => t.id === a.id ? { ...t, fait: !t.fait } : t),
  };
  return (handlers[action.type] ?? (s => s))(state, action);
};`;

const codeChallenge = `// Fonctions pures de validation et transformation
const validerCommande = (commande) =>
  Maybe.of(commande)
    .chain(c => c.items.length > 0 ? Maybe.of(c) : Maybe.empty());

const appliquerRemise = curry((pct, commande) => ({
  ...commande,
  total: commande.total * (1 - pct / 100)
}));

const ajouterTVA = (taux) => (commande) => ({
  ...commande,
  total: commande.total * (1 + taux)
});

// Pipeline complet
const traiterCommande = pipe(
  validerCommande,
  m => m.map(appliquerRemise(10)),  // 10% de remise
  m => m.map(ajouterTVA(0.2)),      // TVA 20%
  m => m.getOrElse(null)
);

const commande = { items: ["livre"], total: 100 };
console.log(traiterCommande(commande));
// { items: ["livre"], total: 108 }  (100 * 0.9 * 1.2)

console.log(traiterCommande({ items: [], total: 0 }));
// null (commande vide → Maybe.empty)`;

function Ch15Patterns() {
  return (
    <>
      <div className="chapter-tag">Chapitre 15 · Maître</div>
      <h1>JavaScript<br /><span className="highlight">Fonctionnel</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-master">🧠</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★★</div>
          <h3>Philosophie FP, currying, compose/pipe, mémoïsation, transducers, monades</h3>
          <p>Durée estimée : 55 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>La <strong>programmation fonctionnelle</strong> (FP) n'est pas un langage ni un framework — c'est une philosophie de conception. Elle repose sur trois piliers : <strong>l'immutabilité</strong> (ne pas modifier les données), les <strong>fonctions pures</strong> (même entrée → même sortie, pas d'effets de bord), et la <strong>composition</strong> (construire des comportements complexes en combinant des fonctions simples).</p>

      <h2>La philosophie FP — Pourquoi immuabilité et pureté</h2>

      <CodeBlock language="javascript">{codeImperatifVsFp}</CodeBlock>

      <CodeBlock language="javascript">{codeImmutabilite}</CodeBlock>

      <InfoBox type="tip">
        La FP n'est pas "tout ou rien". Commence par <strong>deux règles simples</strong> : (1) préfère les fonctions pures pour la logique métier, (2) évite de muter les données reçues en paramètre. Ces deux habitudes éliminent déjà la majorité des bugs liés aux effets de bord. L'immutabilité complète avec des structures persistantes peut venir plus tard si nécessaire.
      </InfoBox>

      <h2>Currying — Pré-charger des arguments</h2>

      <p>Le currying transforme une fonction à N arguments en une chaîne de fonctions à 1 argument. C'est comme une usine de fonctions spécialisées.</p>

      <CodeBlock language="javascript">{codeCurry1}</CodeBlock>

      <CodeBlock language="javascript">{codeCurry2}</CodeBlock>

      <InfoBox type="tip">
        En pratique, le currying brille avec <strong>l'application partielle</strong> pour créer des variantes spécialisées d'une fonction générique. Au lieu de répéter <code>filter(arr, x =&gt; x &gt; 5)</code> partout, tu crées une fois <code>const plusDe5 = superieurA(5)</code> et tu réutilises. Les bibliothèques <code>Ramda</code> et <code>fp-ts</code> sont entièrement basées sur ce principe.
      </InfoBox>

      <h2>compose et pipe — Construire des pipelines de transformation</h2>

      <p><strong>compose</strong> applique des fonctions de droite à gauche (ordre mathématique). <strong>pipe</strong> applique de gauche à droite (ordre de lecture naturel).</p>

      <CodeBlock language="javascript">{codePipe}</CodeBlock>

      <InfoBox type="warning">
        Le débogage des pipelines peut être difficile — une erreur dans une étape intermédiaire donne parfois une stacktrace obscure. Une technique : insérer temporairement <code>tap = (fn) =&gt; (x) =&gt; (fn(x), x)</code> dans le pipe pour logger sans casser le flux : <code>pipe(nettoyer, tap(console.log), minuscules, ...)</code>.
      </InfoBox>

      <h2>Mémoïsation — Cacher les résultats coûteux</h2>

      <CodeBlock language="javascript">{codeMemo}</CodeBlock>

      <InfoBox type="tip">
        La mémoïsation n'est utile que pour les fonctions <strong>pures et coûteuses</strong> appelées plusieurs fois avec les mêmes arguments. Évite-la pour : les fonctions rapides (le cache a un coût), les fonctions avec effets de bord, et les fonctions avec des arguments objets (sans WeakMap, la comparaison par référence rate souvent). React's <code>useMemo</code> et <code>useCallback</code> sont des formes de mémoïsation.
      </InfoBox>

      <h2>Transducers — Composer des reducers efficacement</h2>

      <p>Un <strong>transducer</strong> compose map, filter, et autres transformations en <strong>UN SEUL passage</strong> sur les données (O(n) au lieu de O(n×k)).</p>

      <CodeBlock language="javascript">{codeTransducers}</CodeBlock>

      <h2>La monade Maybe — Gérer null sans if partout</h2>

      <p>La monade <code>Maybe</code> encapsule une valeur qui peut être <code>null</code> ou <code>undefined</code>, et court-circuite toutes les opérations si la valeur est absente.</p>

      <CodeBlock language="javascript">{codeMaybe}</CodeBlock>

      <InfoBox type="success">
        En JavaScript moderne, l'<strong>optional chaining</strong> (<code>user?.adresse?.ville</code>) est une version simplifiée de la monade Maybe pour les accès de propriétés. Pour des pipelines de transformation plus complexes avec gestion d'erreurs, explore <code>fp-ts</code> ou <code>effect-ts</code> — ils implémentent Maybe (<code>Option</code>), Either (succès/échec), et bien plus.
      </InfoBox>

      <h2>FP Pratique — Patterns dans React et JS moderne</h2>

      <CodeBlock language="javascript">{codePratique}</CodeBlock>

      <InfoBox type="success">
        La FP n'est pas "tout ou rien". Dans le code React quotidien, vous utilisez déjà de la FP : les hooks (useState, useReducer), les components purs, les sélecteurs Redux. Comprendre les principes FP rend ces outils infiniment plus clairs.
      </InfoBox>

      <Challenge title="Défi Final : Système de traitement de commandes">
        <p>En utilisant uniquement des fonctions pures, pipe, curry et Maybe, construisez un pipeline de traitement de commandes e-commerce.</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 15,
  title: 'Patterns Fonctionnels',
  icon: '🧠',
  level: 'Maître',
  stars: '★★★★★',
  component: Ch15Patterns,
  quiz: [
    {
      question: "Quelle est la différence entre pipe et compose ?",
      sub: "Composition fonctionnelle",
      options: [
        "pipe est asynchrone, compose est synchrone",
        "pipe applique les fonctions de gauche à droite (ordre naturel), compose de droite à gauche (ordre mathématique)",
        "compose accepte plus de fonctions que pipe",
        "Il n'y a aucune différence fonctionnelle"
      ],
      correct: 1,
      explanation: "✅ Parfait ! pipe(f, g, h)(x) = h(g(f(x))) — vous lisez dans l'ordre naturel. compose(f, g, h)(x) = f(g(h(x))) — ordre mathématique, h s'applique en premier. En pratique, pipe est plus intuitif."
    },
    {
      question: "Qu'est-ce que le currying et quel est son principal avantage ?",
      sub: "Currying et application partielle",
      options: [
        "Convertir une fonction synchrone en fonction asynchrone",
        "Transformer une fonction à N arguments en chaîne de fonctions à 1 argument, permettant l'application partielle pour créer des fonctions spécialisées",
        "Mémoriser les résultats d'une fonction pour les appels futurs",
        "Exécuter plusieurs fonctions en parallèle"
      ],
      correct: 1,
      explanation: "✅ Exact ! Le currying permet l'application partielle : fixer certains arguments à l'avance pour créer des fonctions spécialisées. add(2) retourne une fonction b => 2 + b. Cela favorise la réutilisabilité et la composition."
    },
    {
      question: "Quelle est la définition d'une monade en programmation fonctionnelle ?",
      sub: "Concept de monade",
      options: [
        "Une classe qui hérite d'une autre classe",
        "Un conteneur qui encapsule une valeur et fournit des méthodes (map, chain) pour transformer cette valeur de façon sûre, en gérant les cas particuliers (null, erreur, async)",
        "Une fonction qui s'appelle elle-même",
        "Un objet avec uniquement des méthodes statiques"
      ],
      correct: 1,
      explanation: "✅ Exact ! Une monade est un wrapper avec map() et chain() (flatMap). La Maybe monade encapsule une valeur potentiellement null et court-circuite les transformations si elle est vide. Les Promises sont des monades async ! Comprendre ce pattern explique pourquoi .then() et .catch() fonctionnent comme ils le font."
    },
    {
      question: "Quelle est la caractéristique essentielle d'une fonction pure en programmation fonctionnelle ?",
      sub: "Fonctions pures",
      options: [
        "Elle doit être écrite en une seule ligne",
        "Elle ne doit pas utiliser de boucles, uniquement de la récursion",
        "Données les mêmes entrées, elle retourne toujours la même sortie et ne produit aucun effet de bord (pas de mutation externe, pas d'I/O, pas de random)",
        "Elle doit accepter une autre fonction comme argument"
      ],
      correct: 2,
      explanation: "✅ Exact ! Une fonction pure est déterministe (même entrée → même sortie) et sans effets de bord. Elle ne modifie pas de variables externes, ne fait pas d'appels réseau, ne touche pas au DOM, n'utilise pas Math.random(). Cette propriété la rend triviale à tester, composer, mémoïser et paralléliser."
    },
    {
      question: "Pourquoi la mémoïsation améliore-t-elle les performances du Fibonacci récursif ?",
      sub: "Mémoïsation",
      options: [
        "Elle transforme la récursion en itération, évitant les appels de stack",
        "Elle met en cache les résultats déjà calculés, évitant les recalculs exponentiels — la complexité passe de O(2^n) à O(n)",
        "Elle parallélise les calculs des sous-problèmes indépendants",
        "Elle remplace la récursion par une formule mathématique directe"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Sans mémoïsation, fib(40) recalcule fib(38) deux fois, fib(37) quatre fois, fib(36) huit fois... la complexité est O(2^n). Avec mémoïsation, chaque valeur fib(n) est calculée une seule fois et mise en cache. Les appels suivants retournent immédiatement le résultat mis en cache — la complexité devient O(n)."
    },
    {
      question: "Quelle est la règle de l'immutabilité pour les mises à jour d'objets imbriqués ?",
      sub: "Immutabilité",
      options: [
        "Il faut utiliser Object.freeze() sur tous les objets imbriqués",
        "Il suffit de copier le niveau supérieur avec le spread operator {...obj}",
        "Il faut créer de nouvelles copies à chaque niveau de l'arborescence jusqu'à la propriété modifiée (structural sharing)",
        "Il faut sérialiser l'objet en JSON puis le parser pour obtenir une copie profonde"
      ],
      correct: 2,
      explanation: "✅ Exact ! Pour mettre à jour config.ui.sidebar.open de façon immutable, il faut copier chaque niveau : { ...config, ui: { ...config.ui, sidebar: { ...config.ui.sidebar, open: false } } }. C'est le 'structural sharing' — seuls les nœuds modifiés sont dupliqués, les autres sous-arbres sont partagés par référence. Immer.js automatise ce pattern avec une syntaxe mutatrice."
    },
    {
      question: "Quel avantage principal offrent les transducers par rapport aux chaînes .filter().map().filter() ?",
      sub: "Transducers",
      options: [
        "Les transducers permettent de traiter des données asynchrones",
        "Les transducers composent les transformations en un seul passage sur les données au lieu de créer des tableaux intermédiaires à chaque étape",
        "Les transducers s'exécutent en parallèle sur plusieurs threads",
        "Les transducers permettent d'utiliser des générateurs infinis avec filter et map"
      ],
      correct: 1,
      explanation: "✅ Correct ! Une chaîne .filter().map().filter() sur 10 000 éléments crée 3 tableaux intermédiaires et fait 3 passages sur les données. Un transducer compose toutes ces transformations en un seul reducer qui s'applique en UN passage, sans tableaux intermédiaires. La complexité est O(n) au lieu de O(n×k) et la consommation mémoire est réduite."
    },
    {
      question: "Quelle méthode de la monade Maybe empêche l'imbrication Maybe(Maybe(valeur)) ?",
      sub: "Monade Maybe",
      options: [
        "map(), car elle détecte automatiquement les valeurs imbriquées",
        "getOrElse(), car elle extrait toujours la valeur brute",
        "chain() (aussi appelée flatMap), car elle attend une fonction qui retourne déjà un Maybe et évite ainsi l'imbrication",
        "of(), car elle normalise toujours la valeur en un seul niveau"
      ],
      correct: 2,
      explanation: "✅ Exact ! map(fn) encapsule le résultat de fn dans un Maybe — si fn retourne déjà un Maybe, on obtient Maybe(Maybe(v)). chain(fn) (flatMap) attend que fn retourne un Maybe et retourne directement ce Maybe sans l'envelopper à nouveau. C'est la différence fondamentale entre map et flatMap dans toutes les monades, y compris les Promises (.then() se comporte comme flatMap)."
    }
  ]
};
