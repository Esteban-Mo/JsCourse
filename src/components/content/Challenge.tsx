import type { ReactNode } from 'react';

interface ChallengeProps {
  title?: string;
  children: ReactNode;
}

export default function Challenge({ title = 'DÉFI PRATIQUE', children }: ChallengeProps) {
  return (
    <div className="challenge-block">
      <div className="challenge-title">⚡ {title}</div>
      {children}
    </div>
  );
}
