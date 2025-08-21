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
import React, {
  FC,
  ReactElement,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

// Logging library
import consola from "consola";

// UI components
import { Box, Heading, Paragraph, Text } from "grommet";

// Avatar component
import Avatar from "boring-neutral-avatars";

// Configuration
import { Configuration } from "src/configuration";

// Access theme constants directly
import { Theme } from "src/theme";

// Types
interface Ball {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  startTime: number;
  duration: number;
  isMoving: boolean;
  holder: number;
  rotation: number;
}

interface Player {
  x: number;
  y: number;
  name: string;
  color: string;
  isParticipant: boolean;
  isActive: boolean;
  hasBall: boolean;
}

interface CyberballState {
  phase: "instructions" | "inclusion" | "exclusion" | "complete";
  gameStartTime: number;
  lastTossTime: number;
  ball: Ball;
  players: Player[];
  participantCatchCount: number;
  participantTossCount: number;
  exclusionStartTime: number | null;
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
  const config = Configuration.cyberball;

  // Get participant's avatar name
  const experiment = window.Experiment;
  const participantAvatarIndex = experiment.getState().get("participantAvatar");
  const participantAvatarName = Configuration.avatars.names.participant[participantAvatarIndex];

  // Animation reference
  const animationRef = useRef<number>();

  // Ball position state for animation
  const [ballPosition, setBallPosition] = useState({ x: config.fieldWidth / 2, y: config.fieldHeight - 100 });

  // Game state
  const [state, setState] = useState<CyberballState>({
    phase: "instructions",
    gameStartTime: 0,
    lastTossTime: 0,
    ball: {
      x: config.fieldWidth / 2,
      y: config.fieldHeight - 100,
      targetX: config.fieldWidth / 2,
      targetY: config.fieldHeight - 100,
      startTime: 0,
      duration: 0,
      isMoving: false,
      holder: 0,
      rotation: 0,
    },
    players: [
      {
        x: config.fieldWidth / 2,
        y: config.fieldHeight - 100,
        name: config.playerNames[0],
        color: config.playerColors[0],
        isParticipant: true,
        isActive: true,
        hasBall: true,
      },
      {
        x: 100,
        y: 100,
        name: config.playerNames[1],
        color: config.playerColors[1],
        isParticipant: false,
        isActive: true,
        hasBall: false,
      },
      {
        x: config.fieldWidth - 100,
        y: 100,
        name: config.playerNames[2],
        color: config.playerColors[2],
        isParticipant: false,
        isActive: true,
        hasBall: false,
      },
    ],
    participantCatchCount: 0,
    participantTossCount: 0,
    exclusionStartTime: null,
  });

  // Initialize game
  const startGame = useCallback(() => {
    consola.info("Cyberball: Game started - entering fair play phase");
    setState(prev => ({
      ...prev,
      phase: "inclusion",
      gameStartTime: Date.now(),
      lastTossTime: Date.now(),
    }));
  }, []);

  // Handle canvas click for participant ball toss
  const handleGameAreaClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (state.phase !== "inclusion" && state.phase !== "exclusion") return;
    if (!state.players[0].hasBall) return; // Only allow toss if participant has the ball

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find closest non-participant player
    const otherPlayers = state.players.slice(1);
    let closestPlayerIndex = 1; // Default to player 1
    let minDistance = Math.sqrt(
      Math.pow(x - otherPlayers[0].x, 2) + Math.pow(y - otherPlayers[0].y, 2)
    );

    for (let i = 0; i < otherPlayers.length; i++) {
      const player = otherPlayers[i];
      const distance = Math.sqrt(
        Math.pow(x - player.x, 2) + Math.pow(y - player.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestPlayerIndex = i + 1; // +1 because we're indexing into otherPlayers
      }
    }

    // Start ball toss
    consola.debug(`Cyberball: Participant tossing to AI Player ${closestPlayerIndex}`);
    setState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[0].hasBall = false; // Participant no longer has the ball

      return {
        ...prev,
        ball: {
          ...prev.ball,
          x: prev.players[0].x,
          y: prev.players[0].y,
          targetX: prev.players[closestPlayerIndex].x,
          targetY: prev.players[closestPlayerIndex].y,
          startTime: Date.now(),
          duration: Math.sqrt(
            Math.pow(prev.players[closestPlayerIndex].x - prev.players[0].x, 2) +
            Math.pow(prev.players[closestPlayerIndex].y - prev.players[0].y, 2)
          ) / config.ballSpeed * 1000,
          isMoving: true,
          holder: -1, // Ball is in transit
          rotation: 0, // Reset rotation for new toss
        },
        players: newPlayers,
        participantTossCount: prev.participantTossCount + 1,
        lastTossTime: Date.now(),
      };
    });
  }, [state.phase, state.players, config.ballSpeed]);

  // Game loop
  const main = useCallback(() => {
    const now = Date.now();

    // Update ball position for animation
    if (state.ball.isMoving) {
      const progress = Math.min(1, (now - state.ball.startTime) / state.ball.duration);

      if (progress >= 1) {
        // Ball reached target - find who should receive it
        const targetPlayer = state.players.find(player =>
          Math.abs(player.x - state.ball.targetX) < 10 && Math.abs(player.y - state.ball.targetY) < 10
        );

        if (targetPlayer) {
          const targetIndex = state.players.indexOf(targetPlayer);
          consola.debug(`Cyberball: Ball received by ${targetPlayer.isParticipant ? 'participant' : `AI Player ${targetIndex}`}`);
          setState(prev => {
            const newPlayers = [...prev.players];
            newPlayers[targetIndex].hasBall = true;

            return {
              ...prev,
              ball: {
                ...prev.ball,
                x: targetPlayer.x,
                y: targetPlayer.y,
                isMoving: false,
                holder: targetIndex,
                rotation: 0, // Stop rotation when ball is caught
              },
              players: newPlayers,
            };
          });
        }
        setBallPosition({ x: state.ball.targetX, y: state.ball.targetY });
      } else {
        // Animate ball with arc trajectory
        const x = state.ball.x + (state.ball.targetX - state.ball.x) * progress;
        const arcHeight = 50; // Maximum height of the arc
        const arcProgress = Math.sin(progress * Math.PI); // Creates a smooth arc
        const y = state.ball.y + (state.ball.targetY - state.ball.y) * progress - arcHeight * arcProgress;

        setBallPosition({ x, y });
      }
    } else {
      // Ball is with a player
      const ballHolder = state.players[state.ball.holder];
      if (ballHolder) {
        setBallPosition({ x: ballHolder.x, y: ballHolder.y });
      }
    }

    // Update game state based on time
    setState(prev => {
      // Check for phase transitions
      if (prev.phase === "inclusion" && now - prev.gameStartTime > config.fairPlayDuration) {
        consola.info("Cyberball: Transitioning to exclusion phase");
        return {
          ...prev,
          phase: "exclusion",
          exclusionStartTime: now,
        };
      }

      if (prev.phase === "exclusion" && now - (prev.exclusionStartTime || now) > config.exclusionDuration) {
        consola.info("Cyberball: Game complete");
        props.handler(prev);
        return {
          ...prev,
          phase: "complete",
        };
      }

      // Handle AI player tosses
      if ((prev.phase === "inclusion" || prev.phase === "exclusion") && now - prev.lastTossTime > config.ballTossInterval && !prev.ball.isMoving) {
        // Find which AI player has the ball
        let fromPlayer = -1;
        for (let i = 1; i < prev.players.length; i++) {
          if (prev.players[i].hasBall) {
            fromPlayer = i;
            break;
          }
        }

        if (fromPlayer !== -1) {
          let toPlayer;
          if (prev.phase === "inclusion") {
            toPlayer = Math.random() < config.fairPlayParticipantTossProbability ? 0 : (fromPlayer === 1 ? 2 : 1);
            consola.debug(`Cyberball: AI Player ${fromPlayer} tossing to ${toPlayer === 0 ? 'participant' : `AI Player ${toPlayer}`} (fair play phase)`);
          } else {
            // Exclusion phase - use exclusionParticipantTossProbability
            toPlayer = Math.random() < config.exclusionParticipantTossProbability ? 0 : (fromPlayer === 1 ? 2 : 1);
            consola.debug(`Cyberball: AI Player ${fromPlayer} tossing to ${toPlayer === 0 ? 'participant' : `AI Player ${toPlayer}`} (exclusion phase)`);
          }

          const newPlayers = [...prev.players];
          newPlayers[fromPlayer].hasBall = false; // AI player no longer has the ball

          return {
            ...prev,
            ball: {
              ...prev.ball,
              x: prev.players[fromPlayer].x,
              y: prev.players[fromPlayer].y,
              targetX: prev.players[toPlayer].x,
              targetY: prev.players[toPlayer].y,
              startTime: now,
              duration: Math.sqrt(
                Math.pow(prev.players[toPlayer].x - prev.players[fromPlayer].x, 2) +
                Math.pow(prev.players[toPlayer].y - prev.players[fromPlayer].y, 2)
              ) / config.ballSpeed * 1000,
              isMoving: true,
              holder: -1, // Ball is in transit
              rotation: 0, // Reset rotation for new toss
            },
            players: newPlayers,
            lastTossTime: now,
            participantCatchCount: toPlayer === 0 ? prev.participantCatchCount + 1 : prev.participantCatchCount,
          };
        }
      }

      return prev;
    });

    // Continue animation loop
    animationRef.current = requestAnimationFrame(main);
  }, [state, config, props]);

  // Start game loop
  useEffect(() => {
    if (state.phase !== "instructions") {
      animationRef.current = requestAnimationFrame(main);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.phase, main]);

  // Handle instructions phase
  if (state.phase === "instructions") {
    return (
      <Box
        fill
        align="center"
        justify="center"
        background={Theme.global.colors.avatarBackground}
        pad="large"
      >
        <Box
          width="large"
          background={Theme.global.colors.optionBackground}
          pad="large"
          round="medium"
          elevation="medium"
        >
          <Heading level={1} margin={{ bottom: "medium" }}>
            Ball Tossing Game
          </Heading>
          <Paragraph size="large" margin={{ bottom: "large" }}>
            {config.instructions}
          </Paragraph>
          <Box align="center">
            <button
              onClick={startGame}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                backgroundColor: Theme.global.colors.button,
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Start Game
            </button>
          </Box>
        </Box>
      </Box>
    );
  }



  return (
    <Box fill align="center" justify="center">
      <Box
        background={Theme.global.colors.optionBackground}
        pad="medium"
        round="medium"
        elevation="medium"
      >
        <div
          style={{
            position: "relative",
            width: config.fieldWidth,
            height: config.fieldHeight,
            border: "2px solid #fff",
            borderRadius: "8px",
            cursor: (state.phase === "inclusion" || state.phase === "exclusion") && state.players[0].hasBall ? "pointer" : "default",
            overflow: "hidden",
          }}
          onClick={handleGameAreaClick}
        >
          {/* Players */}
          {state.players.map((player, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: player.x - config.playerSize / 2,
                top: player.y - config.playerSize / 2,
                width: config.playerSize,
                height: config.playerSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {player.isParticipant ? (
                <Avatar
                  size={config.playerSize}
                  name={participantAvatarName}
                  variant={Configuration.avatars.variant as AvatarStyles}
                  colors={Configuration.avatars.colours}
                />
              ) : (
                <div
                  style={{
                    width: config.playerSize,
                    height: config.playerSize,
                    borderRadius: "50%",
                    backgroundColor: player.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {player.name}
                </div>
              )}
              <div
                style={{
                  marginTop: "5px",
                  fontSize: "12px",
                  color: "#333",
                  textAlign: "center",
                }}
              >
                {player.name}
              </div>
            </div>
          ))}

          {/* Ball */}
          {state.ball.isMoving && (
            <div
              style={{
                position: "absolute",
                left: ballPosition.x - config.ballSize / 2,
                top: ballPosition.y - config.ballSize / 2,
                width: config.ballSize,
                height: config.ballSize,
                borderRadius: "50%",
                backgroundColor: config.ballColor,
                border: "2px solid #8B4513",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8B4513",
                fontWeight: "bold",
                fontSize: "12px",
                zIndex: 10,
              }}
            >
              ⚽
            </div>
          )}

          {/* Ball with player when not moving */}
          {!state.ball.isMoving && (
            <div
              style={{
                position: "absolute",
                left: ballPosition.x - config.ballSize / 2,
                top: ballPosition.y - config.ballSize / 2,
                width: config.ballSize,
                height: config.ballSize,
                borderRadius: "50%",
                backgroundColor: config.ballColor,
                border: "2px solid #8B4513",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8B4513",
                fontWeight: "bold",
                fontSize: "12px",
                zIndex: 10,
              }}
            >
              ⚽
            </div>
          )}
        </div>

        <Box margin={{ top: "medium" }} align="center">
          <Text size={"medium"} weight={"bold"}>
            {state.players[0].hasBall ? "Click to throw the ball to another player!" : "Waiting..."}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Cyberball;
