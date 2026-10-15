import * as Tone from "tone";
import { synth } from "@/store/synth";

type Notes = {
  sequence: string[];
  duration: number;
};

type PlayNotesProps = {
  notes: Notes[];
  cadenceTempo: number;
};

export async function playNotes({ notes, cadenceTempo }: PlayNotesProps) {
  await Tone.start();

  return new Promise((resolve) => {
    let time = 0;

    const now = Tone.now();
    notes.forEach(({ sequence, duration }) => {
      const durationWithTempo = (duration * 60) / cadenceTempo;
      synth.triggerAttackRelease(sequence, durationWithTempo, now + time);
      time += durationWithTempo;
    });

    const id = setTimeout(() => {
      clearTimeout(id);
      resolve(true);
    }, time * 1000);
  });
}
