/**
 * @file 'Inference' screen tests
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

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

test("loads and displays Inference screen", async () => {
  const props: Props.Screens.Inference = {
    trial: 0,
    display: "inference",
    handler: () => {
      console.info("Selection handler called");
    },
  };
  render(<Wrapper display={"inference"} props={props} />);

  await waitFor(() => screen.queryAllByText("Totally"));
  expect(screen.queryAllByText("Totally")).not.toBeNull();
});

test("check Inference screen accessibility", async () => {
  const props: Props.Screens.Inference = {
    trial: 0,
    display: "inference",
    handler: () => {
      console.info("Selection handler called");
    },
  };
  const { container } = render(<Wrapper display={"inference"} props={props} />);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
