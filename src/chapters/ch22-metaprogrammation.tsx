import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeProxyTraps = `// Traps disponibles (les plus importants)
const handler = {
  // get : intercepte la LECTURE d'une propriété
  get(target, prop, receiver) {
    console.log(\`Lecture de "\${prop}"\`);
    return Reflect.get(target, prop, receiver); // comportement par défaut
  },

  // set : intercepte l'ÉCRITURE d'une propriété
  set(target, prop, value, receiver) {
    console.log(\`Écriture: \${prop} = \${value}\`);
    if (typeof value !== typeof target[prop] && prop in target) {
      throw new TypeError(\`Type incorrect pour \${prop}\`);
    }
    return Reflect.set(target, prop, value, receiver);
  },

  // has : intercepte l'opérateur "in"
  has(target, prop) {
    console.log(\`Vérification: "\${prop}" in objet\`);
    return Reflect.has(target, prop);
  },

  // deleteProperty : intercepte delete obj.prop
  deleteProperty(target, prop) {
    if (prop.startsWith("_")) throw new Error("Propriété protégée");
    return Reflect.deleteProperty(target, prop);
  }
};

const obj = new Proxy({ nom: "Alice", age: 30 }, handler);
obj.nom;            // Log: Lecture de "nom" → "Alice"
obj.age = 31;        // Log: Écriture: age = 31
"nom" in obj;       // Log: Vérification: "nom" in objet → true
// obj.age = "trente" → TypeError !`;

const codeProxySchema = `// Cas concret : validation de schéma avec Proxy
function creerObjetValide(schema) {
  return (donnees) => new Proxy(donnees, {
    set(target, prop, value) {
      const regle = schema[prop];
      if (!regle) throw new Error(\`Propriété inconnue: \${prop}\`);
      if (typeof value !== regle.type) {
        throw new TypeError(\`\${prop} doit être \${regle.type}\`);
      }
      if (regle.min !== undefined && value < regle.min) {
        throw new RangeError(\`\${prop} minimum: \${regle.min}\`);
      }
      target[prop] = value;
      return true;
    }
  });
}

const userSchema = {
  nom:  { type: "string" },
  age:  { type: "number", min: 0 },
  email:{ type: "string" }
};

const user = creerObjetValide(userSchema)({});
user.nom = "Alice";  // OK
user.age = 30;      // OK
// user.age = -5  → RangeError: age minimum: 0
// user.age = "trente" → TypeError: age doit être number`;

const codeReflect = `// Reflect : équivalents fonctionnels des opérations JS
const obj = { a: 1, b: 2 };

// Reflect.get(target, prop) ≡ target[prop]
Reflect.get(obj, "a");         // 1

// Reflect.set(target, prop, value) ≡ target[prop] = value
Reflect.set(obj, "c", 3);      // true (succès)

// Reflect.has(target, prop) ≡ prop in target
Reflect.has(obj, "a");         // true

// Reflect.deleteProperty ≡ delete target[prop]
Reflect.deleteProperty(obj, "b"); // true

// Reflect.ownKeys ≡ Object.getOwnPropertyNames + Symbols
Reflect.ownKeys(obj);            // ["a", "c"]

// Pourquoi utiliser Reflect dans un Proxy ?
// Parce que Reflect.get passe correctement le receiver (this),
// ce que target[prop] ne fait pas toujours !
const proxy = new Proxy(obj, {
  get(target, prop, receiver) {
    // ✅ Correct : passe le proxy comme receiver
    return Reflect.get(target, prop, receiver);
    // ❌ Parfois incorrect : ne passe pas receiver
    // return target[prop];
  }
});`;

const codeIterator = `// Un objet Range itérable
class Range {
  constructor(debut, fin, pas = 1) {
    this.debut = debut;
    this.fin = fin;
    this.pas = pas;
  }

  [Symbol.iterator]() {
    let courant = this.debut;
    const { fin, pas } = this;

    return {
      next() {
        if (courant <= fin) {
          const value = courant;
          courant += pas;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

// Maintenant utilisable partout où on attend un itérable
const r = new Range(1, 10, 2);

for (const n of r) { process.stdout.write(n + " "); }
// 1 3 5 7 9

[...r];           // [1, 3, 5, 7, 9]
const [a, b, c] = r; // a=1, b=3, c=5
Array.from(r);   // [1, 3, 5, 7, 9]`;

const codeToPrimitive = `class Monnaie {
  constructor(montant, devise = "EUR") {
    this.montant = montant;
    this.devise = devise;
  }

  [Symbol.toPrimitive](hint) {
    // hint: "number", "string", ou "default"
    if (hint === "number") {
      return this.montant; // utilisé dans les opérations mathématiques
    }
    if (hint === "string") {
      return \`\${this.montant} \${this.devise}\`; // utilisé dans les strings
    }
    return this.montant; // "default" (==, +, etc.)
  }
}

const prix = new Monnaie(42.5);

\`Prix: \${prix}\`;  // "Prix: 42.5 EUR" (hint: "string")
prix + 10;          // 52.5 (hint: "default")
prix * 2;           // 85 (hint: "number")
prix > 40;          // true`;

const codeGenerateurs = `// Générateur basique
function* compter(debut = 0) {
  let n = debut;
  while (true) { // séquence INFINIE — pas de problème !
    yield n++; // pause ici, retourne n, puis continue quand .next()
  }
}

const gen = compter(1);
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
// Jamais { done: true } car boucle infinie

// Générateur fini
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Prendre les 10 premiers Fibonacci
function take(gen, n) {
  const result = [];
  for (const val of gen) {
    result.push(val);
    if (result.length >= n) break;
  }
  return result;
}

take(fibonacci(), 10); // [0,1,1,2,3,5,8,13,21,34]`;

const codeWeakMapPrivate = `// WeakMap pour données privées (alternative à #)
const _privé = new WeakMap();

class Compte {
  constructor(propriétaire, solde) {
    // Stocker les données privées dans WeakMap
    _privé.set(this, { solde, historique: [] });
    this.propriétaire = propriétaire; // public
  }

  déposer(montant) {
    if (montant <= 0) throw new Error("Montant invalide");
    const data = _privé.get(this);
    data.solde += montant;
    data.historique.push({ type: "dépôt", montant, date: new Date() });
    return this;
  }

  get solde() { return _privé.get(this).solde; }
  get historique() { return [..._privé.get(this).historique]; }
}

const c = new Compte("Alice", 1000);
c.déposer(500).déposer(200);
console.log(c.solde); // 1700`;

const codeChallenge = `function observable(obj) {
  const abonnes = new Map(); // prop → Set de callbacks

  const proxy = new Proxy(obj, {
    set(target, prop, value) {
      const ancienneValeur = target[prop];
      const ok = Reflect.set(target, prop, value);

      if (ok && ancienneValeur !== value) {
        abonnes.get(prop)?.forEach(fn => fn(value, ancienneValeur));
        abonnes.get("*")?.forEach(fn => fn(prop, value, ancienneValeur));
      }
      return ok;
    }
  });

  proxy.abonner = (prop, callback) => {
    if (!abonnes.has(prop)) abonnes.set(prop, new Set());
    abonnes.get(prop).add(callback);
    return () => abonnes.get(prop).delete(callback);
  };

  return proxy;
}

const etat = observable({ theme: "light", langue: "fr", count: 0 });

etat.abonner("theme", (nv, anc) => console.log(\`Thème: \${anc} → \${nv}\`));
etat.abonner("*", (prop, nv) => console.log(\`Changement: \${prop} = \${nv}\`));

etat.theme = "dark";
// "Thème: light → dark"
// "Changement: theme = dark"`;

function Ch14Metaprogrammation() {
  return (
    <>
      <div className="chapter-tag">Chapitre 14 · Maître</div>
      <h1>Méta-<br /><span className="highlight">programmation</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-master">🔬</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★★</div>
          <h3>Proxy, Reflect, Symbol.iterator, Symbol.toPrimitive, Générateurs</h3>
          <p>Durée estimée : 50 min · 3 quizz inclus</p>
        </div>
      </div>

      <InfoBox type="danger">
        La métaprogrammation, c'est du <strong>code qui modifie le comportement d'autre code</strong>. Ces outils sont utilisés dans les entrailles de Vue.js (réactivité), MobX, Immer, et des ORMs comme Prisma. Comprendre ce chapitre, c'est comprendre comment les frameworks fonctionnent vraiment.
      </InfoBox>

      <h2>Proxy — Intercepter toutes les opérations sur un objet</h2>

      <p>Un <code>Proxy</code> enveloppe un objet cible et peut intercepter toutes les opérations fondamentales : lecture, écriture, suppression, appel de fonction...</p>

      <InfoBox type="tip">
        <strong>Analogie du Videur de Boîte de Nuit 🕺</strong><br />
        Visualisez l'objet JS comme une salle VIP. Le <code>Proxy</code> est le videur à l'entrée. Personne ne peut entrer ou interagir avec la salle VIP sans passer par lui. Le videur possède un manuel de consignes (le <code>handler</code>) qui lui dicte comment réagir à différentes situations (les <code>traps</code>). Par exemple, si quelqu'un essaie de lire une propriété (trap <code>get</code>), le videur peut dire : "Désolé, cette donnée est classée secrète". S'il y a une tentative de modification (trap <code>set</code>), il peut dire : "Hmm, cette donnée n'est pas au bon format, tu ne rentres pas". C'est d'ailleurs exactement comme ça que la réactivité de <strong>Vue 3</strong> fonctionne en coulisses !
      </InfoBox>

      <CodeBlock language="javascript">{codeProxyTraps}</CodeBlock>

      <CodeBlock language="javascript">{codeProxySchema}</CodeBlock>

      <InfoBox type="warning">
        Les Proxy ont un <strong>coût en performance</strong> mesurable (20-50% plus lent sur les accès aux propriétés). Utilise-les pour les données réactives, la validation aux frontières du système, ou les outils de développement — pas pour des objets accédés des millions de fois dans des boucles critiques. Vue 3 l'utilise uniquement sur les objets réactifs, pas sur tous les objets.
      </InfoBox>

      <h2>Reflect — Le miroir des Proxy traps</h2>

      <p>L'API <code>Reflect</code> expose les opérations fondamentales de JS (lire, écrire, supprimer) comme de simples fonctions. Son but principal est de travailler main dans la main avec <code>Proxy</code>.</p>
      <p>Revenons à notre videur : parfois, il intercepte une demande mais décide finalement de la laisser passer normalement (le comportement par défaut). <code>Reflect</code>, c'est justement ce "comportement par défaut". Il permet au Proxy de valider une action sans avoir à recoder manuellement comment l'objet JS natif réagit.</p>

      <CodeBlock language="javascript">{codeReflect}</CodeBlock>

      <InfoBox type="tip">
        Utilise <strong>toujours</strong> <code>Reflect.get(target, prop, receiver)</code> plutôt que <code>target[prop]</code> dans un trap <code>get</code>. Sans le <code>receiver</code>, les getters qui utilisent <code>this</code> se retrouvent avec le mauvais contexte — un bug subtil et difficile à diagnostiquer. Les méthodes Reflect correspondent exactement aux traps Proxy : <code>get</code> → <code>Reflect.get</code>, <code>set</code> → <code>Reflect.set</code>, etc.
      </InfoBox>

      <h2>Symbol.iterator — Rendre n'importe quel objet itérable</h2>

      <p>En implémentant la méthode <code>[Symbol.iterator]</code>, vous rendez un objet compatible avec <code>for...of</code>, le spread operator, la déstructuration, <code>Array.from()</code>, etc.</p>

      <CodeBlock language="javascript">{codeIterator}</CodeBlock>

      <InfoBox type="success">
        Le <strong>protocole itérable</strong> est l'une des abstractions les plus puissantes de JavaScript moderne. Une fois qu'un objet implémente <code>[Symbol.iterator]</code>, il fonctionne automatiquement avec toute l'API qui comprend les itérables : <code>for...of</code>, spread (<code>[...r]</code>), déstructuration, <code>Array.from()</code>, <code>Promise.all()</code>, <code>Set()</code>, <code>Map()</code>... zéro adaptation supplémentaire.
      </InfoBox>

      <h2>Symbol.toPrimitive — Contrôler la conversion de type</h2>

      <p>Lorsque JavaScript a besoin de convertir un objet en valeur primitive (par exemple lors d'une addition ou d'une concaténation de chaîne), il appelle par défaut les méthodes <code>valueOf()</code> puis <code>toString()</code>. Le symbole caché <code>Symbol.toPrimitive</code> vous permet de prendre le contrôle total sur cette conversion en fonction du contexte (le <em>hint</em>) : nombre, chaîne de caractères ou par défaut.</p>

      <CodeBlock language="javascript">{codeToPrimitive}</CodeBlock>

      <InfoBox type="warning">
        La conversion de type implicite est une source fréquente de bugs. Bien que <code>Symbol.toPrimitive</code> permette de la contrôler, <strong>évite d'en dépendre</strong> dans le code métier — il est difficile de savoir quel <code>hint</code> JavaScript va utiliser dans une expression complexe. Préfère des conversions explicites : <code>Number(monObjet)</code>, <code>String(monObjet)</code>.
      </InfoBox>

      <h2>Générateurs — Fonctions qui peuvent être pausées</h2>

      <p>Une <em>fonction générateur</em> (<code>function*</code>) peut être <strong>pausée</strong> à chaque <code>yield</code> et <strong>reprise</strong> plus tard. Elle retourne un itérateur — parfait pour générer des séquences infinies ou paresseuses (lazy).</p>

      <CodeBlock language="javascript">{codeGenerateurs}</CodeBlock>

      <InfoBox type="tip">
        Les générateurs permettent aussi la <strong>communication bidirectionnelle</strong> via <code>.next(valeur)</code> : la valeur passée à <code>next()</code> devient le résultat de l'expression <code>yield</code> dans le générateur. C'est ainsi que <code>redux-saga</code> fonctionne — les générateurs décrivent des effets asynchrones comme une séquence synchrone, et le runtime les exécute.
      </InfoBox>

      <CodeBlock language="javascript">{codeWeakMapPrivate}</CodeBlock>

      <InfoBox type="tip">
        Depuis ES2022, les <strong>champs privés avec <code>#</code></strong> sont préférables à WeakMap pour la plupart des cas : plus simples, meilleure ergonomie, performances équivalentes. Utilise WeakMap quand tu as besoin de données privées <em>associées à des objets externes</em> (que tu ne contrôles pas), ou quand tu veux que la libération mémoire soit strictement automatique.
      </InfoBox>

      <Challenge title="Défi personnel à réaliser : Objet Observable réactif">
        <p>Combinez Proxy et le pattern Observer pour créer une fonction <code>observable(obj)</code> qui notifie automatiquement tous les abonnés quand une propriété change.</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 22,
  title: 'Métaprogrammation',
  icon: '🔬',
  level: 'Maître',
  stars: '★★★★★',
  component: Ch14Metaprogrammation,
  quiz: [
    {
      question: "Quel est le rôle de l'API Reflect par rapport aux Proxy traps ?",
      sub: "Reflect API et Proxy",
      options: [
        "Reflect est une alternative plus rapide aux Proxy traps",
        "Reflect expose les opérations fondamentales de JS comme fonctions, permettant de restaurer le comportement par défaut dans un trap tout en passant correctement le receiver",
        "Reflect permet de créer des Proxy sans handler",
        "Reflect annule les effets des Proxy traps"
      ],
      correct: 1,
      explanation: "✅ Exact ! Reflect fournit des méthodes qui correspondent exactement aux Proxy traps (Reflect.get, Reflect.set, etc.). Dans un trap, Reflect.get(target, prop, receiver) est préférable à target[prop] car il passe correctement le receiver (le proxy lui-même), évitant des bugs avec les getters qui utilisent this."
    },
    {
      question: "Quelle est la différence entre function* (générateur) et une fonction normale ?",
      sub: "Fonctions génératrices",
      options: [
        "Les générateurs sont des fonctions async",
        "Les générateurs peuvent être mis en pause à chaque yield et reprises plus tard — ils retournent un itérateur, pas une valeur directe",
        "Les générateurs s'exécutent en parallèle",
        "Les générateurs ne peuvent pas utiliser de variables locales"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Une function* retourne un objet itérateur immédiatement sans exécuter le corps. Chaque appel à .next() exécute jusqu'au prochain yield, pause, et retourne {value, done}. Idéal pour les séquences infinies, la programmation paresseuse, et les co-routines."
    },
    {
      question: "Pourquoi utiliser WeakMap pour stocker des données privées d'une classe ?",
      sub: "WeakMap vs champs privés #",
      options: [
        "WeakMap est plus rapide que les champs privés #",
        "WeakMap permet d'utiliser des symboles comme clés",
        "Les données dans un WeakMap sont automatiquement libérées quand l'instance est collectée par le GC, évitant les fuites mémoire — et elles sont inaccessibles sans la référence au WeakMap",
        "WeakMap supporte l'héritage contrairement aux champs #"
      ],
      correct: 2,
      explanation: "✅ Exact ! Avec WeakMap, quand l'instance (la clé) n'a plus de référence forte, le GC libère automatiquement les données associées. Les champs # (ES2022) sont souvent préférables pour leur simplicité et leurs performances, mais WeakMap reste utile pour les cas où la gestion mémoire automatique est critique."
    },
    {
      question: "Quelle est la différence entre Object.freeze() et Object.seal() ?",
      sub: "Descripteurs de propriété",
      options: [
        "freeze() est récursif, seal() ne s'applique qu'au premier niveau",
        "freeze() empêche toute modification (lecture seule) ET l'ajout/suppression de propriétés ; seal() empêche l'ajout/suppression mais permet la modification des valeurs existantes",
        "seal() est plus strict que freeze() car il empêche aussi la lecture",
        "Il n'y a aucune différence pratique entre les deux"
      ],
      correct: 1,
      explanation: "✅ Exact ! Object.freeze(obj) rend toutes les propriétés non-modifiables, non-configurables et non-extensibles — l'objet est en lecture seule. Object.seal(obj) empêche l'ajout et la suppression de propriétés (non-extensible, non-configurable), mais les valeurs des propriétés existantes restent modifiables. Les deux sont superficiels (shallow) — les objets imbriqués ne sont pas gelés/scellés."
    },
    {
      question: "Que fait Symbol.toPrimitive et quand est-il appelé ?",
      sub: "Symboles bien connus",
      options: [
        "Il convertit un Symbol en chaîne de caractères via toString()",
        "Il est appelé lors des conversions de type implicites et reçoit un hint ('number', 'string', 'default') pour personnaliser la conversion d'un objet vers une primitive",
        "Il empêche la conversion automatique d'un objet en primitive",
        "Il définit l'ordre de tri d'un objet dans Array.sort()"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Quand JavaScript doit convertir un objet en valeur primitive (lors d'une addition, comparaison, interpolation de template...), il appelle [Symbol.toPrimitive](hint) si elle existe. Le hint indique le contexte : 'number' (opération mathématique), 'string' (interpolation ${obj}), 'default' (opérateur == ou +). Cela remplace les anciennes méthodes valueOf() et toString()."
    },
    {
      question: "Quelle est la différence clé entre Proxy et Object.defineProperty pour l'interception des propriétés ?",
      sub: "Proxy vs defineProperty",
      options: [
        "Object.defineProperty est plus récent et plus puissant que Proxy",
        "Proxy intercepte dynamiquement n'importe quelle propriété (y compris les nouvelles), Object.defineProperty ne peut intercepter qu'une propriété connue à l'avance et définie explicitement",
        "Object.defineProperty fonctionne sur les tableaux, Proxy non",
        "Proxy ne peut intercepter que la lecture, Object.defineProperty peut intercepter l'écriture"
      ],
      correct: 1,
      explanation: "✅ Exact ! Object.defineProperty(obj, 'prop', { get, set }) crée des accesseurs sur une propriété précise et connue à l'avance — Vue 2 l'utilisait et devait donc connaître toutes les propriétés réactives à la création. Proxy enveloppe l'objet entier et intercepte toutes les opérations sur toutes les propriétés, même celles ajoutées après la création du proxy — c'est pourquoi Vue 3 a migré vers Proxy."
    },
    {
      question: "Que retourne Reflect.apply(fn, thisArg, args) et pourquoi est-il utile ?",
      sub: "Reflect API",
      options: [
        "Il retourne un Proxy autour du résultat de fn",
        "Il applique la fonction fn avec thisArg comme contexte et args comme tableau d'arguments, équivalent à fn.apply(thisArg, args) mais fonctionnel et cohérent avec les traps Proxy",
        "Il retourne une Promise du résultat de fn",
        "Il inspecte la signature de fn sans l'appeler"
      ],
      correct: 1,
      explanation: "✅ Correct ! Reflect.apply(fn, thisArg, args) est l'équivalent fonctionnel de Function.prototype.apply.call(fn, thisArg, args). Il est particulièrement utile dans le trap apply d'un Proxy pour déléguer l'appel à la fonction cible avec le bon contexte, de façon propre et sans risque de redéfinition de apply."
    },
    {
      question: "Quel descripteur de propriété faut-il modifier pour qu'une propriété n'apparaisse pas dans for...in ni Object.keys() ?",
      sub: "Descripteurs de propriété",
      options: [
        "writable: false",
        "configurable: false",
        "enumerable: false",
        "visible: false"
      ],
      correct: 2,
      explanation: "✅ Exact ! Le descripteur enumerable contrôle si une propriété apparaît dans les énumérations : for...in, Object.keys(), Object.values(), Object.entries(), et le spread {...obj}. Une propriété avec enumerable: false est 'invisible' à ces opérations mais reste accessible directement par son nom. C'est ainsi que les méthodes de prototype (Array.prototype.map, etc.) sont définies — elles sont non-énumérables."
    }
  ]
};
