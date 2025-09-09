/**
 * @file 'Loading' screen tests
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

test("loads and displays Loading screen with matching type", async () => {
  const props: Props.Screens.Loading = {
    trial: 0,
    display: "loading",
    loadingType: "matchingIntentions",
    fetchData: false,
    handler: (participantParameters, partnerParameters) => {
      console.info(participantParameters, partnerParameters);
    },
  };
  render(<Wrapper display={"loading"} props={props} />);

  await waitFor(() => {
    expect(screen.getByText("Finding you a partner...")).toBeInTheDocument();
  });
});

test("loads and displays Loading screen with social type", async () => {
  const props: Props.Screens.Loading = {
    trial: 0,
    display: "loading",
    loadingType: "social",
  };
  render(<Wrapper display={"loading"} props={props} />);

  await waitFor(() => {
    expect(
      screen.getByText("Generating relative social standing...")
    ).toBeInTheDocument();
  });
});

test("loads and displays Loading screen with default type", async () => {
  const props: Props.Screens.Loading = {
    trial: 0,
    display: "loading",
    loadingType: "default",
  };
  render(<Wrapper display={"loading"} props={props} />);

  await waitFor(() => {
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

test("loads and displays Loading screen with default type when no type specified", async () => {
  const props: Props.Screens.Loading = {
    trial: 0,
    display: "loading",
    loadingType: "default",
  };
  render(<Wrapper display={"loading"} props={props} />);

  await waitFor(() => {
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
