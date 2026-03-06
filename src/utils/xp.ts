export interface Rank {
  label: string;
  color: string;
  min: number;
}

// Seuils calibrés pour ~60 quizz × 25 XP = 1500 XP max
export const RANKS: Rank[] = [
  { min: 0,   label: 'Stagiaire',  color: '#6b6b8a' },
  { min: 50,  label: 'Junior',     color: '#4af7a8' },
  { min: 200, label: 'Senior',     color: '#7c6af7' },
  { min: 400, label: 'Lead',       color: '#f7c948' },
  { min: 700, label: 'Architecte', color: '#f78c4a' },
];

export function getRank(xp: number): Rank {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.min) rank = r;
  }
  return rank;
}
