import { CodeBlock, InfoBox } from '../components/content';
import type { Chapter } from '../types';

const codeClasseDecorateurs = `// Un décorateur simple : ajoute un timestamp de création
function Horodatable(constructeur: Function) {
  constructeur.prototype.createdAt = new Date();
}

@Horodatable
class Utilisateur {
  constructor(public nom: string) {}
}

const u = new Utilisateur("Alice");
console.log((u as any).createdAt); // Date de création ✅

// Décorateur factory : avec paramètres
function Log(prefixe: string) {
  return function(constructeur: Function) {
    console.log(\`[\${prefixe}] Classe \${constructeur.name} définie\`);
  };
}

@Log("DEBUG")
class Service {}
// → [DEBUG] Classe Service définie`;

const codeMethodeDecorateurs = `// Décorateur qui mesure le temps d'exécution
function Mesurer(
  target: any,
  nomMethode: string,
  descripteur: PropertyDescriptor
) {
  const original = descripteur.value;

  descripteur.value = function(...args: any[]) {
    const debut = performance.now();
    const resultat = original.apply(this, args);
    const fin = performance.now();
    console.log(\`\${nomMethode} : \${(fin - debut).toFixed(2)}ms\`);
    return resultat;
  };
  return descripteur;
}

// Décorateur qui mémoïse (cache) les résultats
function Memoize(target: any, key: string, desc: PropertyDescriptor) {
  const cache = new Map();
  const original = desc.value;
  desc.value = function(...args: any[]) {
    const cle = JSON.stringify(args);
    if (cache.has(cle)) return cache.get(cle);
    const res = original.apply(this, args);
    cache.set(cle, res);
    return res;
  };
}

class Calculateur {
  @Mesurer
  @Memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}`;

const codeSingleton = `class ConfigService {
  private static instance: ConfigService | null = null;
  private config: Record<string, string> = {};

  private constructor() {
    // constructeur privé — impossible de faire new ConfigService()
    this.config = { env: "production", version: "1.0" };
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  get(cle: string): string {
    return this.config[cle] ?? "";
  }
}

const config1 = ConfigService.getInstance();
const config2 = ConfigService.getInstance();
console.log(config1 === config2); // true — même instance`;

const codeRepository = `interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}

// Implémentation en mémoire (parfaite pour les tests)
class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async findById(id: number) {
    return this.users.find(u => u.id === id) ?? null;
  }
  async findAll() { return [...this.users]; }
  async save(user: User) {
    this.users.push(user);
    return user;
  }
  async delete(id: number) {
    this.users = this.users.filter(u => u.id !== id);
  }
}

// Le service métier ne connaît que l'interface — pas l'implémentation
class UserService {
  constructor(private repo: IUserRepository) {}

  async promouvoir(id: number) {
    const user = await this.repo.findById(id);
    if (!user) throw new Error("Utilisateur introuvable");
    user.role = "admin";
    return this.repo.save(user);
  }
}`;

function Ch19TsDecorateurs() {
  return (
    <>
      <div className="chapter-tag">Chapitre 19 · Décorateurs &amp; Patterns</div>
      <h1>TypeScript<br /><span className="highlight">Décorateurs &amp; Patterns</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-typescript">🎨</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★★</div>
          <h3>Décorateurs, Singleton, Repository, Factory, DI</h3>
          <p>Durée estimée : 50 min · 2 quizz inclus</p>
        </div>
      </div>

      <p>Les décorateurs sont une fonctionnalité avancée de TypeScript (et du futur ECMAScript) qui permettent d'<strong>annoter et modifier</strong> des classes, méthodes ou propriétés de manière déclarative. C'est la syntaxe derrière des frameworks comme <strong>Angular, NestJS ou TypeORM</strong>.</p>

      <InfoBox type="warning">
        Pour utiliser les décorateurs, active <code>"experimentalDecorators": true</code> dans ton <code>tsconfig.json</code>. Les décorateurs TC39 Stage 3 (standard) ont une syntaxe légèrement différente.
      </InfoBox>

      <h2>Décorateur de classe</h2>

      <p>Un décorateur de classe est une <strong>fonction qui reçoit le constructeur</strong> de la classe et peut le modifier ou l'enrober. Il s'applique avec la syntaxe <code>@NomDuDecorateur</code> juste avant la classe.</p>

      <CodeBlock language="typescript">{codeClasseDecorateurs}</CodeBlock>

      <h2>Décorateur de méthode</h2>

      <p>Un décorateur de méthode intercepte l'appel à une méthode. C'est très utile pour ajouter de la <strong>journalisation, du cache, de la gestion d'erreurs</strong> ou de la validation sans modifier la méthode elle-même.</p>

      <CodeBlock language="typescript">{codeMethodeDecorateurs}</CodeBlock>

      <h2>Pattern Singleton avec TypeScript</h2>

      <p>Le Singleton garantit qu'une classe n'a <strong>qu'une seule instance</strong> dans toute l'application. C'est utile pour les connexions DB, les stores, les services de configuration.</p>

      <CodeBlock language="typescript">{codeSingleton}</CodeBlock>

      <h2>Pattern Repository</h2>

      <p>Le Repository <strong>abstrait l'accès aux données</strong>. Au lieu que ton code métier parle directement à une DB, il parle à un repository — ce qui te permet de changer de DB ou de mocker facilement en tests.</p>

      <CodeBlock language="typescript">{codeRepository}</CodeBlock>

      <InfoBox type="tip">
        Le pattern Repository est la base de l'<strong>architecture hexagonale</strong> (Ports &amp; Adapters). Ton code métier (le cœur) ne sait jamais si les données viennent d'une PostgreSQL, MongoDB ou d'un simple tableau en mémoire — il parle uniquement à l'interface.
      </InfoBox>
    </>
  );
}

export const chapter: Chapter = {
  id: 19,
  title: 'TypeScript — Décorateurs',
  icon: '🎨',
  level: 'Bonus TS',
  stars: '★★★★★',
  component: Ch19TsDecorateurs,
  quiz: [
    {
      question: "Dans quel ordre s'appliquent plusieurs décorateurs empilés sur une méthode ?",
      sub: "Ordre d'exécution des décorateurs",
      options: [
        "De haut en bas (le premier déclaré s'exécute en premier)",
        "De bas en haut (le plus proche de la méthode s'exécute en premier)",
        "L'ordre est aléatoire",
        "Tous s'appliquent simultanément"
      ],
      correct: 1,
      explanation: "✅ Exact ! Les décorateurs s'évaluent de haut en bas (comme des fonctions), mais s'appliquent de bas en haut. @A @B methode() → B est appliqué en premier sur la méthode, puis A enrobe le résultat. Comme une composition de fonctions : A(B(methode))."
    },
    {
      question: "Pourquoi le constructeur d'un Singleton est-il privé ?",
      sub: "Pattern Singleton",
      options: [
        "Pour des raisons de performance",
        "Pour empêcher l'appel de super() dans les sous-classes",
        "Pour forcer le passage par getInstance() et garantir l'unicité de l'instance",
        "C'est une convention mais pas obligatoire"
      ],
      correct: 2,
      explanation: "✅ Parfait ! Le constructeur privé rend impossible new MonSingleton() depuis l'extérieur. L'unique façon d'obtenir l'objet est MonSingleton.getInstance(), qui vérifie si une instance existe déjà et la réutilise — garantissant l'unicité."
    }
  ]
};
