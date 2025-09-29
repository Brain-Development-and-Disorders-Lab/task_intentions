/**
 * @file 'Agency' screen tests
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

test("loads and displays Agency screen", async () => {
  const props: Screens.Agency = {
    trial_number: 0,
    display: "agency",
    handler: () => {
      console.info("Selection handler called");
    },
  };
  render(<Wrapper display={"agency"} props={props} />);

  await waitFor(() => screen.queryByText("Agree"));
  expect(screen.queryByText("Agree")).not.toBeNull();
});
