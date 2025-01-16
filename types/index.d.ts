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

// Different screen types that are displayed
declare type Display =
  | "playerChoice"
  | "playerChoicePractice"
  | "playerChoice2"
  | "mid"
  | "mid2"
  | "playerGuess"
  | "playerGuessPractice"
  | "matching"
  | "matched"
  | "selection"
  | "inference"
  | "agency"
  | "classification"
  | "summary"
  | "end";

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
  trial: number;
  display: Display;
  optionOneParticipant: number;
  optionOnePartner: number;
  optionTwoParticipant: number;
  optionTwoPartner: number;
  typeOne: string;
  typeTwo: string;
  avatar: 0;
  answer: Options;
  isPractice: boolean;
  fetchData: boolean;
};

// Data type used to enforce trial data storage format
declare type TrialData = {
  trial: number;
  display: Display;
  participantID: string;
  playerPoints_option1: number;
  partnerPoints_option1: number;
  playerPoints_option2: number;
  partnerPoints_option2: number;
  playerPoints_selected: number;
  partnerPoints_selected: number;
  selectedOption_player: NaN | 1 | 2; // uses 1 and 2 rather than strings
  realAnswer: Options;
  inferenceResponse_Selfish: number;
  inferenceResponse_Harm: number;
  agencyResponse: number;
  classification: string;
  trialDuration: number;
  correctGuess: NaN | 0 | 1; // 0 incorrect; 1 correct
  server_alpha_ppt: number;
  server_beta_ppt: number;
  server_alpha_par: number;
  server_beta_par: number;
  signalTimestamps: number[];
};

// Type to represent the active state of a trial
declare type TrialState = {
  hasSelected: boolean;
  highlightedOptionIndex: number;
  selectedOption: Options;
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
