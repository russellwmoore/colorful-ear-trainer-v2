import { useEartrainerStore } from "@/store/store";
import { Button } from "@/components/ui/button";

export function GameControls() {
  const gameStatus = useEartrainerStore((s) => s.gameStatus);
  const isPlayingAudio = useEartrainerStore((s) => s.isPlayingAudio);

  const { togglePlay, playCadence, playNotesToGuess } =
    useEartrainerStore.getState();

  return (
    <div className="flex flex-col flex-none">
      <Button onClick={togglePlay} id="Play" variant="play" className="text-xl">
        {gameStatus === "playing" ? "PAUSE" : "PLAY"}
      </Button>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Button
          id="PlayCadence"
          className="whitespace-nowrap"
          disabled={isPlayingAudio}
          onClick={() => void playCadence()}
        >
          Replay Cadence
        </Button>
        <Button
          id="PlayNotes"
          className="whitespace-nowrap"
          disabled={isPlayingAudio || gameStatus === "idle"}
          onClick={() => void playNotesToGuess()}
        >
          Replay Notes
        </Button>
      </div>
    </div>
  );
}
