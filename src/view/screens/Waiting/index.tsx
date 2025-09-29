/**
 * @file `Waiting` screen for pre-phase pauses (facilitator or MRI trigger).
 *
 * This screen visually matches the Matching screen, but displays configurable text
 * and waits for a specific keypress to continue. Used before each phase.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

import React, { FC, ReactElement, useEffect } from "react";
import { Box, Heading, Layer, WorldMap, Paragraph } from "grommet";
import consola from "consola";
import { BINDINGS } from "src/bindings";

const Waiting: FC<Screens.Waiting> = (
  props: Screens.Waiting
): ReactElement => {
  useEffect(() => {
    const keyListener = (event: KeyboardEvent) => {
      if (props.mode === "facilitator" && event.key === BINDINGS.CONTINUE) {
        consola.info("Facilitator trigger detected");
        props.handler();
      } else if (props.mode === "mri" && event.key === BINDINGS.SIGNAL) {
        consola.info("MRI trigger detected");
        props.handler();
      }
    };
    window.addEventListener("keydown", keyListener);
    return () => window.removeEventListener("keydown", keyListener);
  }, [props, props.mode, props.handler]);

  let mainText = "";
  let subText: string | null = null;
  if (props.mode === "facilitator") {
    mainText = "Pausing for a brief break";
    subText = `Facilitator: Press "${BINDINGS.CONTINUE}" to continue.`;
  } else if (props.mode === "mri") {
    mainText = "The next section will begin soon";
    subText = null;
  }

  return (
    <>
      <WorldMap color="map" fill="horizontal" />
      <Layer plain full>
        <Box justify="center" align="center" gap="small" fill>
          <Heading level="1" fill>
            {mainText}
          </Heading>
          {subText && (
            <Paragraph size="large" fill>
              {subText}
            </Paragraph>
          )}
        </Box>
      </Layer>
    </>
  );
};

export default Waiting;
