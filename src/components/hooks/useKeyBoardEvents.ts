export const useKeyBoardEvents = () => {
  const handleKeyDown = (e: KeyboardEvent) => {
    console.log(e);
  };
  window.addEventListener("keydown", handleKeyDown);

  return () => window.removeEventListener("keydown", handleKeyDown);
};
