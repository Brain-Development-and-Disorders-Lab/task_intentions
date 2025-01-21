/**
 * @file 'ScreenPropFactory' class implementing a factory pattern for
 * generating props used to create each screen.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Logging library
import consola from "consola";

// Utility function
import { calculatePoints } from "src/util";

// Handlers
import Handler from "src/classes/Handler";

/**
 * @summary Factory pattern to generate props for screens
 */
class ScreenPropFactory implements Factory {
  // jsPsych trial data
  private trial: Trial;

  // Callback function from 'Handler' class
  private handler: Handler;

  /**
   * Default constructor
   * @param {Trial} trial jsPsych trial data
   * @param {Handler} handler callback function from 'Handler' class
   * @class
   */
  constructor(trial: Trial, handler: Handler) {
    this.trial = trial;
    this.handler = handler;
  }

  /**
   * Generate props
   * @return {any} props
   */
  public generate(): ScreenProps {
    const returned = {
      props: {},
      duration: 0,
      callback: () => {
        consola.debug(`No timeout callback defined`);
      },
    };

    // Sum the points from the previous trials
    const participantPoints = calculatePoints(
      this.trial.display,
      "playerPoints_selected"
    );
    const partnerPoints = calculatePoints(
      this.trial.display,
      "partnerPoints_selected"
    );

    // Get the prior phase, checking first that there was a prior trial
    let postPhase: Display = "playerChoice";
    if (jsPsych.data.get().last().values().length > 0) {
      postPhase = jsPsych.data.get().last().values()[0].display;
    }

    switch (this.trial.display) {
      // Phase 1, 2, and 3 trials
      case "playerChoice":
      case "playerChoicePractice":
      case "playerGuess":
      case "playerGuessPractice":
      case "playerChoice2": {
        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          isPractice: this.trial.isPractice,
          participantPoints: participantPoints,
          partnerPoints: partnerPoints,
          options: {
            one: {
              participant: this.trial.optionOneParticipant,
              partner: this.trial.optionOnePartner,
            },
            two: {
              participant: this.trial.optionTwoParticipant,
              partner: this.trial.optionTwoPartner,
            },
          },
          answer: this.trial.answer,
          handler: this.handler.option.bind(this.handler),
        };
        break;
      }

      // Matched screen
      case "matched":
        returned.duration = 2000;

        // Set the timeout callback function
        returned.callback = this.handler.callback.bind(this.handler);

        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
        };
        break;

      // Matching screen
      case "matching":
        // Random timeout for 'matching' process
        returned.duration = 10000 + (1 + Math.random() * 5) * 1000;

        // Set the timeout callback function
        returned.callback = this.handler.callback.bind(this.handler);

        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          fetchData: this.trial.fetchData,
          handler: this.handler.matching.bind(this.handler),
        };
        break;

      // Selection screen
      case "selection":
        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          handler: this.handler.selection.bind(this.handler),
        };
        break;

      // Inference screen
      case "inference":
        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          handler: this.handler.inference.bind(this.handler),
        };
        break;

      // Agency screen
      case "agency":
        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          handler: this.handler.agency.bind(this.handler),
        };
        break;

      // Classification screen
      case "classification":
        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          handler: this.handler.classification.bind(this.handler),
        };
        break;

      // Summary screen
      case "summary":
        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          postPhase: postPhase,
          handler: this.handler.callback.bind(this.handler),
        };
        break;

      // End screen
      case "end":
        // Set the timeout duration
        returned.duration = 5000;

        // Set the timeout callback function
        returned.callback = this.handler.callback.bind(this.handler);

        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
        };
        break;

      // Default error state
      default:
        // Log an error message and finish the trial
        consola.error(`Unknown trial stage '${this.trial.display}'`);
        this.handler.callback();
        break;
    }
    return returned;
  }
}

export default ScreenPropFactory;
