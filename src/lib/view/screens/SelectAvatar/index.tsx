/**
 * @file 'SelectAvatar' screen presenting a row of six avatars for the
 * participant to select for the game. The avatar increases in size when
 * selected, enabling the participant to proceed once they have
 * selected an avatar.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useEffect, useState } from "react";

// Grommet UI components
import { Box, Button, Heading } from "grommet";
import { LinkNext } from "grommet-icons";

// Configuration
import { Configuration } from "src/configuration";

// Components
import Character from "src/lib/view/components/Character";

// Logging
import consola from "consola";

// Input bindings
import { BINDINGS } from "src/lib/bindings";

/**
 * @summary Generate a 'SelectAvatar' screen presenting a row of six avatars
 * for the participant to select above a continue button
 * @param {Props.Screens.SelectAvatar} props collection of props
 * @return {ReactElement} 'SelectAvatar' screen
 */
const SelectAvatar: FC<Props.Screens.SelectAvatar> = (
  props: Props.Screens.SelectAvatar
): ReactElement => {
  // Get the global 'Experiment' instance
  const experiment = window.Experiment;

  // Get the list of all avatars
  const avatars = Configuration.avatars.names.participant;

  // Configure relevant states
  const [selectedAvatar, setAvatar] = useState("none");
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(experiment.getState().get("participantAvatar"));

  useEffect(() => {
    const inputHandler = (event: KeyboardEvent) => {
      const selectedIndex = experiment.getState().get("participantAvatar");
      let updatedIndex = selectedIndex;
      if (event.key.toString() === BINDINGS.OPTION_TWO) {
        if (selectedIndex + 1 > avatars.length - 1) {
          updatedIndex = 0;
        } else {
          updatedIndex = updatedIndex + 1;
        }
      } else if (event.key.toString() === BINDINGS.OPTION_ONE) {
        if (selectedIndex - 1 < 0) {
          updatedIndex = avatars.length - 1;
        } else {
          updatedIndex = updatedIndex - 1;
        }
      }
      experiment.getState().set("participantAvatar", updatedIndex);
      setSelectedAvatarIndex(experiment.getState().get("participantAvatar"))
    };

    document.addEventListener("keyup", inputHandler, false);

    return () => {
      // Remove the keyboard handler
      document.removeEventListener("keyup", inputHandler, false);
    };
  }, []);

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
        {avatars.map((avatar, i) => {
          return (
            <Box
              border={selectedAvatarIndex === i && { color: "red", size: "large" }}
              round
            >
              <Character
                key={avatar}
                name={avatar}
                size={128} // Size is fixed at 128
                state={selectedAvatar}
                setState={setAvatar}
              />
            </Box>
          );
        })}
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
