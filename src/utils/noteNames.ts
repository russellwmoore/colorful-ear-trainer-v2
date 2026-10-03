// Single source of truth: one entry per pitch class, either a natural or a
// [sharp, flat] pair. Everything else is derived from this table.
export const PITCH_CLASSES = [
  "C",
  ["C#", "Db"],
  "D",
  ["D#", "Eb"],
  "E",
  "F",
  ["F#", "Gb"],
  "G",
  ["G#", "Ab"],
  "A",
  ["A#", "Bb"],
  "B",
] as const;

// Tip is to hover over each of these types to
// better understand how each is working.
type PitchClass = (typeof PITCH_CLASSES)[number];
type Natural = Exclude<PitchClass, readonly unknown[]>;
type Accidental = Extract<PitchClass, readonly unknown[]>;

export type SharpName = Natural | Accidental[0];
export type FlatName = Natural | Accidental[1];
export type NoteName = SharpName | FlatName;

// Key centers are spelled with flats (no sharp keys in the UI).
export type KeyCenterType = FlatName;

export const sharps: readonly SharpName[] = PITCH_CLASSES.map((n) =>
  typeof n === "string" ? n : n[0],
);
export const flats: readonly FlatName[] = PITCH_CLASSES.map((n) =>
  typeof n === "string" ? n : n[1],
);

export const allNotes: NoteName[] = PITCH_CLASSES.flat();

// These are the key centers that will display flats or naturals for
// available note sets. All key centers not listed here will be by default
// categorized as sharps
export const flatKeyCenters: Partial<FlatName>[] = [
  "C",
  "Db",
  "Eb",
  "F",
  "Gb",
  "Ab",
  "Bb",
] as const;

export const IONIAN_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
export const AEOLIAN_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
export const CHROMATIC_INTERVALS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
