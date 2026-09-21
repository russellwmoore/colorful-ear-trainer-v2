type Chord = number[]; // semitone offsets from the key center
type CadenceVoicings = [Chord, Chord, Chord, Chord];

type CadenceDef = {
  quality: "major" | "minor";
  progression: number;
  label: string;
  voicings: CadenceVoicings;
};

// Add new cadences here and they will automatically
// be added to the dropdown, grouped by quality

export const CADENCE_REGISTRY_MAP = {
  major_1451: {
    quality: "major",
    progression: 1451,
    label: "I IV V I",
    voicings: [
      [-12, 0, 4, 7],
      [-7, 0, 5, 9],
      [-5, 2, 7, 11],
      [-12, 0, 4, 7],
    ],
  },
  major_1251: {
    quality: "major",
    progression: 1251,
    label: "I ii7 V7 I",
    voicings: [
      [-12, 0, 4, 7],
      [-10, 2, 5, 9, 12],
      [-5, 2, 5, 11, 14],
      [-12, 0, 4, 7, 11],
    ],
  },
  major_1441: {
    quality: "major",
    progression: 1441,
    label: "I IV iv I",
    voicings: [
      [-12, 0, 4, 7],
      [-7, 0, 5, 9],
      [-7, 0, 5, 8],
      [-12, 0, 4, 7],
    ],
  },
  minor_1451: {
    quality: "minor",
    progression: 1451,
    label: "i iv v i",
    voicings: [
      [-12, 0, 3, 7],
      [-7, 0, 5, 8],
      [-5, 2, 7, 10],
      [-12, 0, 3, 7],
    ],
  },
  minor_14571: {
    quality: "minor",
    progression: 14571,
    label: "i iv V7 i",
    voicings: [
      [0, 3, 7, 12],
      [-7, 0, 8, 12],
      [-5, 2, 7, 11],
      [-12, 0, 3, 7],
    ],
  },
} as const satisfies Record<string, CadenceDef>;

export type CadenceType = keyof typeof CADENCE_REGISTRY_MAP;
export type CadenceInfo = (typeof CADENCE_REGISTRY_MAP)[CadenceType];

// Typeguard to make things extratight
export const isCadenceType = (v: string): v is CadenceType =>
  v in CADENCE_REGISTRY_MAP;
