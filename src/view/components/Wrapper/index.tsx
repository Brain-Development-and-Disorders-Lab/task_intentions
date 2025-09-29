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
import Agency from "../../screens/Questionnaires/Agency";
import Trial from "../../screens/Trial";
import Inference from "../../screens/Questionnaires/Inference";
import Classification from "../../screens/Questionnaires/Classification";
import SelectAvatar from "../../screens/SelectAvatar";
import Status from "../../screens/Questionnaires/Status";
import DASS from "../../screens/Questionnaires/DASS";
import Screentime from "../../screens/Questionnaires/Screentime";
import Demographics from "../../screens/Questionnaires/Demographics";
import Loading from "../../screens/Loading";
import Loaded from "../../screens/Loaded";
import StatusPreview from "src/view/screens/StatusPreview";
import Waiting from "../../screens/Waiting";
import End from "../../screens/End";
import Resources from "../../screens/Resources";
import Summary from "../../screens/Summary";
import Cyberball from "../../screens/Cyberball";

/**
 * @summary Generate a 'Wrapper' component that acts as a container for all React screens and components,
 * providing Grommet theming and styling context
 * @param {Components.Wrapper} props Props containing:
 *  - display: {string} The current screen to display
 *  - props: {Screens.Trial | Screens.Inference | Screens.Classification |
 *           Screens.SelectAvatar | Screens.Loaded | Screens.Matching |
 *           Screens.End | Screens.Summary} Props for the child screen component
 * @return {ReactElement} 'Wrapper' component containing the themed child screen
 */
const Wrapper: FC<Components.Wrapper> = (
  props: Components.Wrapper
): ReactElement => {
  const [display, setDisplay] = useState(props.display);

  useEffect(() => {
    if (display !== props.display) {
      setDisplay(props.display);
    }
  }, [props.display, display]);

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
        {display === "playerChoice" && (
          <Trial {...props.props as Screens.Trial} />
        )}
        {display === "playerChoicePractice" && (
          <Trial {...props.props as Screens.Trial} />
        )}
        {display === "playerGuess" && (
          <Trial {...props.props as Screens.Trial} />
        )}
        {display === "playerGuessPractice" && (
          <Trial {...props.props as Screens.Trial} />
        )}
        {display === "playerChoice2" && (
          <Trial {...props.props as Screens.Trial} />
        )}

        {/* Inference trials */}
        {display === "inference" && (
          <Inference {...props.props as Screens.Inference} />
        )}

        {/* Agency questions */}
        {display === "agency" && (
          <Agency {...props.props as Screens.Agency} />
        )}

        {/* Status questions */}
        {display === "status" && (
          <Status {...props.props as Screens.Status} />
        )}

        {/* DASS questionnaire */}
        {display === "dass" && (
          <DASS {...props.props as Screens.DASS} />
        )}

        {/* Screentime questionnaire */}
        {display === "screentime" && (
          <Screentime {...props.props as Screens.Screentime} />
        )}

        {/* Demographics questionnaire */}
        {display === "demographics" && (
          <Demographics {...props.props as Screens.Demographics} />
        )}

        {/* Classification questionnaire */}
        {display === "classification" && (
          <Classification {...props.props as Screens.Classification} />
        )}

        {/* Avatar selection */}
        {display === "selection" && (
          <SelectAvatar {...props.props as Screens.SelectAvatar} />
        )}

        {/* Loaded screen */}
        {display === "loaded" && (
          <Loaded {...props.props as Screens.Loaded} />
        )}

        {/* Status preview screen */}
        {display === "statusPreview" && (
          <StatusPreview {...props.props as Screens.StatusPreview} />
        )}

        {/* Loading screen */}
        {display === "loading" && (
          <Loading {...props.props as Screens.Loading} />
        )}

        {/* Summary screen */}
        {display === "summary" && (
          <Summary {...props.props as Screens.Summary} />
        )}

        {/* Waiting screen */}
        {display === "waiting" && (
          <Waiting {...props.props as Screens.Waiting} />
        )}

        {/* Cyberball screen */}
        {display === "cyberball" && (
          <Cyberball {...props.props as Screens.Cyberball} />
        )}

        {display === "resources" && (
          <Resources {...props.props as Screens.Resources} />
        )}

        {display === "end" && <End />}
      </ThemeContext.Extend>
    </Grommet>
  );
};

export default Wrapper;
