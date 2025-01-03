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
import { Box, Button, Heading, Layer, WorldMap } from "grommet";
import { LinkNext } from "grommet-icons";

// Confetti
import Confetti from "react-confetti";

// Custom components
import Card from "src/lib/view/components/Card";

// Configuration
import { Configuration } from "src/configuration";

// Utility functions
import { calculatePoints } from "src/lib/util";
import useWindowSize from "react-use/lib/useWindowSize";

/**
 * @summary Generate a 'Summary' screen with two cards displaying each avatar
 * and point totals above a continue button
 * @param {Props.Screens.Summary} props screen props
 * @return {ReactElement} 'Summary' screen
 */
const Summary: FC<Props.Screens.Summary> = (
  props: Props.Screens.Summary
): ReactElement => {
  consola.debug(`Summary screen for '${props.postPhase}'`);

  // Get the participant's and the partner's avatars
  const experiment = window.Experiment;
  const participantAvatar: number = experiment.getState().get("participantAvatar");

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

  return (
    <>
      <Confetti width={width} height={height} run={runConfetti} />
      <WorldMap color="map" fill="horizontal" />
      <Layer plain>
        <Box direction="column" justify="center" width={{ min: "large" }} fill>
          {/* Heading */}
          <Heading
            level="1"
            fill
            alignSelf="center"
            margin={{
              top: "large",
            }}
          >
            Summary
          </Heading>

          {/* Participant */}
          <Card
            gridArea="participantArea"
            name="You"
            avatar={Configuration.avatars.names.participant[participantAvatar]}
            points={participantPoints}
          />

          {/* Continue button */}
          <Box justify="center" align="center" margin="small">
            <Button
              primary
              color="button"
              label="Continue"
              size="large"
              margin="medium"
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
    </>
  );
};

export default Summary;
