/**
 * @file 'Option' component tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Test utilities
import { waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import { act } from "react";

// React
import React from "react";

// Custom render function
import { render } from "test/utils/functions";

// Option component
import Option from "src/lib/view/components/Option";

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

test("loads and displays Option component", async () => {
  await waitFor(() =>
    render(
      <Option
        optionKey="test"
        optionName="Option Test"
        pointsParticipant={15}
        pointsPartner={12}
      />
    )
  );

  await waitFor(() => expect(screen.getByText("+15")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("+12")).toBeInTheDocument());
});

test("check Option component accessibility", async () => {
  const { container } = render(
    <Option
      optionKey="test"
      optionName="Option Test"
      pointsParticipant={15}
      pointsPartner={12}
    />
  );

  await act(async () => {
    const results = await axe(container);
    await waitFor(() => expect(results).toHaveNoViolations());
  });
});
