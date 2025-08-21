/**
 * @file Prop declarations for React components and screens.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Declare a 'Components' namespace to define props for each
// of the components used in the experiment.
declare namespace Props {
  // Props for 'Components'
  declare namespace Components {
    // Wrapper component
    type Wrapper = {
      display: Display;
      props:
        | Screens.Matched
        | Screens.Loading
        | Screens.Trial
        | Screens.SelectAvatar
        | Screens.Inference
        | Screens.Agency
        | Screens.Classification
        | Screens.Status
        | Screens.Summary
        | Screens.Waiting
        | Screens.Cyberball;
    };

    // Option component
    type Option = {
      optionKey: string;
      optionName: string;
      pointsParticipant: number;
      pointsPartner: number;
    };

    // Card component
    type Card = {
      gridArea: string;
      name: string;
      points: string;
      avatar: string;
    };

    // Slider component
    type Slider = {
      min: number;
      max: number;
      value: number;
      setValue: (value: number) => void;
      leftLabel: string;
      rightLabel: string;
      onChange?: () => any;
      isFocused: boolean;
    };

    // Character component
    type Character = {
      size: number;
      name: string;
      state: string;
      setState: (avatar: string) => void;
    };

    // Status componet
    type Status = {
      participantStatus: number;
      partnerStatus: number;
      isPractice?: boolean;
    };
  }

  // Props for 'Screens'
  declare namespace Screens {
    type GenericScreenProps = {
      trial: number;
      display: Display;
    };

    // End screen
    type End = GenericScreenProps;

    // Matched screen
    type Matched = GenericScreenProps;

    // Loading screen
    type Loading = GenericScreenProps & {
      loadingType: "matching" | "social" | "default";
      fetchData?: boolean;
      handler?: (
        participantParameters: number[],
        partnerParameters: number[]
      ) => void;
    };

    // Trial screen
    type Trial = GenericScreenProps & {
      isPractice: boolean;
      participantPoints: number;
      partnerPoints: number;
      options: Points;
      answer: Options;
      spotlight?: {
        enabled: boolean;
        target: "status" | "options" | "none";
        message: string;
      };
      handler: (
        selection: Options,
        points: { options: Points },
        answer: Options
      ) => void;
    };

    // SelectAvatar screen
    type SelectAvatar = GenericScreenProps & {
      handler: (selectedIndex: number) => void;
    };

    // Inference screen
    type Inference = GenericScreenProps & {
      handler: (firstValue: number, secondValue: number) => void;
    };

    // Agency screen
    type Agency = GenericScreenProps & {
      handler: (firstValue: number) => void;
    };

    // Classification screen
    type Classification = GenericScreenProps & {
      handler: (classification: string) => void;
    };

    // Status screen
    type Status = GenericScreenProps & {
      handler: (
        followers: number,
        averageLikes: number,
        friends: number,
        socialCloseness: number
      ) => void;
    };

    // Summary screen
    type Summary = GenericScreenProps & {
      postPhase: Display;
      handler: () => void;
    };

    // Waiting screen
    type Waiting = GenericScreenProps & {
      mode: "facilitator" | "mri";
      handler: () => void;
    };

    // Cyberball screen
    type Cyberball = GenericScreenProps & {
      probabilities: {
        inclusion: number, // Probability of partners passing to participant
        exclusion: {
          partnerA: number, // Probability of partner A passing to participant
          partnerB: number, // Probability of partner B passing to participant
        },
      };
      handler: (gameState: {
        phase: string;
        participantCatchCount: number;
        participantTossCount: number;
        exclusionStartTime: number | null;
      }) => void;
    };
  }
}
