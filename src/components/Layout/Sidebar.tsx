import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CHAPTERS, GROUPS } from '../../chapters';
import { useProgress } from '../../context/ProgressContext';
import { getChapterId } from '../../utils/routing';
import type { Chapter } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { isCompleted, completedChapters, resetProgress, markCompleted } = useProgress();
  const activeRef = useRef<HTMLAnchorElement>(null);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentId = getChapterId(location.pathname);
  const totalChapters = CHAPTERS.filter(ch => ch.id !== 'home').length;
  const completedCount = CHAPTERS.filter(ch => ch.id !== 'home' && completedChapters.has(ch.id)).length;
  const progress = totalChapters > 0 ? (completedCount / totalChapters) * 100 : 0;

  // Scroll l'élément actif dans la zone visible
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentId]);

  const chapterUrl = (ch: Chapter) => ch.id === 'home' ? '/' : `/chapter/${ch.id}`;

  const handleReset = () => {
    if (window.confirm('Réinitialiser toute la progression ? (XP, chapitres et quizz)')) {
      resetProgress();
    }
  };

  const handleLogoClick = () => {
    logoClickCount.current += 1;
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    if (logoClickCount.current >= 10) {
      logoClickCount.current = 0;
      CHAPTERS.forEach(ch => { if (ch.id !== 'home') markCompleted(ch.id); });
    } else {
      logoClickTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 2000);
    }
  };

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`} aria-label="Navigation du cours">
      <div className="sidebar-header">
        <div className="logo" onClick={handleLogoClick}>JS<span>.</span>procours</div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-text">{completedCount} / {totalChapters} chapitres</div>
      </div>
      <nav className="nav-list">
        {GROUPS.map(group => {
          const items = CHAPTERS.filter(group.filter);
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              <div className="nav-section-title">{group.label}</div>
              {items.map(ch => {
                const active = ch.id === currentId;
                const completed = isCompleted(ch.id);
                let cls = 'nav-item';
                if (active) cls += ' active';
                if (completed) cls += ' completed';
                if (ch.level === 'Bonus TS') cls += ' ts-item';
                if (ch.level === 'Maître') cls += ' master-item';
                return (
                  <Link
                    key={ch.id}
                    to={chapterUrl(ch)}
                    className={cls}
                    onClick={onClose}
                    ref={active ? activeRef : undefined}
                  >
                    <div className="nav-dot" />
                    {ch.icon} {ch.title}
                  </Link>
                );
              })}
            </div>
          );
        })}

        <div className="nav-exam-section">
          <div className="nav-section-title">Validation</div>
          {completedCount === totalChapters ? (
            <Link
              to="/exam"
              className={`nav-item nav-item-exam${location.pathname === '/exam' ? ' active' : ''}`}
              onClick={onClose}
            >
              <div className="nav-dot" />
              🎓 Examen final
            </Link>
          ) : (
            <div className="nav-item-locked" title={`${completedCount}/${totalChapters} chapitres complétés`}>
              🔒 Examen final
            </div>
          )}
        </div>
      </nav>
      <button className="reset-btn" onClick={handleReset}>
        Réinitialiser la progression
      </button>
    </aside>
  );
}
