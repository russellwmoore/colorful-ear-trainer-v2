import {
  flats,
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
  set: number[] | readonly number[];
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
  set,
  keyCenter,
  octave = 4,
  flatten = true,
  withOctave = false,
}: TransposeType) {
  const keyCenterInt = flats.indexOf(keyCenter);
  return set.map((note: number) => {
    const noteValue = note + keyCenterInt;
    const name = NOTE_SPELLINGS_BY_KEY[keyCenterInt][normalizeIndex(noteValue)];
    const oct = noteValue < 0 && flatten ? octave : octave - 1;
    return withOctave ? `${name}${oct}` : name;
  });
}

// TODO this is not a complete function. Need to determine the best inputs here.
// This could be a good argument for keycenters as numbers!
export function notesAsNumber(set: NoteName[], keyCenter: KeyCenterType) {
  const keyCenterInt = flats.indexOf(keyCenter);
  return set.map((name) => {
    return NOTE_SPELLINGS_BY_KEY[keyCenterInt].indexOf(name);
  });
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
