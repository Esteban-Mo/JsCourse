import { CodeBlock, InfoBox } from '../components/content';
import type { Chapter } from '../types';

const codeModificateurs = `class CompteBancaire {
  public   proprietaire: string;
  private  solde: number;       // interdit depuis l'extérieur
  readonly iban: string;        // jamais modifiable après init

  // Raccourci : paramètre de constructeur = déclaration + assignation
  constructor(
    public proprietaire: string,
    private solde: number,
    readonly iban: string
  ) {}

  deposer(montant: number): void {
    if (montant <= 0) throw new Error("Montant invalide");
    this.solde += montant;
  }

  getSolde(): number {
    return this.solde; // on expose via une méthode publique
  }
}

const compte = new CompteBancaire("Alice", 1000, "FR76...");
compte.deposer(500);
console.log(compte.getSolde()); // 1500
// compte.solde = 0; ❌ Error: 'solde' is private
// compte.iban = "autre"; ❌ Error: 'iban' is readonly`;

const codeAbstract = `abstract class Forme {
  abstract aire(): number;      // doit être implémenté par les enfants
  abstract perimetre(): number;

  // Méthode concrète partagée par tous
  decrire(): string {
    return \`Aire: \${this.aire().toFixed(2)}, Périmètre: \${this.perimetre().toFixed(2)}\`;
  }
}

class Cercle extends Forme {
  constructor(private rayon: number) { super(); }
  aire()      { return Math.PI * this.rayon ** 2; }
  perimetre() { return 2 * Math.PI * this.rayon; }
}

class Rectangle extends Forme {
  constructor(private l: number, private h: number) { super(); }
  aire()      { return this.l * this.h; }
  perimetre() { return 2 * (this.l + this.h); }
}

// new Forme(); ❌ Cannot create instance of abstract class
const formes: Forme[] = [new Cercle(5), new Rectangle(4, 6)];
formes.forEach(f => console.log(f.decrire()));`;

const codeTypeGuards = `// typeof guard — pour les primitifs
function afficher(valeur: string | number): string {
  if (typeof valeur === "string") {
    return valeur.toUpperCase(); // TS sait que c'est un string ici
  }
  return valeur.toFixed(2);     // TS sait que c'est un number ici
}

// instanceof guard — pour les classes
function calculerAire(forme: Cercle | Rectangle): number {
  if (forme instanceof Cercle) {
    return forme.aire(); // TS sait que forme est un Cercle
  }
  return forme.aire();   // Rectangle ici
}

// Type guard personnalisé avec prédicat de type
interface Chat  { type: "chat";  ronronner(): void; }
interface Chien { type: "chien"; aboyer(): void; }

function estUnChat(animal: Chat | Chien): animal is Chat {
  return animal.type === "chat";
}

function parler(animal: Chat | Chien) {
  if (estUnChat(animal)) {
    animal.ronronner(); // TS sait que c'est un Chat ici ✅
  } else {
    animal.aboyer();    // TS sait que c'est un Chien ici ✅
  }
}`;

const codeDiscriminated = `// Exemple : gestion d'états d'une requête API
type EtatRequete =
  | { etat: "chargement" }
  | { etat: "succes";  donnees: string[] }
  | { etat: "erreur";  message: string };

function afficherEtat(req: EtatRequete): string {
  switch (req.etat) {
    case "chargement":
      return "⏳ Chargement...";
    case "succes":
      return \`✅ \${req.donnees.length} résultats\`; // TS sait que donnees existe
    case "erreur":
      return \`❌ \${req.message}\`;               // TS sait que message existe
  }
}

// Si tu oublies un case, TS te prévient (avec --strictNullChecks)
function assertNever(x: never): never {
  throw new Error("Case non géré : " + x);
}`;

function Ch18TsPoo() {
  return (
    <>
      <div className="chapter-tag">Chapitre 18 · TypeScript POO</div>
      <h1>TypeScript<br /><span className="highlight">POO Avancée</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-typescript">🏛️</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★☆</div>
          <h3>Classes abstraites, modificateurs, type guards, discriminated unions</h3>
          <p>Durée estimée : 45 min · 2 quizz inclus</p>
        </div>
      </div>

      <p>TypeScript donne des super-pouvoirs à la POO JavaScript. Là où JS te laisse tout faire (et te laisser tout casser), TS enforce des contrats stricts grâce aux <strong>modificateurs d'accès</strong>, aux <strong>classes abstraites</strong> et aux <strong>interfaces</strong>.</p>

      <h2>Modificateurs d'accès</h2>

      <p>En JavaScript, tout est public par défaut — n'importe quel code peut lire ou modifier n'importe quelle propriété d'un objet. TypeScript introduit quatre modificateurs pour contrôler l'accès :</p>
      <ul>
        <li><code>public</code> (défaut) — accessible partout</li>
        <li><code>private</code> — uniquement accessible à l'intérieur de la classe</li>
        <li><code>protected</code> — accessible dans la classe ET ses sous-classes</li>
        <li><code>readonly</code> — assignable uniquement dans le constructeur</li>
      </ul>

      <CodeBlock language="typescript">{codeModificateurs}</CodeBlock>

      <h2>Classes abstraites</h2>

      <p>Une classe abstraite est un <strong>modèle incomplet</strong> — elle définit la structure et le comportement commun, mais délègue certaines implémentations aux classes enfants. On ne peut pas instancier une classe abstraite directement.</p>

      <CodeBlock language="typescript">{codeAbstract}</CodeBlock>

      <h2>Type Guards — rétrécir le type</h2>

      <p>Quand une variable peut être de plusieurs types (union type), les <strong>type guards</strong> sont des vérifications qui permettent à TypeScript de "rétrécir" (narrow) le type dans chaque branche.</p>

      <CodeBlock language="typescript">{codeTypeGuards}</CodeBlock>

      <h2>Discriminated Unions</h2>

      <p>Donner à chaque variante d'un union type une propriété <strong>discriminante</strong> (souvent <code>type</code> ou <code>kind</code>) avec une valeur littérale unique. TypeScript peut alors inférer le type exact dans chaque branche d'un switch.</p>

      <CodeBlock language="typescript">{codeDiscriminated}</CodeBlock>

      <InfoBox type="success">
        Les <strong>discriminated unions</strong> sont le pattern TypeScript le plus utilisé dans les bases de code React et Redux. Ils remplacent avantageusement les hiérarchies de classes complexes par des types simples et exhaustifs.
      </InfoBox>
    </>
  );
}

export const chapter: Chapter = {
  id: 18,
  title: 'TypeScript — POO Avancée',
  icon: '🏛️',
  level: 'Bonus TS',
  stars: '★★★★☆',
  component: Ch18TsPoo,
  quiz: [
    {
      question: "Quelle est la différence entre private et # (champs privés JS natifs) en TypeScript ?",
      sub: "Modificateurs d'accès TypeScript",
      options: [
        "Ils sont identiques",
        "private n'existe qu'à la compilation (TS efface), # est natif JS et privé à l'exécution aussi",
        "# est plus lent car vérifié à l'exécution",
        "private empêche l'héritage, # non"
      ],
      correct: 1,
      explanation: "✅ Exact ! private TypeScript disparaît à la compilation — le JS généré n'a aucune protection. Les champs # (ES2022) sont privés même dans le JS compilé, car le runtime les protège. Pour une vraie encapsulation à l'exécution, utilise #."
    },
    {
      question: "Que fait 'animal is Chat' dans le type de retour d'un type guard ?",
      sub: "Prédicats de type (type predicates)",
      options: [
        "Caste l'animal en Chat sans vérification",
        "Indique à TypeScript que si la fonction retourne true, le paramètre est du type Chat dans la branche",
        "Lance une erreur si animal n'est pas un Chat",
        "C'est une syntaxe invalide en TypeScript"
      ],
      correct: 1,
      explanation: "✅ Parfait ! 'animal is Chat' est un prédicat de type. Il dit à TS : \"si cette fonction retourne true, alors le paramètre animal est de type Chat dans le bloc if\". TS utilisera cette info pour faire du narrowing automatique."
    },
    {
      question: "Quelle est la différence entre `abstract class` et `interface` en TypeScript ?",
      sub: "Classe abstraite vs interface",
      options: [
        "Il n'y a aucune différence, les deux sont effacés à la compilation",
        "Une classe abstraite peut contenir des méthodes concrètes et un état ; une interface ne définit que des contrats sans implémentation",
        "Une interface peut être instanciée, une classe abstraite non",
        "Une classe abstraite ne supporte pas l'héritage multiple"
      ],
      correct: 1,
      explanation: "✅ Exact ! Une classe abstraite peut fournir des méthodes concrètes partagées (comme decrire()) et maintenir un état via des propriétés. Une interface ne contient que des signatures — aucune implémentation. Utilise une classe abstraite quand tu as du comportement commun à partager, une interface pour définir un contrat pur."
    },
    {
      question: "Quelle est la différence entre `protected` et `private` dans une classe TypeScript ?",
      sub: "Modificateurs d'accès",
      options: [
        "protected est accessible de partout, private seulement dans la classe",
        "private est accessible dans la classe et ses sous-classes, protected seulement dans la classe",
        "protected est accessible dans la classe ET ses sous-classes, private seulement dans la classe elle-même",
        "Les deux sont identiques en TypeScript"
      ],
      correct: 2,
      explanation: "✅ Parfait ! protected permet l'accès depuis la classe elle-même ET toutes ses sous-classes (héritage). private est strictement limité à la classe qui le déclare — même une sous-classe ne peut pas y accéder. C'est la différence clé pour concevoir des hiérarchies de classes."
    },
    {
      question: "Dans un discriminated union, quelle propriété joue le rôle de discriminant dans l'exemple `{ etat: 'chargement' } | { etat: 'succes'; donnees: string[] }` ?",
      sub: "Discriminated Unions",
      options: [
        "donnees",
        "etat",
        "string[]",
        "Il n'y a pas de discriminant"
      ],
      correct: 1,
      explanation: "✅ Exact ! La propriété `etat` est le discriminant car elle a une valeur littérale unique dans chaque variante ('chargement', 'succes', 'erreur'). TypeScript peut inférer le type exact de l'union dans chaque branche du switch grâce à cette propriété commune."
    },
    {
      question: "Quelle différence entre `implements` et `extends` dans une définition de classe ?",
      sub: "implements vs extends",
      options: [
        "extends implémente une interface, implements hérite d'une classe",
        "implements vérifie qu'une classe respecte le contrat d'une interface sans héritage ; extends hérite de l'implémentation d'une classe parente",
        "Les deux sont synonymes en TypeScript",
        "implements ne peut s'utiliser qu'avec des classes abstraites"
      ],
      correct: 1,
      explanation: "✅ Parfait ! `implements IUserRepository` dit à TypeScript : 'vérifie que cette classe respecte le contrat de l'interface' — sans hériter d'aucune implémentation. `extends Forme` hérite du code de la classe parente (constructeur, méthodes concrètes). On peut implémenter plusieurs interfaces mais n'étendre qu'une seule classe."
    },
    {
      question: "Pourquoi utilise-t-on `instanceof` plutôt que `typeof` pour un type guard sur une classe ?",
      sub: "Type Guards instanceof vs typeof",
      options: [
        "typeof fonctionne pour les classes mais instanceof est plus lisible",
        "typeof retourne toujours 'object' pour les instances de classe ; instanceof vérifie la chaîne de prototypes",
        "instanceof est plus rapide à l'exécution",
        "typeof ne fonctionne qu'en dehors des classes"
      ],
      correct: 1,
      explanation: "✅ Exact ! `typeof monCercle` retourne toujours 'object' — impossible de distinguer un Cercle d'un Rectangle ainsi. `instanceof Cercle` remonte la chaîne de prototypes et retourne true uniquement si l'objet a été créé avec new Cercle(). C'est pourquoi instanceof est le bon outil pour les classes, typeof pour les primitifs."
    }
  ]
};
