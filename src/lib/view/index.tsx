/**
 * @file 'View' class to abstract the display and clean-up of React-based screens
 * used in the game.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React from "react";
import ReactDOM, { render } from "react-dom";

// Foundational 'Wrapper' component
import Wrapper from "src/lib/view/components/Wrapper";

/**
 * @summary 'View' class to abstract the display and clean-up of React-based screens
 * used in the game
 */
class View {
  // This is the element containing the jsPsych target
  private target: HTMLElement;

  /**
   * Default constructor
   * @param {HTMLElement} target the target HTML element
   * @class
   */
  constructor(target: HTMLElement) {
    this.target = target;
  }

  /**
   * Get the target HTML element
   * @return {HTMLElement}
   */
  public getTarget(): HTMLElement {
    return this.target;
  }

  /**
   * Switch between different screens
   * @param {Display} type the type of screen to display
   * @param {ScreenProps} propData collection of props for that specific
   * screen
   * @param {HTMLElement} target target DOM element
   */
  public display(
    type: Display,
    propData: ScreenProps,
    target: HTMLElement
  ): void {
    // Render the 'Wrapper' component
    render(<Wrapper display={type} screen={propData.props} />, target);

    // Setup a timeout to execute the callback
    if (propData.duration > 0) {
      setTimeout(() => {
        propData.callback();
      }, propData.duration);
    }
  }

  /**
   * Unmount a React instance from the target element
   */
  public unmount(): void {
    ReactDOM.unmountComponentAtNode(this.target);
  }
}

export default View;
