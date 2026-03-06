import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch22() {
  return (
    <>
      <div className="chapter-tag">Intermédiaire</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-intermediate">🔤</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">⭐⭐</div>
          <h3>Manipulation de chaînes</h3>
          <p>Méthodes essentielles pour traiter, rechercher et transformer du texte</p>
        </div>
      </div>

      <h2>Recherche dans une chaîne</h2>
      <p>
        Plusieurs méthodes permettent de tester la présence d'un texte sans avoir recours aux regex.
      </p>
      <CodeBlock language="javascript">{`const email = 'contact@example.com';

// includes() — contient un sous-texte ?
email.includes('@');          // true
email.includes('gmail');      // false

// startsWith() / endsWith()
email.startsWith('contact');  // true
email.endsWith('.com');       // true
email.endsWith('.fr');        // false

// indexOf() — position ou -1
email.indexOf('@');           // 7
email.indexOf('xyz');         // -1

// Recherche insensible à la casse
const texte = 'Bonjour Monde';
texte.toLowerCase().includes('monde'); // true`}</CodeBlock>

      <h2>Extraction : slice() et substring()</h2>
      <p>
        Les deux extraient une portion de chaîne, mais <code>slice()</code> accepte
        les <strong>indices négatifs</strong> (depuis la fin).
      </p>
      <CodeBlock language="javascript">{`const str = 'JavaScript';
//            0123456789

str.slice(0, 4);      // 'Java'
str.slice(4);         // 'Script'
str.slice(-6);        // 'Script' (6 depuis la fin)
str.slice(-6, -3);    // 'Scr'

str.substring(0, 4);  // 'Java'
str.substring(4);     // 'Script'
// substring() ignore les négatifs (les traite comme 0)
str.substring(-6);    // 'JavaScript'  ← différence !

// Cas pratique : extraire une extension de fichier
const fichier = 'document.pdf';
const ext = fichier.slice(fichier.lastIndexOf('.') + 1); // 'pdf'`}</CodeBlock>

      <h2>Remplacement : replace() et replaceAll()</h2>
      <CodeBlock language="javascript">{`const phrase = 'Le chat mange le chat du voisin.';

// replace() — remplace la PREMIÈRE occurrence
phrase.replace('chat', 'chien');
// 'Le chien mange le chat du voisin.'

// replaceAll() — remplace TOUTES les occurrences
phrase.replaceAll('chat', 'chien');
// 'Le chien mange le chien du voisin.'

// Avec une regex (insensible à la casse)
'Bonjour BONJOUR bonjour'.replace(/bonjour/gi, 'Salut');
// 'Salut Salut Salut'

// Avec une fonction de remplacement
'prix: 100€, remise: 20€'.replace(/(\d+)€/g, (match, n) => \`\${n * 1.1}€\`);
// 'prix: 110€, remise: 22€'`}</CodeBlock>

      <h2>split() et join() — conversion tableau</h2>
      <p>
        <code>split()</code> découpe une chaîne en tableau.
        <code>join()</code> fait l'inverse. Ils se complètent parfaitement.
      </p>
      <CodeBlock language="javascript">{`// split() — découper
'Alice,Bob,Carol'.split(',');     // ['Alice', 'Bob', 'Carol']
'Bonjour monde'.split(' ');       // ['Bonjour', 'monde']
'abc'.split('');                  // ['a', 'b', 'c']
'hello'.split('', 3);             // ['h', 'e', 'l'] — limite

// join() — assembler
['Alice', 'Bob', 'Carol'].join(', ');  // 'Alice, Bob, Carol'
['2024', '03', '15'].join('-');        // '2024-03-15'

// Pipeline : inverser les mots d'une phrase
const inversé = 'Bonjour le monde'
  .split(' ')
  .reverse()
  .join(' ');
// 'monde le Bonjour'

// Nettoyer et normaliser du CSV
const csv = ' Alice , 25 , Paris ';
const champs = csv.split(',').map(s => s.trim());
// ['Alice', '25', 'Paris']`}</CodeBlock>

      <h2>Nettoyage : trim() et padding</h2>
      <CodeBlock language="javascript">{`// trim — supprimer les espaces aux extrémités
'  Bonjour  '.trim();       // 'Bonjour'
'  Bonjour  '.trimStart();  // 'Bonjour  '
'  Bonjour  '.trimEnd();    // '  Bonjour'

// padStart / padEnd — remplir à une longueur donnée
'5'.padStart(3, '0');   // '005'
'42'.padStart(5, '0');  // '00042'
'Hi'.padEnd(5, '!');    // 'Hi!!!'

// Cas pratique : formater des heures
const h = 9, m = 5;
const heure = \`\${String(h).padStart(2,'0')}:\${String(m).padStart(2,'0')}\`;
// '09:05'

// repeat()
'-'.repeat(20);  // '--------------------'
'ab'.repeat(3);  // 'ababab'`}</CodeBlock>

      <h2>Template literals avancés</h2>
      <p>
        Les <strong>tagged templates</strong> permettent de traiter un template literal
        avec une fonction personnalisée — utilisés dans les libs CSS-in-JS, GraphQL, SQL, etc.
      </p>
      <CodeBlock language="javascript">{`// Tag function — reçoit un tableau de strings et les interpolations
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const val = values[i - 1];
    return result + (val !== undefined ? \`**\${val}**\` : '') + str;
  });
}

const nom = 'Alice';
const age = 30;
highlight\`Bonjour \${nom}, tu as \${age} ans.\`;
// 'Bonjour **Alice**, tu as **30** ans.'

// Exemple réel : sanitiser du HTML
function safeHtml(strings, ...values) {
  const escaped = values.map(v =>
    String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  );
  return strings.reduce((r, s, i) => r + (escaped[i - 1] ?? '') + s);
}

const userInput = '<script>alert("xss")</script>';
safeHtml\`<p>Contenu : \${userInput}</p>\`;
// '<p>Contenu : &lt;script&gt;alert("xss")&lt;/script&gt;</p>'`}</CodeBlock>

      <InfoBox type="tip">
        Les méthodes de String sont <strong>non-mutantes</strong> — elles retournent toujours
        une nouvelle chaîne. Les chaînes JavaScript sont immuables.
      </InfoBox>

      <h2>Méthodes utiles diverses</h2>
      <CodeBlock language="javascript">{`// Changement de casse
'bonjour'.toUpperCase();  // 'BONJOUR'
'MONDE'.toLowerCase();    // 'monde'

// Normalisation (accents)
'café'.normalize('NFD').replace(/\p{Mn}/gu, ''); // 'cafe'

// at() — accès avec indices négatifs (ES2022)
'Hello'.at(0);   // 'H'
'Hello'.at(-1);  // 'o'

// String.raw — pour les chemins Windows ou regex sans échappement
String.raw\`C:\Users\Alice\n\`;  // 'C:\\Users\\Alice\\n' (le \n n'est pas interprété)

// Conversion
String(42);        // '42'
(42).toString(16); // '2a' (hexadécimal)
(255).toString(2); // '11111111' (binaire)`}</CodeBlock>

      <Challenge title="Formatteur de slug">
        Écris une fonction <code>toSlug(titre)</code> qui transforme un titre en slug URL :
        minuscules, sans accents, espaces remplacés par des tirets, caractères spéciaux supprimés.
        <CodeBlock language="javascript">{`// Exemples attendus :
toSlug('Bonjour le Monde !');    // 'bonjour-le-monde'
toSlug('L\'été est là');         // 'lete-est-la'
toSlug('React & TypeScript');    // 'react-typescript'`}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 22,
  title: 'Manipulation de chaînes',
  icon: '🔤',
  level: 'Intermédiaire',
  stars: '⭐⭐',
  component: Ch22,
  quiz: [
    {
      question: 'Quelle méthode accepte les indices négatifs pour extraire depuis la fin ?',
      sub: 'slice() vs substring() — une différence clé.',
      options: ['substring()', 'slice()', 'charAt()', 'indexOf()'],
      correct: 1,
      explanation: 'slice() accepte les indices négatifs (ex: slice(-3) prend les 3 derniers caractères). substring() traite les négatifs comme 0.',
    },
    {
      question: 'Que retourne "a,b,c".split(",").join("-") ?',
      sub: 'Conversion tableau → chaîne.',
      options: ['"a-b-c"', '"abc"', '["a","b","c"]', '"a,b,c"'],
      correct: 0,
      explanation: 'split(",") donne ["a","b","c"], puis join("-") les réassemble avec des tirets : "a-b-c".',
    },
    {
      question: 'Quel est le résultat de "  hello  ".trim() ?',
      sub: 'Nettoyage des espaces.',
      options: ['"  hello  "', '"hello  "', '"hello"', '"  hello"'],
      correct: 2,
      explanation: 'trim() supprime les espaces (et autres whitespace) au début ET à la fin de la chaîne.',
    },
  ],
};
