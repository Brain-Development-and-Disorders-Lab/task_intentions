/**
 * @file Primary declaration file containing the module declaration,
 * CSV-related types, and data storage formats.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Grommet imports for styling components
import { BorderType } from "grommet/utils";

// 'Experiment' jsPsych wrapper library
import type { Experiment } from "neurocog";

// Compute class
import type Compute from "src/classes/Compute";

// Module declaration
export module "intentions-game" {}

// Add 'Experiment' to the global Window interface
declare global {
  interface Window {
    Experiment: Experiment;
    Compute: Compute;
  }
}

export type GenericNode = {
  type?: string;
  trial_number?: number;
};

export type FullscreenNode = {
  // Fullscreen plugin
  message?: string;
  fullscreen_mode?: boolean;
};

export type InstructionsNode = {
  // Instructions plugin
  pages?: string[] | string[];
  allow_keys?: boolean;
  key_forward?: string;
  key_backward?: string;
  show_page_number?: boolean;
  show_clickable_nav?: boolean;
};

export type ComprehensionNode = {
  // Attention-check plugin
  prompt?: string;
  style?: "default" | "radio";
  responses?: string[];
  correct?: number;
  feedback?: { correct: string; incorrect: string };
  input_timeout?: number;
  input_schema?: {
    select: string | null;
    next: string | null;
    previous: string | null;
  };
  confirm_continue?: boolean;
};

export type LoopNode = {
  // Loop nodes
  timeline?: any[];
  conditional_function?: () => boolean;
};

export type InputNode = {
  // HTML input plugin
  preamble?: string;
  html?: string;
};

export type IntentionsNode = {
  // Basic trial identification
  trial_number: number; // Trial number/identifier
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
  state?: "matchingIntentions" | "matchingCyberball" | "social" | "default"; // Type of loading: "matchingIntentions" (partner matching), "matchingCyberball" (cyberball partners), "social" (status generation), or "default" (generic loading)
  runComputeSetup?: boolean; // Whether to run WebR setup
  runComputeOperation?: boolean; // Whether to fetch data from server (only used when state is "matchingIntentions")

  // Status preview screen configuration (used by StatusPreview screen)
  nextPhase?: "cyberball" | "phaseOne" | "phaseTwo" | "phaseThree";
  isPreviewPartnerHighStatus?: boolean; // Used for the `StatusPreview` screen

  // Waiting screen configuration (used by Waiting screen)
  mode: "facilitator" | "mri";

  // Spotlight configuration (used by Trial screen)
  spotlight?: {
    enabled: boolean;
    target: "status" | "options" | "none";
    message: string;
  };

  // Cyberball screen
  isInclusive?: boolean;
  isCyberballPartnerHighStatus?: boolean;
  probabilities?: {
    inclusion: number;
    exclusion: {
      partnerA: number;
      partnerB: number;
    };
  };
};

// Timeline collection type
export type Timeline = TimelineNode[];

// Timeline node type, representing different timeline
// element parameter types
export type TimelineNode = GenericNode & (
  | FullscreenNode
  | InstructionsNode
  | ComprehensionNode
  | LoopNode
  | InputNode
  | IntentionsNode
  );

// 'Factory' interface
interface Factory {
  generate(...args);
}

// Type for the 'ScreenPropFactory' return
export type ScreenProps = {
  props: Screens;
  callback: (...args) => void;
  duration: number;
};

export type Display =
  | "playerChoice"
  | "playerChoicePractice"
  | "playerChoice2"
  | "mid"
  | "mid2"
  | "playerGuess"
  | "playerGuessPractice"
  | "loading"
  | "loaded"
  | "statusPreview"
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
export type Partner = "Test" | "Prosocial" | "Individualist" | "Competitive";

// Avatar styles
export type AvatarStyles =
  | "beam"
  | "marble"
  | "pixel"
  | "sunset"
  | "ring"
  | "bauhaus";

// Selection options
export type Options = "Option 1" | "Option 2" | "";

// Type to represent the active state of a trial
export type TrialState = {
  hasSelected: boolean;
  highlightedOptionIndex: number;
  selectedOption: Options;
  answer: Options;
};

// Points storage
export type Points = {
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
export type ModelResponse = {
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

// Cyberball game state
export type CyberballGameState = {
  ballOwner: "participant" | "partnerA" | "partnerB";
  canToss: boolean;
  tossCount: number;
  participantTossCount: number;
  participantCatchCount: number;
  partnerATossCount: number;
  partnerBTossCount: number;
};

// Recursive partial type, allows tests using the
// 'jspsych-wrapper' Experiment class to be run
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

// Props for 'Components'
export namespace Components {
  // Wrapper component
  type Wrapper = {
    display: Display;
    props:
      | Screens.Loaded
      | Screens.Loading
      | Screens.Trial
      | Screens.SelectAvatar
      | Screens.Inference
      | Screens.Agency
      | Screens.Classification
      | Screens.Status
      | Screens.DASS
      | Screens.Screentime
      | Screens.Demographics
      | Screens.Summary
      | Screens.Waiting
      | Screens.Cyberball
      | Screens.Resources;
  };

  // Option component
  type Option = {
    optionKey: string;
    optionName: string;
    pointsParticipant: number;
    pointsPartner: number;
  };

  // Card component
  type Card = {
    gridArea: string;
    name: string;
    points: string;
    avatar: string;
  };

  // Slider component
  type Slider = {
    min: number;
    max: number;
    value: number;
    setValue: (value: number) => void;
    leftLabel: string;
    rightLabel: string;
    onChange?: () => any;
    isFocused: boolean;
  };

  // Character component
  type Character = {
    size: number;
    name: string;
    state: string;
    setState: (avatar: string) => void;
    border?: BorderType;
  };

  // Status componet
  type Status = {
    participantStatus: number;
    partnerStatus: number;
    isPractice?: boolean;
    hidePartner?: boolean;
  };
}

// Props for 'Screens'
export namespace Screens {
  type GenericScreenProps = {
    trial_number: number;
    display: Display;
  };

  // Loaded screen
  type Loaded = GenericScreenProps & {
    state: "matchingIntentions" | "matchingCyberball" | "social";
    handler: () => void;
  };

  // Loading screen
  type Loading = GenericScreenProps & {
    state: "matchingIntentions" | "matchingCyberball" | "social" | "default";
    runComputeSetup?: boolean;
    runComputeOperation?: boolean;
    handler?: (
      storeParameters: boolean,
      participantParameters: number[],
      partnerParameters: number[],
      setupDuration: number,
      operationDuration: number
    ) => void;
  };

  // Trial screen
  type Trial = GenericScreenProps & {
    isPractice: boolean;
    participantPoints: number;
    partnerPoints: number;
    options: Points;
    answer: Options;
    spotlight?: {
      enabled: boolean;
      target: "status" | "options" | "none";
      message: string;
    };
    handler: (
      selection: Options,
      points: { options: Points },
      answer: Options
    ) => void;
  };

  // SelectAvatar screen
  type SelectAvatar = GenericScreenProps & {
    handler: (selectedIndex: number) => void;
  };

  // Inference screen
  type Inference = GenericScreenProps & {
    handler: (firstValue: number, secondValue: number) => void;
  };

  // Agency screen
  type Agency = GenericScreenProps & {
    handler: (firstValue: number) => void;
  };

  // Classification screen
  type Classification = GenericScreenProps & {
    handler: (classification: string) => void;
  };

  // Status screen
  type Status = GenericScreenProps & {
    handler: (
      closeFriends: number,
      partyInvitations: number,
      meanPeople: number,
      socialMediaFollowers: number,
      socialMediaFollowing: number
    ) => void;
  };

  // Status preview screen
  type StatusPreview = GenericScreenProps & {
    nextPhase: "cyberball" | "phaseOne" | "phaseTwo" | "phaseThree";
    isPreviewPartnerHighStatus: boolean;
    handler: () => void;
  };

  // DASS screen
  type DASS = GenericScreenProps & {
    version: "adult" | "adolescent";
    handler: (responses: number[]) => void;
  };

  // Screentime screen
  type Screentime = GenericScreenProps & {
    handler: (weekdayTime: number, weekendTime: number) => void;
  };

  // Demographics screen
  type Demographics = GenericScreenProps & {
    version: "adult" | "adolescent";
    handler: (
      age: number,
      genderIdentity: string,
      ethnicity: string,
      householdIncome: string,
      education: string,
      socialMediaDaily: boolean,
      socialMediaPlatforms: string,
    ) => void;
  };

  // Summary screen
  type Summary = GenericScreenProps & {
    postPhase: Display;
    handler: () => void;
  };

  // Waiting screen
  type Waiting = GenericScreenProps & {
    mode: "facilitator" | "mri";
    handler: () => void;
  };

  // Resources screen
  type Resources = GenericScreenProps & {
    handler: () => void;
  };

  // Cyberball screen
  type Cyberball = GenericScreenProps & {
    isInclusive: boolean; // Operate exclusively as inclusive or exclusive
    isCyberballPartnerHighStatus: boolean; // Partner A is high status or low status
    probabilities: {
      inclusion: number; // Probability of partners passing to participant
      exclusion: {
        partnerA: number; // Probability of partner A passing to participant
        partnerB: number; // Probability of partner B passing to participant
      };
    };
    handler: (
      tossCount: number,
      participantTossCount: number,
      participantCatchCount: number
    ) => void;
  };
}


// Backup storage object
export type BackupStorage = {
  experimentID: string;
  timestamp: number;
  completed: boolean;
  data: any[];
};

// Export CSV module type
export module "*.csv";

// CSV data row types
export type Row = {
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

// Data type used to enforce trial data storage format
export type Dataframe = {
  // Trial identification
  trial_number: number;
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
  setupDuration: number;
  operationDuration: number;

  // Social status
  participantDefaultStatus: number;
  partnerCyberballLowStatus: number;
  partnerCyberballHighStatus: number;
  partnerOneLowStatus: number;
  partnerOneHighStatus: number;
  partnerTwoLowStatus: number;
  partnerTwoHighStatus: number;
  partnerThreeLowStatus: number;
  partnerThreeHighStatus: number;

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

