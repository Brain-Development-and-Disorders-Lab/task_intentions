/**
 * @file `DASS` screen for collecting DASS-21 questionnaire responses.
 *
 * This screen presents participants with DASS-21 questions using
 * radio button responses (0-3). Key features include:
 * - Two-page questionnaire design
 * - Support for adult and adolescent versions
 * - Radio button responses for each question
 * - Response validation before proceeding
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useState } from "react";

// Grommet UI components
import { Box, Button, Paragraph, RadioButtonGroup, Heading, Text } from "grommet";
import { LinkNext } from "grommet-icons";

// Question sets
const ADULT_QUESTIONS = [
  "I found it hard to wind down",
  "I was aware of dryness of my mouth",
  "I couldn't seem to experience any positive feeling at all",
  "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion) ",
  "I found it difficult to work up the initiative to do things",
  "I tended to over-react to situations",
  "I experienced trembling (e.g., in the hands)",
  "I felt that I was using a lot of nervous energy",
  "I was worried about situations in which I might panic and make a fool of myself",
  "I felt that I had nothing to look forward to",
  "I found myself getting agitated",
  "I found it difficult to relax",
  "I felt down-hearted and blue",
  "I was intolerant of anything that kept me from getting on with what I was doing",
  "I felt I was close to panic",
  "I was unable to become enthusiastic about anything",
  "I felt I wasn't worth much as a person",
  "I felt that I was rather touchy",
  "I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat)",
  "I felt scared without any good reason",
  "I felt that life was meaningless",
];
const ADOLESCENT_QUESTIONS = [
  "I got upset about little things",
  "I felt dizzy, like I was about to faint",
  "I did not enjoy anything",
  "I had trouble breathing (e.g. fast breathing), even though I wasn't exercising and I was not sick",
  "I hated my life",
  "I found myself over-reacting to situations",
  "My hands felt shaky",
  "I was stressing about lots of things",
  "I felt terrified",
  "There was nothing nice I could look forward to",
  "I was easily irritated",
  "I found it difficult to relax",
  "I could not stop feeling sad",
  "I got annoyed when people interrupted me",
  "I felt like I was about to panic",
  "I hated myself",
  "I felt like I was no good",
  "I was easily annoyed",
  "I could feel my heart beating really fast, even though I hadn't done any hard exercise",
  "I felt scared for no good reason",
  "I felt that life was terrible",
];

const SCORING = [
  "0 = Did not apply to me at all",
  "1 = Applied to me to some degree, or some of the time",
  "2 = Applied to me to a considerable degree or a good part of time",
  "3 = Applied to me very much or most of the time",
];

/**
 * @summary Generate a 'DASS' screen component with two pages for collecting DASS-21 responses
 * @param {Props.Screens.DASS} props Component props containing:
 *  - version: {"adult" | "adolescent"} Which version of DASS to use
 *  - handler: {(responses: number[]) => void} Callback function when participant continues
 * @return {ReactElement} 'DASS' screen with two pages
 */
const DASS: FC<Props.Screens.DASS> = (
  props: Props.Screens.DASS
): ReactElement => {
  // Page state
  const [currentPage, setCurrentPage] = useState(1);

  // Get the appropriate question set
  const questions = props.version === "adult" ? ADULT_QUESTIONS : ADOLESCENT_QUESTIONS;

  // Initialize responses array with -1 (unanswered)
  const [responses, setResponses] = useState<number[]>(
    new Array(questions.length).fill(-1)
  );

  // Split questions into pages (7 questions per page)
  const pages = [
    questions.slice(0, 7),
    questions.slice(7, 14),
    questions.slice(14)
  ];

  // Update response for a specific question
  const updateResponse = (questionIndex: number, value: number) => {
    const newResponses = [...responses];
    newResponses[questionIndex] = value;
    setResponses(newResponses);
  };

  // Check if all questions are answered
  const allAnswered = responses.every(response => response !== -1);

  // Render page 1
  if (currentPage === 1) {
    return (
      <Box
        justify={"center"}
        align={"center"}
        gap={"xsmall"}
        style={{ maxWidth: "70%", margin: "auto" }}
        animation={["fadeIn"]}
      >
        <Heading level={3} margin={"small"} fill>
          DASS-21 Questionnaire
        </Heading>
        <Paragraph margin={"xsmall"} size={"small"} textAlign={"center"} color={"dark-4"}>
          Page 1 of 4
        </Paragraph>

        <Paragraph margin={"small"} size={"large"} fill textAlign={"center"}>
          The following questions ask about how you have been feeling over the past week.
          Please indicate how much each statement applied to you over the past week.
        </Paragraph>

        <Paragraph margin={"small"} size={"large"} fill textAlign={"center"}>
          There are no right or wrong answers. Please respond to each question based on
          how you have been feeling, not how you think you should feel.
        </Paragraph>

        <Paragraph margin={"small"} size={"large"} fill textAlign={"center"}>
          Scoring:
        </Paragraph>

        <Box direction={"row"} gap={"small"} pad={"small"} width={"80%"}>
          <Box direction={"column"} gap={"xxsmall"} align={"start"} width={"50%"}>
            {SCORING.slice(0, 2).map((score, index) => (
              <Text key={index} size={"small"} textAlign={"start"}>{score}</Text>
            ))}
          </Box>
          <Box direction={"column"} gap={"xxsmall"} align={"start"} width={"50%"}>
            {SCORING.slice(2).map((score, index) => (
              <Text key={index} size={"small"} textAlign={"start"}>{score}</Text>
            ))}
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
            color={"button"}
            label={"Continue"}
            icon={<LinkNext />}
            reverse
            onClick={() => setCurrentPage(2)}
          />
        </Box>
      </Box>
    );
  }

  // Render page 2
  if (currentPage === 2) {
    return (
      <Box
        justify={"center"}
        align={"center"}
        gap={"xsmall"}
        style={{ maxWidth: "80%", margin: "auto" }}
        animation={["fadeIn"]}
      >
        <Heading level={3} margin={"xsmall"} fill>
          DASS-21 Questionnaire
        </Heading>
        <Box direction={"row"} gap={"small"} fill pad={"small"}>
          <Box direction={"column"} gap={"xxsmall"} align={"start"} width={"50%"}>
            {SCORING.slice(0, 2).map((score, index) => (
              <Text key={index} size={"xsmall"} textAlign={"start"}>{score}</Text>
            ))}
          </Box>
          <Box direction={"column"} gap={"xxsmall"} align={"start"} width={"50%"}>
            {SCORING.slice(2).map((score, index) => (
              <Text key={index} size={"xsmall"} textAlign={"start"}>{score}</Text>
            ))}
          </Box>
        </Box>
        <Box
          direction={"column"}
          gap={"small"}
          width={"100%"}
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          {pages[0].map((question: string, index: number) => (
            <Box
              key={index}
              direction={"row"}
              align={"center"}
              gap={"medium"}
              pad={"small"}
              border={{ color: "light-3", size: "xsmall" }}
              round={"small"}
              background={"light-1"}
            >
              <Paragraph margin={"none"} size={"small"} textAlign={"start"} style={{ flex: 1 }}>
                {index + 1}. {question}
              </Paragraph>

              <RadioButtonGroup
                name={`dass-${index}`}
                direction={"row"}
                gap={"small"}
                options={[
                  { label: "0", value: 0 },
                  { label: "1", value: 1 },
                  { label: "2", value: 2 },
                  { label: "3", value: 3 }
                ]}
                value={responses[index] === -1 ? undefined : responses[index]}
                onChange={event => updateResponse(index, Number(event.target.value))}
              />
            </Box>
          ))}
        </Box>

        <Paragraph margin={"xsmall"} size={"small"} textAlign={"center"} color={"dark-4"}>
          Page 2 of 4
        </Paragraph>

        <Box
          direction={"row"}
          gap={"medium"}
          margin={"none"}
          pad={"none"}
        >
          <Button
            primary
            color={"button"}
            label={"Back"}
            onClick={() => setCurrentPage(1)}
          />
          <Button
            primary
            color={"button"}
            label={"Continue"}
            icon={<LinkNext />}
            reverse
            onClick={() => setCurrentPage(3)}
          />
        </Box>
      </Box>
    );
  }

  // Render page 3
  if (currentPage === 3) {
    return (
      <Box
        justify={"center"}
        align={"center"}
        gap={"xsmall"}
        style={{ maxWidth: "80%", margin: "auto" }}
        animation={["fadeIn"]}
      >
        <Heading level={3} margin={"small"} fill>
          DASS-21 Questionnaire
        </Heading>
        <Box direction={"row"} gap={"small"} fill pad={"small"}>
          <Box direction={"column"} gap={"xxsmall"} align={"start"} width={"50%"}>
            {SCORING.slice(0, 2).map((score, index) => (
              <Text key={index} size={"xsmall"} textAlign={"start"}>{score}</Text>
            ))}
          </Box>
          <Box direction={"column"} gap={"xxsmall"} align={"start"} width={"50%"}>
            {SCORING.slice(2).map((score, index) => (
              <Text key={index} size={"xsmall"} textAlign={"start"}>{score}</Text>
            ))}
          </Box>
        </Box>
        <Box
          direction={"column"}
          gap={"small"}
          width={"100%"}
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          {pages[1].map((question: string, index: number) => (
            <Box
              key={index + 7}
              direction={"row"}
              align={"center"}
              gap={"medium"}
              pad={"small"}
              border={{ color: "light-3", size: "xsmall" }}
              round={"small"}
              background={"light-1"}
            >
              <Paragraph margin={"none"} size={"small"} textAlign={"start"} style={{ flex: 1 }}>
                {index + 8}. {question}
              </Paragraph>

              <RadioButtonGroup
                name={`dass-${index + 7}`}
                direction={"row"}
                gap={"small"}
                options={[
                  { label: "0", value: 0 },
                  { label: "1", value: 1 },
                  { label: "2", value: 2 },
                  { label: "3", value: 3 }
                ]}
                value={responses[index + 7] === -1 ? undefined : responses[index + 7]}
                onChange={event => updateResponse(index + 7, Number(event.target.value))}
              />
            </Box>
          ))}
        </Box>

        <Paragraph margin={"xsmall"} size={"small"} textAlign={"center"} color={"dark-4"}>
          Page 3 of 4
        </Paragraph>

        <Box
          direction={"row"}
          gap={"medium"}
          margin={"none"}
          pad={"none"}
        >
          <Button
            primary
            color={"button"}
            label={"Back"}
            onClick={() => setCurrentPage(2)}
          />
          <Button
            primary
            color={"button"}
            label={"Continue"}
            icon={<LinkNext />}
            reverse
            onClick={() => setCurrentPage(4)}
          />
        </Box>
      </Box>
    );
  }

  // Render page 4
  return (
    <Box
      justify={"center"}
      align={"center"}
      gap={"xsmall"}
      style={{ maxWidth: "80%", margin: "auto" }}
      animation={["fadeIn"]}
    >
      <Heading level={3} margin={"small"} fill>
        DASS-21 Questionnaire
      </Heading>
      <Box direction={"row"} gap={"small"} fill pad={"small"}>
        <Box direction={"column"} gap={"xxsmall"} align={"start"} width={"50%"}>
          {SCORING.slice(0, 2).map((score, index) => (
            <Text key={index} size={"xsmall"} textAlign={"start"}>{score}</Text>
          ))}
        </Box>
        <Box direction={"column"} gap={"xxsmall"} align={"start"} width={"50%"}>
          {SCORING.slice(2).map((score, index) => (
            <Text key={index} size={"xsmall"} textAlign={"start"}>{score}</Text>
          ))}
        </Box>
      </Box>
      <Box
        direction={"column"}
        gap={"small"}
        width={"100%"}
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {pages[2].map((question: string, index: number) => (
          <Box
            key={index + 14}
            direction={"row"}
            align={"center"}
            gap={"small"}
            pad={"small"}
            border={{ color: "light-3", size: "xsmall" }}
            round={"small"}
            background={"light-1"}
          >
            <Paragraph margin={"none"} size={"small"} textAlign={"start"} style={{ flex: 1 }}>
              {index + 15}. {question}
            </Paragraph>

            <RadioButtonGroup
              name={`dass-${index + 14}`}
              direction={"row"}
              gap={"small"}
              options={[
                { label: "0", value: 0 },
                { label: "1", value: 1 },
                { label: "2", value: 2 },
                { label: "3", value: 3 }
              ]}
              value={responses[index + 14] === -1 ? undefined : responses[index + 14]}
              onChange={event => updateResponse(index + 14, Number(event.target.value))}
            />
          </Box>
        ))}
      </Box>

      <Paragraph margin={"xsmall"} size={"small"} textAlign={"center"} color={"dark-4"}>
        Page 4 of 4
      </Paragraph>

      <Box
        direction={"row"}
        gap={"medium"}
        margin={"none"}
        pad={"none"}
      >
        <Button
          primary
          color={"button"}
          label={"Back"}
          onClick={() => setCurrentPage(3)}
        />
        <Button
          primary
          color={"button"}
          label={"Submit"}
          disabled={!allAnswered}
          icon={<LinkNext />}
          onClick={() => props.handler(responses)}
          reverse
        />
      </Box>
    </Box>
  );
};

export default DASS;
