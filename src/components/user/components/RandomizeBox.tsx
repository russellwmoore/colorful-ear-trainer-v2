import { useEartrainerStore } from "@/store/store";

export function RandomizeBox() {
  const isRandomizeToggled = useEartrainerStore(
    (store) => store.isKeyCenterRandomized,
  );
  const randomizeKeyCenter = useEartrainerStore(
    (store) => store.setIsKeyCenterRandomized,
  );

  return (
    <div className="col-span-1">
      <label htmlFor="RandomKey" className="text-xs text-theme-text">
        Randomize*
      </label>
      <label className="toggle inline-block my-1">
        <input
          name="randomkey"
          type="checkbox"
          onChange={randomizeKeyCenter}
          checked={isRandomizeToggled}
        />
      </label>
    </div>
  );
}
