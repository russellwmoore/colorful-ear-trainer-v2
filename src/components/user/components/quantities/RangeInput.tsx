import { Slider } from "@/components/ui/slider";
import { useEartrainerStore } from "@/store/store";

export function RangeInput() {
  const octaveRange = useEartrainerStore((state) => state.octaveRange);
  const setOctaveRange = useEartrainerStore((state) => state.setOctaveRange);

  // This type is to satisfy the slider library
  const handleChange = (val: readonly number[] | number) => {
    if (Array.isArray(val)) {
      setOctaveRange(val);
    }
  };
  return (
    <div>
      <p className="text-sm">Range (Octaves):</p>
      <Slider
        className="mt-5 mb-12"
        defaultValue={[4, 6]}
        min={0}
        max={7}
        minStepsBetweenValues={1}
        step={1}
        onValueChange={handleChange}
        value={octaveRange}
      />
    </div>
  );
}
