/**
 * @file 'Slider' component tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Test utilities

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { act } from "react";

// React
import React from "react";

// Slider component
import Slider from "src/lib/view/components/Slider";

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

test("loads and displays Slider component", async () => {
  render(
    <Slider
      min={0}
      max={100}
      value={0}
      setValue={() => {}}
      isFocused
      leftLabel="Minimum"
      rightLabel="Maximum"
    />
  );

  await waitFor(() => expect(screen.getByText("Minimum")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("Maximum")).toBeInTheDocument());
});

test("check Slider component accessibility", async () => {
  const { container } = render(
    <Slider
      min={0}
      max={100}
      value={0}
      setValue={() => {}}
      isFocused
      leftLabel="Minimum"
      rightLabel="Maximum"
    />
  );

  await act(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
