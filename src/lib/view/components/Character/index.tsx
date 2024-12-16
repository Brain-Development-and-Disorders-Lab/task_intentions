/**
 * @file 'Character' component implementing a clickable avatar. When clicked,
 * the avatar will change in size by toggling the presence of CSS classes.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement } from "react";

// Components
import Avatar from "boring-neutral-avatars";
import { Box } from "grommet";

// Configuration
import { Configuration } from "src/configuration";

/**
 * @summary Generate a 'Character' component implementing a clickable avatar
 * @param {Props.Components.Character} props component props
 * @return {ReactElement} 'Character' component
 */
const Character: FC<Props.Components.Character> = (
  props: Props.Components.Character
): ReactElement => {
  return (
    <Box
      id={`avatar-${props.name}`}
      margin="medium"
      round={{ size: "50%" }}
      className={
        props.name === props.state ? "selectable selected" : "selectable"
      }
      onClick={() => {
        // Call the state update function with the name
        props.setState(props.name);
      }}
    >
      <Avatar
        size={props.size}
        name={props.name}
        variant={Configuration.avatars.variant as AvatarStyles}
        colors={Configuration.avatars.colours}
      />
    </Box>
  );
};

export default Character;
