import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeChallengeRetry = `// Décorateur @Retry : réessaie automatiquement en cas d'erreur
function Retry(tentatives: number, delai = 500) {
  return function(target: any, key: string, desc: PropertyDescriptor) {
    const original = desc.value;

    desc.value = async function(...args: any[]) {
      for (let i = 0; i < tentatives; i++) {
        try {
          return await original.apply(this, args);
        } catch (err) {
          if (i === tentatives - 1) throw err;
          console.warn(\`[Retry] tentative \${i + 1}/\${tentatives} échouée, attente \${delai}ms\`);
          await new Promise(r => setTimeout(r, delai));
        }
      }
    };
    return desc;
  };
}

class ApiService {
  @Retry(3, 1000)
  async fetchUser(id: number) {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return res.json();
  }
}`;


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
          <p>Durée estimée : 50 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Les décorateurs sont une fonctionnalité avancée de TypeScript (et du futur ECMAScript) qui permettent d'<strong>annoter et modifier</strong> des classes, méthodes ou propriétés de manière déclarative. C'est la syntaxe derrière des frameworks comme <strong>Angular, NestJS ou TypeORM</strong>.</p>

      <InfoBox type="warning">
        Pour utiliser les décorateurs, active <code>"experimentalDecorators": true</code> dans ton <code>tsconfig.json</code>. Les décorateurs TC39 Stage 3 (standard) ont une syntaxe légèrement différente.
      </InfoBox>

      <h2>Décorateur de classe</h2>

      <p>Un décorateur de classe est une <strong>fonction qui reçoit le constructeur</strong> de la classe et peut le modifier ou l'enrober. Il s'applique avec la syntaxe <code>@NomDuDecorateur</code> juste avant la classe.</p>

      <InfoBox type="tip">
        <strong>L'Analogie du papier cadeau 🎁</strong><br />
        Un décorateur, c'est comme emballer un objet dans du papier cadeau. L'objet lui-même (la classe ou la méthode) ne change pas intrinsèquement à l'intérieur de sa boîte. Mais vu de l'extérieur, l'emballage (le décorateur) ajoute une nouvelle propriété (la couleur, le motif, ou un ruban). Le décorateur "intercepte" l'objet au moment de sa création et lui ajoute des super-pouvoirs avant de le rendre disponible au reste de l'application.
      </InfoBox>

      <CodeBlock language="typescript">{codeClasseDecorateurs}</CodeBlock>

      <InfoBox type="tip">
        Les décorateurs de classe sont exécutés <strong>une seule fois à la définition</strong> de la classe (au chargement du module), pas à chaque instanciation. Ils sont évalués de bas en haut quand plusieurs décorateurs sont empilés : <code>@A @B class C</code> applique B en premier, puis A.
      </InfoBox>

      <h2>Décorateur de méthode</h2>

      <p>Un décorateur de méthode intercepte l'appel à une méthode. C'est très utile pour ajouter de la <strong>journalisation, du cache, de la gestion d'erreurs</strong> ou de la validation sans modifier la méthode elle-même.</p>

      <CodeBlock language="typescript">{codeMethodeDecorateurs}</CodeBlock>

      <InfoBox type="success">
        Les décorateurs de méthode sont au cœur de frameworks comme <strong>NestJS</strong> (<code>@Get()</code>, <code>@Post()</code>), <strong>TypeORM</strong> (<code>@Entity()</code>, <code>@Column()</code>), et <strong>class-validator</strong> (<code>@IsEmail()</code>, <code>@MinLength()</code>). Comprendre leur mécanique permet de mieux utiliser — et parfois créer — ces frameworks.
      </InfoBox>

      <h2>Pattern Singleton avec TypeScript</h2>

      <p>Le Singleton garantit qu'une classe n'a <strong>qu'une seule instance</strong> dans toute l'application. C'est utile pour les connexions DB, les stores, les services de configuration.</p>

      <CodeBlock language="typescript">{codeSingleton}</CodeBlock>

      <InfoBox type="warning">
        En JavaScript moderne, les <strong>modules ES sont des singletons naturels</strong> : un module n'est évalué qu'une fois, et chaque import reçoit la même référence. Pour les cas simples, <code>export const config = new Config()</code> dans un module suffit souvent, sans besoin d'un pattern Singleton explicite.
      </InfoBox>

      <h2>Pattern Repository</h2>

      <p>Le Repository <strong>abstrait l'accès aux données</strong>. Au lieu que ton code métier parle directement à une DB, il parle à un repository — ce qui te permet de changer de DB ou de mocker facilement en tests.</p>

      <CodeBlock language="typescript">{codeRepository}</CodeBlock>

      <InfoBox type="tip">
        Le pattern Repository est la base de l'<strong>architecture hexagonale</strong> (Ports &amp; Adapters). Ton code métier (le cœur) ne sait jamais si les données viennent d'une base PostgreSQL, d'une API externe ou d'un simple tableau en mémoire — il parle uniquement à l'interface <code>IUserRepository</code>. Cette séparation radicale des responsabilités est ce qu'on appelle l'<strong>Injection de Dépendances</strong> (Dependency Injection).
      </InfoBox>

      <Challenge title="Défi personnel à réaliser : Décorateur @Retry pour les appels réseau">
        <p>Crée un décorateur <code>@Retry(tentatives, delai)</code> qui réessaie automatiquement une méthode async en cas d'erreur, avec un délai configurable entre chaque tentative. Après le nombre maximum de tentatives, l'erreur est propagée.</p>
        <CodeBlock language="typescript">{codeChallengeRetry}</CodeBlock>
      </Challenge>

    </>
  );
}

export const chapter: Chapter = {
  id: 27,
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
    },
    {
      question: "Quelle option doit être activée dans tsconfig.json pour utiliser les décorateurs TypeScript legacy ?",
      sub: "Configuration des décorateurs",
      options: [
        "\"decorators\": true",
        "\"experimentalDecorators\": true",
        "\"enableDecorators\": true",
        "\"useDecorators\": true"
      ],
      correct: 1,
      explanation: "✅ Exact ! L'option `\"experimentalDecorators\": true` dans compilerOptions est indispensable pour utiliser les décorateurs TypeScript (syntaxe legacy). Sans elle, le compilateur signale une erreur. Les décorateurs TC39 Stage 3 (standard) ne nécessitent plus cette option dans les versions récentes de TS."
    },
    {
      question: "Qu'est-ce qu'un décorateur factory, et en quoi diffère-t-il d'un décorateur simple ?",
      sub: "Décorateur factory",
      options: [
        "Un décorateur factory crée des classes, un décorateur simple modifie des méthodes",
        "Un décorateur factory est une fonction qui retourne le décorateur — permettant de lui passer des paramètres",
        "Un décorateur factory s'applique à plusieurs éléments à la fois",
        "Les deux sont identiques, factory est juste un alias"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Un décorateur simple est une fonction directement applicable : @MonDecorateur. Un décorateur factory est une fonction qui retourne une fonction de décorateur : @Log('DEBUG'). La factory est appelée en premier avec les arguments, et retourne le vrai décorateur. C'est ce que fait `function Log(prefixe: string) { return function(constructeur) {...}; }`."
    },
    {
      question: "Dans quel ordre s'exécutent les décorateurs appliqués à une classe TypeScript par rapport à ceux appliqués à ses méthodes ?",
      sub: "Ordre d'exécution global des décorateurs",
      options: [
        "Le décorateur de classe s'exécute en premier, avant ceux des méthodes",
        "Les décorateurs de méthodes s'exécutent en premier, puis le décorateur de classe",
        "L'ordre dépend de l'ordre de déclaration dans le fichier",
        "Tous s'exécutent simultanément"
      ],
      correct: 1,
      explanation: "✅ Exact ! TypeScript évalue les décorateurs de l'intérieur vers l'extérieur : d'abord les décorateurs de propriétés et méthodes (dans l'ordre de bas en haut), puis le décorateur de classe en dernier. Cela permet au décorateur de classe d'avoir accès à la classe déjà modifiée par les décorateurs de méthodes."
    },
    {
      question: "Dans le pattern Repository, pourquoi le service métier reçoit-il une `IUserRepository` plutôt qu'une implémentation concrète ?",
      sub: "Pattern Repository et injection de dépendances",
      options: [
        "Pour des raisons de performance",
        "Pour permettre d'injecter différentes implémentations (DB réelle, mock en test) sans modifier le service",
        "Parce que TypeScript interdit les dépendances concrètes dans un constructeur",
        "Pour éviter les imports circulaires"
      ],
      correct: 1,
      explanation: "✅ Parfait ! En dépendant d'une interface plutôt que d'une implémentation concrète (principe D de SOLID), le service peut recevoir InMemoryUserRepository en tests unitaires et PostgresUserRepository en production — sans changer une ligne de code métier. C'est l'essence de l'injection de dépendances."
    },
    {
      question: "Que reçoit en paramètre un décorateur de méthode TypeScript (legacy) ?",
      sub: "Signature d'un décorateur de méthode",
      options: [
        "Uniquement le nom de la méthode",
        "Le prototype de la classe, le nom de la méthode, et le PropertyDescriptor",
        "La classe entière et le nom de la méthode",
        "Seulement le PropertyDescriptor"
      ],
      correct: 1,
      explanation: "✅ Exact ! Un décorateur de méthode legacy reçoit trois arguments : (1) target — le prototype de la classe (ou la classe elle-même pour les méthodes statiques), (2) propertyKey — le nom de la méthode sous forme de string, (3) descriptor — le PropertyDescriptor qui contient la référence à la méthode originale via descriptor.value."
    }
  ]
};
