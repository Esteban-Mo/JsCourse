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

      <p>Un <code>Proxy</code> enveloppe un objet cible et peut intercepter (via des <em>traps</em>) toutes les opérations fondamentales : lecture, écriture, suppression, appel de fonction... Il est au cœur de la réactivité de Vue 3.</p>

      <CodeBlock language="javascript">{codeProxyTraps}</CodeBlock>

      <CodeBlock language="javascript">{codeProxySchema}</CodeBlock>

      <h2>Reflect — Le miroir des Proxy traps</h2>

      <p><code>Reflect</code> expose les opérations fondamentales de JS comme des fonctions. Son rôle principal : restaurer le comportement par défaut dans un Proxy trap tout en passant correctement le <code>receiver</code> (<code>this</code>).</p>

      <CodeBlock language="javascript">{codeReflect}</CodeBlock>

      <h2>Symbol.iterator — Rendre n'importe quel objet itérable</h2>

      <p>En implémentant la méthode <code>[Symbol.iterator]</code>, vous rendez un objet compatible avec <code>for...of</code>, le spread operator, la déstructuration, <code>Array.from()</code>, etc.</p>

      <CodeBlock language="javascript">{codeIterator}</CodeBlock>

      <h2>Symbol.toPrimitive — Contrôler la conversion de type</h2>

      <CodeBlock language="javascript">{codeToPrimitive}</CodeBlock>

      <h2>Générateurs — Fonctions qui peuvent être pausées</h2>

      <p>Une <em>fonction générateur</em> (<code>function*</code>) peut être <strong>pausée</strong> à chaque <code>yield</code> et <strong>reprise</strong> plus tard. Elle retourne un itérateur — parfait pour générer des séquences infinies ou paresseuses (lazy).</p>

      <CodeBlock language="javascript">{codeGenerateurs}</CodeBlock>

      <CodeBlock language="javascript">{codeWeakMapPrivate}</CodeBlock>

      <Challenge title="Défi : Objet Observable réactif">
        <p>Combinez Proxy et le pattern Observer pour créer une fonction <code>observable(obj)</code> qui notifie automatiquement tous les abonnés quand une propriété change.</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 14,
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
    }
  ]
};
