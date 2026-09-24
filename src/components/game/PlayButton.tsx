import { useEartrainerStore } from "@/store/store";
import { Button } from "@/components/ui/button";

export function PlayButton() {
  const handlePlayCadence = useEartrainerStore((state) => state.playCadence);
  const isPlayingCadence = useEartrainerStore(
    (state) => state.isPlayingCadence,
  );
  return (
    <div className="flex flex-col flex-none">
      <Button id="Play" variant="play" className="text-xl">
        PLAY
      </Button>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Button
          id="PlayCadence"
          className="whitespace-nowrap"
          onClick={() => {
            void handlePlayCadence();
          }}
        >
          {isPlayingCadence ? "Playing..." : "Replay Cadence"}
        </Button>
        <Button id="PlayNotes" className="whitespace-nowrap">
          Replay Notes
        </Button>
      </div>
    </div>
  );
}
