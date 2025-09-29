/**
 * @file 'Status' screen tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */
// React imports
import React from "react";

// Test utilities
import { waitFor, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Custom render function
import { render } from "test/utils/functions";

// Wrapper component
import Wrapper from "src/view/components/Wrapper";

test("loads and displays Status screen page 1", async () => {
  const props: Screens.Status = {
    trial_number: 0,
    display: "status",
    handler: () => {
      console.info("Status handler called");
    },
  };
  render(<Wrapper display={"status"} props={props} />);

  await waitFor(() =>
    screen.queryByText("How many close friends do you have?")
  );
  expect(
    screen.queryByText("How many close friends do you have?")
  ).not.toBeNull();
  expect(
    screen.queryByText("How often do you get invited to parties?")
  ).not.toBeNull();
  expect(
    screen.queryByText("How often are people mean to you at school or work?")
  ).not.toBeNull();

  // Check for Likert scale elements
  expect(screen.queryAllByText("Never")).toHaveLength(2);
  expect(screen.queryAllByText("All the Time")).toHaveLength(2);

  // Check for digit radio button labels (should have multiple since there are two scales)
  expect(screen.queryAllByLabelText("0")).toHaveLength(2);
  expect(screen.queryAllByLabelText("7")).toHaveLength(2);

  // Check that no radio buttons are initially selected
  const radioButtons = screen.getAllByRole("radio");
  radioButtons.forEach(radio => {
    expect(radio).not.toBeChecked();
  });
});

test("loads and displays Status screen page 2", async () => {
  const props: Screens.Status = {
    trial_number: 0,
    display: "status",
    handler: () => {
      console.info("Status handler called");
    },
  };
  render(<Wrapper display={"status"} props={props} />);
  await waitFor(() =>
    screen.queryByText("How many close friends do you have?")
  );

  // Fill in page 1 and continue to page 2
  const closeFriendsInput = screen.getByPlaceholderText("Enter number");
  await act(async () => {
    fireEvent.change(closeFriendsInput, { target: { value: "5" } });
  });

  // Select radio button options for the Likert scales
  const partyRadioButtons = screen.getAllByRole("radio");
  await act(async () => {
    fireEvent.click(partyRadioButtons[4]); // Select value 4 from first scale
  });

  await act(async () => {
    fireEvent.click(partyRadioButtons[10]); // Select value 2 from second scale (8 options + 2 from first = index 10)
  });

  // Check if the continue button is enabled
  const continueButton = screen.getByText("Continue");
  expect(continueButton).not.toBeDisabled();
  await act(async () => {
    continueButton.click();
  });

  await waitFor(() =>
    screen.queryByText(
      "Across all social media accounts, how many followers do you have?"
    )
  );
  expect(
    screen.queryByText(
      "Across all social media accounts, how many followers do you have?"
    )
  ).not.toBeNull();
  expect(
    screen.queryByText(
      "Across all social media accounts, how many people are following you?"
    )
  ).not.toBeNull();
});
