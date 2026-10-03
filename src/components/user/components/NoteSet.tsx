import { NativeSelect } from "@/components/ui/native-select";
import { useEartrainerStore } from "@/store/store";
import { CADENCE_REGISTRY_MAP } from "@/utils/cadences";
import { isNoteSetId } from "@/utils/noteSets";
import { useGetNoteSetIdsAndLabels } from "@/utils/useGetNoteSetIdsAndLabels";
import { NoteSetPicker } from "./NoteSetPicker";

export function NoteSet() {
  const cadence = useEartrainerStore((state) => state.cadence);
  const noteSetId = useEartrainerStore((state) => state.noteSetId);
  const setNoteSetId = useEartrainerStore((state) => state.setNoteSetId);
  const quality = CADENCE_REGISTRY_MAP[cadence].quality;
  const noteSetIdsAndLabels = useGetNoteSetIdsAndLabels(quality);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isNoteSetId(e.target.value)) setNoteSetId(e.target.value);
  };

  return (
    <>
      <p>Note Set:</p>
      <NativeSelect
        name="set-select"
        id="NoteSet"
        className="note-sets text-lg p-2"
        onChange={handleChange}
        value={noteSetId}
      >
        {noteSetIdsAndLabels.map((option) => {
          return (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          );
        })}
      </NativeSelect>
      <NoteSetPicker />
    </>
  );
}
