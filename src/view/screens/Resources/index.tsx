/**
 * @file `Resources` screen for mental health support information.
 *
 * This screen provides participants with mental health resources and support
 * information before completing the experiment. Key features include:
 * - UK mental health resources and organizations
 * - US mental health resources and crisis lines
 * - Navigation between resource pages
 * - Continue button to proceed to completion
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useState } from "react";

// Grommet UI components
import { Box, Heading, Button, Text } from "grommet";
import { LinkNext } from "grommet-icons";

/**
 * @summary Generate a 'Resources' screen that displays mental health resources
 * @param {Screens.Resources} props Props containing callback function to proceed to next screen
 * @return {ReactElement} Multi-page Resources screen with UK and US mental health information
 */
const Resources: FC<Screens.Resources> = (props: Screens.Resources): ReactElement => {
  const [currentPage, setCurrentPage] = useState<'uk' | 'us'>('uk');

  const UKResources = () => (
    <Box justify="center" align="center" gap="xxsmall" fill>
      <Heading level="2" textAlign="center" margin="xsmall">
        Mental Health Support - UK
      </Heading>

      <Box gap="xsmall" width="large" overflow="auto">
        <Box gap="xsmall" align="center">
          <Heading level="4" margin="xxsmall">Mind</Heading>
          <Text size="small">
            <a href="https://www.mind.org.uk/" target="_blank" rel="noopener noreferrer">
              https://www.mind.org.uk/
            </a>
          </Text>
          <Text size="small">
            Mental Health charity that promotes positive wellbeing across the UK and campaign against stigma & discrimination faced by so many people experiencing mental Health challenges.
          </Text>
        </Box>

        <Box gap="xsmall" align="center">
          <Heading level="4" margin="xxsmall">Young Minds</Heading>
          <Text size="small">
            <a href="https://youngminds.org.uk/" target="_blank" rel="noopener noreferrer">
              https://youngminds.org.uk/
            </a>
          </Text>
          <Text size="small">
            YoungMinds is the UK&apos;s leading charity championing the wellbeing and mental health of children and young people. YoungMinds creates change so that children and young people can cope with life&apos;s adversities, find help when needed, and succeed in life.
          </Text>
        </Box>

        <Box gap="xsmall" align="center">
          <Heading level="4" margin="xxsmall">Center 33</Heading>
          <Text size="small">
            <a href="http://centre33.org.uk/" target="_blank" rel="noopener noreferrer">
              http://centre33.org.uk/
            </a>
          </Text>
          <Text size="small">
            Center 33 provides free and confidential support and information for young people up to the age of 25.
          </Text>
        </Box>

        <Box gap="xsmall" align="center">
          <Heading level="4" margin="xxsmall">Samaritans</Heading>
          <Text size="small">
            <a href="https://www.samaritans.org/" target="_blank" rel="noopener noreferrer">
              https://www.samaritans.org/
            </a>
          </Text>
          <Text size="small">
            Being a Samaritan means being there for people who need someone to listen. They give people ways to cope and the skills to be there for others. They encourage, promote and celebrate those moments of connection between people that can save lives.
          </Text>
        </Box>

        <Box gap="xsmall" align="center">
          <Heading level="4" margin="xxsmall">National Suicide Prevention Helpline</Heading>
          <Text size="small">
            <a href="https://suicidepreventionlifeline.org/" target="_blank" rel="noopener noreferrer">
              https://suicidepreventionlifeline.org/
            </a>
          </Text>
          <Text size="small">
            The Lifeline provides 24/7, free and confidential support for people in distress, prevention and crisis resources for you or your loved ones, and best practices for professionals.
          </Text>
          <Text size="small">
            If you are having a mental health crisis, please call 111 and press option 2 for the First Response Service – a 24-hour service for people in mental health crisis.
          </Text>
        </Box>
      </Box>

      <Button
        primary
        reverse
        icon={<LinkNext />}
        color="button"
        label="Next"
        onClick={() => setCurrentPage('us')}
        margin="small"
      />
    </Box>
  );

  const USResources = () => (
    <Box justify="center" align="center" gap="xxsmall" fill>
      <Heading level="2" textAlign="center" margin="xsmall">
        Mental Health Support - US
      </Heading>

      <Box gap="xsmall" width="large" overflow="auto">
        <Box gap="xsmall" align="center">
          <Heading level="4" margin="xxsmall">Crisis Text Line</Heading>
          <Text size="small">
            If you would like to talk further about your mental health, or if you need mental health support, you can text HOME to 741741 from anywhere in the United States, anytime, to reach the Crisis Text Line. You can visit{' '}
            <a href="https://www.crisistextline.org" target="_blank" rel="noopener noreferrer">
              https://www.crisistextline.org
            </a>{' '}
            for more ways to get in touch.
          </Text>
        </Box>

        <Box gap="xsmall" align="center">
          <Heading level="4" margin="xxsmall">National Suicide Prevention</Heading>
          <Text size="small">
            <a href="https://suicidepreventionlifeline.org/" target="_blank" rel="noopener noreferrer">
              https://suicidepreventionlifeline.org/
            </a>
          </Text>
          <Text size="small">
            You can also dial 988 from anywhere in the United States to call the National Suicide Prevention Lifeline.
          </Text>
        </Box>

        <Box gap="xsmall" align="center">
          <Heading level="4" margin="xxsmall">Mental Health America</Heading>
          <Text size="small">
            <a href="https://mhanational.org/get-involved/contact-us" target="_blank" rel="noopener noreferrer">
              https://mhanational.org/get-involved/contact-us
            </a>
          </Text>
          <Text size="small">
            If you or someone you know is struggling or in crisis, help is available. Call or text 988 or chat 988lifeline.org. You can also reach Crisis Text Line by texting MHA to 741741.
          </Text>
        </Box>

        <Box gap="xsmall" align="center">
          <Heading level="4" margin="xxsmall">SAMHSA Disaster Distress Helpline</Heading>
          <Text size="small">
            <a href="https://www.samhsa.gov/find-help/disaster-distress-helpline" target="_blank" rel="noopener noreferrer">
              https://www.samhsa.gov/find-help/disaster-distress-helpline
            </a>
          </Text>
          <Text size="small">
            You can also call 1-800-985-5990 or text &quot;TalkWithUs&quot; to 66746 at the SAMHSA Disaster Distress Helpline. Trained crisis workers will listen to you and direct you to the resources you need.
          </Text>
        </Box>
      </Box>

      <Button
        primary
        reverse
        icon={<LinkNext />}
        color="button"
        label="Continue"
        onClick={() => {
          if (props.handler) {
            props.handler();
          }
        }}
        margin="small"
      />
    </Box>
  );

  return (
    <>
      {currentPage === 'uk' && <UKResources />}
      {currentPage === 'us' && <USResources />}
    </>
  );
};

export default Resources;
