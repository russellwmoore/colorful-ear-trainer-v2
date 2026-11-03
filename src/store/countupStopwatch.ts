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
  // Stopped keeps the final time showing, but the next start counts from zero
  isStopped: boolean;

  constructor({ getExpirationMs, onTick, onComplete, onReset }: CountupProps) {
    this.getExpirationMs = getExpirationMs;
    this.elapsedTime = 0;
    this.hasExpired = false;
    this.isStopped = false;
    this.startTime = performance.now();
    this.onTick = onTick;

    this.rafId = null;
    this.isPaused = true;
    this.onComplete = onComplete;
    this.onReset = onReset;
  }

  start() {
    if (!this.isPaused) return;
    if (this.isStopped) this.reset();
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

  stop() {
    this.pause();
    this.isStopped = true;
  }

  reset() {
    this.isPaused = true;
    this.isStopped = false;
    this.elapsedTime = 0;
    this.hasExpired = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.onTick(this.elapsedTime);
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
