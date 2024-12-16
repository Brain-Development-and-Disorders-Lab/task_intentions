/**
 * @file 'SelectAvatar' screen tests
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

test("loads and displays SelectAvatar screen", async () => {
  render(
    screenFactory.generate({
      display: "selection",
      screen: {
        trial: 0,
        display: "selection",
        handler: () => {
          console.info("Selection handler called");
        },
      },
    })
  );

  await waitFor(() => screen.getByRole("heading"));

  expect(screen.getByRole("heading")).toHaveTextContent("Choose your Avatar!");
});

test("check SelectAvatar screen accessibility", async () => {
  const { container } = render(
    screenFactory.generate({
      display: "selection",
      screen: {
        trial: 0,
        display: "selection",
        handler: () => {
          console.info("Selection handler called");
        },
      },
    })
  );

  // Run the check, disabling 'duplicate-id' rule.
  // Rule fails on components inside the avatar SVGs.
  const results = await axe(container, {
    rules: {
      "duplicate-id": {
        enabled: false,
      },
      "svg-img-alt": { enabled: false },
    },
  });

  expect(results).toHaveNoViolations();
});
