import type { KeyCenterType } from "@/utils/noteNames";
import type { NoteSetId } from "@/utils/noteSets";
import { minutesToMs, secondsToMs } from "@/utils/time";

export type LevelId =
  | "practice"
  | "beginner1"
  | "beginner2"
  | "beginner3"
  | "intermediate1"
  | "intermediate2"
  | "intermediate3"
  | "advanced1"
  | "advanced2"
  | "advanced3"
  | "insane1";

export type LevelType = {
  name: string;
  label: string;
  id: LevelId;
  difficulty: "easy" | "medium" | "hard";
  totalInitialGameTimeMs: number;
  streakToWin: number;
  keyCenter: KeyCenterType;
  noteSet: NoteSetId;
  amountOfNotesToGuess: number;
  timePerNoteMs: number;
  cadenceEvery: number;
  octaveRange: number[];
};

const beginnerLevels: LevelType[] = [
  {
    name: "level-selector",
    label: "1",
    id: "beginner1",
    difficulty: "easy",
    totalInitialGameTimeMs: minutesToMs(5),
    streakToWin: 10,
    keyCenter: "C",
    noteSet: "triad",
    amountOfNotesToGuess: 1,
    timePerNoteMs: secondsToMs(5),
    cadenceEvery: 1,
    octaveRange: [4, 5],
  },
  {
    name: "level-selector",
    id: "beginner2",
    label: "2",
    difficulty: "easy",
    totalInitialGameTimeMs: minutesToMs(5),
    streakToWin: 20,
    keyCenter: "C",
    noteSet: "n12345",
    amountOfNotesToGuess: 1,
    timePerNoteMs: secondsToMs(5),
    cadenceEvery: 1,
    octaveRange: [4, 5],
  },
  {
    name: "level-selector",
    id: "beginner3",
    label: "3",
    difficulty: "easy",
    totalInitialGameTimeMs: minutesToMs(2),
    streakToWin: 15,
    keyCenter: "C",
    noteSet: "n12345",
    amountOfNotesToGuess: 1,
    timePerNoteMs: secondsToMs(2),
    cadenceEvery: 1,
    octaveRange: [3, 5],
  },
];

const intermediateLevels: LevelType[] = [
  {
    name: "level-selector",
    id: "intermediate1",
    label: "1",
    difficulty: "medium",
    totalInitialGameTimeMs: minutesToMs(5),
    streakToWin: 20,
    keyCenter: "C",
    noteSet: "diatonic",
    amountOfNotesToGuess: 1,
    timePerNoteMs: secondsToMs(2),
    cadenceEvery: 2,
    octaveRange: [4, 5],
  },
  {
    name: "level-selector",
    id: "intermediate2",
    label: "2",
    difficulty: "medium",
    totalInitialGameTimeMs: minutesToMs(5),
    streakToWin: 20,
    keyCenter: "C",
    noteSet: "diatonic+3",
    amountOfNotesToGuess: 1,
    timePerNoteMs: secondsToMs(1),
    cadenceEvery: 2,
    octaveRange: [4, 5],
  },
  {
    name: "level-selector",
    id: "intermediate3",
    label: "3",
    difficulty: "medium",
    totalInitialGameTimeMs: minutesToMs(2),
    streakToWin: 30,
    keyCenter: "C",
    noteSet: "chromatic",
    amountOfNotesToGuess: 1,
    timePerNoteMs: secondsToMs(2),
    cadenceEvery: 2,
    octaveRange: [3, 5],
  },
];

const advnacedLevels: LevelType[] = [
  {
    name: "level-selector",
    id: "advanced1",
    label: "1",
    difficulty: "hard",
    totalInitialGameTimeMs: minutesToMs(5),
    streakToWin: 15,
    keyCenter: "C",
    noteSet: "chromatic",
    amountOfNotesToGuess: 1,
    timePerNoteMs: secondsToMs(1),
    cadenceEvery: 5,
    octaveRange: [3, 6],
  },
  {
    name: "level-selector",
    id: "advanced2",
    label: "2",
    difficulty: "hard",
    totalInitialGameTimeMs: minutesToMs(5),
    streakToWin: 40,
    keyCenter: "C",
    noteSet: "diatonic",
    amountOfNotesToGuess: 2,
    timePerNoteMs: secondsToMs(3),
    cadenceEvery: 5,
    octaveRange: [3, 5],
  },
  {
    name: "level-selector",
    id: "advanced3",
    label: "3",
    difficulty: "hard",
    totalInitialGameTimeMs: minutesToMs(5),
    streakToWin: 50,
    keyCenter: "C",
    noteSet: "chromatic",
    amountOfNotesToGuess: 2,
    timePerNoteMs: secondsToMs(4),
    cadenceEvery: 5,
    octaveRange: [3, 6],
  },
  {
    name: "level-selector",
    id: "insane1",
    label: "🔥",
    difficulty: "hard",
    totalInitialGameTimeMs: minutesToMs(5),
    streakToWin: 100,
    keyCenter: "C",
    noteSet: "chromatic",
    amountOfNotesToGuess: 2,
    timePerNoteMs: secondsToMs(4),
    cadenceEvery: 9999,
    octaveRange: [3, 6],
  },
];

export const gameLevels = [
  ...beginnerLevels,
  ...intermediateLevels,
  ...advnacedLevels,
];

type ScoreType = {
  bestScore: number;
  bestCorrectStreak: number;
};
export type LevelScoring = Record<LevelId, ScoreType>;

export const levelScoringInit: LevelScoring = {
  practice: {
    bestScore: 0,
    bestCorrectStreak: 0,
  },
  beginner1: {
    bestScore: 0,
    bestCorrectStreak: 0,
  },
  beginner2: {
    bestScore: 0,
    bestCorrectStreak: 0,
  },
  beginner3: {
    bestScore: 0,
    bestCorrectStreak: 0,
  },
  intermediate1: {
    bestScore: 0,
    bestCorrectStreak: 0,
  },
  intermediate2: {
    bestScore: 0,
    bestCorrectStreak: 0,
  },
  intermediate3: {
    bestScore: 0,
    bestCorrectStreak: 0,
  },
  advanced1: {
    bestScore: 0,
    bestCorrectStreak: 0,
  },
  advanced2: {
    bestScore: 0,
    bestCorrectStreak: 0,
  },
  advanced3: {
    bestScore: 0,
    bestCorrectStreak: 0,
  },
  insane1: {
    bestScore: 0,
    bestCorrectStreak: 0,
  },
};
