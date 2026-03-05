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

      <h2>Utility Types intégrés</h2>

      <CodeBlock language="typescript">{codeUtilityTypes}</CodeBlock>

      <h2>Mapped Types</h2>

      <CodeBlock language="typescript">{codeMappedTypes}</CodeBlock>

      <h2>Conditional Types &amp; infer</h2>

      <CodeBlock language="typescript">{codeConditionalTypes}</CodeBlock>

      <InfoBox type="success">
        Les types conditionnels et <code>infer</code> permettent de créer des types qui raisonnent sur d'autres types — c'est de la <strong>métaprogrammation de types</strong>. C'est ce que font des libs comme <code>zod</code>, <code>trpc</code>, et <code>prisma</code> en interne.
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
