import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch28() {
  return (
    <>
      <div className="chapter-tag">Expert+</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-expert">🧮</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">⭐⭐⭐⭐⭐</div>
          <h3>Algorithmes fondamentaux</h3>
          <p>Complexité, recherche, tri, récursion, mémoïsation et structures de données</p>
        </div>
      </div>

      <h2>Notation Big O — complexité</h2>
      <p>
        La <strong>notation Big O</strong> décrit comment le temps d'exécution (ou la mémoire)
        évolue en fonction de la taille de l'entrée <em>n</em>.
        C'est l'outil pour comparer l'efficacité de deux algorithmes.
      </p>
      <CodeBlock language="javascript">{`// O(1) — Temps constant : toujours la même durée
function premierÉlément(arr) {
  return arr[0]; // peu importe la taille du tableau
}

// O(n) — Linéaire : proportionnel à la taille
function somme(arr) {
  let total = 0;
  for (const n of arr) total += n; // 1 passage complet
  return total;
}

// O(n²) — Quadratique : boucle dans une boucle
function doublons(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}
// ✅ Version O(n) avec Set :
function doublonsRapide(arr) { return arr.length !== new Set(arr).size; }

// O(log n) — Logarithmique : divise le problème à chaque étape
function rechercherBinaire(arr, cible) {
  let [g, d] = [0, arr.length - 1];
  while (g <= d) {
    const m = Math.floor((g + d) / 2);
    if (arr[m] === cible) return m;
    if (arr[m] < cible) g = m + 1;
    else d = m - 1;
  }
  return -1;
}`}</CodeBlock>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Complexité</th><th>Nom</th><th>Exemple</th><th>n=1000</th></tr>
          </thead>
          <tbody>
            <tr><td><code>O(1)</code></td><td>Constant</td><td>Accès tableau</td><td>1 op</td></tr>
            <tr><td><code>O(log n)</code></td><td>Logarithmique</td><td>Recherche binaire</td><td>10 ops</td></tr>
            <tr><td><code>O(n)</code></td><td>Linéaire</td><td>Recherche linéaire</td><td>1 000 ops</td></tr>
            <tr><td><code>O(n log n)</code></td><td>Quasilinéaire</td><td>Merge sort</td><td>10 000 ops</td></tr>
            <tr><td><code>O(n²)</code></td><td>Quadratique</td><td>Bubble sort</td><td>1 000 000 ops</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Algorithmes de tri</h2>
      <CodeBlock language="javascript">{`// Bubble sort — O(n²) — éducatif, pas utilisé en prod
function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  return a;
}

// Merge sort — O(n log n) — diviser pour régner
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const gauche = mergeSort(arr.slice(0, mid));
  const droite = mergeSort(arr.slice(mid));
  return fusionner(gauche, droite);
}

function fusionner(g, d) {
  const résultat = [];
  let [i, j] = [0, 0];
  while (i < g.length && j < d.length) {
    if (g[i] <= d[j]) résultat.push(g[i++]);
    else résultat.push(d[j++]);
  }
  return [...résultat, ...g.slice(i), ...d.slice(j)];
}

mergeSort([5, 3, 8, 1, 9, 2]); // [1, 2, 3, 5, 8, 9]

// Quick sort — O(n log n) moy, O(n²) pire cas
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  return [
    ...quickSort(arr.filter(x => x < pivot)),
    ...arr.filter(x => x === pivot),
    ...quickSort(arr.filter(x => x > pivot)),
  ];
}`}</CodeBlock>

      <h2>Récursion et mémoïsation</h2>
      <CodeBlock language="javascript">{`// Récursion — une fonction qui s'appelle elle-même
function factorielle(n) {
  if (n <= 1) return 1;          // cas de base
  return n * factorielle(n - 1); // appel récursif
}
factorielle(5); // 120

// ❌ Fibonacci naïf — O(2^n), TRÈS lent
function fibLent(n) {
  if (n <= 1) return n;
  return fibLent(n - 1) + fibLent(n - 2);
}

// ✅ Mémoïsation — mettre en cache les résultats calculés
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const clé = JSON.stringify(args);
    if (cache.has(clé)) return cache.get(clé);
    const résultat = fn.apply(this, args);
    cache.set(clé, résultat);
    return résultat;
  };
}

const fibMemo = memoize(function fib(n) {
  if (n <= 1) return n;
  return fibMemo(n - 1) + fibMemo(n - 2);
});

fibMemo(40); // instantané vs plusieurs secondes sans mémo

// Programmation dynamique (bottom-up, sans récursion)
function fibDP(n) {
  if (n <= 1) return n;
  let [a, b] = [0, 1];
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
fibDP(50); // 12586269025`}</CodeBlock>

      <InfoBox type="tip">
        La mémoïsation est utile quand les appels récursifs se <strong>répètent</strong>
        (comme Fibonacci). Pour de larges n, la version itérative (bottom-up) est
        généralement plus efficace en mémoire.
      </InfoBox>

      <h2>Structures de données : Pile et File</h2>
      <CodeBlock language="javascript">{`// PILE (Stack) — LIFO : Last In, First Out
class Pile {
  #données = [];

  push(val) { this.#données.push(val); }
  pop()     { return this.#données.pop(); }
  peek()    { return this.#données.at(-1); }
  isEmpty() { return this.#données.length === 0; }
  get size(){ return this.#données.length; }
}

// Cas d'usage : vérifier les parenthèses équilibrées
function équilibrées(str) {
  const pile = new Pile();
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const c of str) {
    if ('([{'.includes(c)) pile.push(c);
    else if (')]}'.includes(c)) {
      if (pile.isEmpty() || pile.pop() !== pairs[c]) return false;
    }
  }
  return pile.isEmpty();
}
équilibrées('({[]})');  // true
équilibrées('([)]');    // false

// FILE (Queue) — FIFO : First In, First Out
class File {
  #données = [];

  enqueue(val) { this.#données.push(val); }
  dequeue()    { return this.#données.shift(); }
  peek()       { return this.#données[0]; }
  isEmpty()    { return this.#données.length === 0; }
}

// Cas d'usage : BFS (Breadth-First Search)
function bfs(graph, départ) {
  const visités = new Set([départ]);
  const file = new File();
  file.enqueue(départ);
  const ordre = [];

  while (!file.isEmpty()) {
    const nœud = file.dequeue();
    ordre.push(nœud);
    for (const voisin of graph[nœud] ?? []) {
      if (!visités.has(voisin)) {
        visités.add(voisin);
        file.enqueue(voisin);
      }
    }
  }
  return ordre;
}`}</CodeBlock>

      <h2>Algorithmes pratiques</h2>
      <CodeBlock language="javascript">{`// Sliding window — O(n) pour les sous-tableaux consécutifs
function maxSommeConsécutive(arr, k) {
  let somme = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let max = somme;
  for (let i = k; i < arr.length; i++) {
    somme += arr[i] - arr[i - k];
    if (somme > max) max = somme;
  }
  return max;
}
maxSommeConsécutive([2, 1, 5, 1, 3, 2], 3); // 9 (5+1+3)

// Two pointers — O(n) pour trouver une paire de somme
function deuxSomme(arr, cible) {
  // arr doit être trié
  let [g, d] = [0, arr.length - 1];
  while (g < d) {
    const s = arr[g] + arr[d];
    if (s === cible) return [g, d];
    if (s < cible) g++;
    else d--;
  }
  return null;
}

// Dédupliquer et compter les occurrences en O(n)
function occurrences(arr) {
  return arr.reduce((map, val) => {
    map.set(val, (map.get(val) ?? 0) + 1);
    return map;
  }, new Map());
}
occurrences(['a', 'b', 'a', 'c', 'b', 'a']);
// Map { 'a' => 3, 'b' => 2, 'c' => 1 }`}</CodeBlock>

      <Challenge title="Anagrammes">
        Écris une fonction <code>sontAnagrammes(a, b)</code> qui vérifie si deux chaînes
        sont des anagrammes (même lettres, ordre différent). Vise une complexité O(n).
        <CodeBlock language="javascript">{`sontAnagrammes('listen', 'silent'); // true
sontAnagrammes('hello', 'world');   // false
sontAnagrammes('Écoute', 'écoute'); // true (insensible à la casse)

// Indice : penser à Map pour compter les lettres`}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 28,
  title: 'Algorithmes fondamentaux',
  icon: '🧮',
  level: 'Expert+',
  stars: '⭐⭐⭐⭐⭐',
  component: Ch28,
  quiz: [
    {
      question: 'Quelle est la complexité d\'une recherche binaire ?',
      sub: 'Le tableau doit être trié.',
      options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
      correct: 2,
      explanation: 'La recherche binaire divise l\'espace de recherche par 2 à chaque étape. Sur 1 million d\'éléments, elle effectue au maximum ~20 comparaisons.',
    },
    {
      question: 'Qu\'apporte la mémoïsation à une fonction récursive ?',
      sub: 'Optimisation des appels répétés.',
      options: [
        'Elle rend la récursion tail-call',
        'Elle met en cache les résultats déjà calculés pour éviter les recalculs',
        'Elle convertit la récursion en itération',
        'Elle réduit la profondeur de la pile'
      ],
      correct: 1,
      explanation: 'La mémoïsation stocke les résultats des appels précédents dans un cache. Fibonacci(40) passe de ~2^40 appels à 40 appels avec mémoïsation.',
    },
    {
      question: 'Une structure LIFO correspond à quelle structure de données ?',
      sub: 'Last In, First Out.',
      options: ['File (Queue)', 'Tableau trié', 'Pile (Stack)', 'Arbre binaire'],
      correct: 2,
      explanation: 'LIFO (Last In, First Out) = Pile (Stack). Le dernier élément ajouté est le premier sorti. Exemple : la pile d\'appels JavaScript (call stack).',
    },
  ],
};
