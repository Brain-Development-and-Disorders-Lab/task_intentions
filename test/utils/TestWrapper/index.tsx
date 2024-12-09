/**
 * @file 'TestWrapper' component re-implementing the 'Wrapper' component but
 * for the React testing utilities.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC } from "react";

// Grommet UI components
import { Grommet, ThemeContext } from "grommet";

// Custom theming
import { Theme } from "src/lib/theme";

// Define the 'Wrapper' UI component
const TestWrapper: FC = ({ children }) => {
  return (
    <Grommet>
      <ThemeContext.Extend value={Theme}>{children}</ThemeContext.Extend>
    </Grommet>
  );
};

export default TestWrapper;
