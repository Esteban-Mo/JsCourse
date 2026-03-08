const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/estmo/Desktop/JsCourse/src/chapters';

const mapping = [
  // old name, new name, old id, new id, old prefix, new prefix
  ['ch21-methodes-tableaux.tsx', 'ch07-methodes-tableaux.tsx', 21, 7, 'ch21', 'ch07'],
  ['ch22-chaines.tsx', 'ch08-chaines.tsx', 22, 8, 'ch22', 'ch08'],
  ['ch23-dates-intl.tsx', 'ch09-dates-intl.tsx', 23, 9, 'ch23', 'ch09'],
  ['ch07-dom.tsx', 'ch10-dom.tsx', 7, 10, 'ch07', 'ch10'],
  ['ch08-regex.tsx', 'ch11-regex.tsx', 8, 11, 'ch08', 'ch11'],
  ['ch09-es6.tsx', 'ch12-es6.tsx', 9, 12, 'ch09', 'ch12'],
  ['ch10-erreurs.tsx', 'ch13-erreurs.tsx', 10, 13, 'ch10', 'ch13'],
  ['ch11-async.tsx', 'ch14-async.tsx', 11, 14, 'ch11', 'ch14'],
  ['ch24-modules-es.tsx', 'ch15-modules-es.tsx', 24, 15, 'ch24', 'ch15'],
  ['ch25-tests-vitest.tsx', 'ch16-tests-vitest.tsx', 25, 16, 'ch25', 'ch16'],
  ['ch26-web-apis.tsx', 'ch17-web-apis.tsx', 26, 17, 'ch26', 'ch17'],
  ['ch12-poo.tsx', 'ch18-poo.tsx', 12, 18, 'ch12', 'ch18'],
  ['ch27-generateurs.tsx', 'ch19-generateurs.tsx', 27, 19, 'ch27', 'ch19'],
  ['ch13-performance.tsx', 'ch20-performance.tsx', 13, 20, 'ch13', 'ch20'],
  ['ch28-algorithmes.tsx', 'ch21-algorithmes.tsx', 28, 21, 'ch28', 'ch21'],
  ['ch14-metaprogrammation.tsx', 'ch22-metaprogrammation.tsx', 14, 22, 'ch14', 'ch22'],
  ['ch15-patterns.tsx', 'ch23-patterns.tsx', 15, 23, 'ch15', 'ch23'],
  ['ch16-ts-bases.tsx', 'ch24-ts-bases.tsx', 16, 24, 'ch16', 'ch24'],
  ['ch17-ts-avance.tsx', 'ch25-ts-avance.tsx', 17, 25, 'ch17', 'ch25'],
  ['ch18-ts-poo.tsx', 'ch26-ts-poo.tsx', 18, 26, 'ch18', 'ch26'],
  ['ch19-ts-decorateurs.tsx', 'ch27-ts-decorateurs.tsx', 19, 27, 'ch19', 'ch27'],
  ['ch20-ts-config.tsx', 'ch28-ts-config.tsx', 20, 28, 'ch20', 'ch28']
];

// Phase 1: Rename old files to a temporary name to avoid conflicts
const renamedToTmp = [];
for (const [oldName, newName, oldId, newId] of mapping) {
  const oldPath = path.join(dir, oldName);
  const tmpPath = path.join(dir, newName + '.tmp');
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, tmpPath);
    renamedToTmp.push({ tmpPath, newName, oldPath, oldId, newId });
  } else {
    console.warn(`File not found: ${oldPath}, maybe already renamed?`);
  }
}

// Phase 2: Rename tmp to actual new names and update ID inside the file
for (const item of renamedToTmp) {
  const newPath = path.join(dir, item.newName);
  fs.renameSync(item.tmpPath, newPath);
  
  // Read file and replace ID
  let content = fs.readFileSync(newPath, 'utf8');
  // Be careful to only replace the ID property of the exported object.
  // We can look for `id: <oldId>,`
  const regex = new RegExp(`id:\\s*${item.oldId}\\s*,`, 'g');
  content = content.replace(regex, `id: ${item.newId},`);
  fs.writeFileSync(newPath, content, 'utf8');
  console.log(`Renamed and updated: ${item.newName}`);
}

// Phase 3: Update home.tsx
const homePath = path.join(dir, 'home.tsx');
if (fs.existsSync(homePath)) {
  let homeContent = fs.readFileSync(homePath, 'utf8');
  // Replace `id: <oldId> }` or `id: <oldId>,`
  for (const [oldName, newName, oldId, newId] of mapping) {
    const rx = new RegExp(`id:\\s*${oldId}\\s*([,}])`, 'g');
    homeContent = homeContent.replace(rx, `id: ${newId}$1`);
  }
  fs.writeFileSync(homePath, homeContent, 'utf8');
  console.log('Updated home.tsx');
}

// Phase 4: Regenerate index.ts because it's easier and safer
const indexTsContent = `import type { Chapter, NavGroup } from '../types';
import { chapter as home } from './home';
import { chapter as ch01 } from './ch01-variables';
import { chapter as ch02 } from './ch02-operateurs';
import { chapter as ch03 } from './ch03-conditions';
import { chapter as ch04 } from './ch04-boucles';
import { chapter as ch05 } from './ch05-fonctions';
import { chapter as ch06 } from './ch06-tableaux-objets';
import { chapter as ch07 } from './ch07-methodes-tableaux';
import { chapter as ch08 } from './ch08-chaines';
import { chapter as ch09 } from './ch09-dates-intl';
import { chapter as ch10 } from './ch10-dom';
import { chapter as ch11 } from './ch11-regex';
import { chapter as ch12 } from './ch12-es6';
import { chapter as ch13 } from './ch13-erreurs';
import { chapter as ch14 } from './ch14-async';
import { chapter as ch15 } from './ch15-modules-es';
import { chapter as ch16 } from './ch16-tests-vitest';
import { chapter as ch17 } from './ch17-web-apis';
import { chapter as ch18 } from './ch18-poo';
import { chapter as ch19 } from './ch19-generateurs';
import { chapter as ch20 } from './ch20-performance';
import { chapter as ch21 } from './ch21-algorithmes';
import { chapter as ch22 } from './ch22-metaprogrammation';
import { chapter as ch23 } from './ch23-patterns';
import { chapter as ch24 } from './ch24-ts-bases';
import { chapter as ch25 } from './ch25-ts-avance';
import { chapter as ch26 } from './ch26-ts-poo';
import { chapter as ch27 } from './ch27-ts-decorateurs';
import { chapter as ch28 } from './ch28-ts-config';

export const CHAPTERS: Chapter[] = [
  home,
  // Débutant
  ch01, ch02, ch03, ch04,
  // Intermédiaire
  ch05, ch06, ch07, ch08, ch09, ch10, ch11,
  // Avancé
  ch12, ch13, ch14, ch15, ch16, ch17,
  // Expert
  ch18, ch19,
  // Expert+
  ch20, ch21,
  // Maître
  ch22, ch23,
  // TypeScript
  ch24, ch25, ch26, ch27, ch28,
];

export const GROUPS: NavGroup[] = [
  { label: 'Accueil',       filter: (ch: Chapter) => ch.id === 'home' },
  { label: 'Débutant',      filter: (ch: Chapter) => ch.level === 'Débutant' },
  { label: 'Intermédiaire', filter: (ch: Chapter) => ch.level === 'Intermédiaire' },
  { label: 'Avancé',        filter: (ch: Chapter) => ch.level === 'Avancé' },
  { label: 'Expert',        filter: (ch: Chapter) => ch.level?.startsWith('Expert') ?? false },
  { label: 'Maître 🔥',     filter: (ch: Chapter) => ch.level === 'Maître' },
  { label: '🔷 TypeScript', filter: (ch: Chapter) => ch.level === 'Bonus TS' },
];
`;
const indexPath = path.join(dir, 'index.ts');
fs.writeFileSync(indexPath, indexTsContent, 'utf8');
console.log('Updated index.ts');
