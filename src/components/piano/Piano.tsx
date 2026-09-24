import { pianoKeysInit } from "./pianoKeys";
import * as Tone from "tone";
import { useEartrainerStore } from "@/store/store";
import { useRef, useEffect } from "react";

// TODO: consolidate and determine where to put these variables
const OCTAVE = 4;
const GOLD = "rgba(251, 191, 36, 1)";
const WHITE = "transparent";
const BLACK = "var(--foreground)";

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
  // TODO: should this synth be imported from the synth file instead?
  const synth = useEartrainerStore((state) => state.synth);
  // A map to store elements by their note names: { "C": SVGRectElement, "D": ... }
  const keyRefs = useRef<Record<string, SVGRectElement | null>>({});

  // Track currently active keys to prevent browser "keydown auto-repeat" from re-triggering audio
  const activeKeys = useRef<Set<string>>(new Set());

  const handlePointerDown = (e: React.PointerEvent<SVGRectElement>) => {
    const target = e.currentTarget; // target that owns the event listener
    const note = target.dataset.note?.split(",")[0];
    if (!note) return;

    target.setPointerCapture(e.pointerId);
    synth.triggerAttackRelease(`${note}${OCTAVE}`, "2n");
    target.setAttribute("fill", GOLD);
  };

  const handlePointerUpOrLeave = (e: React.PointerEvent<SVGRectElement>) => {
    const target = e.currentTarget;
    try {
      target.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Fallback if already released
      console.error(err);
    }

    const defaultColor = target.dataset.key === "black" ? BLACK : WHITE;
    const id = setTimeout(() => {
      target.setAttribute("fill", defaultColor);
      clearTimeout(id);
    }, 150);
  };

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="Piano" className="flex-auto min-h-0">
      <svg viewBox="0 0 170 142" preserveAspectRatio="xMidYMin meet" className="size-full">
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
