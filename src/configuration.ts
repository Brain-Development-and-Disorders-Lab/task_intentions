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
    enableSocialStatusQuestionnaire: false,
    enableEndingQuestionnaires: false,
    useAdultQuestionnaires: false,

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
    enableQuestionnaireDemographics: false,

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
    participantDefaultStatus: 0,
    partnerHighStatus: 0,
    partnerLowStatus: 0,
  },

  // Set the logging level
  logging:
    process.env.NODE_ENV === "development" ? LogLevel.Verbose : LogLevel.Error,

  // Avatar configuration details, including colours and names
  avatars: {
    names: {
      participant: ["A", "B", "C", "D", "E", "F"],
      partner: ["G", "H", "I"],
    },
    colours: [
      "#8B0000", // Deep Red
      "#FF6B35", // Bright Orange
      "#FFD700", // Golden Yellow
      "#228B22", // Forest Green
      "#008080", // Teal
      "#87CEEB", // Sky Blue
      "#000080", // Navy Blue
      "#7851A9", // Royal Purple
      "#FF00FF", // Magenta
      "#FF69B4", // Hot Pink
      "#800000", // Maroon
      "#CC5500", // Burnt Orange
      "#808000", // Olive Green
      "#2E8B57", // Sea Green
      "#40E0D0", // Turquoise
      "#1E90FF", // Dodger Blue
      "#4B0082", // Indigo
      "#EE82EE", // Violet
      "#DC143C", // Crimson
      "#2F4F4F", // Dark Slate Gray
    ],
    variant: "beam",
  },

  // Cyberball configuration, timings and behavioral parameters
  cyberball: {
    // Timings
    tossInterval: 2000,
    totalTosses: 20,

    // Visual parameters
    ballSize: 40,
    ballColor: "#FF6B6B",
    viewWidth: 800,
    viewHeight: 600,

    // Avatar sizes
    participantAvatarSize: 100,
    partnerAvatarSize: 120,

    // Positioning of avatar containers
    positions: {
      participant: { x: 400, y: 480 },
      partnerA: { x: 120, y: 140 },
      partnerB: { x: 680, y: 140 },
    },

    // Positioning of ball targets
    ballPositions: {
      participant: { x: 400, y: 480 },
      partnerA: { x: 120, y: 130 },
      partnerB: { x: 680, y: 130 },
    },

    // Layout spacing
    partnerMargin: 20,
    participantBottomMargin: 80,
  },

  // Status display configuration
  statusDisplay: {
    participantDefault: 50,
    participantRange: 10,
    partnerLow: 17.5,
    partnerHigh: 82.5,
    partnerRange: 15,
  },
};
