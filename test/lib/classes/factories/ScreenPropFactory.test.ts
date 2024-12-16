/**
 * @file 'ScreenPropFactory' class tests
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Mock jsPsych
import "jspsych";
jest.mock("jspsych");

// Prop factory
import ScreenPropFactory from "src/lib/classes/factories/ScreenPropFactory";

// Import utility functions
import { getHandler, getTrialConfiguration } from "test/utils/functions";

test("generate props for Agency screen", async () => {
  // Create a new ScreenPropFactory instance
  const screenPropFactory = new ScreenPropFactory(
    getTrialConfiguration("agency"),
    getHandler("agency")
  );

  // Generate the props
  const generated = screenPropFactory.generate();

  // Check contents of props
  expect(generated.props.trial).toBe(1);
  expect(generated.props.display).toBe("agency");
  expect(generated.props).toHaveProperty("handler");
});

test("generate props for Classification screen", async () => {
  // Create a new ScreenPropFactory instance
  const screenPropFactory = new ScreenPropFactory(
    getTrialConfiguration("classification"),
    getHandler("classification")
  );

  // Generate the props
  const generated = screenPropFactory.generate();

  // Check contents of props
  expect(generated.props.trial).toBe(1);
  expect(generated.props.display).toBe("classification");
  expect(generated.props).toHaveProperty("handler");
});

test("generate props for End screen", async () => {
  // Create a new ScreenPropFactory instance
  const screenPropFactory = new ScreenPropFactory(
    getTrialConfiguration("end"),
    getHandler("end")
  );

  // Generate the props
  const generated = screenPropFactory.generate();

  // Check contents of props
  expect(generated.props.trial).toBe(1);
  expect(generated.props.display).toBe("end");
  expect(generated.props).not.toHaveProperty("handler");
});

test("generate props for Inference screen", async () => {
  // Create a new ScreenPropFactory instance
  const screenPropFactory = new ScreenPropFactory(
    getTrialConfiguration("inference"),
    getHandler("inference")
  );

  // Generate the props
  const generated = screenPropFactory.generate();

  // Check contents of props
  expect(generated.props.trial).toBe(1);
  expect(generated.props.display).toBe("inference");
  expect(generated.props).toHaveProperty("handler");
});

test("generate props for Matched screen", async () => {
  // Create a new ScreenPropFactory instance
  const screenPropFactory = new ScreenPropFactory(
    getTrialConfiguration("matched"),
    getHandler("matched")
  );

  // Generate the props
  const generated = screenPropFactory.generate();

  // Check contents of props
  expect(generated.props.trial).toBe(1);
  expect(generated.props.display).toBe("matched");
  expect(generated.props).not.toHaveProperty("handler");
});

test("generate props for Matching screen", async () => {
  // Create a new ScreenPropFactory instance
  const screenPropFactory = new ScreenPropFactory(
    getTrialConfiguration("matching"),
    getHandler("matching")
  );

  // Generate the props
  const generated = screenPropFactory.generate();

  // Check contents of props
  expect(generated.props.trial).toBe(1);
  expect(generated.props.display).toBe("matching");
  expect(generated.props.fetchData).toBe(false);
  expect(generated.props).toHaveProperty("handler");
});

test("generate props for Summary screen", async () => {
  // Create a new ScreenPropFactory instance
  const screenPropFactory = new ScreenPropFactory(
    getTrialConfiguration("summary"),
    getHandler("summary")
  );

  // Generate the props
  const generated = screenPropFactory.generate();

  // Check contents of props
  expect(generated.props.trial).toBe(1);
  expect(generated.props.display).toBe("summary");
  expect(generated.props.postPhase).toBe("playerChoice");
  expect(generated.props).toHaveProperty("handler");
});

test("generate props for Trial screen", async () => {
  // Create a new ScreenPropFactory instance
  const screenPropFactory = new ScreenPropFactory(
    getTrialConfiguration("playerChoice"),
    getHandler("playerChoice")
  );

  // Generate the props
  const generated = screenPropFactory.generate();

  // Check contents of props
  expect(generated.props.trial).toBe(1);
  expect(generated.props.display).toBe("playerChoice");
  expect(generated.props.isPractice).toBe(false);
  expect(generated.props.participantPoints).toBe(0);
  expect(generated.props.partnerPoints).toBe(0);
  expect(generated.props.options).toStrictEqual({
    one: {
      participant: 0,
      partner: 0,
    },
    two: {
      participant: 0,
      partner: 0,
    },
  });
  expect(generated.props.answer).toBe("Option 1");
  expect(generated.props).toHaveProperty("handler");
});
