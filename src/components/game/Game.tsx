import { PlayButton } from "./PlayButton";
import { CountDown } from "./components/Countdown";
export function Game() {
  return (
    <>
      {/* TODO: Game area logic */}
      {/* <game-area id="Gameify" className="rounded-lg flex-none justify-center select-none items-center grid grid-cols-4 md:grid-cols-2 text-center text-white gap-2 md:gap-4 p-2 md:p-4 relative"> */}

      <PlayButton />
      <div className="rounded-lg flex-none justify-center select-none items-center grid grid-cols-4 md:grid-cols-2 text-center text-white gap-2 md:gap-4 p-2 md:p-4 relative">
        <CountDown />
        <div className="flex flex-col items-center justify-center">
          {/* TODO stopwatch time logic */}
          {/* <stopwatch-timer id="Stopwatch" className="block w-full h-full max-w-32"> */}
          <div className="relative overflow-hidden z-10 rounded-full w-full bg-linear-to-b from-red-500 to-red-600 aspect-square">
            <div className="absolute inset-0 rounded-full flex flex-col justify-center items-center border-2 border-white">
              <div data-time className="text-xl md:text-4xl font-bold">
                0.00s
              </div>
              <div className="text-sm md:text-base md:pt-1 md:mt-1 border-t border-white">
                <span data-limit className="mr-1">
                  1s
                </span>
              </div>
            </div>
          </div>
          {/* </stopwatch-timer> */}
        </div>
        <div className="z-10 flex flex-col items-center justify-center">
          <div className="w-full flex flex-col bg-linear-to-r pt-1 rounded-lg border-2 border-white text-white">
            <div className="text-lg md:text-xl">Streak:</div>
            <div data-streak className="font-bold text-xl md:text-4xl">
              0
            </div>
            <div className="text-sm md:text-lg pt-1 pb-1 px-4 mt-1 flex justify-center items-center border-t-2 border-white">
              Best:
              <span
                data-storage-key="streak"
                data-high-streak
                className="ml-1 font-bold"
              ></span>
            </div>
          </div>
        </div>
        <div className="z-10 flex flex-col items-center justify-center w-full">
          <div className="w-full bg-linear-to-r text-white pt-1 rounded-lg border-2 border-white">
            <div className="text-lg md:text-xl">Score:</div>
            <div className="flex flex-row justify-center font-bold text-xl md:text-4xl">
              <span data-correct>0</span>/<span data-total>0</span>
            </div>
            <div className="text-sm md:text-lg pt-1 pb-1 px-4 mt-1 flex justify-center items-center border-t-2 border-white">
              Best:
              <span
                data-storage-key="score"
                data-high-score
                className="ml-1 font-bold"
              ></span>
            </div>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden absolute progress top-0 left-0 right-0 h-full bg-linear-to-r from-red-700 to-red-900 z-0">
          <div
            data-gradient
            className="h-full bg-linear-to-r from-blue-500 to-blue-400 transition-all duration-400"
          ></div>
        </div>
      </div>
      {/*  </game-area> */}
    </>
  );
}
