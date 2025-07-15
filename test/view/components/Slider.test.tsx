/**
 * @file 'Slider' component tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Test utilities

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";

// React
import React from "react";

// Slider component
import Slider from "src/view/components/Slider";

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
