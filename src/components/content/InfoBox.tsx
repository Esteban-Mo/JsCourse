import type { ReactNode } from 'react';

const ICONS: Record<string, string> = {
  tip: '💡',
  warning: '⚠️',
  danger: '🚫',
  success: '✅',
};

interface InfoBoxProps {
  type: 'tip' | 'warning' | 'danger' | 'success';
  children: ReactNode;
}

export default function InfoBox({ type, children }: InfoBoxProps) {
  return (
    <div className={`info-box ${type}`}>
      <div className="info-icon">{ICONS[type]}</div>
      <p>{children}</p>
    </div>
  );
}
