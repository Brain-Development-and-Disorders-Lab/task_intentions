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
import { Box, Button, Keyboard, Paragraph } from "grommet";
import { LinkNext } from "grommet-icons";

// Custom components
import Slider from "src/lib/view/components/Slider";

// Keyboard input bindings
import { BINDINGS } from "src/lib/bindings";

// Experiment configuration
import { Configuration } from "src/configuration";

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

  // Selected UI element (used for alternate input)
  const [selectedElementIndex, setSelectedElementIndex] = useState(0);
  const [elementFocused, setElementFocused] = useState(false);

  /**
   * Handle keyboard input from user interaction
   * @param {React.KeyboardEvent<HTMLElement>} event Keyboard input event
   */
  const inputHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    // Disable keyboard input if not enabled in configuration
    if (Configuration.manipulations.useAlternateInput === false) return;

    // Avoid holding the key down if no element focused
    if (elementFocused === false && event.repeat) return;
    event.preventDefault();

    if (
      event.key.toString() === BINDINGS.NEXT ||
      event.key.toString() === BINDINGS.PREVIOUS
    ) {
      if (elementFocused === true) {
        if (selectedElementIndex === 0) {
          // First slider, increase and decrease value within bounds when keys pressed
          if (event.key.toString() === BINDINGS.NEXT) {
            setFirstValue(firstValue + 1 <= 100 ? firstValue + 1 : 100);
          } else if (event.key.toString() === BINDINGS.PREVIOUS) {
            setFirstValue(firstValue - 1 >= 0 ? firstValue - 1 : 0);
          }
          setFirstMoved(true);
        } else if (selectedElementIndex === 1) {
          // Second slider, increase and decrease value within bounds when keys pressed
          if (event.key.toString() === BINDINGS.NEXT) {
            setSecondValue(secondValue + 1 <= 100 ? secondValue + 1 : 100);
          } else if (event.key.toString() === BINDINGS.PREVIOUS) {
            setSecondValue(secondValue - 1 >= 0 ? secondValue - 1 : 0);
          }
          setSecondMoved(true);
        }
      } else {
        if (event.key.toString() === BINDINGS.NEXT) {
          setSelectedElementIndex(
            selectedElementIndex + 1 < 3 ? selectedElementIndex + 1 : 2
          );
        } else if (event.key.toString() === BINDINGS.PREVIOUS) {
          setSelectedElementIndex(
            selectedElementIndex - 1 >= 0 ? selectedElementIndex - 1 : 0
          );
        }
      }
    } else if (event.key.toString() === BINDINGS.SELECT) {
      if (selectedElementIndex !== 2) {
        // Focus or unfocus sliders
        setElementFocused(!elementFocused);
      } else {
        // Select the `Continue` button if permitted
        if (firstMoved === true && secondMoved === true) {
          props.handler(firstValue, secondValue);
        }
      }
    }
  };

  return (
    <Keyboard onKeyDown={inputHandler} target={"document"}>
      <Box
        justify="between"
        align="center"
        gap="small"
        style={{ maxWidth: "50%", margin: "auto" }}
        height={{ max: "75vh" }}
        width={"xlarge"}
        animation={["fadeIn"]}
      >
        {/* First question */}
        <Paragraph margin="small" size="large" fill>
          Please use the slider below to indicate the extent to which you
          believe your partner's decisions are driven by their desire to earn
          points in this task.
        </Paragraph>
        <Box
          border={
            { color: Configuration.manipulations.useAlternateInput === true && selectedElementIndex === 0 &&
              !elementFocused ? "selectedElement" : "transparent", size: "large" }
          }
          pad={"xsmall"}
          round
        >
          <Slider
            min={0}
            max={100}
            value={firstValue}
            setValue={setFirstValue}
            leftLabel="Not at all"
            rightLabel="Totally"
            onChange={() => {
              setFirstMoved(true);
            }}
            isFocused={selectedElementIndex === 0 && elementFocused}
          />
        </Box>

        {/* Second question */}
        <Paragraph margin="small" size="large" fill>
          Please use the slider below to indicate the extent to which you
          believe your partner's decisions are driven by their desire to reduce
          your bonus in this task.
        </Paragraph>
        <Box
          border={
            { color: Configuration.manipulations.useAlternateInput === true && selectedElementIndex === 1 &&
              !elementFocused ? "selectedElement" : "transparent", size: "large" }
          }
          pad={"xsmall"}
          round
        >
          <Slider
            min={0}
            max={100}
            value={secondValue}
            setValue={setSecondValue}
            leftLabel="Not at all"
            rightLabel="Totally"
            onChange={() => {
              setSecondMoved(true);
            }}
            isFocused={selectedElementIndex === 1 && elementFocused}
          />
        </Box>

        {/* Continue button */}
        <Box
          margin={"none"}
          pad={"none"}
          border={
            {
              color: Configuration.manipulations.useAlternateInput === true &&
            selectedElementIndex === 2 ? "selectedElement" : "transparent",
              size: "large",
            }
          }
          style={
            Configuration.manipulations.useAlternateInput === true &&
            selectedElementIndex === 2
              ? { borderRadius: "36px " }
              : {}
          }
          round
        >
          <Button
            primary
            color="button"
            label="Continue"
            disabled={
              // Disabled until both sliders have been interacted with
              firstMoved === false || secondMoved === false
            }
            icon={<LinkNext />}
            reverse
            onClick={() => {
              props.handler(firstValue, secondValue);
            }}
          />
        </Box>
      </Box>
    </Keyboard>
  );
};

export default Inference;
