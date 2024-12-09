/**
 * @file 'Trial' screen tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Test utilities
import { waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";

// Custom render function
import { render } from "test/utils/functions";

// Screen factory
import ScreenFactory from "src/lib/classes/factories/ScreenFactory";

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

let screenFactory: ScreenFactory;
beforeAll(() => {
  screenFactory = new ScreenFactory();
});

test("loads and displays Trial screen", async () => {
  render(
    screenFactory.generate({
      display: "playerChoice",
      screen: {
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
      },
    })
  );

  // Waiting for 'TextTransition' elements to have updated
  // upon first rendering the screen
  await waitFor(() => {
    expect(screen.getAllByText("You")).not.toBe(null);
  });
});

test("check Trial screen accessibility", async () => {
  const { container } = render(
    screenFactory.generate({
      display: "playerChoice",
      screen: {
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
      },
    })
  );

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
