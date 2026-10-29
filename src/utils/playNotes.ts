import * as Tone from "tone";

import { synth } from "@/store/synth";
import { secondsToMs } from "@/utils/time";

type Notes = {
  sequence: string[];
  // In beats, scaled to seconds by cadenceTempo
  durationBeats: number;
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
    // Tone.js schedules in seconds, so time here stays in seconds
    let time = 0;

    const now = Tone.now();
    notes.forEach(({ sequence, durationBeats }) => {
      const durationWithTempo = (durationBeats * 60) / cadenceTempo;
      // triggerAttachRelease expects durationWithTempo to be a time in seconds, not milliseconds.
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
    }, secondsToMs(time));
  });
}
