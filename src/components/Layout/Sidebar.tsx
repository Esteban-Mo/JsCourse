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
  const { isCompleted, completedChapters, resetProgress } = useProgress();
  const activeRef = useRef<HTMLAnchorElement>(null);

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

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`} aria-label="Navigation du cours">
      <div className="sidebar-header">
        <div className="logo">JS<span>.</span>cours</div>
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
      </nav>
      <button className="reset-btn" onClick={handleReset}>
        Réinitialiser la progression
      </button>
    </aside>
  );
}
