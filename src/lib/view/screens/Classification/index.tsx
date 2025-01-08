/**
 * @file 'Classification' screen presenting a dropdown menu to the participant.
 * The participant is required to select one of three options from the dropdown
 * before the continue button is enabled. The participant is selecting the
 * option that best matches their opinion of their participant from the
 * previous phase.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useState } from "react";

// Grommet UI components
import { Box, Button, Paragraph, RadioButtonGroup, Keyboard } from "grommet";
import { LinkNext } from "grommet-icons";

// Experiment configuration
import { Configuration } from "src/configuration";

// Keyboard input bindings
import { BINDINGS } from "src/lib/bindings";

/**
 * @summary Generate a 'Classification' screen containing a dropdown
 * menu with three options, one for each partner type.
 * @param {Props.Screens.Classification} props component props
 * @return {ReactElement} 'Classification' screen
 */
const Classification: FC<Props.Screens.Classification> = (
  props: Props.Screens.Classification
): ReactElement => {
  // Configure relevant states
  const [classification, setClassification] = useState("");
  const [continueDisabled, setContinueDisabled] = useState(true);

  // Selected UI element (used for alternate input)
  const [selectedElementIndex, setSelectedElementIndex] = useState(0);
  const [elementFocused, setElementFocused] = useState(false);

  // Classification selected index
  const [classificationIndex, setClassificationIndex] = useState(0);

  const partners = [
    "To earn as much money for themselves as possible",
    "To stop me from earning money",
    "To share the money between us evenly",
  ];

  /**
   * Handle keyboard input from user interaction
   * @param {React.KeyboardEvent<HTMLElement>} event Keyboard input event
   */
  const inputHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    // Disable keyboard input if not enabled in configuration
    if (Configuration.manipulations.useAlternateInput === false) return;

    // Avoid holding the key down if no element focused
    if (event.repeat) return;
    event.preventDefault();

    if (
      event.key.toString() === BINDINGS.NEXT ||
      event.key.toString() === BINDINGS.PREVIOUS
    ) {
      if (elementFocused === true) {
        if (selectedElementIndex === 0) {
          let updatedIndex = classificationIndex;
          // Radio button group
          if (classification === "") {
            updatedIndex = 0;
          } else if (event.key.toString() === BINDINGS.PREVIOUS) {
            updatedIndex =
              classificationIndex - 1 < 0 ? 0 : classificationIndex - 1;
          } else if (event.key.toString() === BINDINGS.NEXT) {
            updatedIndex =
              classificationIndex + 1 > partners.length - 1
                ? classificationIndex
                : classificationIndex + 1;
          }

          // Enable the continue button
          setContinueDisabled(false);

          // Update state
          setClassification(partners[updatedIndex]);
          setClassificationIndex(updatedIndex);
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
        if (!continueDisabled) {
          props.handler(classification);
        }
      }
    }
  };

  return (
    <Keyboard onKeyDown={inputHandler} target={"document"}>
      <Box
        flex
        height={{ max: "40vh" }}
        justify={"between"}
        align={"center"}
        gap={"small"}
        animation={["fadeIn"]}
        direction={"column"}
      >
        {/* First question */}
        <Box margin={"xsmall"}>
          <Paragraph margin={"small"} size={"large"} fill>
            Overall, what do you think your partner was trying to do?
          </Paragraph>
        </Box>

        {/* Partner select component */}
        <Box
          margin={"xsmall"}
          border={{
            color:
              Configuration.manipulations.useAlternateInput === true &&
              selectedElementIndex === 0 &&
              !elementFocused
                ? "selectedElement"
                : "transparent",
            size: "large",
          }}
          pad={selectedElementIndex === 0 ? "small" : "medium"}
          round
        >
          <RadioButtonGroup
            name="partner-classification"
            options={partners}
            value={classification}
            onChange={(event) => {
              // Enable the continue button
              setContinueDisabled(false);

              // Update the selected classification
              setClassification(event.target.value);
            }}
          />
        </Box>

        {/* Continue button */}
        <Box
          margin={"xsmall"}
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
            a11yTitle="Continue"
            primary
            color="button"
            label="Continue"
            disabled={
              // Disabled until a partner type has been chosen
              continueDisabled
            }
            icon={<LinkNext />}
            reverse
            onClick={() => {
              props.handler(classification);
            }}
          />
        </Box>
      </Box>
    </Keyboard>
  );
};

export default Classification;
