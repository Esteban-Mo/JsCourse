import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch22() {
  return (
    <>
      <div className="chapter-tag">Intermédiaire</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-intermediate">🔤</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★☆☆</div>
          <h3>Manipulation de chaînes</h3>
          <p>Méthodes essentielles pour traiter, rechercher et transformer du texte</p>
        </div>
      </div>

      <h2>Les chaînes sont immuables — une vérité fondamentale</h2>
      <p>
        Avant d'explorer les méthodes, il faut comprendre quelque chose d'essentiel sur les chaînes en
        JavaScript : elles sont <strong>immuables</strong>. Une fois créée, une chaîne ne peut pas être
        modifiée. Toutes les méthodes — <code>replace()</code>, <code>toUpperCase()</code>, <code>trim()</code>,
        <code>slice()</code> — retournent <em>toujours une nouvelle chaîne</em>. Jamais elles ne modifient
        la chaîne originale.
      </p>
      <p>
        Contrairement aux tableaux (où <code>push()</code> ou <code>sort()</code> modifient l'original),
        les chaînes sont des <strong>valeurs primitives</strong> en JavaScript, comme les nombres. Tu ne
        peux pas "changer" le nombre 42 — tu ne peux qu'en créer un nouveau à partir de lui. C'est pareil
        pour les chaînes : <code>"bonjour".toUpperCase()</code> ne modifie pas <code>"bonjour"</code>,
        il retourne une nouvelle chaîne <code>"BONJOUR"</code>.
      </p>
      <CodeBlock language="javascript">{`let message = 'bonjour';
message.toUpperCase(); // retourne 'BONJOUR'
console.log(message);  // 'bonjour' — inchangé !

// Pour "modifier" une chaîne, il faut réassigner la variable :
message = message.toUpperCase();
console.log(message);  // 'BONJOUR'

// Les méthodes peuvent se chaîner car chacune retourne une nouvelle string
const résultat = '  Bonjour Monde  '
  .trim()
  .toLowerCase()
  .replace('monde', 'world');
// 'bonjour world'`}</CodeBlock>
      <InfoBox type="warning">
        Un bug courant : oublier de récupérer le résultat d'une méthode. <code>str.trim();</code> seul
        ne fait rien d'utile — la chaîne parée est créée puis immédiatement perdue. Il faut
        <code>str = str.trim();</code> ou <code>const propre = str.trim();</code>.
      </InfoBox>
      <InfoBox type="warning">
        Curiosité UTF-16 : JavaScript encode les chaînes en <strong>UTF-16</strong>. La plupart des
        caractères occupent une seule unité de code, mais certains caractères — comme les emojis ou les
        caractères CJK rares — en occupent deux. Résultat : <code>'😀'.length</code> vaut <code>2</code>,
        pas 1. De même, <code>'😀'[0]</code> retourne un demi-caractère illisible. Pour itérer
        correctement sur des chaînes avec emojis, utilise <code>for...of</code> ou le spread
        <code>[...'😀'].length</code> qui vaut 1.
      </InfoBox>

      <h2>Recherche dans une chaîne</h2>
      <p>
        Plusieurs méthodes permettent de tester la présence d'un texte sans avoir recours aux regex.
        <code>includes()</code>, <code>startsWith()</code> et <code>endsWith()</code> ont été introduites
        en ES6 précisément parce que l'idiome <code>indexOf() !== -1</code> était peu lisible. Ces nouvelles
        méthodes expriment clairement l'<em>intention</em> du code.
      </p>
      <p>
        Note que toutes ces méthodes sont <strong>sensibles à la casse</strong> par défaut. Pour une
        recherche insensible à la casse, la technique standard est de normaliser la chaîne en minuscules
        avant de tester.
      </p>
      <CodeBlock language="javascript">{`const email = 'contact@example.com';

// includes() — contient un sous-texte ?
email.includes('@');          // true
email.includes('gmail');      // false

// startsWith() / endsWith() — idéaux pour valider des formats
email.startsWith('contact');  // true
email.endsWith('.com');       // true
email.endsWith('.fr');        // false

// indexOf() — position de la première occurrence, ou -1
email.indexOf('@');           // 7
email.indexOf('xyz');         // -1
// lastIndexOf() — position de la DERNIÈRE occurrence
'abcabc'.lastIndexOf('b');    // 4

// Recherche insensible à la casse — normaliser d'abord
const texte = 'Bonjour Monde';
texte.toLowerCase().includes('monde'); // true

// includes() avec un second paramètre : position de départ
'javascript'.includes('script', 5); // true (cherche à partir de l'index 5)
'javascript'.includes('java', 5);   // false (java est avant l'index 5)

// Cas pratique : valider une URL
const url = 'https://example.com/page';
const estHttps    = url.startsWith('https://');   // true — connexion sécurisée
const estRelative = url.startsWith('/');          // false
const estPDF      = url.endsWith('.pdf');         // false`}</CodeBlock>
      <p>
        Le second paramètre de <code>includes()</code> (la position de départ) est rarement utilisé mais
        utile pour éviter de chercher dans une partie connue de la chaîne. Par exemple, si tu veux vérifier
        qu'un fichier a bien une extension <code>.ts</code> et pas seulement un <code>.ts</code> quelque part
        dans le chemin, tu peux chercher à partir d'une certaine position.
      </p>

      <h2>Extraction : slice() et substring()</h2>
      <p>
        Extraire une portion de chaîne est l'une des opérations les plus courantes. <code>slice()</code> et
        <code>substring()</code> font toutes les deux ce travail, mais <code>slice()</code> est plus
        puissante et plus cohérente.
      </p>
      <p>
        Le principe : on fournit un index de <em>début</em> (inclus) et un index de <em>fin</em> (exclus).
        Imagine les indices comme des <em>séparateurs entre les caractères</em>, pas comme pointant sur les
        caractères eux-mêmes :
      </p>
      <CodeBlock language="javascript">{`//  Indices :  0   1   2   3   4   5   6   7   8   9
//  Chaîne  :  J   a   v   a   S   c   r   i   p   t
//             |   |   |   |   |   |   |   |   |   |   |
//  Négatifs: -10  -9  -8  -7  -6  -5  -4  -3  -2  -1
const str = 'JavaScript';

// slice(début, fin) — fin est EXCLUS
str.slice(0, 4);      // 'Java'   (indices 0,1,2,3)
str.slice(4, 10);     // 'Script' (indices 4 à 9)
str.slice(4);         // 'Script' (jusqu'à la fin si pas de fin)
str.slice(0);         // 'JavaScript' (toute la chaîne)

// Indices négatifs — comptent depuis la FIN
str.slice(-6);        // 'Script' (les 6 derniers caractères)
str.slice(-6, -3);    // 'Scr'    (du -6 au -4 inclus)
str.slice(-1);        // 't'      (dernier caractère)

// substring() — similaire mais NE GÈRE PAS les négatifs
str.substring(0, 4);  // 'Java' — identique à slice(0, 4)
str.substring(4);     // 'Script'
str.substring(-6);    // 'JavaScript' ← traite -6 comme 0 !
// substring() a aussi un comportement étrange : il échange les arguments si début > fin
str.substring(4, 0);  // 'Java' ← échange automatiquement 0 et 4

// Cas pratique : extraire une extension de fichier
const fichier = 'rapport-2024.pdf';
const ext = fichier.slice(fichier.lastIndexOf('.') + 1); // 'pdf'

// Tronquer du texte pour un aperçu
function aperçu(texte, maxLength = 100) {
  if (texte.length <= maxLength) return texte;
  return texte.slice(0, maxLength) + '...';
}

// Extraire un domaine depuis un email
const mail = 'alice@example.com';
const domaine = mail.slice(mail.indexOf('@') + 1); // 'example.com'`}</CodeBlock>
      <p>
        La règle simple pour choisir : utilise toujours <code>slice()</code>. Son support des indices
        négatifs en fait l'outil plus polyvalent, et son comportement est plus prévisible. <code>substring()</code>
        existe pour des raisons historiques.
      </p>

      <h2>Remplacement : replace() et replaceAll()</h2>
      <p>
        Le comportement de <code>replace()</code> avec une chaîne de caractères surprend souvent : il ne
        remplace que <strong>la première occurrence</strong>. Ce n'est pas un bug, c'est une décision de
        conception. Pour remplacer toutes les occurrences, deux options : <code>replaceAll()</code> (ES2021)
        ou une expression régulière avec le drapeau <code>g</code> (global).
      </p>
      <p>
        Mais <code>replace()</code> devient extrêmement puissant quand on passe une <strong>fonction</strong>
        comme second argument. La fonction reçoit la correspondance trouvée (et les groupes de capture si
        tu utilises une regex avec des groupes), et ce qu'elle retourne devient le texte de remplacement.
        C'est idéal pour des transformations dynamiques.
      </p>
      <CodeBlock language="javascript">{`const phrase = 'Le chat mange le chat du voisin.';

// replace() avec une chaîne — PREMIÈRE occurrence seulement
phrase.replace('chat', 'chien');
// 'Le chien mange le chat du voisin.' ← le second 'chat' reste !

// replaceAll() — TOUTES les occurrences (ES2021)
phrase.replaceAll('chat', 'chien');
// 'Le chien mange le chien du voisin.'

// replace() avec regex + drapeau g — équivalent à replaceAll pour les regex
'Bonjour BONJOUR bonjour'.replace(/bonjour/gi, 'Salut');
// 'Salut Salut Salut'
// Flags : g = global (toutes les occurrences), i = case insensitive

// replace() avec une FONCTION — remplacement dynamique
// La fonction reçoit (match, ...groupes, offset, chaîneComplète)
'prix: 100€, remise: 20€'.replace(/(\d+)€/g, (match, n) => \`\${n * 1.1}€\`);
// 'prix: 110€, remise: 22€'
// match = '100€', n = '100' (groupe de capture)

// Cas pratique : mettre la première lettre de chaque mot en majuscule
'bonjour le monde'.replace(/\b\w/g, c => c.toUpperCase());
// 'Bonjour Le Monde'

// Cas pratique : sanitiser une chaîne pour l'HTML
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')   // & d'abord — sinon les autres remplacements créent des &
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
escapeHtml('<script>alert("xss")</script>');
// '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'`}</CodeBlock>
      <InfoBox type="warning">
        Quand tu enchaînes des <code>replace()</code> pour sanitiser du HTML, l'ordre compte !
        Remplace toujours <code>&amp;</code> en premier. Si tu remplaces <code>{'<'}</code> d'abord
        en <code>&amp;lt;</code>, puis le <code>&amp;</code> de <code>&amp;lt;</code> devient
        <code>&amp;amp;lt;</code> — tu encodes deux fois. L'ordre correct : <code>&amp;</code> →
        <code>{'<'}</code> → <code>{'>'}</code> → <code>"</code>.
      </InfoBox>

      <h2>split() et join() — deux opérations inverses</h2>
      <p>
        <code>split()</code> et <code>join()</code> sont les deux faces d'une même pièce. <code>split()</code>
        <em>décompose</em> une chaîne en tableau de fragments en coupant aux séparateurs. <code>join()</code>
        <em>recompose</em> un tableau de fragments en chaîne en les collant avec un séparateur. Ensemble,
        ils forment un pattern de traitement de texte extrêmement puissant.
      </p>
      <p>
        L'idée clé est de les utiliser comme les deux extrémités d'un <strong>pipeline de traitement</strong> :
        on <em>explose</em> la chaîne en tableau pour pouvoir utiliser toutes les méthodes de tableaux
        (<code>map</code>, <code>filter</code>, <code>sort</code>, <code>reverse</code>...), puis on
        <em>recolle</em> les fragments avec <code>join()</code>. C'est un des patterns les plus élégants
        de JavaScript.
      </p>
      <CodeBlock language="javascript">{`// split() — découper une chaîne en tableau
'Alice,Bob,Carol'.split(',');     // ['Alice', 'Bob', 'Carol']
'Bonjour monde'.split(' ');       // ['Bonjour', 'monde']
'abc'.split('');                  // ['a', 'b', 'c'] — chaque caractère
'hello'.split('', 3);             // ['h', 'e', 'l'] — limite à 3 éléments

// Cas particuliers importants
'a,,b'.split(',');   // ['a', '', 'b'] — l'élément vide est conservé !
'abc'.split();       // ['abc'] — sans argument : tableau d'un seul élément

// join() — assembler un tableau en chaîne
['Alice', 'Bob', 'Carol'].join(', ');  // 'Alice, Bob, Carol'
['2024', '03', '15'].join('-');        // '2024-03-15'
['a', 'b', 'c'].join('');             // 'abc' — sans séparateur
['a', 'b'].join();                    // 'a,b' — séparateur par défaut : virgule

// Le pattern classique : split → traiter → join
// Inverser les mots d'une phrase
const inversé = 'Bonjour le monde'
  .split(' ')       // ['Bonjour', 'le', 'monde']
  .reverse()        // ['monde', 'le', 'Bonjour']
  .join(' ');       // 'monde le Bonjour'

// Capitaliser la première lettre de chaque mot
const capitalisé = 'bonjour le monde'
  .split(' ')
  .map(mot => mot[0].toUpperCase() + mot.slice(1))
  .join(' ');
// 'Bonjour Le Monde'

// Nettoyer et normaliser du CSV
const csv = ' Alice , 25 , Paris ';
const champs = csv.split(',').map(s => s.trim());
// ['Alice', '25', 'Paris'] — les espaces parasites sont retirés

// Compter les occurrences d'un mot (astuce split)
const texte = 'le chat dort et le chien mange';
const occurrences = texte.split('le').length - 1; // 2`}</CodeBlock>
      <p>
        L'astuce de comptage avec <code>split()</code> mérite une explication : diviser <code>"le chat dort et le chien mange"</code>
        par <code>"le"</code> donne 3 fragments (<code>["", " chat dort et ", " chien mange"]</code>).
        Le nombre de séparateurs est toujours égal au nombre de fragments moins 1, d'où le <code>- 1</code>.
      </p>
      <InfoBox type="tip">
        <code>split('')</code> (chaîne vide) et <code>[...str]</code> (spread) découpent tous les deux en
        caractères individuels, mais avec une différence : le spread respecte les caractères Unicode multi-code-units
        (comme les emojis). <code>'😀🎉'.split('')</code> donne 4 éléments illisibles ;
        <code>[...'😀🎉']</code> donne correctement <code>['😀', '🎉']</code>.
      </InfoBox>

      <h2>Nettoyage : trim() et padding</h2>
      <p>
        Les données textuelles provenant d'une entrée utilisateur ou d'une API contiennent souvent des
        espaces parasites. <code>trim()</code> et ses variantes sont les outils de nettoyage fondamentaux.
        Les méthodes de padding (<code>padStart</code>, <code>padEnd</code>) font l'inverse : elles
        <em>ajoutent</em> du remplissage pour atteindre une longueur cible — très utiles pour le formatage.
      </p>
      <CodeBlock language="javascript">{`// trim — supprimer les espaces (et tabulations, retours à la ligne) aux extrémités
'  Bonjour  '.trim();       // 'Bonjour'
'  Bonjour  '.trimStart();  // 'Bonjour  ' — début seulement
'  Bonjour  '.trimEnd();    // '  Bonjour' — fin seulement

// Cas d'usage : validation de formulaire
function validerPrénom(input) {
  const propre = input.trim();
  if (propre.length === 0) return 'Le prénom ne peut pas être vide';
  if (propre.length < 2)   return 'Le prénom est trop court';
  return null; // pas d'erreur
}
validerPrénom('  ');   // 'Le prénom ne peut pas être vide' (après trim : '')
validerPrénom(' Alice '); // null — valide

// padStart / padEnd — remplir à une longueur donnée
'5'.padStart(3, '0');   // '005' — très utile pour les numéros formatés
'42'.padStart(5, '0');  // '00042'
'Hi'.padEnd(5, '.');    // 'Hi...'
'Hi'.padEnd(5, '!-');   // 'Hi!-!' — le motif se répète si nécessaire

// Si la chaîne est déjà assez longue, padStart/padEnd ne font rien
'12345'.padStart(3, '0'); // '12345' — longueur 5 > 3, aucun ajout

// Cas pratique : formater des heures et des dates
const h = 9, m = 5, s = 3;
const heure = \`\${String(h).padStart(2,'0')}:\${String(m).padStart(2,'0')}:\${String(s).padStart(2,'0')}\`;
// '09:05:03'

// Formater des numéros de ticket ou de commande
const numCommande = 42;
const idFormaté = \`CMD-\${String(numCommande).padStart(6, '0')}\`;
// 'CMD-000042'

// repeat() — répéter une chaîne n fois
'-'.repeat(20);  // '--------------------'
'ab'.repeat(3);  // 'ababab'
'ha'.repeat(0);  // '' — zéro répétitions = chaîne vide`}</CodeBlock>
      <InfoBox type="tip">
        <code>trim()</code> est quasi-systématique lors du traitement d'entrées utilisateur. Une bonne
        pratique : toujours appliquer <code>.trim()</code> aux valeurs de formulaire avant de les valider
        ou stocker. Un utilisateur qui appuie accidentellement sur Espace avant de saisir son email ne
        devrait pas être rejeté — <code>"alice@test.com ".trim()</code> doit donner la même chose que
        <code>"alice@test.com"</code>.
      </InfoBox>

      <h2>Template literals avancés — les tagged templates</h2>
      <p>
        Les template literals (backticks) permettent l'interpolation avec <code>{'${expression}'}</code>.
        Mais il existe une fonctionnalité avancée peu connue : les <strong>tagged templates</strong>.
        Un tag est une <em>fonction</em> placée devant le backtick, qui reçoit la chaîne décomposée et
        peut la recomposer comme elle veut.
      </p>
      <p>
        Pour comprendre la signature de la fonction tag, visualise comment JavaScript décompose
        le template. Prenons <code>highlight{'`'}Bonjour ${'{'} nom {'}'}, tu as ${'{'} age {'}'} ans.{'`'}</code> :
        JavaScript découpe le template en parties statiques et parties dynamiques. Les parties statiques
        forment un tableau <code>strings</code>, les parties dynamiques forment les arguments
        <code>...values</code>. Il y a toujours exactement un <code>string</code> de plus que de
        <code>values</code> (les strings entourent les valeurs).
      </p>
      <CodeBlock language="javascript">{`// Visualiser la décomposition :
// highlight\`Bonjour \${nom}, tu as \${age} ans.\`
//
// strings = ['Bonjour ', ', tu as ', ' ans.']  ← 3 parties statiques
// values  = [nom, age]                          ← 2 valeurs interpolées
//
// Relation : strings[0] + values[0] + strings[1] + values[1] + strings[2]

function highlight(strings, ...values) {
  // strings.raw contient les strings sans interprétation des séquences d'échappement
  return strings.reduce((result, str, i) => {
    // i=0: result=''     + (values[-1]=undefined→'') + strings[0]='Bonjour '
    // i=1: result='Bonjour **Alice**' + ', tu as '
    // i=2: result='Bonjour **Alice**, tu as **30**' + ' ans.'
    const val = values[i - 1];
    return result + (val !== undefined ? \`**\${val}**\` : '') + str;
  });
}

const nom = 'Alice';
const age = 30;
highlight\`Bonjour \${nom}, tu as \${age} ans.\`;
// 'Bonjour **Alice**, tu as **30** ans.'

// Exemple réel n°1 : sanitiser du HTML (protection XSS)
// Sans ça, une variable contenant '<script>...' serait injectée telle quelle dans le DOM
function safeHtml(strings, ...values) {
  const escaped = values.map(v =>
    String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  );
  return strings.reduce((r, s, i) => r + (escaped[i - 1] ?? '') + s);
}

const userInput = '<script>alert("xss")</script>';
safeHtml\`<p>Contenu : \${userInput}</p>\`;
// '<p>Contenu : &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>'
// L'entrée malveillante est neutralisée automatiquement

// Exemple réel n°2 : formatage de devises
function currency(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const val = values[i - 1];
    const formatted = typeof val === 'number'
      ? val.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
      : val ?? '';
    return result + formatted + str;
  });
}

const prix = 1234.5;
currency\`Total : \${prix} TTC\`;
// 'Total : 1 234,50 € TTC'`}</CodeBlock>
      <p>
        Les tagged templates sont utilisés dans de nombreuses bibliothèques populaires :
        <strong>styled-components</strong> et <strong>emotion</strong> (CSS-in-JS) les utilisent pour écrire
        du CSS directement dans JavaScript avec <code>css{'`'}color: red;{'`'}</code>. <strong>GraphQL</strong> utilise
        <code>gql{'`'}query {'{'} ... {'}'}{'`'}</code>. <strong>sql-template-strings</strong> les utilise pour des
        requêtes SQL paramétrées. Une fois qu'on comprend le mécanisme, ces APIs deviennent transparentes.
      </p>
      <InfoBox type="tip">
        <code>String.raw</code> est lui-même un tag intégré. Il retourne la chaîne telle quelle, sans
        interpréter les séquences d'échappement comme <code>\n</code> ou <code>\t</code>. Utile pour les
        chemins Windows ou les expressions régulières complexes :{' '}
        <code>String.raw{'`'}C:\Users\Alice\n{'`'}</code> retourne <code>C:\Users\Alice\n</code> (le \n
        n'est pas un retour à la ligne, c'est littéralement backslash + n).
      </InfoBox>

      <h2>Méthodes utiles diverses</h2>
      <p>
        Un tour d'horizon des méthodes moins connues mais très pratiques, avec leurs cas d'usage concrets.
      </p>
      <CodeBlock language="javascript">{`// Changement de casse
'bonjour'.toUpperCase();  // 'BONJOUR'
'MONDE'.toLowerCase();    // 'monde'

// at() — accès avec indices négatifs (ES2022) — plus lisible que [length-1]
'Hello'.at(0);    // 'H'
'Hello'.at(-1);   // 'o' — dernier caractère
'Hello'.at(-2);   // 'l' — avant-dernier
// Avantage sur [index] : indices négatifs et retourne undefined (pas undefined via [])

// Normalisation des accents — utile pour la recherche insensible aux accents
// NFD décompose les caractères accentués en lettre + marque diacritique séparée
// \p{Mn} = "Mark, Nonspacing" — les diacritiques
'café'.normalize('NFD').replace(/\p{Mn}/gu, '');  // 'cafe'
'Éric'.normalize('NFD').replace(/\p{Mn}/gu, '');  // 'Eric'

// Cas pratique : recherche tolérante aux accents
function normaliser(str) {
  return str.normalize('NFD').replace(/\p{Mn}/gu, '').toLowerCase();
}
const noms = ['Éric', 'Alice', 'André', 'Bob'];
const recherche = 'eric';
noms.filter(n => normaliser(n).includes(normaliser(recherche)));
// ['Éric'] — trouvé malgré l'accent !

// String.raw — pour les chemins Windows ou regex sans échappement double
String.raw\`C:\Users\Alice\n\`;  // 'C:\\Users\\Alice\\n' (le \n n'est PAS interprété)
// Utile pour écrire des regex complexes sans devoir doubler les backslashes :
// new RegExp('\\d+\\.\\d+') vs new RegExp(String.raw\`\d+\.\d+\`)

// Conversion de base numérique
String(42);         // '42'
(42).toString(16);  // '2a'  — hexadécimal
(42).toString(2);   // '101010' — binaire
(255).toString(16); // 'ff'  — très utile pour les couleurs CSS

// Cas pratique : générer une couleur hex aléatoire
const hex = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
// '#1a3f7c' (par exemple)`}</CodeBlock>

      <h2>Cas pratique : génération de slug</h2>
      <p>
        Un <em>slug</em> est la version URL-friendly d'un titre. Par exemple, "L'été est là !" devient
        <code>"lete-est-la"</code>. C'est une opération qui combine plusieurs méthodes de chaînes en
        pipeline, et c'est un excellent exercice de synthèse.
      </p>
      <CodeBlock language="javascript">{`function toSlug(titre) {
  return titre
    .normalize('NFD')              // décompose 'é' → 'e' + diacritique
    .replace(/\p{Mn}/gu, '')       // supprime les diacritiques
    .toLowerCase()                 // 'Bonjour' → 'bonjour'
    .replace(/[^a-z0-9\s-]/g, '') // supprime tout sauf lettres, chiffres, espaces, tirets
    .trim()                        // supprime les espaces aux extrémités
    .replace(/\s+/g, '-')          // remplace les espaces (un ou plusieurs) par un tiret
    .replace(/-+/g, '-');          // évite les doubles tirets (ex: 'a - b' → 'a-b')
}

toSlug('Bonjour le Monde !');    // 'bonjour-le-monde'
toSlug("L'été est là");          // 'lete-est-la'
toSlug('React & TypeScript');    // 'react-typescript'
toSlug('  espaces  partout  ');  // 'espaces-partout'

// Version encore plus robuste avec remplacement de caractères spéciaux courants
function toSlugComplet(titre) {
  return titre
    .replace(/['']/g, '')          // apostrophes → supprimées (L'été → Lété)
    .replace(/[&]/g, 'et')         // & → 'et'
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

toSlugComplet("L'été & l'automne"); // 'lete-et-lautomne'`}</CodeBlock>

      <Challenge title="Défi personnel à réaliser : Formatteur de slug">
        Écris une fonction <code>toSlug(titre)</code> qui transforme un titre en slug URL :
        minuscules, sans accents, espaces remplacés par des tirets, caractères spéciaux supprimés.
        <CodeBlock language="javascript">{`// Exemples attendus :
toSlug('Bonjour le Monde !');    // 'bonjour-le-monde'
toSlug("L'été est là");          // 'lete-est-la'
toSlug('React & TypeScript');    // 'react-typescript'`}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 8,
  title: 'Manipulation de chaînes',
  icon: '🔤',
  level: 'Intermédiaire',
  stars: '★★★☆☆',
  component: Ch22,
  quiz: [
    {
      question: 'Quelle méthode accepte les indices négatifs pour extraire depuis la fin ?',
      sub: 'slice() vs substring() — une différence clé dans leur comportement.',
      options: ['substring()', 'slice()', 'charAt()', 'indexOf()'],
      correct: 1,
      explanation: '✅ Exact ! slice() accepte les indices négatifs : slice(-3) prend les 3 derniers caractères, slice(-6, -3) extrait une portion depuis la fin. substring() traite les indices négatifs comme 0 — donc substring(-6) est équivalent à substring(0) et retourne toute la chaîne. En pratique : utilise toujours slice(), c\'est plus polyvalent et prévisible.',
    },
    {
      question: 'Que retourne "a,b,c".split(",").join("-") ?',
      sub: 'split() et join() sont deux opérations inverses.',
      options: ['"a-b-c"', '"abc"', '["a","b","c"]', '"a,b,c"'],
      correct: 0,
      explanation: '✅ Exact ! split(",") décompose "a,b,c" en tableau ["a","b","c"], puis join("-") les réassemble avec "-" comme séparateur → "a-b-c". C\'est le pattern fondamental pour remplacer un séparateur dans une chaîne : split(ancien).join(nouveau). Beaucoup plus lisible que replace(",", "-") qui ne remplacerait que la première virgule !',
    },
    {
      question: 'Quel est le résultat de "  hello  ".trim() ?',
      sub: 'trim() nettoie les espaces aux extrémités de la chaîne.',
      options: ['"  hello  "', '"hello  "', '"hello"', '"  hello"'],
      correct: 2,
      explanation: '✅ Exact ! trim() supprime les espaces (et autres whitespace : tabulations, retours à la ligne) au début ET à la fin de la chaîne, mais pas à l\'intérieur. "  hello  " → "hello". Pour ne nettoyer qu\'un seul côté : trimStart() (début) ou trimEnd() (fin). Indispensable pour nettoyer les entrées utilisateur.',
    },
    {
      question: 'Quelle est la longueur de la chaîne "😀" en JavaScript ?',
      sub: 'JavaScript utilise l\'encodage UTF-16 — certains caractères sont surprenants.',
      options: ['0', '1', '2', '4'],
      correct: 2,
      explanation: '💡 "😀".length vaut 2, pas 1 ! Les emojis et certains caractères Unicode rares sont encodés en UTF-16 comme des "paires de substitution" (surrogate pairs) — deux unités de code de 16 bits. .length compte les unités de code, pas les caractères visuels. Pour obtenir 1, utilise [...\"😀\"].length qui compte les vrais caractères Unicode.',
    },
    {
      question: 'Quel est le principal cas d\'usage de padStart() ?',
      sub: 'padStart() ajoute du remplissage à gauche d\'une chaîne.',
      options: [
        'Supprimer les espaces en début de chaîne',
        'Formater des nombres avec des zéros en tête (ex: "007", "09:05")',
        'Aligner du texte à droite dans la console',
        'Vérifier si une chaîne commence par un certain caractère',
      ],
      correct: 1,
      explanation: '✅ Exact ! padStart() est typiquement utilisé pour formater des nombres avec des zéros en tête : String(9).padStart(2, "0") → "09", utile pour les heures, minutes, secondes, ou des identifiants de commande comme "CMD-000042". Il ne supprime pas d\'espaces (c\'est trimStart()), et n\'effectue pas de vérification (c\'est startsWith()).',
    },
    {
      question: 'Quelle différence y a-t-il entre trim() et trimStart() ?',
      sub: 'Les méthodes de nettoyage des espaces aux extrémités.',
      options: [
        'trim() supprime les espaces intérieurs, trimStart() seulement les espaces en début',
        'trim() supprime les espaces aux deux extrémités, trimStart() seulement au début',
        'trimStart() est identique à trim() mais plus récent',
        'trim() convertit aussi la chaîne en minuscules',
      ],
      correct: 1,
      explanation: '✅ Exact ! trim() supprime les espaces (et whitespace) aux deux extrémités — début ET fin. trimStart() (alias trimLeft()) ne supprime qu\'au début. trimEnd() (alias trimRight()) ne supprime qu\'à la fin. Aucune de ces méthodes ne touche aux espaces à l\'intérieur de la chaîne.',
    },
    {
      question: 'Que retourne String.raw`C:\\Users\\Alice` ?',
      sub: 'String.raw est un template tag qui désactive l\'interprétation des séquences d\'échappement.',
      options: [
        '"C:\\Users\\Alice" avec un retour à la ligne après Alice',
        '"C:\\Users\\Alice" avec \\n interprété comme retour à la ligne',
        'La chaîne littérale avec les backslashs non interprétés',
        'Une erreur de syntaxe',
      ],
      correct: 2,
      explanation: '✅ Exact ! String.raw est un template tag qui retourne la chaîne brute sans interpréter les séquences d\'échappement. \\n reste \\n (deux caractères), \\t reste \\t, etc. C\'est très utile pour les chemins Windows (C:\\Users\\Alice) et les expressions régulières complexes où on veut éviter de doubler tous les backslashs.',
    },
    {
      question: 'Quelle est la différence entre replace("chat", "chien") et replaceAll("chat", "chien") ?',
      sub: 'Comportement de remplacement avec une chaîne littérale.',
      options: [
        'Aucune différence, les deux remplacent toutes les occurrences',
        'replace() remplace uniquement la première occurrence, replaceAll() toutes',
        'replaceAll() est sensible à la casse, replace() non',
        'replace() accepte des regex, replaceAll() non',
      ],
      correct: 1,
      explanation: '✅ Exact ! replace() avec une chaîne littérale ne remplace que la PREMIÈRE occurrence trouvée. "chat chat".replace("chat", "chien") → "chien chat". replaceAll() remplace TOUTES les occurrences : "chat chat".replaceAll("chat", "chien") → "chien chien". Pour remplacer toutes les occurrences avec replace(), il faut utiliser une regex avec le drapeau g : replace(/chat/g, "chien").',
    },
    {
      question: 'Pourquoi utiliser [...str] plutôt que str.split("") pour itérer sur les caractères d\'une chaîne ?',
      sub: 'Gestion des caractères Unicode multi-unités (emojis, caractères spéciaux).',
      options: [
        'Le spread est plus rapide que split()',
        'split("") modifie la chaîne originale, le spread non',
        'Le spread respecte les caractères Unicode multi-code-units (emojis), split("") les découpe en demi-caractères',
        'split("") ne fonctionne que sur les chaînes ASCII',
      ],
      correct: 2,
      explanation: '✅ Exact ! split("") découpe selon les unités de code UTF-16. Pour un emoji comme "😀" (encodé sur 2 unités), split("") produit 2 demi-caractères illisibles. Le spread [...str] utilise l\'itérateur de chaîne qui connaît les paires de substitution Unicode et produit les vrais caractères : [..."😀🎉"] → ["😀", "🎉"]. Même différence pour les caractères CJK rares et certains caractères mathématiques.',
    },
  ],
};
