/**
 * @file `Card` component for displaying participant and partner information.
 *
 * This component provides a standardized way to present player information
 * throughout the experiment. Key features include:
 * - Player/partner avatar display
 * - Name and identifier presentation
 * - Points tracking and display
 * - Consistent styling across different game phases
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement } from "react";

// Grommet UI components
import { Box, Heading } from "grommet";

// Other imports
import TextTransition, { presets } from "react-text-transition";
import Avatar from "boring-neutral-avatars";

// Configuration
import { Configuration } from "src/configuration";
import { Money } from "grommet-icons";

/**
 * @summary Generate a 'Card' component that displays player information including name, avatar and points
 * @param {Props.Components.Card} props component props containing:
 *  - name: {string} Display name for the player
 *  - avatar: {string} Unique identifier for the avatar
 *  - points: {string} Current points total
 *  - gridArea: {string} Grid area name for positioning
 * @return {ReactElement} 'Card' component with player info arranged vertically in a Box
 */
const Card: FC<Props.Components.Card> = (
  props: Props.Components.Card
): ReactElement => {
  return (
    <Box
      gridArea={props.gridArea}
      background="avatarBackground"
      round
      direction="column"
      id="playerInfo"
      margin={{ left: "small", right: "small" }}
      align="center"
    >
      <Heading level={1}>{props.name}</Heading>

      <Box animation={["pulse"]}>
        <Avatar
          size={128}
          name={props.avatar}
          variant={Configuration.avatars.variant as AvatarStyles}
          colors={Configuration.avatars.colours}
        />
      </Box>

      <Heading level={1}>
        <Box direction="row" gap="xsmall">
          <Money size="large" color="pointsIconBackground" />
          <TextTransition
            text={props.points}
            springConfig={presets.gentle}
            inline
          />
        </Box>
      </Heading>
    </Box>
  );
};

export default Card;
