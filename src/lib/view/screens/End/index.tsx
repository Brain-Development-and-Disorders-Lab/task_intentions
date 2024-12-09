/**
 * @file 'End' screen notifying the participant that they have reached the end
 * of the game.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement } from "react";

// Grommet UI components
import { Box, Heading, Layer, Paragraph, WorldMap } from "grommet";

/**
 * @summary Generate a 'End' screen containing text to inform the participant
 * they have completed the game.
 * @return {ReactElement} 'End' screen
 */
const End: FC = (): ReactElement => {
  return (
    <>
      {/* WorldMap background */}
      <WorldMap color="map" fill="horizontal" />
      <Layer plain full>
        <Box justify="center" align="center" gap="small" fill>
          <Heading level="1" fill>
            Game finished!
          </Heading>
          <Paragraph margin="small" size="large" fill>
            Thank you for participating in this research.
          </Paragraph>
          <Paragraph margin="small" size="large" fill>
            You will be redirected in 5 seconds.
          </Paragraph>
        </Box>
      </Layer>
    </>
  );
};

export default End;
