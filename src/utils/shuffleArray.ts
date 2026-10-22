/**
 *
 * @param items an array of any type
 * @returns a copy of array with items shuffled
 */
export function shuffleArray<T>(items: T[]) {
  const itemsCopy = items.slice();
  for (let i = itemsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [itemsCopy[i], itemsCopy[j]] = [itemsCopy[j], itemsCopy[i]];
  }
  return itemsCopy;
}
