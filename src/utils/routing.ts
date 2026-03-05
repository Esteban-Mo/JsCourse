export function getChapterId(pathname: string): number | 'home' {
  if (pathname === '/') return 'home';
  const match = pathname.match(/\/chapter\/(\d+)/);
  return match ? parseInt(match[1], 10) : 'home';
}
