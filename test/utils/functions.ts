/**
 * @file Utility functions for testing workflow. Used to pre-configure some
 * classes and components, defines custom render function.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import { ReactElement } from "react";

// Testing utilities
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import TestWrapper from "./TestWrapper";

// Handler class
import Handler from "src/lib/classes/Handler";

/**
 * Generate a Trial configuration for test use
 * @param {Display} display the display type being tested
 * @return {any}
 */
export const getTrialConfiguration = (display: Display): Trial => {
  return {
    trial: 1,
    display: display,
    optionOneParticipant: 0,
    optionOnePartner: 0,
    optionTwoParticipant: 0,
    optionTwoPartner: 0,
    typeOne: "",
    typeTwo: "",
    avatar: 0,
    answer: "Option 1",
    isPractice: false,
    fetchData: false,
    clearScreen: false,
  };
};

/**
 * Generate a Handler instance for test use
 * @param {Display} display the display type being tested
 * @return {any}
 */
export const getHandler = (display: Display): Handler => {
  return new Handler(
    {
      trial: 1,
      display: display,
      participantID: "default",
      playerPoints_option1: NaN,
      partnerPoints_option1: NaN,
      playerPoints_option2: NaN,
      partnerPoints_option2: NaN,
      playerPoints_selected: NaN,
      partnerPoints_selected: NaN,
      selectedOption_player: NaN,
      realAnswer: "Option 1",
      inferenceResponse_Selfish: NaN,
      inferenceResponse_Harm: NaN,
      agencyResponse: NaN,
      classification: "",
      trialDuration: 100,
      correctGuess: NaN,
      server_alpha_par: NaN,
      server_beta_par: NaN,
      server_alpha_ppt: NaN,
      server_beta_ppt: NaN,
    },
    () => {
      return;
    }
  );
};

// Custom rendering function to place everything inside of the 'TestWrapper' component
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult => render(ui, { wrapper: TestWrapper, ...options });

export * from "@testing-library/react";
export { customRender as render };
