import { getRandomNumberFromRange } from "./getRandomNumberFromRange";

/**
 * getRandomNotes picks numberOfNotes random notes from notes,
 * each in a random octave from octaveRange.
 *
 * If `numberOfNotes` is larger than notes.length,
 * all notes are returned shuffled.
 *
 * @param {string[]} notes - Note names, ie ["C", "E", "G"]
 * @param {number[]} octaveRange - Octave range [min, max] octaves, inclusive, ie [3, 5]
 * @param {number} numberOfNotes - How many notes to return
 * @returns {string[]} ie ["G4", "C3"]
 */
export function getRandomNotes(
  notes: string[],
  octaveRange: number[],
  numberOfNotes: number,
): string[] {
  const notesCopy = notes.slice();
  // Fisher-Yates shuffle
  for (let i = notesCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [notesCopy[i], notesCopy[j]] = [notesCopy[j], notesCopy[i]];
  }

  const withOctave = notesCopy.map(
    (n) => `${n}${getRandomNumberFromRange(octaveRange)}`,
  );

  return withOctave.slice(0, Math.max(0, numberOfNotes));
}
