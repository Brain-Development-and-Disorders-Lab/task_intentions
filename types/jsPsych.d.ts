/**
 * @file jsPsych-related declarations.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Declare jsPsych
declare const jsPsych;

declare type GenericNode = {
  type?: string;
};

declare type FullscreenNode = {
  // Fullscreen plugin
  message?: string;
  fullscreen_mode?: boolean;
};

declare type InstructionsNode = {
  // Instructions plugin
  pages?: string[] | string[];
  allow_keys?: boolean;
  key_forward?: string;
  key_backward?: string;
  show_page_number?: boolean;
  show_clickable_nav?: boolean;
};

declare type ComprehensionNode = {
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

declare type LoopNode = {
  // Loop nodes
  timeline?: any[];
  conditional_function?: () => boolean;
};

declare type InputNode = {
  // HTML input plugin
  preamble?: string;
  html?: string;
};

declare type IntentionsNode = {
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
declare type Timeline = TimelineNode[];

// Timeline node type, representing different timeline
// element parameter types
declare type TimelineNode = GenericNode & (
  | FullscreenNode
  | InstructionsNode
  | ComprehensionNode
  | LoopNode
  | InputNode
  | IntentionsNode
);
