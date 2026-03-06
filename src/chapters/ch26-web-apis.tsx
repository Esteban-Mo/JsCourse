import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch26() {
  return (
    <>
      <div className="chapter-tag">Avancé</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-advanced">🌍</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★★☆</div>
          <h3>Web APIs modernes</h3>
          <p>IntersectionObserver, ResizeObserver, Clipboard, Performance et plus</p>
        </div>
      </div>

      <h2>Pourquoi ces APIs existent-elles ?</h2>
      <p>
        Pendant longtemps, les développeurs web ont dû résoudre des problèmes récurrents — "est-ce que cet
        élément est visible ?", "est-ce que ce container a changé de taille ?" — avec des techniques
        bricolées et coûteuses en performances. La solution classique pour détecter si un élément est dans
        le viewport était d'écouter l'événement <code>scroll</code>, puis d'appeler{' '}
        <code>getBoundingClientRect()</code> sur chaque élément à chaque défilement. Sur un téléphone
        d'entrée de gamme faisant défiler une liste de 500 images, cela pouvait provoquer des dizaines de
        calculs par seconde, bloquant le fil principal et causant ce qu'on appelle le <strong>
        scroll jank</strong> — ces micro-saccades qui rendent l'interface désagréable.
      </p>
      <p>
        Les APIs modernes comme <code>IntersectionObserver</code>, <code>ResizeObserver</code> et{' '}
        <code>MutationObserver</code> résolvent ces problèmes avec le <strong>patron Observateur</strong> :
        plutôt que d'interroger (polling) le navigateur en permanence, vous vous <em>abonnez</em> à un
        changement. Le navigateur, qui sait exactement quand les choses changent en interne, déclenche
        votre callback uniquement quand nécessaire — sans surcharger le fil principal. C'est la différence
        entre regarder l'heure toutes les secondes et recevoir une notification quand le rendez-vous arrive.
      </p>

      <h2>IntersectionObserver — visibilité dans le viewport</h2>
      <p>
        L'<code>IntersectionObserver</code> observe si un élément "intersecte" (croise) le viewport ou
        un autre conteneur scrollable. Chaque fois que l'élément entre ou sort de la zone visible, votre
        callback reçoit un tableau d'<code>IntersectionObserverEntry</code>, un par élément observé.
      </p>
      <p>
        Deux options sont particulièrement importantes. Le <code>rootMargin</code> fonctionne comme une
        marge CSS invisible autour du viewport : avec <code>'100px'</code>, la zone de détection commence
        100 pixels <em>avant</em> le bord visible — idéal pour précharger des images avant qu'elles ne
        soient visibles. Le <code>threshold</code> répond à la question : "quel pourcentage de l'élément
        doit être visible pour déclencher le callback ?" Un tableau de valeurs comme{' '}
        <code>[0, 0.5, 1]</code> déclenche le callback à chaque franchissement de ces seuils.
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

      <p>
        Notez l'appel à <code>observer.unobserve(img)</code> après le chargement. Une fois qu'une image
        est chargée, il n'y a aucune raison de continuer à la surveiller — ne pas se désabonner causerait
        une fuite mémoire progressive si des centaines d'images sont ajoutées dynamiquement.
      </p>
      <InfoBox type="tip">
        Préférez <strong>IntersectionObserver</strong> aux événements scroll pour 99% des cas "est-ce que
        cet élément est visible ?". La différence de performance est massive : l'IntersectionObserver tourne
        hors du fil principal et ne bloque jamais les animations. Le scroll listener, lui, bloque.
      </InfoBox>

      <h2>ResizeObserver — observer les dimensions</h2>
      <p>
        L'événement <code>window.resize</code> ne se déclenche que lorsque la <em>fenêtre entière</em>{' '}
        change de taille. Mais dans une application moderne pleine de composants flexibles, un container
        peut changer de taille pour de nombreuses autres raisons : un panneau adjacent qui se referme,
        un texte qui s'insère, une image qui se charge. Le <code>ResizeObserver</code> surveille les
        dimensions d'un élément spécifique, indépendamment de la cause du redimensionnement.
      </p>
      <p>
        Cela permet de créer des composants véritablement "container-aware" — l'équivalent de media
        queries CSS, mais basées sur la taille du <em>composant lui-même</em> plutôt que sur la taille
        de la fenêtre. On appelle cela parfois les "container queries en JavaScript".
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

      <InfoBox type="warning">
        Attention aux boucles de redimensionnement. Si votre callback modifie la taille de l'élément
        observé (en changeant sa hauteur par exemple), cela peut déclencher une nouvelle observation,
        puis un nouveau callback, à l'infini. Le navigateur détecte ces boucles et lance une erreur{' '}
        <code>ResizeObserver loop limit exceeded</code> — ce n'est pas fatal mais c'est un bug à corriger.
      </InfoBox>

      <h2>MutationObserver — observer les changements du DOM</h2>
      <p>
        Le <code>MutationObserver</code> surveille les modifications structurelles du DOM en temps réel :
        ajout ou suppression de nœuds, changements d'attributs, modification du contenu textuel. Avant
        son existence (et l'ancienne API <code>DOMNodeInserted</code> qui était synchrone et catastrophique
        pour les performances), les développeurs n'avaient aucun moyen propre de réagir aux mutations
        du DOM qu'ils n'avaient pas eux-mêmes provoquées.
      </p>
      <p>
        Chaque entrée dans le tableau de mutations contient : <code>type</code> ('childList' ou
        'attributes'), <code>target</code> (l'élément modifié), <code>addedNodes</code> et{' '}
        <code>removedNodes</code> (pour les mutations de liste d'enfants), et <code>oldValue</code>
        (l'ancienne valeur de l'attribut ou du texte, si vous l'avez demandée dans les options).
        Les cas d'usage typiques : détecter du contenu injecté par des extensions de navigateur,
        implémenter des polyfills d'éléments personnalisés, ou synchroniser un arbre DOM miroir.
      </p>
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

      <InfoBox type="danger">
        Si votre callback MutationObserver modifie le DOM qu'il observe (par exemple en ajoutant un
        attribut sur un nœud dans le <code>subtree</code> surveillé), cela déclenchera une nouvelle
        mutation, qui appelera à nouveau votre callback — boucle infinie garantie. Utilisez toujours
        un marqueur (<code>data-init="true"</code> dans l'exemple ci-dessus) pour ne traiter chaque
        nœud qu'une seule fois, ou appelez <code>observer.disconnect()</code> avant de modifier le DOM.
      </InfoBox>

      <h2>Clipboard API — copier/coller</h2>
      <p>
        Le presse-papier de votre système contient des informations potentiellement très sensibles :
        mots de passe, numéros de carte bancaire, tokens d'authentification. C'est pourquoi le navigateur
        applique un modèle de sécurité strict à l'API Clipboard. Pour écrire dans le presse-papier, le
        code doit s'exécuter dans un <strong>contexte sécurisé</strong> (HTTPS ou localhost) ET être
        déclenché par un <strong>geste utilisateur récent</strong> (un clic, une frappe clavier). Sans
        ces conditions, l'opération est refusée. Pour <em>lire</em> le presse-papier, une permission
        explicite de l'utilisateur est en plus requise — le navigateur affiche une popup de confirmation.
      </p>
      <p>
        L'API est entièrement basée sur des Promises, ce qui la rend propre à utiliser avec{' '}
        <code>async/await</code>. Elle supporte aussi bien le texte brut que des données structurées
        (images, HTML) via l'interface <code>ClipboardItem</code>.
      </p>
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

      <InfoBox type="tip">
        Le <code>document.execCommand('copy')</code> du fallback est une API dépréciée qui n'est plus
        fiable dans les navigateurs modernes. Si vous ciblez uniquement des navigateurs récents (Chrome
        66+, Firefox 63+), utilisez exclusivement l'API Clipboard moderne. Le fallback n'est utile que
        si vous devez supporter des environnements très anciens ou non-HTTPS.
      </InfoBox>

      <h2>Performance API</h2>
      <p>
        La distinction entre <code>performance.now()</code> et <code>Date.now()</code> est fondamentale
        pour mesurer des durées avec précision. <code>Date.now()</code> lit l'<strong>horloge murale</strong>{' '}
        de votre système — celle que le protocole NTP peut resynchroniser à tout moment, ce qui peut faire
        "reculer" le temps de quelques millisecondes. <code>performance.now()</code>, lui, utilise une
        <strong>horloge monotone haute résolution</strong> : elle ne peut que progresser, elle ne se
        réinitialise jamais, et elle a une précision sub-milliseconde (typiquement ~5 microsecondes).
        Pour mesurer la durée d'une opération, utilisez toujours <code>performance.now()</code>.
      </p>
      <p>
        L'API va plus loin avec les <strong>marks et measures</strong> : vous nommez des points dans
        le temps, puis créez des mesures entre eux. Ces entrées apparaissent dans les DevTools de Chrome
        sous l'onglet Performance, ce qui facilite le profiling visuel de votre code.
      </p>
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

      <InfoBox type="success">
        Les <strong>Core Web Vitals</strong> (LCP, FID, CLS) sont les métriques qu'utilise Google pour
        évaluer la qualité d'expérience d'une page. Le <code>PerformanceObserver</code> vous permet
        de les mesurer directement dans votre code JavaScript, idéal pour les envoyer à votre service
        d'analytics et suivre les performances en production sur de vrais appareils.
      </InfoBox>

      <h2>Geolocation, Web Share, Notifications, Network et Visibility</h2>
      <p>
        Ces APIs restantes couvrent des capacités "device-like" que les applications web ont longtemps
        enviées aux applications natives. Chacune suit le même principe de permission explicite :
        le navigateur demande l'accord de l'utilisateur avant d'exposer des données sensibles comme
        la position GPS ou les notifications système.
      </p>
      <p>
        La <strong>Visibility API</strong> mérite une attention particulière : elle permet de détecter
        si l'onglet est actuellement visible par l'utilisateur. Cela permet d'économiser des ressources
        en pausant les animations, les timers ou les appels réseau quand personne ne regarde la page —
        une pratique courante dans les applications de streaming et les tableaux de bord en temps réel.
      </p>
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

      <InfoBox type="warning">
        La <strong>Web Share API</strong> n'est disponible que sur mobile (Android et iOS) et sur
        macOS 12.1+. Elle n'existe pas sur Chrome Desktop sous Windows/Linux. Vérifiez toujours{' '}
        <code>if (navigator.share)</code> avant d'appeler la méthode, et proposez un fallback
        (copier l'URL dans le presse-papier par exemple) pour les plateformes non supportées.
      </InfoBox>

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
  stars: '★★★★☆',
  component: Ch26,
  quiz: [
    {
      question: 'Quelle API permet de détecter quand un élément entre dans le viewport ?',
      sub: 'Sans écouter l\'événement scroll.',
      options: ['ScrollObserver', 'IntersectionObserver', 'ViewportObserver', 'ResizeObserver'],
      correct: 1,
      explanation: '✅ Exact ! IntersectionObserver est conçu précisément pour détecter la visibilité d\'éléments dans le viewport sans écouter l\'événement scroll. Avant son existence, les développeurs appelaient getBoundingClientRect() à chaque événement scroll, bloquant le fil principal et causant des saccades visuelles (scroll jank).',
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
      explanation: '✅ Exact ! L\'API Clipboard nécessite à la fois un contexte sécurisé (HTTPS ou localhost) ET un geste utilisateur récent (click, keypress). Ces deux conditions sont requises simultanément : le contexte sécurisé protège contre le vol de données en transit, et le geste utilisateur garantit que la page ne copie pas vos données en arrière-plan à votre insu.',
    },
  ],
};
