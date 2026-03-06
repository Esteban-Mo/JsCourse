import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { CHAPTERS } from '../../chapters';
import { getChapterId } from '../../utils/routing';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentId = getChapterId(location.pathname);
  const idx = CHAPTERS.findIndex(ch => ch.id === currentId);
  const currentChapter = idx >= 0 ? CHAPTERS[idx] : null;
  const prevChapter = idx > 0 ? CHAPTERS[idx - 1] : null;
  const nextChapter = idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;

  // Navigation clavier (← →) avec garde sur les champs de saisie
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) return;

      if (e.key === 'ArrowRight' && nextChapter) {
        navigate(nextChapter.id === 'home' ? '/' : `/chapter/${nextChapter.id}`);
      } else if (e.key === 'ArrowLeft' && prevChapter) {
        navigate(prevChapter.id === 'home' ? '/' : `/chapter/${prevChapter.id}`);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, prevChapter, nextChapter]);

  // Scroll en haut à chaque changement de page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Mise à jour du titre de l'onglet
  useEffect(() => {
    document.title = currentChapter
      ? `${currentChapter.title} — JS.procours`
      : 'JS.procours — De Zéro à Maître';
  }, [currentChapter]);

  const topLabel = currentChapter?.title ?? 'JS.procours';

  return (
    <>
      <div
        className={`overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main">
        <TopBar label={topLabel} onMenuToggle={() => setSidebarOpen(v => !v)} />
        <div className="content">{children}</div>
      </div>
      <a
        href="https://www.linkedin.com/in/esteban-mortier/"
        target="_blank"
        rel="noopener noreferrer"
        className="author-credit"
      >
        Esteban Mortier
      </a>
    </>
  );
}
