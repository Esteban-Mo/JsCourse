import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch21() {
  return (
    <>
      <div className="chapter-tag">Intermédiaire</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-intermediate">🧰</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">⭐⭐⭐</div>
          <h3>Méthodes de tableaux</h3>
          <p>map, filter, reduce et toutes les méthodes fonctionnelles essentielles</p>
        </div>
      </div>

      <h2>map() — transformer chaque élément</h2>
      <p>
        <code>map()</code> crée un <strong>nouveau tableau</strong> en appliquant une fonction à chaque élément.
        Le tableau original n'est jamais modifié.
      </p>
      <CodeBlock language="javascript">{`const prix = [10, 20, 30, 40];

// Appliquer une TVA de 20%
const prixTTC = prix.map(p => p * 1.2);
console.log(prixTTC); // [12, 24, 36, 48]

// Transformer un tableau d'objets
const users = [
  { nom: 'Alice', age: 25 },
  { nom: 'Bob',   age: 30 },
];
const noms = users.map(u => u.nom);
console.log(noms); // ['Alice', 'Bob']

// map() avec index
const indexés = ['a', 'b', 'c'].map((val, i) => \`\${i}: \${val}\`);
console.log(indexés); // ['0: a', '1: b', '2: c']`}</CodeBlock>

      <h2>filter() — sélectionner des éléments</h2>
      <p>
        <code>filter()</code> retourne un nouveau tableau contenant uniquement les éléments
        pour lesquels la fonction de test renvoie <code>true</code>.
      </p>
      <CodeBlock language="javascript">{`const nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const pairs = nombres.filter(n => n % 2 === 0);
console.log(pairs); // [2, 4, 6, 8, 10]

// Filtrer des objets
const produits = [
  { nom: 'Stylo',    stock: 0 },
  { nom: 'Cahier',   stock: 5 },
  { nom: 'Règle',    stock: 0 },
  { nom: 'Classeur', stock: 2 },
];

const disponibles = produits.filter(p => p.stock > 0);
// [{ nom: 'Cahier', stock: 5 }, { nom: 'Classeur', stock: 2 }]

// Retirer les valeurs falsy
const données = [0, 1, null, 2, '', 3, undefined, 4];
const propres = données.filter(Boolean);
console.log(propres); // [1, 2, 3, 4]`}</CodeBlock>

      <h2>reduce() — accumuler des valeurs</h2>
      <p>
        <code>reduce()</code> est la méthode la plus puissante. Elle réduit un tableau à
        une <strong>valeur unique</strong> en accumulant les résultats.
      </p>
      <CodeBlock language="javascript">{`const notes = [14, 18, 12, 16, 10];

// Somme
const total = notes.reduce((acc, note) => acc + note, 0);
console.log(total); // 70

// Moyenne
const moyenne = total / notes.length; // 14

// Grouper par catégorie (reduce vers un objet)
const animaux = ['chat', 'chien', 'chat', 'lapin', 'chien', 'chat'];
const comptage = animaux.reduce((acc, animal) => {
  acc[animal] = (acc[animal] || 0) + 1;
  return acc;
}, {});
// { chat: 3, chien: 2, lapin: 1 }

// Aplatir un tableau de tableaux
const matrice = [[1, 2], [3, 4], [5, 6]];
const plat = matrice.reduce((acc, arr) => acc.concat(arr), []);
// [1, 2, 3, 4, 5, 6]`}</CodeBlock>
      <InfoBox type="warning">
        Toujours fournir la <strong>valeur initiale</strong> (2e argument de reduce) sauf
        si tu sais exactement ce que tu fais. Sans valeur initiale sur un tableau vide,
        reduce lève une TypeError.
      </InfoBox>

      <h2>find() et findIndex()</h2>
      <p>
        <code>find()</code> retourne le <strong>premier élément</strong> qui satisfait la condition.
        <code>findIndex()</code> retourne son <strong>index</strong>. Les deux s'arrêtent au premier résultat.
      </p>
      <CodeBlock language="javascript">{`const utilisateurs = [
  { id: 1, nom: 'Alice', admin: false },
  { id: 2, nom: 'Bob',   admin: true  },
  { id: 3, nom: 'Carol', admin: true  },
];

const premierAdmin = utilisateurs.find(u => u.admin);
// { id: 2, nom: 'Bob', admin: true }

const indexBob = utilisateurs.findIndex(u => u.nom === 'Bob');
// 1

// Retourne undefined / -1 si non trouvé
const inconnu = utilisateurs.find(u => u.nom === 'Dave');
// undefined`}</CodeBlock>

      <h2>some() et every()</h2>
      <p>
        Ces deux méthodes testent les éléments et retournent un <strong>booléen</strong>.
        Elles s'arrêtent dès que le résultat est déterminé (<em>short-circuit</em>).
      </p>
      <CodeBlock language="javascript">{`const ages = [22, 16, 30, 17, 28];

// some() : au moins un élément satisfait la condition
const unMineur = ages.some(age => age < 18);
console.log(unMineur); // true

// every() : tous les éléments satisfont la condition
const tousMajeurs = ages.every(age => age >= 18);
console.log(tousMajeurs); // false

// Cas pratiques
const panier = [
  { nom: 'Pizza',   dispo: true  },
  { nom: 'Sushi',   dispo: false },
  { nom: 'Burger',  dispo: true  },
];

const commandable = panier.every(p => p.dispo);  // false (Sushi indispo)
const partielle   = panier.some(p => p.dispo);   // true`}</CodeBlock>

      <h2>flat() et flatMap()</h2>
      <p>
        <code>flat()</code> aplatit les tableaux imbriqués. <code>flatMap()</code> combine
        un <code>map()</code> suivi d'un <code>flat(1)</code> en une seule opération.
      </p>
      <CodeBlock language="javascript">{`// flat() avec profondeur
const nested = [1, [2, 3], [4, [5, 6]]];
nested.flat();    // [1, 2, 3, 4, [5, 6]] — profondeur 1 par défaut
nested.flat(2);   // [1, 2, 3, 4, 5, 6]
nested.flat(Infinity); // aplatit tout

// flatMap() — très utile pour transformer + aplatir
const phrases = ['Bonjour monde', 'Hello world'];
const mots = phrases.flatMap(p => p.split(' '));
// ['Bonjour', 'monde', 'Hello', 'world']

// Équivalent mais plus lisible que :
// phrases.map(p => p.split(' ')).flat()`}</CodeBlock>

      <h2>sort() — attention aux pièges</h2>
      <InfoBox type="danger">
        Par défaut, <code>sort()</code> trie les éléments <strong>comme des chaînes</strong>,
        ce qui donne des résultats inattendus avec des nombres.
      </InfoBox>
      <CodeBlock language="javascript">{`// ❌ Piège classique
[10, 1, 21, 2].sort(); // [1, 10, 2, 21] — tri lexicographique !

// ✅ Tri numérique croissant
[10, 1, 21, 2].sort((a, b) => a - b); // [1, 2, 10, 21]

// ✅ Décroissant
[10, 1, 21, 2].sort((a, b) => b - a); // [21, 10, 2, 1]

// ✅ Tri de chaînes avec accents (localeCompare)
['Émile', 'Alice', 'Éric', 'Bob'].sort((a, b) => a.localeCompare(b, 'fr'));
// ['Alice', 'Bob', 'Émile', 'Éric']

// ⚠️ sort() modifie le tableau original !
const arr = [3, 1, 2];
const trié = [...arr].sort((a, b) => a - b); // copier d'abord
// arr est inchangé

// Ou utiliser toSorted() (ES2023, non-mutant)
const trié2 = arr.toSorted((a, b) => a - b);`}</CodeBlock>

      <h2>Chaînage de méthodes</h2>
      <p>Les méthodes de tableau se chaînent naturellement car elles retournent toutes un nouveau tableau.</p>
      <CodeBlock language="javascript">{`const commandes = [
  { client: 'Alice', montant: 120, payé: true  },
  { client: 'Bob',   montant: 45,  payé: false },
  { client: 'Carol', montant: 200, payé: true  },
  { client: 'Dave',  montant: 80,  payé: false },
];

// Total des commandes payées, trié, les 2 premières
const résumé = commandes
  .filter(c => c.payé)
  .sort((a, b) => b.montant - a.montant)
  .map(c => \`\${c.client}: \${c.montant}€\`);

console.log(résumé);
// ['Carol: 200€', 'Alice: 120€']

// Calcul du total des impayés
const totalImpayé = commandes
  .filter(c => !c.payé)
  .reduce((sum, c) => sum + c.montant, 0);
// 125`}</CodeBlock>

      <Challenge title="Pipeline de données">
        Tu as un tableau de produits. Écris un pipeline qui retourne le nom des 3
        produits les plus chers avec un stock {'>'} 0, triés du plus cher au moins cher.
        <CodeBlock language="javascript">{`const produits = [
  { nom: 'A', prix: 50,  stock: 3 },
  { nom: 'B', prix: 120, stock: 0 },
  { nom: 'C', prix: 80,  stock: 5 },
  { nom: 'D', prix: 200, stock: 1 },
  { nom: 'E', prix: 30,  stock: 0 },
  { nom: 'F', prix: 150, stock: 2 },
];

// Attendu : ['D', 'F', 'C']
const résultat = produits
  // Votre code ici...`}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 21,
  title: 'Méthodes de tableaux',
  icon: '🧰',
  level: 'Intermédiaire',
  stars: '⭐⭐⭐',
  component: Ch21,
  quiz: [
    {
      question: 'Que retourne [1, 2, 3].map(x => x * 2) ?',
      sub: 'map() transforme chaque élément.',
      options: ['[1, 2, 3]', '[2, 4, 6]', '6', '[2, 4, 6, 8]'],
      correct: 1,
      explanation: 'map() applique la fonction à chaque élément et retourne un nouveau tableau : [2, 4, 6].',
    },
    {
      question: 'Quel est le résultat de [10, 1, 2].sort() ?',
      sub: 'Attention au comportement par défaut de sort().',
      options: ['[1, 2, 10]', '[10, 2, 1]', '[1, 10, 2]', '[10, 1, 2]'],
      correct: 2,
      explanation: 'Sans fonction de comparaison, sort() trie lexicographiquement (en chaînes) : "1" < "10" < "2".',
    },
    {
      question: 'Quelle méthode s\'arrête dès le premier élément trouvé ?',
      sub: 'Short-circuit evaluation.',
      options: ['filter()', 'map()', 'find()', 'reduce()'],
      correct: 2,
      explanation: 'find() s\'arrête au premier élément qui satisfait la condition. filter() parcourt tout le tableau.',
    },
  ],
};
