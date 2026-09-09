import { Cadence } from "./components/Cadence";
import { KeyCenter } from "./components/KeyCenter";
import { NoteQuantitiesInput } from "./components/quantities/NoteQuantitiesInput";
import { NoteSet } from "./components/NoteSet";
import { CadenceEveryInput } from "./components/quantities/CadenceEveryInput";
import { RandomizeBox } from "./components/RandomizeBox";
import { TimePerNoteInput } from "./components/quantities/TimePerNoteInput";
import { OctaveInput } from "./components/quantities/OctaveInput";

export function User() {
  return (
    <div className="grid gap-4 md:gap-0 md:flex md:flex-col md:space-y-4 md:max-h-(--fullHeight) overflow-auto">
      <div className="card order-1 md:order-2 overflow-auto flex-auto">
        {/* TODO: level info */}
        {/* <%- include('_level-info.ejs') %> */}

        <div id="UserCard">
          <h2 className="-mt-4 -ml-4 -mr-4 bg-theme-text text-theme-bg font-bold px-4 py-2 text-lg">
            Set Options:
          </h2>
          <div className="grid grid-cols-6 gap-y-4 gap-x-3 mb-4 mt-4">
            <div className="col-span-4 border-theme-text border rounded-lg p-2 grid grid-cols-2 gap-2">
              <KeyCenter />
              <RandomizeBox />
            </div>
            <div className="col-span-2">
              <Cadence />
            </div>
            <div className="col-span-6">
              <NoteSet />
            </div>
            <div className="col-span-3">
              <NoteQuantitiesInput />
            </div>
            {/* TODO Time input */}
            <div className="col-span-3">
              <TimePerNoteInput />
            </div>
            <div className="col-span-3">
              <CadenceEveryInput />
            </div>
            <div className="col-span-3">
              <OctaveInput />
            </div>
            <div className="col-span-full">
              {/* <label htmlFor="NoteRange">Range (Octaves):</label> */}
              <div id="NoteRange" /*name="range"*/></div>
              {/* TODO: investigate NoteRange */}
            </div>
          </div>
        </div>
        <div className="-ml-4 -mr-4 -mb-4 p-4 mt-4 border-t-2 border-theme-text">
          <label htmlFor="Bpm">Cadence Tempo:</label>
          {/* <%- include('_qty.ejs', { id: 'BPM', name: 'bpm', min: 1, max: 400, value: 60, step: 1, inputclass: 'min-w-[3ch]' }) %> */}
          {/* TODO: quantity BPM */}
          <div className="text-xs text-theme-secondary">beats per minute</div>
        </div>
      </div>
    </div>
  );
}
