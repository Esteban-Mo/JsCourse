import { useNavigate, useLocation } from 'react-router-dom';
import { CHAPTERS, GROUPS } from '../../chapters';
import { useProgress } from '../../context/ProgressContext';
import type { Chapter } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function getChapterId(pathname: string): number | 'home' {
  if (pathname === '/') return 'home';
  const match = pathname.match(/\/chapter\/(\d+)/);
  return match ? parseInt(match[1], 10) : 'home';
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCompleted, completedChapters } = useProgress();

  const currentId = getChapterId(location.pathname);
  const totalChapters = CHAPTERS.filter(ch => ch.id !== 'home').length;
  const completedCount = CHAPTERS.filter(ch => ch.id !== 'home' && completedChapters.has(ch.id)).length;
  const progress = totalChapters > 0 ? (completedCount / totalChapters) * 100 : 0;

  const goTo = (ch: Chapter) => {
    navigate(ch.id === 'home' ? '/' : `/chapter/${ch.id}`);
    onClose();
  };

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
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
                  <div key={ch.id} className={cls} onClick={() => goTo(ch)}>
                    <div className="nav-dot" />
                    {ch.icon} {ch.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
