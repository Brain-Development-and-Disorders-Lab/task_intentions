// React
import React from 'react';

// Grommet UI components
import {Box, Grommet, Heading, Paragraph} from 'grommet';

// Configuration
import {Configuration} from './lib/configuration';

// Import data spreadsheets
import Competitive from './data/competitive.csv';
import Individualist from './data/individualist.csv';
import Prosocial from './data/prosocial.csv';
import Test from './data/test.csv';

// Utility functions
import {react2html} from './lib/util';
import {shuffle} from 'd3-array';

// Logging library
import consola from 'consola';

// Import crossplatform API
import {Experiment} from 'jspsych-wrapper';

// Import jsPsych plugins
import 'jspsych/plugins/jspsych-instructions';
import 'jspsych-attention-check';

// Import the custom plugin before adding it to the timeline
import './plugin';

// Timeline setup
const timeline: Timeline = [];

// Create a new Experiment instance
const experiment = new Experiment(Configuration);

// Update the partner avatar strings (for unique partners)
for (let i = 0; i < Configuration.avatars.names.partner.length; i++) {
  const partner = Configuration.avatars.names.partner[i];
  Configuration.avatars.names.partner[i] =
      `${partner} ${Configuration.manipulations.partner.toLowerCase()}`;
}

// Set the experiment to run in fullscreen mode
if (Configuration.fullscreen === true) {
  timeline.push({
    type: 'fullscreen',
    message: `<p>Click 'Continue' to enter fullscreen mode.</p>`,
    fullscreen_mode: true,
  });
}

// Insert the instructions into the timeline
timeline.push({
  type: 'instructions',
  pages: [
    // Overall instructions
    react2html(
        <Grommet>
          <Box style={{maxWidth: '50%', margin: 'auto'}}>
            <Heading level={1} margin='small' fill>Instructions</Heading>
            <Heading level={2} margin='small' fill>Overview</Heading>
            <Paragraph margin='small' size='large' fill>
              During this task you and a partner will be choosing how
              to divide a sum of points between each other.
              Your ID will not be revealed to your partner,
              and you won't be able to see the ID of your partner.
            </Paragraph>
            <Paragraph margin='small' size='large' fill>
              This game consists of three stages.
              You are matched with a <b>different</b> partner before each stage.
            </Paragraph>
            <Paragraph margin='small' size='large' fill>
              You will be paid a bonus at the end of the game which depends
              upon the number of points you each managed to accumulate while
              playing. If you earn over 1000 points in total across all three
              stages, you will automatically be placed into a lottery for your
              chance to win an extra $20.
            </Paragraph>
          </Box>
        </Grommet>
    ),
    // Part one instructions
    react2html(
        <Grommet>
          <Box style={{maxWidth: '50%', margin: 'auto'}}>
            <Heading level={1} margin='small' fill>Instructions</Heading>
            <Heading level={2} margin='small' fill>Overview</Heading>
            <Paragraph margin='small' size='large' fill>
              In stage one of this game, <b>you</b> will be choosing how the
              points are split between you and your partner.
            </Paragraph>
            <Paragraph margin='small' size='large' fill>
              In stage two, you will play with a <b>new partner</b> for 54
              rounds. In this stage your <b>partner</b> will choose how to
              split the points. You need to guess how your partner plans
              to divide the points each round. You will earn bonus points
              for each correct prediction.
            </Paragraph>
            <Paragraph margin='small' size='large' fill>
              In stage three, you will play with <b>yet another new
              partner</b> where <b>you</b> will again be choosing how to split
              the points.
            </Paragraph>
            <Paragraph margin='small' size='large' fill>
              At the end of each stage you will be shown a summary of how many
              points you and your partner accumulated during that phase.
            </Paragraph>
          </Box>
        </Grommet>
    ),
    react2html(
        <Grommet>
          <Box style={{maxWidth: '50%', margin: 'auto'}}>
            <Heading level={1} margin='small' fill>Instructions</Heading>
            <Heading level={2} margin='small' fill>Stage one</Heading>
            <Paragraph margin='small' size='large' fill>
              In the following <b>you</b> are tasked with distributing points
              between yourself and your partner. You may choose to distribute
              the points however you like. This stage will consist of 36 rounds.
            </Paragraph>
            <Paragraph margin='small' size='large' fill>
              Remember, the number of points each player holds at the end of the
              game will determine if they get a bonus payment.
            </Paragraph>
            <Paragraph margin='small' size='large' fill>
              Click 'Next &gt;' to select an avatar to represent you while
              you play this game. You will then play <b>5</b> practice rounds
              before you are matched with your partner.
            </Paragraph>
          </Box>
        </Grommet>
    ),
  ],
  allow_keys: false,
  show_page_number: true,
  show_clickable_nav: true,
});

// Insert a 'selection' screen into the timeline
timeline.push({
  type: Configuration.studyName,
  display: 'selection',
  clearScreen: true,
});

timeline.push({
  type: 'instructions',
  pages: [
    react2html(
        <Grommet>
          <Box>
            <Heading level={1} margin='small' fill>Instructions</Heading>
            <Paragraph margin='small' size='large' fill>
              Let's get used to how the game looks with some practice trials.
            </Paragraph>
            <Paragraph margin='small' size='large' fill>
              In these practice trials, the points will not count toward your
              total and your partner is not real.
            </Paragraph>
            <Paragraph margin='small' size='large' fill>
              Press 'Next &gt;' to continue.
            </Paragraph>
          </Box>
        </Grommet>
    ),
  ],
  allow_keys: false,
  show_page_number: true,
  show_clickable_nav: true,
});

// 5x practice trials for 'playerChoice'
timeline.push({
  type: Configuration.studyName,
  optionOneParticipant: 10,
  optionOnePartner: 8,
  optionTwoParticipant: 8,
  optionTwoPartner: 8,
  typeOne: '',
  typeTwo: '',
  display: 'playerChoicePractice',
  answer: '',
  isPractice: true,
  clearScreen: false,
});

timeline.push({
  type: Configuration.studyName,
  optionOneParticipant: 7,
  optionOnePartner: 2,
  optionTwoParticipant: 8,
  optionTwoPartner: 6,
  typeOne: '',
  typeTwo: '',
  display: 'playerChoicePractice',
  answer: '',
  isPractice: true,
  clearScreen: false,
});

timeline.push({
  type: Configuration.studyName,
  optionOneParticipant: 7,
  optionOnePartner: 7,
  optionTwoParticipant: 10,
  optionTwoPartner: 7,
  typeOne: '',
  typeTwo: '',
  display: 'playerChoicePractice',
  answer: '',
  isPractice: true,
  clearScreen: false,
});

timeline.push({
  type: Configuration.studyName,
  optionOneParticipant: 12,
  optionOnePartner: 9,
  optionTwoParticipant: 9,
  optionTwoPartner: 9,
  typeOne: '',
  typeTwo: '',
  display: 'playerChoicePractice',
  answer: '',
  isPractice: true,
  clearScreen: false,
});

timeline.push({
  type: Configuration.studyName,
  optionOneParticipant: 4,
  optionOnePartner: 4,
  optionTwoParticipant: 8,
  optionTwoPartner: 4,
  typeOne: '',
  typeTwo: '',
  display: 'playerChoicePractice',
  answer: '',
  isPractice: true,
  clearScreen: true,
});

timeline.push({
  type: 'instructions',
  pages: [
    react2html(
        <Grommet>
          <Box>
            <Heading level={1} margin='small' fill>Instructions</Heading>
            <Paragraph margin='small' size='large' fill>
              The practice trials are now over. Let's start the first
              stage of the game.
            </Paragraph>
            <Paragraph margin='small' size='large' fill>
              Press 'Next &gt;' to begin!
            </Paragraph>
          </Box>
        </Grommet>
    ),
  ],
  allow_keys: false,
  show_page_number: true,
  show_clickable_nav: true,
});

// Attention check question
timeline.push({
  type: 'attention-check',
  prompt: 'In this stage of the game, who will be choosing the ' +
      'number of points that you and your partner get?',
  options: [
    'My partner',
    'Me',
    'By lottery',
  ],
  options_radio: true,
  option_correct: 1,
  confirmation: true,
  feedback_correct: 'Correct! ' +
      'You will be choosing the points you and your partner get.',
  feedback_incorrect: 'Incorrect. You will be choosing the points.',
});

// Insert instructions to let the participant know they will
// be matched with a partner
timeline.push({
  type: 'instructions',
  pages: [
    react2html(
        <Grommet>
          <Box>
            <Heading level={1} margin='small' fill>Instructions</Heading>
            <Paragraph margin='small' size='large' fill>
              You will now be matched with a partner.
            </Paragraph>
            <Paragraph margin='small' size='large' fill>
              Press 'Next &gt;' to continue.
            </Paragraph>
          </Box>
        </Grommet>
    ),
  ],
  allow_keys: false,
  show_page_number: true,
  show_clickable_nav: true,
});

// Insert a 'match' sequence into the timeline
timeline.push({
  type: Configuration.studyName,
  display: 'matching',
  fetchData: false,
});

timeline.push({
  type: Configuration.studyName,
  display: 'matched',
  clearScreen: true,
});

// Set and store the data colelction
let dataCollection: Row[];

// Detect if we are running locally (use test data)
// or online (use the configured individual data)
if (process.env.NODE_ENV === 'development') {
  dataCollection = Test;
  consola.info(`Loading 'Test' partner`);
} else {
  consola.info(
      `Loading '${Configuration.manipulations.partner}' partner`
  );
  switch (Configuration.manipulations.partner as Partner) {
    case 'Competitive': {
      // Competitive partner
      dataCollection = Competitive;
      break;
    }
    case 'Individualist': {
      dataCollection = Individualist;
      break;
    }
    case 'Prosocial': {
      dataCollection = Prosocial;
      break;
    }
    case 'Test': {
      dataCollection = Test;
      break;
    }
    default:
      throw new Error(
          `Unknown partner type ` +
          `'${Configuration.manipulations.partner}'`
      );
  }
}

const randomisedTrials = {
  phaseOne: [] as any[],
  phaseTwo: [] as any[],
  phaseThree: [] as any[],
};

// Read each row from the data collection and insert the correct
// trial into the timeline
for (let i = 0; i < dataCollection.length; i++) {
  // Get the row from the data
  const row = dataCollection[i];

  // Check the trial type
  switch (row.display) {
    case 'mid': {
      // Shuffle, number, and add stage one trials
      const stageOneTrials = shuffle(randomisedTrials.phaseOne) as any[];
      let stageOneCounter = 1;
      for (const trial of stageOneTrials) {
        trial.trial = stageOneCounter;
        stageOneCounter++;
      }
      timeline.push(...stageOneTrials);

      // Add a summary screen
      timeline.push({
        type: Configuration.studyName,
        display: 'summary',
      });

      // Agency screen
      timeline.push({
        type: Configuration.studyName,
        display: 'agency',
        clearScreen: true,
      });

      // Break after Phase 1
      // Add the instructions for the first break

      // Push instructions to the timeline
      timeline.push({
        type: 'instructions',
        pages: [
          react2html(
              <Grommet>
                <Box style={{maxWidth: '50%', margin: 'auto'}}>
                  <Heading level={1} margin='small' fill>
                    Instructions
                  </Heading>
                  <Heading level={2} margin='small' fill>Stage two</Heading>
                  <Paragraph margin='small' size='large' fill>
                    In the following <b>you will play with a new partner</b>.
                    This time your partner will be the one choosing how the
                    points are split between you both.
                  </Paragraph>
                  <Paragraph margin='small' size='large' fill>
                    Remember, your partner will be different to the one you
                    played with earlier. Your partner will not know how many
                    points you have accumulated over the course of the game
                    so far.
                  </Paragraph>
                  <Paragraph margin='small' size='large' fill>
                    <b>Your task will be to try to guess how your partner
                    plans to divide the points between the two of you
                    each round.</b>
                  </Paragraph>
                  <Paragraph margin='small' size='large' fill>
                    <b>The number of times you correctly guess your partner's
                    choices will be multiplied by 10 and added to your total
                    points</b>. This will contribute to your chance to win a
                    bonus at the end of the task.
                  </Paragraph>
                </Box>
              </Grommet>
          ),
          react2html(
              <Grommet>
                <Box style={{maxWidth: '50%', margin: 'auto'}}>
                  <Heading level={1} margin='small' fill>
                    Instructions
                  </Heading>
                  <Paragraph margin='small' size='large' fill>
                    Let's get used to how stage two looks with some practice
                    trials.
                  </Paragraph>
                  <Paragraph margin='small' size='large' fill>
                    In these practice trials, the points will not count
                    toward your total and the decisions made by your partner
                    are not real.
                  </Paragraph>
                  <Paragraph margin='small' size='large' fill>
                    Click 'Next &gt;' to begin!
                  </Paragraph>
                </Box>
              </Grommet>
          ),
        ],
        allow_keys: false,
        show_page_number: true,
        show_clickable_nav: true,
      });

      // 5x practice trials for 'playerGuess'
      timeline.push({
        type: Configuration.studyName,
        optionOneParticipant: 5,
        optionOnePartner: 9,
        optionTwoParticipant: 9,
        optionTwoPartner: 9,
        typeOne: '',
        typeTwo: '',
        display: 'playerGuessPractice',
        answer: 'Option 1',
        isPractice: true,
        clearScreen: false,
      });

      timeline.push({
        type: Configuration.studyName,
        optionOneParticipant: 6,
        optionOnePartner: 6,
        optionTwoParticipant: 6,
        optionTwoPartner: 10,
        typeOne: '',
        typeTwo: '',
        display: 'playerGuessPractice',
        answer: 'Option 1',
        isPractice: true,
        clearScreen: false,
      });

      timeline.push({
        type: Configuration.studyName,
        optionOneParticipant: 10,
        optionOnePartner: 5,
        optionTwoParticipant: 10,
        optionTwoPartner: 10,
        typeOne: '',
        typeTwo: '',
        display: 'playerGuessPractice',
        answer: 'Option 1',
        isPractice: true,
        clearScreen: false,
      });

      timeline.push({
        type: Configuration.studyName,
        optionOneParticipant: 5,
        optionOnePartner: 9,
        optionTwoParticipant: 1,
        optionTwoPartner: 7,
        typeOne: '',
        typeTwo: '',
        display: 'playerGuessPractice',
        answer: 'Option 1',
        isPractice: true,
        clearScreen: false,
      });

      timeline.push({
        type: Configuration.studyName,
        optionOneParticipant: 6,
        optionOnePartner: 10,
        optionTwoParticipant: 2,
        optionTwoPartner: 8,
        typeOne: '',
        typeTwo: '',
        display: 'playerGuessPractice',
        answer: 'Option 2',
        isPractice: true,
        clearScreen: true,
      });

      timeline.push({
        type: 'instructions',
        pages: [
          react2html(
              <Grommet>
                <Box>
                  <Heading level={1} margin='small' fill>
                    Instructions
                  </Heading>
                  <Paragraph margin='small' size='large' fill>
                    The practice trials are now over.
                    Let's start the second stage of the game.
                  </Paragraph>
                  <Paragraph margin='small' size='large' fill>
                    Press 'Next &gt;' to begin!
                  </Paragraph>
                </Box>
              </Grommet>
          ),
        ],
        allow_keys: false,
        show_page_number: true,
        show_clickable_nav: true,
      });

      // Attention check question
      timeline.push({
        type: 'attention-check',
        prompt: 'In this part of task, ' +
            'who will be choosing the points you and your partner get?',
        options: [
          'Me',
          'By lottery',
          'My partner',
        ],
        options_radio: true,
        option_correct: 2,
        confirmation: true,
        feedback_correct: 'Correct! ' +
            'Your partner will be choosing the points you and your ' +
            'partner get.',
        feedback_incorrect: 'Incorrect. Your partner will be choosing ' +
            'the points.',
      });

      // Insert instructions to let the participant know they will
      // be matched with a partner
      timeline.push({
        type: 'instructions',
        pages: [
          react2html(
              <Grommet>
                <Box>
                  <Heading level={1} margin='small' fill>
                    Instructions
                  </Heading>
                  <Paragraph margin='small' size='large' fill>
                    You will now be matched with a partner.
                  </Paragraph>
                  <Paragraph margin='small' size='large' fill>
                    Press 'Next &gt;' to continue.
                  </Paragraph>
                </Box>
              </Grommet>
          ),
        ],
        allow_keys: false,
        show_page_number: true,
        show_clickable_nav: true,
      });

      // Insert another 'match' sequence into the timeline
      timeline.push({
        type: Configuration.studyName,
        display: 'matching',
        fetchData: true,
      });

      timeline.push({
        type: Configuration.studyName,
        display: 'matched',
        clearScreen: true,
      });

      break;
    }
    case 'mid2': {
      // Shuffle, number, and add stage two trials
      const stageTwoTrials = shuffle(randomisedTrials.phaseTwo) as any[];
      let stageTwoCounter = 1;
      for (const trial of stageTwoTrials) {
        trial['trial'] = stageTwoCounter;
        stageTwoCounter++;
      }
      timeline.push(...stageTwoTrials);

      // Summary screen
      timeline.push({
        type: Configuration.studyName,
        display: 'summary',
      });

      // Inference screen
      timeline.push({
        type: Configuration.studyName,
        display: 'inference',
      });

      // Classification screen
      timeline.push({
        type: Configuration.studyName,
        display: 'classification',
        clearScreen: true,
      });

      // Agency screen
      timeline.push({
        type: Configuration.studyName,
        display: 'agency',
        clearScreen: true,
      });

      // Add the second break instructions
      timeline.push({
        type: 'instructions',
        pages: [
          // Part three instructions
          react2html(
              <Grommet>
                <Box style={{maxWidth: '50%', margin: 'auto'}}>
                  <Heading level={1} margin='small' fill>
                    Instructions
                  </Heading>
                  <Heading level={2} margin='small' fill>Stage three</Heading>
                  <Paragraph margin='small' size='large' fill>
                    In the final stage of this game, <b>you</b> will again be
                    choosing how the points are split between yourself and
                    your partner. As before, you may choose to distribute the
                    points however you like.
                  </Paragraph>
                  <Paragraph margin='small' size='large' fill>
                    Remember, your partner will be different to the ones you
                    have previously played. You will not know how many points
                    they have accumulated over the course of the game so far.
                  </Paragraph>
                  <Paragraph margin='small' size='large' fill>
                    Click 'Next &gt;' to be matched with your partner and
                    start stage three. There will be no practice trials
                    beforehand.
                  </Paragraph>
                </Box>
              </Grommet>
          ),
          // Insert instructions to let the participant know they will
          // be matched with a partner
          react2html(
              <Grommet>
                <Box>
                  <Heading level={1} margin='small' fill>
                    Instructions
                  </Heading>
                  <Paragraph margin='small' size='large' fill>
                    You will now be matched with a partner.
                  </Paragraph>
                  <Paragraph margin='small' size='large' fill>
                    Press 'Next &gt;' to continue.
                  </Paragraph>
                </Box>
              </Grommet>
          ),
        ],
        allow_keys: false,
        show_page_number: true,
        show_clickable_nav: true,
      });

      // Insert another 'match' sequence into the timeline
      timeline.push({
        type: Configuration.studyName,
        display: 'matching',
        fetchData: false,
      });

      timeline.push({
        type: Configuration.studyName,
        display: 'matched',
        clearScreen: true,
      });

      break;
    }
    case 'playerGuess': {
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
        clearScreen: false,
      });
      break;
    }
    case 'playerChoice': {
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
        clearScreen: false,
      });
      break;
    }
    case 'playerChoice2': {
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
        clearScreen: false,
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
        clearScreen: false,
      });
      break;
    }
  }
}

// Shuffle, number, and add stage three trials
const stageThreeTrials = shuffle(randomisedTrials.phaseThree);
let stageThreeCounter = 1;
for (const trial of stageThreeTrials) {
  trial['trial'] = stageThreeCounter;
  stageThreeCounter++;
}
timeline.push(...stageThreeTrials);

// Add a summary screen
timeline.push({
  type: Configuration.studyName,
  display: 'summary',
});

// Agency screen
timeline.push({
  type: Configuration.studyName,
  display: 'agency',
  clearScreen: false,
});

// End screen
timeline.push({
  type: Configuration.studyName,
  display: 'end',
  clearScreen: true,
});

// Configure and start the experiment
experiment.start({
  timeline: timeline,
  show_progress_bar: true,
  show_preload_progress_bar: true,
});
