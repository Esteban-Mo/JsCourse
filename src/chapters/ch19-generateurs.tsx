import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch27() {
  return (
    <>
      <div className="chapter-tag">Expert</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-expert">🌀</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★★</div>
          <h3>Générateurs &amp; Itérateurs</h3>
          <p>Protocoles itérables, generators, évaluation paresseuse et séquences infinies</p>
        </div>
      </div>

      <h2>Le modèle PUSH vs PULL — la révolution des générateurs</h2>
      <p>
        Une fonction JavaScript normale fonctionne en mode <strong>PUSH</strong> : vous l'appelez, elle
        calcule toutes ses valeurs, et vous "jette" le résultat final en une seule fois. Imaginez quelqu'un
        qui remplit un seau d'eau et vous le lance — vous recevez tout le contenu d'un coup, que vous
        en ayez besoin ou non. Si le seau contient un million de litres (un million d'éléments à calculer),
        vous devez attendre que tout soit rempli avant de pouvoir utiliser la première goutte.
      </p>
      <p>
        Les générateurs introduisent le modèle <strong>PULL</strong> : vous contrôlez le débit. C'est
        un robinet plutôt qu'un seau. Vous "tirez" une valeur quand vous en avez besoin, le générateur
        calcule uniquement cette valeur et se met en pause, en attendant que vous demandiez la suivante.
        Cette évaluation à la demande s'appelle l'<strong>évaluation paresseuse</strong> (lazy evaluation).
        Les conséquences sont profondes : vous pouvez manipuler des séquences de millions d'éléments,
        voire de séquences infinies, sans jamais les stocker entièrement en mémoire.
      </p>
      <InfoBox type="tip">
        Les générateurs ne sont <strong>pas</strong> la même chose que les fonctions <code>async</code>.
        Les fonctions async concernent l'attente d'opérations I/O (réseau, disque). Les générateurs
        concernent le contrôle de flux et l'évaluation paresseuse de séquences. Ce sont deux concepts
        orthogonaux — qui peuvent néanmoins être combinés (async generators) comme on le verra.
      </InfoBox>

      <h2>Le protocole itérable</h2>
      <p>
        Avant de comprendre les générateurs, il faut comprendre le protocole sur lequel ils reposent.
        JavaScript définit une interface uniforme pour tout ce qui peut être "parcouru" : le{' '}
        <strong>protocole itérable</strong>. Un objet est itérable s'il possède une méthode spéciale
        accessible via la clé <code>Symbol.iterator</code>. Cette méthode, quand on l'appelle, retourne
        un <strong>itérateur</strong> — un objet avec une méthode <code>next()</code>.
      </p>
      <p>
        Chaque appel à <code>next()</code> retourne un objet de la forme <code>{'{ value, done }'}</code>.
        Tant que <code>done</code> vaut <code>false</code>, <code>value</code> contient la valeur courante.
        Quand la séquence est épuisée, <code>done</code> passe à <code>true</code> et <code>value</code>
        vaut <code>undefined</code>. Pourquoi ce protocole ? Il fournit une interface commune qui permet
        à <code>for...of</code>, l'opérateur spread (<code>...</code>) et la destructuration de fonctionner
        de manière identique sur les tableaux, les strings, les Maps, les Sets, et tout objet personnalisé
        respectant ce contrat.
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

      <p>
        Cet objet <code>range</code> illustre parfaitement le protocole : il implémente{' '}
        <code>[Symbol.iterator]()</code> qui retourne un objet avec <code>next()</code>. Mais écrire
        ce boilerplate manuellement est verbeux et sujet aux erreurs. Les générateurs sont la syntaxe
        élégante de JavaScript pour créer des itérateurs sans tout ce code répétitif.
      </p>

      <h2>Fonctions génératrices — function*</h2>
      <p>
        La syntaxe <code>function*</code> (avec un astérisque) déclare une <strong>fonction génératrice</strong>.
        L'astérisque n'est pas un opérateur de multiplication ici — c'est un marqueur syntaxique qui
        dit au moteur JavaScript : "cette fonction ne s'exécute pas normalement ; elle retourne un objet
        Générateur". Appeler une fonction génératrice ne l'exécute <em>pas</em>. Elle retourne immédiatement
        un objet Générateur, et le corps de la fonction ne commence à s'exécuter qu'au premier appel
        à <code>.next()</code>.
      </p>
      <p>
        Le mot-clé <code>yield</code> est le cœur du générateur. Il fait deux choses simultanément :
        il <strong>suspend</strong> l'exécution de la fonction génératrice à cet endroit précis, et
        il <strong>retourne</strong> la valeur à droite vers l'appelant via l'objet{' '}
        <code>{'{ value, done: false }'}</code>. Quand <code>.next()</code> est appelé à nouveau,
        l'exécution reprend exactement là où elle s'était arrêtée, comme si on avait appuyé sur "lecture"
        après une pause.
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

      <p>
        Regardez la boucle <code>while (true)</code> dans <code>fibonacci()</code>. Cette boucle infinie
        serait catastrophique dans une fonction normale — elle bloquerait le navigateur pour toujours.
        Dans un générateur, c'est parfaitement sûr : la boucle ne tourne que quand vous appelez{' '}
        <code>.next()</code>, et s'arrête dès que vous n'en avez plus besoin. La fonction <code>take()</code>
        utilise <code>break</code> pour sortir du <code>for...of</code>, ce qui envoie un signal d'arrêt
        au générateur (il ne calculera jamais le 9ème nombre de Fibonacci, même si la boucle est infinie).
      </p>
      <InfoBox type="success">
        Les générateurs sont <strong>extrêmement efficaces en mémoire</strong> pour les grands ensembles
        de données. Un générateur qui produit un million de nombres n'occupe que quelques octets en mémoire
        — contre plusieurs mégaoctets pour un tableau de un million d'éléments. Si vous traitez de grandes
        collections et n'avez besoin que d'une partie des résultats, les générateurs sont la solution idéale.
      </InfoBox>

      <h2>yield* — délégation vers un autre itérable</h2>
      <p>
        <code>yield*</code> est une forme spéciale de yield qui délègue l'itération à un autre itérable
        ou générateur. Plutôt que de yielder un tableau ou un générateur entier comme valeur unique,{' '}
        <code>yield*</code> "déplie" cet itérable et yield chacun de ses éléments individuellement.
        C'est l'équivalent de parcourir l'itérable avec un <code>for...of</code> et de yielder chaque
        valeur une par une — mais en syntaxe concise.
      </p>
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

      <p>
        La récursion dans <code>aplatir()</code> est particulièrement élégante : quand on rencontre
        un sous-tableau, on yield* tous ses éléments en appelant récursivement le même générateur.
        Cela aplati des structures imbriquées arbitrairement profondes, et grâce à l'évaluation paresseuse,
        chaque élément n'est extrait que quand il est demandé.
      </p>

      <h2>yield comme rue à double sens — next(valeur)</h2>
      <p>
        Jusqu'ici, yield ne faisait que <em>sortir</em> des valeurs du générateur vers l'appelant.
        Mais <code>yield</code> est en réalité une <strong>communication bidirectionnelle</strong>.
        L'expression <code>const x = yield quelqueChose</code> fait deux choses : elle sort{' '}
        <code>quelqueChose</code> vers l'appelant, <em>et</em> reçoit en retour la valeur passée au
        prochain <code>.next(valeur)</code>. Le yield est simultanément une sortie et une entrée.
      </p>
      <p>
        Cette capacité permet aux générateurs de fonctionner comme des <strong>coroutines</strong> :
        deux morceaux de code qui se passent la main en échangeant des données. C'est sur ce mécanisme
        que la bibliothèque <code>co</code> a construit le support async/await avant que ce dernier
        soit natif dans JavaScript.
      </p>
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

      <InfoBox type="warning">
        Notez que le premier <code>conv.next()</code> n'accepte pas d'argument utile — la valeur passée
        serait ignorée, car il n'y a pas encore d'expression <code>yield</code> en attente de recevoir
        quoi que ce soit. La première valeur envoyée via <code>next()</code> n'est "reçue" qu'à partir
        du deuxième appel. C'est une source fréquente de confusion pour les débutants avec les générateurs.
      </InfoBox>

      <h2>Générateurs asynchrones</h2>
      <p>
        La combinaison <code>async function*</code> crée un <strong>générateur asynchrone</strong> :
        un générateur qui peut utiliser <code>await</code> à l'intérieur. Chaque valeur qu'il yield
        est enveloppée dans une Promise, et on le consomme avec <code>for await...of</code> plutôt
        que <code>for...of</code>. C'est la solution élégante pour les scénarios où vous avez une
        source de données asynchrone et infinie : une API paginée, un stream réseau, un flux d'événements
        en temps réel.
      </p>
      <p>
        Sans générateur asynchrone, pour parcourir une API paginée, vous devriez soit tout charger
        en mémoire (mauvais), soit écrire une boucle manuelle complexe avec des Promises chaînées
        (verbeux et fragile). Avec un générateur asynchrone, la logique de pagination est encapsulée
        proprement dans la fonction génératrice, et le code consommateur est aussi simple qu'un{' '}
        <code>for await...of</code>.
      </p>
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

      <p>
        Le <code>break</code> dans <code>chargerTous()</code> illustre une force des générateurs asynchrones :
        l'arrêt précoce est gratuit. Quand on sort du <code>for await...of</code>, le générateur est
        immédiatement suspendu et les pages suivantes ne sont jamais chargées depuis le réseau. Avec
        une approche traditionnelle, vous auriez dû implémenter vous-même la logique d'annulation.
      </p>

      <h2>Cas d'usage réels</h2>

      <p>Les générateurs excellent particulièrement dans trois grands domaines : la création de pipelines de transformation efficaces en mémoire (sans tableaux intermédiaires), la génération de séquences infinies (comme des identifiants uniques), et la modélisation de processus longs pouvant être mis en pause pour ne pas bloquer l'interface.</p>

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

      <InfoBox type="success">
        Le pipeline <code>filter → map → take</code> dans l'exemple 1 est <strong>entièrement lazy</strong> :
        pour obtenir les 100 premières erreurs d'un fichier d'un million de lignes, on ne parcoure
        que les lignes nécessaires jusqu'à en trouver 100 qui correspondent. Aucun tableau intermédiaire
        n'est créé. C'est la même idée que les pipelines de streams Unix (<code>grep | sed | head</code>)
        — élégant et ultra-efficace.
      </InfoBox>

      <Challenge title="Défi personnel à réaliser : Générateur d'entrelacement (Zip)">
        <p>
          Implémente un générateur <code>zip(iter1, iter2)</code> qui prend deux itérables et produit
          des paires combinant leurs valeurs une à une. Le générateur doit s'arrêter dès que l'itérable le plus court est épuisé.
        </p>
        <CodeBlock language="javascript">{`function* zip(iter1, iter2) {
  // Indice : tu auras besoin d'obtenir les itérateurs manuellement
  // via iter[Symbol.iterator]() et d'appeler .next()
  
  // Ton code ici
}

const prenoms = ['Alice', 'Bob', 'Charlie'];
const ages = [25, 30];

for (const [prenom, age] of zip(prenoms, ages)) {
  console.log(\`\${prenom} a \${age} ans\`);
}
// Affiche :
// "Alice a 25 ans"
// "Bob a 30 ans"`}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 19,
  title: 'Générateurs & Itérateurs',
  icon: '🌀',
  level: 'Expert',
  stars: '★★★★★',
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
      explanation: '✅ Exact ! yield suspend l\'exécution de la fonction génératrice à cet endroit précis, retourne la valeur à l\'appelant sous la forme { value, done: false }, et reprend exactement là où elle s\'était arrêtée lors du prochain appel à next(). C\'est ce mécanisme de pause/reprise qui rend les générateurs si puissants.',
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
      explanation: '✅ Exact ! for await...of est la syntaxe conçue pour consommer les générateurs asynchrones (async function*). Chaque valeur yielded est une Promise, et for await...of l\'attend automatiquement avant de passer à l\'itération suivante. C\'est la syntaxe idéale pour les APIs paginées et les streams réseau.',
    },
    {
      question: 'Quelle est la valeur de done quand le générateur est épuisé ?',
      sub: 'Protocole itérateur.',
      options: ['null', 'false', 'true', '"done"'],
      correct: 2,
      explanation: '✅ Exact ! Quand un générateur est épuisé (la fonction génératrice a atteint sa fin ou un return), le prochain appel à next() retourne { value: undefined, done: true }. C\'est le signal que le protocole itérateur utilise pour indiquer la fin de la séquence, permettant à for...of et à l\'opérateur spread de savoir quand s\'arrêter.',
    },
    {
      question: 'Que retourne une fonction génératrice quand on l\'appelle avec return valeur ?',
      sub: 'Valeur de retour finale d\'un générateur.',
      options: [
        'Elle lance une exception TypeError',
        'Elle retourne { value: valeur, done: true } au prochain appel à next()',
        'La valeur est ignorée, done reste false',
        'Elle termine immédiatement tous les yield restants',
      ],
      correct: 1,
      explanation: '✅ Exact ! Un return dans une fonction génératrice produit { value: valeur, done: true } — c\'est la dernière valeur émise, avec done à true pour signaler la fin. Attention : cette valeur finale est ignorée par for...of et l\'opérateur spread, qui s\'arrêtent dès que done est true. Pour récupérer la valeur de retour, il faut appeler .next() manuellement et lire la propriété value.',
    },
    {
      question: 'Que fait yield* dans une fonction génératrice ?',
      sub: 'Délégation avec yield*.',
      options: [
        'Il yield la valeur multipliée par elle-même',
        'Il délègue l\'itération à un autre itérable et yield chacun de ses éléments individuellement',
        'Il attend la résolution d\'une Promise avant de continuer',
        'Il yield un tableau de toutes les valeurs restantes',
      ],
      correct: 1,
      explanation: '✅ Exact ! yield* délègue à un autre itérable (tableau, générateur, string…) et yield chacun de ses éléments un par un. C\'est équivalent à une boucle for...of avec un yield à l\'intérieur, mais en syntaxe concise. Cela permet la composition de générateurs : concat(...iterables) peut ainsi enchaîner plusieurs séquences en une seule passe, ou aplatir des tableaux imbriqués récursivement.',
    },
    {
      question: 'Comment envoyer une erreur à l\'intérieur d\'un générateur en cours d\'exécution ?',
      sub: 'Gestion d\'erreurs dans les générateurs.',
      options: [
        'En passant une instance d\'Error à next() : gen.next(new Error())',
        'En appelant gen.throw(erreur), ce qui déclenche l\'erreur à l\'endroit du yield en pause',
        'Il est impossible de lancer une erreur dans un générateur depuis l\'extérieur',
        'En appelant gen.reject(erreur), comme pour une Promise',
      ],
      correct: 1,
      explanation: '✅ Exact ! gen.throw(erreur) injecte une exception à l\'endroit exact où le générateur est suspendu (le yield courant). Si la fonction génératrice contient un try/catch autour du yield, l\'erreur peut être interceptée — le générateur peut alors yield une valeur de récupération et continuer. Sans try/catch, l\'erreur se propage et termine le générateur. C\'est un canal de communication du consommateur vers le producteur.',
    },
    {
      question: 'Pourquoi peut-on utiliser while(true) sans risque dans une fonction génératrice ?',
      sub: 'Séquences infinies et évaluation paresseuse.',
      options: [
        'Parce que le moteur JavaScript optimise automatiquement les boucles infinies dans les générateurs',
        'Parce que le générateur se suspend à chaque yield et ne reprend que sur demande, donc la boucle n\'avance que quand on appelle next()',
        'Parce que for...of détecte les boucles infinies et les arrête automatiquement',
        'Ce n\'est pas sans risque — while(true) dans un générateur bloque quand même le fil principal',
      ],
      correct: 1,
      explanation: '✅ Exact ! Dans un générateur, while(true) est sûr car la boucle ne s\'exécute qu\'un tour à chaque appel à next(). Après le yield, la boucle est suspendue — elle ne reprend que quand on demande la valeur suivante. Cela permet de modéliser des séquences infinies comme Fibonacci ou des générateurs d\'identifiants. Le consommateur contrôle entièrement le débit avec break ou en n\'appelant plus next().',
    },
    {
      question: 'Qu\'est-ce que Symbol.iterator permet de faire sur un objet personnalisé ?',
      sub: 'Protocole itérable et Symbol.iterator.',
      options: [
        'Il permet d\'ajouter des méthodes d\'itération privées à une classe',
        'Il rend un objet compatible avec for...of, l\'opérateur spread et la déstructuration en définissant son comportement d\'itération',
        'Il convertit automatiquement l\'objet en tableau',
        'Il est réservé aux classes natives comme Array et Map',
      ],
      correct: 1,
      explanation: '✅ Exact ! En implémentant [Symbol.iterator]() sur un objet, tu lui donnes le droit d\'être utilisé avec for...of, ...(spread), Array.from(), et la déstructuration. Cette méthode doit retourner un itérateur — un objet avec une méthode next() qui retourne { value, done }. C\'est le contrat du protocole itérable : tout objet respectant ce contrat devient un "citoyen de première classe" dans le système d\'itération JavaScript.',
    },
  ],
};
