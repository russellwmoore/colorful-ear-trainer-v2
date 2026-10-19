import { GameControls } from "./components/GameControls";
import { Streak } from "./components/Streak";
import { CountDown } from "./components/Countdown";
import { Countup } from "./components/Countup";
import { Score } from "./components/Score";
import { useEartrainerStore } from "@/store/store";

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
      <div className="rounded-lg flex-none justify-center select-none items-center grid grid-cols-4 md:grid-cols-2 text-center text-white gap-2 md:gap-4 p-2 md:p-4 relative">
        <CountDown />
        <Countup />
        <Streak />
        <Score />
        <div className="rounded-lg overflow-hidden absolute top-0 left-0 right-0 h-full bg-linear-to-r from-red-700 to-red-900 z-0">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-blue-300 transition-all duration-400"
            style={{
              maxWidth: `${appliedPercentage}%`,
            }}
          ></div>
        </div>
      </div>
    </>
  );
}
