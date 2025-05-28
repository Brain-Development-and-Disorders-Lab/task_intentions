/**
 * @file `Wrapper` component for experiment screen management.
 *
 * This component serves as the root container for all experiment screens,
 * providing consistent theming and layout structure. Key features include:
 * - Global theme application through Grommet
 * - Theme context extension for custom styling
 * - Screen type-based component rendering
 * - Consistent layout and styling across all screens
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useEffect, useState } from "react";

// Grommet component
import { Grommet, ThemeContext } from "grommet";

// Import styling
import "src/scss/styles.scss";

// Apply custom theme globally
import { Theme } from "src/theme";

// Screens used throughout the task
import Agency from "../../screens/Agency";
import Trial from "../../screens/Trial";
import Inference from "../../screens/Inference";
import Classification from "../../screens/Classification";
import SelectAvatar from "../../screens/SelectAvatar";
import Matched from "../../screens/Matched";
import Matching from "../../screens/Matching";
import End from "../../screens/End";
import Summary from "../../screens/Summary";

/**
 * @summary Generate a 'Wrapper' component that acts as a container for all React screens and components,
 * providing Grommet theming and styling context
 * @param {Props.Components.Wrapper} props Props containing:
 *  - display: {string} The current screen to display
 *  - props: {Props.Screens.Trial | Props.Screens.Inference | Props.Screens.Classification |
 *           Props.Screens.SelectAvatar | Props.Screens.Matched | Props.Screens.Matching |
 *           Props.Screens.End | Props.Screens.Summary} Props for the child screen component
 * @return {ReactElement} 'Wrapper' component containing the themed child screen
 */
const Wrapper: FC<Props.Components.Wrapper> = (
  props: Props.Components.Wrapper
): ReactElement => {
  const [activeDisplay, setActiveDisplay] = useState(props.display);

  useEffect(() => {
    if (activeDisplay !== props.display) {
      setActiveDisplay(props.display);
    }
  }, [props.display]);

  // Return a styled Grommet instance with the global theme extension
  return (
    <Grommet
      full="min"
      style={{
        // Dimensions
        minHeight: "70vh",
        minWidth: "70vw",
        // Flex properties
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // Overflow
        overflow: "hidden",
      }}
    >
      <ThemeContext.Extend value={Theme}>
        {/* Trial stages */}
        {activeDisplay === "playerChoice" && (
          <Trial {...(props.props as Props.Screens.Trial)} />
        )}
        {activeDisplay === "playerChoicePractice" && (
          <Trial {...(props.props as Props.Screens.Trial)} />
        )}
        {activeDisplay === "playerGuess" && (
          <Trial {...(props.props as Props.Screens.Trial)} />
        )}
        {activeDisplay === "playerGuessPractice" && (
          <Trial {...(props.props as Props.Screens.Trial)} />
        )}
        {activeDisplay === "playerChoice2" && (
          <Trial {...(props.props as Props.Screens.Trial)} />
        )}

        {/* Inference trials */}
        {activeDisplay === "inference" && (
          <Inference {...(props.props as Props.Screens.Inference)} />
        )}

        {/* Agency questions */}
        {activeDisplay === "agency" && (
          <Agency {...(props.props as Props.Screens.Agency)} />
        )}

        {activeDisplay === "classification" && (
          <Classification {...(props.props as Props.Screens.Classification)} />
        )}

        {activeDisplay === "selection" && (
          <SelectAvatar {...(props.props as Props.Screens.SelectAvatar)} />
        )}

        {activeDisplay === "matched" && <Matched />}

        {activeDisplay === "matching" && (
          <Matching {...(props.props as Props.Screens.Matching)} />
        )}

        {activeDisplay === "summary" && (
          <Summary {...(props.props as Props.Screens.Summary)} />
        )}

        {activeDisplay === "end" && <End />}
      </ThemeContext.Extend>
    </Grommet>
  );
};

export default Wrapper;
