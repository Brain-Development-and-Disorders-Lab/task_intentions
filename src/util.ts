/**
 * @file Utility functions for experiment data management and React rendering.
 *
 * Core functions:
 * - `calculatePoints`: Computes points from trials based on display type and column
 * - `react2html`: Converts React elements to HTML strings for jsPsych
 * - `getLocalStorage`: Retrieves experiment data from browser storage
 * - `initializeLocalStorage`: Sets up storage for new experiment runs
 * - `saveToLocalStorage`: Backs up experiment data during runtime
 * - `setCompleted`: Manages experiment completion state
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */
// React imports
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";

// File saving
import FileSaver from "file-saver";

// Logging
import consola from "consola";

// Experiment configuration
import { Configuration } from "./configuration";

// Feature flags
import { Flags } from "./flags";

/**
 * Calculate the points gained from all prior trials of a specific display type
 * @param {Display} display the type of display to calculate total points from
 * @param {string} column the name of the column storing the points received
 * from each trial
 * @return {number} total points received from trials with a specific display
 */
export const calculatePoints = (display: Display, column: string): number => {
  // Generate debugging text
  let pointText = "--- Points ---\n";
  pointText += `Display: ${display}\n`;
  pointText += `Column: ${column}\n`;

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
        if (realAnswer === "Option 1") {
          // Option 1
          points += row.partnerPoints_option1;
        } else {
          // Option 2
          points += row.partnerPoints_option2;
        }
      } else {
        if (realAnswer === "Option 1") {
          // Option 1
          points += row.playerPoints_option1;
        } else {
          // Option 2
          points += row.playerPoints_option2;
        }
      }
    }

    // Add bonus points for correct guesses (player only)
    if (column.startsWith("player")) {
      pointText += `Calculations: \n`;
      pointText += `\tPre-bonus: ${points}\n`;
      const correct = jsPsych.data
        .get()
        .filter({
          display: display,
          correctGuess: 1,
        })
        .count();
      points += correct * 10;
      pointText += `\tCorrect: ${correct} * 10\n`;
      pointText += `\tPost-bonus: ${points}\n`;
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
  pointText += `Total points: ${points}\n`;
  consola.debug(pointText);

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
 * Retrieve the task data from local storage
 * @return {BackupStorage[]} the data associated with the experiment
 */
export const getLocalStorage = (): BackupStorage[] => {
  const data = localStorage.getItem(Configuration.studyName);
  if (!data) {
    consola.warn("No data has been stored for this experiment");
    return [];
  }
  return JSON.parse(data);
};

/**
 * Initialize the local storage for a new experiment
 * @param {string} id the experiment ID
 */
export const initializeLocalStorage = (id: string): void => {
  // Get the list of existing experiments
  const stored: BackupStorage[] = getLocalStorage();
  if (stored.length > 0) {
    consola.info("Existing experiments:", stored);
    // Run a check to see if the most recent experiment has already been completed
    if (stored.length > 0 && !stored[stored.length - 1].completed) {
      consola.warn("Previous experiment was not completed");

      // If the user has not disabled the prompt, show it
      if (Flags.isEnabled("enablePreviousExperimentPrompt")) {
        const confirm = window.confirm(
          "The previous experiment was not completed. Click OK to download the data from the previous experiment, or click Cancel to discard the data and continue."
        );
        if (confirm) {
          const data = stored[stored.length - 1];
          FileSaver.saveAs(
            new Blob([JSON.stringify(data, null, "  ")], {
              type: "application/json",
            }),
            `${data.experimentID}_data.json`
          );
        } else {
          consola.warn("Discarding previous experiment data");
        }
      }
    }
  }

  // Add the new experiment to the list and store
  const experiment: BackupStorage = {
    experimentID: id,
    timestamp: Date.now(),
    completed: false,
    data: [],
  };
  stored.push(experiment);
  localStorage.setItem(Configuration.studyName, JSON.stringify(stored));
  consola.info(
    `Backup initialized for experiment ID: ${experiment.experimentID}`
  );
};

/**
 * Save data to the experiment's backup storage
 * @param {string} id the experiment ID
 * @param {any} data the jsPsych data object to store
 */
export const saveToLocalStorage = (id: string, data: any): void => {
  const stored = getLocalStorage();
  if (stored.length === 0) {
    consola.error(`No backup storage found for experiment: ${id}`);
    return;
  }

  // Iterate through the list of experiments
  for (const experiment of stored) {
    if (experiment.experimentID === id) {
      // Update the data for the experiment
      experiment.data.push(data);
      localStorage.setItem(Configuration.studyName, JSON.stringify(stored));
      consola.success(`Data saved to local storage for experiment ID: ${id}`);
      return;
    }
  }
  consola.error(
    `Unable to save data to backup storage for experiment ID: ${id}`
  );
};

/**
 * Toggle the completed flag in local storage
 * @param {string} id the experiment ID
 * @param {boolean} state the new state of the completed flag
 */
export const setCompleted = (id: string, state: boolean): void => {
  const stored = getLocalStorage();
  if (stored.length === 0) {
    consola.error(`No backup storage found for experiment: ${id}`);
    return;
  }

  // Iterate through the list of experiments
  for (const experiment of stored) {
    if (experiment.experimentID === id) {
      // Update the completed flag
      experiment.completed = state;
      localStorage.setItem(Configuration.studyName, JSON.stringify(stored));
      consola.success(`Completed flag set for experiment ID: ${id}, ${state}`);
      return;
    }
  }
  consola.error(`Unable to set completed flag for experiment ID: ${id}`);
};
