/**
 * @file `Status` screen for collecting social status information.
 *
 * This screen collects participants' social status information using
 * numeric inputs and Likert scales. Key features include:
 * - Two-page questionnaire design
 * - Numeric input fields for social metrics
 * - Radio button Likert scales for frequency questions
 * - Response validation before proceeding
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useState } from "react";

// Grommet UI components
import { Box, Button, Paragraph, TextInput, RadioButtonGroup, Heading } from "grommet";
import { LinkNext } from "grommet-icons";



/**
 * @summary Generate a 'Status' screen component with two pages for collecting social status information
 * @param {Props.Screens.Status} props Component props containing:
 *  - handler: {(closeFriends: number, partyInvitations: number, meanPeople: number, socialMediaFollowers: number, socialMediaFollowing: number) => void} Callback function when participant continues
 * @return {ReactElement} 'Status' screen with two pages of questions
 */
const Status: FC<Props.Screens.Status> = (
  props: Props.Screens.Status
): ReactElement => {
  // Page state
  const [currentPage, setCurrentPage] = useState(1);

  // Page 1 data
  const [closeFriends, setCloseFriends] = useState("");
  const [partyInvitations, setPartyInvitations] = useState(-1);
  const [meanPeople, setMeanPeople] = useState(-1);

  // Page 2 data
  const [socialMediaFollowers, setSocialMediaFollowers] = useState("");
  const [socialMediaFollowing, setSocialMediaFollowing] = useState("");

  // Render page 1
  if (currentPage === 1) {
    return (
      <Box
        justify={"center"}
        align={"center"}
        gap={"small"}
        style={{ maxWidth: "70%", margin: "auto" }}
        animation={["fadeIn"]}
      >
        <Heading level={3} margin="small" fill>
          Please answer the following questions:
        </Heading>

        <Paragraph margin="small" size="large" fill>
          How many close friends do you have?
        </Paragraph>
        <Box
          pad={"xsmall"}
          border={{ color: "transparent", size: "large" }}
          round
        >
          <TextInput
            type="number"
            value={closeFriends}
            onChange={event => setCloseFriends(event.target.value)}
            placeholder="Enter number"
            style={{ textAlign: "center" }}
          />
        </Box>

        <Paragraph margin="small" size="large" fill>
          How often do you get invited to parties?
        </Paragraph>
        <Box
          pad={"xsmall"}
          border={{ color: "transparent", size: "large" }}
          round
        >
          <Box direction="column" align="center" gap="small" width="100%">
            <Box direction="column" align="center" gap="xsmall" width="100%">
              <Box justify="center" align="center" width="100%">
                <Box direction="column" align="center" gap="xsmall">
                  {/* Scale labels */}
                  <Box direction="row" justify="between" width="100%" style={{ minWidth: "500px" }}>
                    <Paragraph size="small" margin="none">Never</Paragraph>
                    <Paragraph size="small" margin="none">All the Time</Paragraph>
                  </Box>

                  {/* Scale */}
                                     <RadioButtonGroup
                     name="party-invitations"
                     direction="row"
                     gap="medium"
                     options={[
                       { label: "0", value: 0 },
                       { label: "1", value: 1 },
                       { label: "2", value: 2 },
                       { label: "3", value: 3 },
                       { label: "4", value: 4 },
                       { label: "5", value: 5 },
                       { label: "6", value: 6 },
                       { label: "7", value: 7 }
                     ]}
                     value={partyInvitations === -1 ? undefined : partyInvitations}
                     onChange={event => setPartyInvitations(Number(event.target.value))}
                   />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Paragraph margin="small" size="large" fill>
          How often are people mean to you at school or work?
        </Paragraph>
        <Box
          pad={"xsmall"}
          border={{ color: "transparent", size: "large" }}
          round
        >
          <Box direction="column" align="center" gap="small" width="100%">
            <Box direction="column" align="center" gap="xsmall" width="100%">
              <Box justify="center" align="center" width="100%">
                <Box direction="column" align="center" gap="xsmall">
                  {/* Scale labels */}
                  <Box direction="row" justify="between" width="100%" style={{ minWidth: "500px" }}>
                    <Paragraph size="small" margin="none">Never</Paragraph>
                    <Paragraph size="small" margin="none">All the Time</Paragraph>
                  </Box>

                  {/* Scale */}
                                     <RadioButtonGroup
                     name="mean-people"
                     direction="row"
                     gap="medium"
                     options={[
                       { label: "0", value: 0 },
                       { label: "1", value: 1 },
                       { label: "2", value: 2 },
                       { label: "3", value: 3 },
                       { label: "4", value: 4 },
                       { label: "5", value: 5 },
                       { label: "6", value: 6 },
                       { label: "7", value: 7 }
                     ]}
                     value={meanPeople === -1 ? undefined : meanPeople}
                     onChange={event => setMeanPeople(Number(event.target.value))}
                   />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          margin={"none"}
          pad={"none"}
          border={{ color: "transparent", size: "large" }}
          round
        >
          <Button
            primary
            color="button"
            label="Continue"
            disabled={
              // Disabled until all inputs have values
              closeFriends.trim() === "" || partyInvitations === -1 || meanPeople === -1
            }
            icon={<LinkNext />}
            reverse
            onClick={() => {
              setCurrentPage(2);
            }}
          />
        </Box>
      </Box>
    );
  }

  // Render page 2
  return (
    <Box
      justify={"center"}
      align={"center"}
      gap={"small"}
      style={{ maxWidth: "70%", margin: "auto" }}
      animation={["fadeIn"]}
    >
      <Heading level={3} margin="small" fill>
        Please answer the following questions:
      </Heading>

      <Paragraph margin="small" size="large" fill>
        Across all social media accounts, how many followers do you have?
      </Paragraph>
      <Box
        pad={"xsmall"}
        border={{ color: "transparent", size: "large" }}
        round
      >
        <TextInput
          type="number"
          value={socialMediaFollowers}
          onChange={event => setSocialMediaFollowers(event.target.value)}
          placeholder="Enter number"
          style={{ textAlign: "center" }}
        />
      </Box>

      <Paragraph margin="small" size="large" fill>
        Across all social media accounts, how many people are following you?
      </Paragraph>
      <Box
        pad={"xsmall"}
        border={{ color: "transparent", size: "large" }}
        round
      >
        <TextInput
          type="number"
          value={socialMediaFollowing}
          onChange={event => setSocialMediaFollowing(event.target.value)}
          placeholder="Enter number"
          style={{ textAlign: "center" }}
        />
      </Box>

      <Box
        margin={"none"}
        pad={"none"}
        border={{ color: "transparent", size: "large" }}
        round
      >
        <Button
          primary
          color="button"
          label="Submit"
          disabled={
            // Disabled until both inputs have values
            socialMediaFollowers.trim() === "" || socialMediaFollowing.trim() === ""
          }
          icon={<LinkNext />}
          reverse
          onClick={() => {
            props.handler(
              parseInt(closeFriends) || 0,
              partyInvitations,
              meanPeople,
              parseInt(socialMediaFollowers) || 0,
              parseInt(socialMediaFollowing) || 0
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default Status;
