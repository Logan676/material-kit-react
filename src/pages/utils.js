export function countBookIds(str) {
  if (!str) {
    return 0;
  }

  const bookIds = str.split(',');
  return bookIds.length;
}
