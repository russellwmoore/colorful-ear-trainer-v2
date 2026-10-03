import { useEartrainerStore } from "@/store/store";
import { transpose } from "./transpose";
import { CHROMATIC_INTERVALS } from "./noteNames";
import { NOTE_SETS, type NoteSetId } from "./noteSets";

export function useGetNoteSetIdsAndLabels(quality: "major" | "minor") {
  const keyCenter = useEartrainerStore((state) => state.keyCenter);
  const transposedNoteNames = transpose({
    set: CHROMATIC_INTERVALS,
    keyCenter,
  });

  return Object.entries(NOTE_SETS).map(([id, variants]) => {
    const variant: { baseLabel: string; pitchesAdded?: readonly number[] } =
      variants[quality];
    const pitchesAdded = variant.pitchesAdded ?? [];
    return {
      id: id as NoteSetId,
      label: [
        variant.baseLabel,
        ...pitchesAdded.map((noteDigit) => transposedNoteNames[noteDigit]),
      ].join(" + "),
    };
  });
}
