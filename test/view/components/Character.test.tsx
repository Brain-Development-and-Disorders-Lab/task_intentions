/**
 * @file 'Character' component tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Test utilities
import { waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// React
import React from "react";

// Custom render function
import { render } from "test/utils/functions";

// Character component
import Character from "src/view/components/Character";

test("loads and displays Character component", async () => {
  const { container } = render(
    <Character
      size={128}
      name="a"
      state="a"
      setState={() => {
        return;
      }}
    />
  );

  await waitFor(() =>
    expect(container.querySelector("svg")).toBeInTheDocument()
  );
});
