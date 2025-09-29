// Declare CSV module type
declare module "*.csv";

// CSV data row types
declare type Row = {
  randomise_blocks: string;
  randomise_trials: number;
  display: Display;
  ANSWER: Options;
  Option1_PPT: number;
  Option1_Partner: number;
  Option2_PPT: number;
  Option2_Partner: number;
  ShowProgressBar: number;
  Type1: Partner;
  Type2: Partner;
  Difference1: number;
  Difference2: number;
};

// Data type used to enforce trial data storage format
declare type Dataframe = {
  // Trial identification
  trial_number: number;
  display: Display;
  participantID: string;

  // Points
  playerPoints_option1: number;
  partnerPoints_option1: number;
  playerPoints_option2: number;
  partnerPoints_option2: number;
  playerPoints_selected: number;
  partnerPoints_selected: number;

  // Trial state
  selectedOption_player: NaN | 1 | 2; // uses 1 and 2 rather than strings
  realAnswer: Options;
  trialDuration: number;
  correctGuess: NaN | 0 | 1; // 0 incorrect; 1 correct

  // Model parameters
  server_alpha_ppt: number;
  server_beta_ppt: number;
  server_alpha_par: number;
  server_beta_par: number;
  setupDuration: number;
  operationDuration: number;

  // Signal timestamps
  signalTimestamps: number[];

  // Cyberball data
  cyberballTossCount: number;
  cyberballParticipantTossCount: number;
  cyberballParticipantCatchCount: number;

  // Questionnaire responses
  questionnaireResponseInferenceSelfish: number;
  questionnaireResponseInferenceHarm: number;
  questionnaireResponseAgency: number;
  questionnaireResponseClassification: string;
  questionnaireResponseCloseFriends: number;
  questionnaireResponsePartyInvitations: number;
  questionnaireResponseMeanPeople: number;
  questionnaireResponseSocialMediaFollowers: number;
  questionnaireResponseSocialMediaFollowing: number;
  questionnaireResponsesDASS: number[];
  questionnaireResponsesScreentime: number[];
  questionnaireResponsesDemographicsAge: number;
  questionnaireResponsesDemographicsGender: string;
  questionnaireResponsesDemographicsEthnicity: string;
  questionnaireResponsesDemographicsHouseholdIncome: string;
  questionnaireResponsesDemographicsEducation: string;
  questionnaireResponsesDemographicsSocialMediaDaily: boolean;
  questionnaireResponsesDemographicsSocialMediaPlatforms: string;
};
