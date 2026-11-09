import { useEartrainerStore } from "@/store/store";
import { featureFlags } from "@/utils/featureFlags";

import { Levels } from "./levels/Levels";
import { User } from "./user/User";
export function Options() {
  const gameMode = useEartrainerStore((s) => s.gameMode);
  const isUserDiabledWhilePlaying = featureFlags.disableUserOnPlay;
  const isPlaying = useEartrainerStore((s) => s.gameStatus) === "playing";
  const shouldDiableUserMenu = isUserDiabledWhilePlaying && isPlaying;
  return (
    <div className="relative grid gap-4 overflow-y-auto md:flex md:max-h-app md:flex-col md:gap-0 md:space-y-4">
      {shouldDiableUserMenu && (
        <div className="absolute z-50 flex h-full w-full bg-linear-to-b from-blue-950/70 to-blue-400/70">
          <h3 className="m-auto mt-auto rotate-35 overflow-hidden text-center text-4xl font-bold text-white opacity-50 drop-shadow-lg select-none">
            pause game to edit
          </h3>
        </div>
      )}
      <div className="order-1 flex-auto overflow-auto rounded-lg border-2 border-foreground p-4 md:order-2">
        {gameMode === "practice" && <User />}
        {gameMode === "play" && <Levels />}
      </div>
    </div>
  );
}
