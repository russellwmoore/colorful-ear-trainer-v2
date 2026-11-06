import * as Tone from "tone";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import {
  gameLevels,
  type LevelId,
  type LevelScoring,
  levelScoringInit,
  type PlayLevelId,
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
import { minutesToMs, secondsToMs, TENTH_SECOND_MS } from "@/utils/time";
import { notesAsNumber, transpose } from "@/utils/transpose";

import { confettiMilestone } from "./confetti";
import { Countdown } from "./countdownTimer";
import { Countup } from "./countupStopwatch";
import { synth } from "./synth";
import { useTimerStore } from "./timerStore";

// TODO: need a file of consts for config
const INITIAL_GAME_TIME_MS = minutesToMs(5);
const INITIAL_TIME_PER_NOTE_MS = secondsToMs(5);
const INITIAL_CADENCE_TEMPO = 60;
// Pause after a correct answer so the note rings before the next question
const CORRECT_FEEDBACK_MS = 600;
const isDevelopment = process.env.NODE_ENV === "development";

// Per-run counters cleared whenever the mode or level changes
const STATS_RESET = {
  currentGuesses: [],
  correctAttempts: 0,
  allAttempts: 0,
  correctStreak: 0,
  lateAttempts: 0,
};

// Tailwind needs the actual vars to be defined somewhere in source code
// in order to to be defined in the compiled CSS
const backgroundColors = [
  "var(--color-pink-500)",
  "var(--color-purple-500)",
  "var(--color-yellow-500)",
  "var(--color-blue-500)",
  "var(--color-green-500)",
];

export type GameStatus = "idle" | "playing" | "paused";
export type GameMode = "practice" | "play";

export type EarTrainerState = {
  // User options
  keyCenter: KeyCenterType;
  setKeyCenter: (newKey: KeyCenterType) => void;
  isKeyCenterRandomized: boolean;
  setIsKeyCenterRandomized: () => void;
  cadence: CadenceType;
  setCadence: (newCadence: CadenceType) => void;
  amountOfNotesToGuess: number;
  setAmountOfNotesToGuess: (newNumberOfNotes: number) => void;
  timePerNoteMs: number;
  setTimePerNoteMs: (newTimePerNoteMs: number) => void;
  cadenceEvery: number;
  setCadenceEvery: (newTimePerNote: number) => void;
  octave: number;
  setOctave: (newOctave: number) => void;
  cadenceTempoInit: number;
  setCadenceTempoInit: (newCadenceTempo: number) => void;
  inPlayCadenceTempo: number;
  setInPlayCadenceTempo: (newCadenceTempo: number) => void;
  totalInitialGameTimeMs: number;
  setTotalInitialGameTimeMs: (newTimeMs: number) => void;
  octaveRange: number[];
  setOctaveRange: (newOctaveRange: number[]) => void;
  noteSetId: NoteSetId;
  setNoteSetId: (noteSetId: NoteSetId) => void;
  customNoteSet: number[] | null;
  setCustomNoteSet: (newNoteSet: number[]) => void;
  isMidiActive: boolean;
  setIsMidiActive: (isMidiActive: boolean) => void;

  // Gameplay
  isPlayingAudio: boolean;
  setIsPlayingAudio: (isPlaying: boolean) => void;
  playCadence: () => Promise<void>;
  gameStatus: GameStatus;
  togglePlay: () => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  // Last level chosen in play mode. Kept while in practice mode so it's
  // restored on switching back. Use selectScoreKey for the scoring bucket.
  playLevel: PlayLevelId;
  setPlayLevel: (levelId: PlayLevelId) => void;
  startGame: () => Promise<void>;
  pauseGame: () => void;
  resumeGame: () => Promise<void>;
  resetTimerToInitialValue: () => void;
  currentGuesses: number[];
  submitGuess: (guess: number) => boolean;
  resetCurrentGuesses: () => void;
  isAnsweringEnabled: boolean;
  setIsAnsweringEnabled: (isAnswering: boolean, origin: string) => void;
  // Set once per question by the stopwatch's onComplete, cleared on reset
  isCountUpExpired: boolean;
  notesToGuess: string[];
  setNotesToGuess: () => void;
  playNotesToGuess: () => Promise<void>;
  resetPianoKeys: (() => void) | null;
  setResetPianoKeys: (cb: (() => void) | null) => void;
  playCount: number;
  allAttempts: number;
  correctAttempts: number;
  lateAttempts: number;
  correctStreak: number;
  increasePlayCount: () => void;
  playTheGame: () => Promise<void>;
  backgroundColors: string[];
  bests: LevelScoring;
};

/**
 * All durations are stored as milliseconds, named with an Ms suffix.
 * Use the helpers in @/utils/time to build them and to convert for display.
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
        timePerNoteMs: INITIAL_TIME_PER_NOTE_MS,
        setTimePerNoteMs: (newTimePerNoteMs: number) =>
          set(
            { timePerNoteMs: newTimePerNoteMs },
            undefined,
            "setTimePerNoteMs",
          ),
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
        totalInitialGameTimeMs: INITIAL_GAME_TIME_MS,
        setTotalInitialGameTimeMs: (newTotalTimeInMs: number) => {
          // if the user is playing, don't set this time here on the countdown object.
          if (get().gameStatus === "idle") {
            countdown.setDuration(newTotalTimeInMs);
          }
          set(
            { totalInitialGameTimeMs: newTotalTimeInMs },
            undefined,
            "setTotalInitialGameTimeMs",
          );
        },
        octaveRange: [4, 5],
        setOctaveRange: (newOctaveRange: number[]) => {
          set({ octaveRange: newOctaveRange }, undefined, "setOctaveRange");
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
        isMidiActive: false,
        setIsMidiActive: (isMidiActive: boolean) => {
          set({ isMidiActive }, undefined, "setIsMidiActive");
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
                durationBeats: i === 0 || i === array.length - 1 ? 2 : 1,
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
          if (mode === get().gameMode) return;
          // Stop any run in progress so its scores can't land in the other
          // mode's bucket
          synth.releaseAll();
          get().resetPianoKeys?.();
          if (mode === "play") {
            set({ gameMode: mode }, undefined, "setGameMode-toPlay");
            // Re-applies the sticky level's settings and resets the run
            get().setPlayLevel(get().playLevel);
            return;
          }
          set(
            {
              gameMode: mode,
              gameStatus: "idle",
              isAnsweringEnabled: false,
              ...STATS_RESET,
            },
            undefined,
            "setGameMode-toPractice",
          );
          countdown.reset().setDuration(get().totalInitialGameTimeMs);
          countup.reset();
        },
        playLevel: "beginner1",
        setPlayLevel: (levelId: PlayLevelId) => {
          const levelInfo = gameLevels.find((l) => l.id === levelId);
          set(
            {
              playLevel: levelId,
              gameStatus: "idle",
              isAnsweringEnabled: false,
              ...STATS_RESET,
              totalInitialGameTimeMs: levelInfo?.totalInitialGameTimeMs,
              keyCenter: levelInfo?.keyCenter,
              noteSetId: levelInfo?.noteSet ?? ("perfect5" as const),
              customNoteSet: null,
              amountOfNotesToGuess: levelInfo?.amountOfNotesToGuess ?? 1,
              timePerNoteMs: levelInfo?.timePerNoteMs,
              cadenceEvery: levelInfo?.cadenceEvery,
              octaveRange: levelInfo?.octaveRange,
            },
            undefined,
            "setPlayLevel",
          );
          get().resetPianoKeys?.();
          countdown
            .reset()
            .setDuration(
              levelInfo?.totalInitialGameTimeMs ?? INITIAL_GAME_TIME_MS,
            );
          countup.reset();
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

        resumeGame: async () => {
          const { playNotesToGuess, setNotesToGuess } = get();
          setNotesToGuess();
          set({ gameStatus: "playing" }, undefined, "resumeGame");
          countdown.start();
          await playNotesToGuess();
          if (get().gameStatus !== "playing") return;
          countup.start();
        },
        resetTimerToInitialValue: () => {
          countup.reset();
          // setDuration also refills timeRemaining, which start() needs above 0
          countdown.setDuration(get().totalInitialGameTimeMs);
          set(
            { gameStatus: "idle", isAnsweringEnabled: false },
            undefined,
            "resetTimerToInitialValue",
          );
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
          } = get();

          const scoreKey = selectScoreKey(get());
          const {
            bestScore: bestScoreNew,
            bestCorrectStreak: bestCorreectStreakNew,
          } = bests[scoreKey];

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
                  [scoreKey]: {
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
            // Keeps the final time showing until answering is enabled again
            countup.stop();
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
        isCountUpExpired: false,
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

          // a user can click play notes when the game is running and when the game is paused

          // when a user calls the playNotes to guess while the game is paused, it should
          // automatically resume the game, and do nothing extra when the game is running

          await playNotes({
            notes: [{ sequence: notesToGuess, durationBeats: 2 }],
            cadenceTempo: 60,
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
        bests: levelScoringInit,
        backgroundColors: backgroundColors.slice(0, 3),
      }),

      {
        name: "EarTrainerStore",
        // Only need to store the relevant game state,
        // no need for any functions
        partialize: (state) => ({
          keyCenter: state.keyCenter,
          isKeyCenterRandomized: state.isKeyCenterRandomized,
          cadence: state.cadence,
          amountOfNotesToGuess: state.amountOfNotesToGuess,
          timePerNoteMs: state.timePerNoteMs,
          cadenceEvery: state.cadenceEvery,
          octave: state.octave,
          cadenceTempoInit: state.cadenceTempoInit,
          inPlayCadenceTempo: state.cadenceTempoInit,
          totalInitialGameTimeMs: state.totalInitialGameTimeMs,
          octaveRange: state.octaveRange,
          noteSetId: state.noteSetId,
          gameMode: state.gameMode,
          playLevel: state.playLevel,
          bests: state.bests,
          customNoteSet: state.customNoteSet,
        }),
      },
    ),
    {
      name: "EarTrainerStore",
      enabled: isDevelopment,
    },
  ),
);

// The single rule for which bests bucket the current run reads and writes
export const selectScoreKey = (s: EarTrainerState): LevelId =>
  s.gameMode === "practice" ? "practice" : s.playLevel;
export const selectBestScore = (s: EarTrainerState) =>
  s.bests[selectScoreKey(s)].bestScore;
export const selectBestCorrectStreak = (s: EarTrainerState) =>
  s.bests[selectScoreKey(s)].bestCorrectStreak;
export const selectTonality = (s: EarTrainerState) =>
  CADENCE_REGISTRY_MAP[s.cadence].quality;
export const selectActivePitches = (s: EarTrainerState) =>
  s.customNoteSet ?? getNoteSetPitches(s.noteSetId, s.cadence);
export const selectStreakPerLevel = (s: EarTrainerState, level: LevelId) =>
  s.bests[level].bestCorrectStreak;
export const selectCountUpLimitMs = (s: EarTrainerState) =>
  s.amountOfNotesToGuess * s.timePerNoteMs;

const countdown = new Countdown({
  initialDurationMs: useEartrainerStore.getState().totalInitialGameTimeMs,
  // onTick runs on every animation frame which varies depending on each devices
  // refresh rate. Flooring to tenths of a second means the stored value changes
  // only ~10 times a second instead of every frame. The MM:SS text on the countdown
  // area only requires a change every second to accurately show the time remaining.
  // Flooring to smaller numbers will only dictate how smooth the timer background transitions
  // from green to red.
  onTick: (ms) =>
    useTimerStore.setState({
      countdownRemainingMs: Math.floor(ms / TENTH_SECOND_MS) * TENTH_SECOND_MS,
    }),
  onComplete: () => {
    // TODO: create a reset game function to pass here
    useEartrainerStore.getState().resetTimerToInitialValue();
    useEartrainerStore.getState().resetPianoKeys?.();
  },
});

export const countup = new Countup({
  getExpirationMs: () => selectCountUpLimitMs(useEartrainerStore.getState()),
  onTick: (ms) => useTimerStore.setState({ countUpElapsedMs: ms }),
  onComplete: () =>
    useEartrainerStore.setState(
      { isCountUpExpired: true },
      undefined,
      "countup-expired",
    ),
  onReset: () =>
    useEartrainerStore.setState(
      { isCountUpExpired: false },
      undefined,
      "countup-reset",
    ),
});
