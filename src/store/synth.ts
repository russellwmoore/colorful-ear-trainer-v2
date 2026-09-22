import * as Tone from "tone";

export const synth = new Tone.Sampler({
  urls: {
    C2: `C2.mp3`,
    G2: `G2.mp3`,
    C3: `C3.mp3`,
    G3: `G3.mp3`,
    C4: `C4.mp3`,
    G4: `G4.mp3`,
    Bb4: `Bb4.mp3`,
    G5: `G5.mp3`,
  },
  baseUrl: "samples/",
}).toDestination();

synth.release = 1;
