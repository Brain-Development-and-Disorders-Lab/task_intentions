/**
 * @file `Loading` screen for various loading states.
 *
 * This screen manages different loading states throughout the experiment,
 * providing visual feedback during various processes. Key features include:
 * - Three loading states: matching, social, and default
 * - Loading indicator and progress animation
 * - Dynamic matching duration (3-7 seconds) for matching state
 * - Optional data collection and server communication for matching state
 * - Integration with experiment state management
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useEffect } from "react";

// Logging library
import consola from "consola";

// Grommet UI components
import { Box, Heading, Layer, Spinner, WorldMap } from "grommet";

/**
 * @summary Generate a 'Loading' screen presenting a loading indicator and text based on the current state
 * @param {Props.Screens.Loading} props Component props containing:
 *  - state: {"matchingIntentions" | "matchingCyberball" | "social" | "default"} The loading state to display
 *  - runComputeSetup?: {boolean} Flag indicating whether to setup the compute instance
 *  - runComputeOperation?: {boolean} Flag indicating whether to compute participant and partner parameters
 *  - handler?: {(participantParams: ModelParameters, partnerParams: ModelParameters) => void} Callback to handle model parameters
 * @return {ReactElement} 'Loading' screen with loading indicator and state-specific status message
 */
const Loading: FC<Props.Screens.Loading> = (
  props: Props.Screens.Loading
): ReactElement => {
  const experiment = window.Experiment;

  // Get the appropriate text based on the loading type
  const getLoadingText = (): string => {
    switch (props.state) {
      case "matchingIntentions":
        return "Finding you a partner...";
      case "matchingCyberball":
        return "Finding you partners...";
      case "social":
        return "Generating relative social standing...";
      case "default":
        return "Experiment Loading...";
      default:
        return "Experiment Loading...";
    }
  };

  const callback = (data: ModelResponse) => {
    // Parse and store the JSON content
    try {
      // Extract the response data of interest
      // Participant data
      const participantParameters = data.participantParameters;

      // Partner data
      const partnerParameters = data.partnerParameters;
      const partnerChoices = data.partnerChoices;

      // Check the specification of the data first, require exactly 54 trials
      if (partnerChoices.length > 0) {
        // Store the partner choices
        experiment.getState().set("partnerChoices", partnerChoices);

        // Store parameters
        if (props.handler) {
          props.handler(participantParameters, partnerParameters);
        }
      } else {
        consola.warn(`Phase data appears to be incomplete`);

        // If we have an error, we need to end the game
        experiment.invokeError(new Error("Incomplete response from server"));
      }
    } catch (error) {
      consola.warn(`Error occurred when extracting content:`, error);

      // If we have an error, we need to end the game
      experiment.invokeError(new Error("Error extracting content"));
    }
  };

  const runComputeSetup = async () => {
    await window.Compute.setup();
    consola.success("Compute setup complete");
  };

  const runComputeOperation = async () => {
    // Collate data from 'playerChoice' trials
    consola.info(`Collating data...`);
    const dataCollection = jsPsych.data
      .get()
      .filter({
        display: "playerChoice",
      })
      .values();

    consola.debug(
      `'dataCollection' containing trials with 'display' = 'playerChoice':`,
      dataCollection
    );

    // Format the responses to be sent to the server
    const requestResponses = [];
    for (const row of dataCollection) {
      requestResponses.push({
        ID: "NA",
        Trial: row.trial,
        ppt1: row.playerPoints_option1,
        par1: row.partnerPoints_option1,
        ppt2: row.playerPoints_option2,
        par2: row.partnerPoints_option2,
        Ac: row.selectedOption_player,
        Phase: 1,
      });
    }
    consola.debug(`Request content 'requestResponses':`, requestResponses);

    // Launch model computation
    consola.info(`Requesting partner...`);
    await window.Compute.submit(requestResponses, callback);
  };

  // Run any computing operations as specified
  useEffect(() => {
    if (props.runComputeOperation && window.Compute.isReady()) {
      runComputeOperation();
    } else if (props.runComputeSetup) {
      runComputeSetup();
    }
  }, []);

  return (
    <>
      <WorldMap color="map" fill="horizontal" />
      <Layer plain full>
        <Box justify="center" align="center" gap="small" fill>
          <Heading level="1" fill>
            {getLoadingText()}
          </Heading>
          <Spinner size="large" color="avatarBackground" />
        </Box>
      </Layer>
    </>
  );
};

export default Loading;
