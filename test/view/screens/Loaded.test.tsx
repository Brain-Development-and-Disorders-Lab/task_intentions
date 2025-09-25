/**
 * @file 'Matched' screen tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */
// React imports
import React from "react";

// Test utilities
import { waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Custom render function
import { render } from "test/utils/functions";

// Wrapper component
import Wrapper from "src/view/components/Wrapper";

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

test("loads and displays Loaded screen", async () => {
  const props: Props.Screens.Loaded = {
    trial: 0,
    display: "loaded",
    state: "matchingIntentions",
    handler: () => { return; },
  };
  render(<Wrapper display={"loaded"} props={props} />);

  await waitFor(() => screen.queryByText("Partner found!"));
  expect(screen.queryByText("Partner found!")).not.toBeNull();
});
