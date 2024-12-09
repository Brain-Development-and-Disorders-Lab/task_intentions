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

  // Manipulations that are configured in Gorilla
  manipulations: {
    partner: "test",
    requireID: false,
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
  },

  // Enable the tutorial overlay
  enableTutorialOverlay: true,

  // Force fullscreen when deployed
  fullscreen: process.env.NODE_ENV !== "development",

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
