/**
 * @file 'Matching' screen presenting a loading indicator and describing to
 * the participant that a matching process is taking place. Overall duration
 * of the screen is between 3 and 7 seconds. If the `props.fetchData` flag is
 * `true`, a `Compute` instance will collate data from the 'playerChoice'phase
 * before attempting to communicate with a remote server.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement } from "react";

// Logging library
import consola from "consola";

// Grommet UI components
import { Box, Heading, Layer, Spinner, WorldMap } from "grommet";

// Request library
import Compute from "src/lib/classes/Compute";

// Configuration
import { Configuration } from "src/configuration";

/**
 * @summary Generate a 'Matching' screen presenting a loading indicator and
 * text describing a matching process taking place. Fetches data in the
 * background if specified.
 * @param {Props.Screens.Matching} props collection of props
 * @return {ReactElement} 'Matching' screen
 */
const Matching: FC<Props.Screens.Matching> = (
  props: Props.Screens.Matching
): ReactElement => {
  const experiment = window.Experiment;

  // Launch request
  if (props.fetchData) {
    // Setup a new 'Compute' instance with the configured endpoint URL
    const compute = new Compute(Configuration.endpoint);

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

    // Launch request to endpoint
    consola.info(`Requesting partner...`);
    compute.submit(
      // Request data
      {
        participantID: experiment.getState().get("participantID"),
        participantResponses: requestResponses,
      },
      // Response callback
      (data: {
        participantID: string;
        participantParameters: number[];
        partnerParameters: number[];
        partnerChoices: {
          ppt1: number;
          par1: number;
          ppt2: number;
          par2: number;
          Ac: number;
        }[];
      }) => {
        consola.info("Data:", data);
        // Parse and store the JSON content
        try {
          // Extract the response data of interest
          // Participant data
          const participantID = data.participantID;
          const participantParameters = data.participantParameters;

          // Partner data
          const partnerParameters = data.partnerParameters;
          const partnerChoices = data.partnerChoices;

          // Check the specification of the data first, require exactly 54 trials
          if (partnerChoices.length > 0) {
            // Store the partner choices
            experiment.getState().set("partnerChoices", partnerChoices);

            consola.success(`Generated new partner for ID:`, participantID);

            // Store parameters
            props.handler(participantParameters, partnerParameters);
          } else {
            consola.warn(`Phase data appears to be incomplete`);

            // If we have an error, we need to end the game
            experiment.invokeError(
              new Error("Incomplete response from server")
            );
          }
        } catch (error) {
          consola.warn(`Error occurred when extracting content:`, error);

          // If we have an error, we need to end the game
          experiment.invokeError(new Error("Error extracting content"));
        }
      },
      (error) => {
        // If we have an error, we need to end the game
        experiment.invokeError(error);
      }
    );
  }

  return (
    <>
      <WorldMap color="map" fill="horizontal" />
      <Layer plain full>
        <Box justify="center" align="center" gap="small" fill>
          <Heading level="1" fill>
            Finding you a partner...
          </Heading>
          <Spinner size="large" color="avatarBackground" />
        </Box>
      </Layer>
    </>
  );
};

export default Matching;
