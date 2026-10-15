import {
  flats,
  PITCH_CLASS_MAP,
  sharps,
  type FlatName,
  type KeyCenterType,
  type NoteName,
} from "./noteNames";

const NOTE_SPELLINGS_BY_KEY: (readonly NoteName[])[] = [
  flats,
  flats,
  sharps,
  flats,
  sharps,
  flats,
  flats,
  sharps,
  flats,
  sharps,
  flats,
  sharps,
];

type TransposeType = {
  // readonly for types
  arrOfNoteNumbers: number[] | readonly number[];
  keyCenter: FlatName;
  octave?: number;
  flatten?: boolean;
  withOctave?: boolean;
};

/**
 * transpose takes in array of scale degrees and applies a keyCenter as the scale degree `0` and returns the corresponding note names for all other intervals.
 *
 * The octave flag is useful for sending a desired sequence with octaves intact to the synth.
 *
 * @param {number []} set - An array of note degrees in half steps. 0 is keycenter
 * @param {FlatName} keyCenter - One of 12 key centers. All accidentals defined as flats. ie "C", "Bb", "Eb"
 * @returns {string[]} An array of actual note names ["C", "E", "A#", "Gb"]. Sharps and Flats are decided by keyCenter
 */

// TODO: investigate flatten more. How will this be used?
export function transpose({
  arrOfNoteNumbers,
  keyCenter,
  octave = 4,
  flatten = true,
  withOctave = false,
}: TransposeType) {
  const keyCenterInt = flats.indexOf(keyCenter);
  return arrOfNoteNumbers.map((note: number) => {
    const noteValue = note + keyCenterInt;
    const name = NOTE_SPELLINGS_BY_KEY[keyCenterInt][normalizeIndex(noteValue)];
    const oct = noteValue < 0 && flatten ? octave : octave - 1;
    return withOctave ? `${name}${oct}` : name;
  });
}

/**
 * This function takes a key center and a notename and returns the corresponding scale degree number
 * @param set A note name like G, A, Eb, C#
 * @param keyCenter
 * @returns
 */
export function notesAsNumber(set: NoteName, keyCenter: KeyCenterType) {
  return normalizeIndex(PITCH_CLASS_MAP[set] - PITCH_CLASS_MAP[keyCenter]);
}

export function normalizeIndex(i: number) {
  return ((i % 12) + 12) % 12;
}

export function numbersToNotes(keyCenter: KeyCenterType, arrOfNotes: number[]) {
  const offsetKeyIndex = flats.indexOf(keyCenter);
  return arrOfNotes.map((note) => {
    const normalizedIndex = Math.abs((note + offsetKeyIndex) % 12);
    return flats[normalizedIndex];
  });
}
