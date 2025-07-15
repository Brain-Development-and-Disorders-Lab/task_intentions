/**
 * @file 'Card' component tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Test utilities
import { waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// React
import React from "react";

// Custom render function
import { render } from "test/utils/functions";

// Card component
import Card from "src/view/components/Card";

test("loads and displays Card component", async () => {
  await waitFor(() =>
    render(<Card gridArea="a" name="Henry" points={"0"} avatar="a" />)
  );

  await waitFor(() => expect(screen.getByText("Henry")).toBeInTheDocument());
});
