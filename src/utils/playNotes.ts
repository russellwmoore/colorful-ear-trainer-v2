import * as Tone from "tone";
import { synth } from "@/store/synth";

type Notes = {
  sequence: string[];
  duration: number;
};

type PlayNotesProps = {
  notes: Notes[];
  cadenceTempo: number;
  isNotesToGuess?: boolean;
  onNoteAttackFinish?: () => void;
  onAllNotesOff?: () => void;
};

export async function playNotes({
  notes,
  cadenceTempo,
  onNoteAttackFinish,
  onAllNotesOff,
}: PlayNotesProps) {
  await Tone.start();

  return new Promise((resolve) => {
    let time = 0;

    const now = Tone.now();
    notes.forEach(({ sequence, duration }) => {
      const durationWithTempo = (duration * 60) / cadenceTempo;
      synth.triggerAttackRelease(sequence, durationWithTempo, now + time);
      time += durationWithTempo;
    });

    // This is currently limited to single notes or single chords and not sequential notes or sequential chords
    // More nuance here could be acheived through scheduling this callback
    // with Tone.js transport
    onNoteAttackFinish?.();

    setTimeout(() => {
      onAllNotesOff?.();
      resolve(true);
    }, time * 1000);
  });
}
