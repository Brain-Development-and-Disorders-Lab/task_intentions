/**
 * @file 'Trial' screen containing components for trials requiring the
 * participant to interact with their partner directly or indirectly.
 * Core components include 'Option' and 'Card'.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useRef, useState } from "react";

// Logging library
import consola from "consola";

// UI components
import { Box, Button, Grid, Heading, Layer, Text } from "grommet";
import { LinkNext } from "grommet-icons";
import TextTransition, { presets } from "react-text-transition";

// Custom components
import Option from "src/lib/view/components/Option";
import Card from "src/lib/view/components/Card";

// Access theme constants directly
import { Theme } from "src/lib/theme";

// Configuration
import { Configuration } from "src/configuration";

/**
 * @summary Generate a 'Trial' screen with two options and avatar cards on
 * the left and right of the options
 * @param {Props.Screens.Trial} props collection of props
 * @return {ReactElement} 'Trial' screen
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
  const [correctCount, setCorrectCount] = useState(0);

  // Overlay visibility state
  const [showOverlay, setShowOverlay] = useState(false);

  // Selection state
  const [hasSelected, setHasSelected] = useState(false);

  // Content of the overlay
  const [overlayContent, setOverlayContent] = useState(
    <Text>Oops! There should be content here.</Text>
  );
  let selectedOption: Options;

  // Create references for each Option
  const refs = {
    optionOne: useRef(null),
    optionTwo: useRef(null),
  };

  // Store the correct answer, this changes in some practice trials
  let answer = props.answer;

  // Store the option configuration
  const defaultPoints = {
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
      defaultPoints.options.one.participant = trialData["ppt1"];
      defaultPoints.options.one.partner = trialData["par1"];
      defaultPoints.options.two.participant = trialData["ppt2"];
      defaultPoints.options.two.partner = trialData["par2"];

      // Update the correct answer
      answer = trialData["Ac"] === 1 ? "Option 1" : "Option 2";
    } else {
      consola.warn(`'playerGuess' trial state data incomplete, using defaults`);
    }
  }

  /**
   * Update the points state for the participant and the partner
   * @param {number} participant updated points for the participant
   * @param {number} partner updated points for the partner
   */
  const addPoints = (participant: string, partner: string): void => {
    // Update the point totals
    setParticipantPoints(participant);
    setPartnerPoints(partner);
  };

  /**
   * Helper function to end the trial
   * @param {Options} option selected option
   */
  const endTrial = (option: Options): void => {
    // Reset the selection state
    setHasSelected(false);

    // Bubble the selection handler with selection and answer
    props.handler(option, defaultPoints, answer);
  };

  /**
   * Update the number of points of the participant and the
   * partner. The update process depends on the phase.
   * @param {Options} option selected option
   */
  const updatePoints = (option: Options): void => {
    // Points to apply
    let participantPoints = "";
    let partnerPoints = "";

    // Check what Phase is running
    if (props.display.toLowerCase().includes("guess")) {
      // 'playerGuess' trials update points from the correct choice
      if (props.display === "playerGuessPractice") {
        // Change the 'correct' answer depending on probability
        if (experiment.random() < 0.2) {
          // Change the 'correct' answer to the opposite of
          // what was selected
          answer = option === "Option 1" ? "Option 2" : "Option 1";
        }
      }

      // Participant points
      participantPoints =
        answer === "Option 1"
          ? displayPoints.options.one.participant.toString()
          : displayPoints.options.two.participant.toString();

      // Partner points
      partnerPoints =
        answer === "Option 1"
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

    // Apply the points
    addPoints(`+${participantPoints}`, `+${partnerPoints}`);

    // Call the selection handler
    handler(option);
  };

  /**
   * Selection handler
   * @param {Options} option the selected option
   */
  const handler = (option: Options) => {
    // Sum the number of correct answers for the phase
    const correctCountInitial = jsPsych.data
      .get()
      .filter({
        display: props.display,
      })
      .select("correctGuess")
      .sum();
    if (option === answer) {
      setCorrectCount(correctCountInitial + 1);
    } else {
      setCorrectCount(correctCountInitial);
    }

    // Update the selected option and the overlay text
    selectedOption = option;
    setOverlayContent(getOverlayContent());

    // Show the practice overlay if enabled
    setShowOverlay(props.isPractice);

    // Invoke the transition if non-practice trial
    if (
      props.isPractice === false ||
      Configuration.enableTutorialOverlay === false
    ) {
      transition();
    }
  };

  /**
   * Transition function to end the trial
   */
  const transition = () => {
    // Pull the selection into a function-scoped variable
    const trialSelection = selectedOption;

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
      selectedOption === "Option 1" ? optionOneNode : optionTwoNode;
    const unselectedNode =
      selectedNode === optionOneNode ? optionTwoNode : optionOneNode;
    const correctSelection = selectedOption === answer;

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
            endTrial(trialSelection);
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
            endTrial(trialSelection);
          }, 2000);
        }, 250);
        break;
      }
    }
  };

  /**
   * Generate and return the content to display in the overlay
   * shown in practice-type trials
   * @return {ReactElement}
   */
  const getOverlayContent = (): ReactElement => {
    let content: ReactElement = <></>;

    switch (props.display) {
      // Simple choice of the player
      case "playerChoice":
      case "playerChoicePractice":
      case "playerChoice2": {
        content = (
          <Box pad="xsmall" align="center" width="large" gap="xsmall">
            <Text size="medium" margin="small">
              You chose <b>{selectedOption}</b>. That means you get{" "}
              {selectedOption === "Option 1"
                ? displayPoints.options.one.participant
                : displayPoints.options.two.participant}{" "}
              points and your partner gets{" "}
              {selectedOption === "Option 1"
                ? displayPoints.options.one.partner
                : displayPoints.options.two.partner}{" "}
              points.
            </Text>

            {/* Continue button */}
            <Button
              primary
              color="button"
              label="Continue"
              size="medium"
              margin="xsmall"
              icon={<LinkNext />}
              reverse
              onClick={() => {
                // Invoke the inter-trial transition
                transition();
              }}
            />
          </Box>
        );
        break;
      }
      case "playerGuess":
      case "playerGuessPractice": {
        content = (
          <Box pad="xsmall" align="center" width="large" gap="xsmall">
            <Text size="medium" margin="small">
              {selectedOption === answer ? "Correct! " : "Incorrect. "}
              Your partner chose <b>{answer}</b>. That means you get{" "}
              {answer === "Option 1"
                ? displayPoints.options.one.participant
                : displayPoints.options.two.participant}{" "}
              points and your partner gets{" "}
              {answer === "Option 1"
                ? displayPoints.options.one.partner
                : displayPoints.options.two.partner}{" "}
              points.
            </Text>

            {/* Continue button */}
            <Button
              primary
              color="button"
              label="Continue"
              size="medium"
              margin="small"
              icon={<LinkNext />}
              reverse
              onClick={() => {
                // Invoke the inter-trial transition
                transition();
              }}
            />
          </Box>
        );
        break;
      }
    }

    return content;
  };

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

  return (
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
        avatar={Configuration.avatars.names.participant[experiment.getState().get("participantAvatar")]}
      />

      {/* Choices */}
      <Box gridArea="choiceArea" gap="small">
        <Box
          ref={refs.optionOne}
          onClick={() => {
            if (hasSelected === false) {
              setHasSelected(true);
              updatePoints("Option 1");
            }
          }}
          className="grow"
          round
          background="optionBackground"
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
          onClick={() => {
            if (hasSelected === false) {
              setHasSelected(true);
              updatePoints("Option 2");
            }
          }}
          className="grow"
          round
          background="optionBackground"
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
      {showOverlay && Configuration.enableTutorialOverlay && (
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
  );
};

export default Trial;
