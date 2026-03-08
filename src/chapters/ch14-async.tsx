import React from 'react';
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

function PromiseDiagram() {
  const box = (color: string): React.CSSProperties => ({
    background: `rgba(${color}, 0.1)`,
    border: `1px solid rgba(${color}, 0.35)`,
    borderRadius: 8,
    padding: '12px 20px',
    color: '#e2e8f0',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    width: '140px',
    boxShadow: `0 4px 6px -1px rgba(${color}, 0.1)`,
    position: 'relative',
    zIndex: 2,
  });

  return (
    <div style={{ background: 'var(--surface)', border: '2px solid var(--accent)', borderRadius: 12, padding: '24px 16px', margin: '24px 0', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: 2, fontSize: 13, marginBottom: 24 }}>
        ── CYCLE DE VIE D'UNE PROMISE ──
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>

        {/* Pending state */}
        <div style={{ ...box('96,165,250'), margin: '0 auto' }}>
          ⏳ Pending<br />
          <span style={{ fontSize: 11, fontWeight: 'normal', color: 'var(--muted)', marginTop: 4, display: 'block' }}>En attente</span>
        </div>

        {/* SVG Arrows */}
        <svg width="340" height="80" viewBox="0 0 340 80" style={{ marginTop: '-10px', marginBottom: '-10px', position: 'relative', zIndex: 1, overflow: 'visible' }}>
          <path d="M 170 10 L 170 35 L 80 35 L 80 65" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" />
          <polygon points="75,60 85,60 80,70" fill="#34d399" />

          <path d="M 170 10 L 170 35 L 260 35 L 260 65" fill="none" stroke="#f87171" strokeWidth="2" strokeDasharray="4 4" />
          <polygon points="255,60 265,60 260,70" fill="#f87171" />

          <rect x="40" y="25" width="80" height="20" fill="var(--surface)" rx="4" />
          <text x="80" y="39" fill="#34d399" fontSize="12" textAnchor="middle" fontWeight="bold">resolve(v)</text>

          <rect x="220" y="25" width="80" height="20" fill="var(--surface)" rx="4" />
          <text x="260" y="39" fill="#f87171" fontSize="12" textAnchor="middle" fontWeight="bold">reject(e)</text>
        </svg>

        {/* Branches */}
        <div style={{ display: 'flex', width: '100%', maxWidth: '340px', justifyContent: 'space-between' }}>

          {/* Resolve branch */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, paddingRight: '10px' }}>
            <div style={{ ...box('52,211,153'), width: '130px', padding: '10px' }}>
              ✅ Fulfilled
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
              Déclenche <code style={{ color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '2px 4px', borderRadius: '4px' }}>.then()</code>
            </div>
          </div>

          {/* Reject branch */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, paddingLeft: '10px' }}>
            <div style={{ ...box('248,113,113'), width: '130px', padding: '10px' }}>
              ❌ Rejected
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
              Déclenche <code style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)', padding: '2px 4px', borderRadius: '4px' }}>.catch()</code>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(167, 139, 250, 0.1)',
          border: '1px dashed #a78bfa',
          borderRadius: 8,
          padding: '10px 20px',
          color: '#e2e8f0',
          fontSize: 13,
        }}>
          💡 Une fois <strong>Fulfilled</strong> ou <strong>Rejected</strong>, la Promise est <strong style={{ color: '#a78bfa' }}>Settled (Terminée)</strong>.<br />
          Son état et sa valeur sont définitifs et immuables.
        </div>
      </div>
    </div>
  );
}

function RestaurantDiagram() {
  const box = (color: string, textColor: string = '#e2e8f0'): React.CSSProperties => ({
    background: `rgba(${color}, 0.15)`,
    border: `2px solid rgba(${color}, 0.5)`,
    borderRadius: 8,
    padding: '10px 14px',
    color: textColor,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
    boxShadow: `0 4px 6px -1px rgba(${color}, 0.1)`,
  });

  return (
    <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: 12, padding: '24px', margin: '32px 0' }}>

      <div style={{ textAlign: 'center', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: 1.5, fontSize: 14, marginBottom: 32 }}>
        L'EXÉCUTION ASYNCHRONE DÉMYSTIFIÉE
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '32px' }}>

        {/* Colonne Bloquante */}
        <div style={{ background: 'rgba(248, 113, 113, 0.05)', borderRadius: 12, padding: '20px', border: '1px solid rgba(248, 113, 113, 0.2)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#f87171', fontWeight: 'bold', fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
            L'Approche Bloquante ❌
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginBottom: 24, minHeight: 40 }}>
            Le serveur (JavaScript) attend devant la cuisine sans rien faire.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', flex: 1 }}>
            <div style={{ ...box('96,165,250'), width: '100%' }}>👨‍🍳 Prend commande T1</div>

            {/* Ligne de temps bloquante */}
            <div style={{ position: 'relative', paddingLeft: '40px' }}>
              <div style={{ position: 'absolute', left: '16px', top: '0', bottom: '0', width: '2px', background: '#f87171' }}></div>
              <div style={{ ...box('248,113,113', '#fca5a5'), borderStyle: 'solid', background: 'rgba(248,113,113,0.1)' }}>
                ⏳ Attend le plat...<br />
                <span style={{ fontSize: 11, opacity: 0.8 }}>(15 minutes perdues)</span>
              </div>
            </div>

            <div style={{ ...box('52,211,153'), width: '100%' }}>🍽️ Sert Table 1</div>
            <div style={{ ...box('96,165,250'), width: '100%' }}>👨‍🍳 Prend commande T2</div>

            {/* Tag de conclusion */}
            <div style={{ marginTop: 'auto', background: 'rgba(248, 113, 113, 0.2)', color: '#fca5a5', padding: '8px', borderRadius: 6, fontSize: 12, textAlign: 'center' }}>
              La Table 2 est furieuse d'attendre.
            </div>
          </div>
        </div>

        {/* Colonne Non-Bloquante */}
        <div style={{ background: 'rgba(52, 211, 153, 0.05)', borderRadius: 12, padding: '20px', border: '1px solid rgba(52, 211, 153, 0.2)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
            L'Approche Asynchrone ✅
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginBottom: 24, minHeight: 40 }}>
            Le serveur délègue et continue son travail. La cuisine gère la durée asynchrone.
          </div>

          <div style={{ display: 'flex', gap: '16px', flex: 1 }}>

            {/* Serveur (Call Stack) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#60a5fa', textAlign: 'center', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>THREAD JS (Serveur)</div>
              <div style={{ ...box('96,165,250'), padding: '10px 4px' }}>👨‍🍳 Cmd T1</div>
              <div style={{ ...box('96,165,250'), padding: '10px 4px' }}>👨‍🍳 Cmd T2</div>
              <div style={{ ...box('96,165,250'), padding: '10px 4px' }}>👨‍🍳 Cmd T3</div>
              <div style={{ flex: 1, borderLeft: '2px dashed rgba(96,165,250,0.3)', margin: '4px auto 0' }}></div>
              <div style={{ ...box('52,211,153'), padding: '10px 4px', marginTop: '16px' }}>🍽️ Sert T1</div>
            </div>

            {/* Cuisine (Web APIs) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#a78bfa', textAlign: 'center', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>WEB APIs (Cuisine)</div>

              <div style={{ position: 'relative', marginTop: 10 }}>
                {/* Flèche de ticket */}
                <svg style={{ position: 'absolute', left: '-20px', top: '10px', width: '20px', height: '10px', overflow: 'visible' }}>
                  <path d="M 0 5 L 15 5" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="2 2" />
                  <polygon points="12,2 18,5 12,8" fill="#a78bfa" />
                </svg>
                <div style={{ ...box('167,139,250'), borderStyle: 'dashed', padding: '10px 4px' }}>🔥 Prépare T1 <span style={{ fontSize: 10 }}><br />(15min)</span></div>
              </div>

              <div style={{ position: 'relative', marginTop: 10 }}>
                <svg style={{ position: 'absolute', left: '-20px', top: '10px', width: '20px', height: '10px', overflow: 'visible' }}>
                  <path d="M 0 5 L 15 5" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="2 2" />
                  <polygon points="12,2 18,5 12,8" fill="#a78bfa" />
                </svg>
                <div style={{ ...box('167,139,250'), borderStyle: 'dashed', padding: '10px 4px' }}>🔥 Prépare T2</div>
              </div>

              <div style={{ position: 'relative', marginTop: 10 }}>
                <svg style={{ position: 'absolute', left: '-20px', top: '10px', width: '20px', height: '10px', overflow: 'visible' }}>
                  <path d="M 0 5 L 15 5" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="2 2" />
                  <polygon points="12,2 18,5 12,8" fill="#a78bfa" />
                </svg>
                <div style={{ ...box('167,139,250'), borderStyle: 'dashed', padding: '10px 4px' }}>🔥 Prépare T3</div>
              </div>

              {/* Retour au serveur */}
              <div style={{ position: 'relative', height: 40, marginTop: 'auto' }}>
                <svg style={{ position: 'absolute', left: '-30px', bottom: '2px', width: '60px', height: '40px', overflow: 'visible', zIndex: 0 }}>
                  <path d="M 60 0 C 60 30, 20 20, 0 20" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" />
                  <polygon points="5,15 0,20 5,25" fill="#34d399" />
                </svg>
              </div>

            </div>
          </div>

          {/* Tag de conclusion */}
          <div style={{ marginTop: '16px', background: 'rgba(52, 211, 153, 0.2)', color: '#6ee7b7', padding: '8px', borderRadius: 6, fontSize: 12, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            Tout le monde est servi rapidement !
          </div>
        </div>

      </div>
    </div>
  );
}

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

      <RestaurantDiagram />

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

      <PromiseDiagram />

      <InfoBox type="tip">
        <strong>Analogie de la commande de Pizza 🍕</strong><br />
        Quand vous commandez une pizza en ligne, le restaurant ne vous donne pas la pizza immédiatement. Il vous donne un ticket de caisse (la <code>Promise</code>). Ce ticket est dans l'état <em>pending</em> (en préparation). Vous pouvez continuer votre vie en attendant. Plus tard, le livreur sonne pour vous donner la pizza (état <em>fulfilled</em>), ou il vous appelle pour dire qu'ils n'ont plus de pâte (état <em>rejected</em>). Le <code>.then()</code> c'est ce que vous faites quand vous recevez la pizza (la manger), et le <code>.catch()</code> c'est ce que vous faites s'il y a une erreur (commander des sushis à la place).
      </InfoBox>

      <CodeBlock language="javascript">{codePromise}</CodeBlock>

      <InfoBox type="tip">
        Retourner une valeur dans un <code>.then()</code> la transmet au <code>.then()</code> suivant. Retourner une nouvelle Promise dans un <code>.then()</code> attend que cette Promise soit résolue avant de passer au suivant. C'est ce qui permet le chaînage propre.
      </InfoBox>

      <h2>Promise.all, .allSettled, .race, .any — Orchestrer les Promises</h2>

      <p>Quand vous avez plusieurs opérations asynchrones indépendantes, il est inefficace de les attendre une par une. JavaScript fournit quatre méthodes statiques ("combinateurs") de la classe <code>Promise</code> pour les exécuter toutes en même temps et décider comment gérer leurs résultats globaux.</p>

      <CodeBlock language="javascript">{codePromiseAll}</CodeBlock>

      <h2>async/await — Ce que ça fait vraiment</h2>

      <p><code>async/await</code> est du <strong>sucre syntaxique</strong> par-dessus les Promises — pas une technologie différente. Sous le capot, une fonction <code>async</code> retourne toujours une Promise, et <code>await</code> met en pause uniquement cette fonction, pas le thread entier.</p>
      <p>L'avantage massif d'<code>await</code> est la lisibilité : il permet d'écrire du code asynchrone qui ressemble <em>visuellement</em> à du code synchrone traditionnel, de haut en bas, sans aucun <code>.then()</code> imbriqué.</p>

      <CodeBlock language="javascript">{codeAsyncAwait}</CodeBlock>

      <CodeBlock language="javascript">{codeParallel}</CodeBlock>

      <InfoBox type="warning">
        Ne mettez <strong>jamais</strong> await dans une boucle forEach — elle ne se comporte pas comme vous l'espérez. Utilisez <code>for...of</code> pour des awaits séquentiels, ou <code>Promise.all</code> avec <code>.map()</code> pour des awaits parallèles.
      </InfoBox>

      <h2>AbortController — Annuler une requête en cours</h2>

      <p>Pendant longtemps, il était impossible d'annuler une requête réseau (fetch) nativement. <code>AbortController</code> est l'API moderne standard pour cela. On crée un contrôleur, on passe son "signal" à la fonction asynchrone (comme <code>fetch</code>), puis on appelle <code>.abort()</code> quand on n'a plus besoin de la réponse.</p>

      <CodeBlock language="javascript">{codeAbort}</CodeBlock>

      <Challenge title="Défi personnel à réaliser : Retry avec backoff exponentiel">
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
