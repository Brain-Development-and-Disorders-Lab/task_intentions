/**
 * @file 'Trial' screen tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */
// React import
import React from "react";

// Test utilities
import { waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Custom render function
import { render } from "test/utils/functions";

// Wrapper component
import Wrapper from "src/view/components/Wrapper";

// Mock jsPsych
import "jspsych";
jest.mock("jspsych");

// Mock the jsPsych wrapper library
import { Experiment } from "neurocog";
jest.mock("neurocog");

// Mock the Configuration
jest.mock("src/configuration", () => ({
  Configuration: {
    avatars: {
      names: {
        participant: ["a", "b", "c", "d", "e", "f"],
        partner: ["a", "b", "c"],
      },
      colours: ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
      variant: "beam",
    },
    manipulations: {
      enableStatusPhaseOne: false,
      enableStatusPhaseTwo: false,
      enableStatusPhaseThree: false,
      isPartnerHighStatusPhaseOne: false,
      isPartnerHighStatusPhaseTwo: false,
      isPartnerHighStatusPhaseThree: false,
    },
    statusDisplay: {
      low: 55,
      high: 80,
      variance: 2,
    },
  },
}));

// Mock the Flags
jest.mock("src/flags", () => ({
  Flags: {
    isEnabled: jest.fn().mockReturnValue(false),
  },
}));

// Setup the Experiment instances
beforeEach(() => {
  // Experiment
  (window["Experiment"] as RecursivePartial<Experiment>) = {
    getState: jest.fn(() => {
      return {
        get: jest.fn().mockReturnValue(0), // Default avatar index
        set: jest.fn(),
      };
    }),
  };
});

test("loads and displays Trial screen", async () => {
  const props: Screens.Trial = {
    trial_number: 0,
    display: "playerChoice",
    isPractice: false,
    participantPoints: 5,
    partnerPoints: 7,
    options: {
      one: {
        participant: 1,
        partner: 2,
      },
      two: {
        participant: 2,
        partner: 1,
      },
    },
    answer: "Option 1",
    handler: (selection: string) => {
      console.info(`Selected:`, selection);
    },
  };
  render(<Wrapper display={"playerChoice"} props={props} />);

  // Waiting for 'TextTransition' elements to have updated
  // upon first rendering the screen
  await waitFor(() => {
    expect(screen.getAllByText("You")).not.toBe(null);
  });
});

// Helper function to create trial props
const createTrialProps = (
  display: Display,
  isPractice = false
): Screens.Trial => ({
  trial_number: 0,
  display,
  isPractice,
  participantPoints: 5,
  partnerPoints: 7,
  options: {
    one: {
      participant: 1,
      partner: 2,
    },
    two: {
      participant: 2,
      partner: 1,
    },
  },
  answer: "Option 1",
  handler: (selection: string) => {
    console.info(`Selected:`, selection);
  },
});

// Helper function to check if Status component is visible
const checkStatusVisibility = async (shouldBeVisible: boolean) => {
  if (shouldBeVisible) {
    // Status component should be visible - look for "Low" and "High" labels
    await waitFor(() => {
      expect(screen.getByText("Low")).toBeInTheDocument();
      expect(screen.getByText("High")).toBeInTheDocument();
    });
  } else {
    // Status component should not be visible
    await waitFor(() => {
      expect(screen.queryByText("Low")).not.toBeInTheDocument();
      expect(screen.queryByText("High")).not.toBeInTheDocument();
    });
  }
};

// Helper function to check if Status component is visible (without accessibility testing)
const checkStatusVisibilitySimple = async (shouldBeVisible: boolean) => {
  if (shouldBeVisible) {
    // Status component should be visible - look for "Low" and "High" labels
    await waitFor(() => {
      expect(screen.getByText("Low")).toBeInTheDocument();
      expect(screen.getByText("High")).toBeInTheDocument();
    });
  } else {
    // Status component should not be visible
    await waitFor(() => {
      expect(screen.queryByText("Low")).not.toBeInTheDocument();
      expect(screen.queryByText("High")).not.toBeInTheDocument();
    });
  }
};

describe("Status component conditional display", () => {
  // Import the mocked modules
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Flags } = require("src/flags");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Configuration } = require("src/configuration");

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Set default values
    Flags.isEnabled.mockReturnValue(false);
    Configuration.manipulations.enableStatusPhaseOne = false;
    Configuration.manipulations.enableStatusPhaseTwo = false;
    Configuration.manipulations.enableStatusPhaseThree = false;
  });

  test("Status component not visible when enableStatusDisplay flag is false", async () => {
    // Set up: enableStatusDisplay flag is false (default)
    Flags.isEnabled.mockReturnValue(false);

    const props = createTrialProps("playerChoice", false);
    render(<Wrapper display={"playerChoice"} props={props} />);

    await checkStatusVisibilitySimple(false);
  });

  test("Status component not visible during practice trials", async () => {
    // Set up: enableStatusDisplay flag is true, but it's a practice trial
    Flags.isEnabled.mockReturnValue(true);
    Configuration.manipulations.enableStatusPhaseOne = true;

    const props = createTrialProps("playerChoice", true); // isPractice: true
    render(<Wrapper display={"playerChoice"} props={props} />);

    await checkStatusVisibility(false);
  });

  test("Status component visible for Phase 1 when both flag and phase manipulation are enabled", async () => {
    // Set up: enableStatusDisplay flag is true and Phase 1 manipulation is enabled
    Flags.isEnabled.mockReturnValue(true);
    Configuration.manipulations.enableStatusPhaseOne = true;

    const props = createTrialProps("playerChoice", false);
    render(<Wrapper display={"playerChoice"} props={props} />);

    await checkStatusVisibility(true);
  });

  test("Status component not visible for Phase 1 when flag is enabled but phase manipulation is disabled", async () => {
    // Set up: enableStatusDisplay flag is true but Phase 1 manipulation is disabled
    Flags.isEnabled.mockReturnValue(true);
    Configuration.manipulations.enableStatusPhaseOne = false;

    const props = createTrialProps("playerChoice", false);
    render(<Wrapper display={"playerChoice"} props={props} />);

    await checkStatusVisibility(false);
  });

  test("Status component visible for Phase 2 when both flag and phase manipulation are enabled", async () => {
    // Set up: enableStatusDisplay flag is true and Phase 2 manipulation is enabled
    Flags.isEnabled.mockReturnValue(true);
    Configuration.manipulations.enableStatusPhaseTwo = true;

    const props = createTrialProps("playerGuess", false);
    render(<Wrapper display={"playerGuess"} props={props} />);

    await checkStatusVisibility(true);
  });

  test("Status component not visible for Phase 2 when flag is enabled but phase manipulation is disabled", async () => {
    // Set up: enableStatusDisplay flag is true but Phase 2 manipulation is disabled
    Flags.isEnabled.mockReturnValue(true);
    Configuration.manipulations.enableStatusPhaseTwo = false;

    const props = createTrialProps("playerGuess", false);
    render(<Wrapper display={"playerGuess"} props={props} />);

    await checkStatusVisibility(false);
  });

  test("Status component visible for Phase 3 when both flag and phase manipulation are enabled", async () => {
    // Set up: enableStatusDisplay flag is true and Phase 3 manipulation is enabled
    Flags.isEnabled.mockReturnValue(true);
    Configuration.manipulations.enableStatusPhaseThree = true;

    const props = createTrialProps("playerChoice2", false);
    render(<Wrapper display={"playerChoice2"} props={props} />);

    await checkStatusVisibility(true);
  });

  test("Status component not visible for Phase 3 when flag is enabled but phase manipulation is disabled", async () => {
    // Set up: enableStatusDisplay flag is true but Phase 3 manipulation is disabled
    Flags.isEnabled.mockReturnValue(true);
    Configuration.manipulations.enableStatusPhaseThree = false;

    const props = createTrialProps("playerChoice2", false);
    render(<Wrapper display={"playerChoice2"} props={props} />);

    await checkStatusVisibility(false);
  });

  test("Status component not visible for Phase 1 when different phase manipulation is enabled", async () => {
    // Set up: enableStatusDisplay flag is true, Phase 1 disabled, Phase 2 enabled
    Flags.isEnabled.mockReturnValue(true);
    Configuration.manipulations.enableStatusPhaseOne = false;
    Configuration.manipulations.enableStatusPhaseTwo = true;

    const props = createTrialProps("playerChoice", false); // Phase 1 trial
    render(<Wrapper display={"playerChoice"} props={props} />);

    await checkStatusVisibility(false);
  });

  test("Status component visible for multiple phases when all manipulations are enabled", async () => {
    // Set up: enableStatusDisplay flag is true and all phase manipulations are enabled
    Flags.isEnabled.mockReturnValue(true);
    Configuration.manipulations.enableStatusPhaseOne = true;
    Configuration.manipulations.enableStatusPhaseTwo = true;
    Configuration.manipulations.enableStatusPhaseThree = true;

    // Test Phase 1
    const props1 = createTrialProps("playerChoice", false);
    const { unmount: unmount1 } = render(
      <Wrapper display={"playerChoice"} props={props1} />
    );
    await checkStatusVisibility(true);
    unmount1();

    // Test Phase 2
    const props2 = createTrialProps("playerGuess", false);
    const { unmount: unmount2 } = render(
      <Wrapper display={"playerGuess"} props={props2} />
    );
    await checkStatusVisibility(true);
    unmount2();

    // Test Phase 3
    const props3 = createTrialProps("playerChoice2", false);
    render(<Wrapper display={"playerChoice2"} props={props3} />);
    await checkStatusVisibility(true);
  });
});
