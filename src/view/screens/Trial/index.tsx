/**
 * @file `Trial` screen for game interaction trials.
 *
 * This screen manages the core gameplay interactions between participants
 * and their partners. Key features include:
 * - Point distribution options for decision-making
 * - Partner and participant information cards
 * - Trial-specific instructions and feedback
 * - Support for both direct and indirect partner interactions
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Logging library
import consola from "consola";

// UI components
import { Box, Button, Grid, Heading, Keyboard, Layer, Text } from "grommet";
import { LinkNext } from "grommet-icons";
import TextTransition, { presets } from "react-text-transition";

// Custom components
import Option from "src/view/components/Option";
import Card from "src/view/components/Card";

// Access theme constants directly
import { Theme } from "src/theme";

// Configuration
import { Configuration } from "src/configuration";

// Feature flags
import { Flags } from "src/flags";

// Keyboard bindings
import { BINDINGS } from "src/bindings";

/**
 * Trial screen component that displays two options and avatar cards for point-splitting decisions
 * or guessing partner's choices. Supports both practice and real trials.
 * @component
 * @param {Props.Screens.Trial} props - Component props
 * @param {string} props.display - Type of trial display ("playerGuess", "playerChoice", "playerChoice2")
 * @param {boolean} props.isPractice - Whether this is a practice trial
 * @param {string} props.answer - The correct answer for guess trials ("Option 1" or "Option 2")
 * @param {Props.Components.Options} props.options - Configuration for the two point-splitting options
 * @param {number} props.trial - Current trial number (1-based)
 * @param {(state: TrialState) => void} props.handler - Callback function when trial completes
 * @returns {ReactElement} Trial screen with options, avatar cards, and points display
 */
const Trial: FC<Props.Screens.Trial> = (
  props: Props.Screens.Trial
): ReactElement => {
  // Get the Experiment instance
  const experiment = window.Experiment;

  // Header state
  let defaultHeader = !props.display.startsWith("playerGuess")
    ? "How will you split the points?"
    : "How will your partner split the points?";

  // Update the header if this is a practice
  if (props.isPractice) {
    defaultHeader = `Practice: ${defaultHeader}`;
  }

  const [trialHeader, setTrialHeader] = useState(defaultHeader);

  // Points state
  const [participantPoints, setParticipantPoints] = useState("");
  const [partnerPoints, setPartnerPoints] = useState("");

  // Number of correct answers
  const initialCorrectCount = jsPsych.data
    .get()
    .filter({
      display: props.display,
    })
    .select("correctGuess")
    .sum();
  const [correctCount, setCorrectCount] = useState(initialCorrectCount);

  // Overlay visibility state
  const [showOverlay, setShowOverlay] = useState(false);

  // Initial trial state
  const initialTrialState: TrialState = {
    hasSelected: false,
    highlightedOptionIndex: 0,
    selectedOption: "Option 1",
    answer: props.answer,
  };

  // If this is a practice trial, randomly change the answer
  if (props.display.startsWith("playerGuess") && props.isPractice) {
    initialTrialState.answer = Math.random() > 0.5 ? "Option 1" : "Option 2";
  }

  const [trialState, setTrialState] = useState<TrialState>(initialTrialState);

  // Transition activity state
  const [transitionActive, setTransitionActive] = useState(false);

  // Input blocking state, used during transitions with overlays
  const [blockInput, setBlockInput] = useState(false);

  // Create references for each Option
  const refs = {
    optionOne: useRef(null),
    optionTwo: useRef(null),
  };

  // Store the option configuration
  const DEFAULT_POINTS = {
    options: {
      one: {
        participant: props.options.one.participant,
        partner: props.options.one.partner,
      },
      two: {
        participant: props.options.two.participant,
        partner: props.options.two.partner,
      },
    },
  };

  // Store a completely separate configuration for the display of the points,
  // for the purpose of adjustment in 'playerGuess' trials
  const displayPoints = {
    options: {
      one: {
        participant: props.options.one.participant,
        partner: props.options.one.partner,
      },
      two: {
        participant: props.options.two.participant,
        partner: props.options.two.partner,
      },
    },
  };

  // Use data from the API if available
  if (props.display === "playerGuess") {
    if (experiment.getState().get("partnerChoices").length > 0) {
      // Update the values stored for the points
      const partnerChoices = experiment.getState().get("partnerChoices");
      // 'PARd' -> partner decisions
      const trialData = partnerChoices[props.trial - 1];

      // Switch participant and partner points
      displayPoints.options.one.participant = trialData["par1"];
      displayPoints.options.one.partner = trialData["ppt1"];
      displayPoints.options.two.participant = trialData["par2"];
      displayPoints.options.two.partner = trialData["ppt2"];

      // Update default points
      DEFAULT_POINTS.options.one.participant = trialData["ppt1"];
      DEFAULT_POINTS.options.one.partner = trialData["par1"];
      DEFAULT_POINTS.options.two.participant = trialData["ppt2"];
      DEFAULT_POINTS.options.two.partner = trialData["par2"];
    } else {
      consola.warn(`'playerGuess' trial state data incomplete, using defaults`);
    }
  }

  // Partner avatar
  let partnerAvatar: string;
  if (props.display.toLowerCase().endsWith("practice")) {
    partnerAvatar = "example";
  } else {
    // Get the global state of the partner avatar
    partnerAvatar =
      Configuration.avatars.names.partner[
        experiment.getState().get("partnerAvatar")
      ];

    // Update state to refresh partner avatar at next match screen
    if (experiment.getState().get("refreshPartner") === false) {
      experiment.getState().set("refreshPartner", true);
    }
  }

  /**
   * Handles the selection of an option during a trial
   * @param {("Option 1" | "Option 2")} option - The selected option identifier
   * @description
   * This function manages the logic when a player selects an option during a trial:
   * - For guess trials:
   *   - In practice mode, may randomly change the correct answer (20% chance)
   *   - Updates points based on the correct answer
   * - For choice trials:
   *   - Updates points based on the selected option
   * - Updates participant and partner point displays
   * - Tracks correct answer count
   * - Updates trial state
   * - Either transitions to next trial or shows practice overlay
   */
  const handleOptionClick = (option: "Option 1" | "Option 2") => {
    if (trialState.hasSelected === false) {
      // Update the selection state
      setTrialState((trialState) => ({
        ...trialState,
        selectedOption: option,
        highlightedOptionIndex: option === "Option 1" ? 0 : 1,
        hasSelected: true,
      }));

      // Points to apply
      let participantPoints = "";
      let partnerPoints = "";

      // Check what Phase is running
      if (props.display.toLowerCase().includes("guess")) {
        // Participant points
        participantPoints =
          trialState.answer === "Option 1"
            ? displayPoints.options.one.participant.toString()
            : displayPoints.options.two.participant.toString();

        // Partner points
        partnerPoints =
          trialState.answer === "Option 1"
            ? displayPoints.options.one.partner.toString()
            : displayPoints.options.two.partner.toString();
      } else {
        // 'playerChoice' trials simply update the points as required
        // Participant points
        participantPoints =
          option === "Option 1"
            ? displayPoints.options.one.participant.toString()
            : displayPoints.options.two.participant.toString();

        // Partner points
        partnerPoints =
          option === "Option 1"
            ? displayPoints.options.one.partner.toString()
            : displayPoints.options.two.partner.toString();
      }

      // Update the point totals
      setParticipantPoints(participantPoints);
      setPartnerPoints(partnerPoints);

      // Sum the number of correct answers for the phase
      const correctCountInitial = jsPsych.data
        .get()
        .filter({
          display: props.display,
        })
        .select("correctGuess")
        .sum();

      if (option === trialState.answer) {
        setCorrectCount(correctCountInitial + 1);
      } else {
        setCorrectCount(correctCountInitial);
      }

      if (
        props.isPractice === false ||
        Flags.isEnabled("enableTutorialOverlay") === false
      ) {
        // Begin the transition to the next trial
        setTransitionActive(true);
      } else {
        // Display the overlay
        setShowOverlay(props.isPractice);
      }
    }
  };

  /**
   * Helper function to end the trial
   * Updates transition state, calls handler with selection data, and resets trial state
   */
  const endTrial = (): void => {
    // Update the transition activity state
    setTransitionActive(false);

    // Bubble the selection handler with selection and answer
    props.handler(trialState.selectedOption, DEFAULT_POINTS, trialState.answer);

    // Reset the trial state
    setTrialState(initialTrialState);
  };

  /**
   * Transition function to end the trial
   */
  const transition = () => {
    // Block all submit input events
    setBlockInput(true);

    // Hide the overlay if shown
    setShowOverlay(false);

    // Get the references to the nodes
    const optionOneNode = refs.optionOne.current as unknown as HTMLElement;
    const optionTwoNode = refs.optionTwo.current as unknown as HTMLElement;

    // Disable all pointer events
    if (optionOneNode && optionTwoNode) {
      optionOneNode.style.pointerEvents = "none";
      optionTwoNode.style.pointerEvents = "none";
    }

    // Get the selected node object
    const selectedNode =
      trialState.selectedOption === "Option 1" ? optionOneNode : optionTwoNode;
    const unselectedNode =
      selectedNode === optionOneNode ? optionTwoNode : optionOneNode;
    const correctSelection = trialState.selectedOption === trialState.answer;

    // Check the stage of the trial
    switch (props.display) {
      // Simple choice of the player
      case "playerChoice":
      case "playerChoicePractice":
      case "playerChoice2": {
        // Timeout to change the opacity of the options
        window.setTimeout(() => {
          // Hide the unselected option
          unselectedNode.style.opacity = "0";

          window.setTimeout(() => {
            // Hide the selected option
            selectedNode.style.opacity = "0";
          }, 1500);

          // Set a timeout for continuing
          window.setTimeout(() => {
            // Reset the styling
            optionOneNode.style.opacity = "1";
            optionTwoNode.style.opacity = "1";
            optionOneNode.style.pointerEvents = "auto";
            optionTwoNode.style.pointerEvents = "auto";

            // Update the point values to trigger animation
            setParticipantPoints("");
            setPartnerPoints("");

            // End the trial
            endTrial();
          }, 2000);
        }, 250);
        break;
      }

      // Player guessing partner choices, show feedback
      case "playerGuess":
      case "playerGuessPractice": {
        if (correctSelection === true) {
          setTrialHeader("You chose correctly!");
        } else {
          setTrialHeader("You chose incorrectly.");
        }

        // Timeout to change the color of the selected answer
        // and the opacity of the unselected answer
        window.setTimeout(() => {
          // Set the background of the two options
          // depending on the correct selection
          selectedNode.style.background = correctSelection
            ? Theme.global.colors.correct
            : Theme.global.colors.incorrect;

          window.setTimeout(() => {
            // Hide the options before trial end
            optionOneNode.style.opacity = "0";
            optionTwoNode.style.opacity = "0";

            optionOneNode.style.background =
              Theme.global.colors.optionBackground;
            optionTwoNode.style.background =
              Theme.global.colors.optionBackground;
          }, 1500);

          // Set a timeout to reset view and end the trial
          window.setTimeout(() => {
            // Reset the styling
            optionOneNode.style.opacity = "1";
            optionTwoNode.style.opacity = "1";
            optionOneNode.style.pointerEvents = "auto";
            optionTwoNode.style.pointerEvents = "auto";

            // Update the point values to trigger animation
            setParticipantPoints("");
            setPartnerPoints("");

            // Reset the header state
            setTrialHeader(defaultHeader);

            // End the trial
            endTrial();
          }, 2000);
        }, 250);
        break;
      }
    }
  };

  /**
   * Handle keyboard input from user interaction
   * @param {React.KeyboardEvent<HTMLElement>} event Keyboard input event
   */
  const inputHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    // Disable keyboard input if not enabled in configuration or if transition active
    if (
      Configuration.manipulations.useAlternateInput === false ||
      blockInput ||
      transitionActive
    )
      return;

    // Avoid holding the key down
    if (event.repeat) return;
    event.preventDefault();

    if (
      event.key.toString() === BINDINGS.NEXT ||
      event.key.toString() === BINDINGS.PREVIOUS
    ) {
      if (trialState.hasSelected === false) {
        // Update the state based on the keypress
        if (trialState.highlightedOptionIndex === 0) {
          setTrialState((trialState) => ({
            ...trialState,
            selectedOption: "Option 2",
            highlightedOptionIndex: 1,
          }));
        } else {
          setTrialState((trialState) => ({
            ...trialState,
            selectedOption: "Option 1",
            highlightedOptionIndex: 0,
          }));
        }
      }
    } else if (event.key.toString() === BINDINGS.SELECT) {
      if (trialState.hasSelected === false) {
        // Complete the option selection
        handleOptionClick(
          trialState.highlightedOptionIndex === 0 ? "Option 1" : "Option 2"
        );
      } else {
        // Run the transition to the next trial
        transition();
      }
    }
  };

  // Memoized overlay content
  const overlayContent = useMemo((): ReactElement => {
    switch (props.display) {
      case "playerGuess":
      case "playerGuessPractice": {
        return (
          <Box pad="xsmall" align="center" width="large" gap="xsmall">
            <Text size="medium" margin="small">
              {trialState.selectedOption === trialState.answer
                ? "Correct! "
                : "Incorrect. "}
              Your partner chose <b>{trialState.answer}</b>. That means you get{" "}
              {trialState.answer === "Option 1"
                ? displayPoints.options.one.participant
                : displayPoints.options.two.participant}{" "}
              points and your partner gets{" "}
              {trialState.answer === "Option 1"
                ? displayPoints.options.one.partner
                : displayPoints.options.two.partner}{" "}
              points.
            </Text>

            {/* Continue button */}
            <Box
              margin={"none"}
              pad={"none"}
              border={
                Configuration.manipulations.useAlternateInput === true && {
                  color: "selectedElement",
                  size: "large",
                }
              }
              style={
                Configuration.manipulations.useAlternateInput === true
                  ? { borderRadius: "32px " }
                  : {}
              }
              round
            >
              <Button
                primary
                color="button"
                label="Continue"
                size="medium"
                icon={<LinkNext />}
                reverse
                onClick={() => {
                  // Invoke the inter-trial transition
                  transition();
                }}
              />
            </Box>
          </Box>
        );
      }
      // Simple choice of the player
      case "playerChoice":
      case "playerChoicePractice":
      case "playerChoice2":
      default: {
        return (
          <Box pad="xsmall" align="center" width="large" gap="xsmall">
            <Text size="medium" margin="small">
              You chose <b>{trialState.selectedOption}</b>. That means you get{" "}
              {trialState.selectedOption === "Option 1"
                ? displayPoints.options.one.participant
                : displayPoints.options.two.participant}{" "}
              points and your partner gets{" "}
              {trialState.selectedOption === "Option 1"
                ? displayPoints.options.one.partner
                : displayPoints.options.two.partner}{" "}
              points.
            </Text>

            {/* Continue button */}
            <Box
              margin={"none"}
              pad={"none"}
              border={
                Configuration.manipulations.useAlternateInput === true && {
                  color: "selectedElement",
                  size: "large",
                }
              }
              style={
                Configuration.manipulations.useAlternateInput === true
                  ? { borderRadius: "32px " }
                  : {}
              }
              round
            >
              <Button
                primary
                color={"button"}
                label={"Continue"}
                size={"medium"}
                margin={"none"}
                icon={<LinkNext />}
                reverse
                onClick={() => {
                  // Invoke the inter-trial transition
                  transition();
                }}
              />
            </Box>
          </Box>
        );
      }
    }
  }, [trialState.selectedOption]);

  // Invoke the transition if the transition is active and an option has been selected
  useEffect(() => {
    if (transitionActive === true && trialState.hasSelected === true) {
      // Invoke the transition
      transition();
    }
  }, [transitionActive]);

  return (
    <Keyboard onKeyDown={inputHandler} target={"document"}>
      <Grid
        rows={["xxsmall", "medium", "xxsmall"]}
        columns={["flex", "1/2", "flex"]}
        gap="xsmall"
        width={{
          min: "960px",
          max: "xlarge",
        }}
        fill
        areas={[
          { name: "trialHeader", start: [0, 0], end: [2, 0] },
          { name: "playerArea", start: [0, 1], end: [0, 1] },
          { name: "choiceArea", start: [1, 1], end: [1, 1] },
          { name: "partnerArea", start: [2, 1], end: [2, 1] },
          { name: "gridFooter", start: [0, 2], end: [2, 2] },
        ]}
      >
        <Heading
          textAlign="center"
          fill
          level={2}
          size="auto"
          margin="xsmall"
          gridArea="trialHeader"
        >
          {trialHeader}
        </Heading>

        {/* Participant's Avatar */}
        <Card
          gridArea="playerArea"
          name="You"
          points={participantPoints}
          avatar={
            Configuration.avatars.names.participant[
              experiment.getState().get("participantAvatar")
            ]
          }
        />

        {/* Choices */}
        <Box gridArea="choiceArea" gap="small">
          <Box
            ref={refs.optionOne}
            onClick={() => handleOptionClick("Option 1")}
            className="grow"
            round
            background="optionBackground"
            border={
              Configuration.manipulations.useAlternateInput === true &&
              trialState.highlightedOptionIndex === 0
                ? { color: "selectedElement", size: "large" }
                : {}
            }
            fill
          >
            <Option
              optionKey="optionOne"
              optionName="Option 1"
              pointsParticipant={displayPoints.options.one.participant}
              pointsPartner={displayPoints.options.one.partner}
            />
          </Box>

          <Box
            ref={refs.optionTwo}
            onClick={() => handleOptionClick("Option 2")}
            className="grow"
            round
            background="optionBackground"
            border={
              Configuration.manipulations.useAlternateInput === true &&
              trialState.highlightedOptionIndex === 1
                ? { color: "selectedElement", size: "large" }
                : {}
            }
            fill
          >
            <Option
              optionKey="optionTwo"
              optionName="Option 2"
              pointsParticipant={displayPoints.options.two.participant}
              pointsPartner={displayPoints.options.two.partner}
            />
          </Box>
        </Box>

        {/* Partner's Avatar */}
        <Card
          gridArea="partnerArea"
          name="Partner"
          points={partnerPoints}
          avatar={partnerAvatar}
        />

        {/* Counter for correct guesses */}
        {props.display.startsWith("playerGuess") && (
          <Box
            direction="row"
            justify="center"
            margin="xsmall"
            gridArea="gridFooter"
          >
            <Heading level={2} size="auto" margin="xsmall">
              Correct guesses:&nbsp;
            </Heading>
            <Heading level={2} size="auto" margin="xsmall">
              <TextTransition text={correctCount} springConfig={presets.slow} />
            </Heading>
          </Box>
        )}

        {/* Practice overlay */}
        {showOverlay && Flags.isEnabled("enableTutorialOverlay") && (
          <Layer position="center">
            <Box pad="small" align="center" gap="xsmall">
              <Heading margin="xsmall" level="2">
                Practice
              </Heading>
              {/* Display the overlay content */}
              {overlayContent}
            </Box>
          </Layer>
        )}
      </Grid>
    </Keyboard>
  );
};

export default Trial;
