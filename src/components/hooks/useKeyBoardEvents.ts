/**
 * Adds keydown listeners for Piano interaction. Will remove listeners
 * when the calling component unmounts
 * TODO: Integrate with gameplay
 */
export const useKeyBoardEvents = () => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Currently only listening for A so the browser doesn't crash all the time
    if (e.code !== "KeyA") return;
    console.log(e);
  };
  window.addEventListener("keydown", handleKeyDown);

  return () => window.removeEventListener("keydown", handleKeyDown);
};
