/**
 * @file 'SelectAvatar' screen tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */
// React import
import React from "react";

// Test utilities
import { waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Custom render function
import { render } from "test/utils/functions";

// Wrapper component
import Wrapper from "src/view/components/Wrapper";

// Experiment class
import Experiment from "neurocog";

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

test("loads and displays SelectAvatar screen", async () => {
  const props: Props.Screens.SelectAvatar = {
    trial: 0,
    display: "selection",
    handler: () => {
      console.info("Selection handler called");
    },
  };
  render(<Wrapper display={"selection"} props={props} />);

  await waitFor(() => screen.getByRole("heading"));
  expect(screen.getByRole("heading")).toHaveTextContent("Choose your Avatar!");
});
