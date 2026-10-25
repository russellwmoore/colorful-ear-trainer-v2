import { useEartrainerStore } from "@/store/store";

export function Score() {
  const allAttempts = useEartrainerStore((s) => s.allAttempts);
  const correctAttempts = useEartrainerStore((s) => s.correctAttempts);
  const bestScore = useEartrainerStore((s) => s.bestScore);

  return (
    <div className="z-10 flex w-full flex-col items-center justify-center">
      <div className="w-full rounded-lg border-2 border-white bg-linear-to-r pt-1 text-white">
        <div className="text-lg md:text-xl">Score:</div>
        <div className="flex flex-row justify-center text-xl font-bold md:text-4xl">
          <span data-correct>{correctAttempts}</span>/
          <span data-total>{allAttempts}</span>
        </div>
        <div className="mt-1 flex items-center justify-center border-t-2 border-white px-4 pt-1 pb-1 text-sm md:text-lg">
          Best: {bestScore}
          <span
            data-storage-key="score"
            data-high-score
            className="ml-1 font-bold"
          ></span>
        </div>
      </div>
    </div>
  );
}
