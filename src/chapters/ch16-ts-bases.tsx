import { CodeBlock, InfoBox } from '../components/content';
import type { Chapter } from '../types';

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

function Ch16TsBases() {
  return (
    <>
      <div className="chapter-tag">Chapitre 16 · TypeScript</div>
      <h1>TypeScript<br /><span className="highlight">Les Bases</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-typescript">🔷</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★☆</div>
          <h3>Types, interfaces, unions, génériques</h3>
          <p>Durée estimée : 40 min · 2 quizz inclus</p>
        </div>
      </div>

      <p>TypeScript est un <strong>superset typé</strong> de JavaScript développé par Microsoft. Il ajoute un système de types statiques qui permet de détecter les erreurs à la compilation plutôt qu'à l'exécution.</p>

      <InfoBox type="tip">
        Tout JavaScript valide est du TypeScript valide. TS compile vers JS standard — les navigateurs ne l'exécutent pas directement.
      </InfoBox>

      <h2>Types de base</h2>

      <CodeBlock language="typescript">{codeTypes}</CodeBlock>

      <h2>Interfaces &amp; Types</h2>

      <CodeBlock language="typescript">{codeInterfaces}</CodeBlock>

      <h2>Génériques (Generics)</h2>

      <CodeBlock language="typescript">{codeGeneriques}</CodeBlock>
    </>
  );
}

export const chapter: Chapter = {
  id: 16,
  title: 'TypeScript — Bases',
  icon: '🔷',
  level: 'Bonus TS',
  stars: '★★★★☆',
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
    }
  ]
};
