/**
 * @file 'Inference' screen presenting two sliders for participant interaction.
 * Each slider is accompanied by a question regarding the participant's
 * thoughts on their partner from the previous phase. Participant is required
 * to move the thumb on each slide before the continue button is enabled.
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
const SLIDER_DEFAULT = 50;

/**
 * @summary Generate an 'Inference' screen presenting two sliders for
 * participant interaction. Questions accompany each slider, and the
 * sliders require interaction before the continue button is enabled.
 * @param {Props.Screens.Inference} props component props
 * @return {ReactElement} 'Inference' screen
 */
const Inference: FC<Props.Screens.Inference> = (
  props: Props.Screens.Inference
): ReactElement => {
  // Slider states, monitor if they have been interacted with
  // Top slider
  const [firstMoved, setFirstMoved] = useState(false);
  const [firstValue, setFirstValue] = useState(SLIDER_DEFAULT);

  // Second slider
  const [secondMoved, setSecondMoved] = useState(false);
  const [secondValue, setSecondValue] = useState(SLIDER_DEFAULT);

  return (
    <Box
      justify="center"
      align="center"
      gap="small"
      style={{ maxWidth: "50%", margin: "auto" }}
      animation={["fadeIn"]}
    >
      {/* First question */}
      <Paragraph margin="small" size="large" fill>
        Please use the slider below to indicate the extent to which you believe
        your partner's decisions are driven by their desire to earn points in
        this task.
      </Paragraph>
      <Slider
        min={0}
        max={100}
        initial={firstValue}
        leftLabel="Not at all"
        rightLabel="Totally"
        onChange={() => {
          setFirstMoved(true);
        }}
        setValue={setFirstValue}
      />

      {/* Second question */}
      <Paragraph margin="small" size="large" fill>
        Please use the slider below to indicate the extent to which you believe
        your partner's decisions are driven by their desire to reduce your bonus
        in this task.
      </Paragraph>
      <Slider
        min={0}
        max={100}
        initial={secondValue}
        leftLabel="Not at all"
        rightLabel="Totally"
        onChange={() => {
          setSecondMoved(true);
        }}
        setValue={setSecondValue}
      />

      {/* Continue button */}
      <Button
        primary
        margin={{ top: "auto" }}
        color="button"
        label="Continue"
        disabled={
          // Disabled until both sliders have been interacted with
          firstMoved === false || secondMoved === false
        }
        size="large"
        icon={<LinkNext />}
        reverse
        onClick={() => {
          props.handler(firstValue, secondValue);
        }}
      />
    </Box>
  );
};

export default Inference;
