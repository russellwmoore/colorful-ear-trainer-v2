import { expect, test, describe } from "vitest";

import { normalizeIndex, transpose } from "./transpose";

describe("transpose", () => {
  test("Baseline transpose behavior", () => {
    const manyTransposes = [
      transpose({ set: [0], keyCenter: "C" }),
      transpose({ set: [0], keyCenter: "D" }),
      transpose({ set: [0], keyCenter: "Bb" }),
    ];
    expect(manyTransposes).toStrictEqual([["C"], ["D"], ["Bb"]]);
  });

  test("Triad example", () => {
    const manyTransposes = [
      transpose({ set: [0, 4, 7], keyCenter: "C" }),
      transpose({ set: [0, 4, 7], keyCenter: "D" }),
      transpose({ set: [0, 4, 7], keyCenter: "Bb" }),
    ];
    expect(manyTransposes).toStrictEqual([
      ["C", "E", "G"],
      ["D", "F#", "A"],
      ["Bb", "D", "F"],
    ]);
  });

  test("Negative numbers example", () => {
    const manyTransposes = [
      transpose({ set: [-11, -4, -1], keyCenter: "C" }),
      transpose({ set: [-11, -4, -1], keyCenter: "D" }),
      transpose({ set: [-11, -4, -1], keyCenter: "Bb" }),
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
        set: [0, 3, 7],
        keyCenter: "C",
        withOctave: true,
      }),
      transpose({ set: [0, 3, 7], keyCenter: "D", withOctave: true }),
      transpose({ set: [0, 3, 7], keyCenter: "Bb", withOctave: true }),
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
