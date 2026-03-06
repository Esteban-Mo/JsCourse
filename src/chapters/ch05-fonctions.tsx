import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeDeclTypes = `// 1. Déclaration de fonction (function declaration)
// → HOISTÉE : disponible avant sa définition dans le code
saluer("Alice"); // ✅ fonctionne ! (hoisting)

function saluer(prenom) {
  return \`Bonjour, \${prenom} !\`;
}

// 2. Expression de fonction (function expression)
// → NON hoistée : disponible seulement après l'assignation
const saluer2 = function(prenom) {
  return \`Salut, \${prenom} !\`;
};
// saluer2("Bob") avant cette ligne → ReferenceError

// 3. Fonction fléchée (arrow function, ES6)
// → NON hoistée, PAS de this propre, syntaxe concise
const saluer3 = (prenom) => \`Hey, \${prenom} !\`;

// Syntaxes raccourcies de l'arrow function
const double = x => x * 2;           // un paramètre, pas de parenthèses
const add    = (a, b) => a + b;       // return implicite
const getObj = () => ({ key: "val" }); // retourner un objet: entourer de ()`;

const codeThis1 = `const minuterie = {
  secondes: 0,

  // ❌ function classique dans setTimeout : this est perdu
  demarrerClassique() {
    setInterval(function() {
      this.secondes++; // ← this = window (ou undefined en strict)
      console.log(this.secondes); // NaN !
    }, 1000);
  },

  // ✅ Arrow function : hérite du this du contexte englobant
  demarrerArrow() {
    setInterval(() => {
      this.secondes++; // ← this = minuterie (hérité)
      console.log(this.secondes); // 1, 2, 3...
    }, 1000);
  }
};

minuterie.demarrerArrow();`;

const codeThis2 = `// Les 4 règles de this :

// 1. Appel simple → this = global (window) ou undefined (strict)
function quiSuisJe() { return this; }
quiSuisJe(); // window ou undefined

// 2. Méthode d'objet → this = l'objet
const obj = { nom: "Bob", dir() { return this.nom; } };
obj.dir(); // "Bob"

// 3. new → this = nouvel objet créé
function Animal(nom) { this.nom = nom; }
const chien = new Animal("Rex"); // chien.nom = "Rex"

// 4. call/apply/bind → this = valeur explicite
function saluer() { return \`Bonjour \${this.nom}\`; }
saluer.call({ nom: "Alice" }); // "Bonjour Alice"`;

const codeParams = `// Paramètres par défaut
function creerMessage(texte, auteur = "Anonyme", urgent = false) {
  return \`[\${urgent ? "URGENT" : "INFO"}] \${auteur}: \${texte}\`;
}
creerMessage("Bonjour");               // "[INFO] Anonyme: Bonjour"
creerMessage("Au feu!", "Alice", true); // "[URGENT] Alice: Au feu!"

// Paramètre rest (...) : capture le reste des arguments
function logTout(label, ...elements) {
  console.log(label, elements);
}
logTout("fruits", "pomme", "banane", "cerise");
// "fruits" ["pomme", "banane", "cerise"]

// Déstructuration dans les paramètres
function afficherUser({ nom, age, ville = "Inconnue" }) {
  console.log(\`\${nom}, \${age} ans, de \${ville}\`);
}
afficherUser({ nom: "Alice", age: 30 });
// "Alice, 30 ans, de Inconnue"`;

const codePures = `// ❌ Fonction IMPURE : dépend d'un état externe
let taxe = 0.2;
function calculerPrixImpure(prix) {
  return prix * (1 + taxe); // dépend de taxe externe
}
// Si taxe change, même appel → résultat différent

// ❌ Fonction IMPURE : modifie ses arguments (effet de bord)
function ajouterImpure(tableau, valeur) {
  tableau.push(valeur); // MUTE le tableau original !
  return tableau;
}

// ✅ Fonctions PURES
function calculerPrixPure(prix, tauxTaxe) {
  return prix * (1 + tauxTaxe); // tout en paramètre
}
// calculerPrixPure(100, 0.2) → toujours 120

function ajouterPure(tableau, valeur) {
  return [...tableau, valeur]; // nouveau tableau, pas de mutation
}
const arr1 = [1, 2, 3];
const arr2 = ajouterPure(arr1, 4);
// arr1 = [1,2,3] (inchangé), arr2 = [1,2,3,4]`;

const codeClosure1 = `function creerCompteur(depart = 0) {
  // "count" vit dans le scope de creerCompteur
  let count = depart;

  // Ces fonctions "ferment" sur count → closure
  return {
    incrementer: () => ++count,
    decrementer: () => --count,
    reset:       () => { count = depart; },
    valeur:      () => count
  };
}

const compteurA = creerCompteur(0);
const compteurB = creerCompteur(100); // scope INDÉPENDANT

compteurA.incrementer(); // 1
compteurA.incrementer(); // 2
compteurB.incrementer(); // 101

console.log(compteurA.valeur()); // 2
console.log(compteurB.valeur()); // 101
// Chaque appel à creerCompteur crée un scope distinct !`;

const codeClosure2 = `// Piège classique : closure dans une boucle avec var
const fns = [];

// ❌ var : toutes les fonctions partagent le MÊME i
for (var i = 0; i < 3; i++) {
  fns.push(() => console.log(i));
}
fns.forEach(f => f()); // 3, 3, 3 — pas 0, 1, 2 !

// ✅ let : chaque itération a son propre scope
const fns2 = [];
for (let i = 0; i < 3; i++) {
  fns2.push(() => console.log(i));
}
fns2.forEach(f => f()); // 0, 1, 2 ✓`;

const codeHOF1 = `// HOF qui ACCEPTE une fonction
function appliquer(valeur, transformation) {
  return transformation(valeur);
}
appliquer(5, x => x * 2);  // 10
appliquer("hello", s => s.toUpperCase());  // "HELLO"

// HOF qui RETOURNE une fonction (factory)
function multiplierPar(facteur) {
  return (nombre) => nombre * facteur; // closure sur facteur
}
const tripler   = multiplierPar(3);
const centupler = multiplierPar(100);

tripler(5);   // 15
centupler(7); // 700

// Les méthodes tableau sont des HOF
[1, 2, 3].map(tripler);   // [3, 6, 9]
[1, 2, 3].filter(n => n > 1); // [2, 3]`;

const codeHOF2 = `// Exemple réel : un décorateur de fonction (HOF avancé)
function avecLog(fn) {
  return function(...args) {
    console.log(\`Appel de \${fn.name} avec\`, args);
    const result = fn(...args);
    console.log(\`Résultat: \${result}\`);
    return result;
  };
}

const addLogged = avecLog((a, b) => a + b);
addLogged(3, 4);
// Appel de (a, b) => a + b avec [3, 4]
// Résultat: 7`;

const codeChallenge = `function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const cle = JSON.stringify(args);

    if (cache.has(cle)) {
      console.log("Cache hit !");
      return cache.get(cle);
    }

    const result = fn(...args);
    cache.set(cle, result);
    return result;
  };
}

// Fibonacci naïf : O(2^n) → avec memoize : O(n)
const fib = memoize(function(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

fib(10); // calcule
fib(10); // Cache hit ! → 55`;

function Ch05Fonctions() {
  return (
    <>
      <div className="chapter-tag">Chapitre 05 · Fonctions</div>
      <h1>Fonctions &amp;<br /><span className="highlight">Closures</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-intermediate">🧩</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★☆☆</div>
          <h3>First-class, déclarations, this, closures, fonctions pures, HOF</h3>
          <p>Durée estimée : 35 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>En JavaScript, les fonctions sont des <strong>citoyens de première classe</strong> (<em>first-class citizens</em>). Cela signifie qu'une fonction est une valeur comme une autre : elle peut être stockée dans une variable, passée comme argument, retournée par une autre fonction. C'est ce qui rend JavaScript si expressif.</p>

      <h2>Les trois façons de déclarer une fonction</h2>

      <p>Il existe trois syntaxes principales, et leurs différences ne sont pas seulement esthétiques — elles ont des comportements distincts.</p>

      <CodeBlock language="javascript">{codeDeclTypes}</CodeBlock>

      <InfoBox type="tip">
        Le <strong>hoisting</strong> (remontée) : le moteur JS lit tout le fichier avant de l'exécuter, et "remonte" les déclarations de fonctions en haut de leur portée. Cela permet d'appeler une fonction avant de la définir. Les expressions de fonctions et arrow functions sont assignées à des variables — elles ne sont pas hoistées.
      </InfoBox>

      <h2>Le mot-clé this — Pourquoi les arrow functions n'en ont pas</h2>

      <p>C'est l'un des sujets les plus déroutants de JavaScript. <code>this</code> ne référence pas toujours ce que vous pensez. Sa valeur dépend de <em>comment</em> la fonction est appelée, pas de <em>où</em> elle est définie — sauf pour les arrow functions.</p>

      <CodeBlock language="javascript">{codeThis1}</CodeBlock>

      <CodeBlock language="javascript">{codeThis2}</CodeBlock>

      <InfoBox type="warning">
        N'utilisez <strong>jamais</strong> une arrow function comme méthode d'objet si vous avez besoin de <code>this</code> ! <code>{'const obj = { dir: () => this.nom }'}</code> — ici <code>this</code> n'est pas <code>obj</code> mais le contexte extérieur (souvent <code>undefined</code> en module ES).
      </InfoBox>

      <h2>Paramètres — Défaut, rest, et déstructuration</h2>

      <CodeBlock language="javascript">{codeParams}</CodeBlock>

      <h2>Fonctions pures — La prévisibilité comme principe</h2>

      <p>Une fonction pure respecte deux règles : (1) <strong>même entrée → même sortie</strong> toujours, (2) <strong>aucun effet de bord</strong> (ne modifie pas l'extérieur). Les fonctions pures sont testables, prévisibles et composables.</p>

      <CodeBlock language="javascript">{codePures}</CodeBlock>

      <h2>Closures — Le vrai mécanisme expliqué</h2>

      <p>Une closure se forme quand une fonction est créée à l'intérieur d'une autre fonction. La fonction interne <strong>garde une référence vivante</strong> à l'environnement de la fonction externe, même après que celle-ci a terminé son exécution. Ce n'est pas une copie — c'est un lien direct.</p>

      <CodeBlock language="javascript">{codeClosure1}</CodeBlock>

      <CodeBlock language="javascript">{codeClosure2}</CodeBlock>

      <InfoBox type="success">
        La closure est le mécanisme qui permet : les données privées (module pattern), les fonctions factory, la mémoïsation, les hooks React (useState stocke sa valeur via closure !). Comprendre les closures, c'est comprendre le cœur de JavaScript.
      </InfoBox>

      <h2>Fonctions d'ordre supérieur (Higher-Order Functions)</h2>

      <p>Une fonction d'ordre supérieur est une fonction qui <strong>accepte d'autres fonctions comme arguments</strong> ou qui <strong>retourne une fonction</strong>. C'est rendu possible par le fait que les fonctions sont des first-class citizens.</p>

      <CodeBlock language="javascript">{codeHOF1}</CodeBlock>

      <CodeBlock language="javascript">{codeHOF2}</CodeBlock>

      <Challenge title="Défi : Mémoïsation">
        <p>Implémentez une fonction <code>memoize(fn)</code> qui met en cache les résultats d'une fonction. Si la fonction est appelée avec les mêmes arguments, elle retourne le résultat en cache sans recalculer.</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 5,
  title: 'Fonctions',
  icon: '🧩',
  level: 'Intermédiaire',
  stars: '★★★☆☆',
  component: Ch05Fonctions,
  quiz: [
    {
      question: "Pourquoi une arrow function ne doit PAS être utilisée comme méthode d'un objet nécessitant this ?",
      sub: "Le comportement de this dans les arrow functions",
      options: [
        "Les arrow functions sont plus lentes",
        "Les arrow functions n'ont pas leur propre this — elles héritent du this du contexte englobant",
        "Les arrow functions ne peuvent pas accéder aux propriétés d'un objet",
        "Les arrow functions ne supportent pas les paramètres"
      ],
      correct: 1,
      explanation: "✅ Exact ! Une arrow function hérite du this de son contexte lexical (où elle est définie), pas de celui de l'objet qui l'appelle. Comme méthode, this ne serait pas l'objet mais le scope extérieur — souvent window ou undefined."
    },
    {
      question: "Qu'est-ce qui définit une closure en JavaScript ?",
      sub: "Concept fondamental de closure",
      options: [
        "Une fonction qui s'appelle elle-même (récursion)",
        "Une fonction qui ferme son accès aux variables externes",
        "Une fonction interne qui garde une référence vivante à l'environnement de la fonction externe qui l'a créée",
        "Une fonction avec des paramètres par défaut"
      ],
      correct: 2,
      explanation: "✅ Parfait ! Une closure se forme quand une fonction interne maintient un lien vers le scope de sa fonction englobante. Ce n'est pas une copie — c'est un accès direct et persistant, même après que la fonction externe a terminé."
    },
    {
      question: "Que signifie qu'une fonction est 'pure' ?",
      sub: "Fonctions pures et effets de bord",
      options: [
        "La fonction est déclarée avec const et ne peut pas être réassignée",
        "La fonction n'utilise pas de boucles",
        "La fonction retourne toujours le même résultat pour les mêmes arguments ET ne modifie rien à l'extérieur",
        "La fonction ne prend qu'un seul argument"
      ],
      correct: 2,
      explanation: "✅ Exact ! Une fonction pure satisfait deux critères : déterminisme (même input → même output) et absence d'effets de bord (ne modifie pas de variables externes, ne fait pas d'I/O). Cela la rend testable, prévisible et composable."
    }
  ]
};
