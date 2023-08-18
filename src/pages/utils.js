export const imageHost = 'http://localhost:5555';

export function countBookIds(str) {
  if (!str) {
    return 0;
  }

  const bookIds = str.split(',');
  return bookIds.length;
}
