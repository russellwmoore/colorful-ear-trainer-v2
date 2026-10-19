import { useEartrainerStore } from "@/store/store";

export function Streak() {
  const correctStreak = useEartrainerStore((s) => s.correctStreak);
  const bestCorrectStreak = useEartrainerStore((s) => s.bestCorrectStreak);

  return (
    <div className="z-10 flex flex-col items-center justify-center">
      <div className="w-full flex flex-col bg-linear-to-r pt-1 rounded-lg border-2 border-white text-white">
        <div className="text-lg md:text-xl">Streak:</div>
        <div data-streak className="font-bold text-xl md:text-4xl">
          {correctStreak}
        </div>
        <div className="text-sm md:text-lg pt-1 pb-1 px-4 mt-1 flex justify-center items-center border-t-2 border-white">
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
