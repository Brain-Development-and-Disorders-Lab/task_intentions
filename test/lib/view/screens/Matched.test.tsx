/**
 * @file 'Matched' screen tests
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

// Mock the jsPsych wrapper library
import { Experiment } from "neurocog";
jest.mock("neurocog");

let screenFactory: ScreenFactory;
beforeAll(() => {
  screenFactory = new ScreenFactory();
});

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

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

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

test("check Matched screen accessibility", async () => {
  const { container } = render(
    screenFactory.generate({
      display: "matched",
      screen: {
        trial: 0,
        display: "matched",
      },
    })
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
