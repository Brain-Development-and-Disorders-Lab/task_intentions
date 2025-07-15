/**
 * @file 'Wrapper' component tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Test utilities
import { waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// React
import React from "react";

// Custom render function
import { render } from "test/utils/functions";

// Wrapper component
import Wrapper from "src/view/components/Wrapper";

test("loads and displays Wrapper component with Agency screen", async () => {
  await waitFor(() =>
    render(
      <Wrapper
        display="agency"
        props={{
          trial: 1,
          display: "agency",
          handler: () => {
            return;
          },
        }}
      />
    )
  );

  await waitFor(() => expect(screen.getByText("Agree")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("Disagree")).toBeInTheDocument());
});
