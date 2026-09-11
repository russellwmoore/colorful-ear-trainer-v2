import { Piano } from "./components/piano/Piano";
import { User } from "./components/user/User";
import { Game } from "./components/game/Game";
import { Header } from "./components/header/Header";

function App() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Header />
      <div className="grid w-full grid-cols-1 gap-4 p-4 mx-auto md:grid-cols-2 lg:grid-cols-4 max-w-screen-2xl">
        <div className="grid gap-4 md:gap-0 md:flex md:flex-col md:space-y-4 md:max-h-(--fullHeight) overflow-auto">
          <User />
        </div>
        <div className="md:col-span-2 md:order-3">
          <div className="flex flex-col md:max-h-(--fullHeight) space-y-4 overflow-hidden">
            <Piano />
          </div>
        </div>
        <div className="order-4 md:order-2 lg:order-4 flex flex-col md:max-h-(--fullHeight) overflow-auto space-y-4">
          <Game />
        </div>
      </div>
    </div>
  );
}

export default App;
