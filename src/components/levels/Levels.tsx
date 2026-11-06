import { useEartrainerStore } from "@/store/store";

import { CadenceTempoInput } from "../user/components/quantities/CadenceTempoInput";
import { LevelInfoDetail } from "./LevelInfoDetail";
import { gameLevels, type LevelType, type PlayLevelId } from "./LevelsMetaData";

type EnrichedLevels = LevelType & {
  isComplete: boolean;
};
export function Levels() {
  const playLevel = useEartrainerStore((s) => s.playLevel);
  const setPlayLevel = useEartrainerStore((s) => s.setPlayLevel);
  const handleLevelPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayLevel(e.target.id as PlayLevelId);
  };
  const bests = useEartrainerStore((s) => s.bests);

  const enrichedGameLevels: EnrichedLevels[] = gameLevels.map((level) => {
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
            const selected = id === playLevel;
            return (
              <div
                className={
                  selected ? `bg-linear-to-r from-purple-600 to-purple-400` : ""
                }
                key={id}
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
                  {isComplete && (
                    <span className="ml-1" aria-label="completed">
                      ⭐️
                    </span>
                  )}
                </label>
              </div>
            );
          })}

        <div className="pl-4 text-sm">Medium</div>
        {enrichedGameLevels
          .filter(({ difficulty }) => difficulty === "medium")
          .map(({ id, name, label, isComplete }) => {
            const selected = id === playLevel;
            return (
              <div
                className={
                  selected ? `bg-linear-to-r from-purple-600 to-purple-400` : ""
                }
                key={id}
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
                  {isComplete && (
                    <span className="ml-1" aria-label="completed">
                      ⭐️
                    </span>
                  )}
                </label>
              </div>
            );
          })}

        <div className="pl-4 text-sm">Hard</div>
        <div className="col-span-3 grid grid-cols-4">
          {enrichedGameLevels
            .filter(({ difficulty }) => difficulty === "hard")
            .map(({ id, name, label, isComplete }) => {
              const selected = id === playLevel;
              return (
                <div
                  className={
                    selected
                      ? `bg-linear-to-r from-purple-600 to-purple-400`
                      : ""
                  }
                  key={id}
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
                    {isComplete && (
                      <span className="ml-1" aria-label="completed">
                        ⭐️
                      </span>
                    )}
                  </label>
                </div>
              );
            })}
        </div>
      </div>
      <LevelInfoDetail levelId={playLevel} />
      <div className="mt-4 -mr-4 -mb-4 -ml-4 border-t-2 border-foreground p-4">
        <CadenceTempoInput />
      </div>
    </div>
  );
}
