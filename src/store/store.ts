import { create } from "zustand";
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

type EarTrainerState = {
  keyCenter: KeyCenterType;
  setKeyCenter: (newKey: KeyCenterType) => void;
  isKeyCenterRandomized: boolean;
  setIsKeyCenterRandomized: () => void;
};

export const useEartrainerStore = create<EarTrainerState>()((set) => ({
  keyCenter: "C",
  setKeyCenter: (newKey: KeyCenterType) => set({ keyCenter: newKey }),
  isKeyCenterRandomized: false,
  setIsKeyCenterRandomized: () =>
    set((state) => ({ isKeyCenterRandomized: !state.isKeyCenterRandomized })),
}));
