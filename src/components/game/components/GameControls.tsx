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
        {gameStatus === "playing" ? "PAUSE" : "PLAY"}
      </Button>
      <div className="mt-4 grid grid-cols-2 gap-4">
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
