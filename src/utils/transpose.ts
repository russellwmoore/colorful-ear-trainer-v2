import {
  flats,
  sharps,
  type FlatName,
  type KeyCenterType,
  type NoteName,
} from "./noteNames";

const notes: (readonly NoteName[])[] = [
  flats,
  flats,
  sharps,
  flats,
  sharps,
  flats,
  flats,
  sharps,
  flats,
  sharps,
  flats,
  sharps,
];

type TransposeType = {
  set: number[];
  keyCenter: FlatName;
  octave?: number;
  flatten?: boolean;
  withOctave?: boolean;
};

export function transpose({
  set,
  keyCenter,
  octave = 4,
  flatten = true,
  withOctave = false,
}: TransposeType) {
  const keyCenterInt = flats.indexOf(keyCenter);
  return set.map((note: number) => {
    const noteValue = note + keyCenterInt;
    const name = notes[keyCenterInt][normalizeIndex(noteValue)];
    const oct = noteValue < 0 && flatten ? octave : octave - 1;
    return withOctave ? `${name}${oct}` : name;
  });
}

// TODO this is not a complete function. Need to determine the best inputs here.
// This could be a good argument for keycenters as numbers!
export function notesAsNumber(set: NoteName[], keyCenter: KeyCenterType) {
  const keyCenterInt = flats.indexOf(keyCenter);
  return set.map((name) => {
    return notes[keyCenterInt].indexOf(name);
  });
}

function normalizeIndex(i: number) {
  return ((i % 12) + 12) % 12;
}

//[-12, 0, 4, 7],

export function numbersToNotes(keyCenter: KeyCenterType, arrOfNotes: number[]) {
  const offsetKeyIndex = flats.indexOf(keyCenter);
  return arrOfNotes.map((note) => {
    const normalizedIndex = Math.abs((note + offsetKeyIndex) % 12);
    return flats[normalizedIndex];
  });
}

// class KeySelector extends HTMLElement {
//   constructor() {
//     super();
//     this.set = this.querySelector("#NoteSet"); // dropdown for notes
//     this.inactiveSet = this.querySelector("#InactiveSet"); // the selects for all note sets
//     this.setSelector = this.querySelectorAll("[data-template]"); // All of the note sets and various UI around that are related to key changes

//     document.dispatchEvent(new CustomEvent("transpose"));
//     document.addEventListener(
//       "user:update",
//       this.transposeSetSelector.bind(this),
//     );
//     document.addEventListener(
//       "transpose",
//       this.transposeSetSelector.bind(this),
//     );
//     this.transposeSetSelector();
//   }

//   transposeSetSelector(e) {
//     debugger;
//     const tonalityElm = document.getElementById("Tonality");
//     const tonality = tonalityElm.value.split(",")[0]; // major/minor
//     const selectedIndex = this.set.selectedIndex;
//     // transpose set select element
//     this.setSelector.forEach((set, i) => {
//       const regex = /\{(.*?)}/gm;
//       let str = set.getAttribute("data-template");
//       let m;

//       // This updates all of the
//       while ((m = regex.exec(str)) !== null) {
//         if (m.index === /\{(.*?)}/gm.lastIndex) {
//           regex.lastIndex++;
//         }
//         // See the utility of the transpose function here.
//         str = str.replaceAll(
//           m[0],
//           Transposer.transpose({ set: [m[1]], keyCenter: keyCenterElm.value }),
//         );
//       }
//       set.innerText = str;
//       // apply major / minor filter
//       if (!set.hasAttribute("data-tonality")) return;
//       if (set.getAttribute("data-tonality").indexOf(tonality) === -1) {
//         this.inactiveSet.appendChild(set);
//       } else {
//         this.set.appendChild(set);
//       }
//     });

//     if (this.set[selectedIndex]) {
//       this.set.value = this.set[selectedIndex].value;
//     }
//   }
// }

// customElements.define("key-selector", KeySelector);
