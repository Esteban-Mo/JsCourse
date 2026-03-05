import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { CHAPTERS } from '../../chapters';

interface LayoutProps {
  children: ReactNode;
}

function getChapterId(pathname: string): number | 'home' {
  if (pathname === '/') return 'home';
  const match = pathname.match(/\/chapter\/(\d+)/);
  return match ? parseInt(match[1], 10) : 'home';
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && nextChapter) {
        navigate(nextChapter.id === 'home' ? '/' : `/chapter/${nextChapter.id}`);
      } else if (e.key === 'ArrowLeft' && prevChapter) {
        navigate(prevChapter.id === 'home' ? '/' : `/chapter/${prevChapter.id}`);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, prevChapter, nextChapter]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const topLabel = currentChapter?.title ?? 'JS.cours';

  return (
    <>
      <div
        className={`overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main">
        <TopBar label={topLabel} onMenuToggle={() => setSidebarOpen(v => !v)} />
        <div className="content">{children}</div>
      </div>
    </>
  );
}
