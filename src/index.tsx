/**
 * @file Main experiment timeline configuration and execution.
 *
 * This file orchestrates the entire experiment flow, including:
 * - Experiment initialization and configuration
 * - Timeline construction with three distinct phases:
 *   1. Player choice phase (36 rounds)
 *   2. Partner choice phase with player predictions (54 rounds)
 *   3. Final player choice phase
 * - Practice trials and attention checks for each phase
 * - Partner matching sequences between phases
 * - Data collection and storage management
 * - React-to-HTML conversion for instruction screens
 *
 * The experiment uses jsPsych for trial management and the `neurocog`
 * crossplatform API for data handling. Each phase includes practice
 * trials, attention checks, and detailed instructions. The timeline
 * supports both standard and alternate input modes.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React
import React from "react";

// Grommet UI components
import { Box, Grommet, Heading, Paragraph } from "grommet";

// Configuration
import { Configuration } from "./configuration";

// Import data spreadsheets
import Default from "../data/default.csv";
import Test from "../data/test.csv";

// Utility functions
import { initializeLocalStorage, react2html } from "./util";
import { shuffle } from "d3-array";

// Custom input bindings
import { BINDINGS } from "./bindings";

// Logging library
import consola from "consola";

// Generate unique identifiers
import { v4 as uuidv4 } from "uuid";

// Import crossplatform API
import { Experiment } from "neurocog";

// Import jsPsych plugins
import "jspsych/plugins/jspsych-fullscreen";
import "jspsych/plugins/jspsych-instructions";
import "jspsych/plugins/jspsych-survey-html-form";
import "jspsych-attention-check";

// Import the custom plugin before adding it to the timeline
import "./plugin";

// Create a new Experiment instance
const experiment = new Experiment(Configuration);
consola.info("Experiment start:", new Date().toISOString());

/**
 * Handle the signal event, store in jsPsych data
 */
const handleSignal = () => {
  consola.debug("Received signal:", Date.now());

  // Append the signal timestamp to the state
  const collectedSignals = experiment
    .getState()
    .get("signalTimestamps") as number[];
  experiment
    .getState()
    .set("signalTimestamps", [...collectedSignals, Date.now()]);
};

// Setup the signal listener
document.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (event.key === BINDINGS.SIGNAL) {
    handleSignal();
  }
});

// Generate a unique identifier for this experiment run
const experimentID = `${Configuration.studyName}-${uuidv4()}`;
experiment.getState().set("experimentID", experimentID);
initializeLocalStorage(experimentID);

// Timeline setup
const timeline: Timeline = [];

// Update the partner avatar strings (for unique partners)
for (let i = 0; i < Configuration.avatars.names.partner.length; i++) {
  const partner = Configuration.avatars.names.partner[i];
  Configuration.avatars.names.partner[i] = `${partner} ${performance.now()}`;
}

if (Configuration.manipulations.requireID === true) {
  timeline.push({
    type: "survey-html-form",
    preamble: `<p>Please enter the 8 digit participant LUID.</p>`,
    html: `<input name="participantID" type="text" required/></br></br>`,
  });
}

// Set the experiment to run in fullscreen mode
if (Configuration.fullscreen === true) {
  timeline.push({
    type: "fullscreen",
    message: `<p>Click 'Continue' to enter fullscreen mode.</p>`,
    fullscreen_mode: true,
  });
}

let phaseOneInstructions = [
  // Overall instructions
  react2html(
    <Grommet>
      <Box style={{ maxWidth: "50%", margin: "auto" }}>
        <Heading level={1} margin="small" fill>
          Instructions
        </Heading>
        <Heading level={2} margin="small" fill>
          Overview
        </Heading>
        <Paragraph margin="small" size="large" fill>
          During this task you and a partner will be choosing how to divide a
          sum of points between each other. Your ID will not be revealed to your
          partner, and you won't be able to see the ID of your partner.
        </Paragraph>
        <Paragraph margin="small" size="large" fill>
          This game consists of three stages. You are matched with a{" "}
          <b>different</b> partner before each stage.
        </Paragraph>
        <Paragraph margin="small" size="large" fill>
          You will be paid a bonus at the end of the game which depends upon the
          number of points you each managed to accumulate while playing. If you
          earn over 1000 points in total across all three stages, you will
          automatically be placed into a lottery for your chance to win an extra
          $20.
        </Paragraph>
      </Box>
    </Grommet>
  ),
  // Part one instructions
  react2html(
    <Grommet>
      <Box style={{ maxWidth: "50%", margin: "auto" }}>
        <Heading level={1} margin="small" fill>
          Instructions
        </Heading>
        <Heading level={2} margin="small" fill>
          Overview
        </Heading>
        <Paragraph margin="small" size="large" fill>
          In stage one of this game, <b>you</b> will be choosing how the points
          are split between you and your partner.
        </Paragraph>
        <Paragraph margin="small" size="large" fill>
          In stage two, you will play with a <b>new partner</b> for 54 rounds.
          In this stage your <b>partner</b> will choose how to split the points.
          You need to guess how your partner plans to divide the points each
          round. You will earn bonus points for each correct prediction.
        </Paragraph>
        <Paragraph margin="small" size="large" fill>
          In stage three, you will play with <b>yet another new partner</b>{" "}
          where <b>you</b> will again be choosing how to split the points.
        </Paragraph>
        <Paragraph margin="small" size="large" fill>
          At the end of all the stages you will be shown a summary of how many
          points you and your partner accumulated during that phase.
        </Paragraph>
      </Box>
    </Grommet>
  ),
  react2html(
    <Grommet>
      <Box style={{ maxWidth: "50%", margin: "auto" }}>
        <Heading level={1} margin="small" fill>
          Instructions
        </Heading>
        <Heading level={2} margin="small" fill>
          Stage one
        </Heading>
        <Paragraph margin="small" size="large" fill>
          In this stage, <b>you</b> are tasked with distributing points
          between yourself and your partner. You may choose to distribute the
          points however you like. This stage will consist of 36 rounds.
        </Paragraph>
        <Paragraph margin="small" size="large" fill>
          Remember, the number of points each player holds at the end of the
          game will determine if they are entered into the bonus lottery.
        </Paragraph>
        <Paragraph margin="small" size="large" fill>
          Click 'Next &gt;' to select an avatar to represent you while you play
          this game. You will then play <b>3</b> practice rounds before you are
          matched with your partner.
        </Paragraph>
      </Box>
    </Grommet>
  ),
];

// Add controls instructions if using alternate input
if (Configuration.manipulations.useAlternateInput === true) {
  phaseOneInstructions = [
    react2html(
      <Grommet>
        <Box style={{ maxWidth: "50%", margin: "auto" }}>
          <Heading level={1} margin={"small"} fill>
            Instructions
          </Heading>
          <Heading level={2} margin="small" fill>
            Controls
          </Heading>
          <Paragraph size={"large"} margin={"small"} fill>
            When interacting with the game interface, the currently selected element will be highlighted with a gray outline. An example is shown below:
          </Paragraph>
          <Box width={"fit-content"} pad={"xsmall"} round border={{ color: "lightgray", size: "large" }} alignSelf={"center"}>
            <Paragraph margin={"small"} size={"large"} fill>
              <b>Element</b>
            </Paragraph>
          </Box>
          <Box alignSelf={"center"} margin={"none"}>
            <Paragraph size={"large"} textAlign={"start"}>
              <b>Button {BINDINGS.PREVIOUS}</b> selects the <b>previous</b> element;<br/>
              <b>Button {BINDINGS.NEXT}</b> selects the <b>next</b> element; and<br/>
              <b>Button {BINDINGS.SELECT}</b> interacts with the <b>currently selected</b> element.<br/>
            </Paragraph>
          </Box>
          <Paragraph size={"large"} margin={"small"}fill>
            When viewing instruction screens (e.g. this one), <b>Button {BINDINGS.NEXT}</b> continues to the next page and <b>Button {BINDINGS.PREVIOUS}</b> returns to the previous page.
          </Paragraph>
        </Box>
      </Grommet>
    ),
    ...phaseOneInstructions,
  ];
}

// Insert the instructions into the timeline
timeline.push({
  type: "instructions",
  pages: phaseOneInstructions,
  allow_keys: Configuration.manipulations.useAlternateInput,
  key_forward: BINDINGS.NEXT,
  key_backward: BINDINGS.PREVIOUS,
  show_page_number: true,
  show_clickable_nav: true,
});

// Insert a 'selection' screen into the timeline
timeline.push({
  type: Configuration.studyName,
  display: "selection",
});

// Pre-'playerChoice' instructions
timeline.push({
  type: "instructions",
  pages: [
    react2html(
      <Grommet>
        <Box>
          <Heading level={1} margin="small" fill>
            Instructions
          </Heading>
          <Paragraph margin="small" size="large" fill>
            Let's get used to how the game looks with some practice trials.
          </Paragraph>
          <Paragraph margin="small" size="large" fill>
            In these practice trials, the points will not count toward your
            total and your partner is not real.
          </Paragraph>
          <Paragraph margin="small" size="large" fill>
            Press 'Next &gt;' to continue.
          </Paragraph>
        </Box>
      </Grommet>
    ),
  ],
  allow_keys: Configuration.manipulations.useAlternateInput,
  key_forward: BINDINGS.NEXT,
  key_backward: BINDINGS.PREVIOUS,
  show_page_number: true,
  show_clickable_nav: true,
});

// 3x practice trials for 'playerChoice'
timeline.push({
  type: Configuration.studyName,
  optionOneParticipant: 10,
  optionOnePartner: 8,
  optionTwoParticipant: 8,
  optionTwoPartner: 8,
  typeOne: "",
  typeTwo: "",
  display: "playerChoicePractice",
  answer: "",
  isPractice: true,
});

timeline.push({
  type: Configuration.studyName,
  optionOneParticipant: 7,
  optionOnePartner: 2,
  optionTwoParticipant: 8,
  optionTwoPartner: 6,
  typeOne: "",
  typeTwo: "",
  display: "playerChoicePractice",
  answer: "",
  isPractice: true,
});

timeline.push({
  type: Configuration.studyName,
  optionOneParticipant: 7,
  optionOnePartner: 7,
  optionTwoParticipant: 10,
  optionTwoPartner: 7,
  typeOne: "",
  typeTwo: "",
  display: "playerChoicePractice",
  answer: "",
  isPractice: true,
});

// Post-'playerChoice' instructions
timeline.push({
  type: "instructions",
  pages: [
    react2html(
      <Grommet>
        <Box>
          <Heading level={1} margin="small" fill>
            Instructions
          </Heading>
          <Paragraph margin="small" size="large" fill>
            The practice trials are now over. Let's start the first stage of the
            game.
          </Paragraph>
          <Paragraph margin="small" size="large" fill>
            Press 'Next &gt;' to begin!
          </Paragraph>
        </Box>
      </Grommet>
    ),
  ],
  allow_keys: Configuration.manipulations.useAlternateInput,
  key_forward: BINDINGS.NEXT,
  key_backward: BINDINGS.PREVIOUS,
  show_page_number: true,
  show_clickable_nav: true,
});

// Attention check question
timeline.push({
  type: "attention-check",
  style: "radio",
  prompt:
    "In this stage of the game, who will be choosing the " +
    "number of points that you and your partner get?",
  responses: ["My partner", "Me", "By lottery"],
  correct: 1,
  feedback: {
    correct:
      "Correct! You will be choosing the points you and your partner get.",
    incorrect:
      "Incorrect. You will be choosing the points. Please review the following instructions.",
  },
  input_schema: {
    select:
      Configuration.manipulations.useAlternateInput === true
        ? BINDINGS.SELECT
        : null,
    next:
      Configuration.manipulations.useAlternateInput === true
        ? BINDINGS.NEXT
        : null,
    previous:
      Configuration.manipulations.useAlternateInput === true
        ? BINDINGS.PREVIOUS
        : null,
  },
  confirm_continue: false,
});

timeline.push({
  timeline: [
    {
      type: "instructions",
      pages: phaseOneInstructions,
      allow_keys: Configuration.manipulations.useAlternateInput,
      key_forward: BINDINGS.NEXT,
      key_backward: BINDINGS.PREVIOUS,
      show_page_number: true,
      show_clickable_nav: true,
    },
  ],
  conditional_function: () => {
    // Check if the response from the previous trial was correct
    const data = jsPsych.data.get().last(1).values()[0];
    if (data.attentionCorrect === true) {
      return false;
    } else {
      return true;
    }
  },
});

timeline.push({
  type: "attention-check",
  style: "radio",
  prompt:
    "How many points do you need to earn across all three phases of the game to be entered into the bonus lottery?",
  responses: ["1000", "500", "By lottery"],
  correct: 0,
  feedback: {
    correct:
      "Correct! You need to earn 1000 points across all three phases of the game to be entered into the bonus lottery.",
    incorrect:
      "Incorrect. You need to earn 1000 points across all three phases of the game to be entered into the bonus lottery. Please review the following instructions.",
  },
  input_schema: {
    select:
      Configuration.manipulations.useAlternateInput === true
        ? BINDINGS.SELECT
        : null,
    next:
      Configuration.manipulations.useAlternateInput === true
        ? BINDINGS.NEXT
        : null,
    previous:
      Configuration.manipulations.useAlternateInput === true
        ? BINDINGS.PREVIOUS
        : null,
  },
  confirm_continue: false,
});

timeline.push({
  timeline: [
    {
      type: "instructions",
      pages: phaseOneInstructions,
      allow_keys: Configuration.manipulations.useAlternateInput,
      key_forward: BINDINGS.NEXT,
      key_backward: BINDINGS.PREVIOUS,
      show_page_number: true,
      show_clickable_nav: true,
    },
  ],
  conditional_function: () => {
    // Check if the response from the previous trial was correct
    const data = jsPsych.data.get().last(1).values()[0];
    if (data.attentionCorrect === true) {
      return false;
    } else {
      return true;
    }
  },
});

// Insert instructions to let the participant know they will
// be matched with a partner
timeline.push({
  type: "instructions",
  pages: [
    react2html(
      <Grommet>
        <Box>
          <Heading level={1} margin="small" fill>
            Instructions
          </Heading>
          <Paragraph margin="small" size="large" fill>
            You will now be matched with a partner.
          </Paragraph>
          <Paragraph margin="small" size="large" fill>
            Press 'Next &gt;' to continue.
          </Paragraph>
        </Box>
      </Grommet>
    ),
  ],
  allow_keys: Configuration.manipulations.useAlternateInput,
  key_forward: BINDINGS.NEXT,
  key_backward: BINDINGS.PREVIOUS,
  show_page_number: true,
  show_clickable_nav: true,
});

// Insert the matching sequence into the timeline
timeline.push({
  type: Configuration.studyName,
  display: "matching",
  fetchData: false,
});

timeline.push({
  type: Configuration.studyName,
  display: "matched",
});

// Set and store the data collection
let dataCollection: Row[];

// Detect if we are running locally (use test data)
// or online (use the configured individual data)
if (
  process.env.NODE_ENV === "development" ||
  Configuration.manipulations.partner === "test"
) {
  dataCollection = Test;
  consola.info(`Loading test stage one partner`);
} else {
  consola.info(`Loading default stage one partner`);
  dataCollection = Default;
}

// Setup data storage for trial shuffling
const randomisedTrials: Record<string, Timeline> = {
  // 'playerChoice' trials
  phaseOne: [],
  // 'playerGuess' trials, will be ignored if request successful
  phaseTwo: [],
  // 'playerChoice2' trials
  phaseThree: [],
};

// Read each row from the data collection and insert the correct
// trial into the timeline
for (let i = 0; i < dataCollection.length; i++) {
  // Get the row from the data
  const row = dataCollection[i];

  // Check the trial type
  switch (row.display) {
    case "mid": {
      // Shuffle, number, and add stage one trials
      const stageOneTrials = shuffle(randomisedTrials.phaseOne);
      let stageOneCounter = 1;
      for (const trial of stageOneTrials) {
        trial.trial = stageOneCounter;
        stageOneCounter++;
      }

      // Push trials to the timeline
      timeline.push(...stageOneTrials);

      const phaseTwoInstructions = [
        react2html(
          <Grommet>
            <Box style={{ maxWidth: "50%", margin: "auto" }}>
              <Heading level={1} margin="small" fill>
                Instructions
              </Heading>
              <Heading level={2} margin="small" fill>
                Stage two
              </Heading>
              <Paragraph margin="small" size="large" fill>
                In this stage, <b>you will play with a new partner</b>. This
                time your partner will be the one choosing how the points are
                split between you both.
              </Paragraph>
              <Paragraph margin="small" size="large" fill>
                Remember, your partner will be different to the one you played
                with earlier. Your partner will not know how many points you
                have accumulated over the course of the game so far.
              </Paragraph>
              <Paragraph margin="small" size="large" fill>
                <b>
                  Your task will be to try to guess how your partner plans to
                  divide the points between the two of you each round.
                </b>
              </Paragraph>
              <Paragraph margin="small" size="large" fill>
                <b>
                  The number of times you correctly guess your partner's choices
                  will be multiplied by 10 and added to your total points
                </b>
                . This will contribute to your chance to win a bonus at the end
                of the game.
              </Paragraph>
            </Box>
          </Grommet>
        ),
        react2html(
          <Grommet>
            <Box style={{ maxWidth: "50%", margin: "auto" }}>
              <Heading level={1} margin="small" fill>
                Instructions
              </Heading>
              <Paragraph margin="small" size="large" fill>
                Let's get used to how stage two looks with some practice trials.
              </Paragraph>
              <Paragraph margin="small" size="large" fill>
                In these practice trials, the points will not count toward your
                total and the decisions made by your partner are not real.
              </Paragraph>
              <Paragraph margin="small" size="large" fill>
                Click 'Next &gt;' to begin!
              </Paragraph>
            </Box>
          </Grommet>
        ),
      ];

      // Break after Phase 1
      // Add the instructions for the first break
      timeline.push({
        type: "instructions",
        pages: phaseTwoInstructions,
        allow_keys: Configuration.manipulations.useAlternateInput,
        key_forward: BINDINGS.NEXT,
        key_backward: BINDINGS.PREVIOUS,
        show_page_number: true,
        show_clickable_nav: true,
      });

      // 3x practice trials for 'playerGuess'
      timeline.push({
        type: Configuration.studyName,
        optionOneParticipant: 5,
        optionOnePartner: 9,
        optionTwoParticipant: 9,
        optionTwoPartner: 9,
        typeOne: "",
        typeTwo: "",
        display: "playerGuessPractice",
        answer: "Option 1",
        isPractice: true,
      });

      timeline.push({
        type: Configuration.studyName,
        optionOneParticipant: 6,
        optionOnePartner: 6,
        optionTwoParticipant: 10,
        optionTwoPartner: 6,
        typeOne: "",
        typeTwo: "",
        display: "playerGuessPractice",
        answer: "Option 1",
        isPractice: true,
      });

      timeline.push({
        type: Configuration.studyName,
        optionOneParticipant: 8,
        optionOnePartner: 8,
        optionTwoParticipant: 10,
        optionTwoPartner: 8,
        typeOne: "",
        typeTwo: "",
        display: "playerGuessPractice",
        answer: "Option 1",
        isPractice: true,
      });

      // Post-'playerGuess' practice instructions
      timeline.push({
        type: "instructions",
        pages: [
          react2html(
            <Grommet>
              <Box>
                <Heading level={1} margin="small" fill>
                  Instructions
                </Heading>
                <Paragraph margin="small" size="large" fill>
                  The practice trials are now over. Let's start the second stage
                  of the game.
                </Paragraph>
                <Paragraph margin="small" size="large" fill>
                  Press 'Next &gt;' to begin!
                </Paragraph>
              </Box>
            </Grommet>
          ),
        ],
        allow_keys: Configuration.manipulations.useAlternateInput,
        key_forward: BINDINGS.NEXT,
        key_backward: BINDINGS.PREVIOUS,
        show_page_number: true,
        show_clickable_nav: true,
      });

      // Attention check question
      timeline.push({
        type: "attention-check",
        style: "radio",
        prompt:
          "In this part of task, " +
          "who will be choosing the points you and your partner get?",
        responses: ["Me", "By lottery", "My partner"],
        correct: 2,
        feedback: {
          correct:
            "Correct! Your partner will be choosing the points you and your partner get.",
          incorrect:
            "Incorrect. Your partner will be choosing the points. Please review the following instructions.",
        },
        input_schema: {
          select:
            Configuration.manipulations.useAlternateInput === true
              ? BINDINGS.SELECT
              : null,
          next:
            Configuration.manipulations.useAlternateInput === true
              ? BINDINGS.NEXT
              : null,
          previous:
            Configuration.manipulations.useAlternateInput === true
              ? BINDINGS.PREVIOUS
              : null,
        },
        confirm_continue: false,
      });

      timeline.push({
        timeline: [
          {
            type: "instructions",
            pages: phaseTwoInstructions,
            allow_keys: Configuration.manipulations.useAlternateInput,
            key_forward: BINDINGS.NEXT,
            key_backward: BINDINGS.PREVIOUS,
            show_page_number: true,
            show_clickable_nav: true,
          },
        ],
        conditional_function: () => {
          // Check if the response from the previous trial was correct
          const data = jsPsych.data.get().last(1).values()[0];
          if (data.attentionCorrect === true) {
            return false;
          } else {
            return true;
          }
        },
      });

      timeline.push({
        type: "attention-check",
        style: "radio",
        prompt:
          "What multiplier will be added to your total correct predictions about your partner?",
        responses: [
          "My total correct answers will be multiplied by 5 and added to my points.",
          "My total correct answers will be multiplied by 10 and added to my points.",
        ],
        correct: 1,
        feedback: {
          correct:
            "Correct! Your total correct answers will be multiplied by 10 and added to your points.",
          incorrect:
            "Incorrect. Your total correct answers will be multiplied by 10 and added to your points. Please review the following instructions.",
        },
        input_schema: {
          select:
            Configuration.manipulations.useAlternateInput === true
              ? BINDINGS.SELECT
              : null,
          next:
            Configuration.manipulations.useAlternateInput === true
              ? BINDINGS.NEXT
              : null,
          previous:
            Configuration.manipulations.useAlternateInput === true
              ? BINDINGS.PREVIOUS
              : null,
        },
        confirm_continue: false,
      });

      timeline.push({
        timeline: [
          {
            type: "instructions",
            pages: phaseTwoInstructions,
            allow_keys: Configuration.manipulations.useAlternateInput,
            key_forward: BINDINGS.NEXT,
            key_backward: BINDINGS.PREVIOUS,
            show_page_number: true,
            show_clickable_nav: true,
          },
        ],
        conditional_function: () => {
          // Check if the response from the previous trial was correct
          const data = jsPsych.data.get().last(1).values()[0];
          if (data.attentionCorrect === true) {
            return false;
          } else {
            return true;
          }
        },
      });

      // Insert instructions to let the participant know they will
      // be matched with a partner
      timeline.push({
        type: "instructions",
        pages: [
          react2html(
            <Grommet>
              <Box>
                <Heading level={1} margin="small" fill>
                  Instructions
                </Heading>
                <Paragraph margin="small" size="large" fill>
                  You will now be matched with a partner.
                </Paragraph>
                <Paragraph margin="small" size="large" fill>
                  Press 'Next &gt;' to continue.
                </Paragraph>
              </Box>
            </Grommet>
          ),
        ],
        allow_keys: Configuration.manipulations.useAlternateInput,
        key_forward: BINDINGS.NEXT,
        key_backward: BINDINGS.PREVIOUS,
        show_page_number: true,
        show_clickable_nav: true,
      });

      // Insert another 'match' sequence into the timeline
      timeline.push({
        type: Configuration.studyName,
        display: "matching",
        fetchData: true,
      });

      timeline.push({
        type: Configuration.studyName,
        display: "matched",
      });

      break;
    }
    case "mid2": {
      // Shuffle, number, and add stage two trials
      const stageTwoTrials = shuffle(randomisedTrials.phaseTwo);
      let stageTwoCounter = 1;
      for (const trial of stageTwoTrials) {
        trial["trial"] = stageTwoCounter;
        stageTwoCounter++;
      }
      timeline.push(...stageTwoTrials);

      // Inference screen
      timeline.push({
        type: Configuration.studyName,
        display: "inference",
      });

      // Classification screen
      timeline.push({
        type: Configuration.studyName,
        display: "classification",
      });

      const phaseThreeInstructions = [
        // Part three instructions
        react2html(
          <Grommet>
            <Box style={{ maxWidth: "50%", margin: "auto" }}>
              <Heading level={1} margin="small" fill>
                Instructions
              </Heading>
              <Heading level={2} margin="small" fill>
                Stage three
              </Heading>
              <Paragraph margin="small" size="large" fill>
                In the final stage of this game, <b>you</b> will again be
                choosing how the points are split between yourself and your
                partner. As before, you may choose to distribute the points
                however you like.
              </Paragraph>
              <Paragraph margin="small" size="large" fill>
                Remember, your partner will be different to the ones you have
                previously played. You will not know how many points they have
                accumulated over the course of the game so far.
              </Paragraph>
              <Paragraph margin="small" size="large" fill>
                Click 'Next &gt;' to be matched with your partner and start
                stage three. There will be no practice trials beforehand.
              </Paragraph>
            </Box>
          </Grommet>
        ),
      ];

      // Add the second break instructions
      timeline.push({
        type: "instructions",
        pages: phaseThreeInstructions,
        allow_keys: Configuration.manipulations.useAlternateInput,
        key_forward: BINDINGS.NEXT,
        key_backward: BINDINGS.PREVIOUS,
        show_page_number: true,
        show_clickable_nav: true,
      });

      timeline.push({
        type: "attention-check",
        style: "radio",
        prompt:
          "Who is going to be your interaction partner in this next phase?",
        responses: [
          "A new anonymous partner.",
          "My partner from the last phase.",
        ],
        correct: 0,
        feedback: {
          correct:
            "Correct! You will be interacting with a new anonymous partner in this next phase.",
          incorrect:
            "Incorrect. You will be interacting with a new anonymous partner in this next phase. Please review the following instructions.",
        },
        input_schema: {
          select:
            Configuration.manipulations.useAlternateInput === true
              ? BINDINGS.SELECT
              : null,
          next:
            Configuration.manipulations.useAlternateInput === true
              ? BINDINGS.NEXT
              : null,
          previous:
            Configuration.manipulations.useAlternateInput === true
              ? BINDINGS.PREVIOUS
              : null,
        },
        confirm_continue: false,
      });

      timeline.push({
        timeline: [
          {
            type: "instructions",
            pages: phaseThreeInstructions,
            allow_keys: Configuration.manipulations.useAlternateInput,
            key_forward: BINDINGS.NEXT,
            key_backward: BINDINGS.PREVIOUS,
            show_page_number: true,
            show_clickable_nav: true,
          },
        ],
        conditional_function: () => {
          // Check if the response from the previous trial was correct
          const data = jsPsych.data.get().last(1).values()[0];
          if (data.attentionCorrect === true) {
            return false;
          } else {
            return true;
          }
        },
      });

      timeline.push({
        type: "instructions",
        pages: [
          // Insert instructions to let the participant know they will
          // be matched with a partner
          react2html(
            <Grommet>
              <Box>
                <Heading level={1} margin="small" fill>
                  Instructions
                </Heading>
                <Paragraph margin="small" size="large" fill>
                  You will now be matched with a partner.
                </Paragraph>
                <Paragraph margin="small" size="large" fill>
                  Press 'Next &gt;' to continue.
                </Paragraph>
              </Box>
            </Grommet>
          ),
        ],
        allow_keys: Configuration.manipulations.useAlternateInput,
        key_forward: BINDINGS.NEXT,
        key_backward: BINDINGS.PREVIOUS,
        show_page_number: true,
        show_clickable_nav: true,
      });

      // Insert another 'match' sequence into the timeline
      timeline.push({
        type: Configuration.studyName,
        display: "matching",
        fetchData: false,
      });

      timeline.push({
        type: Configuration.studyName,
        display: "matched",
      });

      break;
    }
    case "playerGuess": {
      // 'playerGuess' trials, similar to 'playerChoice'-type trials,
      // but the returns are switched
      randomisedTrials.phaseTwo.push({
        type: Configuration.studyName,
        optionOneParticipant: row.Option1_Partner,
        optionOnePartner: row.Option1_PPT,
        optionTwoParticipant: row.Option2_Partner,
        optionTwoPartner: row.Option2_PPT,
        typeOne: row.Type1,
        typeTwo: row.Type2,
        display: row.display,
        answer: row.ANSWER,
      });
      break;
    }
    case "playerChoice": {
      // 'playerChoice' trials
      randomisedTrials.phaseOne.push({
        type: Configuration.studyName,
        optionOneParticipant: row.Option1_PPT,
        optionOnePartner: row.Option1_Partner,
        optionTwoParticipant: row.Option2_PPT,
        optionTwoPartner: row.Option2_Partner,
        typeOne: row.Type1,
        typeTwo: row.Type2,
        display: row.display,
        answer: row.ANSWER,
      });
      break;
    }
    case "playerChoice2": {
      // 'playerChoice2' trials
      randomisedTrials.phaseThree.push({
        type: Configuration.studyName,
        optionOneParticipant: row.Option1_PPT,
        optionOnePartner: row.Option1_Partner,
        optionTwoParticipant: row.Option2_PPT,
        optionTwoPartner: row.Option2_Partner,
        typeOne: row.Type1,
        typeTwo: row.Type2,
        display: row.display,
        answer: row.ANSWER,
      });
      break;
    }
    default: {
      // Remaining trials
      timeline.push({
        type: Configuration.studyName,
        optionOneParticipant: row.Option1_PPT,
        optionOnePartner: row.Option1_Partner,
        optionTwoParticipant: row.Option2_PPT,
        optionTwoPartner: row.Option2_Partner,
        typeOne: row.Type1,
        typeTwo: row.Type2,
        display: row.display,
        answer: row.ANSWER,
      });
      break;
    }
  }
}

// Shuffle, number, and add stage three trials
const stageThreeTrials = shuffle(randomisedTrials.phaseThree);
let stageThreeCounter = 1;
for (const trial of stageThreeTrials) {
  trial["trial"] = stageThreeCounter;
  stageThreeCounter++;
}
timeline.push(...stageThreeTrials);

// Add a summary screen
timeline.push({
  type: Configuration.studyName,
  display: "summary",
});

// Agency screen
timeline.push({
  type: Configuration.studyName,
  display: "agency",
});

// End screen
timeline.push({
  type: Configuration.studyName,
  display: "end",
});

// Configure and start the experiment
experiment.start({
  timeline: timeline,
  show_progress_bar: true,
  show_preload_progress_bar: true,
});
