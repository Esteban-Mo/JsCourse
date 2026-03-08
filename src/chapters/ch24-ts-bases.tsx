import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeChallengeStack = `// Stack générique type-safe
class Stack<T> {
  private items: T[] = [];

  push(item: T): this {
    this.items.push(item);
    return this;
  }

  pop(): T {
    if (this.isEmpty()) throw new Error("Stack vide");
    return this.items.pop()!;
  }

  peek(): T {
    if (this.isEmpty()) throw new Error("Stack vide");
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean { return this.items.length === 0; }
  size(): number { return this.items.length; }
}

// Usage type-safe — TypeScript infère T = number
const stack = new Stack<number>();
stack.push(1).push(2).push(3);
stack.pop();  // 3 — TypeScript sait que c'est un number
// stack.push("hello"); ❌ Argument of type 'string' not assignable to 'number'`;

const codeChallengeApi = `// Typer un client API avec des génériques
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

interface User { id: number; nom: string; email: string; }
interface Post { id: number; titre: string; contenu: string; auteurId: number; }

// Client API générique — retourne le bon type selon l'endpoint
async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

// TypeScript infère automatiquement le type de retour
const { data: user } = await apiGet<User>("/api/users/1");
user.nom;   // ✅ TypeScript sait que c'est un User
user.titre; // ❌ Error: 'titre' does not exist on type 'User'

// Utilitaire : extraire le type d'une réponse
type DataOf<T extends ApiResponse<any>> = T extends ApiResponse<infer D> ? D : never;`;

const codeTypes = `// Annotations de type
let prenom: string = "Alice";
let age: number = 25;
let actif: boolean = true;
let data: unknown;   // type inconnu — plus sûr que any
let wild: any;       // désactive le type checking ⚠️

// Tableaux typés
const scores: number[] = [10, 20, 30];
const noms: Array<string> = ["Alice", "Bob"];

// Tuple : tableau à longueur et types fixes
const point: [number, number] = [10, 20];
const entry: [string, number] = ["age", 25];

// Union types
let id: string | number;
id = "abc123"; // OK
id = 42;       // OK
// id = true;  ❌ Error !

// Literal types
type Direction = "nord" | "sud" | "est" | "ouest";
let dir: Direction = "nord"; // seules ces 4 valeurs`;

const codeInterfaces = `// Interface : contrat de forme d'un objet
interface Utilisateur {
  id: number;
  nom: string;
  email?: string;        // propriété optionnelle
  readonly createdAt: Date; // immuable après création
}

// Fonction typée
function saluer(user: Utilisateur): string {
  return \`Bonjour \${user.nom}\`;
}

// Type alias (plus flexible)
type Point = { x: number; y: number };
type Point3D = Point & { z: number }; // intersection

// Enum
enum Statut {
  Actif = "ACTIF",
  Inactif = "INACTIF",
  Banni = "BANNI"
}
const etat: Statut = Statut.Actif;`;

const codeTypeVsInterface = `// interface — extensible, mergeable
interface Animal { nom: string; }
interface Animal { age: number; } // ✅ fusion automatique !
// Résultat : Animal = { nom: string; age: number }

// type — plus flexible pour les unions et intersections
type ID = string | number;          // union de primitifs ✅
type Vehicule = Voiture & Bateau;  // intersection ✅
// interface ID = string | number; ❌ impossible avec interface

// Bonne pratique : utilise interface pour les objets/classes,
// type pour les unions, intersections et alias de primitifs`;

const codeUnknownVsAny = `// any : désactive complètement le type checking
let n: any = "hello";
n.toFixed(2); // pas d'erreur TypeScript — mais crash à l'exécution !

// unknown : le type doit être vérifié avant utilisation
let u: unknown = "hello";
// u.toUpperCase(); ❌ Error : Object is of type 'unknown'

// Pour utiliser une valeur unknown, tu dois la "narrow" (réduire)
if (typeof u === "string") {
  u.toUpperCase(); // ✅ maintenant TypeScript sait que c'est une string
}

// Règle : utilise unknown plutôt que any pour les données d'origine inconnue
// (réponses d'API, JSON.parse, données utilisateur...)`;

const codeNever = `// never : le type des valeurs qui n'existent jamais
// Cas 1 : fonction qui ne retourne jamais (throw ou boucle infinie)
function echouer(msg: string): never {
  throw new Error(msg);
}

// Cas 2 : branche impossible dans un switch exhaustif
type Forme = "cercle" | "carre" | "triangle";

function aire(f: Forme): number {
  switch (f) {
    case "cercle":   return Math.PI * 5 ** 2;
    case "carre":    return 25;
    case "triangle": return 12.5;
    default:
      // Si on ajoute une forme à Forme sans gérer le cas ici,
      // TypeScript lance une erreur sur cette ligne ✅
      const impossible: never = f;
      throw new Error(\`Forme non gérée : \${impossible}\`);
  }
}`;

const codeGeneriques = `// Générique : fonction qui fonctionne avec n'importe quel type
function identity<T>(value: T): T {
  return value;
}
identity<string>("hello"); // "hello"
identity(42);               // inférence auto → number

// Interface générique
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

type UserResponse = ApiResponse<Utilisateur>;
type ListResponse = ApiResponse<Utilisateur[]>;

// Contrainte sur le générique
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
getProp({ nom: "Alice", age: 25 }, "nom"); // "Alice" ✅
// getProp({...}, "xyz") ❌ Error : "xyz" n'existe pas`;

const codeStructural = `// TypeScript utilise le "duck typing" structurel
// Un type est compatible si sa FORME correspond — peu importe son nom

interface Animal { nom: string; cri(): string; }
interface Robot  { nom: string; cri(): string; } // même forme

function decrire(a: Animal) {
  console.log(a.nom, a.cri());
}

const robot: Robot = { nom: "R2D2", cri: () => "Bip bip" };
decrire(robot); // ✅ compatible ! La forme correspond
// En Java/C# (nominal), ceci serait une erreur car Robot ≠ Animal`;

function Ch16TsBases() {
  return (
    <>
      <div className="chapter-tag">Chapitre 16 · TypeScript</div>
      <h1>TypeScript<br /><span className="highlight">Les Bases</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-typescript">🔷</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★☆☆</div>
          <h3>Types, interfaces, unions, génériques</h3>
          <p>Durée estimée : 40 min · 2 quizz inclus</p>
        </div>
      </div>

      <p>
        TypeScript est un <strong>superset typé de JavaScript</strong> développé par Microsoft et open-sourcé en 2012. "Superset" signifie que tout JavaScript valide est aussi du TypeScript valide — TypeScript ajoute des fonctionnalités <em>au-dessus</em> de JavaScript, sans en casser aucune. La fonctionnalité centrale est un <strong>système de types statiques</strong> : tu annotes tes variables, paramètres et valeurs de retour avec des types, et le compilateur TypeScript (<code>tsc</code>) vérifie que tu ne mélanges pas des types incompatibles. Ce système <em>disparaît entièrement à l'exécution</em> — les navigateurs et Node.js n'exécutent jamais de TypeScript directement, seulement le JavaScript produit par la compilation.
      </p>
      <p>
        Pourquoi TypeScript a-t-il été créé ? JavaScript a été conçu pour des scripts courts dans des pages web simples. À l'échelle d'une grande application — des centaines de fichiers, des dizaines de développeurs, des milliers de fonctions — l'absence de types rend le code difficile à comprendre et à maintenir. Une fonction peut recevoir n'importe quoi, retourner n'importe quoi, et les bugs de type ne se manifestent qu'à l'exécution, souvent en production. TypeScript déplace ces erreurs vers la phase de compilation : tu découvres immédiatement dans ton éditeur que tu passes un string là où un number est attendu.
      </p>

      <InfoBox type="tip">
        Tout JavaScript valide est du TypeScript valide. TS compile vers JS standard — les navigateurs ne l'exécutent pas directement. Ce qu'on appelle "type erasure" (effacement des types) : toutes les annotations de type disparaissent dans le fichier <code>.js</code> produit. À l'exécution, <code>let age: number = 25</code> devient simplement <code>let age = 25</code>.
      </InfoBox>

      <h2>Types de base — annoter sans compliquer</h2>
      <p>
        Les annotations de type sont optionnelles grâce à l'<strong>inférence de types</strong> : TypeScript peut souvent déduire le type d'une variable depuis sa valeur initiale. <code>let x = 42</code> est automatiquement inféré comme <code>number</code>. Tu n'as besoin d'annoter que quand l'inférence ne peut pas deviner — paramètres de fonctions, valeurs initialement <code>null</code>, ou quand tu veux être plus précis que l'inférence. L'union type (<code>string | number</code>) est l'une des features les plus utiles : une variable peut avoir plusieurs types possibles, et TypeScript exige que tu gères chaque cas.
      </p>
      <CodeBlock language="typescript">{codeTypes}</CodeBlock>

      <h2>Le typage structurel — TypeScript "duck typing"</h2>
      <p>
        TypeScript utilise un système de typage <strong>structurel</strong> (par opposition au typage <em>nominal</em> de Java ou C#). Dans les langages nominaux, deux types sont compatibles uniquement s'ils partagent explicitement une hiérarchie d'héritage. Dans TypeScript, deux types sont compatibles si leur <em>forme</em> (les propriétés et leurs types) correspond — peu importe leurs noms. C'est la fameuse philosophie "duck typing" : "si ça marche comme un canard et que ça coince comme un canard, c'est un canard". Cette approche s'intègre naturellement avec l'écosystème JavaScript existant.
      </p>
      <CodeBlock language="typescript">{codeStructural}</CodeBlock>

      <h2>Interfaces &amp; Types — leurs vraies différences</h2>
      <p>
        <code>interface</code> et <code>type</code> semblent interchangeables pour définir la forme d'un objet, et pour 80% des cas d'usage quotidien, ils le sont. Mais ils ont des capacités distinctes qui orientent le choix. La différence la plus pratique : les interfaces peuvent être <strong>fusionnées</strong> (declaration merging) — déclarer la même interface deux fois fusionne automatiquement les déclarations. C'est utilisé par les définitions de types de bibliothèques pour permettre aux utilisateurs d'étendre les types. Les alias <code>type</code>, eux, ne peuvent pas être fusionnés mais peuvent représenter des unions, des intersections, et des primitifs directement.
      </p>
      <CodeBlock language="typescript">{codeInterfaces}</CodeBlock>
      <CodeBlock language="typescript">{codeTypeVsInterface}</CodeBlock>
      <InfoBox type="tip">
        Convention de la communauté : utilise <code>interface</code> pour définir la forme des objets et des classes (c'est l'usage pour lequel il a été conçu). Utilise <code>type</code> pour les unions (<code>string | number</code>), les intersections (<code>A &amp; B</code>), et les alias de types utilitaires. Quand les deux fonctionnent, <code>interface</code> donne de meilleurs messages d'erreur dans les IDE.
      </InfoBox>

      <h2><code>unknown</code> vs <code>any</code> — le bon choix pour les données incertaines</h2>
      <p>
        <code>any</code> est le type "abandon" de TypeScript — il désactive complètement la vérification des types pour cette valeur. C'est parfois nécessaire pour migrer progressivement du JavaScript, mais c'est une échappatoire qui supprime toute la valeur de TypeScript. <code>unknown</code> est une alternative plus sûre : il représente aussi "n'importe quel type", mais TypeScript exige que tu <em>réduises</em> le type (avec <code>typeof</code>, <code>instanceof</code>, ou des gardes de type) avant de l'utiliser. C'est une forme de contrat : "je ne sais pas ce que c'est, mais je te promets de le vérifier avant d'agir dessus".
      </p>
      <CodeBlock language="typescript">{codeUnknownVsAny}</CodeBlock>
      <InfoBox type="warning">
        Chaque <code>any</code> dans ton code est un trou dans ton filet de sécurité. Pour les données d'origine inconnue — réponses d'API, <code>JSON.parse()</code>, données d'un formulaire — utilise <code>unknown</code> et force-toi à écrire les vérifications de type. Ton futur toi te remerciera.
      </InfoBox>

      <h2>Le type <code>never</code> — l'impossibilité comme valeur</h2>
      <p>
        Le type <code>never</code> représente les valeurs qui <em>n'existent jamais</em>. Une fonction qui lance toujours une exception ne retourne jamais — son type de retour est <code>never</code>. Une fonction avec une boucle infinie non plus. Mais l'usage le plus puissant de <code>never</code> est dans les <strong>switches exhaustifs</strong> : en mettant une variable de type <code>never</code> dans le cas <code>default</code>, tu demandes à TypeScript de vérifier que tous les cas possibles ont été traités. Si tu ajoutes une nouvelle valeur à un type union sans mettre à jour le switch, TypeScript te signale immédiatement l'oubli.
      </p>
      <CodeBlock language="typescript">{codeNever}</CodeBlock>

      <h2>Génériques — le code réutilisable et type-safe</h2>
      <p>
        Sans génériques, une fonction qui "retourne ce qu'elle reçoit" devrait être typée avec <code>any</code> — perdant toute sécurité — ou dupliquée pour chaque type possible. Les <strong>génériques</strong> permettent d'écrire du code réutilisable qui reste type-safe. Pense-y comme à un "conteneur" paramétrable : une boîte peut contenir n'importe quoi, mais une fois que tu sais que ta boîte contient des pommes (<code>Boite&lt;Pomme&gt;</code>), TypeScript sait que tout ce qui en sort est une pomme. Le paramètre de type <code>T</code> est un <em>placeholder</em> que TypeScript remplace par le type réel lors de l'appel, soit explicitement soit par inférence.
      </p>
      <CodeBlock language="typescript">{codeGeneriques}</CodeBlock>
      <InfoBox type="success">
        L'inférence des génériques rend le code concis : <code>identity(42)</code> infère automatiquement <code>T = number</code>, tu n'as pas besoin d'écrire <code>identity&lt;number&gt;(42)</code>. La contrainte <code>K extends keyof T</code> va plus loin : elle dit que <code>K</code> doit être une des clés de <code>T</code> — TypeScript vérifie que tu n'accèdes qu'à des propriétés qui existent. C'est la base de l'utilitaire <code>Pick</code> que tu verras au prochain chapitre.
      </InfoBox>

      <Challenge title="Défi : Stack générique type-safe">
        <p>Implémente une classe <code>Stack&lt;T&gt;</code> générique avec les méthodes <code>push</code>, <code>pop</code>, <code>peek</code>, <code>isEmpty</code> et <code>size</code>. Utilise le chaînage fluide pour <code>push</code>. TypeScript doit refuser d'empiler le mauvais type.</p>
        <CodeBlock language="typescript">{codeChallengeStack}</CodeBlock>
      </Challenge>

      <Challenge title="Défi : Client API générique avec types inférés">
        <p>Crée un client API générique <code>apiGet&lt;T&gt;</code> qui retourne une réponse typée <code>ApiResponse&lt;T&gt;</code>. TypeScript doit inférer automatiquement le type des données selon le paramètre générique passé — toute erreur de propriété doit être détectée à la compilation.</p>
        <CodeBlock language="typescript">{codeChallengeApi}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 24,
  title: 'TypeScript — Bases',
  icon: '🔷',
  level: 'Bonus TS',
  stars: '★★★☆☆',
  component: Ch16TsBases,
  quiz: [
    {
      question: "Quelle est la différence entre interface et type en TypeScript ?",
      sub: "Fondamentaux TypeScript",
      options: [
        "Ils sont strictement identiques",
        "interface ne peut pas être étendue",
        "type peut représenter des unions/intersections et des primitifs, interface est extensible via declaration merging",
        "type est deprecated depuis TS 5.0"
      ],
      correct: 2,
      explanation: "✅ Exact ! Les deux définissent des formes d'objets, mais type est plus flexible (unions, intersections, primitifs, tuples). interface supporte le 'declaration merging' (plusieurs déclarations fusionnent)."
    },
    {
      question: "Que signifie <T> dans function identity<T>(value: T): T ?",
      sub: "Génériques TypeScript",
      options: [
        "T est un type HTML element",
        "T est un paramètre de type générique — un placeholder pour n'importe quel type",
        "T signifie 'Typed' — le type par défaut de TS",
        "C'est une syntaxe JSX"
      ],
      correct: 1,
      explanation: "✅ Parfait ! <T> déclare un paramètre de type générique. Quand tu appelles identity('hello'), TypeScript infère T = string. Les génériques permettent d'écrire du code réutilisable et type-safe."
    },
    {
      question: "Comment fonctionne le type narrowing avec typeof en TypeScript ?",
      sub: "Type narrowing",
      options: [
        "typeof supprime les annotations de type dans le bloc conditionnel",
        "TypeScript réduit (narrow) le type d'une variable dans une branche conditionnelle selon la vérification typeof — dans if (typeof x === 'string'), x est garanti string",
        "typeof fonctionne uniquement avec les types primitifs déclarés avec let",
        "typeof est une fonction TypeScript qui retourne le type au moment de la compilation"
      ],
      correct: 1,
      explanation: "✅ Exact ! Le type narrowing est la capacité de TypeScript à réduire un type union à un type plus précis dans un bloc conditionnel. Après if (typeof u === 'string'), TypeScript sait que u est string dans ce bloc et autorise les méthodes string. D'autres gardes de type : instanceof (pour les classes), les discriminated unions (prop === 'valeur'), et les user-defined type guards (x is string)."
    },
    {
      question: "Qu'est-ce qu'une union discriminante (discriminated union) en TypeScript ?",
      sub: "Unions discriminantes",
      options: [
        "Une union de types primitifs comme string | number | boolean",
        "Un type union dont chaque membre possède une propriété littérale commune (discriminant) permettant à TypeScript de distinguer les membres dans un switch ou un if",
        "Une union de types qui exclut null et undefined",
        "Une union sur laquelle on ne peut pas appliquer le type narrowing"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Par exemple : type Forme = { type: 'cercle'; rayon: number } | { type: 'carre'; côté: number }. La propriété type est le discriminant. Dans un switch (forme.type) { case 'cercle': ... }, TypeScript sait exactement que forme.rayon existe et que forme.côté n'existe pas. C'est le pattern le plus sûr pour modéliser des états mutuellement exclusifs."
    },
    {
      question: "Que fait le modificateur readonly sur une propriété d'interface ?",
      sub: "Modificateur readonly",
      options: [
        "Il empêche la propriété d'être transmise comme argument de fonction",
        "Il rend la propriété invisible aux opérations d'énumération (Object.keys)",
        "Il interdit toute réassignation de la propriété après l'initialisation de l'objet — TypeScript signale une erreur à la compilation si on tente de modifier la valeur",
        "Il est équivalent à Object.freeze() sur cette propriété à l'exécution"
      ],
      correct: 2,
      explanation: "✅ Correct ! readonly est une contrainte TypeScript à la compilation uniquement — il n'existe plus dans le JavaScript compilé. Une propriété readonly peut être définie lors de la création de l'objet ou dans le constructeur, mais toute réassignation ultérieure déclenche une erreur TypeScript. Attention : readonly est superficiel comme const — les objets imbriqués restent mutables."
    },
    {
      question: "Quelle est la différence entre Partial<T> et Required<T> en TypeScript ?",
      sub: "Types utilitaires",
      options: [
        "Partial<T> supprime toutes les propriétés, Required<T> en ajoute de nouvelles",
        "Partial<T> rend toutes les propriétés optionnelles (?), Required<T> rend toutes les propriétés obligatoires (supprime ?)",
        "Partial<T> accepte null pour chaque propriété, Required<T> accepte uniquement des valeurs définies",
        "Ce sont des alias l'un de l'autre pour des raisons de lisibilité"
      ],
      correct: 1,
      explanation: "✅ Exact ! Partial<T> transforme toutes les propriétés de T en propriétés optionnelles — utile pour les objets de mise à jour partielle (PATCH). Required<T> fait l'inverse : toutes les propriétés deviennent obligatoires. Ces types utilitaires sont construits avec des types mappés : Partial<T> = { [K in keyof T]?: T[K] }, Required<T> = { [K in keyof T]-?: T[K] }."
    },
    {
      question: "Que fait l'assertion as const sur un tableau ou un objet littéral ?",
      sub: "as const",
      options: [
        "Elle exécute Object.freeze() sur l'objet à l'exécution",
        "Elle indique à TypeScript d'inférer les types les plus étroits possibles (types littéraux) et de traiter toutes les propriétés comme readonly — ['nord', 'sud'] devient readonly ['nord', 'sud'] au lieu de string[]",
        "Elle convertit le type vers any pour désactiver les vérifications",
        "Elle est équivalente à déclarer la variable avec const au lieu de let"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Sans as const, TypeScript infère ['nord', 'sud'] comme string[]. Avec as const, il infère readonly ['nord', 'sud'] — les éléments ont les types littéraux 'nord' et 'sud', pas string. De même, { couleur: 'rouge' } as const donne { readonly couleur: 'rouge' } au lieu de { couleur: string }. Très utile pour créer des constantes qui servent de types (DIRECTIONS[number] devient 'nord' | 'sud')."
    },
    {
      question: "Quelle différence y a-t-il entre unknown et any pour gérer des données d'origine inconnue ?",
      sub: "unknown vs any",
      options: [
        "unknown est simplement le nouveau nom de any depuis TypeScript 4.0",
        "any est plus sûr car TypeScript vérifie automatiquement les opérations dessus",
        "unknown oblige à vérifier le type (narrowing) avant toute utilisation, tandis que any désactive complètement la vérification — unknown est un any sûr",
        "unknown ne peut stocker que des types primitifs, any accepte n'importe quelle valeur"
      ],
      correct: 2,
      explanation: "✅ Exact ! Avec any, TypeScript ne vérifie rien — n.toFixed(2) sur un any typé string compilera sans erreur mais crashera à l'exécution. Avec unknown, TypeScript exige qu'on réduise le type avant utilisation : if (typeof u === 'string') { u.toUpperCase(); }. Pour les réponses d'API, JSON.parse() et données utilisateur, préfère toujours unknown — il force à écrire les vérifications qui rendent le code sûr."
    }
  ]
};
