import { useEartrainerStore } from "@/store/store";

import { CountDown } from "./components/Countdown";
import { Countup } from "./components/Countup";
import { GameControls } from "./components/GameControls";
import { Score } from "./components/Score";
import { Streak } from "./components/Streak";

export function Game() {
  const allAttempts = useEartrainerStore((s) => s.allAttempts);
  const correctAttempts = useEartrainerStore((s) => s.correctAttempts);

  const percentage = (correctAttempts / allAttempts) * 100;

  // When resetting the game, allAttempts is 0, and dividing by 0
  // doesn't allow this maxWidth to calculate correctly
  const isFirstQuestion = allAttempts === 0;
  const appliedPercentage = isFirstQuestion ? 100 : percentage;

  return (
    <>
      <GameControls />
      <div className="relative grid flex-none grid-cols-4 items-center justify-center gap-2 rounded-lg p-2 text-center text-white select-none md:grid-cols-2 md:gap-4 md:p-4">
        <CountDown />
        <Countup />
        <Streak />
        <Score />
        <div className="absolute top-0 right-0 left-0 z-0 h-full overflow-hidden rounded-lg bg-linear-to-r from-red-700 to-red-900">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-blue-400 transition-all duration-400"
            style={{
              maxWidth: `${appliedPercentage}%`,
            }}
          ></div>
        </div>
      </div>
    </>
  );
}
