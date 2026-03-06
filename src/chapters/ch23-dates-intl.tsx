import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch23() {
  return (
    <>
      <div className="chapter-tag">Intermédiaire</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-intermediate">📅</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">⭐⭐</div>
          <h3>Dates &amp; Intl</h3>
          <p>Manipuler les dates et formater nombres, devises et dates selon la locale</p>
        </div>
      </div>

      <h2>Créer et lire une date</h2>
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

      <InfoBox type="danger">
        Les mois sont <strong>0-indexés</strong> en JavaScript : janvier = 0, décembre = 11.
        C'est l'un des pièges les plus classiques. Toujours utiliser <code>getMonth() + 1</code>
        pour afficher le mois lisible.
      </InfoBox>

      <h2>Timestamps et calculs de durée</h2>
      <CodeBlock language="javascript">{`// Timestamp en millisecondes
const ts = Date.now();           // ex: 1710504630000
new Date().getTime();            // identique
+new Date();                     // raccourci (coercition)

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
  const result = new Date(date);
  result.setDate(result.getDate() + jours);
  return result;
}
const demain = addDays(new Date(), 1);
const dans30 = addDays(new Date(), 30);`}</CodeBlock>

      <h2>Intl.DateTimeFormat — formater les dates</h2>
      <p>
        L'API <code>Intl</code> formate les dates selon la <strong>locale de l'utilisateur</strong>,
        bien mieux que de construire la chaîne manuellement.
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

// Différentes locales
new Intl.DateTimeFormat('en-US').format(date); // '3/15/2024'
new Intl.DateTimeFormat('de-DE').format(date); // '15.3.2024'
new Intl.DateTimeFormat('ja-JP').format(date); // '2024/3/15'

// Réutiliser le formateur (plus performant)
const fmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' });
const dates = [new Date('2024-01-01'), new Date('2024-06-21')];
dates.map(d => fmt.format(d));
// ['1 janvier 2024', '21 juin 2024']`}</CodeBlock>

      <h2>Intl.NumberFormat — nombres et devises</h2>
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

      <h2>Intl.RelativeTimeFormat — temps relatif</h2>
      <p>
        Génère des formulations comme "il y a 3 jours" ou "dans 2 heures",
        adaptées à la locale.
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

      <h2>Intl.Collator — tri de chaînes</h2>
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

      <InfoBox type="tip">
        Pour les applications en production, préférez une bibliothèque comme <strong>date-fns</strong>{' '}
        ou <strong>Temporal</strong> (la future API native) pour la manipulation de dates complexes.
        L'objet <code>Date</code> natif a des limitations connues (notamment sur les fuseaux horaires).
      </InfoBox>

      <Challenge title="Formateur de durée">
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
  id: 23,
  title: 'Dates & Intl',
  icon: '📅',
  level: 'Intermédiaire',
  stars: '⭐⭐',
  component: Ch23,
  quiz: [
    {
      question: 'Quel mois représente new Date(2024, 0, 15) ?',
      sub: 'Les mois sont 0-indexés en JavaScript.',
      options: ['Décembre', 'Janvier', 'Février', 'Novembre'],
      correct: 1,
      explanation: 'Les mois sont 0-indexés : 0 = janvier, 11 = décembre. new Date(2024, 0, 15) est le 15 janvier 2024.',
    },
    {
      question: 'Que retourne new Intl.DateTimeFormat("fr-FR").format(new Date("2024-03-15")) ?',
      sub: 'Format par défaut de la locale française.',
      options: ['"2024-03-15"', '"March 15, 2024"', '"15/03/2024"', '"15 mars 2024"'],
      correct: 2,
      explanation: 'La locale fr-FR formate les dates au format JJ/MM/AAAA par défaut.',
    },
  ],
};
