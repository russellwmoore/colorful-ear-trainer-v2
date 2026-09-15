import * as Tone from "tone";
import { pianoKeysInit } from "./pianoKeys";
import { useState } from "react";
import { useKeyBoardEvents } from "../hooks/useKeyBoardEvents";
const OCTAVE = 4;
// TODO: the note lengths seem short and cut off before natural decay
const synth = new Tone.Sampler({
  urls: {
    C2: `C2.mp3`,
    G2: `G2.mp3`,
    C3: `C3.mp3`,
    G3: `G3.mp3`,
    C4: `C4.mp3`,
    G4: `G4.mp3`,
    Bb4: `Bb4.mp3`,
    G5: `G5.mp3`,
  },
  baseUrl: "samples/",
}).toDestination();
synth.release = 3;

const GOLD = "rgba(251, 191, 36, 1)";

export function Piano() {
  //create a synth and connect it to the main output (your speakers)

  const [pianoKeys, setPianoKeys] = useState(pianoKeysInit);

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
            onClick={handleClick}
          ></rect>
        ))}
      </svg>
    </div>
  );
}
