type CountdownProps = {
  initialDurationMs: number;
  onTick: (num: number) => void;
  onComplete?: () => void;
};

export class Countdown {
  initialDuration: number;
  timeRemaining: number;
  onTick: (num: number) => void;
  onComplete?: () => void;
  startTime: number;
  rafId: number | null;
  isPaused: boolean;

  // This needs to be able to update the time remaining as the user makes changes in the user area
  // needs to update the time remaining with

  constructor({ initialDurationMs, onTick, onComplete }: CountdownProps) {
    this.initialDuration = initialDurationMs;
    this.timeRemaining = initialDurationMs;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.startTime = 0;
    this.rafId = null;
    this.isPaused = true;
  }

  setDuration(newDurationMs: number) {
    if (!this.isPaused) {
      console.warn(
        "Cannot change duration while the countdown is running. Pause it first!",
      );
      return false;
    }
    this.initialDuration = newDurationMs;
    this.timeRemaining = newDurationMs;

    // Immediately fire the tick callback so the UI reflects the new input value
    this.onTick(this.timeRemaining);
    return true;
  }

  start() {
    if (!this.isPaused || this.timeRemaining <= 0) return;
    this.isPaused = false;
    // Offset start time by remaining time to resume perfectly
    this.startTime =
      performance.now() - (this.initialDuration - this.timeRemaining);
    this._loop();
  }

  pause() {
    if (this.isPaused) return;
    this.isPaused = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  stop() {
    this.pause();
  }

  restart() {
    this.pause();
    this.timeRemaining = this.initialDuration;
    this.start();
  }

  _loop = () => {
    if (this.isPaused) return;

    const timeElapsed = performance.now() - this.startTime;
    this.timeRemaining = Math.max(0, this.initialDuration - timeElapsed);

    this.onTick(this.timeRemaining);

    if (this.timeRemaining <= 0) {
      this.isPaused = true;
      if (this.onComplete) this.onComplete();
      return;
    }

    this.rafId = requestAnimationFrame(this._loop);
  };
}

/**
 * Takes milliseconds, returns a complete string of MM:SS
 * @param ms milliseconds
 * @returns "MM:SS"
 */
export function millisecondsToMMSS(ms: number) {
  // Round up so a countdown only reads 00:00 once time has actually run out

  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}
