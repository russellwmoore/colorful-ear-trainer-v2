type CountupProps = {
  // Read every frame so the limit always matches the current settings
  getExpirationMs: () => number;
  onTick: (num: number) => void;
  onComplete: () => void;
  onReset?: () => void;
};

export class Countup {
  getExpirationMs: () => number;
  onTick: (num: number) => void;
  onComplete: () => void;
  onReset?: () => void;
  rafId: number | null;
  isPaused: boolean;
  startTime: number;
  elapsedTime: number;
  hasExpired: boolean;

  constructor({ getExpirationMs, onTick, onComplete, onReset }: CountupProps) {
    this.getExpirationMs = getExpirationMs;
    this.elapsedTime = 0;
    this.hasExpired = false;
    this.startTime = performance.now();
    this.onTick = onTick;

    this.rafId = null;
    this.isPaused = true;
    this.onComplete = onComplete;
    this.onReset = onReset;
  }

  start() {
    if (!this.isPaused) return;
    if (this.elapsedTime) {
      this.startTime = performance.now() - this.elapsedTime;
    } else {
      this.startTime = performance.now();
    }
    this.isPaused = false;
    this._loop();
  }

  pause() {
    if (this.isPaused) return;
    this.isPaused = true;
    this.elapsedTime = performance.now() - this.startTime;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  reset() {
    this.isPaused = true;
    this.elapsedTime = 0;
    this.hasExpired = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.onReset) this.onReset();
  }

  _loop = () => {
    if (this.isPaused) return;
    const timeElapsed = performance.now() - this?.startTime;
    this.onTick(timeElapsed);
    // Keep counting past expiration, but only notify once
    if (!this.hasExpired && timeElapsed > this.getExpirationMs()) {
      this.hasExpired = true;
      this.onComplete();
    }
    this.rafId = requestAnimationFrame(this._loop);
  };
}
