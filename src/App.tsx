import { Piano } from "./components/piano/Piano";
import { User } from "./components/user/User";
import { Game } from "./components/game/Game";
import { Header } from "./components/header/Header";
import { FancyBackground } from "./components/FancyBackground";

function App() {
  return (
    <div className="relative isolate flex flex-col items-center justify-center">
      <Header />
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="grid gap-4 overflow-auto md:flex md:max-h-app md:flex-col md:gap-0 md:space-y-4">
          <User />
        </div>
        <div className="md:order-3 md:col-span-2">
          <div className="flex flex-col space-y-4 overflow-hidden md:h-app">
            <Piano />
          </div>
        </div>
        <div className="order-4 flex flex-col space-y-4 overflow-auto md:order-2 md:max-h-app lg:order-4">
          <Game />
        </div>
      </div>
      <FancyBackground />
    </div>
  );
}

export default App;
