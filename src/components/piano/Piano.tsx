import { pianoKeysInit } from "./pianoKeys";
import * as Tone from "tone";
import { useEartrainerStore } from "@/store/store";
import { useRef, useEffect } from "react";
import { notesAsNumber } from "@/utils/transpose";
import type { NoteName } from "@/utils/noteNames";
import { synth } from "@/store/synth";
// TODO: consolidate and determine where to put these variables
const OCTAVE = 4;
const GOLD = "rgba(251, 191, 36, 1)";
const RED = "rgba(185, 28, 28, 1)";
const WHITE = "transparent";
const BLACK = "var(--foreground)";
const GREEN = "rgba(80, 240, 80, 1)";
const KEY_MAP: Record<string, string> = {
  a: "C",
  w: "C#",
  s: "D",
  e: "D#",
  d: "E",
  f: "F",
  t: "F#",
  g: "G",
  y: "G#",
  h: "A",
  u: "A#",
  j: "B",
};

const defaultFill = (el: SVGRectElement) =>
  el.dataset.key === "black" ? BLACK : WHITE;

// Re-adding a class that's already there doesn't replay its animation, so remove it
// and force a reflow first. That way repeat wrong guesses on the same key shake every time.
const shake = (el: SVGRectElement) => {
  el.classList.remove("animate-shake");
  void el.getBoundingClientRect();
  el.classList.add("animate-shake");
  el.addEventListener(
    "animationend",
    () => el.classList.remove("animate-shake"),
    { once: true },
  );
};

export function Piano() {
  // A map to store elements by their note names: { "C": SVGRectElement, "D": ... }
  const keyRefs = useRef<Record<string, SVGRectElement | null>>({});

  const setResetPianoKeys = useEartrainerStore((s) => s.setResetPianoKeys);

  // Track currently active keys to prevent browser "keydown auto-repeat" from re-triggering audio
  const activeKeys = useRef<Set<string>>(new Set());

  // Shared by clicks and computer-keyboard presses. Submits a guess while answering,
  // otherwise flashes the key gold. Returns false when presses are blocked.
  // Reads the store at press time so the keyboard listeners never go stale.
  const pressKey = (note: string) => {
    const { isPlayingAudio, isAnsweringEnabled, keyCenter, submitGuess } =
      useEartrainerStore.getState();
    if (isPlayingAudio) return false;

    const element = keyRefs.current[note];
    if (isAnsweringEnabled) {
      // this note is a letter and it needs to be a number
      const numberOfNote = notesAsNumber(note as NoteName, keyCenter);

      // the store records the guess and moves on to the next question when done
      const isCorrect = submitGuess(numberOfNote);
      element?.setAttribute("fill", isCorrect ? GREEN : RED);
      if (!isCorrect && element) shake(element);
    } else {
      // Keep guess feedback visible between rounds; only unlit keys flash gold
      const fill = element?.getAttribute("fill");
      const isLitByGuess = fill === GREEN || fill === RED;
      if (!isLitByGuess) element?.setAttribute("fill", GOLD);
    }
    return true;
  };

  // Only gold flashes are cleared. Guesses (green/red) stay lit until resetPianoKeys
  // runs before the next notes play. Checking isAnsweringEnabled instead doesn't
  // work: the final correct guess turns it off before the key is released.
  const releaseKey = (note: string) => {
    const element = keyRefs.current[note];
    if (element?.getAttribute("fill") === GOLD) {
      element.setAttribute("fill", defaultFill(element));
    }
  };

  const handlePointerDown = (e: React.PointerEvent<SVGRectElement>) => {
    if (e.button !== 0) return;
    const target = e.currentTarget; // target that owns the event listener
    const singleNote = target.dataset.note?.split(",")[0];
    if (!singleNote || !pressKey(singleNote)) return;

    target.setPointerCapture(e.pointerId);
    synth.triggerAttackRelease(`${singleNote}${OCTAVE}`, "2n");
  };

  const handlePointerUpOrLeave = (e: React.PointerEvent<SVGRectElement>) => {
    const target = e.currentTarget;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }

    const singleNote = target.dataset.note?.split(",")[0];
    if (!singleNote) return;
    // releaseKey rechecks the fill, so a guess made during the delay survives
    setTimeout(() => releaseKey(singleNote), 250);
  };

  const resetAllKeys = () => {
    Object.values(keyRefs.current).forEach((el) => {
      if (!el) return;
      el.setAttribute("fill", defaultFill(el));
    });
  };

  // Register the reset with the store so it can be called from outside the Piano
  useEffect(() => {
    setResetPianoKeys(resetAllKeys);
    return () => setResetPianoKeys(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore auto-repeat, shortcuts (macOS skips keyup while Cmd is held), and typing in form fields
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("input, textarea, select, [contenteditable]")
      )
        return;
      const key = e.key.toLowerCase();
      const note = KEY_MAP[key];
      if (!note || activeKeys.current.has(key)) return;
      if (!pressKey(note)) return;

      // Lock the key so it doesn't stutter on long presses
      activeKeys.current.add(key);
      synth.triggerAttack(`${note}${OCTAVE}`, Tone.now());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const note = KEY_MAP[key];
      if (!note) return;

      activeKeys.current.delete(key);
      releaseKey(note);
      synth.triggerRelease(`${note}${OCTAVE}`);
    };

    // keyup never fires if the window loses focus mid-press, so release everything
    const handleBlur = () => {
      activeKeys.current.forEach((key) => {
        const note = KEY_MAP[key];
        releaseKey(note);
        synth.triggerRelease(`${note}${OCTAVE}`);
      });
      activeKeys.current.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
    // pressKey/releaseKey only touch refs and store.getState(), so they're never stale
  }, []);

  return (
    <div id="Piano" className="mx-auto w-full max-w-200 flex-none">
      <svg
        viewBox="0 0 170 142"
        preserveAspectRatio="xMidYMin meet"
        className="h-auto w-full"
      >
        {pianoKeysInit.map((key) => {
          const noteName = key["data-note"].split(",")[0];
          return (
            <rect
              ref={(el) => {
                if (noteName) {
                  keyRefs.current[noteName] = el;
                }
              }}
              key={key["data-note"]}
              x={key.x}
              y={key.y}
              width={key.width}
              height={key.height}
              rx={key.rx}
              ry={key.ry}
              stroke={key.stroke}
              strokeWidth={key.strokeWidth}
              fill={key.fill}
              data-key={key["data-key"]}
              data-note={key["data-note"]}
              className="cursor-pointer transition-all duration-200 select-none"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUpOrLeave}
              onPointerLeave={handlePointerUpOrLeave}
              onPointerCancel={handlePointerUpOrLeave}
            ></rect>
          );
        })}
      </svg>
    </div>
  );
}
