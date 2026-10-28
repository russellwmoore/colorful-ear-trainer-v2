import { useEartrainerStore } from "@/store/store";

import { LevelInfoDetail } from "./LevelInfoDetail";
import { gameLevels, type LevelId } from "./LevelsMetaData";

export function Levels() {
  const gameLevel = useEartrainerStore((s) => s.gameLevel);
  const setGameLevel = useEartrainerStore((s) => s.setGameLevel);
  const handleLevelPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameLevel(e.target.id as LevelId);
  };
  const bests = useEartrainerStore((s) => s.bests);

  const enrichedGameLevels = gameLevels.map((level) => {
    const toWin = level.streakToWin;
    const bestForLevel = bests[level.id].bestCorrectStreak;
    return { ...level, isComplete: bestForLevel >= toWin };
  });
  return (
    <div id="LevelInfo">
      <h2 className="-mt-4 -mr-4 -ml-4 bg-foreground px-4 py-2 text-lg font-bold text-background">
        Choose Level:
      </h2>
      <div
        id="Level"
        className="-mr-4 -ml-4 grid grid-cols-4 items-center justify-center select-none"
      >
        <div className="pl-4 text-sm">Easy</div>
        {enrichedGameLevels
          .filter(({ difficulty }) => difficulty === "easy")
          .map(({ id, name, label, isComplete }) => {
            const selected = id === gameLevel;
            return (
              <div
                className={
                  selected ? `bg-linear-to-r from-purple-600 to-purple-400` : ""
                }
              >
                <input
                  type="radio"
                  id={id}
                  name={name}
                  value={id}
                  className="hidden"
                  checked={selected}
                  onChange={handleLevelPick}
                />
                <label
                  htmlFor={id}
                  className="flex cursor-pointer justify-center p-2 text-center text-lg font-bold"
                >
                  {label}
                  {isComplete && "⭐️"}
                </label>
              </div>
            );
          })}

        <div className="pl-4 text-sm">Medium</div>
        {enrichedGameLevels
          .filter(({ difficulty }) => difficulty === "medium")
          .map(({ id, name, label }) => {
            const selected = id === gameLevel;
            return (
              <div
                className={
                  selected ? `bg-linear-to-r from-purple-600 to-purple-400` : ""
                }
              >
                <input
                  type="radio"
                  id={id}
                  name={name}
                  value={id}
                  className="hidden"
                  checked={selected}
                  onChange={handleLevelPick}
                />
                <label
                  htmlFor={id}
                  className="flex cursor-pointer justify-center p-2 text-center text-lg font-bold"
                >
                  {label}
                </label>
              </div>
            );
          })}

        <div className="pl-4 text-sm">Hard</div>
        <div className="col-span-3 grid grid-cols-4">
          {enrichedGameLevels
            .filter(({ difficulty }) => difficulty === "hard")
            .map(({ id, name, label }) => {
              const selected = id === gameLevel;
              return (
                <div
                  className={
                    selected
                      ? `bg-linear-to-r from-purple-600 to-purple-400`
                      : ""
                  }
                >
                  <input
                    type="radio"
                    id={id}
                    name={name}
                    value={id}
                    className="hidden"
                    checked={selected}
                    onChange={handleLevelPick}
                  />
                  <label
                    htmlFor={id}
                    className="flex cursor-pointer justify-center p-2 text-center text-lg font-bold"
                  >
                    {label}
                  </label>
                </div>
              );
            })}
        </div>
      </div>
      <LevelInfoDetail levelId={gameLevel} />
    </div>
  );
}
