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
        | Screens.Matching
        | Screens.Trial
        | Screens.SelectAvatar
        | Screens.Inference
        | Screens.Agency
        | Screens.Classification
        | Screens.Summary;
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

    // Matching screen
    type Matching = GenericScreenProps & {
      fetchData: boolean;
      handler: (
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
      handler: (
        selection: Options,
        points: { options: Points },
        answer: Options
      ) => void;
    };

    // SelectAvatar screen
    type SelectAvatar = GenericScreenProps & {
      handler: (selectedName: string) => void;
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

    // Summary screen
    type Summary = GenericScreenProps & {
      postPhase: Display;
      handler: () => void;
    };
  }
}

// Type for the 'ScreenPropFactory' return
declare type ScreenProps = {
  props: Props.Screens;
  callback: (...args) => void;
  duration: number;
};
