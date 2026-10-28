import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { type GameMode, useEartrainerStore } from "@/store/store";

// TODO: Everything for header
export function Header() {
  const { theme, toggleTheme } = useTheme();
  const gameMode = useEartrainerStore((s) => s.gameMode);
  const setGameMode = useEartrainerStore((s) => s.setGameMode);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameMode(e.target.value as GameMode);
  };

  return (
    <header className="sticky top-0 z-20 h-16 w-full border-b-2 border-foreground bg-background lg:bg-transparent">
      <div className="mx-auto flex h-full max-w-screen-2xl px-4 md:grid md:grid-cols-4 md:gap-4">
        <div className="flex items-center">
          <div
            id="Mode"
            className="group relative mr-4 grid h-12 w-full grid-cols-2 overflow-hidden rounded-lg font-bold"
          >
            <div className="z-10">
              <input
                name="mode"
                type="radio"
                value="practice"
                id="TogglePractice"
                className="hidden"
                onChange={handleChange}
                checked={gameMode === "practice"}
              />
              <label
                htmlFor="TogglePractice"
                className="flex h-full cursor-pointer items-center justify-center text-sm whitespace-nowrap md:text-lg"
              >
                Practice Mode
              </label>
            </div>
            <div className="z-10">
              <input
                name="mode"
                type="radio"
                value="play"
                id="TogglePlay"
                className="hidden"
                onChange={handleChange}
                checked={gameMode === "play"}
              />
              <label
                htmlFor="TogglePlay"
                className="flex h-full cursor-pointer items-center justify-center text-sm whitespace-nowrap md:text-lg"
              >
                Play Levels
              </label>
            </div>
            <div className="absolute top-0 bottom-0 left-0 h-full w-1/2 bg-linear-to-r from-yellow-600 to-yellow-400 transition-transform group-has-[#TogglePlay:checked]:translate-x-full"></div>
          </div>
        </div>
        <div className="col-span-2 hidden grow items-center md:flex md:justify-center md:text-center">
          <h1 className="bg-linear-to-r from-yellow-500 via-blue-300 to-purple-400 bg-clip-text text-2xl font-bold tracking-wider text-transparent">
            Colorful Ear Trainer
          </h1>
        </div>
        <div className="flex grow items-center justify-end">
          <div className="mr-4">
            {/* <modal-toggle aria-controls="Instructions"> */}
            <button className="h-12 w-12 rounded-full bg-linear-to-r from-yellow-600 to-yellow-400 text-background md:w-auto md:rounded-lg md:px-4 md:font-bold">
              <span className="text-xl md:hidden">?</span>
              <span className="hidden md:block">Instructions</span>
            </button>
          </div>
          <div className="flex flex-col">
            <Switch
              id="DarkMode"
              name="darkmode"
              aria-label="Dark mode"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
