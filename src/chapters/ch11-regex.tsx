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

const codeBacktracking = `// Pattern vulnérable au backtracking catastrophique
// Ne jamais écrire des patterns comme : /(a+)+$/
// Sur la chaîne "aaaaaaaaaaaaaab", le moteur essaie des milliers
// de combinaisons avant de conclure à l'échec — c'est exponentiel !

// Version sûre : être précis sur ce qu'on veut matcher
/^a+b$/  // correct et efficace`;

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

      <p>
        Une expression régulière (<em>regex</em>) est un <strong>langage de description de motifs</strong> — un mini-programme qui définit un ensemble de chaînes de caractères. Sous le capot, le moteur de regex construit un <em>automate fini</em> qui parcourt la chaîne caractère par caractère, testant si le motif correspond. C'est un outil universel présent dans tous les langages — inventé dans les années 1950 par le mathématicien Stephen Kleene, et toujours aussi indispensable aujourd'hui.
      </p>
      <p>
        Pourquoi apprendre les regex ? Imagine que tu dois extraire tous les numéros de téléphone d'un texte libre, ou valider qu'une adresse email a le bon format, ou transformer du texte en masse. Sans regex, tu écrirais des dizaines de lignes de code avec des boucles, des indexOf, des substring — fragiles et difficiles à maintenir. Avec une regex, c'est souvent une seule ligne. La courbe d'apprentissage est raide, mais l'investissement est rentable très rapidement.
      </p>

      <h2>Créer une regex — littérale ou constructeur ?</h2>
      <p>
        Il existe deux syntaxes pour créer une regex en JavaScript. La <strong>syntaxe littérale</strong> (<code>/pattern/flags</code>) est compilée lors du chargement du script — elle est plus rapide et plus lisible pour les patterns statiques, et c'est celle que tu utiliseras la grande majorité du temps. Le <strong>constructeur</strong> (<code>new RegExp(pattern, flags)</code>) est nécessaire quand le pattern est dynamique — quand tu construis la regex à partir d'une variable ou d'une entrée utilisateur. Attention : dans ce cas, les backslashes doivent être doublés (<code>\\\\d</code> pour matcher un chiffre) puisque la string les interprète d'abord.
      </p>
      <CodeBlock language="javascript">{codeCreer}</CodeBlock>
      <InfoBox type="tip">
        Les flags les plus utilisés : <code>g</code> (global — trouve toutes les occurrences, pas seulement la première), <code>i</code> (insensible à la casse), <code>m</code> (multiline — <code>^</code> et <code>$</code> matchent le début/fin de chaque ligne), et <code>s</code> (dotAll — le point <code>.</code> matche aussi les sauts de ligne). On les combine librement : <code>/pattern/gim</code>.
      </InfoBox>

      <h2>Syntaxe des patterns — les briques de base</h2>
      <p>
        Un pattern regex est composé de <strong>métacaractères</strong> (symboles avec une signification spéciale) et de caractères littéraux. Les classes de caractères prédéfinies (<code>\d</code>, <code>\w</code>, <code>\s</code>) sont des raccourcis pour des ensembles communs. Les crochets (<code>[]</code>) définissent tes propres classes. Les <strong>ancres</strong> (<code>^</code>, <code>$</code>, <code>\b</code>) ne matchent pas des caractères mais des <em>positions</em> dans la chaîne — une distinction cruciale pour la validation.
      </p>
      <CodeBlock language="javascript">{codePatterns1}</CodeBlock>

      <h2>Quantificateurs — greedy vs lazy</h2>
      <p>
        Les quantificateurs contrôlent <em>combien de fois</em> un élément doit apparaître. Par défaut, ils sont <strong>greedy</strong> (gourmands) : ils capturent le maximum possible. Ajouter <code>?</code> après un quantificateur le rend <strong>lazy</strong> (paresseux) : il capture le minimum possible. Cette distinction est cruciale pour parser du HTML, du JSON, ou tout format où les délimiteurs peuvent se répéter — un quantificateur greedy avalera tout jusqu'au dernier délimiteur, alors qu'un lazy s'arrêtera au premier.
      </p>
      <CodeBlock language="javascript">{codePatterns2}</CodeBlock>
      <InfoBox type="warning">
        Ne parse jamais du HTML complexe avec des regex — utilise un vrai parser DOM (<code>DOMParser</code>). Les regex restent utiles pour des cas simples et bien délimités, mais le HTML réel peut avoir des imbrications arbitraires que les regex ne peuvent pas gérer correctement.
      </InfoBox>

      <h2>Méthodes — String et RegExp sont deux mondes</h2>
      <p>
        Une source de confusion fréquente : les méthodes de manipulation de regex sont réparties entre l'objet <code>String</code> et l'objet <code>RegExp</code>, pour des raisons historiques. <code>test()</code> et <code>exec()</code> sont des méthodes de la regex (<code>regex.test(str)</code>). <code>match()</code>, <code>matchAll()</code>, <code>replace()</code>, <code>search()</code> et <code>split()</code> sont des méthodes de la string (<code>str.match(regex)</code>). Cette asymétrie est héritée de JavaScript 1.0 et n'a jamais été corrigée pour ne pas casser l'existant.
      </p>
      <CodeBlock language="javascript">{codeMethodes}</CodeBlock>

      <h2>Groupes &amp; Captures — extraire, pas juste valider</h2>
      <p>
        Les groupes capturants (avec des parenthèses <code>()</code>) permettent de ne pas juste <em>détecter</em> un motif, mais d'en <em>extraire</em> des parties. C'est l'une des fonctionnalités les plus puissantes des regex — et la plus sous-utilisée. Un groupe numéroté (<code>$1</code>, <code>$2</code>) est accessible par position, mais ça devient vite fragile si tu modifies le pattern. Les <strong>groupes nommés</strong> (<code>?&lt;nom&gt;</code>, ES2018) sont bien supérieurs : le nom est explicite, l'ordre importe peu, et le code est auto-documenté. Les <strong>groupes non-capturants</strong> (<code>?:</code>) servent à grouper des parties du pattern pour les quantificateurs ou les alternatives, sans polluer les résultats capturés.
      </p>
      <CodeBlock language="javascript">{codeGroupes}</CodeBlock>
      <InfoBox type="tip">
        Préfère toujours les <strong>groupes nommés</strong> (<code>?&lt;annee&gt;</code>) aux groupes numérotés (<code>$1</code>) dans le code de production. Si tu ajoutes un groupe au milieu du pattern plus tard, tous les numéros décalent et tu introduis un bug silencieux. Avec les noms, rien ne change.
      </InfoBox>

      <h2>Cas d'usage pratiques</h2>
      <p>
        Les regex brillent dans un ensemble précis de tâches : validation de formats (email, téléphone, code postal), extraction de données structurées dans du texte libre, et transformations de texte en masse. Pour chacun de ces cas, une regex bien écrite remplace facilement 20-30 lignes de code impératif.
      </p>
      <CodeBlock language="javascript">{codePratique}</CodeBlock>
      <InfoBox type="warning">
        <strong>Ne pas valider les emails avec une regex complexe.</strong> Une regex qui valide correctement TOUS les emails légaux selon la RFC 5321 est extraordinairement complexe (plusieurs centaines de caractères). La regex simplifiée ci-dessus filtre les cas évidents, mais elle acceptera des emails invalides et en rejettera des valides. Pour une vraie validation, envoie un email de confirmation — c'est la seule méthode fiable.
      </InfoBox>

      <h2>Danger — le backtracking catastrophique</h2>
      <p>
        Les regex peuvent être dangereuses pour les performances. Le phénomène de <strong>backtracking catastrophique</strong> arrive quand un pattern ambigu force le moteur à explorer exponentiellement de combinaisons avant de conclure à un échec. Sur une chaîne suffisamment longue, cela peut bloquer le thread JavaScript pendant des secondes — voire des minutes. C'est une vulnérabilité réelle, connue sous le nom de <em>ReDoS</em> (Regular Expression Denial of Service). Les patterns les plus risqués contiennent des groupes répétés imbriqués.
      </p>
      <CodeBlock language="javascript">{codeBacktracking}</CodeBlock>
      <InfoBox type="danger">
        N'utilise jamais des patterns avec des quantificateurs imbriqués ambigus (<code>(a+)+</code>, <code>(.*)*</code>) sur des données contrôlées par l'utilisateur. Si la chaîne est malformée, le moteur peut entrer dans une boucle quasi-infinie. Pour les inputs utilisateur, teste toujours tes regex avec des chaînes longues et malformées, ou utilise un outil d'analyse de regex comme <code>safe-regex</code>.
      </InfoBox>

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
  id: 11,
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
    },
    {
      question: "Quelle est la différence entre les quantificateurs greedy et lazy ? Que retourne '<b>un</b> et <b>deux</b>'.match(/<b>.*<\\/b>/) ?",
      sub: "Quantificateurs greedy vs lazy",
      options: [
        "['<b>un</b>'] — le moteur s'arrête au premier </b> rencontré",
        "['<b>un</b> et <b>deux</b>'] — le moteur capture le maximum possible",
        "['<b>un</b>', '<b>deux</b>'] — deux matches distincts",
        "null — le pattern ne matche pas"
      ],
      correct: 1,
      explanation: "✅ Exact ! Par défaut les quantificateurs sont greedy (gourmands) : .* capture le maximum possible avant de reculer. Il va donc de <b> jusqu'au dernier </b>, englobant tout le texte intermédiaire. Pour capturer seulement '<b>un</b>', il faut rendre le quantificateur lazy avec .*? : /<b>.*?<\\/b>/."
    },
    {
      question: "Que fait l'assertion lookahead (?=...) dans une regex ?",
      sub: "Assertions lookahead",
      options: [
        "Elle capture le texte entre parenthèses comme un groupe numéroté",
        "Elle vérifie que le motif est précédé d'une certaine séquence (lookbehind)",
        "Elle vérifie que ce qui suit la position courante correspond au motif, sans consommer de caractères",
        "Elle rend le groupe non-capturant"
      ],
      correct: 2,
      explanation: "✅ Exact ! Un lookahead positif (?=...) est une assertion de position : il vérifie que le texte suivant correspond au motif donné, mais ne 'consomme' pas ces caractères (ils ne font pas partie du match). Par exemple /\\d+(?=€)/ matche les chiffres suivis d'un €, mais le € n'est pas inclus dans le résultat."
    },
    {
      question: "Quelle est la différence entre String.prototype.match() avec le flag /g et RegExp.prototype.exec() ?",
      sub: "match() vs exec()",
      options: [
        "Aucune différence, ils retournent toujours les mêmes résultats",
        "match(/g) retourne un tableau simple de toutes les correspondances sans les groupes capturés, exec() itère match par match en préservant les groupes et l'index",
        "exec() est déprécié et ne doit plus être utilisé",
        "match() fonctionne uniquement sur les strings, exec() uniquement sur les RegExp"
      ],
      correct: 1,
      explanation: "✅ Exact ! str.match(/pattern/g) retourne un tableau de toutes les correspondances mais perd les groupes capturés et l'index. regex.exec(str) retourne un objet complet (match, groupes, index) pour une correspondance à la fois — on l'appelle en boucle pour itérer. Pour avoir groupes + toutes les correspondances, préfère str.matchAll(/pattern/g)."
    },
    {
      question: "Que permet la syntaxe de groupe nommé (?<nom>...) dans une regex ?",
      sub: "Groupes nommés en ES2018",
      options: [
        "Donner un alias à toute la regex pour la réutiliser",
        "Accéder à la valeur capturée par son nom via result.groups.nom plutôt que par son index numérique",
        "Rendre le groupe optionnel",
        "Empêcher le groupe d'être capturé dans les résultats"
      ],
      correct: 1,
      explanation: "✅ Exact ! Les groupes nommés (?<nom>...) introduits en ES2018 permettent d'accéder aux valeurs capturées par leur nom dans result.groups.nom. C'est bien supérieur aux groupes numérotés ($1, $2) car si tu modifies le pattern et ajoutes un groupe, les noms restent stables alors que les numéros décalent."
    },
    {
      question: "Que matche \\b dans une regex, et pourquoi /\\bJS\\b/ ne matche PAS 'JSON' ?",
      sub: "Ancre de limite de mot \\b",
      options: [
        "\\b matche un espace blanc — 'JSON' n'a pas d'espace après 'JS'",
        "\\b matche une frontière entre un caractère de mot (\\w) et un non-mot — 'JSON' a 'O' (\\w) après 'JS', donc pas de frontière",
        "\\b matche le début de la chaîne uniquement",
        "\\b matche le caractère de retour arrière (backspace)"
      ],
      correct: 1,
      explanation: "✅ Exact ! \\b est une ancre de frontière de mot : elle matche la position entre un caractère \\w (lettre, chiffre, _) et un caractère \\W (non-mot) ou le début/fin de chaîne. Dans 'JSON', après 'JS' vient 'O' qui est \\w, donc il n'y a pas de frontière de mot — /\\bJS\\b/ ne matche pas. Il matcherait 'JS est cool' ou 'apprends JS' car 'S' est suivi d'un espace."
    }
  ]
};
