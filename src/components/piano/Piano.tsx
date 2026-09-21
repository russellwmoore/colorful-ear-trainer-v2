import { pianoKeysInit } from "./pianoKeys";
import { useState } from "react";
import { useKeyBoardEvents } from "../hooks/useKeyBoardEvents";
import { useEartrainerStore } from "@/store/store";
const OCTAVE = 4;

const GOLD = "rgba(251, 191, 36, 1)";

export function Piano() {
  const [pianoKeys, setPianoKeys] = useState(pianoKeysInit);
  const synth = useEartrainerStore((state) => state.synth);

  useKeyBoardEvents();

  const fillWithInitColors = () => {
    setTimeout(() => {
      setPianoKeys((prev) =>
        prev.map((key) => {
          if (key["data-key"] === "white") {
            key.fill = "transparent";
          } else {
            key.fill = "var(--text-color)";
          }
          return key;
        }),
      );
    }, 300);
  };

  // this handleClick currently handles the non-gameplay click to play + color fills.
  // Will most likely need to incorporate store for some of this functionality.
  const handleClick = (e: React.MouseEvent<SVGRectElement>) => {
    const note = (e.target as SVGRectElement).dataset.note?.split(",")[0];
    setPianoKeys((prev) =>
      prev.map((key) => {
        const noteForKey = key["data-note"].split(",")[0];
        if (note === noteForKey) {
          key.fill = GOLD;
        }
        return key;
      }),
    );
    fillWithInitColors();
    synth.triggerAttackRelease(`${note}${OCTAVE}}`, "4n");
  };

  return (
    <div id="Piano" className="flex-auto min-h-0">
      <svg viewBox="0 0 170 142">
        {pianoKeys.map((key) => (
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
            onMouseDown={handleClick}
          ></rect>
        ))}
      </svg>
    </div>
  );
}
