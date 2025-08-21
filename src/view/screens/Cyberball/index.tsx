/**
 * @file `Cyberball` screen for social exclusion paradigm.
 *
 * This screen implements the classic Cyberball paradigm where participants
 * play a virtual ball-tossing game that transitions from fair play to
 * social exclusion. Key features include:
 * - Realistic ball-tossing animations
 * - Configurable game parameters
 * - Smooth transition from inclusion to exclusion
 * - Data collection for social exclusion research
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useEffect, useRef, useState } from "react";

// Components
import { Box, Text } from "grommet";
import Avatar from "boring-neutral-avatars";

// Configuration
import { Configuration } from "src/configuration";

// Types
interface CyberballState {
  phase: "inclusion" | "exclusion";
  participantCatchCount: number;
  participantTossCount: number;
  exclusionStartTime: number | null;
}

interface GameState {
  ballOwner: "participant" | "partnerA" | "partnerB";
  tossCount: number;
  participantTossCount: number;
  partnerATossCount: number;
  partnerBTossCount: number;
  currentPhase: "inclusion" | "exclusion";
  gameStartTime: number;
  phaseStartTime: number;
}

/**
 * Cyberball screen component that implements the social exclusion paradigm
 * @component
 * @param {Props.Screens.Cyberball} props - Component props
 * @param {(state: CyberballState) => void} props.handler - Callback function when game completes
 * @returns {ReactElement} Cyberball game screen
 */
const Cyberball: FC<Props.Screens.Cyberball> = (
  props: Props.Screens.Cyberball
): ReactElement => {
  const [gameState, setGameState] = useState<GameState>({
    ballOwner: "participant",
    tossCount: 0,
    participantTossCount: 0,
    partnerATossCount: 0,
    partnerBTossCount: 0,
    currentPhase: "inclusion",
    gameStartTime: Date.now(),
    phaseStartTime: Date.now(),
  });

  // Simple state
  const [ballPosition, setBallPosition] = useState({ x: 400, y: 480 }); // Start at participant position
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs
  const gameTimerRef = useRef<NodeJS.Timeout>();

  // Configuration
  const participantAvatarIndex = Configuration.state.participantAvatar;

  // Player positions (static)
  const positions = {
    participant: {
      x: Configuration.cyberball.viewWidth / 2,
      y:
        Configuration.cyberball.viewHeight -
        Configuration.cyberball.playerSize / 2 -
        80,
      avatar: participantAvatarIndex,
    },
    partnerA: {
      x: Configuration.cyberball.playerSize / 2 + 20,
      y: Configuration.cyberball.playerSize / 2 + 80,
      avatar: 0,
    },
    partnerB: {
      x:
        Configuration.cyberball.viewWidth -
        Configuration.cyberball.playerSize / 2 -
        20,
      y: Configuration.cyberball.playerSize / 2 + 80,
      avatar: 1,
    },
  };

  // Phase transition logic
  useEffect(() => {
    const checkPhaseTransition = () => {
      const currentTime = Date.now();
      const timeInPhase = currentTime - gameState.phaseStartTime;

      if (
        gameState.currentPhase === "inclusion" &&
        timeInPhase >= Configuration.cyberball.inclusionDuration
      ) {
        setGameState(prev => ({
          ...prev,
          currentPhase: "exclusion",
          phaseStartTime: currentTime,
        }));
      }
    };

    gameTimerRef.current = setInterval(checkPhaseTransition, 100);
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, [gameState.currentPhase, gameState.phaseStartTime]);

  // Game completion check
  useEffect(() => {
    const currentTime = Date.now();
    const totalGameTime = currentTime - gameState.gameStartTime;

    if (totalGameTime >= Configuration.cyberball.totalDuration) {
      const finalState: CyberballState = {
        phase: gameState.currentPhase,
        participantCatchCount: gameState.participantTossCount,
        participantTossCount: gameState.participantTossCount,
        exclusionStartTime:
          gameState.currentPhase === "exclusion"
            ? gameState.phaseStartTime
            : null,
      };
      props.handler(finalState);
    }
  }, [gameState, props]);

  // Ball animation with arc trajectory
  const animateBall = (
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => {
    setIsAnimating(true);

    const startTime = Date.now();
    const duration = 600; // Animation duration in ms

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Create arc trajectory (parabolic motion)
      const arcHeight = 80;
      const arcProgress = 4 * progress * (1 - progress);

      // Linear interpolation for x and y
      const newX = from.x + (to.x - from.x) * progress;
      const newY =
        from.y + (to.y - from.y) * progress - arcHeight * arcProgress;

      setBallPosition({ x: newX, y: newY });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  // Handle participant toss
  const handleParticipantToss = (target: "partnerA" | "partnerB") => {
    if (gameState.ballOwner !== "participant" || isAnimating) return;

    // Animate ball to target
    animateBall(positions.participant, {
      x: positions[target].x,
      y: positions[target].y,
    });

    // Update game state
    setGameState(prev => ({
      ...prev,
      ballOwner: target,
      tossCount: prev.tossCount + 1,
      participantTossCount: prev.participantTossCount + 1,
    }));

    // Schedule partner response
    setTimeout(() => {
      handlePartnerResponse(target);
    }, Configuration.cyberball.tossInterval);
  };

  // Handle partner response
  const handlePartnerResponse = (partner: "partnerA" | "partnerB") => {
    // Determine target based on current phase and probabilities
    let target: "participant" | "partnerA" | "partnerB";
    const random = Math.random();

    if (gameState.currentPhase === "inclusion") {
      // Inclusion phase: use inclusion probability
      if (random < props.probabilities.inclusion) {
        target = "participant";
      } else {
        target = partner === "partnerA" ? "partnerB" : "partnerA";
      }
    } else {
      // Exclusion phase: use exclusion probability
      const exclusionProb =
        partner === "partnerA"
          ? props.probabilities.exclusion.partnerA
          : props.probabilities.exclusion.partnerB;

      if (random < exclusionProb) {
        target = "participant";
      } else {
        target = partner === "partnerA" ? "partnerB" : "partnerA";
      }
    }

    // Animate ball to target
    animateBall(positions[partner], {
      x: positions[target].x,
      y: positions[target].y,
    });

    // Update game state
    setGameState(prev => ({
      ...prev,
      ballOwner: target,
      tossCount: prev.tossCount + 1,
      [target === "partnerA" ? "partnerATossCount" : "partnerBTossCount"]:
        prev[
          target === "partnerA" ? "partnerATossCount" : "partnerBTossCount"
        ] + 1,
    }));

    // If ball went to another partner, schedule their response
    if (target !== "participant") {
      setTimeout(() => {
        handlePartnerResponse(target);
      }, Configuration.cyberball.tossInterval);
    }
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
        width={`${Configuration.cyberball.playerSize}px`}
        height={`${Configuration.cyberball.playerSize}px`}
        onClick={() => handleParticipantToss("partnerA")}
        style={{
          position: "absolute",
          top: `${
            positions.partnerA.y - Configuration.cyberball.playerSize / 2
          }px`,
          left: `${
            positions.partnerA.x - Configuration.cyberball.playerSize / 2
          }px`,
          cursor:
            gameState.ballOwner === "participant" && !isAnimating
              ? "pointer"
              : "default",
          opacity:
            gameState.ballOwner === "participant" && !isAnimating ? 1 : 0.7,
        }}
      >
        <Avatar
          size={Configuration.cyberball.playerSize}
          name={Configuration.avatars.names.partner[positions.partnerA.avatar]}
          variant={Configuration.avatars.variant as AvatarStyles}
          colors={Configuration.avatars.colours}
        />
        <Text size="small" textAlign="center" margin={{ top: "xsmall" }}>
          Partner A
        </Text>
      </Box>

      {/* Partner B (Top Right) */}
      <Box
        width={`${Configuration.cyberball.playerSize}px`}
        height={`${Configuration.cyberball.playerSize}px`}
        onClick={() => handleParticipantToss("partnerB")}
        style={{
          position: "absolute",
          top: `${
            positions.partnerB.y - Configuration.cyberball.playerSize / 2
          }px`,
          left: `${
            positions.partnerB.x - Configuration.cyberball.playerSize / 2
          }px`,
          cursor:
            gameState.ballOwner === "participant" && !isAnimating
              ? "pointer"
              : "default",
          opacity:
            gameState.ballOwner === "participant" && !isAnimating ? 1 : 0.7,
        }}
      >
        <Avatar
          size={Configuration.cyberball.playerSize}
          name={Configuration.avatars.names.partner[positions.partnerB.avatar]}
          variant={Configuration.avatars.variant as AvatarStyles}
          colors={Configuration.avatars.colours}
        />
        <Text size="small" textAlign="center" margin={{ top: "xsmall" }}>
          Partner B
        </Text>
      </Box>

      {/* Participant (Bottom Center) */}
      <Box
        width={`${Configuration.cyberball.playerSize}px`}
        height={`${Configuration.cyberball.playerSize}px`}
        style={{
          position: "absolute",
          top: `${
            positions.participant.y - Configuration.cyberball.playerSize / 2
          }px`,
          left: `${
            positions.participant.x - Configuration.cyberball.playerSize / 2
          }px`,
        }}
      >
        <Avatar
          size={Configuration.cyberball.playerSize}
          name={
            Configuration.avatars.names.participant[
              positions.participant.avatar
            ]
          }
          variant={Configuration.avatars.variant as AvatarStyles}
          colors={Configuration.avatars.colours}
        />
        <Text size="small" textAlign="center" margin={{ top: "xsmall" }}>
          You
        </Text>
      </Box>

      {/* Ball */}
      <Box
        width={`${Configuration.cyberball.ballSize}px`}
        height={`${Configuration.cyberball.ballSize}px`}
        background={Configuration.cyberball.ballColor}
        round="50%"
        style={{
          position: "absolute",
          top: `${ballPosition.y - Configuration.cyberball.ballSize / 2}px`,
          left: `${ballPosition.x - Configuration.cyberball.ballSize / 2}px`,
          transition: isAnimating ? "none" : "all 0.1s ease",
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
          {gameState.ballOwner === "participant"
            ? "Throw the ball!"
            : "Waiting..."}
        </Text>
      </Box>
    </Box>
  );
};

export default Cyberball;
