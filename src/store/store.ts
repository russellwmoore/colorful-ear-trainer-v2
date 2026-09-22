import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type CadenceType } from "@/utils/cadences";
import * as Tone from "tone";
import { type KeyCenterType } from "@/utils/noteNames";
import { CADENCE_REGISTRY_MAP } from "@/utils/cadences";
import { transpose } from "@/utils/transpose";
import { synth } from "./synth";
const isDevelopment = process.env.NODE_ENV === "development";

// TODO: Consider slices of state here instead of this blobby thing.

// TODO: Determine where this init should go.
// Possibly at the top level of App in a useEffect on first mount. Then use the onLoad
// callback to change a global state to indicate readiness.

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
  // readonly type is here to satisfy the library that handles the octave slider 🤮
  octaveRange: readonly number[];
  setOctaveRange: (newOctaveRange: readonly number[]) => void;
  synth: typeof synth;
  playCadence: () => Promise<void>;
  isPlayingCadence: boolean;
  setIsPlayingCadence: (isPlaying: boolean) => void;
};

export const useEartrainerStore = create<EarTrainerState>()(
  devtools(
    persist(
      (set, get) => ({
        keyCenter: "C",
        setKeyCenter: (newKey: KeyCenterType) =>
          set({ keyCenter: newKey }, undefined, "setKeyCenter"),
        isKeyCenterRandomized: false,
        setIsKeyCenterRandomized: () =>
          set(
            (state) => ({
              isKeyCenterRandomized: !state.isKeyCenterRandomized,
            }),
            undefined,
            "setRandomized",
          ),
        cadence: "major_1451",
        setCadence: (newCadence: CadenceType) =>
          set({ cadence: newCadence }, undefined, "setCandence"),
        notes: 1,
        setNotes: (numberOfNotes: number) =>
          set({ notes: numberOfNotes }, undefined, "setNotes"),
        timePerNote: 5,
        setTimePerNote: (newTimePerNote: number) =>
          set({ timePerNote: newTimePerNote }, undefined, "setTimePerNote"),
        cadenceEvery: 1,
        setCadenceEvery: (newCadenceEvery: number) =>
          set({ cadenceEvery: newCadenceEvery }, undefined, "setCadenceEvery"),
        octave: 4,
        setOctave: (newOctave: number) =>
          set({ octave: newOctave }, undefined, "setOctave"),
        cadenceTempo: 60,
        setCadenceTempo: (newTempo: number) =>
          set({ cadenceTempo: newTempo }, undefined, "setCadenceTempo"),
        totalTime: 300,
        setTotalTime: (newTotalTime: number) =>
          set({ totalTime: newTotalTime }, undefined, "setTotalTime"),
        octaveRange: [4, 5],
        setOctaveRange: (newOctaveRange: readonly number[]) => {
          set({ octaveRange: newOctaveRange }, undefined, "setOctaveRange");
        },
        synth,
        isPlayingCadence: false,
        setIsPlayingCadence: (isPlaying: boolean) => {
          return set(
            { isPlayingCadence: isPlaying },
            undefined,
            "setIsPlayingCadence",
          );
        },
        playCadence: async () => {
          // Need to wait for Tone to be available
          await Tone.start();
          // Grab all necessary info out of store
          const localSynth = get().synth;
          const progression = get().cadence;
          const keyCenter = get().keyCenter;
          const now = Tone.now();
          const userOctave = get().octave;
          const cadenceTempo = get().cadenceTempo;
          const isCurrentlyPlaying = get().isPlayingCadence;
          const setIsCurrentlyPlaying = get().setIsPlayingCadence;

          // grabs the chord progression from const using the progression from state
          const chords = CADENCE_REGISTRY_MAP[progression];
          const arrOfVoicings = chords.voicings;

          const enrichedArrOfVoicings = arrOfVoicings.map(
            (voicing, i, array) => {
              return {
                sequence: transpose({
                  set: voicing,
                  keyCenter,
                  flatten: false,
                  octave: userOctave,
                  withOctave: true,
                }),
                duration: i === 0 || i === array.length - 1 ? 2 : 1,
              };
            },
          );

          let time = 0;
          if (isCurrentlyPlaying) return;
          setIsCurrentlyPlaying(true);

          enrichedArrOfVoicings.forEach(({ sequence, duration }, i, array) => {
            const durationWithTempo = (duration * 60) / cadenceTempo;
            localSynth.triggerAttackRelease(
              sequence,
              durationWithTempo,
              now + time,
            );
            time += durationWithTempo;
            if (i === array.length - 1) {
              const id = setTimeout(() => {
                setIsCurrentlyPlaying(false);
                return clearTimeout(id);
              }, time * 1000);
            }
          });
        },
      }),
      {
        name: "EarTrainerStore",
        // Only need to store the relevant game state,
        // no need for any functions
        partialize: (state) => ({
          keyCenter: state.keyCenter,
          isKeyCenterRandomized: state.isKeyCenterRandomized,
          cadence: state.cadence,
          notes: state.notes,
          timePerNote: state.timePerNote,
          cadenceEvery: state.cadenceEvery,
          octave: state.octave,
          cadenceTempo: state.cadenceTempo,
          totalTime: state.totalTime,
          octaveRange: state.octaveRange,
        }),
      },
    ),
    // TODO: devtools remain running, but they are not logged when 'enabbled:false',
    // so there is probably a perf hit here. Create a wrapper that has an entirely
    // separate implementation of devtools instead of the "enabled" flag
    { name: "EarTrainerStore", enabled: isDevelopment },
  ),
);
