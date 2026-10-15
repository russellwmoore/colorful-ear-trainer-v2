import { expect, test, describe } from "vitest";
import type { NoteName } from "./noteNames";
import { normalizeIndex, transpose, notesAsNumber } from "./transpose";

describe("transpose", () => {
  test("Baseline transpose behavior", () => {
    const manyTransposes = [
      transpose({ arrOfNoteNumbers: [0], keyCenter: "C" }),
      transpose({ arrOfNoteNumbers: [0], keyCenter: "D" }),
      transpose({ arrOfNoteNumbers: [0], keyCenter: "Bb" }),
    ];
    expect(manyTransposes).toStrictEqual([["C"], ["D"], ["Bb"]]);
  });

  test("Triad example", () => {
    const manyTransposes = [
      transpose({ arrOfNoteNumbers: [0, 4, 7], keyCenter: "C" }),
      transpose({ arrOfNoteNumbers: [0, 4, 7], keyCenter: "D" }),
      transpose({ arrOfNoteNumbers: [0, 4, 7], keyCenter: "Bb" }),
    ];
    expect(manyTransposes).toStrictEqual([
      ["C", "E", "G"],
      ["D", "F#", "A"],
      ["Bb", "D", "F"],
    ]);
  });

  test("Negative numbers example", () => {
    const manyTransposes = [
      transpose({ arrOfNoteNumbers: [-11, -4, -1], keyCenter: "C" }),
      transpose({ arrOfNoteNumbers: [-11, -4, -1], keyCenter: "D" }),
      transpose({ arrOfNoteNumbers: [-11, -4, -1], keyCenter: "Bb" }),
    ];
    expect(manyTransposes).toStrictEqual([
      ["Db", "Ab", "B"],
      ["D#", "A#", "C#"],
      ["B", "Gb", "A"],
    ]);
  });

  test("For use with synth playback, include octaves", () => {
    const manyTransposes = [
      transpose({
        arrOfNoteNumbers: [0, 3, 7],
        keyCenter: "C",
        withOctave: true,
      }),
      transpose({
        arrOfNoteNumbers: [0, 3, 7],
        keyCenter: "D",
        withOctave: true,
      }),
      transpose({
        arrOfNoteNumbers: [0, 3, 7],
        keyCenter: "Bb",
        withOctave: true,
      }),
    ];
    expect(manyTransposes).toStrictEqual([
      ["C3", "Eb3", "G3"],
      ["D3", "F3", "A3"],
      ["Bb3", "Db3", "F3"],
    ]);
  });
});

describe("normalizeIndex", () => {
  test.each([
    { input: 0, expected: 0 },
    { input: 1, expected: 1 },
    { input: 10, expected: 10 },
    { input: 12, expected: 0 },
    { input: 24, expected: 0 },
    { input: 23, expected: 11 },
  ])("works for positive numbers $input", ({ input, expected }) => {
    expect(normalizeIndex(input)).toBe(expected);
  });

  test.each([
    { input: -1, expected: 11 },
    { input: -2, expected: 10 },
    { input: -12, expected: 0 },
    { input: -23, expected: 1 },
    { input: -24, expected: 0 },
  ])("works for negative numbers $input", ({ input, expected }) => {
    expect(normalizeIndex(input)).toBe(expected);
  });
});

describe("notesAsNumber", () => {
  test("Handles intervals in C with no normalizing needed", () => {
    const scaleDegreesInC: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];
    const scaleDegreeNumbers = scaleDegreesInC.map((note) =>
      notesAsNumber(note, "C"),
    );
    expect(scaleDegreeNumbers).toStrictEqual([0, 2, 4, 5, 7, 9, 11]);
  });

  test("Handles both sharps and flats", () => {
    const scaleDegreesInC: NoteName[] = ["C", "C#", "Db", "D", "D#", "Eb"];
    const scaleDegreeNumbers = scaleDegreesInC.map((note) =>
      notesAsNumber(note, "C"),
    );
    expect(scaleDegreeNumbers).toStrictEqual([0, 1, 1, 2, 3, 3]);
  });

  test("Handles normalization both sharps and flats", () => {
    const scaleDegreesInB: NoteName[] = ["C", "C#", "Db", "D", "D#", "Eb"];
    const scaleDegreeNumbers = scaleDegreesInB.map((note) =>
      notesAsNumber(note, "B"),
    );
    expect(scaleDegreeNumbers).toStrictEqual([1, 2, 2, 3, 4, 4]);
  });

  test("Handles normalization both sharps and flats", () => {
    const scaleDegreesInDb: NoteName[] = [
      "C",
      "C#",
      "Db",
      "D",
      "D#",
      "Eb",
      "G",
    ];
    const scaleDegreeNumbers = scaleDegreesInDb.map((note) =>
      notesAsNumber(note, "Db"),
    );
    expect(scaleDegreeNumbers).toStrictEqual([11, 0, 0, 1, 2, 2, 6]);
  });
});
