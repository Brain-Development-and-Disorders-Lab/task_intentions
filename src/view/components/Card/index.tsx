/**
 * @file 'Card' component used to arrange information about the participant
 * and the partner throughout the game. Contains the name, avatar, and total
 * points obtained by the participant or partner.
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
 * @summary Generate a 'Card' component
 * @param {Props.Components.Card} props component props
 * @return {ReactElement} 'Card' component
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
