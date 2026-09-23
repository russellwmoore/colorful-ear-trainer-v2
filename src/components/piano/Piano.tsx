import { pianoKeysInit } from "./pianoKeys";
import { useKeyBoardEvents } from "../hooks/useKeyBoardEvents";
import { useEartrainerStore } from "@/store/store";

// TODO: consolidate and determine where to put these variables
const OCTAVE = 4;
const GOLD = "rgba(251, 191, 36, 1)";
const WHITE = "transparent";
const BLACK = "var(--text-color)";

export function Piano() {
  const synth = useEartrainerStore((state) => state.synth);

  useKeyBoardEvents();

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

  return (
    <div id="Piano" className="flex-auto min-h-0">
      <svg viewBox="0 0 170 142">
        {pianoKeysInit.map((key) => (
          <rect
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
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
          ></rect>
        ))}
      </svg>
    </div>
  );
}
