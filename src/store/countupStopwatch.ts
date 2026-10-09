type CountupProps = {
  initialExpirationTime: number;
  onTick: (num: number) => void;

  onComplete: () => void;
};

export class Countup {
  initialExpirationTime: number;
  onTick: (num: number) => void;
  onComplete: () => void;
  rafId: number | null;
  isPaused: boolean;
  startTime: number;
  elapsedTime: number;

  constructor({ initialExpirationTime, onTick, onComplete }: CountupProps) {
    this.initialExpirationTime = initialExpirationTime;
    this.elapsedTime = 0;
    this.startTime = performance.now();
    this.onTick = onTick;

    this.rafId = null;
    this.isPaused = true;
    this.onComplete = onComplete;
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

  _loop = () => {
    if (this.isPaused) return;
    const timeElapsed = performance.now() - this?.startTime;
    this.onTick(timeElapsed);
    if (timeElapsed > this.initialExpirationTime) {
      this.isPaused = true;
      if (this.onComplete) this.onComplete();
    }
    this.rafId = requestAnimationFrame(this._loop);
  };
}
