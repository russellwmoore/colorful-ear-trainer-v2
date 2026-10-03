import {
  flats,
  sharps,
  type FlatName,
  type KeyCenterType,
  type NoteName,
} from "./noteNames";

const notes: (readonly NoteName[])[] = [
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
    const name = notes[keyCenterInt][normalizeIndex(noteValue)];
    const oct = noteValue < 0 && flatten ? octave : octave - 1;
    return withOctave ? `${name}${oct}` : name;
  });
}

// TODO this is not a complete function. Need to determine the best inputs here.
// This could be a good argument for keycenters as numbers!
export function notesAsNumber(set: NoteName[], keyCenter: KeyCenterType) {
  const keyCenterInt = flats.indexOf(keyCenter);
  return set.map((name) => {
    return notes[keyCenterInt].indexOf(name);
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
