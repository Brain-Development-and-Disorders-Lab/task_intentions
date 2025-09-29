/**
 * @file `Screentime` screen for collecting social media usage time information.
 *
 * This screen collects participants' social media usage time using
 * radio button responses (1-9). Key features include:
 * - Single-page questionnaire design
 * - Two questions about weekday and weekend usage
 * - Radio button responses with 9 time options
 * - Response validation before proceeding
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useState } from "react";

// Grommet UI components
import { Box, Button, RadioButtonGroup, Heading, Text } from "grommet";
import { LinkNext } from "grommet-icons";

// Time scale options
const TIME_OPTIONS = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
];

/**
 * @summary Generate a 'Screentime' screen component for collecting social media usage time
 * @param {Screens.Screentime} props Component props containing:
 *  - handler: {(weekdayTime: number, weekendTime: number) => void} Callback function when participant continues
 * @return {ReactElement} 'Screentime' screen with two questions
 */
const Screentime: FC<Screens.Screentime> = (
  props: Screens.Screentime
): ReactElement => {
  // Response state
  const [weekdayTime, setWeekdayTime] = useState(-1);
  const [weekendTime, setWeekendTime] = useState(-1);

  // Check if all questions are answered
  const allAnswered = weekdayTime !== -1 && weekendTime !== -1;

  return (
    <Box
      justify={"center"}
      align={"center"}
      gap={"small"}
      style={{ maxWidth: "80%", margin: "auto" }}
      animation={["fadeIn"]}
    >
      <Heading level={3} margin="small" fill>
        Social Media Usage Questionnaire
      </Heading>

      <Box direction={"row"} gap={"small"}>
        <Box direction={"column"} gap={"xxsmall"} align={"start"}>
          <Text size={"small"}>1 = Less than 30 minutes</Text>
          <Text size={"small"}>
            2 = More than 30 minutes but less than an hour
          </Text>
          <Text size={"small"}>3 = One to two hours</Text>
          <Text size={"small"}>4 = Two to three hours</Text>
          <Text size={"small"}>5 = Three to four hours</Text>
        </Box>
        <Box direction={"column"} gap={"xxsmall"} align={"start"}>
          <Text size={"small"}>6 = Four to five hours</Text>
          <Text size={"small"}>7 = Five to six hours</Text>
          <Text size={"small"}>8 = Six to seven hours</Text>
          <Text size={"small"}>9 = More than seven hours</Text>
        </Box>
      </Box>

      <Box
        direction="column"
        gap="medium"
        width="100%"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {/* Question 1 */}
        <Box
          direction="column"
          gap="small"
          pad="medium"
          border={{ color: "light-3", size: "xsmall" }}
          round="small"
          background="light-1"
        >
          <Text margin="none" size="medium" textAlign="start" weight="normal">
            1. When you use social media sites or apps, how much time do you
            spend using them on a typically school day [weekday]?
          </Text>

          <Box direction="row" justify="center" gap="small" width="100%">
            <RadioButtonGroup
              name="weekday-time"
              direction="row"
              gap="small"
              align="center"
              options={TIME_OPTIONS}
              value={weekdayTime === -1 ? undefined : weekdayTime}
              onChange={event => setWeekdayTime(Number(event.target.value))}
            />
          </Box>
        </Box>

        {/* Question 2 */}
        <Box
          direction="column"
          gap="small"
          pad="medium"
          border={{ color: "light-3", size: "xsmall" }}
          round="small"
          background="light-1"
        >
          <Text margin="none" size="medium" textAlign="start" weight="normal">
            2. When you use social media sites or apps, how much time in total
            do you spend using them on a typical weekend or holiday day?
          </Text>

          <Box direction="row" justify="center" gap="small" width="100%">
            <RadioButtonGroup
              name="weekend-time"
              direction="row"
              gap="small"
              align="center"
              options={TIME_OPTIONS}
              value={weekendTime === -1 ? undefined : weekendTime}
              onChange={event => setWeekendTime(Number(event.target.value))}
            />
          </Box>
        </Box>
      </Box>

      <Box
        margin={"medium"}
        pad={"none"}
        border={{ color: "transparent", size: "large" }}
        round
      >
        <Button
          primary
          color="button"
          label="Continue"
          icon={<LinkNext />}
          reverse
          disabled={!allAnswered}
          onClick={() => props.handler(weekdayTime, weekendTime)}
        />
      </Box>
    </Box>
  );
};

export default Screentime;
