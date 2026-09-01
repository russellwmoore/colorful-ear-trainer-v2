function App() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div>Header</div>
      <div className="grid w-full grid-cols-1 gap-4 p-4 mx-auto md:grid-cols-2 lg:grid-cols-4 max-w-screen-2xl">
        <div className="grid gap-4 md:gap-0 md:flex md:flex-col md:space-y-4 md:max-h-[var(--fullHeight)] overflow-auto">
          <p>
            User User User User User User User User User User User User User
            User User User
          </p>
        </div>
        <div className="md:col-span-2 md:order-3">
          <div className="flex flex-col md:max-h-[var(--fullHeight)] space-y-4 overflow-hidden">
            <p>
              Keyboard Keyboard Keyboard Keyboard Keyboard Keyboard Keyboard
              Keyboard Keyboard Keyboard Keyboard Keyboard Keyboard Keyboard
              Keyboard Keyboard Keyboard
            </p>
          </div>
        </div>
        <div className="order-4 md:order-2 lg:order-4 flex flex-col md:max-h-[var(--fullHeight)] overflow-auto space-y-4">
          <p>
            Play Play Play Play Play Play Play Play Play Play Play Play Play
            Play Play Play Play Play
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
