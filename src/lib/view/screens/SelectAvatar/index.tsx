/**
 * @file 'SelectAvatar' screen presenting a row of six avatars for the
 * participant to select for the game. The avatar increases in size when
 * selected, enabling the participant to proceed once they have
 * selected an avatar.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement } from "react";

// Grommet UI components
import { Box, Button, Heading } from "grommet";
import { LinkNext } from "grommet-icons";

// Configuration
import { Configuration } from "src/configuration";

// Components
import Character from "src/lib/view/components/Character";

/**
 * @summary Generate a 'SelectAvatar' screen presenting a row of six avatars
 * for the participant to select above a continue button
 * @param {Props.Screens.SelectAvatar} props collection of props
 * @return {ReactElement} 'SelectAvatar' screen
 */
const SelectAvatar: FC<Props.Screens.SelectAvatar> = (
  props: Props.Screens.SelectAvatar
): ReactElement => {
  // Configure relevant states
  const [selectedAvatar, setAvatar] = React.useState("none");

  const avatars = Configuration.avatars.names.participant;
  const avatarComponents = [];

  // Collate the avatars into an array of 'Character' components
  for (const avatarName of avatars) {
    avatarComponents.push(
      <Character
        key={avatarName}
        name={avatarName}
        size={128} // Size is fixed at 128
        state={selectedAvatar}
        setState={setAvatar}
      />
    );
  }

  return (
    <>
      {/* Heading component */}
      <Heading margin="medium" fill>
        Choose your Avatar!
      </Heading>

      {/* Avatar components */}
      <Box
        direction="row"
        align="center"
        justify="center"
        height="small"
        margin="medium"
      >
        {avatarComponents}
      </Box>

      {/* Continue button */}
      <Button
        id="select-avatar-button"
        primary
        color="button"
        label="Continue"
        disabled={selectedAvatar === "none"}
        size="large"
        margin="medium"
        icon={<LinkNext />}
        reverse
        onClick={() => {
          props.handler(selectedAvatar);
        }}
      />
    </>
  );
};

export default SelectAvatar;
