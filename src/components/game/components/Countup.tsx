import { useEartrainerStore } from "@/store/store";
import { useTimerStore } from "@/store/timerStore";
import { millisecondsToMMSS } from "@/utils/countdownUtils";

export function Countup() {
  const timeElapsed = useTimerStore((s) => s.currentCountUp);
  const initialTime = useEartrainerStore(
    (state) => state.notes * state.timePerNote,
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative overflow-hidden z-10 rounded-full w-full bg-linear-to-b from-red-500 to-red-600 aspect-square">
        <div className="absolute inset-0 rounded-full flex flex-col justify-center items-center border-2 border-white">
          <div data-time className="text-xl md:text-4xl font-bold">
            {millisecondsToMMSS(timeElapsed).seconds}.
            {millisecondsToMMSS(timeElapsed).hundredths}
          </div>
          <div className="text-sm md:text-base md:pt-1 md:mt-1 border-t border-white">
            <span data-limit className="mr-1">
              {initialTime}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
