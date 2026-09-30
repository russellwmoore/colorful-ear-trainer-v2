import { useEartrainerStore } from "@/store/store";
import { Button } from "@/components/ui/button";

export function PlayButton() {
  const handlePlayCadence = useEartrainerStore((state) => state.playCadence);

  const isPlayingCadence = useEartrainerStore(
    (state) => state.isPlayingCadence,
  );
  const isCountdownPaused = useEartrainerStore(
    (state) => state.isCountdownPaused,
  );

  const handleStart = useEartrainerStore((state) => state.startCountdown);
  const handlePause = useEartrainerStore((state) => state.pauseCountdown);

  const setIsPlayingGame = useEartrainerStore(
    (state) => state.setIsPlayingGame,
  );

  const handlePlayToggle = () => {
    if (isCountdownPaused) {
      handleStart();
      setIsPlayingGame(true);
    } else {
      handlePause();
    }
  };

  return (
    <div className="flex flex-col flex-none">
      <Button
        onClick={handlePlayToggle}
        id="Play"
        variant="play"
        className="text-xl"
      >
        {isCountdownPaused ? "PLAY" : "PAUSE"}
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
