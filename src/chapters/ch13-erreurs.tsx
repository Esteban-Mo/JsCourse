import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeTryCatch = `try {
  // Code qui peut échouer
  const data = JSON.parse("{ invalide }"); // SyntaxError !
  console.log(data); // jamais atteint
} catch (err) {
  // err est l'objet erreur lancé
  console.log(err.name);    // "SyntaxError"
  console.log(err.message); // "Unexpected token i in JSON..."
} finally {
  // Toujours exécuté : nettoyage, fermeture de connexion, etc.
  console.log("Nettoyage terminé");
}

// finally s'exécute même si try réussit
try {
  const x = 1 + 1;
} finally {
  console.log("Toujours là !"); // s'exécute
}`;

const codeInstanceof = `// Identifier le type d'erreur avec instanceof
try {
  const user = null;
  user.nom; // TypeError : Cannot read properties of null
} catch (err) {
  if (err instanceof TypeError) {
    console.log("Problème de type :", err.message);
  } else if (err instanceof SyntaxError) {
    console.log("JSON ou code invalide");
  } else {
    throw err; // re-lancer les erreurs inconnues
  }
}

// Toutes les erreurs partagent ces propriétés
const err = new Error("Quelque chose s'est mal passé");
err.name;    // "Error"
err.message; // "Quelque chose s'est mal passé"
err.stack;   // Trace d'appels — précieux pour le débogage`;

const codeCustomErrors = `// Créer une erreur personnalisée
class ApiError extends Error {
  constructor(message, statusCode, endpoint) {
    super(message); // appelle Error(message)
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }
}

class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

// Les utiliser
function validerAge(age) {
  if (typeof age !== "number") {
    throw new ValidationError("age", "L'âge doit être un nombre");
  }
  if (age < 0 || age > 150) {
    throw new RangeError(\`Âge invalide : \${age}\`);
  }
  return true;
}

try {
  validerAge("vingt");
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(\`Champ invalide: \${err.field} — \${err.message}\`);
    // "Champ invalide: age — L'âge doit être un nombre"
  }
}`;

const codeReThrow = `function chargerConfig(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    // On ne gère QUE les SyntaxError (JSON malformé)
    if (err instanceof SyntaxError) {
      throw new Error(\`Config invalide : \${err.message}\`);
    }
    throw err; // re-lancer les autres erreurs telles quelles
  }
}

// Wrapping d'erreur : ajouter du contexte sans perdre l'original
class DatabaseError extends Error {
  constructor(message, cause) {
    super(message, { cause }); // ES2022 : Error.cause
    this.name = "DatabaseError";
  }
}

try {
  // opération DB qui échoue...
} catch (originalErr) {
  throw new DatabaseError("Impossible de lire l'utilisateur", originalErr);
  // err.cause contient l'erreur originale — précieux pour le debug
}`;

const codeAsync = `// Style Promise avec .catch()
fetch("/api/users")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Erreur réseau :", err))
  .finally(() => setLoading(false)); // .finally() existe aussi !

// Style async/await avec try/catch — plus lisible
async function chargerUtilisateur(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);

    if (!res.ok) {
      throw new ApiError("Utilisateur introuvable", res.status, res.url);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) {
      return null; // cas géré : utilisateur absent
    }
    throw err; // re-lancer le reste (réseau, serveur...)
  }
}`;

const codeChallenge = `// Solution
function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null; // catch sans variable — ES2019
  }
}

parseJSON('{"ok":true}'); // { ok: true }
parseJSON("invalide");    // null

class NotFoundError extends Error {
  constructor(resource) {
    super(\`\${resource} introuvable\`);
    this.name = "NotFoundError";
    this.resource = resource;
  }
}

throw new NotFoundError("Utilisateur #42");
// NotFoundError: Utilisateur #42 introuvable`;

function Ch10Erreurs() {
  return (
    <>
      <div className="chapter-tag">Chapitre 10 · Gestion des Erreurs</div>
      <h1>Gestion<br /><span className="highlight">des Erreurs</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-advanced">🚨</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★☆</div>
          <h3>try/catch/finally, types d'erreurs, erreurs personnalisées, re-throw</h3>
          <p>Durée estimée : 30 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Un programme qui ne gère pas les erreurs est un programme qui <strong>plante en silence</strong> — ou pire, qui continue de s'exécuter dans un état invalide. La gestion des erreurs n'est pas optionnelle : c'est ce qui distingue un code de production d'un prototype. Ce chapitre couvre les mécanismes natifs de JavaScript pour détecter, identifier, et propager les erreurs de façon contrôlée.</p>

      <h2>try / catch / finally — L'anatomie d'une zone protégée</h2>

      <p>Le bloc <code>try</code> délimite une zone de code dont l'exécution peut échouer. Si une erreur est lancée (<em>thrown</em>), l'exécution saute immédiatement au bloc <code>catch</code>. Le bloc <code>finally</code> s'exécute <strong>toujours</strong>, qu'il y ait eu erreur ou non — idéal pour nettoyer des ressources.</p>

      <CodeBlock language="javascript">{codeTryCatch}</CodeBlock>

      <InfoBox type="tip">
        <strong>finally</strong> s'exécute aussi si le bloc <code>try</code> contient un <code>return</code> ou un <code>break</code>. C'est le seul endroit garanti pour libérer une ressource (fichier ouvert, connexion DB, timer) quoi qu'il arrive.
      </InfoBox>

      <h2>Les types d'erreurs natifs</h2>

      <p>JavaScript dispose de plusieurs sous-classes d'<code>Error</code>. Les identifier permet de distinguer une erreur de programmation (à corriger dans le code) d'une erreur d'exécution attendue (à gérer).</p>

      <div className="table-container">
        <table>
          <tbody>
            <tr><th>Type</th><th>Cause typique</th></tr>
            <tr><td><code>Error</code></td><td>Classe de base, lancée manuellement avec <code>throw new Error()</code></td></tr>
            <tr><td><code>TypeError</code></td><td>Opération sur un mauvais type : <code>null.propriete</code>, appeler non-fonction</td></tr>
            <tr><td><code>RangeError</code></td><td>Valeur hors plage autorisée : <code>new Array(-1)</code>, stack overflow</td></tr>
            <tr><td><code>ReferenceError</code></td><td>Variable non déclarée : <code>console.log(inexistante)</code></td></tr>
            <tr><td><code>SyntaxError</code></td><td>Code malformé : <code>JSON.parse("invalid")</code>, eval de code invalide</td></tr>
            <tr><td><code>URIError</code></td><td><code>decodeURIComponent('%')</code> — séquence URI malformée</td></tr>
          </tbody>
        </table>
      </div>

      <CodeBlock language="javascript">{codeInstanceof}</CodeBlock>

      <h2>Erreurs personnalisées — Étendre Error</h2>

      <p>Créer ses propres classes d'erreurs permet de transporter des informations métier (code HTTP, ID de ressource) et de distinguer précisément les erreurs dans les <code>catch</code>. C'est une pratique standard en production.</p>

      <CodeBlock language="javascript">{codeCustomErrors}</CodeBlock>

      <InfoBox type="success">
        Règle d'or : créez une classe d'erreur par <strong>type de problème métier</strong> (<code>NotFoundError</code>, <code>UnauthorizedError</code>, <code>ValidationError</code>...). Ainsi, un <code>catch</code> en haut de la pile peut décider comment réagir selon le type d'erreur plutôt que d'analyser le message texte.
      </InfoBox>

      <h2>Re-throw — Filtrer et propager</h2>

      <p>Un <code>catch</code> ne doit pas forcément tout avaler. Si l'erreur capturée n'est pas celle qu'on sait gérer, il faut la <strong>re-lancer</strong> pour qu'une couche supérieure puisse la traiter — ou qu'elle remonte jusqu'à l'utilisateur.</p>

      <CodeBlock language="javascript">{codeReThrow}</CodeBlock>

      <h2>Erreurs avec les Promises et async/await</h2>

      <p>Les Promises ont leur propre mécanisme de gestion d'erreurs. Une Promise rejetée non gérée déclenche un avertissement (ou une erreur) dans Node.js et les navigateurs modernes. Il y a deux styles — les deux sont valides selon le contexte.</p>

      <CodeBlock language="javascript">{codeAsync}</CodeBlock>

      <InfoBox type="danger">
        Ne jamais laisser une Promise rejetée sans gestionnaire. Dans Node.js, une <code>UnhandledPromiseRejection</code> peut crasher le processus. Toujours chaîner un <code>.catch()</code> ou utiliser <code>try/catch</code> autour des <code>await</code>.
      </InfoBox>

      <Challenge title="Défi personnel à réaliser : parseJSON sûr et NotFoundError">
        <p>Implémentez une fonction <code>parseJSON(str)</code> qui retourne l'objet parsé en cas de succès, ou <code>null</code> si le JSON est invalide — sans jamais laisser l'erreur remonter. Puis créez une classe <code>NotFoundError</code> qui étend <code>Error</code> avec une propriété <code>resource</code>.</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 13,
  title: 'Gestion des Erreurs',
  icon: '🚨',
  level: 'Avancé',
  stars: '★★★★☆',
  component: Ch10Erreurs,
  quiz: [
    {
      question: "Le bloc finally s'exécute-t-il si le bloc try contient un return ?",
      sub: "Comportement de finally",
      options: [
        "Non, return interrompt tout y compris finally",
        "Oui, finally s'exécute toujours, même après un return dans try",
        "Seulement si le return retourne undefined",
        "Seulement si catch est présent aussi"
      ],
      correct: 1,
      explanation: "✅ Exact ! finally s'exécute TOUJOURS — après un return, un break, ou une erreur. C'est sa garantie fondamentale. C'est pourquoi il est idéal pour libérer des ressources (fermer une connexion, masquer un loader) peu importe ce qui s'est passé."
    },
    {
      question: "Quelle est la bonne façon de distinguer le type d'une erreur dans un catch ?",
      sub: "Identification des erreurs",
      options: [
        "Comparer err.type avec une chaîne : err.type === 'TypeError'",
        "Utiliser err instanceof TypeError (ou autre sous-classe)",
        "Lire err.code qui vaut toujours un nombre unique",
        "Utiliser typeof err === 'TypeError'"
      ],
      correct: 1,
      explanation: "✅ Parfait ! instanceof est la méthode fiable car elle vérifie la chaîne de prototype. err.name est une string modifiable, err.type n'existe pas nativement, et typeof err retourne toujours 'object'. instanceof fonctionne aussi avec vos classes personnalisées qui étendent Error."
    },
    {
      question: "Pourquoi re-lancer une erreur (throw err) dans un catch ?",
      sub: "Pattern re-throw",
      options: [
        "Pour éviter que le programme s'arrête",
        "Pour gérer uniquement les erreurs connues et laisser les autres remonter à une couche supérieure",
        "Parce que catch ne peut traiter qu'une erreur à la fois",
        "Pour convertir l'erreur en string"
      ],
      correct: 1,
      explanation: "✅ Exact ! Un catch ne doit gérer que les erreurs qu'il comprend. Si l'erreur capturée est d'un type inattendu, re-la-lancer (throw err) permet à une couche supérieure — ou au runtime — de la traiter. Avaler silencieusement toutes les erreurs masque des bugs critiques."
    },
    {
      question: "Quelle erreur native JavaScript est levée quand on accède à une propriété sur null ou undefined ?",
      sub: "Types d'erreurs natifs",
      options: [
        "ReferenceError",
        "SyntaxError",
        "TypeError",
        "RangeError"
      ],
      correct: 2,
      explanation: "✅ Exact ! null.propriete ou undefined.methode() lèvent une TypeError car on effectue une opération sur un type incompatible (null et undefined n'ont pas de propriétés). ReferenceError concerne les variables non déclarées, RangeError les valeurs hors plage, SyntaxError le code malformé."
    },
    {
      question: "Que contient la propriété 'cause' d'une Error créée avec new Error('msg', { cause: originalErr }) ?",
      sub: "Error.cause (ES2022)",
      options: [
        "Le message d'erreur formaté avec la cause",
        "L'erreur originale qui a provoqué cette erreur — utile pour tracer la chaîne d'erreurs",
        "Le nom de la fonction qui a lancé l'erreur",
        "Cette syntaxe est invalide en JavaScript"
      ],
      correct: 1,
      explanation: "✅ Exact ! La propriété cause (introduite en ES2022) permet de chaîner les erreurs. Quand on attrape une erreur bas niveau et qu'on la wrapping dans une erreur de plus haut niveau, on peut conserver l'original via { cause: originalErr }. Ainsi err.cause pointe vers l'erreur d'origine, ce qui facilite le débogage."
    },
    {
      question: "Si un bloc finally contient un return, que se passe-t-il avec le return du bloc try ?",
      sub: "finally avec return",
      options: [
        "Les deux valeurs sont retournées dans un tableau",
        "Le return du try est retourné normalement, finally est ignoré",
        "Le return du finally écrase et remplace le return du try",
        "Une erreur est levée car deux return sont incompatibles"
      ],
      correct: 2,
      explanation: "✅ Correct ! Un return dans finally écrase tout return précédent du bloc try ou catch. C'est un comportement subtil à connaître : si finally retourne une valeur, c'est elle qui est utilisée, peu importe ce que try ou catch avaient retourné. C'est pourquoi on évite généralement de mettre un return dans finally."
    },
    {
      question: "Quelle méthode hérite automatiquement une classe personnalisée qui étend Error ?",
      sub: "Héritage de la classe Error",
      options: [
        "Aucune — il faut tout redéfinir manuellement",
        "Seulement .toString()",
        "Les propriétés name, message et stack, ainsi que la compatibilité avec instanceof",
        "Uniquement la propriété message"
      ],
      correct: 2,
      explanation: "✅ Parfait ! Étendre Error avec 'class MonError extends Error' donne accès à .message (via super(message)), .stack (trace d'appels générée automatiquement) et .name (à redéfinir dans le constructeur). instanceof MonError et instanceof Error fonctionnent tous les deux. C'est la bonne pratique pour créer des erreurs métier typées."
    },
    {
      question: "Que se passe-t-il dans Node.js si une Promise rejetée n'a pas de gestionnaire .catch() ?",
      sub: "UnhandledPromiseRejection",
      options: [
        "Rien — les Promises rejetées non gérées sont ignorées silencieusement",
        "Un avertissement est affiché et le processus peut crasher selon la version de Node.js",
        "La Promise est automatiquement résolue avec undefined",
        "Une SyntaxError est levée au moment de la déclaration"
      ],
      correct: 1,
      explanation: "✅ Exact ! Dans Node.js moderne, une UnhandledPromiseRejection provoque un avertissement et, depuis Node.js 15+, termine le processus avec un code d'erreur non nul. Dans les navigateurs, un événement 'unhandledrejection' est déclenché. C'est pourquoi toute Promise doit avoir un .catch() ou être dans un try/catch avec await."
    }
  ]
};
