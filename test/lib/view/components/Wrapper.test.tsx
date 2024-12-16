/**
 * @file 'Wrapper' component tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Test utilities
import { waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import { act } from "react-dom/test-utils";

// React
import React from "react";

// Custom render function
import { render } from "test/utils/functions";

// Wrapper component
import Wrapper from "src/lib/view/components/Wrapper";

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

test("loads and displays Wrapper component with Agency screen", async () => {
  await waitFor(() =>
    render(
      <Wrapper
        display="agency"
        screen={{
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

test("check Wrapper component accessibility", async () => {
  const { container } = render(
    <Wrapper
      display="agency"
      screen={{
        trial: 1,
        display: "agency",
        handler: () => {
          return;
        },
      }}
    />
  );

  await act(async () => {
    const results = await axe(container);
    await waitFor(() => expect(results).toHaveNoViolations());
  });
});
