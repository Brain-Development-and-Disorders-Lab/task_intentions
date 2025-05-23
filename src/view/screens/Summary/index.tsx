/**
 * @file 'Summary' screen presenting a left card and right card with the
 * avatar's point totals below each image. The left avatar represents the
 * participant, and the right avatar represents the partner. The background
 * consists of a map graphic. Points for the summary are calculated from the
 * phase specified in the `props.postPhase` prop.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useState } from "react";

// Logging library
import consola from "consola";

// Grommet UI components
import { Box, Button, Heading, Keyboard, Layer, WorldMap } from "grommet";
import { LinkNext } from "grommet-icons";

// Confetti
import Confetti from "react-confetti";

// Custom components
import Card from "src/view/components/Card";

// Configuration
import { Configuration } from "src/configuration";

// Utility functions
import { calculatePoints } from "src/util";
import useWindowSize from "react-use/lib/useWindowSize";

// Keyboard input bindings
import { BINDINGS } from "src/bindings";

/**
 * @summary Generate a 'Summary' screen presenting two cards - one showing the participant's avatar and points,
 * and one showing their partner's avatar and points. Displays total points accumulated across all game phases.
 * @param {Props.Screens.Summary} props Component props containing:
 *  - postPhase: {string} The phase to calculate points from
 *  - handler: {() => void} Callback function when participant continues
 * @return {ReactElement} 'Summary' screen with avatar cards, point totals, and continue button
 */
const Summary: FC<Props.Screens.Summary> = (
  props: Props.Screens.Summary
): ReactElement => {
  consola.debug(`Summary screen for '${props.postPhase}'`);

  // Get the participant's and the partner's avatars
  const experiment = window.Experiment;
  const participantAvatar: number = experiment
    .getState()
    .get("participantAvatar");

  // Get the participant's and the partner's points
  const totalParticipantPoints =
    calculatePoints("playerChoice", "playerPoints_selected") +
    calculatePoints("playerChoice2", "playerPoints_selected") +
    calculatePoints("playerGuess", "playerPoints_selected");

  // Convert to strings for display
  const participantPoints = totalParticipantPoints.toString();

  // Configure confetti animation
  const { width, height } = useWindowSize();
  const [runConfetti, setRunConfetti] = useState(true);

  /**
   * Handle keyboard input from user interaction
   * @param {React.KeyboardEvent<HTMLElement>} event Keyboard input event
   */
  const inputHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    // Disable keyboard input if not enabled in configuration
    if (Configuration.manipulations.useAlternateInput === false) return;

    // Avoid holding the key down
    if (event.repeat) return;
    event.preventDefault();

    if (event.key.toString() === BINDINGS.SELECT) {
      // Run the handler function
      props.handler();
    }
  };

  return (
    <Keyboard onKeyDown={inputHandler} target={"document"}>
      <Confetti width={width} height={height} run={runConfetti} />
      <WorldMap color="map" fill="horizontal" />
      <Layer plain>
        <Box justify={"center"} align={"center"} gap={"small"}>
          {/* Heading */}
          <Heading level="1" fill alignSelf="center" margin={"xsmall"}>
            Summary
          </Heading>

          {/* Participant */}
          <Box width={"medium"} margin={"xsmall"}>
            <Card
              gridArea="participantArea"
              name="You"
              avatar={
                Configuration.avatars.names.participant[participantAvatar]
              }
              points={participantPoints}
            />
          </Box>

          {/* Continue button */}
          <Box
            margin={"none"}
            pad={"none"}
            border={{
              color:
                Configuration.manipulations.useAlternateInput === true
                  ? "selectedElement"
                  : "transparent",
              size: "large",
            }}
            style={
              Configuration.manipulations.useAlternateInput === true
                ? { borderRadius: "36px " }
                : {}
            }
            round
          >
            <Button
              primary
              color="button"
              label="Continue"
              icon={<LinkNext />}
              reverse
              onClick={() => {
                // Stop the confetti
                setRunConfetti(false);

                // Run the handler function
                props.handler();
              }}
            />
          </Box>
        </Box>
      </Layer>
    </Keyboard>
  );
};

export default Summary;
