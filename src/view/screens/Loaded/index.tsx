/**
 * @file `Loaded` screen to confirm completion of loading process.
 *
 * This screen displays the newly assigned partner avatar to participants
 * at the start of each game phase. Key features include:
 * - Partner avatar presentation
 * - Unique partner assignment per phase
 * - State management for partner tracking
 * - Consistent partner identity across sessions
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement } from "react";

// Grommet UI components
import { Box, Button, Heading, Layer, Paragraph, WorldMap } from "grommet";
import { LinkNext } from "grommet-icons";
import Status from "src/view/components/Status";
import Avatar from "boring-neutral-avatars";

// Logging library
import consola from "consola";

// Configuration
import { Configuration } from "src/configuration";

// Utility functions
import { generatePartnerID } from "src/util";

/**
 * @summary Generate a 'Loaded' screen containing a card with the partner avatar for the subsequent phase of the game
 * @param {Screens.Loaded} props Component props
 * @return {ReactElement} 'Loaded' screen with partner avatar and success message
 */
const Loaded: FC<Screens.Loaded> = (props: Screens.Loaded): ReactElement => {
  // Get the current partner avatar
  const experiment = window.Experiment;
  const currentPartner = experiment.getState().get("partnerAvatar");
  const state = props.state;

  if (state === "matchingIntentions") {
    // Increment the partner avatar value
    if (experiment.getState().get("refreshPartner") === true) {
      // Ensure we keep the index in range
      if (currentPartner + 1 === Configuration.avatars.names.partner.length) {
        // Reset partner to first avatar, ideally we don't want to be here
        consola.warn("Original partner used");
        experiment.getState().set("partnerAvatar", 0);
      } else {
        // We can safely go ahead and increment the index
        experiment.getState().set("partnerAvatar", currentPartner + 1);
      }
    }

    // Get the updated partner avatar
    const partnerAvatar = experiment.getState().get("partnerAvatar");

    return (
      <>
        <WorldMap color="map" fill="horizontal" />
        <Layer plain full>
          <Box justify="center" align="center" gap="small" responsive fill>
            <Heading>Partner found!</Heading>
            <Avatar
              size={240}
              name={Configuration.avatars.names.partner[partnerAvatar]}
              variant={Configuration.avatars.variant as "beam"}
              colors={Configuration.avatars.colours}
            />
          </Box>
        </Layer>
      </>
    );
  } else if (state === "matchingCyberball") {
      const partnerAID = generatePartnerID();
      const partnerBID = generatePartnerID();
      experiment.getState().set("cyberballPartnerAID", partnerAID);
      experiment.getState().set("cyberballPartnerBID", partnerBID);

      return (
        <>
          <WorldMap color="map" fill="horizontal" />
          <Layer plain full>
            <Box justify="center" align="center" gap="small" responsive fill>
              <Heading>Partners found!</Heading>
              <Box direction="row" gap="medium">
                <Avatar
                  size={180}
                  name={partnerAID}
                  variant={Configuration.avatars.variant as "beam"}
                  colors={Configuration.avatars.colours}
                />
                <Avatar
                  size={180}
                  name={partnerBID}
                  variant={Configuration.avatars.variant as "beam"}
                  colors={Configuration.avatars.colours}
                />
              </Box>
            </Box>
          </Layer>
        </>
      );
  } else if (state === "social") {
    return (
      <>
        <Layer plain full>
          <Box justify="center" align="center" gap="small" responsive fill>
            <Status
              participantStatus={experiment.getState().get("participantDefaultStatus")}
              partnerStatus={0}
              hidePartner
            />
            <Box style={{ maxWidth: "50%" }}>
              <Paragraph margin="small" size="large" textAlign="center" fill>
                This is where you rank in comparison to other players, from low standing to high standing.
              </Paragraph>
            </Box>
            <Button
              primary
              color="button"
              label="Continue"
              icon={<LinkNext />}
              reverse
              onClick={() => {
                props.handler();
              }}
            />
          </Box>
        </Layer>
      </>
    );
  } else {
    return (
      <>
        <WorldMap color="map" fill="horizontal" />
        <Layer plain full>
          <Box justify="center" align="center" gap="small" responsive fill>
            <Heading>Loading completed.</Heading>
          </Box>
        </Layer>
      </>
    );
  }
};

export default Loaded;
