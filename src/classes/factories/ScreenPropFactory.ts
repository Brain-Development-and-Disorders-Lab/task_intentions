/**
 * @file `ScreenPropFactory` class for screen property management.
 *
 * This factory class generates and manages props for all experiment screens,
 * ensuring consistent property initialization and type safety. Key features include:
 * - Screen-specific prop generation methods
 * - Type-safe property validation
 * - Centralized prop management
 * - Integration with experiment state
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Logging library
import consola from "consola";

// Utility function
import { calculatePoints } from "src/util";

// Configuration
import { Configuration } from "src/configuration";

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
   * @constructor
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
          spotlight: this.trial.spotlight,
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

      // Loaded screen
      case "loaded":
        returned.duration = 2000;

        // Set the timeout callback function
        returned.callback = this.handler.callback.bind(this.handler);

        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          loadingType: this.trial.loadingType,
        };
        break;

      // Loading screen
      case "loading":
        if (this.trial.loadingType === "social") {
          // 1-4 second timeout for "social" state
          returned.duration = 1000 + (1 + Math.random() * 3) * 1000;
        } else {
          // 10-15 second timeout for "matching" state
          returned.duration = 10000 + (1 + Math.random() * 5) * 1000;
        }

        // Set the timeout callback function
        returned.callback = this.handler.callback.bind(this.handler);

        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          loadingType: this.trial.loadingType || "default", // Default to "default" type if not specified
          fetchData: this.trial.fetchData,
          handler: this.handler.loading.bind(this.handler),
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

      // Status screen
      case "status":
        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          handler: this.handler.status.bind(this.handler),
        };
        break;

      // DASS screen
      case "dass":
        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          version: Configuration.manipulations.useAdultQuestionnaires ? "adult" : "adolescent",
          handler: this.handler.dass.bind(this.handler),
        };
        break;

      // Screentime screen
      case "screentime":
        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          handler: this.handler.screentime.bind(this.handler),
        };
        break;

      // Demographics screen
      case "demographics":
        // Setup the props
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          version: Configuration.manipulations.useAdultQuestionnaires ? "adult" : "adolescent",
          handler: this.handler.demographics.bind(this.handler),
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

      // Waiting screen
      case "waiting":
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          mode: this.trial.mode,
          handler: this.handler.callback.bind(this.handler),
        };
        break;

      // Cyberball screen
      case "cyberball":
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          isInclusive: this.trial.isInclusive,
          partnerHighStatus: this.trial.partnerHighStatus,
          probabilities: this.trial.probabilities,
          handler: this.handler.cyberball.bind(this.handler),
        };
        break;

      // Resources screen
      case "resources":
        returned.props = {
          trial: this.trial.trial,
          display: this.trial.display,
          callback: this.handler.callback.bind(this.handler),
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
