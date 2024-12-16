/**
 * @file 'Inference' screen tests
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

test("loads and displays Inference screen", async () => {
  render(
    screenFactory.generate({
      display: "inference",
      screen: {
        trial: 0,
        display: "inference",
        handler: () => {
          console.info("Selection handler called");
        },
      },
    })
  );

  await waitFor(() => screen.queryAllByText("Totally"));

  expect(screen.queryAllByText("Totally")).not.toBeNull();
});

test("check Inference screen accessibility", async () => {
  const { container } = render(
    screenFactory.generate({
      display: "inference",
      screen: {
        trial: 0,
        display: "inference",
        handler: () => {
          console.info("Selection handler called");
        },
      },
    })
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
