/**
 * @file `Status` screen for collecting social status information.
 *
 * This screen collects participants' social status information using
 * numeric inputs and rating scales. Key features include:
 * - Two-page questionnaire design
 * - Numeric input fields for social media metrics
 * - Slider interface for social closeness rating
 * - Response validation before proceeding
 * - Support for both standard and alternate input modes
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useState } from "react";

// Grommet UI components
import { Box, Button, Keyboard, Paragraph, TextInput } from "grommet";
import { LinkNext } from "grommet-icons";

// Custom components
import Slider from "src/view/components/Slider";

// Experiment configuration
import { Configuration } from "src/configuration";

// Keyboard input bindings
import { BINDINGS } from "src/bindings";

// Constants
const SLIDER_DEFAULT = 50;

/**
 * @summary Generate a 'Status' screen component with two pages for collecting social status information
 * @param {Props.Screens.Status} props Component props containing:
 *  - handler: {(followers: number, averageLikes: number, friends: number, socialCloseness: number) => void} Callback function when participant continues
 * @return {ReactElement} 'Status' screen with two pages of questions
 */
const Status: FC<Props.Screens.Status> = (
  props: Props.Screens.Status
): ReactElement => {
  // Page state
  const [currentPage, setCurrentPage] = useState(1);

  // Page 1 states (numeric inputs)
  const [followers, setFollowers] = useState("");
  const [averageLikes, setAverageLikes] = useState("");

  // Page 2 states (numeric input + slider)
  const [friends, setFriends] = useState("");
  const [socialClosenessMoved, setSocialClosenessMoved] = useState(false);
  const [socialClosenessValue, setSocialClosenessValue] =
    useState(SLIDER_DEFAULT);

  // Selected UI element (used for alternate input)
  const [selectedElementIndex, setSelectedElementIndex] = useState(0);
  const [elementFocused, setElementFocused] = useState(false);

  /**
   * Handle keyboard input from user interaction
   * @param {React.KeyboardEvent<HTMLElement>} event Keyboard input event
   */
  const inputHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    // Disable keyboard input if not enabled in configuration
    if (Configuration.manipulations.useButtonInput === false) return;

    // Avoid holding the key down if no element focused
    if (elementFocused === false && event.repeat) return;
    event.preventDefault();

    if (
      event.key.toString() === BINDINGS.NEXT ||
      event.key.toString() === BINDINGS.PREVIOUS
    ) {
      if (elementFocused === true) {
        if (currentPage === 1) {
          // Page 1: Handle numeric input navigation
          if (selectedElementIndex === 0) {
            // Followers input - handle numeric input
            if (event.key.toString() === BINDINGS.NEXT) {
              const currentValue = parseInt(followers) || 0;
              setFollowers((currentValue + 1).toString());
            } else if (event.key.toString() === BINDINGS.PREVIOUS) {
              const currentValue = parseInt(followers) || 0;
              setFollowers(Math.max(0, currentValue - 1).toString());
            }
          } else if (selectedElementIndex === 1) {
            // Average likes input - handle numeric input
            if (event.key.toString() === BINDINGS.NEXT) {
              const currentValue = parseInt(averageLikes) || 0;
              setAverageLikes((currentValue + 1).toString());
            } else if (event.key.toString() === BINDINGS.PREVIOUS) {
              const currentValue = parseInt(averageLikes) || 0;
              setAverageLikes(Math.max(0, currentValue - 1).toString());
            }
          }
        } else if (currentPage === 2) {
          // Page 2: Handle numeric input and slider
          if (selectedElementIndex === 0) {
            // Friends input - handle numeric input
            if (event.key.toString() === BINDINGS.NEXT) {
              const currentValue = parseInt(friends) || 0;
              setFriends((currentValue + 1).toString());
            } else if (event.key.toString() === BINDINGS.PREVIOUS) {
              const currentValue = parseInt(friends) || 0;
              setFriends(Math.max(0, currentValue - 1).toString());
            }
          } else if (selectedElementIndex === 1) {
            // Social closeness slider
            if (event.key.toString() === BINDINGS.NEXT) {
              setSocialClosenessValue(
                socialClosenessValue + 1 <= 100 ? socialClosenessValue + 1 : 100
              );
            } else if (event.key.toString() === BINDINGS.PREVIOUS) {
              setSocialClosenessValue(
                socialClosenessValue - 1 >= 0 ? socialClosenessValue - 1 : 0
              );
            }
            setSocialClosenessMoved(true);
          }
        }
      } else {
        // Navigate between elements
        const maxElements = currentPage === 1 ? 3 : 3; // 2 inputs + continue button on each page
        if (event.key.toString() === BINDINGS.NEXT) {
          setSelectedElementIndex(
            selectedElementIndex + 1 < maxElements
              ? selectedElementIndex + 1
              : maxElements - 1
          );
        } else if (event.key.toString() === BINDINGS.PREVIOUS) {
          setSelectedElementIndex(
            selectedElementIndex - 1 >= 0 ? selectedElementIndex - 1 : 0
          );
        }
      }
    } else if (event.key.toString() === BINDINGS.SELECT) {
      if (currentPage === 1) {
        if (selectedElementIndex !== 2) {
          // Focus or unfocus inputs
          setElementFocused(!elementFocused);
        } else {
          // Continue to page 2 if both inputs have values
          if (followers.trim() !== "" && averageLikes.trim() !== "") {
            setCurrentPage(2);
            setSelectedElementIndex(0);
            setElementFocused(false);
          }
        }
      } else if (currentPage === 2) {
        if (selectedElementIndex !== 2) {
          // Focus or unfocus inputs
          setElementFocused(!elementFocused);
        } else {
          // Submit all data if all inputs have values
          if (friends.trim() !== "" && socialClosenessMoved === true) {
            props.handler(
              parseInt(followers) || 0,
              parseInt(averageLikes) || 0,
              parseInt(friends) || 0,
              socialClosenessValue
            );
          }
        }
      }
    }
  };

  // Render page 1
  if (currentPage === 1) {
    return (
      <Keyboard onKeyDown={inputHandler} target={"document"}>
        <Box
          justify={"center"}
          align={"center"}
          gap={"small"}
          style={{ maxWidth: "50%", margin: "auto" }}
          animation={["fadeIn"]}
        >
          <Paragraph margin="small" size="large" fill>
            Please answer the following questions about your social media usage.
          </Paragraph>

          {/* Followers question */}
          <Paragraph margin="small" size="large" fill>
            Followers?
          </Paragraph>
          <Box
            pad={"xsmall"}
            border={{
              color:
                Configuration.manipulations.useButtonInput === true &&
                selectedElementIndex === 0 &&
                !elementFocused
                  ? "selectedElement"
                  : "transparent",
              size: "large",
            }}
            round
          >
            <TextInput
              type="number"
              value={followers}
              onChange={event => setFollowers(event.target.value)}
              placeholder="Enter number"
              style={{ textAlign: "center" }}
            />
          </Box>

          {/* Average likes question */}
          <Paragraph margin="small" size="large" fill>
            Average Likes?
          </Paragraph>
          <Box
            pad={"xsmall"}
            border={{
              color:
                Configuration.manipulations.useButtonInput === true &&
                selectedElementIndex === 1 &&
                !elementFocused
                  ? "selectedElement"
                  : "transparent",
              size: "large",
            }}
            round
          >
            <TextInput
              type="number"
              value={averageLikes}
              onChange={event => setAverageLikes(event.target.value)}
              placeholder="Enter number"
              style={{ textAlign: "center" }}
            />
          </Box>

          {/* Continue button */}
          <Box
            margin={"none"}
            pad={"none"}
            border={{
              color:
                Configuration.manipulations.useButtonInput === true &&
                selectedElementIndex === 2
                  ? "selectedElement"
                  : "transparent",
              size: "large",
            }}
            style={
              Configuration.manipulations.useButtonInput === true &&
              selectedElementIndex === 2
                ? { borderRadius: "36px " }
                : {}
            }
            round
          >
            <Button
              primary
              color="button"
              label="Continue"
              disabled={
                // Disabled until both inputs have values
                followers.trim() === "" || averageLikes.trim() === ""
              }
              icon={<LinkNext />}
              reverse
              onClick={() => {
                setCurrentPage(2);
                setSelectedElementIndex(0);
                setElementFocused(false);
              }}
            />
          </Box>
        </Box>
      </Keyboard>
    );
  }

  // Render page 2
  return (
    <Keyboard onKeyDown={inputHandler} target={"document"}>
      <Box
        justify={"center"}
        align={"center"}
        gap={"small"}
        style={{ maxWidth: "50%", margin: "auto" }}
        animation={["fadeIn"]}
      >
        <Paragraph margin="small" size="large" fill>
          Please answer the following questions about your social relationships.
        </Paragraph>

        {/* Friends question */}
        <Paragraph margin="small" size="large" fill>
          No. of friends?
        </Paragraph>
        <Box
          pad={"xsmall"}
          border={{
            color:
              Configuration.manipulations.useButtonInput === true &&
              selectedElementIndex === 0 &&
              !elementFocused
                ? "selectedElement"
                : "transparent",
            size: "large",
          }}
          round
        >
          <TextInput
            type="number"
            value={friends}
            onChange={event => setFriends(event.target.value)}
            placeholder="Enter number"
            style={{ textAlign: "center" }}
          />
        </Box>

        {/* Social closeness question */}
        <Paragraph margin="small" size="large" fill>
          Social closeness?
        </Paragraph>
        <Box
          pad={"xsmall"}
          border={{
            color:
              Configuration.manipulations.useButtonInput === true &&
              selectedElementIndex === 1 &&
              !elementFocused
                ? "selectedElement"
                : "transparent",
            size: "large",
          }}
          round
        >
          <Slider
            min={0}
            max={100}
            value={socialClosenessValue}
            setValue={setSocialClosenessValue}
            leftLabel="Not close"
            rightLabel="Very close"
            onChange={() => {
              setSocialClosenessMoved(true);
            }}
            isFocused={selectedElementIndex === 1 && elementFocused}
          />
        </Box>

        {/* Submit button */}
        <Box
          margin={"none"}
          pad={"none"}
          border={{
            color:
              Configuration.manipulations.useButtonInput === true &&
              selectedElementIndex === 2
                ? "selectedElement"
                : "transparent",
            size: "large",
          }}
          style={
            Configuration.manipulations.useButtonInput === true &&
            selectedElementIndex === 2
              ? { borderRadius: "36px " }
              : {}
          }
          round
        >
          <Button
            primary
            color="button"
            label="Submit"
            disabled={
              // Disabled until both inputs have values
              friends.trim() === "" || socialClosenessMoved === false
            }
            icon={<LinkNext />}
            reverse
            onClick={() => {
              props.handler(
                parseInt(followers) || 0,
                parseInt(averageLikes) || 0,
                parseInt(friends) || 0,
                socialClosenessValue
              );
            }}
          />
        </Box>
      </Box>
    </Keyboard>
  );
};

export default Status;
