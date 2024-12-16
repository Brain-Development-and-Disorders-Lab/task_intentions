/**
 * @file 'Handler' class tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Import the Handler class
import Handler from "src/lib/classes/Handler";

// Import utility functions
import { getHandler } from "test/utils/functions";

// Mock jsPsych
import "jspsych";
jest.mock("jspsych");

// Mock the jsPsych wrapper library
import { Experiment } from "neurocog";
jest.mock("neurocog");

// Setup the Experiment instances
beforeEach(() => {
  // Experiment
  (window["Experiment"] as RecursivePartial<Experiment>) = {
    getState: jest.fn(() => {
      return {
        get: jest.fn(),
        set: jest.fn(),
      };
    }),
  };
});

let handler: Handler;
beforeEach(() => {
  handler = getHandler("agency");
});

// Option handler
test("check the Option handler", async () => {
  handler.option(
    "Option 1",
    {
      options: {
        one: {
          participant: 1,
          partner: 1,
        },
        two: {
          participant: 2,
          partner: 2,
        },
      },
    },
    "Option 1"
  );

  const dataframe = handler.getDataframe();

  // Validate selected options
  expect(dataframe.playerPoints_selected).toBe(1);
  expect(dataframe.partnerPoints_selected).toBe(1);

  // Validate stored values
  expect(dataframe.playerPoints_option2).toBe(2);
  expect(dataframe.partnerPoints_option2).toBe(2);
});

// Selection handler
test("check the Selection handler", async () => {
  handler.selection("a");

  // Validate the stored selection
  expect(window.Experiment.getState).toBeCalled();
});

// Inference handler
test("check the Inference handler", async () => {
  handler.inference(1, 2);

  const dataframe = handler.getDataframe();

  // Validate the stored responses
  expect(dataframe.inferenceResponse_Selfish).toBe(1);
  expect(dataframe.inferenceResponse_Harm).toBe(2);
});

// Agency handler
test("check the Agency handler", async () => {
  handler.agency(1);

  const dataframe = handler.getDataframe();

  // Validate the stored responses
  expect(dataframe.agencyResponse).toBe(1);
});

// Classification handler
test("check the Classification handler", async () => {
  handler.classification("Prosocial");

  const dataframe = handler.getDataframe();

  // Validate the stored responses
  expect(dataframe.classification).toBe("Prosocial");
});
