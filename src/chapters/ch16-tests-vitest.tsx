import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch25() {
  return (
    <>
      <div className="chapter-tag">Avancé</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-advanced">🧪</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★☆</div>
          <h3>Tests avec Jest</h3>
          <p>Tester des fonctions, des APIs et des modules avec Jest, mocks et tests asynchrones</p>
        </div>
      </div>

      <h2>Pourquoi tester son code ?</h2>
      <p>
        Imagine que tu construises une voiture et que tu ne la testes jamais avant de la livrer au client.
        En développement, c'est exactement ce qui se passe quand on n'écrit pas de tests : on livre quelque
        chose qu'on espère correct, sans en avoir la certitude. Les tests automatisés sont ton filet de sécurité —
        ils vérifient que chaque pièce du moteur fonctionne comme prévu, et t'alertent immédiatement quand
        une modification casse quelque chose qui marchait avant.
      </p>
      <p>
        Il existe trois niveaux de tests, qu'on représente souvent sous forme de <strong>pyramide</strong>.
        À la base, les <strong>tests unitaires</strong> : ils testent une seule fonction isolément, sont
        rapides à exécuter et faciles à écrire. Au milieu, les <strong>tests d'intégration</strong> : ils
        vérifient que plusieurs modules fonctionnent correctement ensemble (par exemple, un service qui
        appelle une base de données). Au sommet, les <strong>tests end-to-end (E2E)</strong> : ils simulent
        un vrai utilisateur qui clique dans le navigateur. Ces derniers sont lents et coûteux — c'est pourquoi
        la base de la pyramide (tests unitaires) doit être la plus large.
      </p>
      <p>
        <strong>Jest</strong> est le framework de test dominant dans l'écosystème JavaScript. Il inclut tout
        ce dont tu as besoin : un test runner, un système d'assertions, un moteur de mocks, et un outil de
        coverage — sans configuration supplémentaire. Il est maintenu par Meta et utilisé par des millions
        de projets. Sa philosophie : rendre les tests aussi simples à écrire qu'à lire.
      </p>
      <InfoBox type="tip">
        Il y a une règle d'or en tests : <strong>"Si c'est difficile à tester, c'est probablement mal
        conçu."</strong> Un code très couplé, avec des dépendances cachées, sera un cauchemar à tester.
        Les tests te forcent à écrire du code modulaire, aux responsabilités bien définies — c'est un
        bénéfice indirect énorme.
      </InfoBox>

      <h2>Installation et configuration</h2>
      <p>
        Jest s'installe comme dépendance de développement. Par défaut, il fonctionne avec CommonJS
        (<code>require</code>). Pour l'utiliser avec TypeScript ou les modules ES6 (<code>import/export</code>),
        tu as besoin de quelques adaptateurs. La configuration se fait dans un fichier <code>jest.config.js</code>
        ou directement dans <code>package.json</code>.
      </p>
      <CodeBlock language="bash">{`# Installation de base
npm install --save-dev jest

# Avec support TypeScript
npm install --save-dev jest @types/jest ts-jest

# Avec support ESM (babel)
npm install --save-dev babel-jest @babel/core @babel/preset-env`}</CodeBlock>
      <CodeBlock language="javascript">{`// jest.config.js
module.exports = {
  // Environnement : 'node' (défaut) ou 'jsdom' (pour tester du DOM)
  testEnvironment: 'node',

  // Fichiers de setup exécutés avant les tests
  setupFilesAfterFramework: ['./jest.setup.js'],

  // Patterns de fichiers de test
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],

  // Activer la coverage
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: { lines: 80 },
  },
};

// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage"
  }
}`}</CodeBlock>
      <InfoBox type="tip">
        Le mode <code>--watch</code> est ton meilleur ami en développement : Jest surveille les fichiers
        modifiés et relance automatiquement les tests concernés. Tu vois les résultats en temps réel,
        au fil de tes modifications — comme un compilateur TypeScript pour tes tests.
      </InfoBox>

      <h2>describe, it, test — l'anatomie d'un test</h2>
      <p>
        Avant d'écrire le premier test, comprends bien la structure. <strong><code>describe()</code></strong>
        est un <em>conteneur</em> — il regroupe des tests liés dans une suite logique. C'est comme créer
        un dossier pour organiser tes fichiers. <strong><code>test()</code></strong> et{' '}
        <strong><code>it()</code></strong> sont exactement la même chose (aliases) — ils décrivent
        un scénario individuel avec une seule assertion précise.
      </p>
      <p>
        La convention <code>it</code> vient d'une idée simple : le nom du test doit se lire comme une
        phrase anglaise. "<code>it</code> should return 5 when given 2 and 3" — si tu lis ça à voix haute,
        tu comprends immédiatement ce que fait la fonction sans regarder le code. C'est une documentation
        vivante. Chaque test doit tester <em>une seule chose</em> : si un test échoue, tu sais exactement
        où est le problème.
      </p>
      <CodeBlock language="javascript">{`// math.js
export function additionner(a, b) { return a + b; }
export function diviser(a, b) {
  if (b === 0) throw new Error('Division par zéro');
  return a / b;
}
export function estPair(n) { return n % 2 === 0; }

// math.test.js
const { additionner, diviser, estPair } = require('./math');

describe('additionner', () => {
  it('additionne deux positifs', () => {
    expect(additionner(2, 3)).toBe(5);
  });

  it('additionne des négatifs', () => {
    expect(additionner(-1, -2)).toBe(-3);
  });

  it('renvoie le même nombre si on additionne zéro', () => {
    expect(additionner(5, 0)).toBe(5);
  });
});

describe('diviser', () => {
  it('divise correctement', () => {
    expect(diviser(10, 2)).toBe(5);
  });

  it('lève une erreur pour une division par zéro', () => {
    expect(() => diviser(5, 0)).toThrow('Division par zéro');
    expect(() => diviser(5, 0)).toThrow(Error);
  });
});

test('estPair retourne true pour 4', () => {
  expect(estPair(4)).toBe(true);
  expect(estPair(3)).toBe(false);
});`}</CodeBlock>
      <p>
        Remarque la syntaxe <code>expect(() =&gt; diviser(5, 0)).toThrow()</code> : pour tester qu'une
        fonction <em>lève</em> une erreur, tu dois l'envelopper dans une fonction fléchée. Si tu écrivais
        directement <code>expect(diviser(5, 0)).toThrow()</code>, l'erreur serait lancée <em>avant</em>{' '}
        que Jest puisse l'intercepter — et le test lui-même planterait.
      </p>

      <h2>Les matchers — comparer l'attendu et le réel</h2>
      <p>
        Un <strong>matcher</strong> est une fonction qui compare la valeur <em>réelle</em> (produite par
        ton code) à la valeur <em>attendue</em>. Si les deux correspondent, le test passe. Sinon, Jest
        lance une erreur avec un message clair indiquant ce qu'il attendait et ce qu'il a obtenu.
        C'est le cœur du système d'assertions.
      </p>
      <p>
        Tous les matchers peuvent être inversés avec <code>.not</code> : <code>expect(x).not.toBe(null)</code>
        vérifie que <code>x</code> n'est pas null. C'est une façon élégante d'exprimer une contrainte
        négative sans écrire de logique conditionnelle dans tes tests.
      </p>
      <CodeBlock language="javascript">{`// Égalité stricte (primitives) — utilise ===
expect(2 + 2).toBe(4);
expect('hello').toBe('hello');

// Égalité profonde (objets, tableaux)
expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });
expect([1, 2, 3]).toEqual([1, 2, 3]);

// Correspondance partielle
expect({ id: 1, nom: 'Alice', role: 'admin' }).toMatchObject({ nom: 'Alice' });
expect(['a', 'b', 'c']).toContain('b');
expect('Bonjour monde').toContain('monde');

// Existence et type
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect(42).toBeDefined();
expect(true).toBeTruthy();
expect(0).toBeFalsy();
expect('').toBeFalsy();

// Nombres
expect(3.14).toBeCloseTo(3.14159, 1); // tolérance à 1 décimale
expect(10).toBeGreaterThan(5);
expect(3).toBeLessThanOrEqual(3);

// Tableaux
expect([1, 2, 3]).toHaveLength(3);
expect([1, 2, 3]).toContain(2);

// Erreurs
expect(() => JSON.parse('invalid')).toThrow();
expect(() => JSON.parse('invalid')).toThrow(SyntaxError);
expect(() => { throw new Error('oops') }).toThrow('oops');

// Négation
expect(null).not.toBe(undefined);
expect([1]).not.toHaveLength(0);

// Snapshot — détecte les régressions visuelles/structurelles
expect({ id: 1, nom: 'Alice' }).toMatchSnapshot();`}</CodeBlock>

      <h2>toBe vs toEqual — deux jumeaux ou une seule personne ?</h2>
      <p>
        C'est l'une des confusions les plus fréquentes pour les débutants en Jest. Voici l'analogie qui
        clarifie tout : imagine deux jumeaux identiques, habillés pareil, avec le même visage. Ils ont
        le même <em>contenu</em>, mais ce sont deux <em>personnes différentes</em>. <strong><code>toEqual</code></strong>
        dit "ces deux jumeaux sont pareils" (même contenu). <strong><code>toBe</code></strong> dit "c'est
        la même personne exacte" (même référence en mémoire).
      </p>
      <p>
        En pratique : <code>toBe</code> utilise <code>Object.is()</code> (similaire à <code>===</code>)
        et compare les références pour les objets. <code>toEqual</code> fait une comparaison récursive
        propriété par propriété. Pour les primitives (<code>number</code>, <code>string</code>,
        <code>boolean</code>), les deux donnent le même résultat. Pour les objets et tableaux, utilise
        toujours <code>toEqual</code>.
      </p>
      <CodeBlock language="javascript">{`// Pour les primitives : toBe et toEqual sont équivalents
expect(42).toBe(42);      // ✅
expect(42).toEqual(42);   // ✅

// Pour les objets : seul toEqual compare le contenu
const obj1 = { a: 1 };
const obj2 = { a: 1 };

expect(obj1).toBe(obj2);    // ❌ ÉCHOUE — deux objets différents en mémoire
expect(obj1).toEqual(obj2); // ✅ PASSE — même structure, même contenu

// Quand toBe passe avec des objets : même référence
const obj3 = obj1;
expect(obj1).toBe(obj3);    // ✅ — c'est littéralement le même objet

// Idem pour les tableaux
expect([1, 2]).toBe([1, 2]);    // ❌ ÉCHOUE
expect([1, 2]).toEqual([1, 2]); // ✅ PASSE`}</CodeBlock>
      <InfoBox type="warning">
        Piège classique : <code>expect(NaN).toBe(NaN)</code> échoue avec <code>===</code>, mais
        <code>Object.is(NaN, NaN)</code> renvoie <code>true</code>. C'est pourquoi Jest utilise
        <code>Object.is()</code> et non <code>===</code> dans <code>toBe</code> — ce qui fait que
        <code>expect(NaN).toBe(NaN)</code> <em>passe</em> en Jest, contrairement à ce qu'on attendrait
        avec <code>===</code> seul.
      </InfoBox>

      <h2>Tester une API (fetch)</h2>
      <p>
        Quand ton code appelle une API externe avec <code>fetch</code>, tu ne peux pas laisser le vrai
        appel réseau se produire dans tes tests. Pourquoi ? Parce que les tests doivent être{' '}
        <strong>déterministes</strong> (toujours le même résultat), <strong>rapides</strong> (pas d'attente
        réseau) et <strong>indépendants</strong> (fonctionnent sans connexion internet, même en CI).
        La solution est de <em>mocker</em> <code>fetch</code> — le remplacer par une fausse version
        qui renvoie exactement ce qu'on lui dit.
      </p>
      <p>
        Il y a deux scénarios à toujours tester : le <strong>"happy path"</strong> (tout se passe bien,
        l'API répond 200) et le <strong>"error path"</strong> (l'API répond 404, ou 500, ou la connexion
        échoue). Un code qui gère seulement le happy path est un code qui plantera en production.
      </p>
      <CodeBlock language="javascript">{`// userService.js
async function fetchUser(id) {
  const res = await fetch(\`https://api.exemple.com/users/\${id}\`);
  if (!res.ok) throw new Error(\`Utilisateur \${id} introuvable\`);
  return res.json();
}

async function createUser(data) {
  const res = await fetch('https://api.exemple.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

module.exports = { fetchUser, createUser };

// userService.test.js
const { fetchUser, createUser } = require('./userService');

// Mocker fetch globalement
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks(); // réinitialiser les appels entre chaque test
});

describe('fetchUser', () => {
  it('retourne un utilisateur valide', async () => {
    // Simuler une réponse fetch réussie
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, nom: 'Alice' }),
    });

    const user = await fetchUser(1);

    expect(user).toEqual({ id: 1, nom: 'Alice' });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://api.exemple.com/users/1');
  });

  it('lève une erreur si la réponse n\'est pas ok', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchUser(999)).rejects.toThrow('Utilisateur 999 introuvable');
  });
});

describe('createUser', () => {
  it('envoie un POST avec les bonnes données', async () => {
    const nouveauUser = { nom: 'Bob', email: 'bob@test.com' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 42, ...nouveauUser }),
    });

    const result = await createUser(nouveauUser);

    expect(result.id).toBe(42);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.exemple.com/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(nouveauUser),
      })
    );
  });
});`}</CodeBlock>
      <InfoBox type="danger">
        Ne tombe pas dans le piège d'asserter sur des <strong>détails d'implémentation</strong>. Par
        exemple, tester qu'une fonction interne privée a été appelée avec certains paramètres — c'est
        tester le "comment", pas le "quoi". Si tu refactorises l'implémentation, tous ces tests cassent
        même si le comportement externe n'a pas changé. <strong>Teste le comportement observable</strong> :
        ce que la fonction renvoie, ce qu'elle envoie, les erreurs qu'elle lève. Pas comment elle y arrive
        en interne.
      </InfoBox>

      <h2>Mocks : jest.fn(), jest.spyOn(), jest.mock()</h2>
      <p>
        Les mocks sont l'outil qui te permet d'<em>isoler</em> le code que tu testes. Il y a trois
        niveaux différents selon ce que tu veux faire. <strong><code>jest.fn()</code></strong> crée une
        fonction vide que tu contrôles totalement — c'est le pattern "espion" : tu regardes si la fonction
        a été appelée, combien de fois, avec quels arguments. <strong><code>jest.spyOn()</code></strong>
        fait pareil, mais sur une méthode qui <em>existe déjà</em> dans un objet, en gardant (ou remplaçant)
        son comportement. <strong><code>jest.mock()</code></strong> remplace un module entier.
      </p>
      <p>
        La distinction fondamentale : <code>jest.fn()</code> sans argument crée un espion muet (retourne
        <code>undefined</code>). Ajoute <code>.mockReturnValue(x)</code> pour définir ce qu'il renvoie,
        ou <code>.mockImplementation(fn)</code> pour lui donner un vrai comportement. Tu peux combiner :
        espionner les appels ET contrôler la valeur de retour.
      </p>
      <CodeBlock language="javascript">{`// ── jest.fn() : créer une fonction simulée ──
const maFn = jest.fn();
maFn(42);
maFn('hello');

expect(maFn).toHaveBeenCalledTimes(2);
expect(maFn).toHaveBeenCalledWith(42);
expect(maFn).toHaveBeenLastCalledWith('hello');

// Définir des valeurs de retour
const calculer = jest.fn()
  .mockReturnValueOnce(10)   // 1er appel → 10
  .mockReturnValueOnce(20)   // 2e appel → 20
  .mockReturnValue(0);       // appels suivants → 0

calculer(); // 10
calculer(); // 20
calculer(); // 0

// ── jest.spyOn() : espionner une méthode existante ──
const console_spy = jest.spyOn(console, 'log').mockImplementation(() => {});

maFonction(); // appelle console.log en interne

expect(console_spy).toHaveBeenCalledWith('message attendu');
console_spy.mockRestore(); // restaurer l'original

// ── jest.mock() : mocker un module entier ──
jest.mock('./emailService', () => ({
  envoyerEmail: jest.fn().mockResolvedValue({ sent: true }),
}));

const { envoyerEmail } = require('./emailService');

it('envoie un email à l\'inscription', async () => {
  await inscrireUtilisateur({ email: 'test@test.com' });

  expect(envoyerEmail).toHaveBeenCalledWith(
    expect.objectContaining({ to: 'test@test.com' })
  );
});

// ── Mocker des modules natifs ──
jest.mock('fs');
const fs = require('fs');
fs.readFileSync.mockReturnValue('contenu simulé');`}</CodeBlock>
      <InfoBox type="warning">
        <code>jest.mock()</code> a un comportement subtil et puissant : il est <strong>automatiquement
        hissé (hoisted)</strong> en haut du fichier par Babel, <em>avant</em> même les imports. C'est
        pourquoi tu ne peux pas utiliser de variables locales dans la fonction factory de
        <code>jest.mock()</code> — elles n'existent pas encore au moment où la factory s'exécute.
        Si tu as besoin de variables dans la factory, préfixe-les avec <code>mock</code> (convention
        Jest reconnue par Babel).
      </InfoBox>

      <h2>Hooks : setup et teardown</h2>
      <p>
        Imagine que tu fais des expériences de chimie. Avant chaque expérience, tu nettoies la paillasse
        et tu prépares les réactifs. Après chaque expérience, tu ranges et nettoies à nouveau. Si tu
        sautes le nettoyage, les résidus de l'expérience précédente vont contaminer la suivante —
        et tes résultats seront faux. C'est exactement ce que font <code>beforeEach</code> et{' '}
        <code>afterEach</code> dans Jest.
      </p>
      <p>
        Sans ces hooks, un test qui modifie un état partagé (une variable globale, une base de données,
        un mock) peut influencer les tests suivants. C'est la <strong>pollution entre tests</strong> — un
        bug particulièrement vicieux car un test peut passer quand il est lancé seul, et échouer quand
        il est lancé dans la suite. Toujours nettoyer !
      </p>
      <CodeBlock language="javascript">{`const { MonService } = require('./monService');

describe('MonService', () => {
  let service;

  // Avant CHAQUE test — réinitialise l'état
  beforeEach(() => {
    service = new MonService();
    jest.clearAllMocks(); // vide les compteurs de mocks
  });

  // Après CHAQUE test — nettoyage
  afterEach(() => {
    service.destroy();
  });

  // Une seule fois avant TOUS les tests — setup coûteux
  beforeAll(async () => {
    await database.connect();
  });

  // Une seule fois après TOUS les tests
  afterAll(async () => {
    await database.disconnect();
    jest.restoreAllMocks(); // restaure les spies
  });

  it('est initialisé correctement', () => {
    expect(service.estActif()).toBe(true);
  });

  it('traite une requête', async () => {
    const résultat = await service.traiter({ id: 1 });
    expect(résultat.statut).toBe('ok');
  });
});`}</CodeBlock>
      <InfoBox type="tip">
        Préfère <code>beforeEach</code> à <code>beforeAll</code> chaque fois que c'est possible.
        <code>beforeAll</code> partage l'état entre tous les tests — si un test modifie cet état,
        les suivants peuvent être affectés. <code>beforeEach</code> repart d'un état neuf à chaque fois,
        ce qui rend les tests <em>indépendants</em> et plus fiables. Réserve <code>beforeAll</code> aux
        opérations vraiment coûteuses (connexion DB, serveur de test) où le coût de répétition est prohibitif.
      </InfoBox>

      <h2>Tests asynchrones — ne jamais oublier await</h2>
      <p>
        Les tests asynchrones cachent un piège redoutable pour les débutants. Quand tu écris un test
        qui contient une promesse, Jest doit <em>attendre</em> que cette promesse soit résolue ou
        rejetée avant de décider si le test passe. Si tu oublies le mot-clé <code>await</code> (ou de
        retourner la promesse), Jest finit le test <em>immédiatement</em>, avant que l'opération async
        ne se termine — et le test passera toujours, même si les assertions à l'intérieur de la promesse
        sont fausses. Un <strong>faux positif silencieux</strong>, le pire type de bug.
      </p>
      <CodeBlock language="javascript">{`// async/await — le plus lisible
it('charge les données utilisateur', async () => {
  const user = await fetchUser(1);
  expect(user.nom).toBe('Alice');
  expect(user.id).toBeGreaterThan(0);
});

// Tester une promesse rejetée
it('lève une erreur si l\'utilisateur est introuvable', async () => {
  await expect(fetchUser(999)).rejects.toThrow('Utilisateur non trouvé');
  await expect(fetchUser(999)).rejects.toMatchObject({ message: expect.any(String) });
});

// ❌ PIÈGE : sans await, le test passe toujours (faux positif !)
it('MAUVAIS EXEMPLE — ne jamais faire ça', () => {
  fetchUser(1).then(user => {
    expect(user.nom).toBe('Alice'); // cette assertion est ignorée par Jest !
  });
  // Jest sort ici immédiatement → test "vert" malgré l'assertion fausse
});

// Timeout personnalisé (défaut : 5000ms)
it('opération longue', async () => {
  const résultat = await opérationLente();
  expect(résultat).toBe('terminé');
}, 15000);

// Faux timers — éviter d'attendre vraiment
it('déclenche un callback après 1 seconde', () => {
  jest.useFakeTimers();
  const callback = jest.fn();

  setTimeout(callback, 1000);
  expect(callback).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1000);
  expect(callback).toHaveBeenCalledTimes(1);

  jest.useRealTimers();
});

// Tester setInterval
it('s\'exécute toutes les 500ms', () => {
  jest.useFakeTimers();
  const fn = jest.fn();
  setInterval(fn, 500);

  jest.advanceTimersByTime(2000);
  expect(fn).toHaveBeenCalledTimes(4);

  jest.clearAllTimers();
  jest.useRealTimers();
});`}</CodeBlock>

      <h2>Coverage — mesurer la couverture du code</h2>
      <p>
        La <strong>couverture (coverage)</strong> mesure quelle proportion de ton code est exécutée
        pendant les tests. Jest analyse quatre métriques distinctes. Les <strong>Statements</strong>
        (instructions) comptent chaque ligne de code exécutée. Les <strong>Branches</strong> comptent
        chaque chemin d'un <code>if/else</code> ou d'un ternaire — une branche <code>if</code> a
        deux chemins : le vrai et le faux. Les <strong>Functions</strong> comptent les fonctions
        appelées au moins une fois. Les <strong>Lines</strong> comptent les lignes physiques.
      </p>
      <p>
        Une couverture à 100% ne signifie <em>pas</em> que ton code est sans bugs. Elle signifie
        seulement que chaque ligne a été exécutée au moins une fois. Tu peux exécuter une ligne
        sans vérifier son résultat ! Ce qui compte vraiment, c'est la qualité des <em>assertions</em>,
        pas seulement l'exécution du code. Vise 80% de coverage sur la logique métier critique,
        et ne te bats pas pour couvrir des getters triviaux ou du code de configuration.
      </p>
      <CodeBlock language="bash">{`# Lancer avec coverage
npx jest --coverage

# Rapport généré dans /coverage/lcov-report/index.html
# ┌──────────────┬───────────┬───────────┬───────────┬───────────┐
# │ File         │ % Stmts   │ % Branch  │ % Funcs   │ % Lines   │
# ├──────────────┼───────────┼───────────┼───────────┼───────────┤
# │ math.js      │ 100       │ 100       │ 100       │ 100       │
# │ userService  │ 85.71     │ 75        │ 100       │ 85.71     │
# └──────────────┴───────────┴───────────┴───────────┴───────────┘`}</CodeBlock>
      <p>
        La colonne <strong>Branch (75%)</strong> dans l'exemple ci-dessus indique qu'un chemin
        conditionnel n'est pas testé — probablement le cas d'erreur d'un <code>if (!res.ok)</code>.
        C'est précisément le genre d'indication utile que le coverage fournit : il te montre les
        cas limites que tu n'as pas encore testés, pas juste les lignes "ordinaires".
      </p>
      <InfoBox type="tip">
        Viser <strong>80% de coverage</strong> est un bon objectif. 100% n'est pas toujours rentable —
        concentre-toi sur la logique métier critique, pas sur les getters/setters triviaux.
      </InfoBox>

      <Challenge title="Défi personnel à réaliser : Tester un service de validation">
        Écris les tests Jest complets pour ce service :
        <CodeBlock language="javascript">{`// validator.js
function validerEmail(email) {
  if (typeof email !== 'string') throw new TypeError('email doit être une chaîne');
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function validerUtilisateur(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error('Utilisateur introuvable');
  const user = await res.json();
  if (!validerEmail(user.email)) throw new Error('Email invalide');
  return user;
}

module.exports = { validerEmail, validerUtilisateur };

// validator.test.js — à compléter
// Tester : emails valides/invalides, type incorrect,
// fetch réussi, fetch échoué, email invalide dans la réponse`}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 16,
  title: 'Tests avec Jest',
  icon: '🧪',
  level: 'Avancé',
  stars: '★★★★☆',
  component: Ch25,
  quiz: [
    {
      question: 'Quelle est la différence entre toBe() et toEqual() ?',
      sub: 'Comparaison de valeurs en Jest.',
      options: [
        'Aucune différence',
        'toBe() utilise === (référence), toEqual() compare en profondeur',
        'toEqual() est plus strict que toBe()',
        'toBe() fonctionne seulement pour les nombres',
      ],
      correct: 1,
      explanation: '✅ Exact ! Pense aux jumeaux : toEqual dit "ils se ressemblent" (même contenu), toBe dit "c\'est la même personne" (même référence mémoire). Pour deux objets { a: 1 } créés séparément, toBe échoue (deux objets distincts) mais toEqual passe (même structure). Pour les primitives (nombres, strings), les deux sont équivalents car il n\'y a pas de notion de "référence".',
    },
    {
      question: 'Comment mocker un module entier avec Jest ?',
      sub: 'Isolation des dépendances.',
      options: [
        'jest.spy(\'./module\')',
        'jest.mock(\'./module\')',
        'jest.stub(\'./module\')',
        'jest.replace(\'./module\')',
      ],
      correct: 1,
      explanation: '✅ Exact ! jest.mock(\'./module\') remplace automatiquement toutes les exportations du module par des jest.fn(). Point crucial : Jest hisse (hoist) cet appel en haut du fichier avant les imports, grâce à Babel. C\'est pourquoi tu ne peux pas utiliser des variables locales dans la factory — elles n\'existent pas encore quand la factory s\'exécute.',
    },
    {
      question: 'Comment tester qu\'une fonction async lève une erreur ?',
      sub: 'Assertions sur les promesses rejetées.',
      options: [
        'expect(fn()).toThrow()',
        'try/catch dans le test',
        'await expect(fn()).rejects.toThrow()',
        'expect(await fn()).toThrow()',
      ],
      correct: 2,
      explanation: '💡 La bonne forme est await expect(fn()).rejects.toThrow(). Le await est indispensable : sans lui, Jest termine le test avant que la promesse soit rejetée — et le test passe toujours, même si la fonction ne lève aucune erreur. C\'est un faux positif silencieux, l\'un des bugs les plus traitres en tests async.',
    },
    {
      question: 'Quelle est la différence entre jest.fn() et jest.spyOn() ?',
      sub: 'Mocks et espions en Jest.',
      options: [
        'jest.fn() crée une nouvelle fonction simulée, jest.spyOn() espionne une méthode existante d\'un objet',
        'jest.spyOn() est plus rapide que jest.fn()',
        'jest.fn() ne peut pas enregistrer les appels, jest.spyOn() le peut',
        'Il n\'y a aucune différence pratique entre les deux',
      ],
      correct: 0,
      explanation: '✅ Exact ! jest.fn() crée une fonction simulée entièrement nouvelle, que tu peux utiliser librement comme argument ou dépendance. jest.spyOn(objet, \'methode\') remplace une méthode qui existe déjà sur un objet — tout en conservant (par défaut) son comportement original. Un avantage clé de spyOn : tu peux restaurer l\'implémentation originale avec mockRestore() à la fin du test.',
    },
    {
      question: 'Quelle est la différence entre beforeAll et beforeEach ?',
      sub: 'Hooks de setup en Jest.',
      options: [
        'beforeAll s\'exécute avant chaque test, beforeEach s\'exécute une seule fois',
        'beforeAll s\'exécute une seule fois avant tous les tests du bloc describe, beforeEach s\'exécute avant chaque test individuel',
        'Ils sont équivalents, seul le nom diffère',
        'beforeEach ne peut pas être utilisé avec async/await',
      ],
      correct: 1,
      explanation: '✅ Exact ! beforeAll s\'exécute une seule fois avant l\'ensemble des tests du bloc — utile pour des opérations coûteuses comme ouvrir une connexion de base de données. beforeEach s\'exécute avant chaque test individuel — idéal pour réinitialiser des variables ou des mocks. Préfère beforeEach quand c\'est possible : il garantit l\'indépendance des tests en repartant d\'un état propre à chaque fois.',
    },
    {
      question: 'À quoi sert jest.useFakeTimers() ?',
      sub: 'Contrôle du temps dans les tests.',
      options: [
        'À mesurer la durée d\'exécution d\'un test',
        'À simuler le passage du temps sans attendre réellement, pour tester setTimeout et setInterval',
        'À limiter la durée maximale d\'un test',
        'À remplacer Date.now() par une valeur fixe uniquement',
      ],
      correct: 1,
      explanation: '✅ Exact ! jest.useFakeTimers() remplace setTimeout, setInterval et d\'autres fonctions temporelles par des versions simulées que Jest contrôle. Tu peux ensuite appeler jest.advanceTimersByTime(1000) pour simuler l\'écoulement de 1 000ms instantanément. Sans les faux timers, un test qui attend un setTimeout de 5 secondes ferait littéralement attendre 5 secondes — ce qui ralentirait énormément la suite de tests.',
    },
    {
      question: 'Quel est le rôle de expect.assertions(n) dans un test ?',
      sub: 'Garantir les assertions en tests async.',
      options: [
        'Limiter le nombre maximum d\'assertions autorisées dans un test',
        'Vérifier que exactement n assertions ont été exécutées, pour éviter les faux positifs dans les tests async',
        'Générer automatiquement n assertions à partir d\'un objet',
        'Activer le mode strict de Jest',
      ],
      correct: 1,
      explanation: '✅ Exact ! expect.assertions(n) déclare que le test doit exécuter exactement n assertions. C\'est un filet de sécurité crucial pour les tests asynchrones : si le code async ne s\'exécute jamais (par exemple parce que tu as oublié un await), les assertions à l\'intérieur ne sont jamais atteintes — et le test passe en vert malgré le bug. Avec expect.assertions(2), Jest échoue le test si seulement 0 ou 1 assertion est exécutée.',
    },
    {
      question: 'Pourquoi jest.mock() est-il automatiquement "hissé" (hoisted) en haut du fichier ?',
      sub: 'Comportement de jest.mock() avec Babel.',
      options: [
        'Pour des raisons de performance, Jest compile les mocks en premier',
        'Parce que les modules ES6 sont évalués avant le code du fichier, et les mocks doivent être prêts avant les imports',
        'C\'est un comportement optionnel que tu dois activer dans jest.config.js',
        'Pour permettre l\'utilisation de variables locales dans la factory',
      ],
      correct: 1,
      explanation: '✅ Exact ! Les instructions import ES6 sont évaluées statiquement avant l\'exécution du corps du fichier. Si jest.mock() était exécuté après les imports, le module réel aurait déjà été chargé. Babel transforme jest.mock() pour le hisser avant les imports — ce qui garantit que le module mocké est en place dès le premier import. Conséquence : tu ne peux pas utiliser de variables locales dans la factory de jest.mock() (elles n\'existent pas encore), sauf si tu les préfixes avec "mock".',
    },
  ],
};
