import { CHAPTERS } from './chapters.js';

let currentChapter = 0;
let completedChapters = new Set();
let xp = 0;
let answeredQuizzes = {};

// ── localStorage ───────────────────────────────────────────────
function saveState() {
  localStorage.setItem('jscours_xp', xp);
  localStorage.setItem('jscours_completed', JSON.stringify([...completedChapters]));
  localStorage.setItem('jscours_quizzes', JSON.stringify(answeredQuizzes));
}

function loadState() {
  xp = parseInt(localStorage.getItem('jscours_xp') || '0');
  const comp = JSON.parse(localStorage.getItem('jscours_completed') || '[]');
  completedChapters = new Set(comp);
  answeredQuizzes = JSON.parse(localStorage.getItem('jscours_quizzes') || '{}');
  document.getElementById('xpCount').textContent = xp;
}

// ── Hash routing ───────────────────────────────────────────────
function chapterIdxFromHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return 0;
  if (hash === 'home') return 0;
  const num = parseInt(hash);
  if (!isNaN(num)) {
    const idx = CHAPTERS.findIndex(ch => ch.id === num);
    return idx !== -1 ? idx : 0;
  }
  return 0;
}

let _skipHashChange = false;

function handleHashChange() {
  if (_skipHashChange) { _skipHashChange = false; return; }
  const idx = chapterIdxFromHash();
  currentChapter = idx;
  renderChapter();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Keyboard navigation ────────────────────────────────────────
function handleKeyNav(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
  if (e.key === 'ArrowRight' && currentChapter < CHAPTERS.length - 1) {
    goToChapter(currentChapter + 1);
  } else if (e.key === 'ArrowLeft' && currentChapter > 0) {
    goToChapter(currentChapter - 1);
  }
}

// ── Nav ────────────────────────────────────────────────────────
function buildNav() {
  const nav = document.getElementById('navList');
  let html = `<div class="nav-section-title">Navigation</div>`;

  const grouped = [
    { label: 'Accueil', items: [0] },
    { label: 'Débutant', items: [1, 2, 3, 4] },
    { label: 'Intermédiaire', items: [5, 6, 7, 8] },
    { label: 'Avancé', items: [9, 10, 11] },
    { label: 'Expert', items: [12, 13] },
    { label: 'Maître 🔥', items: [14, 15] },
    { label: '🔷 TypeScript', items: [16, 17, 18, 19, 20] },
  ];

  grouped.forEach(g => {
    html += `<div class="nav-section-title">${g.label}</div>`;
    g.items.forEach(idx => {
      const ch = CHAPTERS[idx];
      const isActive = idx === currentChapter;
      const isDone = completedChapters.has(idx);
      const isTs = idx >= 16;
      const isMaster = idx === 14 || idx === 15;
      const cls = `nav-item${isActive ? ' active' : ''}${isDone && !isActive ? ' completed' : ''}${isTs ? ' ts-item' : ''}${isMaster ? ' master-item' : ''}`;
      html += `<div class="${cls}" onclick="goToChapter(${idx})">
        <div class="nav-dot"></div>
        <span>${ch.icon} ${ch.title}</span>
      </div>`;
    });
  });

  nav.innerHTML = html;
}

function buildQuiz(quizzes, chapterIdx) {
  if (!quizzes || !quizzes.length) return '';
  return quizzes.map((q, qi) => {
    const key = `${chapterIdx}-${qi}`;
    const answered = answeredQuizzes[key];
    return `
      <div class="quiz-block" id="quiz-${key}">
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-sub">${q.sub}</div>
        <div class="quiz-options">
          ${q.options.map((opt, oi) => `
            <button class="quiz-option${answered !== undefined ? ' disabled' : ''}${answered !== undefined && oi === q.correct ? ' correct' : ''}${answered !== undefined && answered === oi && oi !== q.correct ? ' wrong' : ''}"
              onclick="${answered === undefined ? `answerQuiz('${key}', ${oi}, ${q.correct}, ${chapterIdx})` : ''}">
              <div class="option-letter">${String.fromCharCode(65+oi)}</div>
              ${opt}
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback ${answered !== undefined ? (answered === q.correct ? 'correct-fb show' : 'wrong-fb show') : ''}" id="fb-${key}">
          ${answered !== undefined ? (answered === q.correct ? '✅' : '❌') : ''}
          ${answered !== undefined ? q.explanation : ''}
        </div>
      </div>
    `;
  }).join('');
}

function answerQuiz(key, chosen, correct, chapterIdx) {
  answeredQuizzes[key] = chosen;
  const isCorrect = chosen === correct;

  if (isCorrect) {
    xp += 50;
    document.getElementById('xpCount').textContent = xp;
  }

  const block = document.getElementById(`quiz-${key}`);
  const options = block.querySelectorAll('.quiz-option');
  options.forEach((opt, oi) => {
    opt.classList.add('disabled');
    if (oi === correct) opt.classList.add('correct');
    else if (oi === chosen && oi !== correct) opt.classList.add('wrong');
    opt.onclick = null;
  });

  const fb = document.getElementById(`fb-${key}`);
  const quizIdx = parseInt(key.split('-')[1]);
  const q = CHAPTERS[chapterIdx].quiz[quizIdx];
  fb.className = `quiz-feedback ${isCorrect ? 'correct-fb' : 'wrong-fb'} show`;
  fb.innerHTML = `${isCorrect ? '✅' : '❌'} ${q.explanation}`;

  const ch = CHAPTERS[chapterIdx];
  if (ch.quiz) {
    const allAnswered = ch.quiz.every((_, qi) => answeredQuizzes[`${chapterIdx}-${qi}`] !== undefined);
    if (allAnswered && !completedChapters.has(chapterIdx)) {
      completedChapters.add(chapterIdx);
      xp += 100;
      document.getElementById('xpCount').textContent = xp;
      updateProgress();
      buildNav();
    }
  }

  saveState();
}

function goToChapter(idx) {
  currentChapter = idx;
  _skipHashChange = true;
  window.location.hash = CHAPTERS[idx].id;
  renderChapter();
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderChapter() {
  const ch = CHAPTERS[currentChapter];
  const content = document.getElementById('content');

  document.getElementById('topLabel').textContent = ch.level ? `${ch.level} · ${ch.title}` : ch.title;

  let html = `<div class="chapter active">`;
  html += ch.content();

  if (ch.quiz) {
    html += `<div style="margin-top:48px"><div style="font-family:'Space Mono',monospace;font-size:12px;color:var(--accent2);letter-spacing:3px;margin-bottom:24px;text-transform:uppercase">⚡ Teste tes connaissances</div>`;
    html += buildQuiz(ch.quiz, currentChapter);
    html += `</div>`;
  }

  html += `<div class="nav-buttons">`;
  if (currentChapter > 0) {
    html += `<button class="btn btn-secondary" onclick="goToChapter(${currentChapter - 1})">← Précédent</button>`;
  }
  if (currentChapter < CHAPTERS.length - 1) {
    html += `<button class="btn btn-primary" onclick="goToChapter(${currentChapter + 1})">Suivant →</button>`;
  } else {
    html += `<button class="btn btn-primary" onclick="showCompletion()">🏆 Terminer le cours !</button>`;
  }
  html += `</div></div>`;

  content.innerHTML = html;

  // ── Copy buttons ───────────────────────────────────────────
  content.querySelectorAll('.code-block').forEach(block => {
    const pre = block.querySelector('pre');
    if (!pre) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copier';
    btn.onclick = () => {
      navigator.clipboard.writeText(pre.textContent).then(() => {
        btn.textContent = 'Copié !';
        setTimeout(() => btn.textContent = 'Copier', 2000);
      });
    };
    block.querySelector('.code-header').appendChild(btn);
  });

  buildNav();
}

function showCompletion() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="completion-screen">
      <span class="completion-emoji">🏆</span>
      <h1>Félicitations !<br><span class="highlight">Tu as terminé</span><br>le cours JS !</h1>
      <p class="intro-text" style="margin-top:24px">Tu as accumulé <strong style="color:var(--accent)">${xp} XP</strong> et complété ${completedChapters.size} chapitres sur ${CHAPTERS.length - 1}. De débutant à maître TypeScript — tu as parcouru tout le chemin ! 🚀</p>
      <div style="display:flex;gap:16px;justify-content:center;margin-top:40px">
        <button class="btn btn-primary" onclick="goToChapter(0)">← Recommencer</button>
      </div>
    </div>
  `;
}

function updateProgress() {
  const total = CHAPTERS.length - 1;
  const done = [...completedChapters].filter(i => i > 0).length;
  const pct = (done / total) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = `${done} / ${total} chapitres`;
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

// Expose les fonctions appelées depuis le HTML inline
window.goToChapter = goToChapter;
window.answerQuiz = answerQuiz;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.showCompletion = showCompletion;

// ── Initialisation ─────────────────────────────────────────────
loadState();
currentChapter = chapterIdxFromHash();
document.addEventListener('keydown', handleKeyNav);
window.addEventListener('hashchange', handleHashChange);

export { renderChapter, updateProgress };
