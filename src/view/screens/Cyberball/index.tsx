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
import React, { FC, ReactElement, useEffect, useRef, useState } from "react";

// Components
import { Box, Text } from "grommet";
import Avatar from "boring-neutral-avatars";

// Configuration
import { Configuration } from "src/configuration";

// Types
interface GameState {
  ballOwner: "participant" | "partnerA" | "partnerB";
  tossCount: number;
  participantTossCount: number;
  participantCatchCount: number;
  partnerATossCount: number;
  partnerBTossCount: number;
  gameStartTime: number;
}

/**
 * Cyberball screen component that implements the social exclusion paradigm
 * @component
 * @param {Props.Screens.Cyberball} props - Component props
 * @param {(tossCount: number, participantTossCount: number, participantCatchCount: number) => void} props.handler - Callback function when game completes
 * @returns {ReactElement} Cyberball game screen
 */
const Cyberball: FC<Props.Screens.Cyberball> = (
  props: Props.Screens.Cyberball
): ReactElement => {
  const [gameState, setGameState] = useState<GameState>({
    ballOwner: "participant",
    tossCount: 0,
    participantTossCount: 0,
    participantCatchCount: 0,
    partnerATossCount: 0,
    partnerBTossCount: 0,
    gameStartTime: Date.now(),
  });

  // Simple state
  const [ballPosition, setBallPosition] = useState({ x: 400, y: 480 }); // Start at participant position
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs
  const gameTimerRef = useRef<NodeJS.Timeout>();

  // Configuration
  const participantAvatarIndex = Configuration.state.participantAvatar;

  // Generate random 6-character alphanumeric IDs for partners
  const generatePartnerID = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };

  // Partner IDs (generated once per component instance)
  const partnerAID = useRef(generatePartnerID()).current;
  const partnerBID = useRef(generatePartnerID()).current;

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

  // Game completion check
  useEffect(() => {
    const checkGameCompletion = () => {
      const currentTime = Date.now();
      const totalGameTime = currentTime - gameState.gameStartTime;

      if (totalGameTime >= Configuration.cyberball.totalDuration) {
        props.handler(gameState.tossCount, gameState.participantTossCount, gameState.participantCatchCount);
      }
    };

    gameTimerRef.current = setInterval(checkGameCompletion, 100);
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
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
    // Determine target based on mode and probabilities
    let target: "participant" | "partnerA" | "partnerB";
    const random = Math.random();

    if (props.isInclusive) {
      // Inclusive mode: use inclusion probability
      if (random < props.probabilities.inclusion) {
        target = "participant";
        setGameState(prev => ({
          ...prev,
          participantCatchCount: prev.participantCatchCount + 1,
        }));
      } else {
        target = partner === "partnerA" ? "partnerB" : "partnerA";
      }
    } else {
      // Exclusive mode: use exclusion probability
      const exclusionProb =
        partner === "partnerA"
          ? props.probabilities.exclusion.partnerA
          : props.probabilities.exclusion.partnerB;

      if (random < exclusionProb) {
        target = "participant";
        setGameState(prev => ({
          ...prev,
          participantCatchCount: prev.participantCatchCount + 1,
        }));
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
    setGameState(prev => {
      const updated = {
        ...prev,
        ballOwner: target,
        tossCount: prev.tossCount + 1,
        [target === "partnerA" ? "partnerATossCount" : "partnerBTossCount"]:
          prev[
            target === "partnerA" ? "partnerATossCount" : "partnerBTossCount"
          ] + 1,
      };
      return updated;
    });

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
        height={`${Configuration.cyberball.playerSize + 20}px`}
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
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          {/* Avatars and arrows above the bar */}
          <Box
            width="100%"
            height="32px"
            style={{ position: "relative" }}
            margin={{ bottom: "xxsmall" }}
          >
            {/* Participant avatar and arrow */}
            <Box
              align="center"
              style={{
                position: "absolute",
                left: props.partnerHighStatus ? "20%" : "80%",
                top: 0,
                transform: "translateX(-50%)",
                zIndex: 2,
              }}
            >
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
              style={{
                position: "absolute",
                left: props.partnerHighStatus ? "80%" : "20%",
                top: 0,
                transform: "translateX(-50%)",
                zIndex: 2,
              }}
            >
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
          size={Configuration.cyberball.playerSize + 8}
          name={partnerAID}
          variant={Configuration.avatars.variant as AvatarStyles}
          colors={Configuration.avatars.colours}
        />
        <Text size="small" textAlign="center" margin={{ top: "xsmall" }}>
          Partner A
        </Text>
        <Text size="xsmall" textAlign="center" margin={{ top: "xxsmall" }}>
          ({partnerAID})
        </Text>
      </Box>

      {/* Partner B (Top Right) */}
      <Box
        width={`${Configuration.cyberball.playerSize}px`}
        height={`${Configuration.cyberball.playerSize + 20}px`}
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
          size={Configuration.cyberball.playerSize + 8}
          name={partnerBID}
          variant={Configuration.avatars.variant as AvatarStyles}
          colors={Configuration.avatars.colours}
        />
        <Text size="small" textAlign="center" margin={{ top: "xsmall" }}>
          Partner B
        </Text>
        <Text size="xsmall" textAlign="center" margin={{ top: "xxsmall" }}>
          ({partnerBID})
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
        data-testid="cyberball-ball"
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
            ? "Click on a partner to throw the ball to them!"
            : "Waiting to receive the ball..."}
        </Text>
      </Box>
    </Box>
  );
};

export default Cyberball;
