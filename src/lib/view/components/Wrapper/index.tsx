/**
 * @file 'Wrapper' component acting as a container for all React screens and
 * components displayed throughout the game. Grommet and Themecontext.Extend
 * components enclose the child screen generated using the `ScreenFactory`
 * class.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement } from "react";

// Grommet component
import { Grommet, ThemeContext } from "grommet";

// Import styling
import "src/scss/styles.scss";

// Apply custom theme globally
import { Theme } from "src/lib/theme";

// Factory class to generate screens
import ScreenFactory from "src/lib/classes/factories/ScreenFactory";

/**
 * @summary Generate a 'Wrapper' component
 * @param {Props.Components.Wrapper} props collection of props for the primary
 * child component
 * @return {ReactElement} 'Wrapper' component
 */
const Wrapper: FC<Props.Components.Wrapper> = (
  props: Props.Components.Wrapper
): ReactElement => {
  // Create a new 'ScreenFactory' instance
  const screenFactory = new ScreenFactory();

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
        {screenFactory.generate(props)}
      </ThemeContext.Extend>
    </Grommet>
  );
};

export default Wrapper;
