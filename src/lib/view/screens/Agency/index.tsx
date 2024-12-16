/**
 * @file 'Agency' screen presenting a slider to the participant alongside
 * a question for the participant. The participant must interact with the
 * slider before the continue button is enabled.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useState } from "react";

// Grommet UI components
import { Box, Button, Paragraph } from "grommet";
import { LinkNext } from "grommet-icons";

// Custom components
import Slider from "src/lib/view/components/Slider";

// Constants
const SLIDER_DEFAULT = 50; // Sets the 'thumb' to the middle of the slider

/**
 * @summary Generate an 'Agency' containing a slider accompanied by a
 * question to the participant, requiring the participant to respond.
 * @param {Props.Screens.Agency} props component props
 * @return {ReactElement} 'Agency' screen
 */
const Agency: FC<Props.Screens.Agency> = (
  props: Props.Screens.Agency
): ReactElement => {
  // Slider states, monitor if they have been interacted with
  // Top slider
  const [sliderMoved, setSliderMoved] = useState(false);
  const [sliderValue, setSliderValue] = useState(SLIDER_DEFAULT);

  return (
    <Box
      justify="center"
      align="center"
      style={{ maxWidth: "50%", margin: "auto" }}
      gap="small"
      animation={["fadeIn"]}
      flex
      direction="column"
    >
      <Paragraph margin="small" size="large" fill>
        Some labs use deception. For our own purposes, it is helpful to know to
        what extent you believed that the other partners really existed.
      </Paragraph>
      <Paragraph margin="small" size="large" fill>
        I believe I played with real partners.
      </Paragraph>
      <Slider
        min={0}
        max={100}
        initial={sliderValue}
        leftLabel="Disagree"
        rightLabel="Agree"
        onChange={() => {
          setSliderMoved(true);
        }}
        setValue={setSliderValue}
      />
      <Button
        primary
        margin={{ top: "large" }}
        color="button"
        label="Continue"
        disabled={
          // Disabled until slider has been interacted with
          sliderMoved === false
        }
        size="large"
        icon={<LinkNext />}
        reverse
        onClick={() => {
          props.handler(sliderValue);
        }}
      />
    </Box>
  );
};

export default Agency;
