/**
 * @file Test file for the Status component.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React from "react";

// Test utilities
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Custom render function
import { render } from "test/utils/functions";

// Component to test
import Status from "src/view/components/Status";

// Mock the global Experiment object
const mockExperiment = {
  getState: () => ({
    get: jest.fn().mockReturnValue(0), // Default avatar index
  }),
};

// Mock the Configuration
jest.mock("src/configuration", () => ({
  Configuration: {
    avatars: {
      names: {
        participant: ["d", "e", "f"],
        partner: ["a", "b", "c"],
      },
      colours: ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
      variant: "beam",
    },
  },
}));

// Mock the boring-neutral-avatars component
jest.mock("boring-neutral-avatars", () => {
  return function MockAvatar({ name, size }: { name: string; size: number }) {
    return (
      <div
        data-testid={`avatar-${name}`}
        style={{ width: size, height: size }}
      />
    );
  };
});

// Set up global Experiment mock
Object.defineProperty(window, "Experiment", {
  value: mockExperiment,
  writable: true,
});

describe("Status Component", () => {
  test("renders with participant and partner status values", () => {
    const props: Components.Status = {
      participantStatus: 75,
      partnerStatus: 25,
    };

    render(<Status {...props} />);

    // Check that avatars are rendered
    expect(screen.getByTestId("avatar-a")).toBeInTheDocument();

    // Check that scale labels are present
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  test("renders with different status values", () => {
    const props: Components.Status = {
      participantStatus: 50,
      partnerStatus: 50,
    };

    render(<Status {...props} />);

    // Check that avatars are rendered
    expect(screen.getByTestId("avatar-a")).toBeInTheDocument();

    // Check that scale labels are present
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });
});
