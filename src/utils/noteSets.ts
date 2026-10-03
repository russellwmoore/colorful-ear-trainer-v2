import {
  IONIAN_INTERVALS,
  AEOLIAN_INTERVALS,
  CHROMATIC_INTERVALS,
} from "./noteNames";
import { CADENCE_REGISTRY_MAP, type CadenceType } from "./cadences";

type Tonality = "major" | "minor";

type NoteSetVariant = {
  pitches: readonly number[];
  baseLabel: string;
  pitchesAdded?: readonly number[];
};

const extend = (base: number[], added: number[]) =>
  [...base, ...added].sort((a, b) => a - b);

// Each note set has a major and a minor version under the same id,
// so the selected note set follows the cadence's tonality.
export const NOTE_SETS = {
  perfect5: {
    major: { pitches: [0, 7], baseLabel: "Perfect 5th" },
    minor: { pitches: [0, 7], baseLabel: "Perfect 5th" },
  },
  triad: {
    major: { pitches: [0, 4, 7], baseLabel: "Triad" },
    minor: { pitches: [0, 3, 7], baseLabel: "Triad" },
  },
  n12345: {
    major: { pitches: [0, 2, 4, 5, 7], baseLabel: "1 2 3 4 5" },
    minor: { pitches: [0, 2, 3, 5, 7], baseLabel: "1 2 3 4 5" },
  },
  n123456: {
    major: { pitches: [0, 2, 4, 5, 7, 9], baseLabel: "1 2 3 4 5 6" },
    minor: { pitches: [0, 2, 3, 5, 7, 8], baseLabel: "1 2 3 4 5 6" },
  },
  diatonic: {
    major: {
      pitches: IONIAN_INTERVALS,
      baseLabel: "Diatonic Scale (Ionian)",
    },
    minor: {
      pitches: AEOLIAN_INTERVALS,
      baseLabel: "Diatonic Scale (Aeolian)",
    },
  },
  "diatonic+1": {
    major: {
      pitches: extend(IONIAN_INTERVALS, [10]),
      pitchesAdded: [10],
      baseLabel: "Diatonic",
    },
    minor: {
      pitches: extend(AEOLIAN_INTERVALS, [11]),
      pitchesAdded: [11],
      baseLabel: "Diatonic",
    },
  },
  "diatonic+2": {
    major: {
      pitches: extend(IONIAN_INTERVALS, [10, 3]),
      pitchesAdded: [10, 3],
      baseLabel: "Diatonic",
    },
    minor: {
      pitches: extend(AEOLIAN_INTERVALS, [11, 4]),
      pitchesAdded: [11, 4],
      baseLabel: "Diatonic",
    },
  },
  "diatonic+3": {
    major: {
      pitches: extend(IONIAN_INTERVALS, [10, 3, 8]),
      pitchesAdded: [10, 3, 8],
      baseLabel: "Diatonic",
    },
    minor: {
      pitches: extend(AEOLIAN_INTERVALS, [11, 4, 9]),
      pitchesAdded: [11, 4, 9],
      baseLabel: "Diatonic",
    },
  },
  "diatonic+4": {
    major: {
      pitches: extend(IONIAN_INTERVALS, [10, 3, 8, 1]),
      pitchesAdded: [10, 3, 8, 1],
      baseLabel: "Diatonic",
    },
    minor: {
      pitches: extend(AEOLIAN_INTERVALS, [11, 4, 9, 6]),
      pitchesAdded: [11, 4, 9, 6],
      baseLabel: "Diatonic",
    },
  },
  chromatic: {
    major: { pitches: CHROMATIC_INTERVALS, baseLabel: "Chromatic" },
    minor: { pitches: CHROMATIC_INTERVALS, baseLabel: "Chromatic" },
  },
  // TODO: Current pitches *could* be copied into the custom pitches in global state to create the same feel as exists in current app
  custom: {
    major: { pitches: [], baseLabel: "Custom" },
    minor: { pitches: [], baseLabel: "Custom" },
  },
} as const satisfies Record<string, Record<Tonality, NoteSetVariant>>;

export type NoteSetId = keyof typeof NOTE_SETS;

// Lil type predicate to make typescript happy for onchange events
export const isNoteSetId = (v: string): v is NoteSetId => v in NOTE_SETS;

// The pitches to guess depend on both the note set and the cadence's tonality
export const getNoteSetPitches = (
  noteSetId: NoteSetId,
  cadence: CadenceType,
): readonly number[] =>
  NOTE_SETS[noteSetId][CADENCE_REGISTRY_MAP[cadence].quality].pitches;
