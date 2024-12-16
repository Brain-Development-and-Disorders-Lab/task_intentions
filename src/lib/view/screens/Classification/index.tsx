/**
 * @file 'Classification' screen presenting a dropdown menu to the participant.
 * The participant is required to select one of three options from the dropdown
 * before the continue button is enabled. The participant is selecting the
 * option that best matches their opinion of their participant from the
 * previous phase.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement } from "react";

// Grommet UI components
import { Box, Button, Select, Paragraph } from "grommet";
import { LinkNext } from "grommet-icons";

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
  const [classification, setClassification] = React.useState("");
  const [continueDisabled, setContinueDisabled] = React.useState(true);

  const partners = [
    "To earn as much money for themselves as possible",
    "To stop me from earning money",
    "To share the money between us evenly",
  ];

  return (
    <Box
      justify="center"
      align="center"
      gap="small"
      animation={["fadeIn"]}
      flex
      direction="column"
    >
      {/* First question */}
      <Paragraph margin="small" size="large" fill>
        Overall, what do you think your partner was trying to do?
      </Paragraph>

      {/* Partner select component */}
      <Box width="large">
        <Select
          a11yTitle="Select"
          options={partners}
          placeholder="Please select"
          onChange={({ option }) => {
            // Enable the continue button
            setContinueDisabled(false);

            // Update the selected classification
            setClassification(option);
          }}
          margin={{ top: "large" }}
          size="large"
        />
      </Box>

      {/* Continue button */}
      <Button
        a11yTitle="Continue"
        primary
        margin={{ top: "large" }}
        color="button"
        label="Continue"
        disabled={
          // Disabled until a partner type has been chosen
          continueDisabled
        }
        size="large"
        icon={<LinkNext />}
        reverse
        onClick={() => {
          props.handler(classification);
        }}
      />
    </Box>
  );
};

export default Classification;
