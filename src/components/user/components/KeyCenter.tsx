import { useEartrainerStore } from "@/store/store";
import type { KeyCenterType } from "@/store/store";

type DropdownType = {
  value: KeyCenterType;
  display: string;
};

const keyCenterDropDown: DropdownType[] = [
  { value: "C", display: "C" },
  { value: "Db", display: "Db" },
  { value: "D", display: "D" },
  { value: "Eb", display: "Eb" },
  { value: "E", display: "E" },
  { value: "F", display: "F" },
  { value: "Gb", display: "Gb" },
  { value: "G", display: "G" },
  { value: "Ab", display: "Ab" },
  { value: "A", display: "A" },
  { value: "Bb", display: "Bb" },
  { value: "B", display: "B" },
];

export function KeyCenter() {
  const keyCenter = useEartrainerStore((state) => state.keyCenter);
  const setKeyCenter = useEartrainerStore((state) => state.setKeyCenter);

  return (
    <div>
      <p>Key*:</p>
      <select
        onChange={(e) => setKeyCenter(e.target.value as KeyCenterType)}
        value={keyCenter}
      >
        {keyCenterDropDown.map((key) => (
          <option key={key.value} value={key.value}>
            {key.display}
          </option>
        ))}
      </select>
    </div>
  );
}
