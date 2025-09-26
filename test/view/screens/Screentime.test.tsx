/**
 * @file Test file for `Screentime` questionnaire screen component.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React testing utilities
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Component to test
import Screentime from "src/view/screens/Questionnaires/Screentime";

// Test utilities
import TestWrapper from "test/utils/TestWrapper";

// Mock props
const mockProps = {
  trial_number: 1,
  display: "screentime" as const,
  handler: jest.fn(),
};

describe("Screentime", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the questionnaire title", () => {
    render(
      <TestWrapper>
        <Screentime {...mockProps} />
      </TestWrapper>
    );
    expect(
      screen.getByText("Social Media Usage Questionnaire")
    ).toBeInTheDocument();
  });

  test("renders the scoring scale explanation", () => {
    render(
      <TestWrapper>
        <Screentime {...mockProps} />
      </TestWrapper>
    );
    expect(screen.getByText(/1 = Less than 30 minutes/)).toBeInTheDocument();
    expect(screen.getByText(/9 = More than seven hours/)).toBeInTheDocument();
  });

  test("renders both questions", () => {
    render(
      <TestWrapper>
        <Screentime {...mockProps} />
      </TestWrapper>
    );
    expect(screen.getByText(/typically school day/)).toBeInTheDocument();
    expect(
      screen.getByText(/typical weekend or holiday day/)
    ).toBeInTheDocument();
  });

  test("renders radio button options for both questions", () => {
    render(
      <TestWrapper>
        <Screentime {...mockProps} />
      </TestWrapper>
    );

    // Check that radio buttons 1-9 are present for both questions
    for (let i = 1; i <= 9; i++) {
      expect(screen.getAllByDisplayValue(i.toString())).toHaveLength(2);
    }
  });

  test("continue button is disabled initially", () => {
    render(
      <TestWrapper>
        <Screentime {...mockProps} />
      </TestWrapper>
    );
    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });

  test("continue button is enabled when both questions are answered", () => {
    render(
      <TestWrapper>
        <Screentime {...mockProps} />
      </TestWrapper>
    );

    // Answer first question
    const firstQuestionRadios = screen.getAllByDisplayValue("1");
    fireEvent.click(firstQuestionRadios[0]);

    // Answer second question
    const secondQuestionRadios = screen.getAllByDisplayValue("2");
    fireEvent.click(secondQuestionRadios[1]);

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeEnabled();
  });

  test("calls handler with correct values when continue is clicked", () => {
    render(
      <TestWrapper>
        <Screentime {...mockProps} />
      </TestWrapper>
    );

    // Answer first question with option 3
    const firstQuestionRadios = screen.getAllByDisplayValue("3");
    fireEvent.click(firstQuestionRadios[0]);

    // Answer second question with option 5
    const secondQuestionRadios = screen.getAllByDisplayValue("5");
    fireEvent.click(secondQuestionRadios[1]);

    const continueButton = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(continueButton);

    expect(mockProps.handler).toHaveBeenCalledWith(3, 5);
  });

  test("handles response changes correctly", () => {
    render(
      <TestWrapper>
        <Screentime {...mockProps} />
      </TestWrapper>
    );

    // Change first question response
    const firstQuestionRadios = screen.getAllByDisplayValue("1");
    fireEvent.click(firstQuestionRadios[0]);

    // Change to different response
    const firstQuestionRadios2 = screen.getAllByDisplayValue("4");
    fireEvent.click(firstQuestionRadios2[0]);

    // Answer second question
    const secondQuestionRadios = screen.getAllByDisplayValue("2");
    fireEvent.click(secondQuestionRadios[1]);

    const continueButton = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(continueButton);

    expect(mockProps.handler).toHaveBeenCalledWith(4, 2);
  });
});
