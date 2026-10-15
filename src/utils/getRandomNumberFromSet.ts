export function getRandomNumberFromSet(set: [number, number]) {
  const min = set[0];
  const max = set[1];

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
