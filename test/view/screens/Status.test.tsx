/**
 * @file 'Status' screen tests
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
