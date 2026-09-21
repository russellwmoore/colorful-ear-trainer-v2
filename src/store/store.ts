import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type CadenceType } from "@/utils/cadences";
import * as Tone from "tone";
import { type KeyCenterType } from "@/utils/noteNames";
import { CADENCE_REGISTRY_MAP } from "@/utils/cadences";
import { transpose } from "@/utils/transpose";

// TODO: Consider slices of state here instead of this blobby thing.

// TODO: Determine where this init should go.
// Possibly at the top level of App in a useEffect on first mount. Then use the onLoad
// callback to change a global state to indicate readiness.
const synth = new Tone.Sampler({
  urls: {
    C2: `C2.mp3`,
    G2: `G2.mp3`,
    C3: `C3.mp3`,
    G3: `G3.mp3`,
    C4: `C4.mp3`,
    G4: `G4.mp3`,
    Bb4: `Bb4.mp3`,
    G5: `G5.mp3`,
  },
  baseUrl: "samples/",
}).toDestination();

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
  octaveRange: [number, number];
  synth: typeof synth;
  playCadence: () => void;
  isPlayingCadence: boolean;
  setIsPlayingCadence: (isPlaying: boolean) => void;
};

export const useEartrainerStore = create<EarTrainerState>()(
  devtools(
    (set, get) => ({
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
      cadence: "major_1451",
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
      octaveRange: [4, 5],
      synth,
      isPlayingCadence: false,
      setIsPlayingCadence: (isPlaying: boolean) => {
        return set(
          { isPlayingCadence: isPlaying },
          false,
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

        const enrichedArrOfVoicings = arrOfVoicings.map((voicing, i, array) => {
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
        });

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

    { name: "EarTrainerStore", enabled: true },
  ),
);
