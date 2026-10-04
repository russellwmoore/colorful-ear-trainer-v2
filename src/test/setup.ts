// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// 1. Unmount rendered components between tests (automatic when globals: true, explicit is fine)
afterEach(() => cleanup());

// 2. Fresh persisted state`
beforeEach(() => {
  localStorage.clear();
});

// 3. Undo spies/mocks and fake timers so one test can't leak into the next
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

// 4. jsdom has no matchMedia; useTheme needs it
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 5. No Web Audio in jsdom; synth.ts builds a Tone.Sampler as soon as it's imported
vi.mock("@/store/synth", () => ({
  synth: {
    triggerAttackRelease: vi.fn(),
    triggerAttack: vi.fn(),
    triggerRelease: vi.fn(),
    releaseAll: vi.fn(),
  },
}));
