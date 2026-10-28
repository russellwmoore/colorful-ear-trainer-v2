import * as Tone from "tone";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import {
  gameLevels,
  type LevelId,
  type LevelScoring,
  levelScoringInit,
} from "@/components/levels/LevelsMetaData";
import { type CadenceType } from "@/utils/cadences";
import { CADENCE_REGISTRY_MAP } from "@/utils/cadences";
import { getRandomNotes } from "@/utils/getRandomNotes";
import {
  getRandomKeyCenter,
  type KeyCenterType,
  type NoteName,
} from "@/utils/noteNames";
import { getNoteSetPitches, type NoteSetId } from "@/utils/noteSets";
import { playNotes } from "@/utils/playNotes";
import { shuffleArray } from "@/utils/shuffleArray";
import { notesAsNumber, transpose } from "@/utils/transpose";

import { confettiMilestone } from "./confetti";
import { Countdown } from "./countdownTimer";
import { Countup } from "./countupStopwatch";
import { synth } from "./synth";
import { useTimerStore } from "./timerStore";

// TODO: need a file of consts for config
const INITIAL_GAME_TIME_DURATION = 5 * 60 * 1000;
const INITIAL_CADENCE_TEMPO = 60;
// Pause after a correct answer so the note rings before the next question
const CORRECT_FEEDBACK_MS = 600;
const isDevelopment = process.env.NODE_ENV === "development";

// Tailwind needs the actual vars to be defined somewhere in source code
// in order to to be defined in the compiled CSS
const backgroundColors = [
  "var(--color-pink-500)",
  "var(--color-purple-500)",
  "var(--color-yellow-500)",
  "var(--color-blue-500)",
  "var(--color-green-500)",
];

// TODO: Consider slices of state here instead of this blobby thing.

// TODO: Determine where this init should go.
// Possibly at the top level of App in a useEffect on first mount. Then use the onLoad
// callback to change a global state to indicate readiness.

export type GameStatus = "idle" | "playing" | "paused";
export type GameMode = "practice" | "play";

export type EarTrainerState = {
  keyCenter: KeyCenterType;
  setKeyCenter: (newKey: KeyCenterType) => void;
  isKeyCenterRandomized: boolean;
  setIsKeyCenterRandomized: () => void;
  cadence: CadenceType;
  setCadence: (newCadence: CadenceType) => void;
  amountOfNotesToGuess: number;
  setAmountOfNotesToGuess: (newNumberOfNotes: number) => void;
  timePerNote: number;
  setTimePerNote: (newTimePerNote: number) => void;
  cadenceEvery: number;
  setCadenceEvery: (newTimePerNote: number) => void;
  octave: number;
  setOctave: (newOctave: number) => void;
  cadenceTempoInit: number;
  setCadenceTempoInit: (newCadenceTempo: number) => void;
  inPlayCadenceTempo: number;
  setInPlayCadenceTempo: (newCadenceTempo: number) => void;
  // totalTime in ms
  totalInitialGameTime: number;
  setTotalInitialGameTime: (newTime: number) => void;
  octaveRange: number[];
  setOctaveRange: (newOctaveRange: number[]) => void;
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
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  gameLevel: LevelId;
  setGameLevel: (levelId: LevelId) => void;
  playTheGame: () => Promise<void>;
  allAttempts: number;
  correctAttempts: number;
  lateAttempts: number;
  correctStreak: number;
  backgroundColors: string[];
  bests: LevelScoring;
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
        amountOfNotesToGuess: 1,
        setAmountOfNotesToGuess: (numberOfNotes: number) =>
          set(
            { amountOfNotesToGuess: numberOfNotes },
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
        cadenceTempoInit: INITIAL_CADENCE_TEMPO,
        setCadenceTempoInit: (newTempo: number) =>
          set({ cadenceTempoInit: newTempo }, undefined, "setCadenceTempoInit"),
        inPlayCadenceTempo: INITIAL_CADENCE_TEMPO,
        setInPlayCadenceTempo: (newTempo: number) =>
          set(
            { inPlayCadenceTempo: newTempo },
            undefined,
            "inPlayCadenceTempo",
          ),
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
        setOctaveRange: (newOctaveRange: number[]) => {
          set({ octaveRange: newOctaveRange }, undefined, "setOctaveRange");
        },

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
            inPlayCadenceTempo,
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
            cadenceTempo: inPlayCadenceTempo,
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
        gameMode: "practice",
        setGameMode: (mode: GameMode) => {
          set({ gameMode: mode }, undefined, "setGameMode");
        },
        gameLevel: "beginner1",
        setGameLevel: (levelId: LevelId) => {
          const levelInfo = gameLevels.find((l) => l.id === levelId);
          set(
            {
              gameLevel: levelId,
              gameStatus: "idle",
              currentGuesses: [],
              correctAttempts: 0,
              allAttempts: 0,
              correctStreak: 0,
              lateAttempts: 0,
              totalInitialGameTime: levelInfo?.totalInitialGameTime,
              keyCenter: levelInfo?.keyCenter,
              noteSetId: levelInfo?.noteSet ?? ("perfect5" as const),
              customNoteSet: null,
              amountOfNotesToGuess: levelInfo?.amountOfNotesToGuess ?? 1,
              timePerNote: levelInfo?.timePerNote,
              cadenceEvery: levelInfo?.cadenceEvery,
              octaveRange: levelInfo?.octaveRange,
            },
            undefined,
            "setGameLevel",
          );
          countdown.reset();
          countdown.setDuration(levelInfo?.totalInitialGameTime ?? 5);
          countup.reset();
          useTimerStore.setState({
            countdownRemaining: 0,
            currentCountUp: 0,
          });
        },
        startGame: async () => {
          set(
            {
              gameStatus: "playing",
              playCount: 0,
              currentGuesses: [],
              correctAttempts: 0,
              allAttempts: 0,
              correctStreak: 0,
              lateAttempts: 0,
              backgroundColors: shuffleArray(backgroundColors).slice(0, 3),
            },
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
        resetCountUp: () => {
          countup.reset();
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
          countup.reset();
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
        setCustomNoteSet: (newNoteSet: number[]) => {
          if (newNoteSet.length === 0) {
            set(
              {
                customNoteSet: null,
                noteSetId: "perfect5" as const,
              },
              undefined,
              "setCustomNoteSet-emptySet",
            );
          } else {
            set(
              {
                customNoteSet: newNoteSet,
                noteSetId: "custom",
              },
              undefined,
              "setCustomNoteSet",
            );
          }
        },
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
            allAttempts,
            correctAttempts,
            correctStreak,
            inPlayCadenceTempo,
            cadenceTempoInit,
            bests,
            gameLevel,
          } = get();

          const {
            bestScore: bestScoreNew,
            bestCorrectStreak: bestCorreectStreakNew,
          } = bests[gameLevel];

          // for every guess we have to know what game we are playing.
          // practice mode is one game
          // the other games are defined in play levels
          // if use is in practice mode, then all scoring goes to practice mode
          // if user is in playLevel mode, all scoring is in the corresponding game.

          //

          // this regex smells bad. perhaps a different pattern to store guesses is needed?

          const notesToGuessAsScaleDegrees = notesToGuess.map((note) =>
            notesAsNumber(note.replace(/\d$/, "") as NoteName, keyCenter),
          );

          const isCorrectNote = notesToGuessAsScaleDegrees.includes(guess);
          // Repeating a note already guessed this question doesn't count again
          if (currentGuesses.includes(guess)) return isCorrectNote;

          const guesses = [...currentGuesses, guess];
          const isPlayComplete = notesToGuessAsScaleDegrees.every(
            (correctNote) => guesses.includes(correctNote),
          );

          set({ allAttempts: allAttempts + 1 }, undefined, "submitGuess");

          if (isCorrectNote) {
            const amountOfCorrectAttempts = correctAttempts + 1;

            const isGuessedFirstTime = guesses.length === 1;

            const updatedCorrectStreak = isGuessedFirstTime
              ? correctStreak + 1
              : correctStreak;

            set(
              {
                correctAttempts: amountOfCorrectAttempts,
                correctStreak: updatedCorrectStreak,
                bests: {
                  ...bests,
                  [gameLevel]: {
                    bestCorrectStreak: Math.max(
                      bestCorreectStreakNew,
                      updatedCorrectStreak,
                    ),
                    bestScore: Math.max(amountOfCorrectAttempts, bestScoreNew),
                  },
                },
                inPlayCadenceTempo: isGuessedFirstTime
                  ? Math.floor(inPlayCadenceTempo * 1.025)
                  : inPlayCadenceTempo,
              },
              undefined,
              "submitGuess-isCorrect",
            );
            if (isGuessedFirstTime) confettiMilestone(updatedCorrectStreak);
          } else {
            set(
              { correctStreak: 0, inPlayCadenceTempo: cadenceTempoInit },
              undefined,
              "submitGuess-incorrectGuess",
            );
          }
          if (isPlayComplete) {
            set(
              {
                currentGuesses: [],
                isAnsweringEnabled: false,
                playCount: playCount + 1,
              },
              undefined,
              "submitGuess-playComplete",
            );
            countup.reset();
            setTimeout(() => {
              if (get().gameStatus === "playing") void playTheGame();
            }, CORRECT_FEEDBACK_MS);
          } else {
            set(
              { currentGuesses: guesses },
              undefined,
              "submitGuess-notPlayComplete",
            );
          }
          return isCorrectNote;
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
          const state = get();
          const {
            keyCenter,
            octaveRange,
            amountOfNotesToGuess: amountOfnotesToGuess,
          } = state;
          const pitchesAsNotes = transpose({
            arrOfNoteNumbers: selectActivePitches(state),
            keyCenter,
          });

          const randomNotes = getRandomNotes(
            pitchesAsNotes,
            octaveRange,
            amountOfnotesToGuess,
          );

          set({ notesToGuess: randomNotes }, undefined, "setNotesToGuess");
        },
        playNotesToGuess: async () => {
          await Tone.start();
          const { notesToGuess, setIsAnsweringEnabled } = get();

          await playNotes({
            notes: [{ sequence: notesToGuess, duration: 2 }],
            cadenceTempo: 60,
            isNotesToGuess: true,
            onNoteAttackFinish: () => {
              setIsAnsweringEnabled(true, "playNotesToGuess");
              countup.start();
            },
          });
        },
        resetPianoKeys: null,
        setResetPianoKeys: (cb) =>
          set({ resetPianoKeys: cb }, undefined, "setResetPianoKeys"),
        playCount: 0,
        allAttempts: 0,
        correctAttempts: 0,
        lateAttempts: 0,
        bestScore: 0,
        bestCorrectStreak: 0,
        correctStreak: 0,
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
            isKeyCenterRandomized,
          } = get();

          const shouldPlayCadence = playCount % cadenceEvery === 0;

          if (isKeyCenterRandomized && shouldPlayCadence) {
            set({ keyCenter: getRandomKeyCenter() });
          }

          setNotesToGuess();

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
        },
        backgroundColors: backgroundColors.slice(0, 3),
        bests: levelScoringInit,
      }),

      {
        name: "EarTrainerStore",
        // Only need to store the relevant game state,
        // no need for any functions
        partialize: (state) => ({
          keyCenter: state.keyCenter,
          isKeyCenterRandomized: state.isKeyCenterRandomized,
          cadence: state.cadence,
          amountOfnotesToGuess: state.amountOfNotesToGuess,
          timePerNote: state.timePerNote,
          cadenceEvery: state.cadenceEvery,
          octave: state.octave,
          cadenceTempoInit: state.cadenceTempoInit,
          inPlayCadenceTempo: state.cadenceTempoInit,
          totalInitialGameTime: state.totalInitialGameTime,
          octaveRange: state.octaveRange,
          noteSetId: state.noteSetId,
          gameMode: state.gameMode,
          gameLevel: state.gameLevel,
          bests: state.bests,
          customNoteSet: state.customNoteSet,
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

export const selectBestScore = (s: EarTrainerState) =>
  s.bests[s.gameLevel].bestScore;
export const selectBestCorrectStreak = (s: EarTrainerState) =>
  s.bests[s.gameLevel].bestCorrectStreak;
export const selectTonality = (s: EarTrainerState) =>
  CADENCE_REGISTRY_MAP[s.cadence].quality;
export const selectActivePitches = (s: EarTrainerState) =>
  s.customNoteSet ?? getNoteSetPitches(s.noteSetId, s.cadence);
export const selectStreakPerLevel = (s: EarTrainerState, level: LevelId) =>
  s.bests[level].bestCorrectStreak;

const countdown = new Countdown({
  initialDurationMs: useEartrainerStore.getState().totalInitialGameTime,
  onTick: (ms) => useTimerStore.setState({ countdownRemaining: ms }),
  onComplete: () => {
    // TODO: create a reset game function to pass here
    useEartrainerStore.getState().resetTimerToInitialValue();
    useEartrainerStore.getState().resetPianoKeys?.();
  },
});

export const countup = new Countup({
  initialExpirationTime:
    useEartrainerStore.getState().timePerNote *
    useEartrainerStore.getState().amountOfNotesToGuess *
    1000,
  onTick: (ms) => useTimerStore.setState({ currentCountUp: ms }),
  onComplete: () => console.log("DONE"),
});
