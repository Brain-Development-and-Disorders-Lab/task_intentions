/**
 * @file 'Matching' screen tests
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

test("loads and displays Matching screen", async () => {
  render(
    screenFactory.generate({
      display: "matching",
      screen: {
        trial: 0,
        display: "matching",
      },
    })
  );

  await waitFor(() => screen.queryByText("Finding you a partner..."));

  expect(screen.queryByText("Finding you a partner...")).not.toBeNull();
});

test("check Matching screen accessibility", async () => {
  const { container } = render(
    screenFactory.generate({
      display: "matching",
      screen: {
        trial: 0,
        display: "matching",
      },
    })
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
