import { useEartrainerStore } from "@/store/store";
import { Switch } from "@/components/ui/switch";

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
        className="my-1"
        checked={isRandomizeToggled}
        onCheckedChange={randomizeKeyCenter}
      />
    </div>
  );
}
