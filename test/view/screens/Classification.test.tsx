/**
 * @file 'Classification' screen tests
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

test("loads and displays Classification screen", async () => {
  const props: Props.Screens.Classification = {
    trial: 0,
    display: "classification",
    handler: () => {
      console.info("Selection handler called");
    },
  };
  render(<Wrapper display={"classification"} props={props} />);

  await waitFor(() => screen.queryAllByPlaceholderText("Please select"));
  expect(screen.queryAllByPlaceholderText("Please select")).not.toBeNull();
});

test("check Classification screen accessibility", async () => {
  const props: Props.Screens.Classification = {
    trial: 0,
    display: "classification",
    handler: () => {
      console.info("Selection handler called");
    },
  };
  const { container } = render(
    <Wrapper display={"classification"} props={props} />
  );

  // Disable the 'nested-interactive' rule.
  // An issue with the Grommet library rather
  // than the setup here.
  const results = await axe(container, {
    rules: {
      "nested-interactive": {
        enabled: false,
      },
    },
  });
  expect(results).toHaveNoViolations();
});
