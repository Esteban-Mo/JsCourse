import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeCreer = `// Syntaxe littérale (recommandée) — compilée au chargement
const re1 = /bonjour/;
const re2 = /bonjour/i; // flag i = insensible à la casse

// Constructeur RegExp — utile si le pattern est dynamique
const mot = "hello";
const re3 = new RegExp(mot, "i"); // équivalent à /hello/i

// Flags principaux
// g — global : trouve TOUTES les occurrences (pas seulement la 1ère)
// i — insensible à la casse
// m — multiline : ^ et $ matchent début/fin de chaque ligne
// s — dotAll : . correspond aussi aux sauts de ligne`;

const codePatterns1 = `// Classes de caractères prédéfinies
/\\d/    // chiffre 0-9
/\\D/    // non-chiffre
/\\w/    // caractère de mot : [a-zA-Z0-9_]
/\\W/    // non-mot
/\\s/    // espace blanc (espace, tab, newline)
/./     // n'importe quel caractère sauf \\n

// Classes personnalisées avec crochets
/[aeiou]/    // une voyelle
/[a-z]/      // une lettre minuscule
/[^0-9]/     // tout sauf un chiffre (^ = négation)

// Ancres
/^Bonjour/   // commence par "Bonjour"
/monde$/     // finit par "monde"
/\\bJS\\b/   // mot entier "JS" (word boundary)`;

const codePatterns2 = `// Quantificateurs
/a?/      // 0 ou 1 fois
/a*/      // 0 ou plusieurs fois
/a+/      // 1 ou plusieurs fois
/a{3}/    // exactement 3 fois
/a{2,4}/  // entre 2 et 4 fois
/a{2,}/   // 2 fois ou plus

// Greedy vs Lazy (? après le quantificateur)
const html = "<b>texte</b>";
html.match(/<.*>/);   // greedy → "<b>texte</b>" (capture tout)
html.match(/<.*?>/);  // lazy  → "<b>" (minimum possible)`;

const codeMethodes = `const str = "JS est super, js aussi !";

// test() — retourne un booléen
/super/.test(str);  // true

// match() — premier match (ou tous avec /g)
str.match(/js/i);   // ["JS", index: 0, ...]
str.match(/js/gi);  // ["JS", "js"]

// matchAll() — itérateur de TOUS les matches avec groupes
const matches = [...str.matchAll(/js/gi)];
// → [{0:"JS", index:0}, {0:"js", index:14}]

// replace() — remplacer (1ère occurrence sans /g)
str.replace(/js/gi, "JavaScript");
// → "JavaScript est super, JavaScript aussi !"

// search() — index du premier match
str.search(/super/);  // 9

// split() avec une regex
"un,deux;trois".split(/[,;]/);  // ["un", "deux", "trois"]`;

const codeGroupes = `// Groupes capturants () — extraire des sous-valeurs
const date = "2024-03-15";
const [, annee, mois, jour] = date.match(/(\\d{4})-(\\d{2})-(\\d{2})/);
// annee = "2024", mois = "03", jour = "15"

// Groupes nommés (?<nom>) — ES2018
const { groups } = date.match(/(?<a>\\d{4})-(?<m>\\d{2})-(?<j>\\d{2})/);
// groups = { a: "2024", m: "03", j: "15" }

// Groupes non-capturants (?:) — groupe sans capturer
/(?:https?)/  // groupe pour l'alternance, résultat non capturé

// Lookahead (?=) — match si suivi de...
/\\d+(?=€)/.exec("42€");    // ["42"] (sans le €)

// Lookbehind (?<=) — match si précédé de...
/(?<=€)\\d+/.exec("€42");   // ["42"] (sans le €)`;

const codePratique = `// Validation email (simplifiée)
const emailRe = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
emailRe.test("user@example.com");  // true
emailRe.test("invalid@");           // false

// Validation mot de passe (≥8 chars, 1 chiffre, 1 majuscule)
const mdpRe = /^(?=.*\\d)(?=.*[A-Z]).{8,}$/;
mdpRe.test("Secret42");  // true
mdpRe.test("secret");    // false

// Extraction de hashtags
const tweet = "Apprends #JavaScript et #TypeScript !";
tweet.match(/#\\w+/g);
// → ["#JavaScript", "#TypeScript"]

// camelCase → kebab-case
"maVariableJS".replace(/([A-Z])/g, "-$1").toLowerCase();
// → "ma-variable-j-s"

// Normaliser des numéros de téléphone
const telRe = /(\\d{2})[\\s\\-]?(\\d{2})[\\s\\-]?(\\d{2})[\\s\\-]?(\\d{2})[\\s\\-]?(\\d{2})/;
"06 12 34 56 78".replace(telRe, "$1.$2.$3.$4.$5");
// → "06.12.34.56.78"`;

const codeChallenge = `const s = "abc 123 def 456";
console.log(s.match(/\\d+/));    // ["123", index: 4, ...]
console.log(s.match(/\\d+/g));   // ["123", "456"]
console.log(/^\\d/.test(s));     // false (commence par "a")
console.log(s.replace(/\\d+/g, "X")); // "abc X def X"

// Extraire l'année depuis "Publié le 2024-03-15"
const msg = "Publié le 2024-03-15";
const [, annee] = msg.match(/(\\d{4})/); // annee = "2024"`;

function Ch08Regex() {
  return (
    <>
      <div className="chapter-tag">Chapitre 08 · Regex</div>
      <h1>Expressions<br /><span className="highlight">Régulières</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-intermediate">🔍</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★☆☆</div>
          <h3>Patterns, groupes capturants, validation et extraction de données</h3>
          <p>Durée estimée : 30 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Une expression régulière (<em>regex</em>) est un motif qui décrit un ensemble de chaînes de caractères. Elle sert à valider, rechercher, extraire ou transformer du texte. C'est un outil universel présent dans tous les langages — et incontournable en JavaScript.</p>

      <h2>Créer une regex</h2>

      <CodeBlock language="javascript">{codeCreer}</CodeBlock>

      <h2>Syntaxe des patterns</h2>

      <CodeBlock language="javascript">{codePatterns1}</CodeBlock>

      <CodeBlock language="javascript">{codePatterns2}</CodeBlock>

      <h2>Méthodes</h2>

      <CodeBlock language="javascript">{codeMethodes}</CodeBlock>

      <h2>Groupes &amp; Captures</h2>

      <CodeBlock language="javascript">{codeGroupes}</CodeBlock>

      <h2>Cas d'usage pratiques</h2>

      <CodeBlock language="javascript">{codePratique}</CodeBlock>

      <InfoBox type="tip">
        Pour tester et visualiser tes regex en temps réel, utilise <strong>regex101.com</strong> — il affiche les groupes capturés, explique chaque partie du pattern, et propose des alternatives. Indispensable pour les regex complexes.
      </InfoBox>

      <Challenge title="Défi : Prédire les résultats">
        <p>Sans exécuter, prédis le résultat de chaque expression :</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 8,
  title: 'Expressions Régulières',
  icon: '🔍',
  level: 'Intermédiaire',
  stars: '★★★☆☆',
  component: Ch08Regex,
  quiz: [
    {
      question: "Quelle est la différence entre /\\d+/ et /^\\d+$/ ?",
      sub: "Rôle des ancres ^ et $",
      options: [
        "Aucune différence",
        "/\\d+/ trouve des chiffres n'importe où dans la chaîne, /^\\d+$/ exige que TOUTE la chaîne soit des chiffres",
        "/^\\d+$/ trouve plusieurs occurrences",
        "^ et $ signifient 'début de chiffre' et 'fin de chiffre'"
      ],
      correct: 1,
      explanation: "✅ Exact ! /\\d+/ matcherait '42' dans 'abc42def'. /^\\d+$/ n'accepte que les chaînes composées uniquement de chiffres. ^ ancre au début, $ ancre à la fin — ensemble ils forcent le match sur la chaîne entière. Indispensable pour la validation."
    },
    {
      question: "Que retourne 'JS est super'.match(/\\w+/g) ?",
      sub: "Le flag /g et match()",
      options: [
        "['JS']",
        "null",
        "['JS', 'est', 'super']",
        "['JS est super']"
      ],
      correct: 2,
      explanation: "✅ Exact ! Avec le flag g, match() retourne un tableau de TOUTES les occurrences. \\w+ correspond à un ou plusieurs caractères de mot (lettres, chiffres, _). Les espaces ne matchent pas \\w, donc la phrase est découpée en 3 mots."
    },
    {
      question: "Quelle est la différence entre un groupe capturant () et non-capturant (?:) ?",
      sub: "Groupes dans les regex",
      options: [
        "() est plus lent que (?:)",
        "() capture la valeur dans les résultats, (?:) groupe sans capturer",
        "(?:) est une négation",
        "Il n'y a pas de différence fonctionnelle"
      ],
      correct: 1,
      explanation: "✅ Exact ! () capture le contenu et le rend accessible dans match()/exec() comme groupe numéroté (ou nommé avec ?<nom>). (?:) groupe des parties du pattern pour les quantificateurs ou alternatives, sans capturer. Utilise (?:) quand tu n'as pas besoin de la valeur — légèrement plus performant."
    }
  ]
};
