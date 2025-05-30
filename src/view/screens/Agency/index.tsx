/**
 * @file `Agency` screen for collecting agency ratings.
 *
 * This screen presents participants with agency-related questions and
 * a continuous response slider. Key features include:
 * - Agency question presentation
 * - Interactive slider for response input
 * - Response validation before proceeding
 * - Integration with experiment data collection
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useState } from "react";

// Grommet UI components
import { Box, Button, Keyboard, Paragraph } from "grommet";
import { LinkNext } from "grommet-icons";

// Custom components
import Slider from "src/view/components/Slider";

// Experiment configuration
import { Configuration } from "src/configuration";

// Keyboard input bindings
import { BINDINGS } from "src/bindings";

// Constants
const SLIDER_DEFAULT = 50; // Sets the 'thumb' to the middle of the slider

/**
 * @summary Generate an 'Agency' screen component containing a slider and question that requires participant response
 * @param {Props.Screens.Agency} props Component props containing:
 *  - question: {string} The question text to display
 *  - leftLabel: {string} Label for the left side of the slider
 *  - rightLabel: {string} Label for the right side of the slider
 *  - onContinue: {() => void} Callback function when participant continues
 * @return {ReactElement} 'Agency' screen with interactive slider and question
 */
const Agency: FC<Props.Screens.Agency> = (
  props: Props.Screens.Agency
): ReactElement => {
  // Slider states, monitor if they have been interacted with
  // Top slider
  const [sliderMoved, setSliderMoved] = useState(false);
  const [sliderValue, setSliderValue] = useState(SLIDER_DEFAULT);

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
            setSliderValue(sliderValue + 1 <= 100 ? sliderValue + 1 : 100);
          } else if (event.key.toString() === BINDINGS.PREVIOUS) {
            setSliderValue(sliderValue - 1 >= 0 ? sliderValue - 1 : 0);
          }
          setSliderMoved(true);
        }
      } else {
        if (event.key.toString() === BINDINGS.NEXT) {
          setSelectedElementIndex(
            selectedElementIndex + 1 < 2 ? selectedElementIndex + 1 : 1
          );
        } else if (event.key.toString() === BINDINGS.PREVIOUS) {
          setSelectedElementIndex(
            selectedElementIndex - 1 >= 0 ? selectedElementIndex - 1 : 0
          );
        }
      }
    } else if (event.key.toString() === BINDINGS.SELECT) {
      if (selectedElementIndex !== 1) {
        // Focus or unfocus sliders
        setElementFocused(!elementFocused);
      } else {
        // Select the `Continue` button if permitted
        if (sliderMoved === true) {
          props.handler(sliderValue);
        }
      }
    }
  };

  return (
    <Keyboard onKeyDown={inputHandler} target={"document"}>
      <Box
        justify={"center"}
        align={"center"}
        gap={"small"}
        style={{ maxWidth: "50%", margin: "auto" }}
        animation={["fadeIn"]}
      >
        <Paragraph margin="small" size="large" fill>
          Some labs use deception. For our own purposes, it is helpful to know
          to what extent you believed that the other partners really existed.
        </Paragraph>
        <Paragraph margin="small" size="large" fill>
          I believe I played with real partners.
        </Paragraph>
        <Box
          pad={"xsmall"}
          border={{
            color:
              Configuration.manipulations.useAlternateInput === true &&
              selectedElementIndex === 0 &&
              !elementFocused
                ? "selectedElement"
                : "transparent",
            size: "large",
          }}
          round
        >
          <Slider
            min={0}
            max={100}
            value={sliderValue}
            setValue={setSliderValue}
            leftLabel="Disagree"
            rightLabel="Agree"
            onChange={() => {
              setSliderMoved(true);
            }}
            isFocused={false}
          />
        </Box>

        <Box
          margin={"none"}
          pad={"none"}
          border={{
            color:
              Configuration.manipulations.useAlternateInput === true &&
              selectedElementIndex === 1
                ? "selectedElement"
                : "transparent",
            size: "large",
          }}
          style={
            Configuration.manipulations.useAlternateInput === true &&
            selectedElementIndex === 1
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
              // Disabled until slider has been interacted with
              sliderMoved === false
            }
            icon={<LinkNext />}
            reverse
            onClick={() => {
              props.handler(sliderValue);
            }}
          />
        </Box>
      </Box>
    </Keyboard>
  );
};

export default Agency;
