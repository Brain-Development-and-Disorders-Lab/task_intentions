/**
 * @file 'ScreenPropFactory' class implementing a factory pattern for
 * generating props used to create each screen.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Logging library
import consola from "consola";

// Utility function
import { calculatePoints } from "src/lib/util";

// Handlers
import Handler from "src/lib/classes/Handler";

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
      // Player choice/guess screens
      case "playerChoice":
      case "playerChoicePractice":
      case "playerGuess":
      case "playerGuessPractice":
      case "playerChoice2": {
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          isPractice: this.trial.isPractice,
          participantPoints,
          partnerPoints,
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

      // Timed screens with callbacks
      case "matched":
      case "end": {
        returned.duration = this.trial.display === "matched" ? 2000 : 5000;
        returned.callback = this.handler.callback.bind(this.handler);
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
        };
        break;
      }

      case "matching": {
        returned.duration = 10000 + (1 + Math.random() * 5) * 1000;
        returned.callback = this.handler.callback.bind(this.handler);
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          fetchData: this.trial.fetchData,
          handler: this.handler.matching.bind(this.handler),
        };
        break;
      }

      // Simple handler screens
      case "selection":
      case "inference":
      case "agency":
      case "classification": {
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          handler: this.handler[this.trial.display].bind(this.handler),
        };
        break;
      }

      case "summary": {
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          postPhase,
          handler: this.handler.callback.bind(this.handler),
        };
        break;
      }

      default: {
        consola.error(`Unknown trial stage '${this.trial.display}'`);
        this.handler.callback();
        break;
      }
    }
    return returned;
  }
}

export default ScreenPropFactory;
