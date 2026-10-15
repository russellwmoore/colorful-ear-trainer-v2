import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type CadenceType } from "@/utils/cadences";
import * as Tone from "tone";
import { type KeyCenterType, type NoteName } from "@/utils/noteNames";
import { CADENCE_REGISTRY_MAP } from "@/utils/cadences";
import { type NoteSetId, NOTE_SETS } from "@/utils/noteSets";
import { transpose } from "@/utils/transpose";
import { synth } from "./synth";
import { Countdown } from "./countdownTimer";
import { useTimerStore } from "./timerStore";
import { Countup } from "./countupStopwatch";
import { getRandomNumberFromSet } from "@/utils/getRandomNumberFromSet";
import { notesAsNumber } from "@/utils/transpose";
import { playNotes } from "@/utils/playNotes";

// TODO: need a file of consts for config
const INITIAL_GAME_TIME_DURATION = 5 * 60 * 1000;
// Pause after a correct answer so the note rings before the next question
const CORRECT_FEEDBACK_MS = 600;
const isDevelopment = process.env.NODE_ENV === "development";

// TODO: Consider slices of state here instead of this blobby thing.

// TODO: Determine where this init should go.
// Possibly at the top level of App in a useEffect on first mount. Then use the onLoad
// callback to change a global state to indicate readiness.

export type GameStatus = "idle" | "playing" | "paused";

export type EarTrainerState = {
  keyCenter: KeyCenterType;
  setKeyCenter: (newKey: KeyCenterType) => void;
  isKeyCenterRandomized: boolean;
  setIsKeyCenterRandomized: () => void;
  cadence: CadenceType;
  setCadence: (newCadence: CadenceType) => void;
  amountOfnotesToGuess: number;
  setAmountOfNotesToGuess: (newNumberOfNotes: number) => void;
  timePerNote: number;
  setTimePerNote: (newTimePerNote: number) => void;
  cadenceEvery: number;
  setCadenceEvery: (newTimePerNote: number) => void;
  octave: number;
  setOctave: (newOctave: number) => void;
  cadenceTempo: number;
  setCadenceTempo: (newCadence: number) => void;
  // totalTime in ms
  totalInitialGameTime: number;
  setTotalInitialGameTime: (newTime: number) => void;
  // readonly type is here to satisfy the library that handles the octave slider 🤮
  octaveRange: readonly number[];
  setOctaveRange: (newOctaveRange: readonly number[]) => void;
  playCadence: () => Promise<void>;
  isPlayingAudio: boolean;
  setIsPlayingAudio: (isPlaying: boolean) => void;
  gameStatus: GameStatus;
  togglePlay: () => void;
  startGame: () => Promise<void>;
  pauseGame: () => void;
  resumeGame: () => Promise<void>;
  resetTimerToInitialValue: () => void;
  noteSetId: NoteSetId;
  setNoteSetId: (noteSetId: NoteSetId) => void;
  customNoteSet: number[] | null;
  setCustomNoteSet: (newNoteSet: number[]) => void;
  // user guesses
  submitGuess: (guess: number) => boolean;
  currentGuesses: number[];
  resetCurrentGuesses: () => void;
  isAnsweringEnabled: boolean;
  setIsAnsweringEnabled: (isAnswering: boolean, origin: string) => void;
  playNotesToGuess: () => Promise<void>;
  notesToGuess: string[];
  setNotesToGuess: () => void;
  resetPianoKeys: (() => void) | null;
  setResetPianoKeys: (cb: (() => void) | null) => void;
  playCount: number;
  increasePlayCount: () => void;
  playTheGame: () => Promise<void>;
};

/**
 * All time is stored as milliseconds. Use utility functions for displays
 */
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
        amountOfnotesToGuess: 1,
        setAmountOfNotesToGuess: (numberOfNotes: number) =>
          set(
            { amountOfnotesToGuess: numberOfNotes },
            undefined,
            "setAmountOfNotesToGuess",
          ),
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
        totalInitialGameTime: INITIAL_GAME_TIME_DURATION,
        setTotalInitialGameTime: (newTotalTimeInMs: number) => {
          // if the user is playing, don't set this time here on the countdown object.
          if (get().gameStatus === "idle") {
            countdown.setDuration(newTotalTimeInMs);
          }
          set(
            { totalInitialGameTime: newTotalTimeInMs },
            undefined,
            "totalInitialGameTime",
          );
        },
        octaveRange: [4, 5],
        setOctaveRange: (newOctaveRange: readonly number[]) => {
          set({ octaveRange: newOctaveRange }, undefined, "setOctaveRange");
        },
        synth,
        isPlayingAudio: false,
        setIsPlayingAudio: (isPlaying: boolean) => {
          set({ isPlayingAudio: isPlaying }, undefined, "setIsPlayingAudio");
        },

        playCadence: async () => {
          await Tone.start();

          const {
            cadence,
            keyCenter,
            octave,
            cadenceTempo,
            isPlayingAudio,
            setIsPlayingAudio,
          } = get();

          if (isPlayingAudio) return;

          const arrOfVoicings = CADENCE_REGISTRY_MAP[cadence].voicings;

          const enrichedArrOfVoicings = arrOfVoicings.map(
            (voicing, i, array) => {
              return {
                sequence: transpose({
                  arrOfNoteNumbers: voicing,
                  keyCenter,
                  flatten: false,
                  octave,
                  withOctave: true,
                }),
                duration: i === 0 || i === array.length - 1 ? 2 : 1,
              };
            },
          );

          setIsPlayingAudio(true);
          await playNotes({
            notes: enrichedArrOfVoicings,
            cadenceTempo,
          });
          setIsPlayingAudio(false);
        },
        gameStatus: "idle",
        togglePlay: () => {
          const { gameStatus, startGame, pauseGame, resumeGame } = get();
          if (gameStatus === "playing") pauseGame();
          else if (gameStatus === "paused") void resumeGame();
          else void startGame();
        },
        startGame: async () => {
          set(
            { gameStatus: "playing", playCount: 0, currentGuesses: [] },
            undefined,
            "startGame",
          );
          countdown.start();
          await get().playTheGame();
        },
        pauseGame: () => {
          countdown.pause();
          countup.pause();
          // Only silences notes already sounding; chords scheduled ahead by
          // playNotes will still play
          synth.releaseAll();
          set(
            { gameStatus: "paused", isAnsweringEnabled: false },
            undefined,
            "pauseGame",
          );
        },
        // Picks up the current question rather than asking a new one
        resumeGame: async () => {
          const { playNotesToGuess, setIsAnsweringEnabled } = get();
          set({ gameStatus: "playing" }, undefined, "resumeGame");
          countdown.start();
          await playNotesToGuess();
          if (get().gameStatus !== "playing") return;
          countup.start();
          setIsAnsweringEnabled(true, "resumeGame");
        },
        resetTimerToInitialValue: () => {
          countup.pause();
          // setDuration also refills timeRemaining, which start() needs above 0
          countdown.setDuration(get().totalInitialGameTime);
          set(
            { gameStatus: "idle", isAnsweringEnabled: false },
            undefined,
            "resetTimerToInitialValue",
          );
        },
        noteSetId: "perfect5" as const,
        setNoteSetId: (noteSetId: NoteSetId) => {
          set({ noteSetId, customNoteSet: null }, undefined, "setNoteSetId");
        },
        customNoteSet: null,
        setCustomNoteSet: (newNoteSet: number[]) =>
          set(
            {
              customNoteSet: newNoteSet,
              noteSetId: "custom",
            },
            undefined,
            "setCustomNoteSet",
          ),

        currentGuesses: [],
        // Records a guess and returns whether it was correct. Once every note has
        // been guessed, starts the next question after a short pause.
        submitGuess: (guess: number) => {
          const {
            notesToGuess,
            keyCenter,
            currentGuesses,
            playCount,
            playTheGame,
          } = get();

          // this regex smells bad. perhaps a different pattern to store guesses is needed?
          const notesToGuessAsScaleDegrees = notesToGuess.map((note) =>
            notesAsNumber(note.replace(/\d$/, "") as NoteName, keyCenter),
          );

          const guesses = [...currentGuesses, guess];
          const isCorrect = notesToGuessAsScaleDegrees.includes(guess);
          const isComplete = notesToGuessAsScaleDegrees.every((correctNote) =>
            guesses.includes(correctNote),
          );

          if (isComplete) {
            set(
              {
                currentGuesses: [],
                isAnsweringEnabled: false,
                playCount: playCount + 1,
              },
              undefined,
              "submitGuess-complete",
            );
            setTimeout(() => {
              if (get().gameStatus === "playing") void playTheGame();
            }, CORRECT_FEEDBACK_MS);
          } else {
            set({ currentGuesses: guesses }, undefined, "submitGuess");
          }

          return isCorrect;
        },

        resetCurrentGuesses: () => {
          set({ currentGuesses: [] }, undefined, "resetCurrentGuesses");
        },

        isAnsweringEnabled: false,
        setIsAnsweringEnabled: (isAnsweringEnabled: boolean, origin: string) =>
          set(
            { isAnsweringEnabled },
            undefined,
            `setIsAnsweringEnabled-${origin}`,
          ),
        notesToGuess: [],
        setNotesToGuess: () => {
          // TODO: weights and all that
          const { noteSetId, cadence, keyCenter, octaveRange } = get();
          const tonality = CADENCE_REGISTRY_MAP[cadence].quality;
          const pitches = NOTE_SETS[noteSetId][tonality].pitches;
          const pitchesAsNotes = transpose({
            arrOfNoteNumbers: pitches,
            keyCenter,
          });

          // TODO: adapt to take chords. Stretch to take sequence of chords
          const randomPitch =
            pitchesAsNotes[Math.floor(Math.random() * pitchesAsNotes.length)];

          // typescript angry, need [n,n] cast here
          const octave = getRandomNumberFromSet(
            octaveRange as [number, number],
          );

          set(
            { notesToGuess: [`${randomPitch}${octave}`] },
            undefined,
            "setNotesToGuess",
          );
        },
        playNotesToGuess: async () => {
          await Tone.start();
          const { setIsPlayingAudio, notesToGuess } = get();
          setIsPlayingAudio(true);
          await playNotes({
            notes: [{ sequence: notesToGuess, duration: 2 }],
            cadenceTempo: 60,
          });
          setIsPlayingAudio(false);
        },
        resetPianoKeys: null,
        setResetPianoKeys: (cb) =>
          set({ resetPianoKeys: cb }, undefined, "setResetPianoKeys"),
        playCount: 0,
        increasePlayCount: () => {
          const currentPlayCount = get().playCount;
          set({ playCount: currentPlayCount + 1 });
        },
        playTheGame: async () => {
          const {
            setNotesToGuess,
            cadenceEvery,
            playCount,
            playCadence,
            playNotesToGuess,
            setIsAnsweringEnabled,
          } = get();
          setNotesToGuess();

          const shouldPlayCadence = playCount % cadenceEvery === 0;

          // The player can pause while audio plays, so bail out after each await
          // this should get the most up to date value here, and not destructured at top of function
          const isStillPlaying = () => get().gameStatus === "playing";

          if (shouldPlayCadence) {
            await playCadence();
            if (!isStillPlaying()) return;
          }
          // Read fresh: Piano can re-register this callback while audio plays
          get().resetPianoKeys?.();
          await playNotesToGuess();
          if (!isStillPlaying()) return;

          countup.start();
          setIsAnsweringEnabled(true, "playTheGame");
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
          amountOfnotesToGuess: state.amountOfnotesToGuess,
          timePerNote: state.timePerNote,
          cadenceEvery: state.cadenceEvery,
          octave: state.octave,
          cadenceTempo: state.cadenceTempo,
          totalInitialGameTime: state.totalInitialGameTime,
          octaveRange: state.octaveRange,
          noteSetId: state.noteSetId,
        }),
      },
    ),
    // TODO: devtools remain running, but they are not logged when 'enabbled:false',
    // so there is probably a perf hit here. Create a wrapper that has an entirely
    // separate implementation of devtools instead of the "enabled" flag
    {
      name: "EarTrainerStore",
      enabled: isDevelopment,
    },
  ),
);

const countdown = new Countdown({
  initialDurationMs: useEartrainerStore.getState().totalInitialGameTime,
  onTick: (ms) => useTimerStore.setState({ countdownRemaining: ms }),
  onComplete: () => useEartrainerStore.getState().resetTimerToInitialValue(),
});

const countup = new Countup({
  initialExpirationTime:
    useEartrainerStore.getState().timePerNote *
    useEartrainerStore.getState().amountOfnotesToGuess *
    1000,
  onTick: (ms) => useTimerStore.setState({ currentCountUp: ms }),
  onComplete: () => console.log("DONE"),
});
