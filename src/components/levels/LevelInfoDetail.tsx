import { millisecondsToMMSS } from "@/utils/countdownUtils";
import { msToSeconds } from "@/utils/time";
import { useGetNoteSetIdsAndLabels } from "@/utils/useGetNoteSetIdsAndLabels";

import { gameLevels, type LevelId } from "./LevelsMetaData";
type LevelsInfoDetailProps = {
  levelId: LevelId;
};

export function LevelInfoDetail({ levelId }: LevelsInfoDetailProps) {
  const levelInfo =
    gameLevels.find((level) => level.id === levelId) ?? gameLevels[0];
  const octaveRange = levelInfo?.octaveRange[1] - levelInfo?.octaveRange[0];
  const { minutes, seconds } = millisecondsToMMSS(
    Number(levelInfo?.totalInitialGameTimeMs),
  );
  const noteSetIdsAndLabels = useGetNoteSetIdsAndLabels("major", "C");
  const notes = noteSetIdsAndLabels.find(
    (noteSet) => noteSet.id === levelInfo.noteSet,
  )?.label;

  return (
    <>
      <div className="col-span-3 -mr-4 mb-2 -ml-4 grid grid-cols-2 gap-2 bg-linear-to-r from-blue-400 to-blue-500 p-4 text-lg">
        <div className="level-attribute flex items-center">
          <div className="mr-1 text-sm font-bold">
            Time: {minutes}:{seconds}
          </div>
        </div>
        <div className="level-attribute flex items-center">
          <div className="mr-1 text-sm font-bold">
            Streak to win: {levelInfo?.streakToWin}
          </div>
        </div>
        <div className="level-attribute col-span-2 flex items-center">
          <div className="mr-1 text-sm font-bold">
            Key: {levelInfo?.keyCenter} - {notes}
          </div>
        </div>
      </div>
      <ul className="ml-4 list-disc leading-loose">
        <li className="level-attribute">
          {levelInfo?.amountOfNotesToGuess} note after cadence
        </li>
        <li className="level-attribute">
          {msToSeconds(levelInfo?.timePerNoteMs)} seconds per note
        </li>
        <li className="level-attribute">
          {" "}
          Cadence every {levelInfo?.cadenceEvery} note
        </li>
        <li className="level-attribute">{octaveRange} octaves</li>
      </ul>
    </>
  );
}
