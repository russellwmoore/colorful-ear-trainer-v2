import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type KeyCenterType =
  | "C"
  | "Db"
  | "D"
  | "Eb"
  | "E"
  | "F"
  | "Gb"
  | "G"
  | "Ab"
  | "A"
  | "Bb"
  | "B";

export type CadenceType =
  | "major,1451"
  | "major,1251"
  | "major,1441"
  | "minor,1451"
  | "minor,14571";

// TODO: Consider slices of state here instead of this blobby thing.
export type EarTrainerState = {
  keyCenter: KeyCenterType;
  setKeyCenter: (newKey: KeyCenterType) => void;
  isKeyCenterRandomized: boolean;
  setIsKeyCenterRandomized: () => void;
  cadence: CadenceType;
  setCadence: (newCadence: CadenceType) => void;
  notes: number;
  setNotes: (newNumberOfNotes: number) => void;
  timePerNote: number;
  setTimePerNote: (newTimePerNote: number) => void;
  cadenceEvery: number;
  setCadenceEvery: (newTimePerNote: number) => void;
  octave: number;
  setOctave: (newOctave: number) => void;
  cadenceTempo: number;
  setCadenceTempo: (newCadence: number) => void;
  totalTime: number;
  setTotalTime: (newTime: number) => void;
};

export const useEartrainerStore = create<EarTrainerState>()(
  devtools(
    (set) => ({
      keyCenter: "C",
      setKeyCenter: (newKey: KeyCenterType) =>
        set({ keyCenter: newKey }, false, "setKeyCenter"),
      isKeyCenterRandomized: false,
      setIsKeyCenterRandomized: () =>
        set(
          (state) => ({ isKeyCenterRandomized: !state.isKeyCenterRandomized }),
          false,
          "setRandomized",
        ),
      cadence: "major,1451",
      setCadence: (newCadence: CadenceType) =>
        set({ cadence: newCadence }, false, "setCandence"),
      notes: 1,
      setNotes: (numberOfNotes: number) =>
        set({ notes: numberOfNotes }, false, "setNotes"),
      timePerNote: 5,
      setTimePerNote: (newTimePerNote: number) =>
        set({ timePerNote: newTimePerNote }, false, "setTimePerNote"),
      cadenceEvery: 1,
      setCadenceEvery: (newCadenceEvery: number) =>
        set({ cadenceEvery: newCadenceEvery }, false, "setCadenceEvery"),
      octave: 4,
      setOctave: (newOctave: number) =>
        set({ octave: newOctave }, false, "setOctave"),
      cadenceTempo: 60,
      setCadenceTempo: (newTempo: number) =>
        set({ cadenceTempo: newTempo }, false, "setCadenceTempo"),
      totalTime: 300,
      setTotalTime: (newTotalTime: number) =>
        set({ totalTime: newTotalTime }, false, "setTotalTime"),
    }),
    { name: "EarTrainerStore", enabled: true },
  ),
);
