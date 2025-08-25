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
import { Box, Button, Paragraph, RadioButtonGroup, Heading } from "grommet";
import { LinkNext } from "grommet-icons";

// DASS question sets
const ADULT_QUESTIONS = Array.from({length: 21}, (_, i) => `Question ${i + 1} for adults`);
const ADOLESCENT_QUESTIONS = Array.from({length: 21}, (_, i) => `Question ${i + 1} for adolescents`);

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
        gap={"small"}
        style={{ maxWidth: "70%", margin: "auto" }}
        animation={["fadeIn"]}
      >
        <Heading level={3} margin="small" fill>
          DASS-21 Questionnaire
        </Heading>
        <Paragraph margin="xsmall" size="small" textAlign="center" color="dark-4">
          Page 1 of 4
        </Paragraph>

        <Paragraph margin="medium" size="large" fill textAlign="center">
          The following questions ask about how you have been feeling over the past week.
          Please indicate how much each statement applied to you over the past week.
        </Paragraph>

        <Paragraph margin="medium" size="large" fill textAlign="center">
          There are no right or wrong answers. Please respond to each question based on
          how you have been feeling, not how you think you should feel.
        </Paragraph>

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
        gap={"small"}
        style={{ maxWidth: "80%", margin: "auto" }}
        animation={["fadeIn"]}
      >
        <Heading level={3} margin="small" fill>
          DASS-21 Questionnaire
        </Heading>
        <Paragraph margin="xsmall" size="small" textAlign="center" color="dark-4">
          Page 2 of 4
        </Paragraph>
        <Box
          direction="column"
          gap="small"
          width="100%"
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          {pages[0].map((question: string, index: number) => (
            <Box
              key={index}
              direction="row"
              align="center"
              gap="medium"
              pad="small"
              border={{ color: "light-3", size: "xsmall" }}
              round="small"
              background="light-1"
            >
              <Paragraph margin="none" size="small" style={{ flex: 1 }}>
                {index + 1}. {question}
              </Paragraph>

              <RadioButtonGroup
                name={`dass-${index}`}
                direction="row"
                gap="small"
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

        <Box
          direction="row"
          gap="medium"
          margin={"medium"}
          pad={"none"}
          border={{ color: "transparent", size: "large" }}
          round
        >
          <Button
            primary
            color="button"
            label="Back"
            onClick={() => setCurrentPage(1)}
            disabled={true}
          />
          <Button
            primary
            color="button"
            label="Continue"
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
        gap={"small"}
        style={{ maxWidth: "80%", margin: "auto" }}
        animation={["fadeIn"]}
      >
        <Heading level={3} margin={"small"} fill>
          DASS-21 Questionnaire
        </Heading>
        <Paragraph margin={"xsmall"} size={"small"} textAlign={"center"} color={"dark-4"}>
          Page 3 of 4
        </Paragraph>
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
              <Paragraph margin="none" size="small" style={{ flex: 1 }}>
                {index + 8}. {question}
              </Paragraph>

              <RadioButtonGroup
                name={`dass-${index + 7}`}
                direction="row"
                gap="small"
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
        <Box
          direction="row"
          gap="medium"
          margin={"medium"}
          pad={"none"}
          border={{ color: "transparent", size: "large" }}
          round
        >
          <Button
            primary
            color="button"
            label="Back"
            onClick={() => setCurrentPage(2)}
          />
          <Button
            primary
            color="button"
            label="Continue"
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
      gap={"small"}
      style={{ maxWidth: "80%", margin: "auto" }}
      animation={["fadeIn"]}
    >
      <Heading level={3} margin="small" fill>
        DASS-21 Questionnaire
      </Heading>
      <Paragraph margin="xsmall" size="small" textAlign="center" color="dark-4">
        Page 4 of 4
      </Paragraph>
      <Box
        direction="column"
        gap="small"
        width="100%"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {pages[2].map((question: string, index: number) => (
          <Box
            key={index + 14}
            direction="row"
            align="center"
            gap="small"
            pad="small"
            border={{ color: "light-3", size: "xsmall" }}
            round="small"
            background="light-1"
          >
            <Paragraph margin="none" size="small" style={{ flex: 1 }}>
              {index + 15}. {question}
            </Paragraph>

            <RadioButtonGroup
              name={`dass-${index + 14}`}
              direction="row"
              gap="small"
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
      <Box
        direction="row"
        gap="medium"
        margin={"medium"}
        pad={"none"}
        border={{ color: "transparent", size: "large" }}
        round
      >
        <Button
          primary
          color="button"
          label="Back"
          onClick={() => setCurrentPage(3)}
        />
        <Button
          primary
          color="button"
          label="Submit"
          disabled={!allAnswered}
          icon={<LinkNext />}
          reverse
          onClick={() => props.handler(responses)}
        />
      </Box>
    </Box>
  );
};

export default DASS;
