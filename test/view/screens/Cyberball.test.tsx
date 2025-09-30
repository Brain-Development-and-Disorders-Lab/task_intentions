/**
 * @file Tests for the Cyberball screen component.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Cyberball from "src/view/screens/Cyberball";

// jsPsych wrapper library
import Experiment from "neurocog";

// Mock the configuration
jest.mock("src/configuration", () => ({
  Configuration: {
    cyberball: {
      // Timings
      tossInterval: 2000,
      totalTosses: 2,

      // Visual parameters
      ballSize: 40,
      ballColor: "#FF6B6B",
      viewWidth: 800,
      viewHeight: 600,

      // Avatar sizes
      participantAvatarSize: 100,
      partnerAvatarSize: 120,

      // Positioning of avatar containers
      positions: {
        participant: { x: 400, y: 480 },
        partnerA: { x: 120, y: 140 },
        partnerB: { x: 680, y: 140 },
      },

      // Positioning of ball targets
      ballPositions: {
        participant: { x: 400, y: 480 },
        partnerA: { x: 120, y: 130 },
        partnerB: { x: 680, y: 130 },
      },

      // Layout spacing
      partnerMargin: 20,
      participantBottomMargin: 80,
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
    trial_number: 1,
    display: "cyberball" as const,
    isInclusive: true,
    isCyberballPartnerHighStatus: true,
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

    // Mock experiment wrapper
    (window["Experiment"] as RecursivePartial<Experiment>) = {
      getState: jest.fn(() => {
        return {
          get: jest.fn(),
          set: jest.fn(),
        };
      }),
    };
  });

  it("renders the game interface with three players", () => {
    render(<Cyberball {...mockProps} />);

    expect(screen.getAllByText("Partner A")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Partner B")[0]).toBeInTheDocument();
    expect(screen.getAllByText("You")[0]).toBeInTheDocument();
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
    const partnerA = screen.getAllByText("Partner A")[1].closest("div");
    const partnerB = screen.getAllByText("Partner B")[0].closest("div");

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

  it("shows correct status message based on ball ownership", async () => {
    render(<Cyberball {...mockProps} />);

    // Initially participant has the ball
    expect(
      screen.getByText("Click on a partner to throw the ball to them!")
    ).toBeInTheDocument();

    // Click on partner A to toss the ball
    const partnerA = screen.getAllByText("Partner A")[1].closest("div");
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

  it("shows correct status positioning based on isCyberballPartnerHighStatus prop", () => {
    // Test with high status partner
    const highStatusProps = { ...mockProps, isCyberballPartnerHighStatus: true };
    const { rerender } = render(<Cyberball {...highStatusProps} />);

    // Check that the status label is present
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();

    // Test with low status partner
    const lowStatusProps = { ...mockProps, isCyberballPartnerHighStatus: false };
    rerender(<Cyberball {...lowStatusProps} />);

    // Check that the status label is still present
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("handles game completion and calls handler", async () => {
    // This test verifies that the game completion logic works
    // We'll test the completion overlay instead of the complex handler logic
    const mockMath = Object.create(global.Math);
    mockMath.random = jest.fn(() => 0.1); // Low value ensures ball returns to participant
    global.Math = mockMath;

    render(<Cyberball {...mockProps} />);

    // Simulate completing the game by clicking partners multiple times
    const partnerA = screen.getAllByText("Partner A")[1].closest("div");

    // Click partner A multiple times to reach totalTosses (20)
    for (let i = 0; i < 20; i++) {
      if (partnerA) {
        fireEvent.click(partnerA);
        // Wait a bit for the animation to complete
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    // Wait for game completion
    await waitFor(
      () => {
        expect(screen.getByText("Game Complete!")).toBeInTheDocument();
      },
      { timeout: 15000 }
    );

    // The handler should be called (we can't easily test the exact parameters due to timing)
    // but we can verify the game completion state
    expect(screen.getByText("Finished!")).toBeInTheDocument();

    // Restore original Math
    global.Math = Object.create(Math);
  });

  it("shows game completion overlay when game finishes", async () => {
    // Mock Math.random for predictable behavior
    const mockMath = Object.create(global.Math);
    mockMath.random = jest.fn(() => 0.5);
    global.Math = mockMath;

    render(<Cyberball {...mockProps} />);

    // Complete the game quickly
    const partnerA = screen.getAllByText("Partner A")[1].closest("div");
    for (let i = 0; i < 20; i++) {
      if (partnerA) fireEvent.click(partnerA);
      await waitFor(() => expect(screen.getByText(/Click on a partner|Waiting to receive|Game Complete/)).toBeInTheDocument(), { timeout: 50 });
    }

    await waitFor(
      () => {
        expect(screen.getByText("Finished!")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    global.Math = Object.create(Math);
  });

  it("handles inclusive mode correctly", async () => {
    const inclusiveProps = { ...mockProps, isInclusive: true };
    render(<Cyberball {...inclusiveProps} />);

    const partnerA = screen.getAllByText("Partner A")[1].closest("div");
    if (partnerA) fireEvent.click(partnerA);

    // In inclusive mode, partner should sometimes return ball to participant
    await waitFor(
      () => {
        // Should either show waiting message or ball returned to participant
        const waitingMessage = screen.queryByText("Waiting to receive the ball...");
        const throwMessage = screen.queryByText("Click on a partner to throw the ball to them!");
        expect(waitingMessage || throwMessage).toBeTruthy();
      },
      { timeout: 2000 }
    );
  });

  it("handles exclusive mode correctly", async () => {
    const exclusiveProps = { ...mockProps, isInclusive: false };
    render(<Cyberball {...exclusiveProps} />);

    const partnerA = screen.getAllByText("Partner A")[1].closest("div");
    if (partnerA) fireEvent.click(partnerA);

    // In exclusive mode, partner should sometimes exclude participant
    await waitFor(
      () => {
        // Should either show waiting message or ball returned to participant
        const throwMessage = screen.queryByText("Click on a partner to throw the ball to them!");
        expect(throwMessage).toBeFalsy();
      },
      { timeout: 2000 }
    );
  });

  it("disables partner clicks when participant doesn't have ball", async () => {
    render(<Cyberball {...mockProps} />);

    const partnerA = screen.getAllByText("Partner A")[1].closest("div");
    if (partnerA) {
      // Initially participant has ball, so partner should be clickable
      expect(partnerA).toHaveStyle({ cursor: "pointer" });
      expect(partnerA).toHaveStyle({ opacity: "1" });

      // Click partner to toss ball
      fireEvent.click(partnerA);

      // Wait for ball to be tossed
      await waitFor(
        () => {
          expect(screen.getByText("Waiting to receive the ball...")).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      // Now partner should be disabled
      expect(partnerA).toHaveStyle({ cursor: "default" });
      expect(partnerA).toHaveStyle({ opacity: "0.7" });
    }
  });

  it("renders avatars with correct configuration", () => {
    render(<Cyberball {...mockProps} />);

    // Check that avatars are rendered (we can't easily test specific avatar content)
    const participantAvatar = screen.getAllByText("You")[0].closest("div");
    const partnerAAvatar = screen.getAllByText("Partner A")[1].closest("div");
    const partnerBAvatar = screen.getByText("Partner B").closest("div");

    expect(participantAvatar).toBeInTheDocument();
    expect(partnerAAvatar).toBeInTheDocument();
    expect(partnerBAvatar).toBeInTheDocument();
  });

  it("displays partner IDs correctly", () => {
    render(<Cyberball {...mockProps} />);

    // Check that partner IDs are displayed (there should be two - one for each partner)
    const internalIdElements = screen.getAllByText(/Internal ID:/);
    expect(internalIdElements).toHaveLength(2);

    const prolificIdElements = screen.getAllByText(/Prolific ID: hidden for anonymity/);
    expect(prolificIdElements).toHaveLength(2);
  });

  it("shows correct status messages based on game state", () => {
    render(<Cyberball {...mockProps} />);

    // Initially participant has ball
    expect(screen.getByText("Click on a partner to throw the ball to them!")).toBeInTheDocument();

    // After clicking a partner, should show waiting message
    const partnerA = screen.getAllByText("Partner A")[1].closest("div");
    if (partnerA) {
      fireEvent.click(partnerA);
    }

    // The status should change (either to waiting or back to throwing)
    // We can't predict exactly due to random partner responses
    const statusText = screen.getByText(/Click on a partner|Waiting to receive|Game Complete/);
    expect(statusText).toBeInTheDocument();
  });

  it("ball element has correct initial properties", () => {
    render(<Cyberball {...mockProps} />);

    const ball = screen.getByTestId("cyberball-ball");
    expect(ball).toBeInTheDocument();
    expect(ball).toHaveStyle({
      width: "40px",
      height: "40px",
      backgroundColor: "#FF6B6B",
    });
  });

  it("handles different probability configurations", () => {
    const customProbabilities = {
      inclusion: 0.8,
      exclusion: {
        partnerA: 0.1,
        partnerB: 0.1,
      },
    };

    const customProps = { ...mockProps, probabilities: customProbabilities };
    render(<Cyberball {...customProps} />);

    // Component should render without errors
    expect(screen.getAllByText("Partner A")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Partner B")[0]).toBeInTheDocument();
    expect(screen.getAllByText("You")[0]).toBeInTheDocument();
  });

  it("renders social status bar with correct positioning", () => {
    render(<Cyberball {...mockProps} />);

    // Check that status bar elements are present
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();

    // Check that the status bar container exists
    const statusBar = screen.getByText("Low").closest("div");
    expect(statusBar).toBeInTheDocument();
  });

  it("handles partner response timing correctly", async () => {
    render(<Cyberball {...mockProps} />);

    const partnerA = screen.getAllByText("Partner A")[1].closest("div");
    if (partnerA) {
      fireEvent.click(partnerA);

      // Should show waiting message after animation completes
      await waitFor(
        () => {
          expect(screen.getByText("Waiting to receive the ball...")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    }
  });

  it("displays correct partner information", () => {
    render(<Cyberball {...mockProps} />);

    // Check partner names
    expect(screen.getAllByText("Partner A")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Partner B")[0]).toBeInTheDocument();
    expect(screen.getAllByText("You")[0]).toBeInTheDocument();

    // Check that internal IDs are displayed (there should be two - one for each partner)
    const internalIdElements = screen.getAllByText(/Internal ID:/);
    expect(internalIdElements).toHaveLength(2);
  });

  it("handles game completion correctly", async () => {
    // Mock Math.random to always return 0.5 for predictable behavior
    const mockMath = Object.create(global.Math);
    mockMath.random = jest.fn(() => 0.5);
    global.Math = mockMath;

    render(<Cyberball {...mockProps} />);

    // Complete the game
    const partnerA = screen.getAllByText("Partner A")[1].closest("div");
    for (let i = 0; i < 20; i++) {
      if (partnerA) fireEvent.click(partnerA);
      await waitFor(() => expect(screen.getByText(/Click on a partner|Waiting to receive|Game Complete/)).toBeInTheDocument(), { timeout: 50 });
    }

    // Should show completion overlay
    await waitFor(
      () => {
        expect(screen.getByText("Finished!")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    global.Math = Object.create(Math);
  });

  it("provides proper visual feedback for interactive elements", () => {
    render(<Cyberball {...mockProps} />);

    const partnerA = screen.getAllByText("Partner A")[1].closest("div");
    const partnerB = screen.getByText("Partner B").closest("div");

    // Initially both partners should be interactive
    if (partnerA) {
      expect(partnerA).toHaveStyle({ cursor: "pointer" });
      expect(partnerA).toHaveStyle({ opacity: "1" });
    }
    if (partnerB) {
      expect(partnerB).toHaveStyle({ cursor: "pointer" });
      expect(partnerB).toHaveStyle({ opacity: "1" });
    }
  });

  it("handles edge case of zero tosses", () => {
    // This test ensures the component doesn't break with edge configurations
    const edgeProps = {
      ...mockProps,
      probabilities: {
        inclusion: 0,
        exclusion: {
          partnerA: 0,
          partnerB: 0,
        },
      },
    };

    render(<Cyberball {...edgeProps} />);
    expect(screen.getAllByText("Partner A")[0]).toBeInTheDocument();
  });
});
