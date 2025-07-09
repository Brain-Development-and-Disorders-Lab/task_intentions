/**
 * @file `Status` component for displaying the participant's social status.
 *
 * This component includes a bar with two icons that represent the position
 * of the participant's social status and their partner's social status.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useState } from "react";

// Grommet UI components
import { Box, Text } from "grommet";

// Avatar component
import Avatar from "boring-neutral-avatars";

// Configuration
import { Configuration } from "src/configuration";

/**
 * @summary Generate a 'Status' component that displays social status positions
 * @param {Props.Components.Status} props component props containing:
 *  - participantStatus: {number} Social status value for participant (0-100)
 *  - partnerStatus: {number} Social status value for partner (0-100)
 * @return {ReactElement} 'Status' component with horizontal scale and avatar indicators
 */
const Status: FC<Props.Components.Status> = (
  props: Props.Components.Status
): ReactElement => {
  const [participantStatus,] = useState(props.participantStatus);
  const [partnerStatus,] = useState(props.partnerStatus);

  // Get the global experiment instance to access avatar names
  const experiment = window.Experiment;
  const participantAvatarName = Configuration.avatars.names.participant[
    experiment.getState().get("participantAvatar")
  ];
  const partnerAvatarName = Configuration.avatars.names.partner[
    experiment.getState().get("partnerAvatar")
  ];

  // Calculate positions as percentages (0-100)
  const participantPosition = `${participantStatus}%`;
  const partnerPosition = `${partnerStatus}%`;

  return (
    <Box
      align="center"
      direction="column"
      gap="xsmall"
      width="medium"
      margin="small"
    >
      {/* Avatars and arrows above the bar */}
      <Box
        width="100%"
        height="48px"
        style={{ position: "relative" }}
        margin={{ bottom: "xsmall" }}
      >
        {/* Participant avatar and arrow */}
        <Box
          align="center"
          style={{
            position: "absolute",
            left: participantPosition,
            top: 0,
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          <Avatar
            size={40}
            name={participantAvatarName}
            variant={Configuration.avatars.variant as AvatarStyles}
            colors={Configuration.avatars.colours}
          />
          {/* Downward arrow */}
          <Box
            as="svg"
            width="12px"
            height="10px"
            style={{ display: "block" }}
            margin={{ top: "xxsmall" }}
          >
            <polygon points="6,10 0,0 12,0" fill="#89C2D9" />
          </Box>
        </Box>

        {/* Partner avatar and arrow */}
        <Box
          align="center"
          style={{
            position: "absolute",
            left: partnerPosition,
            top: 0,
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          <Avatar
            size={40}
            name={partnerAvatarName}
            variant={Configuration.avatars.variant as AvatarStyles}
            colors={Configuration.avatars.colours}
          />
          {/* Downward arrow */}
          <Box
            as="svg"
            width="12px"
            height="10px"
            style={{ display: "block" }}
            margin={{ top: "xxsmall" }}
          >
            <polygon points="6,10 0,0 12,0" fill="#89C2D9" />
          </Box>
        </Box>
      </Box>

      {/* Solid color bar with rounded corners */}
      <Box
        width="100%"
        height="4px"
        background="#2A6F97"
        round="small"
        style={{ position: "relative" }}
      />

      {/* Scale labels */}
      <Box direction="row" justify="between" width="100%">
        <Text size="xsmall" textAlign="center" weight="bold">
          Low
        </Text>
        <Text size="xsmall" textAlign="center" weight="bold">
          High
        </Text>
      </Box>
    </Box>
  );
};

export default Status;
