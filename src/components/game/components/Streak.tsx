import { useEartrainerStore } from "@/store/store";

export function Streak() {
  const correctStreak = useEartrainerStore((s) => s.correctStreak);
  const bestCorrectStreak = useEartrainerStore((s) => s.bestCorrectStreak);

  return (
    <div className="z-10 flex flex-col items-center justify-center">
      <div className="flex w-full flex-col rounded-lg border-2 border-white bg-linear-to-r pt-1 text-white">
        <div className="text-lg md:text-xl">Streak:</div>
        <div data-streak className="text-xl font-bold md:text-4xl">
          {correctStreak}
        </div>
        <div className="mt-1 flex items-center justify-center border-t-2 border-white px-4 pt-1 pb-1 text-sm md:text-lg">
          Best: {bestCorrectStreak}
          <span
            data-storage-key="streak"
            data-high-streak
            className="ml-1 font-bold"
          ></span>
        </div>
      </div>
    </div>
  );
}
