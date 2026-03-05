import { useProgress } from '../../context/ProgressContext';

interface TopBarProps {
  label: string;
  onMenuToggle: () => void;
}

export default function TopBar({ label, onMenuToggle }: TopBarProps) {
  const { xp } = useProgress();
  return (
    <div className="top-bar">
      <button className="menu-toggle" onClick={onMenuToggle} aria-label="Ouvrir le menu">☰</button>
      <span className="chapter-label">{label}</span>
      <div className="xp-badge">⚡ {xp} XP</div>
    </div>
  );
}
