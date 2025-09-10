/**
 * @file `StatusPreview` screen to show participants their partner's social standing.
 *
 * This screen displays the partner's social standing to participants
 * at the start of a game phase. Key features include:
 * - Partner social standing presentation
 * - Partner avatar presentation
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement } from "react";

// Grommet UI components
import { Box, Button, Layer, Paragraph } from "grommet";
import { LinkNext } from "grommet-icons";
import Status from "src/view/components/Status";
import Avatar from "boring-neutral-avatars";

// Configuration
import { Configuration } from "src/configuration";

/**
 * @summary Generate a 'StatusPreview' screen containing a card with the partner avatar for the subsequent phase of the game
 * @param {FC} props Props object containing:
 *  - isPartnerHighStatus: {boolean} Whether the partner is in high status
 *  - handler: {function} Function to handle the continue button click
 * @return {ReactElement} 'StatusPreview' screen with partner avatar and success message
 */
const Loaded: FC<Props.Screens.StatusPreview> = (props: Props.Screens.StatusPreview): ReactElement => {
  // Get the current partner avatar and social standing
  const experiment = window.Experiment;
  const partnerStatus = props.isPartnerHighStatus ? experiment.getState().get("partnerHighStatus") : experiment.getState().get("partnerLowStatus");

  // Get the updated partner avatar
  const partnerAvatar = Configuration.avatars.names.partner[
    experiment.getState().get("partnerAvatar")
  ]

  return (
    <Layer plain full>
      <Box justify="center" align="center" gap="small" responsive fill>
        <Paragraph margin="small" size="large" fill>
          In this phase you will be able to see your partner&apos;s social standing.
        </Paragraph>
        <Avatar
          size={100}
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
  );
};

export default Loaded;
