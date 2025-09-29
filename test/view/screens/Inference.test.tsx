/**
 * @file 'Inference' screen tests
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

test("loads and displays Inference screen", async () => {
  const props: Screens.Inference = {
    trial_number: 0,
    display: "inference",
    handler: () => {
      console.info("Selection handler called");
    },
  };
  render(<Wrapper display={"inference"} props={props} />);

  await waitFor(() => screen.queryAllByText("Totally"));
  expect(screen.queryAllByText("Totally")).not.toBeNull();
});
