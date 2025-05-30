/**
 * @file jsPsych-related declarations.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Declare jsPsych
declare const jsPsych;

// Timeline collection type
declare type Timeline = TimelineNode[];

// Timeline node type, representing different timeline
// element parameter types
declare type TimelineNode = {
  type?: string;

  // Fullscreen plugin
  message?: string;
  fullscreen_mode?: boolean;

  // Instructions plugin
  pages?: string[] | string[];
  allow_keys?: boolean;
  key_forward?: string;
  key_backward?: string;
  show_page_number?: boolean;
  show_clickable_nav?: boolean;

  // Trial plugin
  trial?: number;
  display?: Display | string;
  optionOneParticipant?: number;
  optionOnePartner?: number;
  optionTwoParticipant?: number;
  optionTwoPartner?: number;
  typeOne?: string;
  typeTwo?: string;
  answer?: string;
  isPractice?: boolean;

  // Matching screen
  fetchData?: boolean;

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

  // Loop nodes
  timeline?: any[];
  conditional_function?: () => boolean;

  // HTML input plugin
  preamble?: string;
  html?: string;
};
