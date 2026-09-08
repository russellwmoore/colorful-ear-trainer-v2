import { KeyCenter } from "./components/KeyCenter";
import { RandomizeBox } from "./components/RandomizeBox";

export function User() {
  return (
    <div className="grid gap-4 md:gap-0 md:flex md:flex-col md:space-y-4 md:max-h-[var(--fullHeight)] overflow-auto">
      <div className="card order-1 md:order-2 overflow-auto flex-auto">
        {/* TODO: level info */}
        {/* <%- include('_level-info.ejs') %> */}

        <div id="UserCard">
          <h2 className="-mt-4 -ml-4 -mr-4 bg-theme-text text-theme-bg font-bold px-4 py-2 text-lg">
            Set Options:
          </h2>
          <form>
            {/* TODO: Form Logic */}
            {/* <key-selector> */}
            {/* TODO: KeySelector Logic */}
            <div className="grid grid-cols-6 gap-y-4 gap-x-3 mb-4 mt-4">
              <div className="col-span-4 border-theme-text border rounded-lg p-2 grid grid-cols-2 gap-2">
                <KeyCenter />
                <RandomizeBox />
                <div className="col-span-1">
                  <label htmlFor="KeyCenter">Key:</label>

                  <div className="select-wrap">
                    <select
                      name="keycenter"
                      id="KeyCenter"
                      className="input w-full"
                    >
                      <option value="0" selected>
                        C
                      </option>
                      <option value="1">Db</option>
                      <option value="2">D</option>
                      <option value="3">Eb</option>
                      <option value="4">E</option>
                      <option value="5">F</option>
                      <option value="6">Gb</option>
                      <option value="7">G</option>
                      <option value="8">Ab</option>
                      <option value="9">A</option>
                      <option value="10">Bb</option>
                      <option value="11">B</option>
                    </select>
                  </div>
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="RandomKey"
                    className="text-xs text-theme-text"
                  >
                    Randomize
                  </label>
                  <label className="toggle inline-block my-1">
                    <input id="RandomKey" name="randomkey" type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              <div className="col-span-2">
                {/* <%- include('_cadence-selector.ejs') %> */}
                {/* TODO: cadenceSelector */}
              </div>
              <div className="col-span-6">
                {/* <%- include('_noteset.ejs') %> */}
                {/* TODO: noteSet */}
              </div>
              <div className="col-span-3 relative">
                <label htmlFor="NoteCount">Notes:</label>
                {/* <%- include('_qty.ejs', { id: 'NoteCount', name: 'note_count', min: 1, max: 12, value: 1, step: 1 }) %> */}
                {/* TODO: qty */}
                <div className="text-xs text-theme-secondary absolute w-full">
                  after cadence
                </div>
              </div>
              {/* </key-selector> */}
              <div className="col-span-3">
                <label htmlFor="CountdownMinutes">Total Time:</label>
                {/* <minutes-seconds class="flex time-input mt-1 bg-theme-bg" id="Countdown"> */}
                {/* TODO: minutes-seconds */}
                <input type="hidden" name="countdown" value="300" />
                <button
                  type="button"
                  className="time-incrementer"
                  data-decrement=""
                  aria-label="Decrease Time"
                >
                  –
                </button>
                <input
                  id="CountdownMinutes"
                  inputMode="numeric"
                  min="0"
                  max="99"
                  name="countdown-minutes"
                  value="05"
                  pattern="\d{2}"
                  step="1"
                  autoComplete="off"
                  data-countdown
                />
                :
                <input
                  id="CountdownSeconds"
                  inputMode="numeric"
                  min="0"
                  max="59"
                  name="countdown-seconds"
                  value="00"
                  pattern="\d{2}"
                  step="1"
                  autoComplete="off"
                  data-countdown
                />
                <button
                  type="button"
                  className="time-incrementer"
                  data-increment=""
                  aria-label="Increase Time"
                >
                  +
                </button>
                {/* </minutes-seconds> */}
                <div className="text-xs text-theme-secondary">
                  countdown MM:SS
                </div>
              </div>
              <div className="col-span-3">
                <label htmlFor="Timelimit">Time Per Note:</label>
                {/* <%- include('_qty.ejs', { id: 'Timelimit', name: 'timelimit', min: 0.5, max: 999999, value: 5, step: 0.5 }) %> */}
                {/* TODO: quantity timeLimit */}
                <div className="text-xs text-theme-secondary">seconds</div>
              </div>
              <div className="col-span-3">
                <label htmlFor="Octave">Cadence every:</label>
                {/* <%- include('_qty.ejs', { id: 'Octave', name: 'cadenceevery', min: 1, max: 999999, value: 1, step: 1 }) %> */}
                {/* TODO: quantity octave */}
                <div className="text-xs text-theme-secondary">question(s)</div>
              </div>
              <div className="col-span-3 relative">
                <label htmlFor="Octave">Octave:</label>
                {/* <%- include('_qty.ejs', { id: 'Octave', name: 'cadenceoctave', min: 1, max: 7, value: 4, step: 1 }) %> */}
                {/* TODO: quantity cadenceOctave */}
                <div className="text-xs text-theme-secondary">of cadence</div>
              </div>
              <div className="col-span-full">
                <label htmlFor="NoteRange">Range (Octaves):</label>
                <div id="NoteRange" /*name="range"*/></div>
                {/* TODO: investigate NoteRange */}
              </div>
            </div>
          </form>
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
