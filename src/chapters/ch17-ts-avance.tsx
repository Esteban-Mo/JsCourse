import { CodeBlock, InfoBox } from '../components/content';
import type { Chapter } from '../types';

const codeUtilityTypes = `interface User {
  id: number;
  nom: string;
  email: string;
  role: "admin" | "user";
}

// Partial : toutes les propriétés optionnelles
type UserUpdate = Partial<User>;
// { id?: number; nom?: string; ... }

// Required : toutes les propriétés obligatoires
type UserFull = Required<User>;

// Pick : garder certaines propriétés
type UserPublic = Pick<User, "nom" | "role">;

// Omit : exclure certaines propriétés
type UserWithoutId = Omit<User, "id">;

// Record : objet avec clés et valeurs typées
type RoleMap = Record<User["role"], string[]>;
const roles: RoleMap = { admin: ["Alice"], user: ["Bob"] };

// ReturnType & Parameters
function fetchUser(id: number): Promise<User> { return Promise.resolve({} as User); }
type FetchReturn  = ReturnType<typeof fetchUser>;   // Promise<User>
type FetchParams  = Parameters<typeof fetchUser>;  // [number]`;

const codeMappedTypes = `// Créer un type basé sur un autre
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Type qui rend nullable toutes les propriétés
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Filtrer les propriétés d'un type
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};`;

const codeConditionalTypes = `// Type conditionnel : T extends U ? X : Y
type IsString<T> = T extends string ? true : false;
type A = IsString<string>; // true
type B = IsString<number>; // false

// infer : extraire un type à l'intérieur d'un autre
type UnwrapPromise<T> =
  T extends Promise<infer U> ? U : T;

type X = UnwrapPromise<Promise<string>>; // string
type Y = UnwrapPromise<number>;          // number

// Template Literal Types (TS 4.1+)
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickEvent = EventName<"click">;  // "onClick"
type Events = EventName<"click" | "focus" | "blur">;
// "onClick" | "onFocus" | "onBlur"`;

const codeDistributive = `// Les types conditionnels sont "distributifs" avec les unions
// T extends U ? X : Y appliqué à (A | B) donne (A extends U ? X : Y) | (B extends U ? X : Y)

type ToArray<T> = T extends any ? T[] : never;

type StringOrNumber = string | number;
type Result = ToArray<StringOrNumber>;
// → string[] | number[]  (distribué sur chaque membre de l'union)

// Pour désactiver la distributivité, encapsuler dans des tuples
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type Result2 = ToArrayNonDist<StringOrNumber>;
// → (string | number)[]  (traité comme un tout)`;

const codeInfer = `// infer permet de "capturer" un type inconnu dans une condition
// Pense à infer comme à une variable capturée dans un pattern matching

// Extraire le type d'un tableau
type ElementType<T> = T extends (infer U)[] ? U : never;
type E1 = ElementType<string[]>;  // string
type E2 = ElementType<number[]>;  // number

// Extraire le premier paramètre d'une fonction
type FirstParam<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never;
type FP = FirstParam<(x: string, y: number) => void>; // string

// Extraire le type de retour (c'est ce que fait ReturnType<T> nativement)
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;`;

const codeTemplateLiteral = `// Template Literal Types — comme les template literals JS, mais pour les types
type Greeting = \`Hello, \${string}\`;
const g: Greeting = "Hello, world";  // ✅
// const g2: Greeting = "Bye, world"; ❌

// Très puissant pour générer des variantes de noms
type CSSProperty = "margin" | "padding" | "border";
type CSSDirection = "top" | "right" | "bottom" | "left";
type CSSProp = \`\${CSSProperty}-\${CSSDirection}\`;
// "margin-top" | "margin-right" | ... | "border-left"  (12 combinaisons)

// Générer des types d'événements React
type ReactEvent<T extends string> = \`on\${Capitalize<T>}\`;
type ClickHandler = ReactEvent<"click">;  // "onClick"`;

const codeEventEmitter = `// Exemple réel : EventEmitter type-safe avec les types avancés
// On définit une map d'événements → types de leurs payloads
interface EventMap {
  "user:login":  { userId: string; timestamp: number };
  "user:logout": { userId: string };
  "error":       { message: string; code: number };
}

// L'émetteur générique tire parti des Mapped et Template Literal Types
type EventEmitter<T extends Record<string, any>> = {
  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void): void;
  emit<K extends keyof T>(event: K, payload: T[K]): void;
};

declare const emitter: EventEmitter<EventMap>;

// TypeScript sait exactement quel payload attend chaque événement ✅
emitter.on("user:login", ({ userId, timestamp }) => {
  console.log(\`\${userId} connecté à \${timestamp}\`);
});

// emitter.emit("user:login", { userId: "123" }); ❌ manque timestamp !
emitter.emit("user:login", { userId: "123", timestamp: Date.now() }); // ✅`;

function Ch17TsAvance() {
  return (
    <>
      <div className="chapter-tag">Chapitre 17 · TypeScript Expert</div>
      <h1>TypeScript<br /><span className="highlight">Niveau Expert</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-typescript">💎</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★★</div>
          <h3>Utility Types, Mapped Types, Conditional Types, infer</h3>
          <p>Durée estimée : 50 min · 2 quizz inclus</p>
        </div>
      </div>

      <p>
        Ce chapitre explore le système de types de TypeScript comme un <strong>langage de programmation à part entière</strong>. Les types ne sont plus seulement des annotations — ils deviennent des <em>transformations</em> et des <em>calculs</em>. Mapped types, conditional types, et <code>infer</code> permettent de construire des abstractions type-safe qui autrement nécessiteraient du code runtime fragile. C'est ce que font en interne des bibliothèques comme <code>zod</code>, <code>tRPC</code>, <code>Prisma</code> et <code>React Query</code>.
      </p>

      <h2>Utility Types intégrés — quand utiliser lequel ?</h2>
      <p>
        TypeScript fournit une bibliothèque d'utilitaires de types prêts à l'emploi. <code>Partial&lt;T&gt;</code> est indispensable pour les fonctions de mise à jour (patch) où toutes les propriétés sont optionnelles. <code>Pick</code> et <code>Omit</code> sont complémentaires : utilise <code>Pick</code> quand tu sais exactement ce que tu veux garder (liste courte), <code>Omit</code> quand il est plus simple de lister ce que tu veux exclure. <code>ReturnType</code> et <code>Parameters</code> sont précieux pour typer des wrappers autour de fonctions existantes sans dupliquer leurs signatures.
      </p>
      <CodeBlock language="typescript">{codeUtilityTypes}</CodeBlock>
      <InfoBox type="tip">
        <strong>Cas d'usage pratiques :</strong> <code>Partial&lt;User&gt;</code> pour les endpoints PATCH qui acceptent des mises à jour partielles. <code>Pick&lt;User, "nom" | "email"&gt;</code> pour les réponses API publiques qui n'exposent pas tous les champs. <code>Omit&lt;User, "password"&gt;</code> pour retirer les champs sensibles. <code>ReturnType&lt;typeof maFonction&gt;</code> pour typer la réponse d'un hook personnalisé.
      </InfoBox>

      <h2>Mapped Types — transformer un type comme Array.map transforme des données</h2>
      <p>
        Un mapped type crée un nouveau type en <strong>itérant sur les clés d'un type existant</strong> et en transformant chaque propriété. C'est exactement comme <code>Array.map()</code> transforme chaque élément d'un tableau — mais au niveau des types, pas des valeurs. La syntaxe <code>[K in keyof T]</code> dit "pour chaque clé K dans T". Tu peux ensuite modifier le type de la valeur, ajouter <code>readonly</code>, ajouter <code>?</code>, ou même <em>renommer</em> les clés avec <code>as</code>.
      </p>
      <p>
        C'est ainsi que <code>Partial&lt;T&gt;</code>, <code>Required&lt;T&gt;</code>, <code>Readonly&lt;T&gt;</code> et <code>Record&lt;K, V&gt;</code> sont implémentés dans la bibliothèque standard de TypeScript — ce sont tous des mapped types. La clause <code>as T[K] extends string ? K : never</code> dans l'exemple <code>OnlyStrings</code> montre une technique avancée : filtrer les clés d'un type en remplaçant certaines par <code>never</code> (qui disparaît du type résultant).
      </p>
      <CodeBlock language="typescript">{codeMappedTypes}</CodeBlock>

      <h2>Conditional Types — le ternaire au niveau des types</h2>
      <p>
        Les types conditionnels ont la même syntaxe qu'un ternaire JavaScript — <code>T extends U ? X : Y</code> — mais ils opèrent au <em>niveau des types</em>, pas des valeurs. "T extends U" signifie "T est assignable à U" (c'est-à-dire que T est un sous-type de U). Si la condition est vraie, le type résultant est X, sinon Y. C'est la base des types utilitaires les plus sophistiqués : <code>Extract</code>, <code>Exclude</code>, <code>NonNullable</code> sont tous des types conditionnels.
      </p>
      <CodeBlock language="typescript">{codeConditionalTypes}</CodeBlock>

      <h2>La distributivité des types conditionnels — source de surprises</h2>
      <p>
        Quand tu appliques un type conditionnel à une <strong>union de types</strong>, TypeScript le distribue automatiquement sur chaque membre de l'union — exactement comme la distributivité en algèbre. <code>ToArray&lt;string | number&gt;</code> ne donne pas <code>(string | number)[]</code>, il donne <code>string[] | number[]</code>. Ce comportement est intentionnel et très puissant, mais peut surprendre. Pour le désactiver, la technique consiste à encapsuler les types dans des tuples.
      </p>
      <CodeBlock language="typescript">{codeDistributive}</CodeBlock>
      <InfoBox type="warning">
        La distributivité est active uniquement quand le paramètre générique <em>nu</em> (pas dans un tuple ou une intersection) est testé. C'est un comportement que beaucoup de développeurs TypeScript expérimentés oublient — quand un type conditionnel produit des résultats inattendus avec des unions, vérifie en premier si la distributivité en est la cause.
      </InfoBox>

      <h2>Le mot-clé <code>infer</code> — extraire un type depuis un autre type</h2>
      <p>
        <code>infer</code> est la fonctionnalité la plus magique du système de types TypeScript. Dans un type conditionnel, <code>infer U</code> demande à TypeScript de "capturer" un type qu'il voit à cet endroit, et de le rendre disponible sous le nom <code>U</code>. Pense à <code>infer</code> comme à une variable dans un pattern matching : "si T correspond à ce motif, capture cette partie sous le nom U". Cela permet d'<strong>extraire des types imbriqués</strong> — le type résolu d'une Promise, le type d'un tableau, le type de retour d'une fonction — sans aucun code runtime.
      </p>
      <CodeBlock language="typescript">{codeInfer}</CodeBlock>

      <h2>Template Literal Types — les types qui ressemblent à des strings</h2>
      <p>
        Les template literal types (TypeScript 4.1+) utilisent la même syntaxe backtick que les template literals JavaScript, mais au niveau des types. Ils permettent de créer des types de strings avec des formes précises, et surtout de générer automatiquement des combinaisons. Combinés avec les mapped types et les types conditionnels, ils sont la base de beaucoup de patterns avancés : générer les types d'événements d'un composant, valider des chemins d'API, créer des types pour les opérations CRUD.
      </p>
      <CodeBlock language="typescript">{codeTemplateLiteral}</CodeBlock>

      <h2>Exemple réel — un EventEmitter type-safe</h2>
      <p>
        Voici comment toutes ces techniques s'assemblent dans un exemple concret et pratique. Un EventEmitter conventionnel accepte n'importe quel string comme nom d'événement et n'importe quoi comme payload — impossible de savoir sans documentation quel événement attend quel type de données. Grâce aux mapped types et aux génériques, on peut créer un EmitterEmitter complètement type-safe : TypeScript connait chaque événement possible et le type exact de son payload. Une faute de frappe dans un nom d'événement ou un payload mal formé devient une erreur de compilation immédiate.
      </p>
      <CodeBlock language="typescript">{codeEventEmitter}</CodeBlock>

      <InfoBox type="success">
        Les types conditionnels et <code>infer</code> permettent de créer des types qui raisonnent sur d'autres types — c'est de la <strong>métaprogrammation de types</strong>. C'est ce que font des libs comme <code>zod</code>, <code>trpc</code>, et <code>prisma</code> en interne. Maîtriser ces concepts te permettra non seulement d'utiliser ces bibliothèques plus efficacement, mais aussi de créer tes propres abstractions type-safe.
      </InfoBox>
    </>
  );
}

export const chapter: Chapter = {
  id: 17,
  title: 'TypeScript — Avancé',
  icon: '💎',
  level: 'Bonus TS',
  stars: '★★★★★',
  component: Ch17TsAvance,
  quiz: [
    {
      question: "Que fait Omit<User, 'id'> en TypeScript ?",
      sub: "Utility Types TypeScript",
      options: [
        "Crée un type User sans la propriété 'id'",
        "Rend 'id' optionnel",
        "Supprime 'id' de l'objet à l'exécution",
        "Crée un nouveau type avec uniquement 'id'"
      ],
      correct: 0,
      explanation: "✅ Exact ! Omit<T, K> crée un nouveau type en excluant les propriétés listées dans K. Omit<User, 'id'> = { nom: string; email: string; role: ... } — sans id."
    },
    {
      question: "À quoi sert le mot-clé infer dans un type conditionnel ?",
      sub: "Types conditionnels avancés",
      options: [
        "À inférer le type d'une variable JS",
        "À extraire et capturer un type inconnu à l'intérieur d'un type conditionnel",
        "À forcer TypeScript à accepter any",
        "À créer un type récursif"
      ],
      correct: 1,
      explanation: "✅ Parfait ! infer permet de capturer un type 'caché' dans un type complexe. Dans T extends Promise<infer U>, U capture le type résolu de la Promise — même si on ne le connaît pas à l'avance."
    }
  ]
};
