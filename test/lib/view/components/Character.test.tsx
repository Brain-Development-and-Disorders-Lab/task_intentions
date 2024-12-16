/**
 * @file 'Character' component tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Test utilities
import { waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import { act } from "react-dom/test-utils";

// React
import React from "react";

// Custom render function
import { render } from "test/utils/functions";

// Character component
import Character from "src/lib/view/components/Character";

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

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

test("check Character component accessibility", async () => {
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

  await act(async () => {
    const results = await axe(container, {
      rules: {
        "svg-img-alt": { enabled: false },
      },
    });
    await waitFor(() => expect(results).toHaveNoViolations());
  });
});
