/**
 * @file Primary declaration file containing the module declaration,
 * CSV-related types, and data storage formats.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Module declaration
declare module "intentions-game" {}

// Declare CSV module type
declare module "*.csv";

// CSV data row types
declare type Row = {
  randomise_blocks: string;
  randomise_trials: number;
  display: Display;
  ANSWER: Options;
  Option1_PPT: number;
  Option1_Partner: number;
  Option2_PPT: number;
  Option2_Partner: number;
  ShowProgressBar: number;
  Type1: Partner;
  Type2: Partner;
  Difference1: number;
  Difference2: number;
};

// 'Factory' interface
interface Factory {
  generate(...args);
}

// Type for the 'ScreenPropFactory' return
declare type ScreenProps = {
  props: Props.Screens;
  callback: (...args) => void;
  duration: number;
};

declare type Display =
  | "playerChoice"
  | "playerChoicePractice"
  | "playerChoice2"
  | "mid"
  | "mid2"
  | "playerGuess"
  | "playerGuessPractice"
  | "loading"
  | "matched"
  | "selection"
  | "inference"
  | "agency"
  | "classification"
  | "status"
  | "dass"
  | "screentime"
  | "demographics"
  | "summary"
  | "end"
  | "waiting"
  | "cyberball"
  | "resources";

// The three partner types
declare type Partner = "Test" | "Prosocial" | "Individualist" | "Competitive";

// Avatar styles
declare type AvatarStyles =
  | "beam"
  | "marble"
  | "pixel"
  | "sunset"
  | "ring"
  | "bauhaus";

// Selection options
declare type Options = "Option 1" | "Option 2";

// Trial type to enforce parameters
declare type Trial = {
  // Basic trial identification
  trial: number; // Trial number/identifier
  display: Display; // Screen type to display (e.g., "playerChoice", "loading", etc.)

  // Game option parameters (used by Trial screen)
  optionOneParticipant: number; // Points for participant in Option 1
  optionOnePartner: number; // Points for partner in Option 1
  optionTwoParticipant: number; // Points for participant in Option 2
  optionTwoPartner: number; // Points for partner in Option 2

  // Partner type information
  typeOne: string; // Partner type for Option 1
  typeTwo: string; // Partner type for Option 2

  // Avatar selection (used by SelectAvatar screen)
  avatar: 0; // Avatar index (currently hardcoded to 0)

  // Game logic
  answer: Options; // Correct answer for the trial ("Option 1" or "Option 2")
  isPractice: boolean; // Whether this is a practice trial

  // Loading screen configuration (used by Loading screen)
  loadingType?: "matching" | "social" | "default"; // Type of loading: "matching" (partner matching), "social" (status generation), or "default" (generic loading)
  fetchData: boolean; // Whether to fetch data from server (only used when loadingType is "matching")
  mode: "facilitator" | "mri";

  // Spotlight configuration (used by Trial screen)
  spotlight?: {
    enabled: boolean;
    target: "status" | "options" | "none";
    message: string;
  };

  // Cyberball screen
  isInclusive?: boolean;
  partnerHighStatus?: boolean;
  probabilities?: {
    inclusion: number;
    exclusion: {
      partnerA: number;
      partnerB: number;
    };
  };
};

// Data type used to enforce trial data storage format
declare type TrialData = {
  // Trial identification
  trial: number;
  display: Display;
  participantID: string;

  // Points
  playerPoints_option1: number;
  partnerPoints_option1: number;
  playerPoints_option2: number;
  partnerPoints_option2: number;
  playerPoints_selected: number;
  partnerPoints_selected: number;

  // Trial state
  selectedOption_player: NaN | 1 | 2; // uses 1 and 2 rather than strings
  realAnswer: Options;
  trialDuration: number;
  correctGuess: NaN | 0 | 1; // 0 incorrect; 1 correct

  // Model parameters
  server_alpha_ppt: number;
  server_beta_ppt: number;
  server_alpha_par: number;
  server_beta_par: number;

  // Signal timestamps
  signalTimestamps: number[];

  // Cyberball data
  cyberballTossCount: number;
  cyberballParticipantTossCount: number;
  cyberballParticipantCatchCount: number;

  // Questionnaire responses
  questionnaireResponseInferenceSelfish: number;
  questionnaireResponseInferenceHarm: number;
  questionnaireResponseAgency: number;
  questionnaireResponseClassification: string;
  questionnaireResponseCloseFriends: number;
  questionnaireResponsePartyInvitations: number;
  questionnaireResponseMeanPeople: number;
  questionnaireResponseSocialMediaFollowers: number;
  questionnaireResponseSocialMediaFollowing: number;
  questionnaireResponsesDASS: number[];
  questionnaireResponsesScreentime: number[];
  questionnaireResponsesDemographicsAge: number;
  questionnaireResponsesDemographicsGender: string;
  questionnaireResponsesDemographicsEthnicity: string;
  questionnaireResponsesDemographicsHouseholdIncome: string;
  questionnaireResponsesDemographicsEducation: string;
  questionnaireResponsesDemographicsSocialMediaDaily: boolean;
  questionnaireResponsesDemographicsSocialMediaPlatforms: string;
};

// Type to represent the active state of a trial
declare type TrialState = {
  hasSelected: boolean;
  highlightedOptionIndex: number;
  selectedOption: Options;
  answer: Options;
};

// Points storage
declare type Points = {
  one: {
    participant: number;
    partner: number;
  };
  two: {
    participant: number;
    partner: number;
  };
};

// Response data from the model
declare type ModelResponse = {
  participantParameters: number[];
  partnerParameters: number[];
  partnerChoices: {
    ppt1: number;
    par1: number;
    ppt2: number;
    par2: number;
    Ac: number;
  }[];
};

// Recursive partial type, allows tests using the
// 'jspsych-wrapper' Experiment class to be run
declare type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

// Backup storage object
declare type BackupStorage = {
  experimentID: string;
  timestamp: number;
  completed: boolean;
  data: any[];
};
