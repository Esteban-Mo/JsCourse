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

const CODE_COERCION = `// L'opérateur + : addition OU concaténation selon les types
1 + 2          // 3   (number + number = addition)
"1" + 2        // "12" (string + number = concaténation !)
1 + 2 + "3"   // "33" (évalué gauche à droite : 3 puis "3" → "33")
"1" + 2 + 3   // "123" (string dès le début : "1" + 2 → "12" + 3 → "123")

// Les autres opérateurs forcent la conversion en number
"5" - 2    // 3   (la string est convertie en number)
"5" * "2"  // 10  (les deux strings sont converties)
"cinq" - 1 // NaN (conversion impossible → Not a Number)`;

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

const CODE_NULLISH = `// Le piège de || avec des valeurs "falsy" légitimes
const volume = getUserVolume() || 50; // PROBLÈME !
// Si l'utilisateur a choisi 0, on lui impose 50 !

// La bonne solution avec ?? (nullish coalescing)
const volume2 = getUserVolume() ?? 50; // CORRECT
// 0 est accepté, seuls null et undefined déclenchent le fallback

// Valeurs falsy en JavaScript : false, 0, "", null, undefined, NaN
// Valeurs "nullish" (seulement) : null, undefined`;

const CODE_OPTIONAL_CHAINING = `// Sans optional chaining — code défensif verbeux
const ville = user && user.adresse && user.adresse.ville;

// Avec ?. — propre et concis (ES2020)
const ville = user?.adresse?.ville;
// Si user est null/undefined → ville = undefined (pas d'erreur !)
// Si user.adresse est null/undefined → même chose

// Fonctionne aussi avec les méthodes et les index
const premier = tableau?.[0];          // index
const result  = obj?.methode?.();      // appel de méthode`;

const CODE_PRECEDENCE = `// Précédence : * avant +, comme en maths
2 + 3 * 4    // 14 (pas 20 !)

// Utilise les parenthèses pour la clarté
(2 + 3) * 4  // 20 — intention explicite

// Précédence des opérateurs logiques : ! > && > ||
true || false && false  // true (pas false !)
// Équivalent à : true || (false && false)

// Conseil : dès que tu mixes && et ||, ajoute des parenthèses
(isAdmin || isModerator) && isActive  // clair et sans ambiguïté`;

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
        Un opérateur est un symbole qui dit à JavaScript d'effectuer une opération sur une ou plusieurs valeurs. Tu les utilises en permanence : pour calculer, comparer, et combiner des conditions. Maîtriser les nuances entre ces opérateurs évite une large classe de bugs courants — certains de ces pièges ont causé des incidents en production dans des applications réelles.
      </p>

      <h2>Opérateurs arithmétiques</h2>
      <p>
        Les opérateurs arithmétiques de base fonctionnent comme tu l'attends depuis l'école. Deux exceptions méritent attention : le <strong>modulo</strong> (<code>%</code>), qui retourne le <em>reste</em> d'une division (et non le quotient), et la <strong>puissance</strong> (<code>**</code>), ajoutée en ES2016 pour remplacer <code>Math.pow()</code>. L'incrémentation (<code>++</code>) existe en deux variantes : postfixe (<code>x++</code>, retourne l'ancienne valeur) et préfixe (<code>++x</code>, retourne la nouvelle valeur) — une distinction qui compte dans les expressions complexes.
      </p>
      <CodeBlock language="javascript">{CODE_ARITHMETIC}</CodeBlock>

      <InfoBox type="tip">
        Le <strong>modulo</strong> (<code>%</code>) est très utile : tester si un nombre est pair (<code>n % 2 === 0</code>), faire une rotation dans un tableau (<code>index % tableau.length</code>), ou diviser du temps en heures/minutes.
      </InfoBox>

      <h2>Opérateurs d'assignation composés</h2>
      <p>
        Au lieu d'écrire <code>x = x + 5</code>, JavaScript propose une syntaxe raccourcie qui combine l'opérateur et l'assignation en une seule expression. Ces formes condensées ne sont pas juste du sucre syntaxique cosmétique — elles rendent le code plus lisible en faisant ressortir l'intention : "je mets à jour cette variable", plutôt que "je lis cette variable, je l'additionne, et je la réassigne". Dans les boucles et accumulateurs, c'est le style universel.
      </p>
      <CodeBlock language="javascript">{CODE_ASSIGNMENT}</CodeBlock>

      <h2>Opérateurs de comparaison — <code>==</code> vs <code>===</code></h2>
      <p>
        JavaScript a <em>deux</em> opérateurs d'égalité, et cette dualité est l'une des sources de confusion les plus classiques du langage. L'opérateur <code>==</code> (égalité laxiste) existe depuis les origines de JS en 1995 et fait des <strong>conversions de type implicites</strong> avant de comparer. L'opérateur <code>===</code> (égalité stricte) a été ajouté plus tard précisément pour contourner ces comportements surprenants. Aujourd'hui, <code>==</code> n'est conservé que pour la rétrocompatibilité — tous les guides de style modernes (ESLint, Airbnb, Google) imposent <code>===</code> systématiquement.
      </p>
      <CodeBlock language="javascript">{CODE_COMPARISON}</CodeBlock>
      <InfoBox type="warning">
        Toujours utiliser <code>===</code> (égalité stricte) plutôt que <code>==</code> (égalité laxiste). Les conversions implicites de <code>==</code> suivent des règles complexes et contre-intuitives : <code>null == undefined</code> est <code>true</code>, <code>0 == false</code> est <code>true</code>, <code>"" == false</code> est <code>true</code>. Il faut mémoriser ces cas particuliers — ou simplement utiliser <code>===</code> et ne jamais se poser la question.
      </InfoBox>

      <h2>L'ambiguïté de <code>+</code> — addition ou concaténation ?</h2>
      <p>
        L'opérateur <code>+</code> fait deux choses très différentes selon les types de ses opérandes : il <strong>additionne</strong> des nombres, mais <strong>concatène</strong> des chaînes. Quand les types sont mixtes, JavaScript applique la <em>coercition de type</em> : il convertit les valeurs pour les rendre compatibles. La règle est simple mais ses conséquences peuvent surprendre — dès qu'un des opérandes est une string, l'autre est converti en string et les deux sont concaténés.
      </p>
      <p>
        Ce comportement s'explique par l'ordre d'évaluation gauche-à-droite et la priorité donnée à la string : JavaScript voit <code>+</code> comme "si l'un des deux est une string, colle-les ensemble". Les autres opérateurs arithmétiques (<code>-</code>, <code>*</code>, <code>/</code>) n'ont pas ce problème — ils forcent toujours la conversion en number.
      </p>
      <CodeBlock language="javascript">{CODE_COERCION}</CodeBlock>
      <InfoBox type="danger">
        Le piège classique : <code>console.log("résultat : " + a + b)</code> avec <code>a=1, b=2</code> affiche <code>"résultat : 12"</code> et non <code>"résultat : 3"</code>. Solution : utiliser les template literals — <code>{`\`résultat : \${a + b}\``}</code> — ou forcer l'addition en premier avec des parenthèses : <code>"résultat : " + (a + b)</code>.
      </InfoBox>

      <h2>Opérateurs logiques — ils retournent une valeur, pas juste un booléen</h2>
      <p>
        Un point crucial que beaucoup de débutants ignorent : <code>&amp;&amp;</code> et <code>||</code> ne retournent pas toujours <code>true</code> ou <code>false</code>. Ils retournent <strong>l'une des deux valeurs d'origine</strong>. C'est ce qu'on appelle l'évaluation en <em>court-circuit</em> : JavaScript évalue les opérandes de gauche à droite et s'arrête dès qu'il peut déterminer le résultat — en retournant la dernière valeur évaluée. C'est un comportement intentionnel, très utilisé en pratique.
      </p>
      <CodeBlock language="javascript">{CODE_LOGICAL}</CodeBlock>
      <InfoBox type="tip">
        <code>&amp;&amp;</code> et <code>||</code> ne retournent pas forcément un booléen — ils retournent <strong>l'une des deux valeurs</strong>. <code>a &amp;&amp; b</code> retourne <code>a</code> si <code>a</code> est falsy, sinon <code>b</code>. C'est ce qui permet des patterns comme <code>isLoggedIn &amp;&amp; showDashboard()</code> — la fonction n'est appelée que si la condition est vraie.
      </InfoBox>

      <h2>Nullish Coalescing <code>??</code> vs <code>||</code> — un piège fréquent</h2>
      <p>
        Le piège de <code>||</code> pour les valeurs par défaut est subtil mais courant : <code>||</code> se déclenche pour toutes les valeurs <em>falsy</em> (<code>0</code>, <code>""</code>, <code>false</code>, <code>null</code>, <code>undefined</code>). Mais <code>0</code>, une chaîne vide ou <code>false</code> peuvent être des valeurs <em>intentionnelles et valides</em> saisies par l'utilisateur. L'opérateur <code>??</code> (nullish coalescing, ES2020) résout exactement ce problème : il ne se déclenche que si la valeur est <code>null</code> ou <code>undefined</code>.
      </p>
      <CodeBlock language="javascript">{CODE_NULLISH}</CodeBlock>
      <InfoBox type="warning">
        Règle pratique : utilise <code>||</code> quand tu veux un fallback pour toute valeur "vide ou absente" (booléen, chaîne vide, zéro inclus). Utilise <code>??</code> quand tu veux un fallback uniquement pour l'<strong>absence de valeur</strong> (<code>null</code>/<code>undefined</code>), tout en acceptant <code>0</code>, <code>""</code> ou <code>false</code> comme valeurs légitimes.
      </InfoBox>

      <h2>Optional Chaining <code>?.</code> — accès sécurisé aux objets imbriqués</h2>
      <p>
        Accéder à une propriété d'un objet qui peut être <code>null</code> ou <code>undefined</code> lance une <code>TypeError</code> — l'une des erreurs les plus fréquentes en JavaScript. Avant ES2020, la parade était d'écrire des chaînes de conditions défensives très verbeuses. L'opérateur <code>?.</code> (optional chaining) rend ce code à la fois plus court et plus lisible : si la valeur à gauche est <code>null</code> ou <code>undefined</code>, l'expression entière court-circuite et retourne <code>undefined</code> sans lancer d'erreur.
      </p>
      <CodeBlock language="javascript">{CODE_OPTIONAL_CHAINING}</CodeBlock>

      <h2>Précédence des opérateurs — utilise les parenthèses</h2>
      <p>
        Comme en mathématiques, les opérateurs ont des priorités différentes : <code>*</code> et <code>/</code> sont évalués avant <code>+</code> et <code>-</code>, et <code>!</code> est évalué avant <code>&amp;&amp;</code>, qui est évalué avant <code>||</code>. Ces règles peuvent mener à des résultats inattendus quand on mélange plusieurs opérateurs dans la même expression. La solution universelle : utiliser des <strong>parenthèses</strong> pour rendre l'intention explicite, même quand elles ne sont pas strictement nécessaires. Le code est lu bien plus souvent qu'il n'est écrit.
      </p>
      <CodeBlock language="javascript">{CODE_PRECEDENCE}</CodeBlock>
      <InfoBox type="tip">
        Un compilateur JavaScript et un lecteur humain peuvent interpréter la même expression différemment si la précédence n'est pas explicite. Les parenthèses sont gratuites — ajoute-les chaque fois que tu mélanges <code>&amp;&amp;</code> et <code>||</code>, ou des opérations arithmétiques dans une condition. La clarté vaut plus que la concision.
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
      explanation: "✅ Exact ! 10 ÷ 3 = 3 reste 1. Le modulo (%) retourne le reste de la division euclidienne. Très utile pour tester la parité : n % 2 === 0 signifie que n est pair."
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
    },
    {
      question: "Que vaut l'expression : 3 + 4 * 2 ?",
      sub: "Précédence des opérateurs",
      options: ["14", "10", "11", "24"],
      correct: 0,
      explanation: "✅ Exact ! La multiplication a une précédence plus haute que l'addition, comme en mathématiques. 4 * 2 = 8 est évalué en premier, puis 3 + 8 = 11. Attention : 3 + 4 * 2 vaut 11, pas 14 !"
    },
    {
      question: "Quelle est la valeur de : false || 0 || '' || 'bonjour' ?",
      sub: "Court-circuit avec ||",
      options: ['"bonjour"', "false", "0", '""'],
      correct: 0,
      explanation: "✅ Exact ! || retourne la première valeur truthy trouvée. false, 0 et '' sont tous falsy, donc l'évaluation continue. 'bonjour' est truthy — c'est lui qui est retourné. Si toutes les valeurs étaient falsy, la dernière serait retournée."
    },
    {
      question: "Quelle est la différence entre 0 ?? 'défaut' et 0 || 'défaut' ?",
      sub: "Nullish coalescing ?? vs OU logique ||",
      options: [
        "Les deux retournent 'défaut' car 0 est falsy",
        "?? retourne 0 car 0 n'est pas null/undefined ; || retourne 'défaut' car 0 est falsy",
        "Les deux retournent 0",
        "?? retourne 'défaut' ; || retourne 0"
      ],
      correct: 1,
      explanation: "✅ Parfait ! ?? ne se déclenche que pour null et undefined. 0 n'est ni l'un ni l'autre, donc 0 ?? 'défaut' retourne 0. En revanche, || se déclenche pour toute valeur falsy, donc 0 || 'défaut' retourne 'défaut'."
    },
    {
      question: "Que retourne : true && 'hello' && 42 ?",
      sub: "Évaluation en court-circuit avec &&",
      options: ["true", '"hello"', "42", "false"],
      correct: 2,
      explanation: "✅ Exact ! && retourne la première valeur falsy trouvée, ou la dernière valeur si toutes sont truthy. true est truthy → on continue. 'hello' est truthy → on continue. 42 est la dernière valeur, on la retourne. Résultat : 42."
    },
    {
      question: "Que fait l'opérateur ||= dans : let a = null; a ||= 'défaut'; ?",
      sub: "Opérateurs d'assignation logiques",
      options: [
        "Cela lève une SyntaxError, ||= n'existe pas",
        "a vaut toujours null car on ne peut pas assigner à null",
        "a vaut 'défaut' car null est falsy — ||= assigne uniquement si la valeur actuelle est falsy",
        "a vaut true"
      ],
      correct: 2,
      explanation: "✅ Exact ! ||= (ES2021) est un raccourci pour a = a || 'défaut'. Si a est falsy (ici null), a prend la valeur 'défaut'. Si a avait été truthy (ex: 'existant'), l'assignation n'aurait pas eu lieu."
    }
  ]
};
