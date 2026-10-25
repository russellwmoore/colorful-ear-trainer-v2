import { Cadence } from "./components/Cadence";
import { KeyCenter } from "./components/KeyCenter";
import { NoteQuantitiesInput } from "./components/quantities/NoteQuantitiesInput";
import { NoteSet } from "./components/NoteSet";
import { CadenceEveryInput } from "./components/quantities/CadenceEveryInput";
import { RandomizeBox } from "./components/RandomizeBox";
import { TimePerNoteInput } from "./components/quantities/TimePerNoteInput";
import { OctaveInput } from "./components/quantities/OctaveInput";
import { CadenceTempoInput } from "./components/quantities/CadenceTempoInput";
import { TotalTimeInput } from "./components/quantities/TotalTimeInput";
import { RangeInput } from "./components/quantities/RangeInput";

export function User() {
  return (
    <div className="grid gap-4 overflow-auto md:flex md:max-h-app md:flex-col md:gap-0 md:space-y-4">
      <div className="order-1 flex-auto overflow-auto rounded-lg border-2 border-foreground p-4 md:order-2">
        {/* TODO: level info */}
        {/* <%- include('_level-info.ejs') %> */}
        <div id="UserCard">
          <h2 className="-mt-4 -mr-4 -ml-4 bg-foreground px-4 py-2 text-lg font-bold text-background">
            Set Options:
          </h2>
          <div className="mt-4 mb-4 grid grid-cols-6 gap-x-3 gap-y-4">
            <div className="col-span-4 grid grid-cols-2 gap-2 rounded-lg border border-foreground p-2">
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
            <div className="col-span-3">
              <TotalTimeInput />
            </div>
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
              <RangeInput />
            </div>
          </div>
        </div>
        <div className="mt-4 -mr-4 -mb-4 -ml-4 border-t-2 border-foreground p-4">
          <CadenceTempoInput />
        </div>
      </div>
    </div>
  );
}
