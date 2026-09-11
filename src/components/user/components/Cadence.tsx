import { useEartrainerStore, type CadenceType } from "@/store/store";

export function Cadence() {
  const cadence = useEartrainerStore((state) => state.cadence);
  const setCadence = useEartrainerStore((state) => state.setCadence);
  return (
    <>
      <p>Cadence</p>
      <div className="select-wrap">
        <select
          name="tonality"
          id="Tonality"
          className="input w-full"
          onChange={(e) => setCadence(e.target.value as CadenceType)}
          value={cadence}
        >
          <optgroup label="Major">
            <option value="major,1451">I IV V I</option>
            <option value="major,1251">I ii7 V7 I</option>
            <option value="major,1441">I IV iv I</option>
          </optgroup>
          <optgroup label="Minor">
            <option value="minor,1451">i iv v i</option>
            <option value="minor,14571">i iv V7 i</option>
          </optgroup>
        </select>
      </div>
    </>
  );
}
