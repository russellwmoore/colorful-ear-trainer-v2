import { useEartrainerStore } from "@/store/store";
import { CADENCE_REGISTRY_MAP } from "@/utils/cadences";
import { flatKeyCenters, flats, sharps } from "@/utils/noteNames";
import { NOTE_SETS } from "@/utils/noteSets";
import { transpose, normalizeIndex } from "@/utils/transpose";
import { cn } from "@/lib/utils";

const whiteKeysSelect = "has-checked:bg-linear-to-r from-blue-600 to-blue-700";
const blackKeysSelect =
  "has-checked:bg-linear-to-r from-yellow-500 to-yellow-600";

const pickerCss = {
  C: `col-start-1 row-start-2 ${whiteKeysSelect}`,
  D: `col-start-3 row-start-2 ${whiteKeysSelect}`,
  E: `col-start-5 row-start-2 ${whiteKeysSelect}`,
  F: `col-start-7 row-start-2 ${whiteKeysSelect}`,
  G: `col-start-9 row-start-2 ${whiteKeysSelect}`,
  A: `col-start-11 row-start-2 ${whiteKeysSelect}`,
  B: `col-start-13 row-start-2 ${whiteKeysSelect}`,

  "C#": `col-start-2 row-start-1 ${blackKeysSelect}`,
  Db: `col-start-2 row-start-1 ${blackKeysSelect}`,

  "D#": `col-start-4 row-start-1 ${blackKeysSelect}`,
  Eb: `col-start-4 row-start-1 ${blackKeysSelect}`,

  "F#": `col-start-8 row-start-1 ${blackKeysSelect}`,
  Gb: `col-start-8 row-start-1 ${blackKeysSelect}`,

  "G#": `col-start-10 row-start-1 ${blackKeysSelect}`,
  Ab: `col-start-10 row-start-1 ${blackKeysSelect}`,

  "A#": `col-start-12 row-start-1 ${blackKeysSelect}`,
  Bb: `col-start-12 row-start-1 ${blackKeysSelect}`,
};

export function NoteSetPicker() {
  const noteSetId = useEartrainerStore((s) => s.noteSetId);
  const cadence = useEartrainerStore((s) => s.cadence);
  const majorOrMinor = CADENCE_REGISTRY_MAP[cadence].quality;
  const noteSetScaleDegrees = NOTE_SETS[noteSetId][majorOrMinor].pitches;

  const customNoteSet = useEartrainerStore((s) => s.customNoteSet);
  const setCustomNoteSet = useEartrainerStore((s) => s.setCustomNoteSet);

  const keyCenter = useEartrainerStore((s) => s.keyCenter);

  const allNotesTransposed = transpose({
    set: customNoteSet ?? noteSetScaleDegrees,
    keyCenter,
  });

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    const keyCenterInt = flats.indexOf(keyCenter);
    const keyOffest = Number(value) - keyCenterInt;
    const normalizedScaleDegree = normalizeIndex(keyOffest);

    if (checked) {
      setCustomNoteSet([
        ...(customNoteSet ?? [...noteSetScaleDegrees]),
        normalizedScaleDegree,
      ]);
    } else {
      setCustomNoteSet(
        (customNoteSet ?? [...noteSetScaleDegrees]).filter(
          (note) => note !== normalizedScaleDegree,
        ),
      );
    }
  };

  const checkableNotes = flatKeyCenters.includes(keyCenter) ? flats : sharps;

  return (
    <div className="grid items-center justify-center gap-2 mt-3 grid-cols-14 grid-rows-2">
      {checkableNotes.map((note, index) => {
        const additionalStyles = pickerCss[note];

        return (
          <label
            className={cn(
              "relative flex items-center justify-center w-8 h-8 border border-foreground rounded-full cursor-pointer select-none has-checked:font-semibold text-theme-text",
              additionalStyles,
            )}
            key={note}
          >
            {note}
            <input
              type="checkbox"
              value={index}
              className="hidden"
              checked={allNotesTransposed.includes(note)}
              onChange={handleCheckChange}
            />
          </label>
        );
      })}
    </div>
  );
}
