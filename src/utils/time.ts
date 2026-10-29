/**
 * All durations in app state are stored as milliseconds, with an `Ms` suffix
 * on the name. Convert only at the edges: UI that shows or edits seconds, and
 * Tone.js, which schedules audio in seconds.
 */

export const SECOND_MS = 1000;
export const MINUTE_MS = 60 * SECOND_MS;

export const secondsToMs = (n: number) => n * SECOND_MS;
export const minutesToMs = (n: number) => n * MINUTE_MS;
export const msToSeconds = (ms: number) => ms / SECOND_MS;
