/**
 * @file `View` class implementation for managing React-based experiment screens.
 *
 * This class provides a unified interface for rendering and managing React
 * components within the experiment. Key responsibilities include:
 * - Screen rendering and component mounting
 * - Component cleanup and unmounting
 * - Integration with the experiment timeline
 * - Support for different screen types (practice, experimental, etc.)
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React from "react";
import { createRoot, Root } from "react-dom/client";

// Foundational 'Wrapper' component
import Wrapper from "src/view/components/Wrapper";

/**
 * @summary 'View' class to abstract the display and clean-up of React-based screens
 * used in the game
 */
class View {
  // This is the element containing the jsPsych target
  private target: HTMLElement;
  private root: Root;

  /**
   * Constructor for the View class
   * @param {HTMLElement} target the target HTML element
   * @constructor
   */
  constructor(target: HTMLElement) {
    this.target = target;
    this.root = createRoot(target);
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
   */
  public display(type: Display, props: ScreenProps): void {
    // Render the 'Wrapper' component
    this.root.render(<Wrapper display={type} props={props.props} />);

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
    this.root.unmount();
  }
}

export default View;
