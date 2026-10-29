import { describe, expect, test } from "vitest";

import { millisecondsToMMSS } from "./countdownUtils";
import { minutesToMs, SECOND_MS, secondsToMs } from "./time";

const FIVE_SECONDS = secondsToMs(5);
const FIVE_MINUTES = minutesToMs(5);

describe("Millis", () => {
  test("Whole Millisecond values", () => {
    const time = millisecondsToMMSS(FIVE_SECONDS);
    expect(time).toStrictEqual({
      minutes: "00",
      seconds: "05",
      hundredths: "00",
    });
  });

  test("Cusp Millisecond values with seconds elapsed", () => {
    const time1 = millisecondsToMMSS(FIVE_SECONDS - 1);
    const time2 = millisecondsToMMSS(FIVE_SECONDS + 1);
    const time3 = millisecondsToMMSS(FIVE_SECONDS + 10);
    expect(time1).toStrictEqual({
      minutes: "00",
      seconds: "04",
      hundredths: "99",
    });
    expect(time2).toStrictEqual({
      minutes: "00",
      seconds: "05",
      hundredths: "00",
    });
    expect(time3).toStrictEqual({
      minutes: "00",
      seconds: "05",
      hundredths: "01",
    });
  });

  test("Cusp Millisecond values with minutes elapsed", () => {
    const time1 = millisecondsToMMSS(FIVE_MINUTES + 1);
    const time2 = millisecondsToMMSS(FIVE_MINUTES - SECOND_MS);
    const time3 = millisecondsToMMSS(FIVE_MINUTES - SECOND_MS - 1);
    expect(time1).toStrictEqual({
      minutes: "05",
      seconds: "00",
      hundredths: "00",
    });
    expect(time2).toStrictEqual({
      minutes: "04",
      seconds: "59",
      hundredths: "00",
    });
    expect(time3).toStrictEqual({
      minutes: "04",
      seconds: "58",
      hundredths: "99",
    });
  });

  test("Cusp very small values", () => {
    // ocassionally, frame rates and JS math operations leave very small numbers that need to be rounded for views
    const thing = millisecondsToMMSS(FIVE_MINUTES + 0.000001);
    const thing2 = millisecondsToMMSS(FIVE_MINUTES - SECOND_MS - 0.000001);
    const thing3 = millisecondsToMMSS(FIVE_MINUTES - SECOND_MS - 1);
    expect(thing).toStrictEqual({
      minutes: "05",
      seconds: "00",
      hundredths: "00",
    });
    expect(thing2).toStrictEqual({
      minutes: "04",
      seconds: "58",
      hundredths: "99",
    });
    expect(thing3).toStrictEqual({
      minutes: "04",
      seconds: "58",
      hundredths: "99",
    });
  });
});
