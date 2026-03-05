export default {
  id: 'home',
  title: 'Accueil',
  icon: '🏠',
  level: null,
  content: () => `
    <div class="chapter-tag">Bienvenue</div>
    <h1>Maîtrise<br><span class="highlight">JavaScript</span><br>de A à Z</h1>
    <p class="intro-text">Un cours complet, interactif et progressif. Des fondamentaux aux niveaux maître — avec des quizz pour tester tes connaissances à chaque étape.</p>
    <div class="home-grid">
      ${[
        { emoji:'📦', title:'Les Bases', desc:'Variables, types, portée, hoisting, coercition', chap:'2 chapitres', level:'Débutant', id:1, cls:'' },
        { emoji:'🔄', title:'Contrôle de flux', desc:'Conditions et boucles', chap:'2 chapitres', level:'Débutant', id:3, cls:'' },
        { emoji:'🧩', title:'Fonctions', desc:'Déclarations, flèches, closures', chap:'1 chapitre', level:'Intermédiaire', id:5, cls:'' },
        { emoji:'🗂️', title:'Tableaux & Objets', desc:'Structures de données', chap:'1 chapitre', level:'Intermédiaire', id:6, cls:'' },
        { emoji:'🌐', title:'DOM & Events', desc:'querySelector, événements, formulaires, localStorage', chap:'1 chapitre', level:'Intermédiaire', id:7, cls:'' },
        { emoji:'🔍', title:'Expressions Régulières', desc:'Patterns, groupes, validation, extraction', chap:'1 chapitre', level:'Intermédiaire', id:8, cls:'' },
        { emoji:'⚡', title:'ES6+ Moderne', desc:'Déstructuration, spread, optional chaining', chap:'1 chapitre', level:'Avancé', id:9, cls:'' },
        { emoji:'🚨', title:'Gestion des Erreurs', desc:'try/catch, erreurs custom, re-throw', chap:'1 chapitre', level:'Avancé', id:10, cls:'' },
        { emoji:'🔮', title:'Async JS', desc:'Promises, async/await, fetch', chap:'1 chapitre', level:'Avancé', id:11, cls:'' },
        { emoji:'🏗️', title:'POO & Patterns', desc:'Classes, prototypes, design patterns', chap:'1 chapitre', level:'Expert', id:12, cls:'expert-card' },
        { emoji:'🚀', title:'Performance & V8', desc:'Event loop, optimisations, mémoire', chap:'1 chapitre', level:'Expert+', id:13, cls:'expert-card' },
        { emoji:'🔬', title:'Métaprogrammation', desc:'Proxy, Reflect, Symbols, WeakMap', chap:'1 chapitre', level:'Maître', id:14, cls:'master-card' },
        { emoji:'🧠', title:'Patterns Avancés', desc:'Functional JS, monades, currying', chap:'1 chapitre', level:'Maître', id:15, cls:'master-card' },
        { emoji:'🔷', title:'TypeScript — Bases', desc:'Types, interfaces, unions, génériques', chap:'1 chapitre', level:'Bonus TS', id:16, cls:'ts-card' },
        { emoji:'💎', title:'TypeScript — Avancé', desc:'Utility types, mapped types, infer', chap:'1 chapitre', level:'Bonus TS', id:17, cls:'ts-card' },
        { emoji:'🏛️', title:'TypeScript — POO', desc:'Classes abstraites, type guards, discriminated unions', chap:'1 chapitre', level:'Bonus TS', id:18, cls:'ts-card' },
        { emoji:'🎨', title:'TypeScript — Décorateurs', desc:'Décorateurs, Singleton, Repository, Factory', chap:'1 chapitre', level:'Bonus TS', id:19, cls:'ts-card' },
        { emoji:'⚙️', title:'TypeScript — Config', desc:'tsconfig, strict mode, Vite, ESLint, .d.ts', chap:'1 chapitre', level:'Bonus TS', id:20, cls:'ts-card' },
      ].map(m => `
        <div class="module-card ${m.cls}" onclick="goToChapter(${m.id})">
          <span class="module-emoji">${m.emoji}</span>
          <div class="module-title">${m.title}</div>
          <p class="module-desc">${m.desc}</p>
          <div class="module-chapters">${m.level} · ${m.chap}</div>
        </div>
      `).join('')}
    </div>
  `,
  quiz: null
};
