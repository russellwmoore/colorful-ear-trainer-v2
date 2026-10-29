import { cn } from "@/lib/utils";
import { selectCountUpLimitMs, useEartrainerStore } from "@/store/store";
import { useTimerStore } from "@/store/timerStore";
import { millisecondsToMMSS } from "@/utils/countdownUtils";
import { msToSeconds } from "@/utils/time";

export function Countup() {
  const timeElapsed = useTimerStore((s) => s.countUpElapsedMs);
  const hasExpired = useTimerStore((s) => s.isCountUpExpired);
  const limitMs = useEartrainerStore(selectCountUpLimitMs);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          "relative z-10 aspect-square w-full overflow-hidden rounded-full bg-linear-to-b",
          `${hasExpired ? "from-red-400 to-red-600" : "from-green-400 to-green-600"}`,
        )}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full border-2 border-white">
          <div className="text-xl font-bold md:text-4xl">
            {millisecondsToMMSS(timeElapsed).seconds}.
            {millisecondsToMMSS(timeElapsed).hundredths}
          </div>
          <div className="border-t border-white text-sm md:mt-1 md:pt-1 md:text-base">
            <span className="mr-1">{msToSeconds(limitMs)}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
