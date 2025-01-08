/**
 * @file 'Slider' component displaying a horizontal slider with a thumb.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useEffect, useState } from "react";

// Grommet UI components
import { Box, Heading, RangeInput } from "grommet";

/**
 * @summary Generate a 'Slider' component
 * @param {Props.Components.Slider} props component props
 * @return {ReactElement} 'Slider' component
 */
const Slider: FC<Props.Components.Slider> = (
  props: Props.Components.Slider
): ReactElement => {
  // Value presented by the slide
  const [value, setValue] = useState(props.max / 2);

  // `useEffect` to update state if changes made outside component
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <Box
      align={"center"}
      direction={"row"}
      justify={"between"}
      gap={"medium"}
      width={"xlarge"}
    >
      <Heading level={3} size={"small"}>
        {props.leftLabel}
      </Heading>
      <Box
        width={"100%"}
        margin={"none"}
        pad={props.isFocused ? "xsmall" : "none"}
        border={props.isFocused && { color: "selectedElement", size: "large" }}
        round
      >
        <RangeInput
          aria-label={"Slider"}
          value={value}
          min={props.min}
          max={props.max}
          onChange={(event: any) => {
            const updatedValue = parseInt(event.target.value);
            // Call the given onChange function if provided
            if (typeof props.onChange !== "undefined") {
              props.onChange();
            }

            // Call the given setValue function if provided
            if (typeof props.setValue !== "undefined") {
              props.setValue(updatedValue);
            }

            // Update the value of the slider
            setValue(updatedValue);
          }}
        />
      </Box>
      <Heading level={3} size={"small"}>
        {props.rightLabel}
      </Heading>
    </Box>
  );
};

export default Slider;
