/**
 * @file Primary declaration file containing the module declaration,
 * CSV-related types, and data storage formats.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Module declaration
declare module "intentions-game" {}

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

// Cyberball game state
declare type CyberballGameState = {
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
