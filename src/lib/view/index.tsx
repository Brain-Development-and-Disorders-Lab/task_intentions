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
   * @param {ScreenProps} props collection of props for that specific
   * screen
   * @param {HTMLElement} target target DOM element
   */
  public display(
    type: Display,
    props: ScreenProps,
    target: HTMLElement
  ): void {
    // Render the 'Wrapper' component
    render(<Wrapper display={type} props={props.props} />, target);

    // Setup a timeout to execute the callback
    if (props.duration > 0) {
      setTimeout(() => {
        props.callback();
      }, props.duration);
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
