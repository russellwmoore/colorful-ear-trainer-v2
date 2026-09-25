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
    <div className="col-span-1">
      <label className="flex items-center gap-1 text-xs text-foreground">
        Randomize
        <Switch
          name="randomkey"
          size="sm"
          className="my-1"
          checked={isRandomizeToggled}
          onCheckedChange={randomizeKeyCenter}
        />
      </label>
    </div>
  );
}
