# Hexa Codex Frontend

This React/TypeScript application provides the questionnaire UI for the Hexa Codex personality diagnosis.
Questions and feature descriptions are stored locally under `src/constants` as JSON files and imported directly.
The user answers each yes/no question and the result is calculated on the client side.

## Files

- `src/constants/questions.json` – list of questions grouped by category
- `src/constants/features/catch_base.json` and `catch_giumeri.json` – official catch copies and descriptions
- `src/components/Questionnaire.tsx` – main questionnaire logic

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Matrix Rain Background

This project includes a simple Matrix-style background effect implemented in
`src/components/MatrixBackground.tsx`. The component renders a canvas that fills
the screen and displays green characters falling down like the movie
"The Matrix".

### Usage

1. No additional packages are required. The component uses the native Canvas API.
2. Import and place `<MatrixBackground />` near the root of your application, for
   example in `src/App.tsx` before other content so it stays in the back.
3. The canvas uses `position: fixed` and `z-index: -1` with `pointer-events:
   none`, ensuring it does not interfere with the UI.

The effect can be customised by editing the characters, font size, or colour in
`MatrixBackground.tsx`.
