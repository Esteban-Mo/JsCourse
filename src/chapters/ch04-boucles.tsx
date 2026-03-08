import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeFor1 = `//     ┌── initialisation   condition    incrément ──┐
for (let i = 0  ;  i < 5   ;  i++) {
  console.log(\`Tour \${i}\`);
}
// Tour 0 → Tour 1 → Tour 2 → Tour 3 → Tour 4
//
// Déroulement :
// 1. let i = 0     (une seule fois au début)
// 2. i < 5 ?       (vérifié AVANT chaque tour)
//    → oui : exécute le bloc, puis i++
//    → non : sort de la boucle`;

const codeFor2 = `// Compter à rebours
for (let i = 5; i > 0; i--) {
  console.log(i);
}
// 5, 4, 3, 2, 1

// Incrément différent : sauter de 2 en 2
for (let i = 0; i <= 10; i += 2) {
  console.log(i); // 0, 2, 4, 6, 8, 10
}

// Itérer un tableau par index
const fruits = ["pomme", "banane", "cerise"];
for (let i = 0; i < fruits.length; i++) {
  console.log(\`\${i}: \${fruits[i]}\`);
}
// 0: pomme, 1: banane, 2: cerise`;

const codeWhile = `// Cas d'usage : lire jusqu'à trouver une condition
let stock = 10;

while (stock > 0) {
  console.log(\`Stock restant : \${stock}\`);
  stock--;
}
console.log("Rupture de stock !");

// Simuler une recherche
let tentatives = 0;
let trouve = false;

while (!trouve && tentatives < 10) {
  // Simuler une recherche aléatoire
  trouve = Math.random() > 0.7;
  tentatives++;
}
console.log(\`Trouvé en \${tentatives} tentatives\`);`;

const codeDoWhile = `// while vs do...while : la différence clé

// while : condition false dès le début → 0 exécution
let x = 10;
while (x < 5) {
  console.log("while"); // jamais exécuté
  x++;
}

// do...while : s'exécute AVANT de vérifier → 1 exécution
let y = 10;
do {
  console.log("do...while !"); // exécuté une fois
  y++;
} while (y < 5); // faux → on s'arrête

// Cas d'usage classique : validation de saisie
let input;
do {
  input = prompt("Entrez un nombre positif :");
  input = parseInt(input);
} while (isNaN(input) || input <= 0);
console.log(\`Vous avez entré : \${input}\`);`;

const codeForOf = `// Tableaux
const fruits = ["pomme", "banane", "cerise"];
for (const fruit of fruits) {
  console.log(fruit);
}
// pomme, banane, cerise

// Chaînes de caractères
for (const lettre of "Bonjour") {
  console.log(lettre + "-");
}
// B-o-n-j-o-u-r-

// Avec entries() pour avoir index + valeur
for (const [index, fruit] of fruits.entries()) {
  console.log(\`\${index}: \${fruit}\`);
}
// 0: pomme, 1: banane, 2: cerise`;

const codeForIn = `// ✅ Bon usage : itérer les propriétés d'un objet
const personne = { nom: "Alice", age: 30, ville: "Paris" };

for (const cle in personne) {
  console.log(\`\${cle}: \${personne[cle]}\`);
}
// nom: Alice, age: 30, ville: Paris

// ❌ MAUVAIS usage : for...in sur un tableau
const arr = ["a", "b", "c"];
Array.prototype.customMethod = () => {}; // ajouté au prototype

for (const i in arr) {
  console.log(i); // "0", "1", "2", "customMethod" ← BUG !
}
// for...in itère AUSSI les propriétés héritées du prototype !

// ✅ Utiliser for...of à la place
for (const val of arr) {
  console.log(val); // "a", "b", "c" — seulement les valeurs
}`;

const codeBreakContinue = `// break : sort complètement de la boucle
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i); // 0, 1, 2, 3, 4
}

// continue : saute l'itération courante
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue; // saute les pairs
  console.log(i); // 1, 3, 5, 7, 9
}

// Boucles étiquetées (labels) : break/continue sur une boucle externe
externe:
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break externe; // sort des DEUX boucles
    console.log(\`\${i},\${j}\`);
  }
}
// 0,0  0,1  0,2  1,0  (s'arrête à 1,1)`;

const codeMethodes = `const nombres = [1, 2, 3, 4, 5];

// ❌ for classique pour transformer : verbeux
const doubles1 = [];
for (let i = 0; i < nombres.length; i++) {
  doubles1.push(nombres[i] * 2);
}

// ✅ map : lisible, déclaratif, sans mutation
const doubles2 = nombres.map(n => n * 2);
// [2, 4, 6, 8, 10]

// forEach : pour les effets de bord (log, DOM...)
nombres.forEach((n, index) => {
  console.log(\`[\${index}] = \${n}\`);
});
// Attention : forEach ne peut pas être stoppé avec break !

// Quand utiliser for...of à la place de forEach ?
// → Quand vous avez besoin de break/continue
// → Quand vous utilisez await à l'intérieur
for (const n of nombres) {
  if (n > 3) break; // impossible avec forEach !
  console.log(n);
}`;

const codeChallenge = `let fizzBuzzCount = 0;

boucle:
for (let i = 1; i <= 50; i++) {
  let resultat;
  if (i % 15 === 0) {
    resultat = "FizzBuzz";
    fizzBuzzCount++;
    if (fizzBuzzCount >= 3) break boucle;
  } else if (i % 3 === 0) {
    resultat = "Fizz";
  } else if (i % 5 === 0) {
    resultat = "Buzz";
  } else {
    resultat = i;
  }
  console.log(resultat);
}
// S'arrête après le 3e "FizzBuzz" (i = 45)`;

function Ch04Boucles() {
  return (
    <>
      <div className="chapter-tag">Chapitre 04 · Contrôle de flux</div>
      <h1>Boucles &amp;<br /><span className="highlight">Itérations</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-beginner">🔄</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★☆☆☆</div>
          <h3>for, while, do...while, for...of, for...in, méthodes de tableau</h3>
          <p>Durée estimée : 25 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Les boucles incarnent le principe <strong>DRY</strong> — <em>Don't Repeat Yourself</em>. Sans elles, afficher 1000 lignes d'un tableau nécessiterait 1000 lignes de code. Avec une boucle, c'est 3 lignes. Mais toutes les boucles ne sont pas équivalentes — choisir la bonne est une compétence à part entière.</p>

      <h2>La boucle for — Anatomie d'une boucle classique</h2>

      <p>La boucle <code>for</code> est la plus explicite : chaque partie de son mécanisme est visible. Elle se compose de trois parties séparées par des points-virgules :</p>

      <CodeBlock language="javascript">{codeFor1}</CodeBlock>

      <CodeBlock language="javascript">{codeFor2}</CodeBlock>

      <InfoBox type="tip">
        Utilisez <code>let</code> (pas <code>var</code>) pour le compteur. Avec <code>var</code>, la variable "fuit" hors de la boucle, ce qui cause des bugs classiques dans les closures et les gestionnaires d'événements.
      </InfoBox>

      <h2>while — Boucle à condition préalable</h2>

      <p><code>while</code> répète son bloc tant que la condition est vraie, en la vérifiant <em>avant chaque itération</em>. À utiliser quand vous ne savez pas d'avance combien de tours vous ferez.</p>

      <CodeBlock language="javascript">{codeWhile}</CodeBlock>

      <InfoBox type="danger">
        Méfiez-vous des <strong>boucles infinies</strong> ! Si la condition de votre <code>while</code> ne devient jamais fausse, le programme se fige. Assurez-vous toujours qu'une variable change à chaque itération.
      </InfoBox>

      <h2>do...while — Exécuter au moins une fois</h2>

      <p><code>do...while</code> évalue la condition <em>après</em> chaque itération. Le bloc s'exécute donc <strong>au minimum une fois</strong>, même si la condition est fausse dès le départ. Cas d'usage typique : demander une saisie utilisateur jusqu'à ce qu'elle soit valide.</p>

      <CodeBlock language="javascript">{codeDoWhile}</CodeBlock>

      <h2>for...of — L'itérateur moderne</h2>

      <p><code>for...of</code> (ES6) itère sur les <strong>valeurs</strong> de tout objet itérable : tableaux, chaînes, Sets, Maps, générateurs... C'est la façon recommandée d'itérer sur des collections en JavaScript moderne.</p>

      <CodeBlock language="javascript">{codeForOf}</CodeBlock>

      <h2>for...in — Pour les propriétés d'objets (PAS les tableaux !)</h2>

      <p><code>for...in</code> itère sur les <strong>clés énumérables</strong> d'un objet. Il fonctionne sur les tableaux aussi, mais c'est une très mauvaise pratique — voici pourquoi :</p>

      <CodeBlock language="javascript">{codeForIn}</CodeBlock>

      <InfoBox type="warning">
        <code>for...in</code> sur un tableau itère les <em>indices</em> comme des <em>strings</em> ("0", "1", "2") et peut inclure des propriétés héritées du prototype. Utilisez <strong>toujours</strong> <code>for...of</code> pour les tableaux.
      </InfoBox>

      <h2>break, continue et boucles étiquetées</h2>

      <p>Parfois, vous devez altérer le flux normal d'une itération avant qu'elle ne se termine d'elle-même. <code>break</code> permet de stopper net et de sortir complètement de la boucle, tandis que <code>continue</code> permet d'ignorer le reste de l'itération courante et de passer directement à la suivante. Les boucles étiquetées (labels) sont une fonctionnalité avancée permettant d'indiquer précisément à quelle boucle s'applique le <code>break</code> ou le <code>continue</code> en cas d'imbrication.</p>

      <CodeBlock language="javascript">{codeBreakContinue}</CodeBlock>

      <h2>Méthodes de tableau — Quand éviter les boucles for</h2>

      <p>Pour transformer ou analyser des tableaux, les <strong>méthodes fonctionnelles</strong> (<code>forEach</code>, <code>map</code>, <code>filter</code>...) sont souvent préférables aux boucles <code>for</code> classiques. Elles sont plus expressives et moins sujettes aux bugs d'index.</p>

      <CodeBlock language="javascript">{codeMethodes}</CodeBlock>

      <InfoBox type="tip">
        Guide de choix : <strong>map/filter/reduce</strong> pour transformer et produire une valeur, <strong>forEach</strong> pour des effets de bord sans besoin de break, <strong>for...of</strong> quand vous avez besoin de break/continue ou d'await, <strong>for</strong> classique quand vous avez besoin de l'index ET de performance maximale.
      </InfoBox>

      <Challenge title="Défi personnel à réaliser : FizzBuzz élaboré">
        <p>Écrivez une boucle qui affiche les nombres de 1 à 50 avec ces règles :</p>
        <ul>
          <li>Multiple de 15 : "FizzBuzz"</li>
          <li>Multiple de 3 seulement : "Fizz"</li>
          <li>Multiple de 5 seulement : "Buzz"</li>
          <li>Sinon : le nombre lui-même</li>
          <li>Bonus : arrêtez la boucle si on atteint 3 "FizzBuzz" avec un label</li>
        </ul>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 4,
  title: 'Boucles',
  icon: '🔄',
  level: 'Débutant',
  stars: '★★☆☆☆',
  component: Ch04Boucles,
  quiz: [
    {
      question: "Quelle est la différence fondamentale entre while et do...while ?",
      sub: "Ordre d'évaluation de la condition",
      options: [
        "while est plus rapide que do...while",
        "do...while évalue la condition avant l'exécution, while après",
        "do...while exécute le bloc au moins une fois, while peut ne jamais l'exécuter",
        "Il n'y a aucune différence pratique"
      ],
      correct: 2,
      explanation: "✅ Exact ! do...while exécute le bloc D'ABORD, puis vérifie la condition. Même si la condition est false dès le départ, le bloc s'est exécuté une fois. while vérifie AVANT, donc peut ne jamais exécuter le bloc."
    },
    {
      question: "Pourquoi ne faut-il PAS utiliser for...in pour itérer un tableau ?",
      sub: "Pièges de for...in",
      options: [
        "for...in est plus lent que for...of",
        "for...in itère les indices comme des strings et peut inclure des propriétés héritées du prototype",
        "for...in ne fonctionne pas sur les tableaux",
        "for...in ne supporte pas break"
      ],
      correct: 1,
      explanation: "✅ Parfait ! for...in donne les clés (indices) comme des strings '0','1','2' et itère aussi les propriétés ajoutées au Array.prototype. C'est for...of qu'il faut utiliser pour les tableaux."
    },
    {
      question: "Quelle méthode de tableau NE peut PAS être interrompue avec break ?",
      sub: "Méthodes fonctionnelles vs boucles",
      options: [
        "for...of",
        "for classique",
        "forEach",
        "for...in"
      ],
      correct: 2,
      explanation: "✅ Exact ! forEach ne peut pas être stoppé avec break — cela lève une SyntaxError. Pour sortir tôt d'une itération de tableau, utilisez for...of avec break, ou des méthodes comme find() ou some() qui s'arrêtent dès qu'une condition est remplie."
    },
    {
      question: "for...of itère sur quoi, et for...in itère sur quoi ?",
      sub: "for...of vs for...in",
      options: [
        "for...of itère les clés, for...in itère les valeurs",
        "for...of itère les valeurs, for...in itère les clés énumérables",
        "Les deux itèrent les valeurs, mais for...in est plus lent",
        "for...of fonctionne sur les objets, for...in sur les tableaux"
      ],
      correct: 1,
      explanation: "✅ Exact ! for...of itère les valeurs d'un itérable (tableau, string, Set...). for...in itère les clés (propriétés énumérables) d'un objet. C'est pourquoi for...in est adapté aux objets et for...of aux tableaux."
    },
    {
      question: "Quelle est la garantie offerte par do...while par rapport à while ?",
      sub: "do...while — exécution garantie",
      options: [
        "do...while est plus performant que while",
        "do...while s'exécute au moins une fois, même si la condition est fausse dès le départ",
        "do...while ne peut pas produire de boucle infinie",
        "do...while vérifie la condition avant ET après chaque itération"
      ],
      correct: 1,
      explanation: "✅ Parfait ! do...while évalue sa condition APRÈS le bloc. Le bloc est donc exécuté au minimum une fois, peu importe la condition initiale. C'est idéal pour les saisies utilisateur : on demande d'abord, on valide ensuite."
    },
    {
      question: "Comment itérer les clés d'un objet avec une boucle for...of ?",
      sub: "Itérer les propriétés d'un objet",
      options: [
        "for (const cle of monObjet) { } — for...of fonctionne directement sur les objets",
        "for (const cle in monObjet) { } — for...in est conçu pour les objets",
        "for (const cle of Object.keys(monObjet)) { } — Object.keys() retourne un tableau itérable",
        "Les objets ne sont pas itérables, aucune boucle ne fonctionne"
      ],
      correct: 2,
      explanation: "✅ Exact ! Les objets simples ne sont pas directement itérables avec for...of. Object.keys(obj) retourne un tableau des clés, que for...of peut parcourir. Alternatives : Object.values() pour les valeurs, Object.entries() pour les paires [clé, valeur]."
    },
    {
      question: "À quoi sert une boucle étiquetée (labeled loop) avec break ?",
      sub: "Break étiqueté",
      options: [
        "À nommer la boucle pour la documentation",
        "À sortir d'une boucle externe depuis une boucle interne imbriquée",
        "À améliorer les performances des boucles imbriquées",
        "À utiliser break sans condition"
      ],
      correct: 1,
      explanation: "✅ Exact ! break seul sort de la boucle la plus proche. break monLabel sort de la boucle portant ce label, même si elle est externe. C'est utile dans les boucles imbriquées quand on veut interrompre le traitement entier à la première correspondance trouvée."
    },
    {
      question: "Quel est le risque principal d'une boucle while mal écrite ?",
      sub: "Boucle infinie",
      options: [
        "Elle lève automatiquement une RangeError après 1000 itérations",
        "Elle peut créer une boucle infinie si la condition ne devient jamais fausse, figeant le programme",
        "Elle est toujours moins performante qu'une boucle for",
        "Elle ne peut pas utiliser break"
      ],
      correct: 1,
      explanation: "✅ Exact ! Une boucle while dont la condition reste toujours true tourne indéfiniment et bloque le thread JavaScript. JavaScript est mono-thread : une boucle infinie gèle complètement l'onglet du navigateur. Toujours s'assurer qu'une variable de la condition évolue à chaque itération."
    }
  ]
};
