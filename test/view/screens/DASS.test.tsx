/**
 * @file Tests for the DASS questionnaire component.
 *
 * Tests the DASS component's rendering, navigation, and response handling
 * for both adult and adolescent versions.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React testing utilities
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Component to test
import DASS from "src/view/screens/Questionnaires/DASS";

// Test utilities
import TestWrapper from "test/utils/TestWrapper";

describe("DASS Component", () => {
  const mockHandler = jest.fn();

  beforeEach(() => {
    mockHandler.mockClear();
  });

  describe("Adult Version", () => {
    const adultProps = {
      trial: 1,
      display: "dass" as const,
      version: "adult" as const,
      handler: mockHandler
    };

    it("renders the first page with DASS explanation", () => {
      render(
        <TestWrapper>
          <DASS {...adultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("DASS-21 Questionnaire")).toBeInTheDocument();
      expect(screen.getByText(/The following questions ask about how you have been feeling/)).toBeInTheDocument();
      expect(screen.getByText("Continue")).toBeInTheDocument();
    });

    it("navigates to questions page after clicking continue", () => {
      render(
        <TestWrapper>
          <DASS {...adultProps} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText("Continue"));
      expect(screen.getByText("DASS-21 Questions")).toBeInTheDocument();
      expect(screen.getByText("1. Question 1 for adults")).toBeInTheDocument();
    });

    it("shows adult questions and allows responses", () => {
      render(
        <TestWrapper>
          <DASS {...adultProps} />
        </TestWrapper>
      );

      // Navigate to questions page
      fireEvent.click(screen.getByText("Continue"));

      // Check questions are displayed
      expect(screen.getByText("1. Question 1 for adults")).toBeInTheDocument();
      expect(screen.getByText("2. Question 2 for adults")).toBeInTheDocument();
      expect(screen.getByText("21. Question 21 for adults")).toBeInTheDocument();

      // Submit button should be disabled initially
      expect(screen.getByText("Submit")).toBeDisabled();
    });
  });

  describe("Adolescent Version", () => {
    const adolescentProps = {
      trial: 1,
      display: "dass" as const,
      version: "adolescent" as const,
      handler: mockHandler
    };

    it("renders adolescent questions", () => {
      render(
        <TestWrapper>
          <DASS {...adolescentProps} />
        </TestWrapper>
      );

      // Navigate to questions page
      fireEvent.click(screen.getByText("Continue"));

      expect(screen.getByText("1. Question 1 for adolescents")).toBeInTheDocument();
      expect(screen.getByText("2. Question 2 for adolescents")).toBeInTheDocument();
      expect(screen.getByText("21. Question 21 for adolescents")).toBeInTheDocument();
    });
  });
});
