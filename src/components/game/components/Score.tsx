import { useEartrainerStore } from "@/store/store";

export function Score() {
  const allAttempts = useEartrainerStore((s) => s.allAttempts);
  const correctAttempts = useEartrainerStore((s) => s.correctAttempts);
  const bestScore = useEartrainerStore((s) => s.bestScore);

  return (
    <div className="z-10 flex flex-col items-center justify-center w-full">
      <div className="w-full bg-linear-to-r text-white pt-1 rounded-lg border-2 border-white">
        <div className="text-lg md:text-xl">Score:</div>
        <div className="flex flex-row justify-center font-bold text-xl md:text-4xl">
          <span data-correct>{correctAttempts}</span>/
          <span data-total>{allAttempts}</span>
        </div>
        <div className="text-sm md:text-lg pt-1 pb-1 px-4 mt-1 flex justify-center items-center border-t-2 border-white">
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
