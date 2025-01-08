/**
 * @file 'Matching' screen tests
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
import Wrapper from "src/lib/view/components/Wrapper";

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

test("loads and displays Matching screen", async () => {
  const props: Props.Screens.Matching = {
    trial: 0,
    display: "matching",
    fetchData: false,
    handler(participantParameters, partnerParameters) {
      console.info(participantParameters, partnerParameters);
    },
  };
  render(<Wrapper display={"matching"} props={props} />);

  await waitFor(() => screen.queryByText("Finding you a partner..."));
  expect(screen.queryByText("Finding you a partner...")).not.toBeNull();
});

test("check Matching screen accessibility", async () => {
  const props: Props.Screens.Matching = {
    trial: 0,
    display: "matching",
    fetchData: false,
    handler(participantParameters, partnerParameters) {
      console.info(participantParameters, partnerParameters);
    },
  };
  const { container } = render(<Wrapper display={"matching"} props={props} />);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
