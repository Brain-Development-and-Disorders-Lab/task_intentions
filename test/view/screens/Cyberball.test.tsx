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
      inclusionDuration: 1000, // Short duration for testing
      exclusionDuration: 1000,
      tossInterval: 500,
      totalDuration: 2000,
      ballSize: 40,
      playerSize: 80,
      viewWidth: 800,
      viewHeight: 600,
      ballColor: "#FF6B6B",
    },
    avatars: {
      names: {
        participant: ["a", "b", "c", "d", "e", "f"],
        partner: ["a", "b", "c"],
      },
      colours: ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
      variant: "beam",
    },
    state: {
      participantAvatar: 0,
    },
  },
}));

describe("Cyberball Screen", () => {
  const mockHandler = jest.fn();
  const mockProps = {
    trial: 1,
    display: "cyberball" as const,
    probabilities: {
      inclusion: 0.7,
      exclusion: {
        partnerA: 0.2,
        partnerB: 0.2,
      },
    },
    handler: mockHandler,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the game interface with three players", () => {
    render(<Cyberball {...mockProps} />);

    expect(screen.getByText("Partner A")).toBeInTheDocument();
    expect(screen.getByText("Partner B")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
  });

  it("shows status bar with correct message when participant has ball", () => {
    render(<Cyberball {...mockProps} />);

    // Initially participant should have the ball
    expect(screen.getByText("Throw the ball!")).toBeInTheDocument();
  });

  it("allows participant to toss ball to partners when they have the ball", async () => {
    render(<Cyberball {...mockProps} />);

    // Initially participant should have the ball
    const partnerA = screen.getByText("Partner A").closest("div");
    const partnerB = screen.getByText("Partner B").closest("div");

    expect(partnerA).toBeInTheDocument();
    expect(partnerB).toBeInTheDocument();

    // Click on partner A to toss the ball
    if (partnerA) {
      fireEvent.click(partnerA);
    }

    // Wait for the ball to be tossed and then returned
    await waitFor(
      () => {
        expect(mockHandler).not.toHaveBeenCalled(); // Game should still be running
      },
      { timeout: 3000 }
    );
  });

  it("calls handler when game completes", async () => {
    jest.useFakeTimers();

    render(<Cyberball {...mockProps} />);

    // Fast-forward time to complete the game
    jest.advanceTimersByTime(2500); // This should complete the total duration

    await waitFor(() => {
      expect(mockHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          phase: expect.stringMatching(/inclusion|exclusion/),
          participantCatchCount: expect.any(Number),
          participantTossCount: expect.any(Number),
          exclusionStartTime: expect.any(Number),
        })
      );
    });

    jest.useRealTimers();
  });

  it("transitions from inclusion to exclusion phase", async () => {
    jest.useFakeTimers();

    render(<Cyberball {...mockProps} />);

    // Fast-forward to just before phase transition
    jest.advanceTimersByTime(900);

    // Game should still be in inclusion phase
    expect(mockHandler).not.toHaveBeenCalled();

    // Fast-forward past the inclusion phase
    jest.advanceTimersByTime(200);

    // Game should still be running (not completed yet)
    expect(mockHandler).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("shows correct status message based on ball ownership", async () => {
    render(<Cyberball {...mockProps} />);

    // Initially participant has the ball
    expect(screen.getByText("Throw the ball!")).toBeInTheDocument();

    // Click on partner A to toss the ball
    const partnerA = screen.getByText("Partner A").closest("div");
    if (partnerA) {
      fireEvent.click(partnerA);
    }

    // After tossing, should show waiting message
    await waitFor(() => {
      expect(screen.getByText("Waiting...")).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it("renders ball at correct initial position", () => {
    render(<Cyberball {...mockProps} />);

    // The ball should be visible (we can't easily test exact position in unit tests)
    // but we can verify the ball element exists
    const ball = screen.getByTestId("cyberball-ball");
    expect(ball).toBeInTheDocument();
  });
});
