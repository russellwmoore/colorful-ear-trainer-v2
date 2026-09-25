import { useEartrainerStore } from "@/store/store";
import { NativeSelect } from "@/components/ui/native-select";
import {
  CADENCE_REGISTRY_MAP,
  type CadenceType,
  type CadenceInfo,
  isCadenceType,
} from "@/utils/cadences";

// Object.entries widens keys to string, so casting here for typescript help later
const cadenceEntries = Object.entries(CADENCE_REGISTRY_MAP) as [
  CadenceType,
  CadenceInfo,
][];

const groups = [
  { label: "Major", quality: "major" },
  { label: "Minor", quality: "minor" },
] as const;

export function Cadence() {
  const cadence = useEartrainerStore((state) => state.cadence);
  const setCadence = useEartrainerStore((state) => state.setCadence);
  return (
    <>
      <p>Cadence</p>
      <NativeSelect
        name="tonality"
        id="Tonality"
        onChange={(e) => {
          const v = e.target.value;
          if (isCadenceType(v)) setCadence(v);
        }}
        value={cadence}
      >
        {groups.map(({ label, quality }) => (
          <optgroup key={quality} label={label}>
            {cadenceEntries
              .filter(([, info]) => info.quality === quality)
              .map(([key, info]) => (
                <option key={key} value={key}>
                  {info.label}
                </option>
              ))}
          </optgroup>
        ))}
      </NativeSelect>
    </>
  );
}
