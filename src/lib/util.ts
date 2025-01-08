/**
 * @file Utility functions used throughout different classes. The `clear`
 * function is straightforward, clearing the screen with optional extra
 * steps for React-based screens. `react2html` receives a React element
 * and returns HTML as a string.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */
// React imports
import { ReactElement } from "react";
import ReactDOMServer from "react-dom/server";

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
