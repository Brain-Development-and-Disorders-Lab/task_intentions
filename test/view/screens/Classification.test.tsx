/**
 * @file 'Classification' screen tests
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

test("loads and displays Classification screen", async () => {
  const props: Props.Screens.Classification = {
    trial_number: 0,
    display: "classification",
    handler: () => {
      console.info("Selection handler called");
    },
  };
  render(<Wrapper display={"classification"} props={props} />);

  await waitFor(() => screen.queryAllByPlaceholderText("Please select"));
  expect(screen.queryAllByPlaceholderText("Please select")).not.toBeNull();
});
