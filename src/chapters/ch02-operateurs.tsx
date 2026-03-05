import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const CODE_ARITHMETIC = `const a = 10, b = 3;

console.log(a + b);   // 13  (addition)
console.log(a - b);   // 7   (soustraction)
console.log(a * b);   // 30  (multiplication)
console.log(a / b);   // 3.33 (division)
console.log(a % b);   // 1   (modulo — reste de la division)
console.log(a ** b);  // 1000 (puissance : 10³)

let x = 5;
x++;  // x = 6 (incrémentation post-fixe)
x--;  // x = 5 (décrémentation post-fixe)
++x;  // x = 6 (incrémentation pré-fixe : retourne la nouvelle valeur)`;

const CODE_ASSIGNMENT = `let score = 10;

score += 5;   // score = score + 5  → 15
score -= 3;   // score = score - 3  → 12
score *= 2;   // score = score * 2  → 24
score /= 4;   // score = score / 4  → 6
score %= 4;   // score = score % 4  → 2
score **= 3;  // score = score ** 3 → 8

// Très courant dans les boucles et les accumulateurs
let total = 0;
const prix = [10, 25, 8];
for (const p of prix) total += p;
console.log(total); // 43`;

const CODE_COMPARISON = `5 === 5     // true  (strictement égal)
5 === "5"  // false (types différents)
5 == "5"   // true  ⚠️ conversion auto !
5 !== 6    // true  (strictement différent)
5 > 3      // true
5 >= 5     // true`;

const CODE_LOGICAL = `true && true    // true  (ET logique)
true && false   // false
true || false   // true  (OU logique)
false || false  // false
!true           // false (NON logique)

// || : retourne la première valeur "truthy" trouvée
const nom = "" || "Invité";  // "Invité" (chaîne vide est falsy)

// ?? opérateur nullish coalescing (ES2020)
// Ne prend le fallback que si la valeur est null ou undefined
const val = null ?? "défaut";  // "défaut"
const val2 = 0 ?? "défaut";    // 0 (0 n'est pas null !)
// → Détaillé au chapitre 09 avec ?. et ??=`;

const CODE_CHALLENGE = `// Que vaut chaque ligne ?
let n = 7;
n += 3;
console.log(n);               // ?

console.log(17 % 5);          // ?
console.log(2 ** 10);         // ?
console.log(null ?? 0 ?? "x"); // ?
console.log(false || 0 || "ok"); // ?`;

function Ch02Operateurs() {
  return (
    <>
      <div className="chapter-tag">Chapitre 02 · Les Bases</div>
      <h1>Opérateurs<br />& <span className="highlight">Expressions</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-beginner">➕</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★☆☆☆</div>
          <h3>Opérateurs arithmétiques, d'assignation, de comparaison et logiques</h3>
          <p>Durée estimée : 20 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>
        Un opérateur est un symbole qui dit à JavaScript d'effectuer une opération sur une ou plusieurs valeurs. Tu les utilises en permanence : pour calculer, comparer, et combiner des conditions. Maîtriser les nuances entre ces opérateurs évite une large classe de bugs courants.
      </p>

      <h2>Opérateurs arithmétiques</h2>
      <CodeBlock language="javascript">{CODE_ARITHMETIC}</CodeBlock>

      <InfoBox type="tip">
        Le <strong>modulo</strong> (<code>%</code>) est très utile : tester si un nombre est pair (<code>n % 2 === 0</code>), faire une rotation dans un tableau (<code>index % tableau.length</code>), ou diviser du temps en heures/minutes.
      </InfoBox>

      <h2>Opérateurs d'assignation composés</h2>
      <p>
        Au lieu d'écrire <code>x = x + 5</code>, JavaScript propose une syntaxe raccourcie qui combine l'opérateur et l'assignation en une seule expression.
      </p>
      <CodeBlock language="javascript">{CODE_ASSIGNMENT}</CodeBlock>

      <h2>Opérateurs de comparaison</h2>
      <InfoBox type="warning">
        Toujours utiliser <code>===</code> (égalité stricte) plutôt que <code>==</code> (égalité laxiste). Le <code>==</code> fait des conversions de type imprévues !
      </InfoBox>
      <CodeBlock language="javascript">{CODE_COMPARISON}</CodeBlock>

      <h2>Opérateurs logiques</h2>
      <CodeBlock language="javascript">{CODE_LOGICAL}</CodeBlock>

      <InfoBox type="tip">
        <code>&&</code> et <code>||</code> ne retournent pas forcément un booléen — ils retournent <strong>l'une des deux valeurs</strong>. <code>a && b</code> retourne <code>a</code> si <code>a</code> est falsy, sinon <code>b</code>. C'est ce qui permet des patterns comme <code>isLoggedIn && showDashboard()</code>.
      </InfoBox>

      <Challenge>
        <p style={{ color: '#a0a0c0', fontSize: '14px' }}>
          Sans exécuter le code, prédis le résultat de chaque expression. Ensuite vérifie dans la console :
        </p>
        <CodeBlock language="javascript">{CODE_CHALLENGE}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 2,
  title: 'Opérateurs',
  icon: '➕',
  level: 'Débutant',
  stars: '★★☆☆☆',
  component: Ch02Operateurs,
  quiz: [
    {
      question: "Que vaut : 10 % 3 ?",
      sub: "L'opérateur modulo retourne le reste de la division",
      options: ["3", "1", "0", "3.33"],
      correct: 1,
      explanation: "✅ Correct ! 10 ÷ 3 = 3 reste 1. Le modulo (%) retourne le reste de la division euclidienne. Très utile pour tester la parité : n % 2 === 0 signifie que n est pair."
    },
    {
      question: "Pourquoi faut-il préférer === à == ?",
      sub: "Un des pièges classiques de JavaScript",
      options: [
        "=== est plus rapide",
        "=== compare aussi le type, évitant les conversions implicites",
        "== ne fonctionne pas avec les strings",
        "Il n'y a pas de différence"
      ],
      correct: 1,
      explanation: "✅ Exact ! === vérifie à la fois la valeur ET le type. 5 == '5' retourne true alors que 5 === '5' retourne false. Ces conversions silencieuses sont une source majeure de bugs."
    },
    {
      question: "let x = 10; x -= 3; x *= 2; — quelle est la valeur finale de x ?",
      sub: "Opérateurs d'assignation composés",
      options: ["14", "4", "20", "7"],
      correct: 0,
      explanation: "✅ Exact ! x commence à 10. x -= 3 donne 7. Puis x *= 2 donne 14. Les opérateurs composés appliquent l'opération et réassignent en une seule étape."
    }
  ]
};
