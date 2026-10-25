import { afterEach, describe, expect, test, vi } from "vitest";
import { getRandomNotes } from "./getRandomNotes";

describe("getRandomNotes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("keeps the original order and uses the max octave when Math.random approaches 1", () => {
    // j === i on every Fisher-Yates step, so nothing is swapped
    vi.spyOn(Math, "random").mockReturnValue(0.9999999);
    expect(getRandomNotes(["C", "E", "G"], [3, 5], 3)).toStrictEqual([
      "C5",
      "E5",
      "G5",
    ]);
  });

  test("shuffles deterministically and uses the min octave when Math.random returns 0", () => {
    // j === 0 on every step: [C, E, G] -> [G, E, C] -> [E, G, C]
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getRandomNotes(["C", "E", "G"], [3, 5], 3)).toStrictEqual([
      "E3",
      "G3",
      "C3",
    ]);
  });

  test("returns only numberOfNotes notes", () => {
    expect(getRandomNotes(["C", "D", "E", "F", "G"], [4, 4], 2)).toHaveLength(
      2,
    );
  });

  test("returns every note when numberOfNotes exceeds the number of notes", () => {
    const result = getRandomNotes(["C", "E", "G"], [4, 4], 10);
    expect([...result].sort()).toStrictEqual(["C4", "E4", "G4"]);
  });

  test("returns an empty array when numberOfNotes is 0 or negative", () => {
    expect(getRandomNotes(["C", "E", "G"], [4, 4], 0)).toStrictEqual([]);
    expect(getRandomNotes(["C", "E", "G"], [4, 4], -1)).toStrictEqual([]);
  });

  test("returns an empty array when given no notes", () => {
    expect(getRandomNotes([], [4, 4], 3)).toStrictEqual([]);
  });

  test("does not mutate the input array", () => {
    const notes = ["C", "D", "E", "F", "G"];
    getRandomNotes(notes, [4, 4], 3);
    expect(notes).toStrictEqual(["C", "D", "E", "F", "G"]);
  });

  test("never repeats a note and keeps every octave within range", () => {
    const notes = ["C", "D", "E", "F", "G", "A", "B"];
    for (let i = 0; i < 200; i++) {
      const result = getRandomNotes(notes, [2, 5], 4);

      // Strip the trailing digits (the octave) to get the note name, ie "C4" -> "C"
      const names = result.map((n) => n.replace(/\d+$/, ""));
      // Capture the trailing digits as the octave number, ie "C4" -> 4
      const octaves = result.map((n) => Number(/\d+$/.exec(n)?.[0]));

      expect(new Set(names).size).toBe(4);
      names.forEach((name) => expect(notes).toContain(name));
      octaves.forEach((octave) => {
        expect(octave).toBeGreaterThanOrEqual(2);
        expect(octave).toBeLessThanOrEqual(5);
      });
    }
  });

  test("picks each octave independently per note", () => {
    const octaves = new Set<string>();
    for (let i = 0; i < 50; i++) {
      getRandomNotes(["C", "E", "G"], [3, 5], 3).forEach((n) =>
        octaves.add(n.slice(-1)),
      );
    }
    expect(octaves).toStrictEqual(new Set(["3", "4", "5"]));
  });
});
