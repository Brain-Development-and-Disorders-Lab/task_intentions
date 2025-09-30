/**
 * @file `Cyberball` screen for social exclusion paradigm.
 *
 * This screen implements the classic Cyberball paradigm where participants
 * play a virtual ball-tossing game that operates in either inclusive or
 * exclusive mode for the full duration. Key features include:
 * - Realistic ball-tossing animations
 * - Configurable game parameters
 * - Single mode operation (inclusive or exclusive)
 * - Data collection for social exclusion research
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useRef, useReducer, useState } from "react";

// Components
import { Box, Text } from "grommet";
import Avatar from "boring-neutral-avatars";

// Configuration
import { Configuration } from "src/configuration";

/**
 * Cyberball screen component that implements the social exclusion paradigm
 * @component
 * @param {Screens.Cyberball} props Component props
 * @param {(tossCount: number, participantTossCount: number, participantCatchCount: number) => void} props.handler Callback function when game completes
 * @returns {ReactElement} Cyberball game screen
 */
const Cyberball: FC<Screens.Cyberball> = (
  props: Screens.Cyberball
): ReactElement => {
  // Access the experiment instance
  const experiment = window.Experiment;

  // Game state
  const gameState = useRef<CyberballGameState>({
    ballOwner: "participant" as "participant" | "partnerA" | "partnerB",
    canToss: true,
    tossCount: 0,
    participantTossCount: 0,
    participantCatchCount: 0,
    partnerATossCount: 0,
    partnerBTossCount: 0,
  });

  // Animation state
  const animationState = useRef({
    isAnimating: false,
    ballX: Configuration.cyberball.ballPositions.participant.x,
    ballY: Configuration.cyberball.ballPositions.participant.y,
  });

  // Generate the strings to determine the participant and partner statuses
  const participantStatus = experiment.getState().get("participantDefaultStatus");
  const partnerStatus = props.isCyberballPartnerHighStatus ? experiment.getState().get("partnerCyberballHighStatus") : experiment.getState().get("partnerCyberballLowStatus");

  // Force re-render mechanism
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  // Game completion state
  const [isGameFinished, setIsGameFinished] = useState(false);

  // Configuration
  const participantAvatarIndex = Configuration.state.participantAvatar;

  // Partner IDs (generated once after the loading screen)
  const partnerAID = experiment.getState().get("cyberballPartnerAID");
  const partnerBID = experiment.getState().get("cyberballPartnerBID");

  // Player positions (static)
  const positions = {
    participant: {
      ...Configuration.cyberball.positions.participant,
      avatar: participantAvatarIndex,
    },
    partnerA: {
      ...Configuration.cyberball.positions.partnerA,
      avatar: 0,
    },
    partnerB: {
      ...Configuration.cyberball.positions.partnerB,
      avatar: 1,
    },
  };

  /**
   * Handle when someone receives the ball from a toss, update game state and check completion
   * @param receiver Who received the ball
   */
  const onBallReceived = (sender: "participant" | "partnerA" | "partnerB", receiver: "participant" | "partnerA" | "partnerB") => {
    gameState.current.ballOwner = receiver;
    gameState.current.tossCount = gameState.current.tossCount + 1;

    // Update toss counts
    if (sender === "participant") {
      gameState.current.participantTossCount = gameState.current.participantTossCount + 1;
    } else if (sender === "partnerA") {
      gameState.current.partnerATossCount = gameState.current.partnerATossCount + 1;
    } else {
      gameState.current.partnerBTossCount = gameState.current.partnerBTossCount + 1;
    }

    // Update catch counts
    if (receiver === "participant") {
      gameState.current.participantCatchCount = gameState.current.participantCatchCount + 1;
    }

    // Update `canToss` state
    gameState.current.canToss = receiver === "participant";

    // Update animation status
    animationState.current.isAnimating = false;

    // Force re-render to update game state
    forceUpdate();

    // Check if game is complete
    if (gameState.current.tossCount >= Configuration.cyberball.totalTosses) {
      setIsGameFinished(true);
      gameState.current.canToss = false;
      setTimeout(() => {
        props.handler(gameState.current.tossCount, gameState.current.participantTossCount, gameState.current.participantCatchCount);
      }, 3000);
    } else {
      if (receiver !== "participant") {
        setTimeout(() => {
          handlePartnerResponse(receiver);
        }, Configuration.cyberball.tossInterval);
      }
    }
  };

  /**
   * Animate the ball between two positions
   * @param from Starting position
   * @param to Ending position
   * @param onComplete Callback when animation completes
   */
  const animateBall = (from: { x: number; y: number }, to: { x: number; y: number }, onComplete: () => void) => {
    const startTime = Date.now();
    const duration = 600;

    // Animate function
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const arcHeight = 80;
      const arcProgress = 4 * progress * (1 - progress);

      // Calculate new position
      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress - arcHeight * arcProgress;

      // Update animation state ref
      Object.assign(animationState.current, { ballX: x, ballY: y, isAnimating: true });

      // Force re-render for animation
      forceUpdate();

      // Update the animation, otherwise complete
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  };

  /**
   * Handle participant toss
   * @param target Target partner
   */
  const handleParticipantToss = (target: "partnerA" | "partnerB") => {
    // Prevent multiple clicks
    if (animationState.current.isAnimating || !gameState.current.canToss) return;

    // Animate ball
    animateBall(Configuration.cyberball.ballPositions.participant, Configuration.cyberball.ballPositions[target], () => {
      onBallReceived("participant", target);
    });
  };

  /**
   * Handle partner response
   * @param partner Partner
   */
  const handlePartnerResponse = (partner: "partnerA" | "partnerB") => {
    // Determine target based on mode and probabilities
    let target: "participant" | "partnerA" | "partnerB";
    const random = Math.random();

    if (props.isInclusive) {
      target = random < props.probabilities.inclusion ? "participant" : (partner === "partnerA" ? "partnerB" : "partnerA");
    } else {
      const exclusionProb = partner === "partnerA" ? props.probabilities.exclusion.partnerA : props.probabilities.exclusion.partnerB;
      target = random < exclusionProb ? "participant" : (partner === "partnerA" ? "partnerB" : "partnerA");
    }

    animateBall(Configuration.cyberball.ballPositions[partner], Configuration.cyberball.ballPositions[target], () => {
      onBallReceived(partner, target);
    });
  };

  return (
    <Box
      width={`${Configuration.cyberball.viewWidth}px`}
      height={`${Configuration.cyberball.viewHeight}px`}
      background="white"
      border={{ color: "#CCCCCC", size: "2px" }}
      style={{ position: "relative", margin: "0 auto", borderRadius: "10px" }}
    >
      {/* Partner A (Top Left) */}
      <Box
        width={`${Configuration.cyberball.partnerAvatarSize + 80}px`}
        height={`${Configuration.cyberball.partnerAvatarSize + 20}px`}
        onClick={() => handleParticipantToss("partnerA")}
        align="center"
        style={{
          position: "absolute",
          top: `${positions.partnerA.y - Configuration.cyberball.partnerAvatarSize / 2}px`,
          left: `${positions.partnerA.x - (Configuration.cyberball.partnerAvatarSize + 80) / 2}px`,
          cursor:
            gameState.current.ballOwner === "participant" && !animationState.current.isAnimating
              ? "pointer"
              : "default",
          opacity:
            gameState.current.ballOwner === "participant" && !animationState.current.isAnimating ? 1 : 0.7,
        }}
      >
        {/* Social status label above Partner A */}
        <Box
          align="center"
          direction="column"
          gap="xxsmall"
          width="150px"
          style={{
            position: "absolute",
            top: "-70px",
            left: "50%",
            width: "100%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          {/* Avatars and arrows above the bar */}
          <Box
            width="100%"
            height="48px"
            style={{ position: "relative" }}
            margin={{ bottom: "xxsmall" }}
          >
            {/* Participant avatar and arrow */}
            <Box
              align="center"
              style={{
                position: "absolute",
                left: `${participantStatus}%`,
                top: 0,
                transform: "translateX(-50%)",
                zIndex: 2,
              }}
            >
              <Text size="xsmall" textAlign="center" weight="bold">You</Text>
              <Avatar
                size={24}
                name={
                  Configuration.avatars.names.participant[
                    positions.participant.avatar
                  ]
                }
                variant={Configuration.avatars.variant as AvatarStyles}
                colors={Configuration.avatars.colours}
              />
              {/* Downward arrow */}
              <Box
                as="svg"
                width="8px"
                height="7px"
                style={{ display: "block" }}
                margin={{ top: "xxsmall" }}
              >
                <polygon points="4,7 0,0 8,0" fill="#89C2D9" />
              </Box>
            </Box>

            {/* Partner A avatar and arrow */}
            <Box
              align="center"
              width="100px" // Required to fit the avatar label
              style={{
                position: "absolute",
                left: `${partnerStatus}%`,
                top: 0,
                transform: "translateX(-50%)",
                zIndex: 2,
              }}
            >
              <Text size="xsmall" textAlign="center" weight="bold">Partner A</Text>
              <Avatar
                size={24}
                name={partnerAID}
                variant={Configuration.avatars.variant as AvatarStyles}
                colors={Configuration.avatars.colours}
              />
              {/* Downward arrow */}
              <Box
                as="svg"
                width="8px"
                height="7px"
                style={{ display: "block" }}
                margin={{ top: "xxsmall" }}
              >
                <polygon points="4,7 0,0 8,0" fill="#89C2D9" />
              </Box>
            </Box>
          </Box>

          {/* Solid color bar with rounded corners */}
          <Box
            width="100%"
            height="3px"
            background="#2A6F97"
            round="small"
            style={{ position: "relative" }}
          />

          {/* Scale labels */}
          <Box direction="row" justify="between" width="100%">
            <Text size="xsmall" textAlign="center" weight="bold">
              Low
            </Text>
            <Text size="xsmall" textAlign="center" weight="bold">
              High
            </Text>
          </Box>
        </Box>

        <Avatar
          size={Configuration.cyberball.partnerAvatarSize + 8}
          name={partnerAID}
          variant={Configuration.avatars.variant as AvatarStyles}
          colors={Configuration.avatars.colours}
        />
        <Text size="small" textAlign="center" weight="bold" margin={{ top: "xsmall" }}>
          Partner A
        </Text>
        <Text size="xsmall" textAlign="center" margin={{ top: "xxsmall" }}>
          Prolific ID: hidden for anonymity
          <br />
          Internal ID: {partnerAID}
        </Text>
      </Box>

      {/* Partner B (Top Right) */}
      <Box
        width={`${Configuration.cyberball.partnerAvatarSize + 80}px`}
        height={`${Configuration.cyberball.partnerAvatarSize + 20}px`}
        align="center"
        onClick={() => handleParticipantToss("partnerB")}
        style={{
          position: "absolute",
          top: `${positions.partnerB.y - Configuration.cyberball.partnerAvatarSize / 2}px`,
          left: `${positions.partnerB.x - (Configuration.cyberball.partnerAvatarSize + 80) / 2}px`,
          cursor:
            gameState.current.ballOwner === "participant" && !animationState.current.isAnimating
              ? "pointer"
              : "default",
          opacity:
            gameState.current.ballOwner === "participant" && !animationState.current.isAnimating ? 1 : 0.7,
        }}
      >
        <Avatar
          size={Configuration.cyberball.partnerAvatarSize + 8}
          name={partnerBID}
          variant={Configuration.avatars.variant as AvatarStyles}
          colors={Configuration.avatars.colours}
        />
        <Text size="small" textAlign="center" weight="bold" margin={{ top: "xsmall" }}>
          Partner B
        </Text>
        <Text size="xsmall" textAlign="center" margin={{ top: "xxsmall" }}>
          Prolific ID: hidden for anonymity
          <br />
          Internal ID: {partnerBID}
        </Text>
      </Box>

      {/* Participant (Bottom Center) */}
      <Box
        width={`${Configuration.cyberball.participantAvatarSize}px`}
        height={`${Configuration.cyberball.participantAvatarSize}px`}
        style={{
          position: "absolute",
          top: `${positions.participant.y - Configuration.cyberball.participantAvatarSize / 2}px`,
          left: `${positions.participant.x - Configuration.cyberball.participantAvatarSize / 2}px`,
        }}
      >
        <Avatar
          size={Configuration.cyberball.participantAvatarSize}
          name={
            Configuration.avatars.names.participant[
              positions.participant.avatar
            ]
          }
          variant={Configuration.avatars.variant as AvatarStyles}
          colors={Configuration.avatars.colours}
        />
        <Text size="small" textAlign="center" weight="bold" margin={{ top: "xsmall" }}>
          You
        </Text>
      </Box>

      {/* Ball */}
      <Box
        data-testid="cyberball-ball"
        width={`${Configuration.cyberball.ballSize}px`}
        height={`${Configuration.cyberball.ballSize}px`}
        background={Configuration.cyberball.ballColor}
        round="50%"
        style={{
          position: "absolute",
          top: `${animationState.current.ballY - Configuration.cyberball.ballSize / 2}px`,
          left: `${animationState.current.ballX - Configuration.cyberball.ballSize / 2}px`,
          transition: animationState.current.isAnimating ? "none" : "all 0.1s ease",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          zIndex: 1000,
        }}
      />

      {/* Status Bar */}
      <Box
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "10px",
          textAlign: "center",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        <Text size="medium" weight="bold">
          {isGameFinished
            ? "Game Complete!"
            : gameState.current.ballOwner === "participant"
            ? "Click on a partner to throw the ball to them!"
            : "Waiting to receive the ball..."}
        </Text>
      </Box>

      {/* Message overlay signalling game completion */}
      {isGameFinished && (
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.9)",
            color: "white",
            padding: "20px 40px",
            borderRadius: "10px",
            zIndex: 2000,
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Text size="xlarge" weight="bold">
            Finished!
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Cyberball;
