/**
 * @file 'Classification' screen tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Test utilities
import { waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";

// Custom render function
import { render } from "test/utils/functions";

// Screen factory
import ScreenFactory from "src/lib/classes/factories/ScreenFactory";

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

let screenFactory: ScreenFactory;
beforeAll(() => {
  screenFactory = new ScreenFactory();
});

test("loads and displays Classification screen", async () => {
  render(
    screenFactory.generate({
      display: "classification",
      screen: {
        trial: 0,
        display: "classification",
        handler: () => {
          console.info("Selection handler called");
        },
      },
    })
  );

  await waitFor(() => screen.queryAllByPlaceholderText("Please select"));

  expect(screen.queryAllByPlaceholderText("Please select")).not.toBeNull();
});

test("check Classification screen accessibility", async () => {
  const { container } = render(
    screenFactory.generate({
      display: "classification",
      screen: {
        trial: 0,
        display: "classification",
        handler: () => {
          console.info("Selection handler called");
        },
      },
    })
  );

  // Disable the 'nested-interactive' rule.
  // An issue with the Grommet library rather
  // than the setup here.
  const results = await axe(container, {
    rules: {
      "nested-interactive": {
        enabled: false,
      },
    },
  });

  expect(results).toHaveNoViolations();
});
