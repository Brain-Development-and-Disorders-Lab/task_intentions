/**
 * @file 'Agency' screen tests
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

test("loads and displays Agency screen", async () => {
  const props: Props.Screens.Agency = {
    trial: 0,
    display: "agency",
    handler: () => {
      console.info("Selection handler called");
    },
  };
  render(<Wrapper display={"agency"} props={props} />);

  await waitFor(() => screen.queryByText("Agree"));
  expect(screen.queryByText("Agree")).not.toBeNull();
});

test("check Agency screen accessibility", async () => {
  const props: Props.Screens.Agency = {
    trial: 0,
    display: "agency",
    handler: () => {
      console.info("Selection handler called");
    },
  };
  const { container } = render(<Wrapper display={"agency"} props={props} />);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
