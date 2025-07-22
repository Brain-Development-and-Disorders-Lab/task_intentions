/**
 * @file Configuration file used by the crossplatform API to configure
 * the experiment. Contains standard information about experiment parameters and
 * error handling. Extended to contain custom parameters for avatars and
 * networking configuration.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Logging level
import { LogLevel } from "consola";

// Configuration and other required data
export const Configuration = {
  // General information
  name: "Intentions game",
  studyName: "intentions-game",
  locale: "en-AU",

  // Error screen configuration
  allowParticipantContact: true,
  contact: "henry.burgess@wustl.edu",

  // Experimental manipulations that are configured in Gorilla
  manipulations: {
    partner: "test",
    requireID: false,
    useButtonInput: true,
    useOfflinePackages: true,
    enableStatusPhaseOne: false,
    enableStatusPhaseTwo: false,
    enableStatusPhaseThree: false,
  },

  // Feature flags, configure these before building for deployment
  features: {
    // UI/UX Features
    enableTutorialOverlay: true,
    enableConfetti: true,
    enableTextTransitions: true,
    enableAvatarSelection: true,
    enableProgressIndicators: true,
    enablePreviousExperimentPrompt: false,
    enableStatusDisplay: false,
    enableStatusQuestionnaire: false,

    // Experiment Features
    enablePracticeTrials: true,
    enableAttentionChecks: true,
    enablePartnerMatching: true,
    enableInferenceQuestions: true,
    enableClassificationQuestions: true,
    enableAgencyQuestions: true,

    // Data Collection Features
    enableLocalStorage: true,
    enableSignalTimestamps: true,
    enableDetailedLogging: process.env.NODE_ENV === "development",

    // Performance Features
    enableOfflinePackages: true,
    enableFullscreen: process.env.NODE_ENV !== "development",
  },

  // Collection of any stimuli used in the trials
  stimuli: {},

  // Collection of any resources used in the trials
  resources: {},

  // Seed for RNG
  seed: 0.4837,

  // Initial experiment state
  state: {
    participantID: "default",
    participantAvatar: 0,
    partnerAvatar: 0,
    refreshPartner: false,
    partnerChoices: {},
    signalTimestamps: [],
    experimentID: "",
  },

  // Set the logging level
  logging:
    process.env.NODE_ENV === "development" ? LogLevel.Verbose : LogLevel.Error,

  // Avatar configuration details, including colours and names
  avatars: {
    names: {
      participant: ["a", "b", "c", "d", "e", "f"],
      partner: ["a", "b", "c"],
    },
    colours: ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
    variant: "beam",
  },
};
