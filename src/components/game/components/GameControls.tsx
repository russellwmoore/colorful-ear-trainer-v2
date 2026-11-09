import { Button } from "@/components/ui/button";
import { useEartrainerStore } from "@/store/store";

export function GameControls() {
  const gameStatus = useEartrainerStore((s) => s.gameStatus);
  const isPlayingAudio = useEartrainerStore((s) => s.isPlayingAudio);

  const { togglePlay, playCadence, playNotesToGuess } =
    useEartrainerStore.getState();

  return (
    <div className="flex flex-none flex-col">
      <Button onClick={togglePlay} id="Play" variant="play" className="text-xl">
        {gameStatus === "playing" ? "PAUSE" : "START"}
      </Button>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Button
          id="PlayCadence"
          className="px-2 leading-tight"
          disabled={isPlayingAudio}
          onClick={() => void playCadence()}
        >
          Replay Cadence
        </Button>
        <Button
          id="PlayNotes"
          className="px-2 leading-tight"
          disabled={
            isPlayingAudio || gameStatus === "idle" || gameStatus === "paused"
          }
          onClick={() => void playNotesToGuess()}
        >
          Replay Notes
        </Button>
      </div>
    </div>
  );
}
