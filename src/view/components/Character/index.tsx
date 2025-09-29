/**
 * @file `Character` component for interactive avatar selection.
 *
 * This component implements a clickable avatar interface used during
 * participant character selection. Key features include:
 * - Interactive avatar display with click handling
 * - Dynamic size transitions through CSS classes
 * - Integration with the experiment's avatar system
 * - Visual feedback for selection state
 *
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
 * `Character` component for avatar selection interface.
 *
 * Renders a clickable avatar that can be selected/deselected by the participant.
 * The component uses CSS classes to provide visual feedback for the selection state.
 *
 * @param {Components.Character} props - Component properties
 * @param {string} props.name - Unique identifier for the avatar
 * @param {number} props.size - Size in pixels for the avatar
 * @param {string | null} props.state - Currently selected avatar name
 * @param {(name: string) => void} props.setState - Function to update selected avatar
 * @returns {ReactElement} Clickable avatar component with selection state handling
 */
const Character: FC<Components.Character> = (
  props: Components.Character
): ReactElement => {
  return (
    <Box
      id={`avatar-${props.name}`}
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
