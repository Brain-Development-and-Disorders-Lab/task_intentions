/**
 * @file 'Option' component containing a set of points to split between the
 * participant and their partner. Consists of a heading row and a row
 * containing the points.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement } from "react";

// Grommet UI components
import { Grid, Heading } from "grommet";

/**
 * @summary Generate an 'Option' component that displays a grid of points to split between participant and partner
 * @param {Props.Components.Option} props component props containing:
 *  - optionKey: {string} Unique identifier for the option
 *  - pointsParticipant: {number} Points allocated to the participant
 *  - pointsPartner: {number} Points allocated to the partner
 * @return {ReactElement} 'Option' component with points arranged in a 2x2 grid
 */
const Option: FC<Props.Components.Option> = (
  props: Props.Components.Option
): ReactElement => {
  return (
    <Grid
      id={props.optionKey}
      rows={["1/2", "1/2"]}
      columns={["1/2", "1/2"]}
      fill
      pad="xsmall"
      align="center"
      areas={[
        { name: "participantHeader", start: [0, 0], end: [0, 0] },
        { name: "partnerHeader", start: [1, 0], end: [1, 0] },
        { name: "participantPoints", start: [0, 1], end: [0, 1] },
        { name: "partnerPoints", start: [1, 1], end: [1, 1] },
      ]}
    >
      {/* Participant header */}
      <Heading level={2} size="auto" gridArea="participantHeader">
        &nbsp;&nbsp;Points for&nbsp;&nbsp;
        <br />
        you
      </Heading>

      {/* Partner header */}
      <Heading level={2} size="auto" gridArea="partnerHeader">
        &nbsp;&nbsp;Points for&nbsp;&nbsp;
        <br />
        your partner
      </Heading>

      {/* Participant points */}
      <Heading level={2} gridArea="participantPoints">
        <b>+{props.pointsParticipant}</b>
      </Heading>

      {/* Partner points */}
      <Heading level={2} gridArea="partnerPoints">
        <b>+{props.pointsPartner}</b>
      </Heading>
    </Grid>
  );
};

export default Option;
