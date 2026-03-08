import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch28() {
  return (
    <>
      <div className="chapter-tag">Expert+</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-expert">🧮</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★★</div>
          <h3>Algorithmes fondamentaux</h3>
          <p>Complexité, recherche, tri, récursion, mémoïsation et structures de données</p>
        </div>
      </div>

      <h2>Qu'est-ce qu'un algorithme, et pourquoi s'en préoccuper ?</h2>
      <p>
        Un <strong>algorithme</strong> est une recette précise pour résoudre un problème : une suite
        finie d'étapes qui prend une entrée, fait des transformations bien définies, et produit une
        sortie. Comme une recette de cuisine, deux algorithmes peuvent produire le même résultat, mais
        l'un peut prendre 10 minutes et l'autre 3 heures pour la même quantité d'ingrédients.
      </p>
      <p>
        Les développeurs JavaScript ont souvent l'impression qu'ils n'ont pas besoin d'algorithmes —
        "les méthodes natives font le travail". C'est vrai pour la plupart des cas. Mais comprendre
        les algorithmes te donne trois avantages concrets : d'abord, tu peux choisir la <em>bonne</em>{' '}
        méthode native (un <code>Set</code> est O(1) pour la recherche, un tableau est O(n) — ça change
        tout sur 100 000 éléments). Ensuite, tu sais quand le code devient un goulot d'étranglement
        avant que les utilisateurs ne s'en plaignent. Enfin, les algorithmes sont omniprésents dans
        les entretiens techniques — les connaître t'ouvre des portes.
      </p>
      <InfoBox type="tip">
        Les algorithmes de tri et de recherche sont la fondation. Maîtrise-les et le reste devient
        naturel. Les concepts clés : Big O, récursion, mémoïsation, Stack, Queue, sliding window — tu
        les retrouveras dans des contextes inattendus (React, parseurs, systèmes de routing, etc.).
      </InfoBox>

      <h2>Notation Big O — combien de temps ça prend vraiment ?</h2>
      <p>
        La <strong>notation Big O</strong> décrit <em>comment le temps d'exécution évolue</em> quand
        la taille de l'entrée augmente. Ce n'est pas une mesure du temps absolu (en millisecondes),
        mais du <em>taux de croissance</em>. Sur un ordinateur lent, O(1) sera plus lent qu'O(n) pour
        n=3 — mais dès que n devient grand, c'est O(n) qui explose.
      </p>
      <p>
        Pense à un restaurant. <strong>O(1)</strong> c'est lire le menu pour trouver le prix d'un plat —
        peu importe que le menu ait 10 ou 1000 plats, tu regardes directement à la bonne page.{' '}
        <strong>O(n)</strong> c'est demander à chaque serveur si le plat du jour est disponible —
        plus il y a de serveurs, plus ça prend de temps. <strong>O(n²)</strong> c'est comparer
        chaque plat avec chaque autre plat pour trouver les doublons — 10 plats = 100 comparaisons,
        100 plats = 10 000 comparaisons.
      </p>
      <p>
        L'ordre de grandeur de complexité, du plus rapide au plus lent :{' '}
        <strong>O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²)</strong>.
        En JavaScript, les méthodes natives ont leurs complexités : <code>array[i]</code> est O(1),{' '}
        <code>Array.includes()</code> est O(n), <code>Set.has()</code> est O(1),{' '}
        <code>Array.sort()</code> est O(n log n), et une double boucle imbriquée est O(n²).
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
      <p>
        La recherche binaire illustre parfaitement O(log n) : à chaque étape, elle <em>coupe</em> l'espace
        de recherche en deux. Sur 1 million d'éléments, elle trouve la cible en au plus 20 étapes
        (car 2²⁰ = 1 048 576). Une recherche linéaire O(n) prendrait jusqu'à 1 000 000 d'étapes.
        Le prérequis : le tableau doit être <strong>trié</strong>.
      </p>

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

      <h2>Algorithmes de tri — stratégies et compromis</h2>
      <p>
        Trier une liste est l'un des problèmes les plus étudiés en informatique. Il n'existe pas d'algorithme
        de tri "parfait" — chaque approche a ses forces et ses faiblesses selon la taille des données,
        si elles sont déjà partiellement triées, et la mémoire disponible. Comprendre comment ils fonctionnent
        t'aide à choisir le bon outil et à comprendre pourquoi <code>Array.sort()</code> se comporte
        parfois de façon surprenante.
      </p>
      <p>
        Voici les stratégies de chaque algorithme classique. Le <strong>Bubble sort</strong> compare
        deux voisins adjacents et les échange si nécessaire — à chaque passage complet, le plus grand
        élément "remonte" comme une bulle à la surface. Simple à comprendre, catastrophique en
        performance (O(n²)). Le <strong>Selection sort</strong> cherche le minimum dans le tableau,
        le place en premier, puis recommence sur le reste — comme trier une main de cartes en prenant
        toujours la plus petite. Le <strong>Insertion sort</strong> construit le tableau trié un élément
        à la fois, en insérant chaque nouvel élément à sa bonne place — exactement comme on trie
        les cartes qu'on reçoit une par une dans sa main.
      </p>
      <p>
        Le <strong>Merge sort</strong> adopte une stratégie "diviser pour régner" : il coupe le tableau
        en deux moitiés, trie chaque moitié récursivement, puis les fusionne. Comme trier deux piles
        de cartes déjà triées et les mélanger en ordre. Garanti O(n log n). Le <strong>Quick sort</strong>
        choisit un "pivot" et partitionne le tableau en éléments plus petits et plus grands que le pivot,
        puis trie chaque partition récursivement. En moyenne O(n log n), mais O(n²) si le pivot est
        mal choisi.
      </p>
      <CodeBlock language="javascript">{`// Bubble sort — O(n²) — éducatif, pas utilisé en prod
// Stratégie : comparer les voisins, les échanger si besoin — les grands "remontent"
function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  return a;
}

// Selection sort — O(n²)
// Stratégie : trouver le minimum, le placer en tête, recommencer sur le reste
function selectionSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [a[i], a[minIdx]] = [a[minIdx], a[i]];
  }
  return a;
}

// Insertion sort — O(n²) moyen, O(n) si déjà trié
// Stratégie : trier les cartes une par une, insérer chaque carte à sa place
function insertionSort(arr) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const clé = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > clé) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = clé;
  }
  return a;
}

// Merge sort — O(n log n) — diviser pour régner
// Stratégie : couper en deux, trier chaque moitié, fusionner
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
// Stratégie : choisir un pivot, tout ce qui est < pivot à gauche, > à droite
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  return [
    ...quickSort(arr.filter(x => x < pivot)),
    ...arr.filter(x => x === pivot),
    ...quickSort(arr.filter(x => x > pivot)),
  ];
}`}</CodeBlock>
      <InfoBox type="tip">
        <code>Array.prototype.sort()</code> dans le moteur V8 de Node.js utilise <strong>TimSort</strong> —
        un algorithme hybride qui combine Merge sort et Insertion sort. Il est O(n log n) en moyenne,
        mais se dégrade en O(n) quand le tableau est déjà (presque) trié. C'est pourquoi le tri natif
        de JavaScript est excellemment optimisé pour les cas réels — tu n'as presque jamais besoin
        d'implémenter ton propre algorithme de tri en production.
      </InfoBox>

      <h2>Récursion — quand une fonction s'appelle elle-même</h2>
      <p>
        La <strong>récursion</strong> est une technique où une fonction se résout en s'appelant elle-même
        sur un problème plus petit. Pense aux poupées russes : pour ouvrir la grande poupée, tu ouvres
        la suivante, qui contient la suivante, jusqu'à atteindre la plus petite qui ne s'ouvre pas —
        c'est le <strong>cas de base</strong>.
      </p>
      <p>
        Chaque appel récursif crée un nouveau <strong>frame dans la call stack</strong> — une case
        mémoire qui retient les variables locales et l'endroit où reprendre l'exécution quand l'appel
        se termine. Si tu visualises <code>factorielle(4)</code> mentalement : <code>4 * factorielle(3)</code>,
        qui est <code>3 * factorielle(2)</code>, qui est <code>2 * factorielle(1)</code>, qui retourne
        1. La pile commence alors à "se dérouler" de bas en haut : 1, puis 2*1=2, puis 3*2=6, puis 4*6=24.
      </p>
      <p>
        Le <strong>cas de base</strong> est la condition d'arrêt — sans lui, la fonction s'appelle
        infiniment et la stack overflow (la pile déborde). C'est l'équivalent du fond des poupées
        russes : sans la petite poupée solide, tu ouvres les poupées pour toujours.
      </p>
      <CodeBlock language="javascript">{`// Récursion — une fonction qui s'appelle elle-même
function factorielle(n) {
  if (n <= 1) return 1;          // cas de base — la petite poupée solide
  return n * factorielle(n - 1); // appel récursif — ouvrir la poupée suivante
}
factorielle(5); // 5 * 4 * 3 * 2 * 1 = 120

// Visualisation de la call stack pour factorielle(4) :
// → factorielle(4) attend factorielle(3)
//   → factorielle(3) attend factorielle(2)
//     → factorielle(2) attend factorielle(1)
//       → factorielle(1) retourne 1     ← cas de base atteint
//     ← factorielle(2) retourne 2*1 = 2
//   ← factorielle(3) retourne 3*2 = 6
// ← factorielle(4) retourne 4*6 = 24

// ❌ Fibonacci naïf — O(2^n), TRÈS lent
function fibLent(n) {
  if (n <= 1) return n;
  return fibLent(n - 1) + fibLent(n - 2);
  // fibLent(5) calcule fibLent(3) DEUX FOIS
  // fibLent(30) fait ~2^30 = 1 milliard d'appels !
}`}</CodeBlock>
      <InfoBox type="warning">
        La call stack JavaScript a une limite — typiquement autour de <strong>10 000 à 15 000 appels
        récursifs</strong> avant d'obtenir une <code>RangeError: Maximum call stack size exceeded</code>.
        Pour les grandes profondeurs, préfère une version itérative (avec une boucle et une pile explicite)
        ou la <em>tail call optimization</em> (optimisation des appels terminaux, supportée en mode strict
        dans certains environnements).
      </InfoBox>

      <h2>Mémoïsation — échanger de la mémoire contre de la vitesse</h2>
      <p>
        La <strong>mémoïsation</strong> est une technique d'optimisation qui consiste à sauvegarder
        les résultats des appels de fonction déjà calculés, pour ne pas les recalculer si on demande
        à nouveau le même résultat. C'est le principe du carnet de notes : la première fois que tu
        calcules 47 × 83, tu notes le résultat. La prochaine fois qu'on te pose la même question,
        tu regardes dans ton carnet au lieu de recalculer.
      </p>
      <p>
        Le problème de Fibonacci illustre parfaitement pourquoi c'est puissant. <code>fibLent(5)</code>
        calcule <code>fib(3)</code> deux fois, <code>fib(2)</code> trois fois, <code>fib(1)</code>
        cinq fois. Pour <code>fibLent(40)</code>, c'est un arbre d'appels avec des milliards de noeuds.
        Avec la mémoïsation, chaque valeur n'est calculée <em>qu'une seule fois</em> — la complexité
        passe de O(2ⁿ) à O(n).
      </p>
      <CodeBlock language="javascript">{`// ✅ Mémoïsation — mettre en cache les résultats calculés
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
// Première fois : calcule et met en cache fib(0)...fib(40)
// Deuxième fois : retourne depuis le cache en O(1)

// Programmation dynamique (bottom-up, sans récursion)
// Encore plus efficace : O(n) temps, O(1) mémoire
function fibDP(n) {
  if (n <= 1) return n;
  let [a, b] = [0, 1];
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
fibDP(50); // 12586269025`}</CodeBlock>
      <p>
        La version <strong>bottom-up</strong> (<code>fibDP</code>) est encore plus efficace que la
        mémoïsation : elle construit les résultats du bas vers le haut, en ne gardant en mémoire que
        les deux derniers résultats. O(n) en temps, O(1) en espace. C'est ce qu'on appelle la
        <strong> programmation dynamique</strong> — décomposer un problème en sous-problèmes,
        résoudre chaque sous-problème une seule fois et stocker la solution.
      </p>
      <InfoBox type="tip">
        La mémoïsation est utile quand les appels récursifs se <strong>répètent</strong>
        (comme Fibonacci). Pour de larges n, la version itérative (bottom-up) est
        généralement plus efficace en mémoire — elle n'accumule pas de frames dans la call stack.
      </InfoBox>

      <h2>Structures de données : Pile (Stack) et File (Queue)</h2>
      <p>
        Deux structures fondamentales, qui différent uniquement par l'ordre dans lequel on retire les éléments.
        La <strong>Pile (Stack)</strong> fonctionne comme une pile d'assiettes : tu empiles des assiettes
        une par une, et quand tu en veux une, tu prends toujours <em>celle du dessus</em> — la dernière
        posée. C'est le principe <strong>LIFO</strong> : <em>Last In, First Out</em>. La call stack de
        JavaScript est littéralement une pile : le dernier appel de fonction empilé est le premier à
        être dépilé.
      </p>
      <p>
        La <strong>File (Queue)</strong> fonctionne comme une file d'attente à la caisse du supermarché :
        le premier client arrivé est le premier servi. Principe <strong>FIFO</strong> : <em>First In,
        First Out</em>. La file d'événements JavaScript (event queue) fonctionne exactement ainsi —
        les callbacks enregistrés avec <code>setTimeout</code>, les événements click, les messages
        postMessage s'ajoutent à la fin de la file et sont traités dans l'ordre.
      </p>
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
// Principe : ouvrir → empiler, fermer → dépiler et vérifier la correspondance
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
// On explore les voisins niveau par niveau — la file garantit l'ordre
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
      <InfoBox type="tip">
        La pile est partout dans JavaScript : l'historique du navigateur (retour = dépiler la dernière
        page), l'annulation dans un éditeur de texte (Ctrl+Z = dépiler la dernière action), la
        récursion (chaque appel empile un frame). La file est dans l'event loop, dans les systèmes
        de messages, dans les impressions d'imprimante.
      </InfoBox>

      <h2>Sliding Window et Two Pointers — efficacité O(n)</h2>
      <p>
        Le pattern <strong>Sliding Window</strong> (fenêtre glissante) résout élégamment les problèmes
        sur des sous-tableaux ou sous-chaînes consécutifs. Au lieu de recalculer la somme à chaque
        position depuis zéro (O(n×k)), on maintient une fenêtre de taille fixe k qui <em>glisse</em>
        sur le tableau : à chaque étape, on ajoute le nouvel élément entrant et on soustrait l'élément
        sortant. Une seule passe suffit — O(n).
      </p>
      <p>
        Visualise une fenêtre de voiture qui laisse défiler le paysage : tu ne recommences pas à regarder
        depuis le début à chaque kilomètre, tu ajustes simplement ce qui entre et ce qui sort du cadre.
        Le pattern <strong>Two Pointers</strong> (deux pointeurs) utilise deux indices qui se déplacent
        vers le centre d'un tableau trié — efficace pour les problèmes de paires ou de sous-tableaux
        satisfaisant une condition.
      </p>
      <CodeBlock language="javascript">{`// Sliding window — O(n) pour les sous-tableaux consécutifs
// Problème : trouver la somme maximale de k éléments consécutifs
function maxSommeConsécutive(arr, k) {
  // Initialiser la première fenêtre
  let somme = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let max = somme;

  // Faire glisser la fenêtre : ajouter arr[i], retirer arr[i-k]
  for (let i = k; i < arr.length; i++) {
    somme += arr[i] - arr[i - k]; // +nouvel élément, -ancien élément
    if (somme > max) max = somme;
  }
  return max;
}
maxSommeConsécutive([2, 1, 5, 1, 3, 2], 3); // 9 (5+1+3)

// Two pointers — O(n) pour trouver une paire de somme
// Prérequis : tableau trié
function deuxSomme(arr, cible) {
  let [g, d] = [0, arr.length - 1];
  while (g < d) {
    const s = arr[g] + arr[d];
    if (s === cible) return [g, d];
    if (s < cible) g++;  // somme trop petite → avancer le pointeur gauche
    else d--;            // somme trop grande → reculer le pointeur droit
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
      <InfoBox type="danger">
        Le piège classique des débutants : utiliser <code>Array.indexOf()</code> ou{' '}
        <code>Array.includes()</code> à l'intérieur d'une boucle. Chaque appel est O(n),
        donc la boucle entière devient O(n²) sans que tu t'en rendes compte. La solution :
        convertir le tableau en <code>Set</code> ou en <code>Map</code> <em>avant</em> la boucle —
        les lookups sont O(1), et la boucle entière reste O(n).
      </InfoBox>

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
  id: 21,
  title: 'Algorithmes fondamentaux',
  icon: '🧮',
  level: 'Expert+',
  stars: '★★★★★',
  component: Ch28,
  quiz: [
    {
      question: 'Quelle est la complexité d\'une recherche binaire ?',
      sub: 'Le tableau doit être trié.',
      options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
      correct: 2,
      explanation: '✅ Exact ! La recherche binaire divise l\'espace de recherche par 2 à chaque étape : c\'est la définition de O(log n). Sur 1 million d\'éléments, elle effectue au maximum ~20 comparaisons (car log₂(1 000 000) ≈ 20), contre 1 000 000 pour une recherche linéaire. Le prérequis absolu : le tableau doit être trié — sinon l\'algorithme ne peut pas décider quelle moitié écarter.',
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
      explanation: '✅ Exact ! La mémoïsation stocke dans un cache (Map ou objet) les résultats des appels précédents. Pour Fibonacci, sans mémoïsation, fib(40) fait ~2⁴⁰ ≈ 1 milliard d\'appels car les mêmes valeurs sont recalculées des milliers de fois. Avec mémoïsation, chaque fib(n) est calculé une seule fois — on passe de O(2ⁿ) à O(n). C\'est l\'exemple parfait de "échanger de la mémoire contre de la vitesse".',
    },
    {
      question: 'Une structure LIFO correspond à quelle structure de données ?',
      sub: 'Last In, First Out.',
      options: ['File (Queue)', 'Tableau trié', 'Pile (Stack)', 'Arbre binaire'],
      correct: 2,
      explanation: '✅ Exact ! LIFO (Last In, First Out) = Pile (Stack). Le dernier élément ajouté est le premier sorti — comme une pile d\'assiettes. La call stack JavaScript est une pile : le dernier appel de fonction empilé est le premier à se terminer. Le contraire est FIFO (First In, First Out) = File (Queue), comme une queue de supermarché ou la file d\'événements de l\'event loop.',
    },
    {
      question: 'Quelle est la complexité du Quick sort dans le pire cas, et quand se produit-il ?',
      sub: 'Complexité du Quick sort.',
      options: [
        'O(n log n) dans tous les cas, il n\'y a pas de pire cas',
        'O(n²) quand le pivot choisi est systématiquement le plus petit ou le plus grand élément (tableau déjà trié)',
        'O(n³) quand les données contiennent beaucoup de doublons',
        'O(log n) quand le tableau est déjà trié',
      ],
      correct: 1,
      explanation: '✅ Exact ! Le Quick sort est O(n²) dans le pire cas, qui survient quand le pivot est systématiquement mal choisi — par exemple le plus petit ou le plus grand élément. Cela arrive souvent si on prend toujours le premier élément comme pivot et que le tableau est déjà trié (ou inversé). En moyenne, avec un pivot aléatoire ou médian, Quick sort est O(n log n) et très rapide en pratique grâce à ses bonnes propriétés de cache. C\'est pour cela que V8 utilise TimSort plutôt que Quick sort pur.',
    },
    {
      question: 'Dans quels cas la programmation dynamique par mémoïsation est-elle applicable ?',
      sub: 'Condition d\'applicabilité de la mémoïsation.',
      options: [
        'Quand la fonction est pure et que des sous-problèmes identiques se répètent (sous-structure optimale)',
        'Uniquement pour les fonctions récursives qui traitent des entiers',
        'Quand le résultat de la fonction change à chaque appel',
        'Uniquement lorsque la complexité de la fonction est O(n²) ou plus',
      ],
      correct: 0,
      explanation: '✅ Exact ! La mémoïsation s\'applique quand deux conditions sont réunies : la fonction doit être pure (même entrée → même sortie, sans effets de bord) et le problème doit exhiber des sous-problèmes qui se répètent. Fibonacci est l\'exemple canonique : fib(5) recalcule fib(3) deux fois, fib(2) trois fois, etc. Sans répétition de sous-problèmes, la mémoïsation n\'apporte aucun gain — elle ajoute juste le coût du cache pour rien.',
    },
    {
      question: 'Quand doit-on préférer BFS (parcours en largeur) à DFS (parcours en profondeur) dans un graphe ?',
      sub: 'BFS vs DFS — cas d\'usage.',
      options: [
        'BFS est toujours préférable car il utilise moins de mémoire',
        'BFS trouve le plus court chemin (en nombre d\'arêtes) dans un graphe non pondéré, DFS est mieux pour détecter des cycles ou explorer exhaustivement',
        'DFS est toujours préférable car il est récursif et plus simple à implémenter',
        'Les deux algorithmes donnent toujours le même résultat, seule la syntaxe diffère',
      ],
      correct: 1,
      explanation: '✅ Exact ! BFS (qui utilise une File) explore les nœuds niveau par niveau — il garantit donc de trouver le chemin le plus court en nombre d\'arêtes dans un graphe non pondéré. C\'est l\'algorithme de choix pour "quel est le chemin minimal ?" ou "à quelle distance se trouve X ?". DFS (qui utilise une Pile ou la récursion) plonge profondément avant de revenir — il est plus adapté pour détecter des cycles, explorer tous les chemins possibles, ou résoudre des puzzles de type labyrinthe.',
    },
    {
      question: 'Quelle est la complexité d\'insertion dans une liste chaînée au début, comparée à un tableau ?',
      sub: 'Structures de données — liste chaînée vs tableau.',
      options: [
        'O(n) pour les deux, car il faut parcourir les éléments',
        'O(1) pour la liste chaînée, O(n) pour un tableau (car il faut décaler tous les éléments)',
        'O(1) pour le tableau, O(n) pour la liste chaînée',
        'O(log n) pour les deux avec les optimisations modernes',
      ],
      correct: 1,
      explanation: '✅ Exact ! Une liste chaînée peut insérer au début en O(1) : il suffit de créer un nouveau nœud et de faire pointer son "next" vers l\'ancienne tête. Un tableau doit décaler tous les éléments d\'une position vers la droite, ce qui est O(n). En revanche, l\'accès par indice est O(1) pour un tableau et O(n) pour une liste chaînée (il faut traverser les nœuds). Choisis la structure selon l\'opération dominante dans ton cas d\'usage.',
    },
    {
      question: 'Qu\'est-ce que la "tail call optimization" (optimisation des appels terminaux) ?',
      sub: 'Récursion et optimisation de la call stack.',
      options: [
        'Une technique qui convertit automatiquement toute récursion en boucle itérative',
        'Une optimisation où le moteur JavaScript réutilise le frame de pile courant pour un appel récursif terminal, évitant l\'accumulation de frames',
        'Une méthode pour mettre en cache les derniers appels de fonction effectués',
        'Un algorithme de tri optimisé pour les tableaux presque triés',
      ],
      correct: 1,
      explanation: '✅ Exact ! La tail call optimization (TCO) s\'applique quand l\'appel récursif est la dernière opération de la fonction — son résultat est directement retourné sans traitement supplémentaire. Dans ce cas, le moteur peut réutiliser le même frame de pile au lieu d\'en empiler un nouveau, évitant le stack overflow pour de grandes profondeurs. En mode strict ES6, la TCO est spécifiée mais n\'est implémentée que par certains moteurs (Safari oui, V8 non). Pour garantir l\'absence de stack overflow en JavaScript, une boucle explicite reste plus fiable.',
    },
  ],
};
