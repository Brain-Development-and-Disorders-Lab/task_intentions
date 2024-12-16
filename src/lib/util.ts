/**
 * @file Utility functions used throughout different classes. The `clear`
 * function is straightforward, clearing the screen with optional extra
 * steps for React-based screens. `react2html` receives a React element
 * and returns HTML as a string.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Logging library
import consola from "consola";

// React imports
import { ReactElement } from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";

/**
 * Clear the HTML contents of an element without editing innerHTML. Unmounts
 * React instances if specified.
 * @param {HTMLElement} target element to clear the contents of
 * @param {boolean} isReact specify if additional clearing is required for
 * React content
 */
export const clear = (target: HTMLElement | null, isReact = false): void => {
  if (target) {
    consola.debug(`Target is not null, clearing...`);
    if (isReact) {
      consola.debug(`React-based target, unmounting...`);
      ReactDOM.unmountComponentAtNode(target);
    }

    // Clear existing HTML nodes
    while (target.firstChild) {
      target.removeChild(target.lastChild as Node);
    }
    consola.debug(`Cleared HTML nodes from target`);
  } else {
    consola.warn(`Target was not cleared, target not found`);
  }
};

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
  return ReactDOMServer.renderToStaticMarkup(element);
};
