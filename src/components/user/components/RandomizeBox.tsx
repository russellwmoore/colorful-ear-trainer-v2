import { Switch } from "@/components/ui/switch";
import { useEartrainerStore } from "@/store/store";

export function RandomizeBox() {
  const isRandomizeToggled = useEartrainerStore(
    (store) => store.isKeyCenterRandomized,
  );
  const randomizeKeyCenter = useEartrainerStore(
    (store) => store.setIsKeyCenterRandomized,
  );

  return (
    <div className="col-span-1 flex flex-col items-center gap-1">
      <label htmlFor="randomkey" className="text-s text-foreground">
        Randomize
      </label>
      <Switch
        id="randomkey"
        name="randomkey"
        className="my-1 data-checked:bg-blue-600"
        checked={isRandomizeToggled}
        onCheckedChange={randomizeKeyCenter}
      />
    </div>
  );
}
