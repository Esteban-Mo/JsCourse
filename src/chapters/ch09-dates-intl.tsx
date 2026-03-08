import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch23() {
  return (
    <>
      <div className="chapter-tag">Intermédiaire</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-intermediate">📅</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★☆☆</div>
          <h3>Dates &amp; Intl</h3>
          <p>Manipuler les dates et formater nombres, devises et dates selon la locale</p>
        </div>
      </div>

      <h2>L'objet Date — une API célèbre pour ses défauts</h2>
      <p>
        L'objet <code>Date</code> est l'une des parties les plus anciennes et les plus critiquées
        de JavaScript. Il a été conçu en 1995 en seulement dix jours, et ça se voit : les mois
        sont indexés à zéro, les objets <code>Date</code> sont mutables (ce qui cause des bugs
        silencieux), et la gestion des fuseaux horaires est un vrai casse-tête.
      </p>
      <p>
        La bonne nouvelle : l'API <strong>Temporal</strong> est en cours d'intégration native dans
        les navigateurs pour remplacer <code>Date</code> proprement. En attendant, comprendre
        <code>Date</code> reste indispensable — et l'API <code>Intl</code>, elle, est excellente
        dès aujourd'hui pour le formatage.
      </p>

      <h2>L'époque Unix — pourquoi janvier 1970 ?</h2>
      <p>
        JavaScript représente les dates en interne comme un simple nombre : le nombre de
        <strong> millisecondes écoulées depuis le 1er janvier 1970 à 00:00:00 UTC</strong>. On
        appelle ce point de référence l'<strong>époque Unix</strong> (Unix Epoch).
      </p>
      <p>
        Pourquoi 1970 ? C'est une convention héritée du système d'exploitation Unix, qui a choisi
        cette date arbitrairement lors de sa création au début des années 70. Tous les systèmes
        modernes — Linux, macOS, Windows, les bases de données — partagent cette même référence,
        ce qui facilite les échanges de données entre systèmes.
      </p>
      <p>
        Imagine un compteur kilométrique qui repart de zéro le 1er janvier 1970. Une date passée
        (avant 1970) est un nombre négatif, une date future est un grand nombre positif.
        <code>new Date(0)</code> te donne exactement ce point de départ : le 1er janvier 1970.
      </p>

      <h2>Créer et lire une date</h2>

      <p>Il existe plusieurs façons d'instancier un objet <code>Date</code>, mais toutes ne se valent pas. Passer une chaîne de caractères au format ISO est généralement l'approche la plus sûre pour éviter les ambiguïtés liées au fuseau horaire local du navigateur.</p>

      <CodeBlock language="javascript">{`// Date actuelle
const maintenant = new Date();

// Date depuis un timestamp (millisecondes depuis le 1er jan 1970)
const date1 = new Date(0);           // 1970-01-01T00:00:00.000Z
const date2 = new Date(1700000000000);

// Date depuis une chaîne ISO 8601 (recommandé)
const date3 = new Date('2024-03-15');
const date4 = new Date('2024-03-15T14:30:00');

// Date depuis des arguments (attention : mois 0-indexé !)
const date5 = new Date(2024, 2, 15); // 15 mars 2024 (mois=2 car janvier=0)

// Lire les composants
const d = new Date('2024-03-15T14:30:45');
d.getFullYear();   // 2024
d.getMonth();      // 2 (mars, 0-indexé !)
d.getDate();       // 15 (jour du mois)
d.getDay();        // 5 (vendredi, dimanche=0)
d.getHours();      // 14
d.getMinutes();    // 30
d.getSeconds();    // 45`}</CodeBlock>

      <p>
        Remarque la différence entre <code>getDate()</code> (jour du mois, 1 à 31) et{' '}
        <code>getDay()</code> (jour de la semaine, 0 = dimanche à 6 = samedi). Ces noms proches
        avec des comportements très différents sont une source classique de bugs.
      </p>

      <InfoBox type="danger">
        <strong>Le piège des mois 0-indexés.</strong> En JavaScript, janvier = 0 et décembre = 11.
        C'est un héritage direct de Java (qui l'a lui-même hérité du C), et c'est universellement
        reconnu comme une erreur de conception. Le bug classique :{' '}
        <code>new Date(2024, 3, 15)</code> n'est PAS le 3 avril — c'est le 15 <em>avril</em> (mois
        3 = avril). Toujours utiliser <code>getMonth() + 1</code> pour afficher le mois en format
        humain.
      </InfoBox>

      <InfoBox type="danger">
        <strong>Le piège des fuseaux horaires.</strong> Il y a une différence subtile et
        dangereuse entre ces deux lignes :{' '}
        <code>new Date('2024-03-15')</code> est interprétée en <strong>UTC</strong> (minuit UTC),
        mais <code>new Date(2024, 2, 15)</code> est interprétée en <strong>heure locale</strong>.
        Résultat : si tu es en UTC+2, la première date affichée localement sera le 14 mars à 22h,
        pas le 15 mars. Toujours utiliser le format ISO 8601 complet avec fuseau horaire explicite
        pour les dates critiques : <code>'2024-03-15T00:00:00+01:00'</code>.
      </InfoBox>

      <h2>Le format ISO 8601 — la langue commune des dates</h2>
      <p>
        ISO 8601 est la norme internationale pour représenter les dates et heures sous forme de
        chaîne. C'est le format que tu vois partout dans les API REST et les bases de données.
        Il est conçu pour être à la fois lisible par l'humain ET triable alphabétiquement (ce qui
        est pratique pour les bases de données).
      </p>
      <CodeBlock language="javascript">{`// Format ISO 8601 — du plus général au plus précis
'2024'                      // année seulement
'2024-03'                   // année + mois
'2024-03-15'                // date complète (interprétée UTC !)
'2024-03-15T14:30:00'       // date + heure (locale)
'2024-03-15T14:30:00Z'      // date + heure UTC (Z = Zulu = UTC)
'2024-03-15T14:30:00+01:00' // date + heure avec décalage explicite

// Obtenir une chaîne ISO depuis un objet Date
const d = new Date();
d.toISOString(); // '2024-03-15T13:30:00.000Z' (toujours UTC)

// Pourquoi ISO est recommandé ?
// 1. Triable : '2024-03' < '2024-11' ✅ (fonctionne aussi avec sort())
// 2. Universel : compris par tous les systèmes et langages
// 3. Précis : inclut le fuseau horaire, évite les ambiguïtés`}</CodeBlock>

      <h2>Timestamps et calculs de durée</h2>
      <p>
        Un <strong>timestamp</strong> est simplement ce nombre entier de millisecondes depuis
        l'époque Unix. Pourquoi des millisecondes et pas des secondes ? Pour la précision :
        mesurer des durées d'opérations JavaScript ou réseau nécessite souvent une granularité
        inférieure à la seconde.
      </p>
      <p>
        Faire des calculs de durée revient à faire de la soustraction de nombres — c'est l'avantage
        majeur de cette représentation. Comparer deux dates, calculer un âge, mesurer une
        performance : tout ça est une simple différence de nombres.
      </p>
      <CodeBlock language="javascript">{`// Timestamp en millisecondes
const ts = Date.now();           // ex: 1710504630000
new Date().getTime();            // identique
+new Date();                     // raccourci (coercition numérique)

// Mesurer une durée
const début = Date.now();
// ... opération longue ...
const fin = Date.now();
console.log(\`Durée : \${fin - début} ms\`);

// Calculer un intervalle
const naissance = new Date('1995-06-15');
const aujourd = new Date();
const diffMs = aujourd - naissance;          // différence en ms
const diffAns = diffMs / (1000*60*60*24*365.25);
console.log(\`Âge approximatif : \${Math.floor(diffAns)} ans\`);

// Ajouter des jours
function addDays(date, jours) {
  const result = new Date(date); // copie ! sinon on mute l'original
  result.setDate(result.getDate() + jours);
  return result;
}
const demain = addDays(new Date(), 1);
const dans30 = addDays(new Date(), 30);`}</CodeBlock>

      <p>
        Remarque la ligne <code>const result = new Date(date)</code> dans <code>addDays</code>.
        C'est crucial : les objets <code>Date</code> sont <strong>mutables</strong>. Si tu fais
        directement <code>date.setDate(...)</code>, tu modifies la date originale — ce qui est
        souvent un bug difficile à tracer. Toujours créer une copie avant de modifier.
      </p>

      <InfoBox type="warning">
        <strong>L'arithmétique naïve avec les dates peut surprendre.</strong> La formule{' '}
        <code>365.25</code> jours par an est une approximation. Elle ne tient pas compte des années
        bissextiles, des changements d'heure (passage heure d'été/hiver), ni des secondes
        intercalaires. Pour des calculs de dates précis (différence exacte en jours entre deux
        dates, calcul de rendez-vous récurrents…), utilise une bibliothèque dédiée comme{' '}
        <strong>date-fns</strong>.
      </InfoBox>

      <h2>L'API Intl — internationalisation native</h2>
      <p>
        L'<strong>internationalisation</strong> (i18n, car il y a 18 lettres entre "i" et "n")
        désigne l'adaptation d'une application à différentes langues et régions. La{' '}
        <strong>localisation</strong> (l10n) est la mise en œuvre concrète pour une locale
        spécifique.
      </p>
      <p>
        Avant l'API <code>Intl</code>, les développeurs devaient écrire du code complexe pour
        formater "1 234,50 €" correctement en français et "1,234.50 USD" en anglais américain.
        Aujourd'hui, le navigateur fait ce travail nativement — et correctement, avec les règles
        exactes de chaque langue et région, maintenues par l'organisation Unicode.
      </p>

      <h2>Intl.DateTimeFormat — formater les dates</h2>
      <p>
        <code>Intl.DateTimeFormat</code> formate les dates selon la <strong>locale</strong> de
        l'utilisateur. Une locale est une combinaison langue + région : <code>'fr-FR'</code> pour
        le français de France, <code>'fr-CA'</code> pour le français canadien (qui formate
        différemment), <code>'en-US'</code> pour l'anglais américain.
      </p>
      <CodeBlock language="javascript">{`const date = new Date('2024-03-15T14:30:00');

// Format court
new Intl.DateTimeFormat('fr-FR').format(date);
// '15/03/2024'

// Format long
new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
}).format(date);
// 'vendredi 15 mars 2024'

// Avec heure
new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'short', timeStyle: 'short'
}).format(date);
// '15/03/2024 14:30'

// Différentes locales — même date, représentations très différentes
new Intl.DateTimeFormat('en-US').format(date); // '3/15/2024'
new Intl.DateTimeFormat('de-DE').format(date); // '15.3.2024'
new Intl.DateTimeFormat('ja-JP').format(date); // '2024/3/15'

// Réutiliser le formateur (plus performant)
const fmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' });
const dates = [new Date('2024-01-01'), new Date('2024-06-21')];
dates.map(d => fmt.format(d));
// ['1 janvier 2024', '21 juin 2024']`}</CodeBlock>

      <p>
        La création d'un formateur <code>Intl.DateTimeFormat</code> a un coût : le navigateur
        charge les règles de la locale. C'est pourquoi il est fortement recommandé de{' '}
        <strong>créer le formateur une seule fois</strong> et de le réutiliser (comme dans
        l'exemple <code>fmt</code> ci-dessus) plutôt que d'en créer un nouveau à chaque appel dans
        une boucle.
      </p>

      <h2>Intl.NumberFormat — nombres et devises</h2>
      <p>
        Formater un prix correctement selon la locale semble simple, mais c'est un vrai piège :
        la virgule ou le point comme séparateur décimal, le symbole de devise avant ou après le
        nombre, les espaces ou points comme séparateurs de milliers… chaque culture a ses règles.
        <code>Intl.NumberFormat</code> gère tout ça automatiquement.
      </p>
      <CodeBlock language="javascript">{`// Nombre avec séparateurs locaux
new Intl.NumberFormat('fr-FR').format(1234567.89);
// '1 234 567,89'

new Intl.NumberFormat('en-US').format(1234567.89);
// '1,234,567.89'

// Devise
new Intl.NumberFormat('fr-FR', {
  style: 'currency', currency: 'EUR'
}).format(1234.5);
// '1 234,50 €'

new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD'
}).format(1234.5);
// '$1,234.50'

// Pourcentage
new Intl.NumberFormat('fr-FR', {
  style: 'percent', maximumFractionDigits: 1
}).format(0.1567);
// '15,7 %'

// Unités (ES2020)
new Intl.NumberFormat('fr-FR', {
  style: 'unit', unit: 'kilometer-per-hour'
}).format(130);
// '130 km/h'`}</CodeBlock>

      <InfoBox type="tip">
        Tu peux combiner <code>locale: 'fr-FR'</code> avec <code>currency: 'USD'</code> pour
        afficher des dollars américains formatés à la française : <code>'1 234,50 $US'</code>.
        C'est utile pour une app française qui affiche des prix en dollars.
      </InfoBox>

      <h2>Intl.RelativeTimeFormat — temps relatif</h2>
      <p>
        "Il y a 3 jours", "dans 2 heures", "hier" — ces formulations rendent les interfaces bien
        plus naturelles que d'afficher une date complète. <code>Intl.RelativeTimeFormat</code>{' '}
        gère toutes les règles grammaticales selon la langue : le pluriel, les accents, les
        formes spéciales ("hier", "demain", "avant-hier"…).
      </p>
      <CodeBlock language="javascript">{`const rtf = new Intl.RelativeTimeFormat('fr-FR', { numeric: 'auto' });

rtf.format(-1, 'day');    // 'hier'
rtf.format(-3, 'day');    // 'il y a 3 jours'
rtf.format(1, 'day');     // 'demain'
rtf.format(2, 'week');    // 'dans 2 semaines'
rtf.format(-1, 'month');  // 'le mois dernier'

// Fonction utilitaire complète
function tempsRelatif(date) {
  const diff = (date - Date.now()) / 1000; // secondes
  const rtf = new Intl.RelativeTimeFormat('fr-FR', { numeric: 'auto' });

  const unités = [
    { seuil: 60,      unité: 'second', diviseur: 1 },
    { seuil: 3600,    unité: 'minute', diviseur: 60 },
    { seuil: 86400,   unité: 'hour',   diviseur: 3600 },
    { seuil: 2592000, unité: 'day',    diviseur: 86400 },
    { seuil: Infinity,unité: 'month',  diviseur: 2592000 },
  ];

  const { unité, diviseur } = unités.find(u => Math.abs(diff) < u.seuil);
  return rtf.format(Math.round(diff / diviseur), unité);
}

tempsRelatif(new Date(Date.now() - 5000));       // 'il y a 5 secondes'
tempsRelatif(new Date(Date.now() + 3600000));    // 'dans 1 heure'`}</CodeBlock>

      <p>
        L'option <code>{`{ numeric: 'auto' }`}</code> active les formes spéciales ("hier",
        "demain") plutôt que "il y a 1 jour". Avec <code>{`{ numeric: 'always' }`}</code>, tu
        obtiens toujours la forme numérique : "il y a 1 jour" même pour hier.
      </p>

      <h2>Intl.Collator — tri de chaînes avec accents</h2>
      <p>
        Trier des chaînes de caractères avec <code>Array.sort()</code> par défaut utilise l'ordre
        Unicode brut (le code ASCII). Résultat : les lettres accentuées comme "É" ou "à" se
        retrouvent souvent mal placées. C'est acceptable en anglais (peu d'accents), mais
        catastrophique en français. <code>Intl.Collator</code> connaît les règles de tri de chaque
        langue.
      </p>
      <CodeBlock language="javascript">{`// Trier des noms avec accents correctement
const noms = ['Émilie', 'Alice', 'Éric', 'Zoé', 'Antoine'];

// ❌ Sans locale : tri ASCII (É avant a)
noms.sort();
// ['Alice', 'Antoine', 'Zoé', 'Émilie', 'Éric']

// ✅ Avec localeCompare
noms.sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
// ['Alice', 'Antoine', 'Émilie', 'Éric', 'Zoé']

// Comparateur réutilisable (plus performant)
const collator = new Intl.Collator('fr', { sensitivity: 'base' });
noms.sort(collator.compare);`}</CodeBlock>

      <p>
        L'option <code>sensitivity: 'base'</code> signifie que "e", "é", "è" et "ê" sont
        considérés comme la même lettre pour le tri. C'est le comportement attendu par un
        utilisateur français qui cherche "Emile" et s'attend à trouver aussi "Émile".
      </p>

      <InfoBox type="tip">
        Pour les applications sérieuses, préférez <strong>date-fns</strong> (modulaire,
        tree-shakeable, gère les fuseaux horaires) ou attendez l'API <strong>Temporal</strong>{' '}
        (native, immuable, supporte pleinement les fuseaux horaires et calendriers).{' '}
        <code>Temporal</code> est déjà disponible via polyfill et sera standardisée prochainement.
      </InfoBox>

      <Challenge title="Défi personnel à réaliser : Formateur de durée">
        Écris une fonction <code>formatDurée(ms)</code> qui convertit une durée en millisecondes
        en texte lisible : <code>formatDurée(3725000)</code> → <code>"1h 2min 5s"</code>
        <CodeBlock language="javascript">{`function formatDurée(ms) {
  // Votre code ici
}

formatDurée(3725000);  // '1h 2min 5s'
formatDurée(60000);    // '1min 0s'
formatDurée(500);      // '0s'`}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 9,
  title: 'Dates & Intl',
  icon: '📅',
  level: 'Intermédiaire',
  stars: '★★★☆☆',
  component: Ch23,
  quiz: [
    {
      question: 'Quel mois représente new Date(2024, 0, 15) ?',
      sub: 'Les mois sont 0-indexés en JavaScript.',
      options: ['Décembre', 'Janvier', 'Février', 'Novembre'],
      correct: 1,
      explanation: '✅ Exact ! Les mois sont 0-indexés : 0 = janvier, 11 = décembre. C\'est un héritage de Java (lui-même hérité du C), reconnu comme une erreur de conception. new Date(2024, 0, 15) est donc le 15 janvier 2024.',
    },
    {
      question: 'Que retourne new Intl.DateTimeFormat("fr-FR").format(new Date("2024-03-15")) ?',
      sub: 'Format par défaut de la locale française.',
      options: ['"2024-03-15"', '"March 15, 2024"', '"15/03/2024"', '"15 mars 2024"'],
      correct: 2,
      explanation: '✅ Exact ! La locale fr-FR formate les dates au format JJ/MM/AAAA par défaut. L\'API Intl adapte automatiquement le format selon les conventions de chaque pays — pas besoin d\'écrire le formatage manuellement.',
    },
    {
      question: 'Quelle est la différence entre Date.now() et new Date() ?',
      sub: 'Deux façons d\'obtenir l\'instant présent.',
      options: [
        'Date.now() retourne un objet Date, new Date() un nombre',
        'Date.now() retourne un timestamp en millisecondes (nombre), new Date() retourne un objet Date',
        'Ils sont identiques, c\'est juste une syntaxe différente',
        'Date.now() est en secondes, new Date() est en millisecondes',
      ],
      correct: 1,
      explanation: '✅ Exact ! Date.now() retourne un simple nombre entier : le timestamp en millisecondes depuis l\'époque Unix. new Date() retourne un objet Date complet avec toutes ses méthodes (getFullYear, getMonth, etc.). Pour mesurer des durées, Date.now() est préférable car c\'est un nombre qu\'on peut soustraire directement. Pour afficher ou manipuler une date, new Date() est nécessaire.',
    },
    {
      question: 'new Date(2024, 2, 15) représente quelle date ?',
      sub: 'Les mois sont 0-indexés dans le constructeur Date.',
      options: ['Le 15 février 2024', 'Le 15 mars 2024', 'Le 15 avril 2024', 'Le 2 mars 2024'],
      correct: 1,
      explanation: '✅ Exact ! Dans le constructeur new Date(année, mois, jour), le mois est 0-indexé : 0 = janvier, 1 = février, 2 = mars... 11 = décembre. Donc new Date(2024, 2, 15) est bien le 15 mars 2024 (mois 2). C\'est l\'un des pièges les plus courants en JavaScript — toujours se méfier de ce décalage et utiliser getMonth() + 1 pour afficher le mois humainement.',
    },
    {
      question: 'Que retourne new Date().toISOString() ?',
      sub: 'Le format ISO 8601 et la gestion du fuseau horaire.',
      options: [
        'La date en heure locale au format JJ/MM/AAAA',
        'Un timestamp en millisecondes',
        'La date et l\'heure en UTC au format "AAAA-MM-JJTHH:mm:ss.sssZ"',
        'La date en format texte selon la locale du navigateur',
      ],
      correct: 2,
      explanation: '✅ Exact ! toISOString() retourne toujours la date en UTC (temps universel coordonné), peu importe le fuseau horaire local. Le format est "2024-03-15T14:30:00.000Z" où le "Z" final signifie UTC (Zulu time). C\'est le format recommandé pour stocker et échanger des dates dans les API et bases de données, car il est non ambigu et triable alphabétiquement.',
    },
    {
      question: 'Comment formater le nombre 1234.5 en "1 234,50 €" avec l\'API Intl ?',
      sub: 'Intl.NumberFormat pour le formatage de devises.',
      options: [
        'new Intl.CurrencyFormat("fr-FR", { currency: "EUR" }).format(1234.5)',
        'new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(1234.5)',
        '(1234.5).toLocaleCurrencyString("fr-FR", "EUR")',
        'new Intl.DateTimeFormat("fr-FR", { style: "currency" }).format(1234.5)',
      ],
      correct: 1,
      explanation: '✅ Exact ! Intl.NumberFormat avec les options { style: "currency", currency: "EUR" } gère automatiquement : le symbole de devise (€), sa position (après le nombre en français), le séparateur décimal (virgule en fr-FR), le séparateur de milliers (espace fine), et les deux décimales obligatoires. Chaque locale a ses propres règles — en-US donnerait "$1,234.50".',
    },
    {
      question: 'Que fait new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" }).format(-1, "day") ?',
      sub: 'Intl.RelativeTimeFormat et l\'option numeric auto.',
      options: ['"il y a 1 jour"', '"hier"', '"-1 jour"', '"1 journée passée"'],
      correct: 1,
      explanation: '✅ Exact ! Avec { numeric: "auto" }, Intl.RelativeTimeFormat utilise les formes spéciales quand elles existent : -1 jour → "hier", +1 jour → "demain", -1 mois → "le mois dernier". Avec { numeric: "always" }, on obtiendrait toujours la forme numérique : "il y a 1 jour". L\'option auto rend les interfaces plus naturelles et conversationnelles.',
    },
    {
      question: 'Pourquoi Intl.Collator est-il préférable à sort() natif pour trier des mots français ?',
      sub: 'Le tri de chaînes avec accents selon les règles linguistiques.',
      options: [
        'Intl.Collator est plus rapide que le tri natif',
        'sort() natif trie selon l\'ordre Unicode brut, ce qui place les lettres accentuées (É, à) avant ou après les mauvaises lettres',
        'sort() natif ne fonctionne pas avec les chaînes de caractères',
        'Intl.Collator supporte les tableaux de plus de 1000 éléments',
      ],
      correct: 1,
      explanation: '✅ Exact ! sort() sans fonction de comparaison trie selon les points de code Unicode : "É" (code 201) se retrouve bien après "z" (code 122), donnant des résultats absurdes pour du texte français. Intl.Collator("fr") connaît les règles linguistiques françaises et place "Émilie" correctement entre "E..." et "F...", comme un utilisateur l\'attendrait. À utiliser systématiquement pour trier du texte visible par des utilisateurs.',
    },
  ],
};
