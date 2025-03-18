/**
 * @file Utility functions used throughout different classes. The `clear`
 * function is straightforward, clearing the screen with optional extra
 * steps for React-based screens. `react2html` receives a React element
 * and returns HTML as a string.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */
// React imports
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";

// Logging
import consola from "consola";

/**
 * Calculate the points gained from all prior trials of a specific display type
 * @param {Display} display the type of display to calculate total points from
 * @param {string} column the name of the column storing the points received
 * from each trial
 * @return {number} total points received from trials with a specific display
 */
export const calculatePoints = (display: Display, column: string): number => {
  let points = 0;

  if (display === "playerGuess") {
    // `playerGuess` phases calculated differently, since options are presented
    // in reverse order
    const dataCollection = jsPsych.data
      .get()
      .filter({
        display: display,
      })
      .values();

    // Iterate through the data collection
    for (const row of dataCollection) {
      const realAnswer = row.realAnswer;
      // Determine if for the player or the partner
      if (column.startsWith("player")) {
        // Points for the player, sum partner points
        if (realAnswer === "Option 1") {
          // Option 1
          points += row.partnerPoints_option1;
        } else {
          // Option 2
          points += row.partnerPoints_option2;
        }
      } else {
        // Points for the partner, sum player points
        if (realAnswer === "Option 1") {
          // Option 1
          points += row.playerPoints_option1;
        } else {
          // Option 2
          points += row.playerPoints_option2;
        }
      }
    }
  } else {
    // All other phases can be calculated using a jsPsych data query
    points = jsPsych.data
      .get()
      .filter({
        display: display,
      })
      .select(column)
      .sum();
  }
  return points;
};

/**
 * Utility function to turn React elements into a string of HTML markup
 * @param {ReactElement} element the React element to render
 * @return {string} raw HTML
 */
export const react2html = (element: ReactElement): string => {
  // Suppress console warnings during server-side rendering
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (/useLayoutEffect/.test(args[0])) return;
    originalError.call(console, ...args);
  };

  const html = renderToString(element);

  // Restore console.error
  console.error = originalError;

  return html;
};

/**
 * Get task data from local storage
 * @param {string} key the key being used by the experiment
 * @return {any} the data associated with the key
 */
export const getLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  if (!data) {
    consola.warn("No data has been stored for this experiment");
    return null;
  }
  return JSON.parse(data);
};

/**
 * Initialize the local storage for a new experiment
 * @param {string} key the key being used by the experiment
 */
export const initializeLocalStorage = (key: string) => {
  const storage: BackupStorage = {
    experimentID: key,
    timestamp: Date.now(),
    completed: false,
    data: {},
  };
  localStorage.setItem(key, JSON.stringify(storage));
  consola.info(`Local storage initialized for experiment: ${key}`);
};

/**
 * Save data to local storage
 * @param {string} key the key being used by the experiment
 * @param {any} data the data to store
 */
export const saveToLocalStorage = (key: string, data: any) => {
  const storage = getLocalStorage(key);
  if (!storage) {
    consola.error(`No local storage found for experiment: ${key}`);
    return;
  }
  storage.data = data;
  localStorage.setItem(key, JSON.stringify(storage));
  consola.success(`Data saved to local storage for experiment: ${key}`);
};
