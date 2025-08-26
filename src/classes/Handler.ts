/**
 * @file Handler class for managing trial-specific event handling and data collection
 *
 * This class encapsulates all handler functions that are called during a specific trial
 * in the experiment. Each trial creates a new Handler instance, which receives:
 * - The current dataframe for data collection
 * - A callback function for trial-specific events
 *
 * The Handler class is responsible for:
 * - Processing participant responses and interactions
 * - Recording trial data and timestamps
 * - Managing trial state transitions
 * - Coordinating with the Compute class for partner behavior
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Logging library
import consola from "consola";

/**
 * @summary Utility class exposing each of the different handlers
 * used by the screens of the game
 */
class Handler {
  private dataframe: TrialData;
  public callback: () => void;

  /**
   * Default constructor
   * @param {Data} dataframe jsPsych data
   * @param {function} callback default callback after the handlers
   * @constructor
   */
  constructor(dataframe: TrialData, callback: () => void) {
    this.dataframe = dataframe;
    this.callback = callback;
  }

  /**
   * Get the dataframe being modified
   * @return {Data}
   */
  public getDataframe(): TrialData {
    return this.dataframe;
  }

  /**
   * Handle selection events in a particular trial
   * @param {Options} option selected option
   * @param {Points} points selected option
   * @param {Options} answer selected option
   */
  public option(
    option: Options,
    points: { options: Points },
    answer: Options
  ): void {
    consola.debug("Option response:", option, points, answer);
    // Store the correct answer
    this.dataframe.realAnswer = answer;

    // Check if they chose the correct option. We record this
    // for all trials, but we only need 'playerGuess'-type trials
    this.dataframe.correctGuess = option === answer ? 1 : 0;

    // Store the participant selection
    this.dataframe.selectedOption_player = option === "Option 1" ? 1 : 2;

    // Store the points as provided
    this.dataframe.playerPoints_option1 = points.options.one.participant;
    this.dataframe.partnerPoints_option1 = points.options.one.partner;
    this.dataframe.playerPoints_option2 = points.options.two.participant;
    this.dataframe.partnerPoints_option2 = points.options.two.partner;

    // All other trials, add points from option participant selected
    if (option === "Option 1") {
      this.dataframe.playerPoints_selected = points.options.one.participant;
      this.dataframe.partnerPoints_selected = points.options.one.partner;
    } else {
      this.dataframe.playerPoints_selected = points.options.two.participant;
      this.dataframe.partnerPoints_selected = points.options.two.partner;
    }

    // Finish trial
    this.callback();
  }

  /**
   * Handler called after avatar selected
   * @param {number} selection avatar selection key
   */
  public selection(selection: number): void {
    consola.debug("Selection response:", selection);
    // Update the global Experiment state
    window.Experiment.getState().set("participantAvatar", selection);

    // Finish trial
    this.callback();
  }

  /**
   * Handler called after questions completed
   * @param {number} one value of the first slider
   * @param {number} two value of the second slider
   */
  public inference(one: number, two: number): void {
    consola.debug("Inference responses:", one, two);
    // Store the responses
    this.dataframe.questionnaireResponseInferenceSelfish = one;
    this.dataframe.questionnaireResponseInferenceHarm = two;

    // Finish trial
    this.callback();
  }

  /**
   * Handler called after agency question completed
   * @param {number} value value of the agency slider
   */
  public agency(value: number): void {
    consola.debug("Agency response:", value);
    // Store the responses
    this.dataframe.questionnaireResponseAgency = value;

    // Finish trial
    this.callback();
  }

  /**
   * Handler called after classification question completed
   * @param {string} type the participant's classification
   * of their partner
   */
  public classification(type: string): void {
    consola.debug("Classification response:", type);
    // Store the responses
    this.dataframe.questionnaireResponseClassification = type;

    // Finish trial
    this.callback();
  }

  /**
   * Handler called after status questions completed
   * @param {number} followers number of followers
   * @param {number} averageLikes average number of likes
   * @param {number} friends number of friends
   * @param {number} socialCloseness social closeness rating
   */
  public status(
    followers: number,
    averageLikes: number,
    friends: number,
    socialCloseness: number
  ): void {
    consola.debug("Status responses:", followers, averageLikes, friends, socialCloseness);
    // Store the responses
    this.dataframe.questionnaireResponseStatusFollowers = followers;
    this.dataframe.questionnaireResponseStatusAverageLikes = averageLikes;
    this.dataframe.questionnaireResponseStatusFriends = friends;
    this.dataframe.questionnaireResponseStatusSocialCloseness = socialCloseness;

    // Finish trial
    this.callback();
  }

  /**
   * Handler called after loading request completed (for matching state)
   * @param {number[]} participantParameters generated model
   * parameters for participant
   * @param {number[]} partnerParameters generated model parameters for partner
   */
  public loading(
    participantParameters: number[],
    partnerParameters: number[]
  ): void {
    consola.debug("Loading responses:", participantParameters, partnerParameters);
    // Store participant parameters
    this.dataframe.server_alpha_ppt = participantParameters[0];
    this.dataframe.server_beta_ppt = participantParameters[1];

    // Store partner parameters
    this.dataframe.server_alpha_par = partnerParameters[0];
    this.dataframe.server_beta_par = partnerParameters[1];

    // We don't call the callback on a timer
  }

  /**
   * Handler called after DASS questionnaire completed
   * @param {number[]} responses array of responses (0-3) for each question
   */
  public dass(responses: number[]): void {
    consola.debug("DASS responses:", responses);
    this.dataframe.questionnaireResponsesDASS = responses;
    this.callback();
  }

  /**
   * Handler called after screentime questionnaire completed
   * @param {number} weekdayTime value of the weekday response
   * @param {number} weekendTime value of the weekend response
   */
  public screentime(weekdayTime: number, weekendTime: number): void {
    consola.debug("Screentime responses:", weekdayTime, weekendTime);
    this.dataframe.questionnaireResponsesScreentime = [weekdayTime, weekendTime];
    this.callback();
  }
}

export default Handler;
