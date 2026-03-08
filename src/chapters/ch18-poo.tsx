import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeProto1 = `// Création manuelle avec Object.create
const animal = {
  respirer() { return \`\${this.nom} respire\`; },
  toString() { return \`[Animal: \${this.nom}]\`; }
};

// chien hérite de animal via le prototype
const chien = Object.create(animal);
chien.nom = "Rex";
chien.aboyer = function() { return "Woof!"; };

chien.respirer(); // "Rex respire" ← trouvé dans animal
chien.aboyer();   // "Woof!" ← trouvé dans chien lui-même

// Inspection de la chaîne
Object.getPrototypeOf(chien) === animal; // true
// chien → animal → Object.prototype → null`;

const codeProto2 = `// Les classes ES6 SONT des prototypes — regardez sous le capot
class Animal {
  constructor(nom) { this.nom = nom; }
  respirer() { return \`\${this.nom} respire\`; }
}

// Équivaut à :
function Animal(nom) { this.nom = nom; }
Animal.prototype.respirer = function() {
  return \`\${this.nom} respire\`;
};

// Preuve :
typeof Animal; // "function" — pas un vrai type "class" !
const chat = new Animal("Mimi");
chat.respirer === Animal.prototype.respirer; // true`;

const codeClasse = `class Vehicule {
  // Champs publics (déclarés avant constructor)
  marque = "Inconnue";

  // Champs privés (ES2022) — vraiment inaccessibles de l'extérieur
  #vitesse = 0;
  #carburant = 100;

  // Champ et méthode statiques (appartiennent à la classe, pas aux instances)
  static nombreInstances = 0;
  static comparer(a, b) { return a.#vitesse - b.#vitesse; }

  constructor(marque, modele) {
    this.marque = marque;
    this.modele = modele;
    Vehicule.nombreInstances++;
  }

  // Getter : accès comme propriété
  get infos() {
    return \`\${this.marque} \${this.modele} @ \${this.#vitesse}km/h\`;
  }

  // Setter : validation à l'assignation
  set vitesse(v) {
    if (v < 0) throw new RangeError("Vitesse négative impossible");
    if (v > 250) throw new RangeError("Vitesse max: 250km/h");
    this.#vitesse = v;
  }

  get vitesse() { return this.#vitesse; }
}

const voiture = new Vehicule("Tesla", "Model 3");
voiture.vitesse = 120;    // passe par le setter
console.log(voiture.infos); // "Tesla Model 3 @ 120km/h"
// voiture.#vitesse → SyntaxError !`;

const codeHeritage = `class Animal {
  constructor(nom, energie = 100) {
    this.nom = nom;
    this.energie = energie;
  }

  manger(quantite) {
    this.energie += quantite;
    return this; // retourner this pour le chaînage
  }

  toString() { return \`\${this.nom} (\${this.energie} énergie)\`; }
}

class Chien extends Animal {
  constructor(nom, race) {
    super(nom, 150); // OBLIGATOIRE avant this en classe enfant
    this.race = race;
  }

  // Surcharge de méthode (override)
  toString() {
    return \`\${super.toString()} [Race: \${this.race}]\`;
    // super.toString() appelle la version du parent
  }

  aboyer() { return \`\${this.nom}: Woof!\`; }
}

const rex = new Chien("Rex", "Berger Allemand");
rex.manger(20).manger(10); // chaînage !
console.log(rex.toString()); // "Rex (180 énergie) [Race: Berger Allemand]"
rex instanceof Animal; // true (héritage)`;

const codeMixins = `// Mixins : fonctions qui "enrichissent" une classe
const Serializable = (SuperClass) => class extends SuperClass {
  toJSON() { return JSON.stringify(this); }
  static fromJSON(json) { return Object.assign(new this(), JSON.parse(json)); }
};

const Loggable = (SuperClass) => class extends SuperClass {
  log(msg) {
    console.log(\`[\${this.constructor.name}] \${msg}\`);
  }
};

// Appliquer plusieurs mixins
class User extends Serializable(Loggable(Animal)) {
  constructor(nom, email) {
    super(nom);
    this.email = email;
  }
}

const u = new User("Alice", "alice@ex.com");
u.log("Connectée");    // [User] Connectée
u.toJSON();           // '{"nom":"Alice","email":"alice@ex.com",...}'
u.manger(10);         // hérité d'Animal ✓`;

const codeObserver = `class EventEmitter {
  #handlers = new Map();

  on(event, callback) {
    if (!this.#handlers.has(event)) {
      this.#handlers.set(event, new Set());
    }
    this.#handlers.get(event).add(callback);
    // Retourner une fonction de désabonnement (unsubscribe)
    return () => this.off(event, callback);
  }

  off(event, callback) {
    this.#handlers.get(event)?.delete(callback);
  }

  emit(event, data) {
    this.#handlers.get(event)?.forEach(fn => fn(data));
  }

  once(event, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// Usage
const bus = new EventEmitter();

const annuler = bus.on("user:login", (user) => {
  console.log(\`Bienvenue \${user.nom}\`);
});

bus.once("app:init", () => console.log("Init (une seule fois)"));

bus.emit("user:login", { nom: "Alice" }); // "Bienvenue Alice"
bus.emit("app:init"); // "Init (une seule fois)"
bus.emit("app:init"); // rien (déjà retiré)

annuler(); // désabonnement propre`;

const codeBuilder = `// Builder : construire étape par étape avec une API fluide
class RequeteBuilder {
  #config = {
    methode: "GET",
    headers: {},
    timeout: 5000,
  };

  url(url) {
    this.#config.url = url;
    return this; // retourner this pour le chaînage fluide
  }

  methode(m) { this.#config.methode = m; return this; }

  header(cle, valeur) {
    this.#config.headers[cle] = valeur;
    return this;
  }

  corps(data) {
    this.#config.corps = JSON.stringify(data);
    this.header("Content-Type", "application/json");
    return this;
  }

  timeout(ms) { this.#config.timeout = ms; return this; }

  async envoyer() {
    const { url, methode, headers, corps } = this.#config;
    const res = await fetch(url, { method: methode, headers, body: corps });
    return res.json();
  }
}

// API fluide lisible comme de la prose
const data = await new RequeteBuilder()
  .url("/api/users")
  .methode("POST")
  .header("Authorization", "Bearer token123")
  .corps({ nom: "Alice", age: 30 })
  .timeout(3000)
  .envoyer();`;

const codeChallenge = `class Store {
  #etat;
  #reducer;
  #abonnes = new Set();

  constructor(reducer, etatInitial) {
    this.#reducer = reducer;
    this.#etat = etatInitial;
  }

  getEtat() { return this.#etat; }

  dispatcher(action) {
    this.#etat = this.#reducer(this.#etat, action);
    this.#abonnes.forEach(fn => fn(this.#etat));
  }

  abonner(fn) {
    this.#abonnes.add(fn);
    return () => this.#abonnes.delete(fn); // unsubscribe
  }
}

// Reducer pur
const compteurReducer = (etat = { count: 0 }, action) => {
  const actions = {
    INCREMENT: () => ({ ...etat, count: etat.count + 1 }),
    DECREMENT: () => ({ ...etat, count: etat.count - 1 }),
    RESET:     () => ({ count: 0 }),
  };
  return (actions[action.type] ?? (() => etat))();
};

const store = new Store(compteurReducer, { count: 0 });
const off = store.abonner(etat => console.log("État:", etat.count));

store.dispatcher({ type: "INCREMENT" }); // État: 1
store.dispatcher({ type: "INCREMENT" }); // État: 2
off(); // désabonnement`;

function Ch12Poo() {
  return (
    <>
      <div className="chapter-tag">Chapitre 12 · Expert</div>
      <h1>POO &amp;<br /><span className="highlight">Design Patterns</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-expert">🏗️</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★★</div>
          <h3>Prototypes, classes ES6+, champs privés, mixins, Observer, Builder</h3>
          <p>Durée estimée : 40 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>JavaScript n'est pas un langage orienté objet classique — c'est un langage à <strong>prototypes</strong>. Les <em>classes</em> introduites en ES6 sont du sucre syntaxique par-dessus ce système. Pour vraiment maîtriser la POO en JS, il faut comprendre les prototypes d'abord.</p>

      <h2>La chaîne de prototypes — Comment JS gère l'héritage</h2>

      <p>Chaque objet en JavaScript a une propriété interne <code>[[Prototype]]</code> qui pointe vers un autre objet. Quand vous accédez à une propriété, JS cherche dans l'objet, puis dans son prototype, puis dans le prototype du prototype... jusqu'à <code>null</code>.</p>

      <CodeBlock language="javascript">{codeProto1}</CodeBlock>

      <CodeBlock language="javascript">{codeProto2}</CodeBlock>

      <InfoBox type="tip">
        La chaîne de prototypes est <strong>dynamique</strong> : si tu modifies <code>Animal.prototype.respirer</code> après avoir créé des instances, toutes les instances existantes verront immédiatement la nouvelle version. Une propriété définie directement sur l'instance (<em>own property</em>) a toujours la priorité sur la chaîne de prototypes.
      </InfoBox>

      <h2>Classes ES6+ — Syntaxe complète</h2>

      <CodeBlock language="javascript">{codeClasse}</CodeBlock>

      <InfoBox type="tip">
        Les méthodes <strong>statiques</strong> (<code>static</code>) appartiennent à la classe elle-même, pas aux instances. Elles sont idéales pour les méthodes utilitaires ou les factories : <code>Date.now()</code>, <code>Array.from()</code>, <code>Object.keys()</code> sont tous des méthodes statiques. Tu les appelles sur la classe, jamais sur une instance.
      </InfoBox>

      <h2>Héritage avec extends et super</h2>

      <CodeBlock language="javascript">{codeHeritage}</CodeBlock>

      <InfoBox type="warning">
        <code>super()</code> doit être appelé avant toute référence à <code>this</code> dans le constructeur d'une classe enfant. C'est parce que le constructeur parent est responsable de créer l'objet <code>this</code>. Sans super(), <code>this</code> n'est pas encore initialisé.
      </InfoBox>

      <InfoBox type="danger">
        L'<strong>héritage profond</strong> (plus de 2-3 niveaux) est un anti-pattern. Il crée des couplages forts et des hierarchies difficiles à modifier. Préfère la <strong>composition</strong> (un objet contient un autre) à l'héritage quand c'est possible. Les mixins et le pattern Decorator sont de bonnes alternatives.
      </InfoBox>

      <h2>Mixins — Composition d'héritage multiple</h2>

      <p>JavaScript n'a pas d'héritage multiple, mais on peut simuler la composition de comportements avec des <strong>mixins</strong> : des fonctions qui ajoutent des méthodes à une classe.</p>

      <CodeBlock language="javascript">{codeMixins}</CodeBlock>

      <InfoBox type="tip">
        Les mixins sont parfaits pour les comportements transversaux (cross-cutting concerns) comme la <strong>sérialisation</strong>, le <strong>logging</strong>, ou la <strong>validation</strong> — des comportements qui n'ont pas de relation d'héritage naturelle avec le domaine métier mais dont plusieurs classes ont besoin.
      </InfoBox>

      <h2>Pattern Observer — Architecture événementielle</h2>

      <p>L'Observer permet à des objets (<em>observateurs</em>) de s'abonner à des événements d'un autre objet (<em>sujet</em>) sans couplage fort. C'est le fondement de React, Vue, Redux, Node.js EventEmitter...</p>

      <CodeBlock language="javascript">{codeObserver}</CodeBlock>

      <InfoBox type="success">
        Toujours retourner une <strong>fonction de désabonnement</strong> depuis <code>on()</code> (comme dans l'exemple). Cela évite les fuites mémoire et les bugs de "zombie listeners" — des handlers qui continuent à s'exécuter sur des composants détruits. C'est exactement le pattern que React utilise dans <code>useEffect</code> avec sa fonction de cleanup.
      </InfoBox>

      <h2>Pattern Builder — Construction d'objets complexes</h2>

      <CodeBlock language="javascript">{codeBuilder}</CodeBlock>

      <InfoBox type="tip">
        Le pattern Builder brille quand un objet a de nombreux paramètres optionnels — l'alternative est un constructeur avec 8 paramètres dont la moitié sont <code>undefined</code>. L'API fluide (chaque méthode retourne <code>this</code>) rend le code lisible comme de la prose et permet d'omettre facilement les étapes facultatives.
      </InfoBox>

      <Challenge title="Défi : Store réactif (mini-Redux)">
        <p>Implémentez un <code>Store</code> qui combine l'Observer pattern et l'immutabilité. Il doit permettre de dispatcher des actions et notifier les abonnés à chaque changement d'état.</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 18,
  title: 'POO & Patterns',
  icon: '🏗️',
  level: 'Expert',
  stars: '★★★★★',
  component: Ch12Poo,
  quiz: [
    {
      question: "Qu'est-ce que la chaîne de prototypes en JavaScript ?",
      sub: "Mécanisme d'héritage par prototype",
      options: [
        "Une liste ordonnée de classes parentes",
        "Un mécanisme où chaque objet pointe vers un objet 'prototype', et JS remonte cette chaîne pour trouver une propriété",
        "Les méthodes héritées d'Object.prototype uniquement",
        "Un système de cache pour les propriétés d'objets"
      ],
      correct: 1,
      explanation: "✅ Exact ! Chaque objet JS a un [[Prototype]] interne. Quand vous accédez à une propriété, JS cherche dans l'objet, puis dans son prototype, puis dans le prototype du prototype... jusqu'à null. Les classes ES6 sont du sucre syntaxique par-dessus ce mécanisme."
    },
    {
      question: "Pourquoi les getters/setters sont-ils utiles dans une classe ?",
      sub: "Accesseurs dans les classes ES6",
      options: [
        "Ils améliorent les performances de l'objet",
        "Ils permettent d'accéder à une propriété via une syntaxe simple (obj.prop) tout en exécutant de la logique (validation, calcul) en coulisses",
        "Ils rendent les propriétés accessibles depuis les sous-classes uniquement",
        "Ils remplacent complètement les propriétés publiques"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Les getters/setters permettent d'encapsuler la logique derrière une interface simple. Un setter peut valider les données avant de les stocker, calculer des valeurs dérivées, ou déclencher des effets. L'utilisateur de la classe voit juste obj.vitesse = 120."
    },
    {
      question: "Quel est l'avantage principal du pattern Observer ?",
      sub: "Design pattern Observer",
      options: [
        "Il améliore les performances en évitant les appels de fonctions",
        "Il permet de découpler l'émetteur d'événements des récepteurs — l'émetteur n'a pas besoin de connaître ses abonnés",
        "Il remplace la gestion d'erreurs try/catch",
        "Il crée automatiquement des copies d'objets"
      ],
      correct: 1,
      explanation: "✅ Exact ! L'Observer découple le producteur (sujet/émetteur) des consommateurs (observateurs/abonnés). Le sujet émet des événements sans savoir qui écoute. C'est le fondement de React, Redux, Vue, et Node.js EventEmitter."
    },
    {
      question: "Que se passe-t-il si on tente d'accéder à un champ privé (#monChamp) depuis l'extérieur de la classe ?",
      sub: "Champs privés avec #",
      options: [
        "La valeur retournée est undefined",
        "Une SyntaxError est levée — les champs privés sont inaccessibles à l'extérieur de la classe",
        "La valeur est retournée mais en lecture seule",
        "Une TypeError est levée uniquement en mode strict"
      ],
      correct: 1,
      explanation: "✅ Exact ! Les champs privés avec # (introduits en ES2022) sont enforced par le moteur JavaScript : accéder à instance.#champ depuis l'extérieur de la classe lève une SyntaxError au moment de l'analyse du code, pas seulement à l'exécution. C'est une vraie encapsulation, contrairement aux conventions de nommage comme _champ."
    },
    {
      question: "Quelle méthode permet de vérifier le prototype d'un objet en JavaScript ?",
      sub: "Inspection de la chaîne prototype",
      options: [
        "obj.prototype",
        "obj.__proto__ uniquement",
        "Object.getPrototypeOf(obj)",
        "obj.constructor.prototype"
      ],
      correct: 2,
      explanation: "✅ Correct ! Object.getPrototypeOf(obj) est la méthode officielle et recommandée pour inspecter le prototype d'un objet. __proto__ fonctionne dans la plupart des environnements mais est déprécié. obj.prototype est une propriété des fonctions/classes (pas des instances). Object.getPrototypeOf(chien) === Animal.prototype vaut true pour une instance de Animal."
    },
    {
      question: "Pourquoi faut-il appeler super() avant d'utiliser 'this' dans le constructeur d'une classe enfant ?",
      sub: "super() et initialisation de this",
      options: [
        "Pour des raisons de style uniquement — ce n'est pas obligatoire",
        "Parce que super() est responsable de créer et d'initialiser l'objet 'this' dans le contexte de la classe parent",
        "Pour copier les méthodes de la classe parent dans l'instance",
        "Pour éviter les fuites mémoire lors de l'héritage"
      ],
      correct: 1,
      explanation: "✅ Exact ! Dans une classe qui étend une autre, 'this' n'existe pas avant l'appel à super(). C'est la classe parent qui est responsable d'allouer et d'initialiser l'objet. Tenter d'utiliser 'this' avant super() lève une ReferenceError : 'Must call super constructor in derived class before accessing this'."
    },
    {
      question: "Qu'est-ce qu'un mixin en JavaScript orienté objet ?",
      sub: "Pattern mixin",
      options: [
        "Une classe abstraite qui ne peut pas être instanciée directement",
        "Une fonction qui prend une classe en paramètre et retourne une nouvelle classe enrichie de comportements supplémentaires",
        "Un décorateur qui modifie les propriétés d'un objet existant",
        "Un type d'héritage multiple natif introduit en ES6"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Un mixin est une fonction de la forme (SuperClass) => class extends SuperClass { /* méthodes */ }. On l'applique en wrappant la classe : class User extends Serializable(Loggable(Animal)). C'est la façon de simuler l'héritage multiple en JS, car une classe ne peut étendre qu'une seule autre classe directement."
    },
    {
      question: "Si on modifie Animal.prototype.respirer après avoir créé une instance, l'instance voit-elle le changement ?",
      sub: "Dynamisme de la chaîne prototype",
      options: [
        "Non — l'instance a une copie figée du prototype au moment de sa création",
        "Oui — l'instance consulte le prototype dynamiquement à chaque accès à la méthode",
        "Seulement si l'instance est créée avec Object.create()",
        "Seulement en mode non-strict"
      ],
      correct: 1,
      explanation: "✅ Exact ! La chaîne de prototypes est consultée dynamiquement à chaque accès à une propriété. Si vous modifiez Animal.prototype.respirer après avoir créé des instances, toutes les instances existantes verront immédiatement la nouvelle version. C'est le dynamisme du système de prototypes de JavaScript — une propriété directe sur l'instance aurait la priorité sur le prototype."
    }
  ]
};
