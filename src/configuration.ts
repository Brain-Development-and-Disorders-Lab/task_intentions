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
    useButtonInput: false,
    useOfflinePackages: true,

    // Questionnaire features
    enableEndingQuestionnaires: false,
    enableAdolescentDASS: false,

    // Status enablement features
    enableStatusPhaseOne: false,
    enableStatusPhaseTwo: false,
    enableStatusPhaseThree: false,

    // Status behavior features
    isPartnerHighStatusPhaseOne: false,
    isPartnerHighStatusPhaseTwo: false,
    isPartnerHighStatusPhaseThree: false,

    // Cyberball features
    enableCyberball: false,
    cyberballIsInclusive: true,
    cyberballIsPartnerHighStatus: true,
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

    // Questionnaire Features
    enableInferenceQuestions: true,
    enableClassificationQuestions: true,
    enableAgencyQuestions: true,
    enableQuestionnaireStatus: false,
    enableQuestionnaireDASS: false,
    enableQuestionnaireScreentime: false,

    // Experiment Features
    enablePracticeTrials: true,
    enableAttentionChecks: true,
    enablePartnerMatching: true,

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

  // Cyberball configuration, timings and behavioral parameters
  cyberball: {
    // Timings
    tossInterval: 2000,
    totalDuration: 60000,

    // Visual parameters
    ballSize: 40,
    ballColor: "#FF6B6B",
    playerSize: 100,
    viewWidth: 800,
    viewHeight: 600,
  },

  // Status display configuration
  statusDisplay: {
    low: 55,
    high: 80,
    variance: 2,
  }
};
