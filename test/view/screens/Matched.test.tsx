/**
 * @file 'Matched' screen tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */
// React imports
import React from "react";

// Test utilities
import { waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";

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

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

test("loads and displays Matched screen", async () => {
  const props: Props.Screens.Matched = {
    trial: 0,
    display: "matched",
  };
  render(<Wrapper display={"matched"} props={props} />);

  await waitFor(() => screen.queryByText("Partner found!"));
  expect(screen.queryByText("Partner found!")).not.toBeNull();
});

test("check Matched screen accessibility", async () => {
  const props: Props.Screens.Matched = {
    trial: 0,
    display: "matched",
  };
  const { container } = render(<Wrapper display={"matched"} props={props} />);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
