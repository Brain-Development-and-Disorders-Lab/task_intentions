/**
 * @file 'Status' screen tests
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

test("loads and displays Status screen page 1", async () => {
  const props: Props.Screens.Status = {
    trial: 0,
    display: "status",
    handler: () => {
      console.info("Status handler called");
    },
  };
  render(<Wrapper display={"status"} props={props} />);

  await waitFor(() => screen.queryByText("Followers?"));
  expect(screen.queryByText("Followers?")).not.toBeNull();
  expect(screen.queryByText("Average Likes?")).not.toBeNull();
});

test("check Status screen accessibility", async () => {
  const props: Props.Screens.Status = {
    trial: 0,
    display: "status",
    handler: () => {
      console.info("Status handler called");
    },
  };
  const { container } = render(<Wrapper display={"status"} props={props} />);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
