import { cn } from "@/lib/utils";
import { useEartrainerStore } from "@/store/store";
import { useTimerStore } from "@/store/timerStore";
import { millisecondsToMMSS } from "@/utils/countdownUtils";

export function Countup() {
  const timeElapsed = useTimerStore((s) => s.currentCountUp);
  const initialTime = useEartrainerStore(
    (state) => state.amountOfnotesToGuess * state.timePerNote,
  );
  const hasExpired = timeElapsed > initialTime * 1000;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          "relative z-10 aspect-square w-full overflow-hidden rounded-full bg-linear-to-b",
          `${hasExpired ? "from-red-400 to-red-600" : "from-green-400 to-green-600"}`,
        )}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full border-2 border-white">
          <div data-time className="text-xl font-bold md:text-4xl">
            {millisecondsToMMSS(timeElapsed).seconds}.
            {millisecondsToMMSS(timeElapsed).hundredths}
          </div>
          <div className="border-t border-white text-sm md:mt-1 md:pt-1 md:text-base">
            <span data-limit className="mr-1">
              {initialTime}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
