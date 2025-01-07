/**
 * @file 'SelectAvatar' screen presenting a row of six avatars for the
 * participant to select for the game. The avatar increases in size when
 * selected, enabling the participant to proceed once they have
 * selected an avatar.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useState } from "react";

// Grommet UI components
import { Box, Button, Heading, Keyboard } from "grommet";
import { LinkNext } from "grommet-icons";

// Configuration
import { Configuration } from "src/configuration";

// Components
import Character from "src/lib/view/components/Character";

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
  const [selectedAvatarName, setSelectedAvatarName] = useState("none");
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(experiment.getState().get("participantAvatar"));

  /**
   * Handle keyboard input from user interaction
   * @param {React.KeyboardEvent<HTMLElement>} event Keyboard input event
   */
  const inputHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    // Disable keyboard input if not enabled in configuration
    if (Configuration.manipulations.useAlternateInput === false) return;

    // Avoid holding the key down
    if (event.repeat) return;
    event.preventDefault();

    let selectedIndex = experiment.getState().get("participantAvatar");
    if (event.key.toString() === BINDINGS.NEXT) {
      // Increment `selectedIndex`, reset if required
      if (selectedIndex + 1 > avatars.length - 1) {
        selectedIndex = 0;
      } else {
        selectedIndex = selectedIndex + 1;
      }
      // Apply the value of `selectedIndex`
      experiment.getState().set("participantAvatar", selectedIndex);
      setSelectedAvatarIndex(experiment.getState().get("participantAvatar"));
    } else if (event.key.toString() === BINDINGS.PREVIOUS) {
      // Decrement `selectedIndex`, reset if required
      if (selectedIndex - 1 < 0) {
        selectedIndex = avatars.length - 1;
      } else {
        selectedIndex = selectedIndex - 1;
      }
      // Apply the value of `selectedIndex`
      experiment.getState().set("participantAvatar", selectedIndex);
      setSelectedAvatarIndex(experiment.getState().get("participantAvatar"));
    } else if (event.key.toString() === BINDINGS.SELECT) {
      // Complete the avatar selection by passing the handler the avatar name
      props.handler(selectedIndex);
    }
  };

  return (
    <Keyboard onKeyDown={inputHandler} target={"document"}>
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
        gap="medium"
      >
        {avatars.map((avatar, i) => {
          return (
            <Box
              border={Configuration.manipulations.useAlternateInput === true && selectedAvatarIndex === i && { color: "selectedElement", size: "large" }}
              round={{ size: "50%" }}
              key={`container-${avatar}`}
            >
              <Character
                key={avatar}
                name={avatar}
                size={128} // Size is fixed at 128
                state={selectedAvatarName}
                setState={setSelectedAvatarName}
              />
            </Box>
          );
        })}
      </Box>

      {/* Continue button */}
      {Configuration.manipulations.useAlternateInput !== true &&
        <Button
          id="select-avatar-button"
          primary
          color="button"
          label="Continue"
          disabled={selectedAvatarName === "none"}
          size="large"
          margin="medium"
          icon={<LinkNext />}
          reverse
          onClick={() => {
            props.handler(selectedAvatarIndex);
          }}
        />
      }
    </Keyboard>
  );
};

export default SelectAvatar;
