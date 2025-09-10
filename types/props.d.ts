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
        | Screens.Loaded
        | Screens.Loading
        | Screens.Trial
        | Screens.SelectAvatar
        | Screens.Inference
        | Screens.Agency
        | Screens.Classification
        | Screens.Status
        | Screens.DASS
        | Screens.Screentime
        | Screens.Demographics
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
      hidePartner?: boolean;
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

    // Loaded screen
    type Loaded = GenericScreenProps & {
      loadingType: "matchingIntentions" | "matchingCyberball" | "social";
      showStatusPreview: boolean;
      handler: () => void;
    };

    // Loading screen
    type Loading = GenericScreenProps & {
      loadingType: "matchingIntentions" | "matchingCyberball" | "social" | "default";
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
        closeFriends: number,
        partyInvitations: number,
        meanPeople: number,
        socialMediaFollowers: number,
        socialMediaFollowing: number
      ) => void;
    };

    // DASS screen
    type DASS = GenericScreenProps & {
      version: "adult" | "adolescent";
      handler: (responses: number[]) => void;
    };

    // Screentime screen
    type Screentime = GenericScreenProps & {
      handler: (weekdayTime: number, weekendTime: number) => void;
    };

    // Demographics screen
    type Demographics = GenericScreenProps & {
      version: "adult" | "adolescent";
      handler: (
        age: number,
        genderIdentity: string,
        ethnicity: string,
        householdIncome: string,
        education: string,
        socialMediaDaily: boolean,
        socialMediaPlatforms: string,
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
      isInclusive: boolean; // Operate exclusively as inclusive or exclusive
      partnerHighStatus: boolean; // Partner A is high status or low status
      probabilities: {
        inclusion: number; // Probability of partners passing to participant
        exclusion: {
          partnerA: number; // Probability of partner A passing to participant
          partnerB: number; // Probability of partner B passing to participant
        };
      };
      handler: (
        tossCount: number,
        participantTossCount: number,
        participantCatchCount: number
      ) => void;
    };
  }
}
