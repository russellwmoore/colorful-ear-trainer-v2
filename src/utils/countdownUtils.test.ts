import { expect, test, describe } from "vitest";

import { millisecondsToMMSS } from "./countdownUtils";

// millisecond values for various units
const ONE_SECOND = 1000;
const FIVE_SECONDS = 5 * ONE_SECOND;
const ONE_MINUTE = 60 * ONE_SECOND;
const FIVE_MINUTES = 5 * ONE_MINUTE;

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
    const time2 = millisecondsToMMSS(FIVE_MINUTES - ONE_SECOND);
    const time3 = millisecondsToMMSS(FIVE_MINUTES - ONE_SECOND - 1);
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
    const thing2 = millisecondsToMMSS(FIVE_MINUTES - ONE_SECOND - 0.000001);
    const thing3 = millisecondsToMMSS(FIVE_MINUTES - ONE_SECOND - 1);
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
