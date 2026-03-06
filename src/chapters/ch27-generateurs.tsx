import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch27() {
  return (
    <>
      <div className="chapter-tag">Expert</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-expert">🌀</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">⭐⭐⭐⭐</div>
          <h3>Générateurs &amp; Itérateurs</h3>
          <p>Protocoles itérables, generators, évaluation paresseuse et séquences infinies</p>
        </div>
      </div>

      <h2>Le protocole itérable</h2>
      <p>
        En JavaScript, un objet est <strong>itérable</strong> s'il possède une méthode
        <code>[Symbol.iterator]()</code> qui retourne un <strong>itérateur</strong>.
        Un itérateur est un objet avec une méthode <code>next()</code> qui retourne <code>{'{ value, done }'}</code>.
      </p>
      <CodeBlock language="javascript">{`// Les types itérables natifs
for (const v of [1, 2, 3]) {}        // Array
for (const c of 'hello') {}          // String
for (const [k, v] of new Map()) {}   // Map
for (const v of new Set()) {}        // Set

// Tous utilisent le protocole itérable en interne
const arr = [1, 2, 3];
const iter = arr[Symbol.iterator](); // obtenir l'itérateur

iter.next(); // { value: 1, done: false }
iter.next(); // { value: 2, done: false }
iter.next(); // { value: 3, done: false }
iter.next(); // { value: undefined, done: true }

// Créer un objet itérable personnalisé
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      }
    };
  }
};

for (const n of range) console.log(n); // 1 2 3 4 5
console.log([...range]); // [1, 2, 3, 4, 5]`}</CodeBlock>

      <h2>Fonctions génératrices</h2>
      <p>
        <code>function*</code> crée une <strong>fonction génératrice</strong>. Elle retourne
        un générateur (qui est à la fois un itérateur ET un itérable). Le mot clé
        <code>yield</code> suspend l'exécution et renvoie une valeur.
      </p>
      <CodeBlock language="javascript">{`function* compteur(début, fin) {
  for (let i = début; i <= fin; i++) {
    yield i; // suspend et renvoie i
  }
}

const gen = compteur(1, 3);
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }

// Syntaxe for...of et spread
for (const n of compteur(1, 5)) console.log(n);
console.log([...compteur(1, 5)]); // [1, 2, 3, 4, 5]

// Séquence de Fibonacci infinie
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Prendre les n premiers éléments
function take(gen, n) {
  const result = [];
  for (const val of gen) {
    result.push(val);
    if (result.length >= n) break;
  }
  return result;
}

take(fibonacci(), 8); // [0, 1, 1, 2, 3, 5, 8, 13]`}</CodeBlock>

      <InfoBox type="tip">
        Les générateurs permettent l'<strong>évaluation paresseuse</strong> : les valeurs
        sont calculées à la demande, pas toutes en avance. Parfait pour les grandes quantités
        de données ou les séquences infinies.
      </InfoBox>

      <h2>yield* — délégation</h2>
      <CodeBlock language="javascript">{`// yield* délègue à un autre itérable
function* aplatir(tableau) {
  for (const item of tableau) {
    if (Array.isArray(item)) {
      yield* aplatir(item); // récursion
    } else {
      yield item;
    }
  }
}

[...aplatir([1, [2, [3, 4]], 5])]; // [1, 2, 3, 4, 5]

// Combiner plusieurs generators
function* concat(...iterables) {
  for (const iter of iterables) {
    yield* iter;
  }
}

[...concat([1, 2], [3, 4], [5, 6])]; // [1, 2, 3, 4, 5, 6]`}</CodeBlock>

      <h2>Communication bidirectionnelle avec next(valeur)</h2>
      <CodeBlock language="javascript">{`function* dialogue() {
  const prénom = yield 'Quel est ton prénom ?';
  const ville  = yield \`Bonjour \${prénom} ! Tu habites où ?\`;
  yield \`\${prénom} de \${ville}, enchanté !\`;
}

const conv = dialogue();
console.log(conv.next().value);         // 'Quel est ton prénom ?'
console.log(conv.next('Alice').value);  // 'Bonjour Alice ! Tu habites où ?'
console.log(conv.next('Paris').value);  // 'Alice de Paris, enchanté !'

// Gestion d'erreurs dans un générateur
function* risqué() {
  try {
    const val = yield 'démarrage';
    yield \`reçu : \${val}\`;
  } catch (err) {
    yield \`erreur capturée : \${err.message}\`;
  }
}

const g = risqué();
g.next();                    // démarrage
g.throw(new Error('oups')); // { value: 'erreur capturée : oups', done: false }`}</CodeBlock>

      <h2>Générateurs asynchrones</h2>
      <CodeBlock language="javascript">{`// async function* combine async/await et generators
async function* paginer(url) {
  let page = 1;
  while (true) {
    const res = await fetch(\`\${url}?page=\${page}\`);
    const data = await res.json();
    if (data.items.length === 0) return;
    yield* data.items;
    page++;
  }
}

// Consommation avec for await...of
async function chargerTous() {
  const résultats = [];
  for await (const item of paginer('/api/produits')) {
    résultats.push(item);
    if (résultats.length >= 50) break; // arrêt précoce
  }
  return résultats;
}

// Stream de données en temps réel
async function* lireStream(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) return;
    yield decoder.decode(value);
  }
}

const res = await fetch('/api/stream');
for await (const chunk of lireStream(res)) {
  afficher(chunk);
}`}</CodeBlock>

      <h2>Cas d'usage réels</h2>
      <CodeBlock language="javascript">{`// 1. Pipeline de transformation lazy
function* map(iter, fn) {
  for (const val of iter) yield fn(val);
}
function* filter(iter, pred) {
  for (const val of iter) if (pred(val)) yield val;
}

// Traiter un million de lignes sans tout charger en mémoire
const résultat = take(
  map(
    filter(grandFichier(), ligne => ligne.includes('ERROR')),
    ligne => ligne.trim()
  ),
  100 // seulement les 100 premières erreurs
);

// 2. ID unique incrémental
function* idGenerator(préfixe = '') {
  let id = 1;
  while (true) yield \`\${préfixe}\${id++}\`;
}
const nextId = idGenerator('user-');
nextId.next().value; // 'user-1'
nextId.next().value; // 'user-2'

// 3. Reprendre une opération en plusieurs fois (coroutines)
function* traitementLong(données) {
  for (let i = 0; i < données.length; i++) {
    yield i / données.length; // progression 0..1
    traiterItem(données[i]);
  }
}`}</CodeBlock>

      <Challenge title="Range générateur">
        Implémente un générateur <code>range(start, end, step=1)</code>
        similaire à Python, qui supporte les pas négatifs.
        <CodeBlock language="javascript">{`function* range(start, end, step = 1) {
  // Votre code ici
}

[...range(0, 10, 2)];   // [0, 2, 4, 6, 8]
[...range(10, 0, -2)];  // [10, 8, 6, 4, 2]
[...range(5)];          // Si appelé avec un seul arg : [0, 1, 2, 3, 4]`}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 27,
  title: 'Générateurs & Itérateurs',
  icon: '🌀',
  level: 'Expert',
  stars: '⭐⭐⭐⭐',
  component: Ch27,
  quiz: [
    {
      question: 'Qu\'est-ce que yield fait dans une fonction génératrice ?',
      sub: 'Comportement clé des generators.',
      options: [
        'Termine le générateur',
        'Retourne une valeur et suspend l\'exécution jusqu\'au prochain next()',
        'Appelle récursivement le générateur',
        'Lance une exception'
      ],
      correct: 1,
      explanation: 'yield suspend l\'exécution de la fonction génératrice, retourne la valeur à l\'appelant, et reprend là où elle s\'était arrêtée lors du prochain appel à next().',
    },
    {
      question: 'Comment consommer un générateur asynchrone ?',
      sub: 'async generators et for await.',
      options: [
        'for...of',
        'for await...of',
        '.then() sur chaque next()',
        'await gen.all()'
      ],
      correct: 1,
      explanation: 'for await...of est conçu pour consommer les générateurs asynchrones (async function*), attendant chaque valeur produite par yield.',
    },
    {
      question: 'Quelle est la valeur de done quand le générateur est épuisé ?',
      sub: 'Protocole itérateur.',
      options: ['null', 'false', 'true', '"done"'],
      correct: 2,
      explanation: 'Quand un générateur est épuisé (plus de yield), next() retourne { value: undefined, done: true }.',
    },
  ],
};
