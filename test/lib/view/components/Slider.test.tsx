/**
 * @file 'Slider' component tests
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

// Slider component
import Slider from "src/lib/view/components/Slider";

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

test("loads and displays Slider component", async () => {
  await waitFor(() =>
    render(
      <Slider min={0} max={100} leftLabel="Minimum" rightLabel="Maximum" />
    )
  );

  await waitFor(() => expect(screen.getByText("Minimum")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("Maximum")).toBeInTheDocument());
});

test("check Slider component accessibility", async () => {
  const { container } = render(
    <Slider min={0} max={100} leftLabel="Minimum" rightLabel="Maximum" />
  );

  await act(async () => {
    const results = await axe(container);
    await waitFor(() => expect(results).toHaveNoViolations());
  });
});
