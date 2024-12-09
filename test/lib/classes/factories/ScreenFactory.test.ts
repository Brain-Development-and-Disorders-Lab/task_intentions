/**
 * @file 'ScreenFactory' class tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Test utilities
import { waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-canvas-mock";

// Custom render function
import { render } from "test/utils/functions";

// Screen factory
import ScreenFactory from "src/lib/classes/factories/ScreenFactory";

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

// Agency screen
test("loads and displays Agency screen", async () => {
  render(
    screenFactory.generate({
      display: "agency",
      screen: {
        trial: 0,
        display: "agency",
        handler: () => {
          console.info("Selection handler called");
        },
      },
    })
  );

  await waitFor(() => screen.queryByText("Agree"));

  expect(screen.queryByText("Agree")).not.toBeNull();
});

// Classification screen
test("loads and displays Classification screen", async () => {
  render(
    screenFactory.generate({
      display: "classification",
      screen: {
        trial: 0,
        display: "classification",
        handler: () => {
          console.info("Selection handler called");
        },
      },
    })
  );

  await waitFor(() => screen.queryAllByPlaceholderText("Please select"));

  expect(screen.queryAllByPlaceholderText("Please select")).not.toBeNull();
});

// Inference screen
test("loads and displays Inference screen", async () => {
  render(
    screenFactory.generate({
      display: "inference",
      screen: {
        trial: 0,
        display: "inference",
        handler: () => {
          console.info("Selection handler called");
        },
      },
    })
  );

  await waitFor(() => screen.queryAllByText("Totally"));

  expect(screen.queryAllByText("Totally")).not.toBeNull();
});

// Matched screen
test("loads and displays Matched screen", async () => {
  render(
    screenFactory.generate({
      display: "matched",
      screen: {
        trial: 0,
        display: "matched",
      },
    })
  );

  await waitFor(() => screen.queryByText("Partner found!"));

  expect(screen.queryByText("Partner found!")).not.toBeNull();
});

// Matching screen
test("loads and displays Matching screen", async () => {
  render(
    screenFactory.generate({
      display: "matching",
      screen: {
        trial: 0,
        display: "matching",
      },
    })
  );

  await waitFor(() => screen.queryByText("Finding you a partner..."));

  expect(screen.queryByText("Finding you a partner...")).not.toBeNull();
});

// SelectAvatar screen
test("loads and displays SelectAvatar screen", async () => {
  render(
    screenFactory.generate({
      display: "selection",
      screen: {
        trial: 0,
        display: "selection",
        handler: () => {
          console.info("Selection handler called");
        },
      },
    })
  );

  await waitFor(() => screen.getByRole("heading"));

  expect(screen.getByRole("heading")).toHaveTextContent("Choose your Avatar!");
});

// Summary screen
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

// Trial screen
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
