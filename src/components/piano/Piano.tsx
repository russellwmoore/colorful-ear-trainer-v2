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

export function Piano() {
  // A map to store elements by their note names: { "C": SVGRectElement, "D": ... }
  const keyRefs = useRef<Record<string, SVGRectElement | null>>({});

  const setResetPianoKeys = useEartrainerStore((s) => s.setResetPianoKeys);

  // Track currently active keys to prevent browser "keydown auto-repeat" from re-triggering audio
  const activeKeys = useRef<Set<string>>(new Set());

  const submitGuess = useEartrainerStore((s) => s.submitGuess);
  const keyCenter = useEartrainerStore((s) => s.keyCenter);
  const isAnsweringEnabled = useEartrainerStore((s) => s.isAnsweringEnabled);
  const isPlayingAudio = useEartrainerStore((s) => s.isPlayingAudio);

  const handlePointerDown = (e: React.PointerEvent<SVGRectElement>) => {
    if (isPlayingAudio) return;
    const target = e.currentTarget; // target that owns the event listener
    const singleNote = target.dataset.note?.split(",")[0];
    if (!singleNote) return;

    target.setPointerCapture(e.pointerId);

    synth.triggerAttackRelease(`${singleNote}${OCTAVE}`, "2n");

    if (isAnsweringEnabled) {
      // this note is a letter and it needs to be a number
      const numberOfNote = notesAsNumber(singleNote as NoteName, keyCenter);

      // the store records the guess and moves on to the next question when done
      const isCorrect = submitGuess(Number(numberOfNote));
      target.setAttribute("fill", isCorrect ? GREEN : RED);
    } else {
      // Keep guess feedback visible between rounds; only unlit keys flash gold
      const fill = target.getAttribute("fill");
      const isLitByGuess = fill === GREEN || fill === RED;
      if (!isLitByGuess) target.setAttribute("fill", GOLD);
    }
  };

  const handlePointerUpOrLeave = (e: React.PointerEvent<SVGRectElement>) => {
    const target = e.currentTarget;
    try {
      target.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Fallback if already released
      console.error(err);
    }

    // Only presses outside of gameplay flash. Guesses during gameplay (green/red)
    // stay lit until resetPianoKeys runs before the next notes play. Checking isAnsweringEnabled here doesn't
    // work since the callback is created before all of that state is updated: the final correct guess turns
    // it off before pointerup fires.
    if (target.getAttribute("fill") === GOLD) {
      const defaultColor = target.dataset.key === "black" ? BLACK : WHITE;
      setTimeout(() => {
        target.setAttribute("fill", defaultColor);
      }, 250);
    }
  };

  const resetAllKeys = () => {
    Object.values(keyRefs.current).forEach((el) => {
      if (!el) return;
      el.setAttribute("fill", el.dataset.key === "black" ? BLACK : WHITE);
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
      const key = e.key.toLowerCase();
      const note = KEY_MAP[key];
      if (!note || activeKeys.current.has(key)) return;

      // 1. Lock the key so it doesn't stutter on long presses
      activeKeys.current.add(key);

      // 2. Instantly update the DOM element color
      const element = keyRefs.current[note];
      if (element) {
        element.setAttribute("fill", GOLD);
      }

      // 3. Play the audio note
      synth.triggerAttack(`${note}${OCTAVE}`, Tone.now());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const note = KEY_MAP[key];
      if (!note) return;

      // 1. Remove from active tracking
      activeKeys.current.delete(key);

      // 2. Instantly reset the DOM element color
      const element = keyRefs.current[note];
      if (element) {
        const isBlackKey = element.dataset.key === "black";
        element.setAttribute("fill", isBlackKey ? BLACK : WHITE);
      }

      // 3. Release the audio note
      synth.triggerRelease(`${note}${OCTAVE}`);
    };

    // Global listeners ensure chords catch perfectly even if focus shifts slightly
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div id="Piano" className="flex-auto min-h-0">
      <svg
        viewBox="0 0 170 142"
        preserveAspectRatio="xMidYMin meet"
        className="size-full"
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
              className="cursor-pointer select-none transition-all duration-200"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUpOrLeave}
              onPointerLeave={handlePointerUpOrLeave}
            ></rect>
          );
        })}
      </svg>
    </div>
  );
}
