// File containing functions to check inputs for `useAlternateInput` mode
// Usage: Paste into Chrome DevTools console and run `fuzzing();`
// Note: jsPsych instructions screens will still require manual input to proceed,
// but the rest of the screens will accept the inputs'

/**
 * Send the `BINDINGS.PREVIOUS` keypress to the task
 */
const inputPrevious = () => {
  // Assumption: BINDINGS.PREVIOUS === 1
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: 1,
      keyCode: 49,
      code: "Digit1",
      which: 49,
    })
  );
};

/**
 * Send the `BINDINGS.NEXT` keypress to the task
 */
const inputNext = () => {
  // Assumption: BINDINGS.NEXT === 2
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: 2,
      keyCode: 50,
      code: "Digit2",
      which: 50,
    })
  );
};

/**
 * Send the `BINDINGS.SUBMIT` keypress to the task
 */
const inputSubmit = () => {
  // Assumption: BINDINGS.SUBMIT === 3
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: 3,
      keyCode: 51,
      code: "Digit3",
      which: 51,
    })
  );
};

/**
 * Fuzzing function to randomly send keypresses to the task
 * every 100ms
 */
const fuzzing = () => {
  // Begin passing keyboard input every 100ms
  window.setInterval(() => {
    const key = Math.floor(Math.random() * 3);
    if (key === 0) {
      inputSubmit();
    } else if (key === 1) {
      inputPrevious();
    } else if (key === 2) {
      inputNext();
    }
  }, 100);
};
