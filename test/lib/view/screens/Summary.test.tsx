/**
 * @file 'Summary' screen tests
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

let screenFactory: ScreenFactory;
beforeAll(() => {
  screenFactory = new ScreenFactory();
});

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

test("loads and displays Summary screen", async () => {
  render(
    screenFactory.generate({
      display: "summary",
      screen: {
        trial: 0,
        display: "summary",
        postPhase: "playerChoice",
        handler: () => {
          console.info("Selection handler called");
        },
      },
    })
  );

  // Waiting for 'TextTransition' elements to have updated
  // upon first rendering the screen
  await waitFor(() => {
    expect(screen.getAllByText("0")).not.toBe(null);
  });
});

test("check Summary screen accessibility", async () => {
  const { container } = render(
    screenFactory.generate({
      display: "summary",
      screen: {
        trial: 0,
        display: "summary",
        postPhase: "playerChoice",
        handler: () => {
          console.info("Selection handler called");
        },
      },
    })
  );

  // Asynchronous chain, waiting for 'TextTransition'
  // elements to have updated upon first rendering the screen
  await waitFor(() => {
    expect(screen.getAllByText("0")).not.toBe(null);
  }).then(() => {
    const results = axe(container, {}).then(() => {
      expect(results).toHaveNoViolations();
    });
  });
});
