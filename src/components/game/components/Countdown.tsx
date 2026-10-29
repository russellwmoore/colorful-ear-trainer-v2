import { useMemo } from "react";

import { useEartrainerStore } from "@/store/store";
import { useTimerStore } from "@/store/timerStore";
import { millisecondsToMMSS } from "@/utils/countdownUtils";

export function CountDown() {
  // totalGameTimeRemaining uses the timerStore instead of the earTrainerStore to grab the passing time values.
  const totalGameTimeRemainingMs = useTimerStore(
    (state) => state.countdownRemainingMs,
  );

  const totalInitialGameTimeMs = useEartrainerStore(
    (state) => state.totalInitialGameTimeMs,
  );
  const isPlayingGame = useEartrainerStore(
    (state) => state.gameStatus !== "idle",
  );

  const displayedTime = useMemo(() => {
    return millisecondsToMMSS(
      isPlayingGame ? totalGameTimeRemainingMs : totalInitialGameTimeMs,
    );
  }, [totalInitialGameTimeMs, totalGameTimeRemainingMs, isPlayingGame]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative z-10 aspect-square w-full overflow-hidden rounded-full bg-linear-to-b from-red-400 to-red-600">
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full border-2 border-white">
          <span className="text-xl font-bold md:text-4xl">
            {displayedTime.minutes}:{displayedTime.seconds}
          </span>
          <span className="hidden text-sm md:block">remaining</span>
          <span className="text-sm md:hidden">left</span>
          <div
            className="absolute right-0 bottom-0 left-0 -z-1 h-full bg-linear-to-b from-green-500 to-green-600"
            style={{
              maxHeight: `${isPlayingGame ? "0" : "100%"}`,
              transition: `max-height ${isPlayingGame ? totalInitialGameTimeMs : 0}ms linear`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
