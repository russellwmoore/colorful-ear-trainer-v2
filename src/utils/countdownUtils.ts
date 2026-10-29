import { SECOND_MS } from "./time";

/**
 * Takes milliseconds, returns a complete string of MM:SS:MSMS
 * @param ms milliseconds
 */
export function millisecondsToMMSS(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / SECOND_MS));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor(ms / 10) % 100;
  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    hundredths: String(hundredths).padStart(2, "0"),
  };
}
