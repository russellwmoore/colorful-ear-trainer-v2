import { useEartrainerStore } from "@/store/store";

import { Levels } from "./levels/Levels";
import { User } from "./user/User";
export function Options() {
  const gameMode = useEartrainerStore((s) => s.gameMode);
  return (
    <div className="grid gap-4 overflow-auto md:flex md:max-h-app md:flex-col md:gap-0 md:space-y-4">
      <div className="order-1 flex-auto overflow-auto rounded-lg border-2 border-foreground p-4 md:order-2">
        {gameMode === "practice" && <User />}
        {gameMode === "play" && <Levels />}
      </div>
    </div>
  );
}
