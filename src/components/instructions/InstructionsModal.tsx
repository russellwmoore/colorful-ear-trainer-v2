import { useEffect } from "react";

type InstructionsModalProps = {
  onClose: () => void;
};

export function InstructionsModal({ onClose }: InstructionsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    // 1. Viewport layer: covers the screen and centers the panel.
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 2. Backdrop: a sibling of the panel, so clicks inside the panel never reach it. */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 3. Panel: `relative` puts it above the backdrop; it scrolls on its own when content is taller than the screen. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="instructions-title"
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-lg border-2 border-foreground bg-background p-6 text-foreground shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4 border-b-2 border-foreground pb-4">
          <h2 id="instructions-title" className="text-2xl font-bold">
            Instructions
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close instructions"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl hover:bg-muted"
          >
            ×
          </button>
        </div>

        <ol className="ml-4 list-decimal space-y-2">
          <li>Press PLAY, the cadence will play in the selected key.</li>
          <li>Select the amount of notes that play after the cadence.</li>
          <li>
            Play back the notes you hear after the cadence with the keyboard.
          </li>
          <li>
            If you don't answer within the time limit, your answer is marked as
            wrong and your streak ends.
          </li>
          <li>
            You can play with the computer keyboard.
            <img src="musical-typing.png" width={400} alt="musical typing" />
          </li>
          <li>
            You can also play with a MIDI keyboard on Chrome, Firefox, and Opera
            (Unfortunately not Safari).
          </li>
          <li>
            When switching from "Play" mode to "Practice" mode, the options from
            the level persist. You can then adjust them to work on the level
            before trying again.
          </li>
        </ol>

        <div className="mt-4 border-t-2 border-foreground pt-4">
          Suggestions/comments:{" "}
          <a href="mailto:caleb@calebcurtis.com" className="underline">
            caleb@calebcurtis.com
          </a>
          <p className="mt-4 text-sm text-muted-foreground">
            Inspired by the old Ear Sharpener iOS app and the work of Charlie
            Banacos.
          </p>
        </div>
      </div>
    </div>
  );
}
