/**
 * @file 'Card' component tests
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

// Card component
import Card from "src/lib/view/components/Card";

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

test("loads and displays Card component", async () => {
  await waitFor(() =>
    render(<Card gridArea="a" name="Henry" points={"0"} avatar="a" />)
  );

  await waitFor(() => expect(screen.getByText("Henry")).toBeInTheDocument());
});

test("check Card component accessibility", async () => {
  const { container } = render(
    <Card gridArea="a" name="Henry" points={"0"} avatar="a" />
  );

  await act(async () => {
    const results = await axe(container, {
      rules: {
        "svg-img-alt": { enabled: false },
      },
    });
    await waitFor(() => expect(results).toHaveNoViolations());
  });
});
