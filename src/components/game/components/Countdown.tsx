import { useMemo } from "react";
import { millisecondsToMMSS } from "@/utils/countdownUtils";
import { useEartrainerStore } from "@/store/store";
import { useTimerStore } from "@/store/timerStore";

export function CountDown() {
  // totalGameTimeRemaining uses the timerStore instead of the earTrainerStore to grab the passing time values.
  const totalGameTimeRemaining = useTimerStore(
    (state) => state.countdownRemaining,
  );

  const totalInitialGameTime = useEartrainerStore(
    (state) => state.totalInitialGameTime,
  );
  const isPlayingGame = useEartrainerStore((state) => state.isPlayingGame);

  const displayedTime = useMemo(() => {
    return millisecondsToMMSS(
      isPlayingGame ? totalGameTimeRemaining : totalInitialGameTime,
    );
  }, [totalInitialGameTime, totalGameTimeRemaining, isPlayingGame]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        data-face
        className="relative overflow-hidden z-10 rounded-full w-full bg-linear-to-b from-red-500 to-red-600 aspect-square"
      >
        <div className="absolute inset-0 rounded-full flex flex-col justify-center items-center border-2 border-white">
          <span data-time className="text-xl md:text-4xl font-bold">
            {displayedTime.minutes}:{displayedTime.seconds}
          </span>
          <span className="text-sm hidden md:block">remaining</span>
          <span className="text-sm md:hidden">left</span>
          <div
            className="absolute bg-linear-to-b from-green-500 to-green-600 left-0 bottom-0 right-0 -z-1 h-full"
            style={{
              maxHeight: `${isPlayingGame ? "0" : "100%"}`,
              transition: `max-height ${isPlayingGame ? totalInitialGameTime : 0}ms linear`,
            }}
            data-bg
          ></div>
        </div>
      </div>
    </div>
  );
}
