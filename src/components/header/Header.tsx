// TODO: Everything for header
export function Header() {
  return (
    <header className="z-20 sticky top-0 h-16 w-full bg-theme-bg lg:bg-transparent border-b-2 border-theme-text">
      <div className="max-w-screen-2xl flex md:grid md:grid-cols-4 md:gap-4 px-4 h-full mx-auto">
        <div className="items-center flex">
          <div
            id="Mode"
            className="mode-toggle relative rounded-lg overflow-hidden grid grid-cols-2 w-full h-12 font-bold mr-4"
          >
            <div className="z-10">
              <input
                name="mode"
                type="radio"
                value="practice"
                id="TogglePractice"
                className="hidden"
                // checked
              />
              <label
                htmlFor="TogglePractice"
                className="cursor-pointer flex items-center justify-center h-full text-sm md:text-lg whitespace-nowrap"
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
              />
              <label
                htmlFor="TogglePlay"
                className="cursor-pointer flex items-center justify-center h-full text-sm   md:text-lg whitespace-nowrap"
              >
                Play Levels
              </label>
            </div>
            <div
              data-animated-label
              className="animated-toggle absolute w-1/2 h-full top-0 bottom-0 left-0 bg-linear-to-r from-yellow-600 to-yellow-400"
            ></div>
          </div>
        </div>
        <div className="md:text-center items-center md:justify-center hidden md:flex grow col-span-2">
          <h1 className="text-2xl font-bold tracking-wider bg-linear-to-r from-yellow-500 via-blue-300 to-purple-400">
            Colorful Ear Trainer
          </h1>
        </div>
        <div className="flex items-center justify-end grow">
          <div className="mr-4">
            {/* <modal-toggle aria-controls="Instructions"> */}
            <button className="w-12 h-12 rounded-full md:rounded-lg md:w-auto md:px-4 md:font-bold bg-linear-to-r from-yellow-600 to-yellow-400 text-theme-bg">
              <span className="md:hidden text-xl">?</span>
              <span className="hidden md:block">Instructions</span>
            </button>
            {/* </modal-toggle> */}
          </div>
          <div className="flex flex-col">
            <div className="dark-button">
              <input type="checkbox" id="DarkMode" name="darkmode" />
              <label htmlFor="DarkMode" aria-label="Dark Mode Toggler"></label>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
