import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

const codeNonBlocking = `// JS n'attend pas — il continue et revient plus tard
console.log("1. Commande prise");

setTimeout(() => {
  console.log("3. Plat servi (après 2s)");
}, 2000);

console.log("2. En attendant, je sers d'autres tables");

// Sortie : 1, 2, 3 (dans cet ordre !)
// Jamais : 1, (attente 2s), 3, 2`;

const codeCallbackHell = `// ❌ Callback hell : difficile à lire, à déboguer, à gérer les erreurs
connexion(user, (errConnexion, session) => {
  if (errConnexion) { return console.error(errConnexion); }

  chargerProfil(session.id, (errProfil, profil) => {
    if (errProfil) { return console.error(errProfil); }

    chargerPermissions(profil.role, (errPerms, perms) => {
      if (errPerms) { return console.error(errPerms); }

      // Enfin ! On peut faire quelque chose...
      console.log("Connecté avec permissions:", perms);
    });
  });
});
// 3 niveaux d'imbrication, gestion d'erreur répétée, illisible...`;

const codePromise = `// Créer une Promise
const attendre = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const charger = (id) => new Promise((resolve, reject) => {
  if (id <= 0) {
    reject(new Error("ID invalide"));
    return; // IMPORTANT : ne pas oublier le return !
  }
  // Simuler un délai réseau
  setTimeout(() => resolve({ id, nom: "Alice" }), 500);
});

// Consommer avec .then/.catch/.finally
charger(1)
  .then(user => {
    console.log("Chargé:", user.nom);
    return user.nom.toUpperCase(); // chaîner en retournant une valeur
  })
  .then(nomMaj => console.log("Majuscule:", nomMaj))
  .catch(err => console.error("Erreur:", err.message))
  .finally(() => console.log("Terminé (succès ou erreur)"));`;

const codePromiseAll = `const api = (id, ms) => new Promise(res => setTimeout(() => res(\`data-\${id}\`), ms));

// Promise.all : TOUTES doivent réussir (en parallèle)
// Échoue si UNE seule échoue. Résultat dans l'ordre des promesses.
const [r1, r2, r3] = await Promise.all([
  api(1, 100), api(2, 200), api(3, 300)
]);
// Total: 300ms (la plus longue), pas 100+200+300=600ms !

// Promise.allSettled : toutes, succès OU échec
// Ne rejette jamais. Retourne {status, value/reason} pour chacune.
const resultats = await Promise.allSettled([
  api(1, 100),
  Promise.reject(new Error("Echec")),
  api(3, 200)
]);
// [{status:"fulfilled",value:"data-1"}, {status:"rejected",...}, ...]

// Promise.race : LA PREMIÈRE à se résoudre (ou rejeter)
// Utile pour les timeouts
const avecTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms)
    )
  ]);

// Promise.any : la première qui RÉUSSIT (ignore les échecs)
const premier = await Promise.any([
  Promise.reject("fail1"),
  api(2, 300),
  api(3, 100)
]);
// "data-3" (la plus rapide qui réussit)`;

const codeAsyncAwait = `// Ces deux blocs sont ÉQUIVALENTS

// Avec .then()
function chargerUserPromise(id) {
  return fetch(\`/api/users/\${id}\`)
    .then(res => {
      if (!res.ok) throw new Error("Non trouvé");
      return res.json();
    })
    .then(data => data.nom);
}

// Avec async/await — identique sous le capot
async function chargerUserAsync(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error("Non trouvé");
  const data = await res.json();
  return data.nom; // → wrappé dans une Promise résolue
}

// Les deux retournent une Promise !
chargerUserAsync(1) instanceof Promise; // true`;

const codeParallel = `// Gestion d'erreur avec try/catch
async function chargerData(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    }

    return await res.json();

  } catch (erreur) {
    if (erreur.name === "AbortError") {
      console.log("Requête annulée");
    } else {
      console.error("Erreur réseau:", erreur.message);
    }
    throw erreur; // re-lancer pour que l'appelant puisse gérer
  }
}

// ❌ Piège : await séquentiel inutile
const u1 = await chargerData("/users/1"); // attend...
const u2 = await chargerData("/users/2"); // puis attend encore
// Total: temps1 + temps2

// ✅ En parallèle avec Promise.all
const [user1, user2] = await Promise.all([
  chargerData("/users/1"),
  chargerData("/users/2")
]);
// Total: max(temps1, temps2)`;

const codeAbort = `// AbortController : annuler des opérations async
const controller = new AbortController();
const signal = controller.signal;

// Annuler après 5 secondes
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch("/api/slow-endpoint", { signal });
  clearTimeout(timeout); // annuler le timeout si succès
  const data = await res.json();
  console.log(data);
} catch (err) {
  if (err.name === "AbortError") {
    console.log("Requête annulée après 5s");
  }
}

// Cas d'usage React : annuler au démontage du composant
// useEffect(() => {
//   const controller = new AbortController();
//   fetchData({ signal: controller.signal });
//   return () => controller.abort(); // cleanup
// }, []);`;

const codeChallenge = `const attendre = ms => new Promise(res => setTimeout(res, ms));

async function fetchAvecRetry(url, maxTentatives = 3) {
  let delai = 100;

  for (let tentative = 1; tentative <= maxTentatives; tentative++) {
    try {
      console.log(\`Tentative \${tentative}...\`);
      const res = await fetch(url);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return await res.json();
    } catch (err) {
      if (tentative === maxTentatives) throw err;
      console.log(\`Échec, retry dans \${delai}ms\`);
      await attendre(delai);
      delai *= 2; // backoff exponentiel
    }
  }
}

// Usage
const data = await fetchAvecRetry("/api/unstable", 4);
// Tentative 1... Échec, retry dans 100ms
// Tentative 2... Échec, retry dans 200ms
// Tentative 3... Succès !`;

function Ch11Async() {
  return (
    <>
      <div className="chapter-tag">Chapitre 11 · JavaScript Asynchrone</div>
      <h1>Async &amp;<br /><span className="highlight">Promises</span></h1>

      <div className="chapter-intro-card">
        <div className="level-badge level-advanced">🔮</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★☆</div>
          <h3>Callbacks, Promises, async/await, Promise.all/race/any, AbortController</h3>
          <p>Durée estimée : 40 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>JavaScript est <strong>mono-thread</strong> : il ne peut exécuter qu'une seule opération à la fois. Mais les applications modernes ont besoin de faire des requêtes réseau, lire des fichiers, attendre des timers... Comment faire sans bloquer toute l'interface ? C'est le problème que résout la programmation asynchrone.</p>

      <h2>L'analogie du restaurant</h2>

      <p>Imaginez un serveur de restaurant (le thread JavaScript) :</p>
      <ul>
        <li><strong>Bloquant (mauvais)</strong> : Le serveur prend une commande, va en cuisine, ATTEND que le plat soit prêt, revient, puis prend la commande suivante. Personne n'est servi en attendant.</li>
        <li><strong>Non-bloquant (JS)</strong> : Le serveur prend la commande, la transmet en cuisine, puis sert immédiatement d'autres tables. Quand le plat est prêt (callback/Promise), il revient le livrer.</li>
      </ul>

      <CodeBlock language="javascript">{codeNonBlocking}</CodeBlock>

      <h2>Callbacks — Le problème originel</h2>

      <p>Les callbacks (fonctions passées en argument pour être appelées plus tard) étaient la première solution. Mais enchaîner des opérations asynchrones crée la redoutable <em>pyramid of doom</em> :</p>

      <CodeBlock language="javascript">{codeCallbackHell}</CodeBlock>

      <h2>Promises — Un contrat pour le futur</h2>

      <p>Une Promise représente une valeur qui n'est <em>pas encore disponible</em> mais qui le sera (ou pas). Elle a exactement trois états :</p>
      <ul>
        <li><strong>pending</strong> : en cours — ni résolue ni rejetée</li>
        <li><strong>fulfilled</strong> : opération réussie — la valeur est disponible</li>
        <li><strong>rejected</strong> : opération échouée — une erreur est disponible</li>
      </ul>
      <p>Une Promise ne peut changer d'état qu'une seule fois, et cet état est définitif.</p>

      <CodeBlock language="javascript">{codePromise}</CodeBlock>

      <InfoBox type="tip">
        Retourner une valeur dans un <code>.then()</code> la transmet au <code>.then()</code> suivant. Retourner une nouvelle Promise dans un <code>.then()</code> attend que cette Promise soit résolue avant de passer au suivant. C'est ce qui permet le chaînage propre.
      </InfoBox>

      <h2>Promise.all, .allSettled, .race, .any — Orchestrer les Promises</h2>

      <CodeBlock language="javascript">{codePromiseAll}</CodeBlock>

      <h2>async/await — Ce que ça fait vraiment</h2>

      <p><code>async/await</code> est du <strong>sucre syntaxique</strong> par-dessus les Promises — pas une technologie différente. Sous le capot, une fonction <code>async</code> retourne toujours une Promise, et <code>await</code> met en pause uniquement cette fonction, pas le thread entier.</p>

      <CodeBlock language="javascript">{codeAsyncAwait}</CodeBlock>

      <CodeBlock language="javascript">{codeParallel}</CodeBlock>

      <InfoBox type="warning">
        Ne mettez <strong>jamais</strong> await dans une boucle forEach — elle ne se comporte pas comme vous l'espérez. Utilisez <code>for...of</code> pour des awaits séquentiels, ou <code>Promise.all</code> avec <code>.map()</code> pour des awaits parallèles.
      </InfoBox>

      <h2>AbortController — Annuler une requête en cours</h2>

      <CodeBlock language="javascript">{codeAbort}</CodeBlock>

      <Challenge title="Défi : Retry avec backoff exponentiel">
        <p>Implémentez une fonction <code>fetchAvecRetry(url, maxTentatives)</code> qui réessaie automatiquement en cas d'échec, avec un délai qui double à chaque tentative (100ms, 200ms, 400ms...).</p>
        <CodeBlock language="javascript">{codeChallenge}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 14,
  title: 'Async & Promises',
  icon: '🔮',
  level: 'Avancé',
  stars: '★★★★☆',
  component: Ch11Async,
  quiz: [
    {
      question: "Qu'est-ce qu'une Promise dans l'état 'pending' ?",
      sub: "Les 3 états d'une Promise",
      options: [
        "La Promise a réussi mais n'a pas encore renvoyé sa valeur",
        "La Promise est en cours d'exécution — ni résolue ni rejetée",
        "La Promise a échoué silencieusement",
        "La Promise attend d'être consommée avec .then()"
      ],
      correct: 1,
      explanation: "✅ Exact ! Une Promise peut être dans 3 états : pending (en cours), fulfilled (réussie avec valeur), rejected (échouée avec raison). Pending signifie que l'opération asynchrone est encore en cours."
    },
    {
      question: "Quelle méthode utiliser pour lancer plusieurs requêtes en parallèle ET obtenir TOUS les résultats (même si certains échouent) ?",
      sub: "Promise.all vs Promise.allSettled",
      options: [
        "Promise.all — elle gère les échecs automatiquement",
        "Promise.allSettled — elle retourne un résultat pour chaque Promise, succès ou échec",
        "Promise.race — elle est la plus rapide",
        "Promise.any — elle ignore les échecs"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Promise.allSettled attend TOUTES les Promises et retourne un tableau de {status:'fulfilled',value} ou {status:'rejected',reason}. Promise.all s'arrête et rejette dès qu'UNE Promise échoue."
    },
    {
      question: "Pourquoi ne faut-il PAS utiliser await dans un .forEach() ?",
      sub: "async/await dans les boucles",
      options: [
        "forEach ne supporte pas les fonctions async",
        "forEach lance les fonctions async mais n'attend pas leur résolution — le code continue sans attendre",
        "forEach cause des memory leaks avec async",
        "Cela génère une SyntaxError"
      ],
      correct: 1,
      explanation: "✅ Exact ! forEach ne comprend pas les Promises retournées par les fonctions async — il les lance mais n'attend pas leur résolution. Le code après forEach continue immédiatement. Utilisez for...of pour des awaits séquentiels, ou Promise.all + .map() pour du parallèle."
    },
    {
      question: "Une fonction déclarée avec le mot-clé 'async' retourne toujours quel type ?",
      sub: "async function — valeur retournée",
      options: [
        "La valeur brute spécifiée dans le return",
        "undefined si aucun return n'est présent, sinon la valeur",
        "Toujours une Promise, même si le return contient une valeur synchrone",
        "Un objet AsyncIterator"
      ],
      correct: 2,
      explanation: "✅ Exact ! Une fonction async enveloppe toujours sa valeur de retour dans une Promise résolue. Si vous écrivez 'return 42', l'appelant reçoit une Promise qui se résout avec 42. C'est pourquoi chargerUserAsync(1) instanceof Promise vaut true, même si la fonction retourne une string."
    },
    {
      question: "Quelle différence entre Promise.race et Promise.any ?",
      sub: "Promise.race vs Promise.any",
      options: [
        "Promise.race attend toutes les Promises, Promise.any s'arrête à la première",
        "Promise.race se résout ou rejette avec la PREMIÈRE Promise terminée (succès ou échec) ; Promise.any attend la première qui RÉUSSIT",
        "Il n'y a aucune différence — ce sont des alias",
        "Promise.race fonctionne uniquement avec 2 Promises, Promise.any avec n'importe quel nombre"
      ],
      correct: 1,
      explanation: "✅ Parfait ! Promise.race retourne la première Promise terminée, qu'elle réussisse ou échoue — utile pour implémenter un timeout. Promise.any ignore les échecs et retourne la première qui réussit ; elle rejette seulement si TOUTES échouent (AggregateError). Choisissez selon si un échec précoce doit vous intéresser."
    },
    {
      question: "Comment annuler une requête fetch en cours avec AbortController ?",
      sub: "AbortController",
      options: [
        "En appelant fetch.cancel() sur l'objet retourné",
        "En passant { signal: controller.signal } à fetch puis en appelant controller.abort()",
        "En rejetant la Promise manuellement avec Promise.reject()",
        "Il est impossible d'annuler un fetch une fois lancé"
      ],
      correct: 1,
      explanation: "✅ Exact ! AbortController fonctionne en deux temps : on crée un controller, on passe son signal à fetch via { signal: controller.signal }, puis on appelle controller.abort() pour annuler. Fetch lèvera alors une AbortError (err.name === 'AbortError') que l'on peut attraper dans un catch. C'est indispensable pour nettoyer les requêtes dans useEffect de React."
    },
    {
      question: "Qu'est-ce qu'une microtâche (microtask) par rapport à une macrotâche (macrotask) dans la boucle d'événements ?",
      sub: "Microtâches vs macrotâches",
      options: [
        "Les microtâches sont exécutées après toutes les macrotâches en attente",
        "Les microtâches (résolution de Promise) sont exécutées avant la prochaine macrotâche (setTimeout, setInterval)",
        "setTimeout crée des microtâches, Promise.then crée des macrotâches",
        "Il n'y a pas de différence d'ordre entre microtâches et macrotâches"
      ],
      correct: 1,
      explanation: "✅ Exact ! La file des microtâches (Promise .then, queueMicrotask) est vidée entièrement avant que la boucle d'événements ne traite la prochaine macrotâche (setTimeout, setInterval, I/O). Cela explique pourquoi Promise.resolve().then(() => ...) s'exécute avant setTimeout(() => ..., 0), même si le timeout est à 0ms."
    },
    {
      question: "Comment exécuter immédiatement une fonction async sans la nommer (async IIFE) ?",
      sub: "Async IIFE",
      options: [
        "async { await fetch('/api'); }()",
        "(async () => { await fetch('/api'); })()",
        "await (() => fetch('/api'))()",
        "new async function() { await fetch('/api'); }()"
      ],
      correct: 1,
      explanation: "✅ Correct ! Un async IIFE (Immediately Invoked Function Expression) suit la syntaxe (async () => { /* code */ })(). Les parenthèses autour de la fonction la transforment en expression, puis () l'invoque immédiatement. C'est utile pour utiliser await au niveau module top-level dans les environnements qui ne le supportent pas nativement."
    }
  ]
};
