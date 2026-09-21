import { useEartrainerStore } from "@/store/store";

export function PlayButton() {
  const handlePlayCadence = useEartrainerStore((state) => state.playCadence);
  const isPlayingCadence = useEartrainerStore(
    (state) => state.isPlayingCadence,
  );
  return (
    <div className="flex flex-col flex-none">
      <button
        id="Play"
        className="btn bg-linear-to-r bg-green-gradient text-xl"
      >
        PLAY
      </button>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <button
          id="PlayCadence"
          className="btn bg-linear-to-r from-blue-300 to-blue-200 whitespace-nowrap"
          onClick={handlePlayCadence}
        >
          {isPlayingCadence ? "Playing..." : "Replay Cadence"}
        </button>
        <button
          id="PlayNotes"
          className="btn bg-linear-to-r from-blue-300 to-blue-200 whitespace-nowrap"
        >
          Replay Notes
        </button>
      </div>
    </div>
  );
}
