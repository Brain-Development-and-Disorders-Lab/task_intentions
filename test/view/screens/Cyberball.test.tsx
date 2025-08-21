/**
 * @file Tests for the Cyberball screen component.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Cyberball from "src/view/screens/Cyberball";

// Mock the configuration
jest.mock("src/configuration", () => ({
  Configuration: {
    cyberball: {
      fairPlayDuration: 1000, // Short duration for testing
      exclusionDuration: 1000,
      ballTossInterval: 500,
      totalDuration: 2000,
      ballSize: 40,
      playerSize: 80,
      fieldWidth: 800,
      fieldHeight: 600,
      ballColor: "#FF6B6B",
      playerColors: ["#4ECDC4", "#45B7D1", "#96CEB4"],
      instructions: "Test instructions",
      fairPlayMessage: "Fair play message",
      exclusionMessage: "Exclusion message",
      playerNames: ["You", "Player 1", "Player 2"],
      ballSpeed: 300,
      enableAnimations: true,
      enableSound: false,
    },
  },
}));

describe("Cyberball Screen", () => {
  const mockHandler = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders instructions phase initially", () => {
    render(<Cyberball trial={1} display="cyberball" handler={mockHandler} />);

    expect(screen.getByText("Ball Tossing Game")).toBeInTheDocument();
    expect(screen.getByText("Test instructions")).toBeInTheDocument();
    expect(screen.getByText("Start Game")).toBeInTheDocument();
  });

  it("transitions to game phase when start button is clicked", () => {
    render(<Cyberball trial={1} display="cyberball" handler={mockHandler} />);

    const startButton = screen.getByText("Start Game");
    fireEvent.click(startButton);

    expect(screen.getByText("Fair play message")).toBeInTheDocument();
  });

  it("calls handler when game completes", async () => {
    jest.useFakeTimers();

    render(<Cyberball trial={1} display="cyberball" handler={mockHandler} />);

    const startButton = screen.getByText("Start Game");
    fireEvent.click(startButton);

    // Fast-forward time to complete the game (fair play + exclusion duration)
    jest.advanceTimersByTime(3000); // This should complete both phases

    await waitFor(() => {
      expect(mockHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          phase: "complete",
          participantCatchCount: expect.any(Number),
          participantTossCount: expect.any(Number),
        })
      );
    });

    jest.useRealTimers();
  });
});
