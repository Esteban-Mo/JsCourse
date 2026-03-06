import { CodeBlock, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch26() {
  return (
    <>
      <div className="chapter-tag">Avancé</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-advanced">🌍</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">⭐⭐⭐</div>
          <h3>Web APIs modernes</h3>
          <p>IntersectionObserver, ResizeObserver, Clipboard, Performance et plus</p>
        </div>
      </div>

      <h2>IntersectionObserver — visibilité dans le viewport</h2>
      <p>
        Détecte quand un élément entre ou sort du viewport <strong>sans polling ni scroll event</strong>.
        Idéal pour le lazy loading d'images, l'infinite scroll ou les animations au défilement.
      </p>
      <CodeBlock language="javascript">{`// Lazy loading d'images
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // charger l'image
      img.classList.remove('lazy');
      observer.unobserve(img);   // arrêter d'observer
    }
  });
}, {
  rootMargin: '100px', // commencer 100px avant l'entrée dans le viewport
  threshold: 0.1,      // déclencher quand 10% est visible
});

document.querySelectorAll('img.lazy').forEach(img => observer.observe(img));

// Animation à l'apparition
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    target.classList.toggle('visible', isIntersecting);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  animObserver.observe(el);
});

// options détaillées
new IntersectionObserver(callback, {
  root: document.querySelector('#scroll-container'), // null = viewport
  rootMargin: '0px 0px -50px 0px', // top right bottom left
  threshold: [0, 0.25, 0.5, 0.75, 1], // plusieurs seuils
});`}</CodeBlock>

      <h2>ResizeObserver — observer les dimensions</h2>
      <p>
        Observe les changements de taille d'un élément. Plus fiable que <code>window.resize</code>
        qui ne détecte pas les redimensionnements d'éléments internes.
      </p>
      <CodeBlock language="javascript">{`const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    console.log(\`Nouvelle taille : \${width}×\${height}\`);

    // Responsive component (comme des media queries en JS)
    if (width < 400) {
      entry.target.classList.add('compact');
    } else {
      entry.target.classList.remove('compact');
    }
  }
});

const container = document.querySelector('#mon-composant');
observer.observe(container);

// Arrêter d'observer
observer.unobserve(container);
observer.disconnect(); // arrêter tous les observers

// Récupérer les dimensions d'un élément sans déclencher reflow
// (alternative à getBoundingClientRect())
new ResizeObserver(([entry]) => {
  // entry.borderBoxSize[0].blockSize = hauteur incluant border
  // entry.contentBoxSize[0].inlineSize = largeur sans border/padding
  const { inlineSize: width } = entry.contentBoxSize[0];
}).observe(element);`}</CodeBlock>

      <h2>MutationObserver — observer les changements du DOM</h2>
      <CodeBlock language="javascript">{`// Observer les modifications du DOM en temps réel
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      console.log('Nœuds ajoutés :', mutation.addedNodes);
      console.log('Nœuds supprimés :', mutation.removedNodes);
    }
    if (mutation.type === 'attributes') {
      console.log(\`Attribut \${mutation.attributeName} modifié\`);
      console.log('Ancienne valeur :', mutation.oldValue);
    }
  }
});

observer.observe(document.body, {
  childList: true,      // surveiller les enfants ajoutés/supprimés
  attributes: true,     // surveiller les changements d'attributs
  subtree: true,        // surveiller tous les descendants
  attributeOldValue: true, // garder l'ancienne valeur
  characterData: true,  // surveiller les changements de texte
});

// Cas d'usage : détecter du contenu injecté dynamiquement
const formObserver = new MutationObserver(() => {
  const nouveauxBoutons = document.querySelectorAll('button:not([data-init])');
  nouveauxBoutons.forEach(btn => {
    btn.addEventListener('click', handler);
    btn.dataset.init = 'true';
  });
});
formObserver.observe(document.getElementById('dynamic-zone'), { childList: true, subtree: true });`}</CodeBlock>

      <h2>Clipboard API — copier/coller</h2>
      <CodeBlock language="javascript">{`// Copier du texte (nécessite HTTPS ou localhost)
async function copier(texte) {
  try {
    await navigator.clipboard.writeText(texte);
    console.log('Copié !');
  } catch (err) {
    // Fallback pour navigateurs anciens
    const el = document.createElement('textarea');
    el.value = texte;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

// Lire le presse-papier (demande permission)
async function lire() {
  try {
    const texte = await navigator.clipboard.readText();
    console.log('Contenu :', texte);
  } catch {
    console.log('Permission refusée');
  }
}

// Copier une image
async function copierImage(blob) {
  await navigator.clipboard.write([
    new ClipboardItem({ [blob.type]: blob })
  ]);
}

// Bouton copier générique
function ajouterBoutonCopie(codeEl) {
  const btn = document.createElement('button');
  btn.textContent = 'Copier';
  btn.onclick = async () => {
    await copier(codeEl.textContent);
    btn.textContent = '✓ Copié';
    setTimeout(() => btn.textContent = 'Copier', 2000);
  };
  codeEl.parentElement.appendChild(btn);
}`}</CodeBlock>

      <h2>Performance API</h2>
      <CodeBlock language="javascript">{`// Mesure précise des performances
performance.mark('début-opération');
// ... opération à mesurer ...
performance.mark('fin-opération');

performance.measure('durée-opération', 'début-opération', 'fin-opération');
const [mesure] = performance.getEntriesByName('durée-opération');
console.log(\`Durée : \${mesure.duration.toFixed(2)}ms\`);

// Navigation timing — temps de chargement de la page
const [nav] = performance.getEntriesByType('navigation');
console.log(\`TTFB : \${nav.responseStart - nav.requestStart}ms\`);
console.log(\`DOM Content Loaded : \${nav.domContentLoadedEventEnd}ms\`);

// Observer les métriques Core Web Vitals
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'LCP') {
      console.log('Largest Contentful Paint :', entry.startTime);
    }
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });

// Mémoire utilisée (Chrome uniquement)
if (performance.memory) {
  const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
  console.log(\`Mémoire : \${(usedJSHeapSize / 1e6).toFixed(1)}MB\`);
}`}</CodeBlock>

      <h2>Autres APIs utiles</h2>
      <CodeBlock language="javascript">{`// Geolocation
navigator.geolocation.getCurrentPosition(
  ({ coords }) => console.log(coords.latitude, coords.longitude),
  (err) => console.error('Refusé :', err.message),
  { timeout: 5000, maximumAge: 60000 }
);

// Web Share API (mobile-first)
if (navigator.share) {
  await navigator.share({
    title: 'Mon article',
    text: 'Lisez cet article incroyable',
    url: window.location.href,
  });
}

// Notifications
const perm = await Notification.requestPermission();
if (perm === 'granted') {
  new Notification('Titre', {
    body: 'Message de la notification',
    icon: '/icon.png',
  });
}

// Network Information (état de la connexion)
console.log(navigator.connection?.effectiveType); // '4g', '3g', etc.
console.log(navigator.onLine); // true/false

// Visibility API (onglet actif ou pas)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauserAnimations();
  else reprendre();
});`}</CodeBlock>

      <Challenge title="Lazy loading maison">
        Implémente un système de lazy loading pour des images avec
        IntersectionObserver. Les images doivent avoir un attribut <code>data-src</code>
        et charger leur vraie source uniquement quand elles sont à moins de
        200px du viewport.
        <CodeBlock language="javascript">{`// HTML : <img data-src="photo.jpg" class="lazy" alt="Photo">

function initLazyLoad() {
  // Votre code ici
}

initLazyLoad();`}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 26,
  title: 'Web APIs modernes',
  icon: '🌍',
  level: 'Avancé',
  stars: '⭐⭐⭐',
  component: Ch26,
  quiz: [
    {
      question: 'Quelle API permet de détecter quand un élément entre dans le viewport ?',
      sub: 'Sans écouter l\'événement scroll.',
      options: ['ScrollObserver', 'IntersectionObserver', 'ViewportObserver', 'ResizeObserver'],
      correct: 1,
      explanation: 'IntersectionObserver est conçu pour détecter efficacement la visibilité d\'éléments dans le viewport (ou un autre conteneur scrollable).',
    },
    {
      question: 'navigator.clipboard.writeText() nécessite quelle condition ?',
      sub: 'Sécurité du navigateur.',
      options: [
        'Une permission utilisateur explicite',
        'HTTPS ou localhost',
        'Un geste utilisateur récent',
        'HTTPS/localhost ET un geste utilisateur récent'
      ],
      correct: 3,
      explanation: 'L\'API Clipboard nécessite à la fois un contexte sécurisé (HTTPS ou localhost) ET un geste utilisateur récent (click, keypress) pour des raisons de sécurité.',
    },
  ],
};
