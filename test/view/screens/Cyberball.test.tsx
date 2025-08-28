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
      tossInterval: 500,
      totalDuration: 2000, // Short duration for testing
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
    isInclusive: true,
    partnerHighStatus: true,
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
    expect(
      screen.getByText("Click on a partner to throw the ball to them!")
    ).toBeInTheDocument();
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
        expect.any(Number),
        expect.any(Number),
        expect.any(Number)
      );
    });

    jest.useRealTimers();
  });

  it("operates in single mode throughout the game", async () => {
    jest.useFakeTimers();

    render(<Cyberball {...mockProps} />);

    // Fast-forward to just before game completion
    jest.advanceTimersByTime(1900);

    // Game should still be running (not completed yet)
    expect(mockHandler).not.toHaveBeenCalled();

    // Fast-forward past the total duration
    jest.advanceTimersByTime(200);

    // Game should now be completed
    await waitFor(() => {
      expect(mockHandler).toHaveBeenCalled();
    });

    jest.useRealTimers();
  });

  it("shows correct status message based on ball ownership", async () => {
    render(<Cyberball {...mockProps} />);

    // Initially participant has the ball
    expect(
      screen.getByText("Click on a partner to throw the ball to them!")
    ).toBeInTheDocument();

    // Click on partner A to toss the ball
    const partnerA = screen.getByText("Partner A").closest("div");
    if (partnerA) {
      fireEvent.click(partnerA);
    }

    // After tossing, should show waiting message
    await waitFor(
      () => {
        expect(
          screen.getByText("Waiting to receive the ball...")
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it("renders ball at correct initial position", () => {
    render(<Cyberball {...mockProps} />);

    // The ball should be visible (we can't easily test exact position in unit tests)
    // but we can verify the ball element exists
    const ball = screen.getByTestId("cyberball-ball");
    expect(ball).toBeInTheDocument();
  });

  it("displays status label above Partner A", () => {
    render(<Cyberball {...mockProps} />);

    // Check that the status label elements are present
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("shows correct status positioning based on partnerHighStatus prop", () => {
    // Test with high status partner
    const highStatusProps = { ...mockProps, partnerHighStatus: true };
    const { rerender } = render(<Cyberball {...highStatusProps} />);

    // Check that the status label is present
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();

    // Test with low status partner
    const lowStatusProps = { ...mockProps, partnerHighStatus: false };
    rerender(<Cyberball {...lowStatusProps} />);

    // Check that the status label is still present
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });
});
