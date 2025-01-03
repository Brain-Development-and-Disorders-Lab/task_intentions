/**
 * @file 'Trial' screen tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */
// React import
import React from "react";

// Test utilities
import { waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";

// Custom render function
import { render } from "test/utils/functions";

// Wrapper component
import Wrapper from "src/lib/view/components/Wrapper";

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

// Mock jsPsych
import "jspsych";
jest.mock("jspsych");

// Mock the jsPsych wrapper library
import { Experiment } from "neurocog";
jest.mock("neurocog");

// Setup the Experiment instances
beforeEach(() => {
  // Experiment
  (window["Experiment"] as RecursivePartial<Experiment>) = {
    getState: jest.fn(() => {
      return {
        get: jest.fn(),
        set: jest.fn(),
      };
    }),
  };
});

test("loads and displays Trial screen", async () => {
  const props: Props.Screens.Trial = {
    trial: 0,
    display: "playerChoice",
    isPractice: false,
    participantPoints: 5,
    partnerPoints: 7,
    options: {
      one: {
        participant: 1,
        partner: 2,
      },
      two: {
        participant: 2,
        partner: 1,
      },
    },
    answer: "Option 1",
    handler: (selection: string) => {
      console.info(`Selected:`, selection);
    },
  };
  render(<Wrapper display={"playerChoice"} props={props} />);

  // Waiting for 'TextTransition' elements to have updated
  // upon first rendering the screen
  await waitFor(() => {
    expect(screen.getAllByText("You")).not.toBe(null);
  });
});

test("check Trial screen accessibility", async () => {
  const props: Props.Screens.Trial = {
    trial: 0,
    display: "playerChoice",
    isPractice: false,
    participantPoints: 5,
    partnerPoints: 7,
    options: {
      one: {
        participant: 1,
        partner: 2,
      },
      two: {
        participant: 2,
        partner: 1,
      },
    },
    answer: "Option 1",
    handler: (selection: string) => {
      console.info(`Selected:`, selection);
    },
  };
  const { container } = render(<Wrapper display={"playerChoice"} props={props} />);

  // Asynchronous chain, waiting for 'TextTransition'
  // elements to have updated upon first rendering the screen
  await waitFor(() => {
    expect(screen.getAllByText("Partner")).not.toBe(null);
  }).then(() => {
    const results = axe(container, {}).then(() => {
      expect(results).toHaveNoViolations();
    });
  });
});
