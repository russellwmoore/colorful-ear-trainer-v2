# Colorful Ear Trainer V2

This is a port of Colorful Eartrainer (https://github.com/calebcurtis8/colorful-ear-trainer) from Snowpack, Tailwind, EJS to Typescript, React, Vite, Zustand, Tailwind, and Vitest.

Based on the ear training principles of Charlie Banacos. Helps develop immediate response to notes in a harmonic context.

## What it does:

1. Plays a cadence in your selected key, tonality, and progression
2. Plays a random note or notes from a limited or unlimited set of notes within a particular octave range.
3. You play the notes you hear into the keyboard.

### You can go simple:

- Which single note within a C major triad is played? You have 5 seconds to answer.
- Which single note within a C major scale is played? You have 4 seconds to answer.

### Or more difficult:

- Which single note within the chromatic scale is played? You have 2 seconds to answer.

### Or more difficult:

- What are the 4 notes within the chromatic scale that are played, with a 3 octave spread? You have 2 seconds per note to answer.

## Design to your heart's content.

As you succeed the game gets more and more colorful, until you make a mistake!
What I love about this approach is that everything you are quizzed on is placed in context, and you are forced to respond quickly. This creates real, applicable, knowledge and heightened awareness when improvising or listening to music.

## Features:

- Global timer - ie. how much can you accomplish in 5 minutes
- Dark Mode
- Random keys
- Streaks and high scores that persist across sessions
- Logic to de-prioritize notes that you get right more often (TODO for V2)
- Play cadence every X notes - so you can hear the cadence less often
- Minor tonality cadence
- Multiple cadence options
- Octave range selector from octaves 0-7

TODO:

- Levels and a "curriculum" to lead you through parameters that slowly and steadily increase in difficulty

# How to develop

- Clone repo
- `npm install`
- To start hot reloading dev server `npm run dev`

## Useful scripts

- `npm run build`: builds the current app and overwrites current `dist` directory
- `npm run preview`: runs app from the currently built `dist` directory
- `npm run build && npm run preview`: build and preview `dist` directory that will be deployed, no hot reloading
- `npm test [filter]`: runs the test runner in watch mode. Optional `filter` param can also filter by keyword or actual file path to test.
  - Examples:
    - `npm run test`: runs all tests
    - `npm run test countdown`: runs all tests that have countdown in their filepath
    - `npm run test countdownUtils.test.ts`: runs countdownUtils.test.ts specifically
- `npm run deploy`: deploys the current branch to github pages (will need to decide how and when to deploy things regarding tests passing, CI/CD process etc)

# Official React + TypeScript + Vite jargon

\*Will get rid of any extra fluff here soon.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
