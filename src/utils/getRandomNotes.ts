import { getRandomNumberFromRange } from "./getRandomNumberFromRange";

/**
 * getRandomNotes picks `numberOfNotes` unique notes from `notes` in random order.
 *
 * If `numberOfNotes` is larger than the number of unique notes, all unique notes are returned shuffled.
 *
 * @param {string[]} notes - Note names, ie ["C4", "E4", "G4"]
 * @param {number} numberOfNotes - How many notes to return
 * @returns {string[]} ie ["G4", "C4"]
 */
export function getRandomNotes(
  notes: string[],
  ocataveRange: number[],
  numberOfNotes: number,
): string[] {
  // Fisher-Yates shuffle
  for (let i = notes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [notes[i], notes[j]] = [notes[j], notes[i]];
  }

  const withOctave = notes.map(
    (n) => `${n}${getRandomNumberFromRange(ocataveRange)}`,
  );

  return withOctave.slice(0, Math.max(0, numberOfNotes));
}
