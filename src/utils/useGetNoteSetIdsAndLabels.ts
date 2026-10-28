import { useEartrainerStore } from "@/store/store";

import { CHROMATIC_INTERVALS, type KeyCenterType } from "./noteNames";
import { NOTE_SETS, type NoteSetId } from "./noteSets";
import { transpose } from "./transpose";

export function useGetNoteSetIdsAndLabels(
  quality: "major" | "minor",
  callSiteKeyCenter?: KeyCenterType,
) {
  const keyCenterFromStore = useEartrainerStore((state) => state.keyCenter);
  const keyCenter = callSiteKeyCenter ?? keyCenterFromStore;
  const transposedNoteNames = transpose({
    arrOfNoteNumbers: CHROMATIC_INTERVALS,
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
