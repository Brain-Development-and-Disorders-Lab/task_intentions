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
import { Box, Button, Layer, Paragraph, WorldMap } from "grommet";
import { LinkNext } from "grommet-icons";
import Status from "src/view/components/Status";
import Avatar from "boring-neutral-avatars";

// Configuration
import { Configuration } from "src/configuration";

/**
 * @summary Generate a 'Loaded' screen containing a card with the partner avatar for the subsequent phase of the game
 * @param {FC} props Empty props object as this component takes no props
 * @return {ReactElement} 'Loaded' screen with partner avatar and success message
 */
const Loaded: FC<Props.Screens.StatusPreview> = (props: Props.Screens.StatusPreview): ReactElement => {
  // Get the current partner avatar
  const experiment = window.Experiment;
  const partnerStatus = props.isPartnerHighStatus ? experiment.getState().get("partnerHighStatus") : experiment.getState().get("partnerLowStatus");

  // Get the updated partner avatar
  const partnerAvatar = Configuration.avatars.names.partner[
    experiment.getState().get("partnerAvatar")
  ]

  return (
    <>
      <WorldMap color="map" fill="horizontal" />
      <Layer plain full>
        <Box justify="center" align="center" gap="small" responsive fill>
          <Paragraph margin="small" size="large" fill>
            In this phase you will be able to see your partner&apos;s social standing.
          </Paragraph>
          <Avatar
            size={120}
            name={partnerAvatar}
            variant={Configuration.avatars.variant as "beam"}
            colors={Configuration.avatars.colours}
          />
          <Status
            participantStatus={experiment.getState().get("participantDefaultStatus")}
            partnerStatus={partnerStatus}
          />
          <Paragraph margin="small" size="large" fill>
            Their ID has been hidden to preserve anonymity.
          </Paragraph>
          <Button
            a11yTitle="Continue"
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
};

export default Loaded;
