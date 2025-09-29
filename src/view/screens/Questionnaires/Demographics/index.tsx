/**
 * @file `Demographics` screen for collecting demographic information.
 *
 * This screen collects participants' demographic information using
 * various input types. Key features include:
 * - Multi-page questionnaire design
 * - Age input field
 * - Gender identity selection with version-specific options
 * - Ethnicity selection with text input for "other"
 * - Household income selection
 * - Education level selection
 * - Social media usage questions
 * - Response validation before proceeding
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// React import
import React, { FC, ReactElement, useState } from "react";

// Grommet UI components
import {
  Box,
  Button,
  Paragraph,
  TextInput,
  RadioButtonGroup,
  Heading,
  CheckBox,
  Select,
} from "grommet";
import { LinkNext } from "grommet-icons";

/**
 * @summary Generate a 'Demographics' screen component with multiple pages for collecting demographic information
 * @param {Screens.Demographics} props Component props containing:
 *  - version: "adult" | "adolescent" - Determines question wording and options
 *  - handler: {(responses: DemographicsResponses) => void} Callback function when participant continues
 * @return {ReactElement} 'Demographics' screen with multiple pages of questions
 */
const Demographics: FC<Screens.Demographics> = (
  props: Screens.Demographics
): ReactElement => {
  // Page state
  const [currentPage, setCurrentPage] = useState(1);

  // Page 1 data
  const [age, setAge] = useState("");
  const [genderIdentity, setGenderIdentity] = useState("");
  const [genderIdentityOther, setGenderIdentityOther] = useState("");

  // Page 2 data
  const [ethnicity, setEthnicity] = useState("");
  const [ethnicityOther, setEthnicityOther] = useState("");
  const [householdIncome, setHouseholdIncome] = useState("");

  // Page 3 data
  const [education, setEducation] = useState("");
  const [socialMediaDaily, setSocialMediaDaily] = useState<boolean | null>(null);

  // Page 4 data
  const [socialMediaPlatforms, setSocialMediaPlatforms] = useState<string[]>([]);
  const [socialMediaOther, setSocialMediaOther] = useState("");

  // Gender identity options based on version
  const genderOptions = props.version === "adult"
    ? [
        { label: "Man", value: "Man" },
        { label: "Woman", value: "Woman" },
        { label: "Trans man", value: "Trans man" },
        { label: "Trans woman", value: "Trans woman" },
        { label: "Non-binary", value: "Non-binary" },
        { label: "Prefer not to say", value: "Prefer not to say" },
        { label: "Prefer to self-describe", value: "Prefer to self-describe" },
      ]
    : [
        { label: "Boy", value: "Boy" },
        { label: "Girl", value: "Girl" },
        { label: "Trans boy", value: "Trans boy" },
        { label: "Trans girl", value: "Trans girl" },
        { label: "Non-binary", value: "Non-binary" },
        { label: "Prefer not to say", value: "Prefer not to say" },
        { label: "Prefer to self-describe", value: "Prefer to self-describe" },
      ];

  // Education options based on version
  const educationOptions = props.version === "adult"
    ? [
        { label: "High school or less", value: "High school or less" },
        { label: "Some college", value: "Some college" },
        { label: "Associate's degree", value: "Associate's degree" },
        { label: "Bachelor's degree", value: "Bachelor's degree" },
        { label: "Master's degree", value: "Master's degree" },
        { label: "Doctoral degree", value: "Doctoral degree" },
        { label: "Other", value: "Other" },
      ]
    : [
        { label: "Less than high school", value: "Less than high school" },
        { label: "High school", value: "High school" },
        { label: "Some college", value: "Some college" },
        { label: "College degree", value: "College degree" },
        { label: "Graduate degree", value: "Graduate degree" },
        { label: "Other", value: "Other" },
      ];

  // Social media platforms
  const platformOptions = [
    "Facebook", "Instagram", "YouTube", "WhatsApp", "TikTok",
    "Snapchat", "X (formerly Twitter)", "Pinterest", "LinkedIn",
    "Reddit", "Discord", "Telegram", "WeChat", "Threads"
  ];

  // Render page 1
  if (currentPage === 1) {
    return (
      <Box
        justify={"center"}
        align={"center"}
        gap={"xsmall"}
        style={{ maxWidth: "80%", margin: "auto" }}
        animation={["fadeIn"]}
      >
        <Heading level={3} margin="small" fill>
          Please answer the following questions:
        </Heading>

        <Paragraph margin="small" size="large" fill>
          How old are you?
        </Paragraph>
        <Box
          pad={"xsmall"}
          margin={"xsmall"}
          round
        >
          <TextInput
            type="number"
            value={age}
            onChange={event => setAge(event.target.value)}
            placeholder="Enter age"
            style={{ textAlign: "center" }}
          />
        </Box>

        <Paragraph margin="small" size="large" fill>
          How do you describe your gender identity?
        </Paragraph>
        <Box
          pad={"xsmall"}
          round
        >
          <RadioButtonGroup
            name="gender-identity"
            direction="column"
            gap="small"
            options={genderOptions}
            value={genderIdentity}
            onChange={event => setGenderIdentity(event.target.value)}
          />
        </Box>

        {genderIdentity === "Prefer to self-describe" && (
          <Box
            pad={"xsmall"}
            round
          >
            <TextInput
              value={genderIdentityOther}
              width="medium"
              onChange={event => setGenderIdentityOther(event.target.value)}
              placeholder="Please describe your gender identity"
              style={{ textAlign: "center" }}
            />
          </Box>
        )}

        <Box
          margin={"xsmall"}
          pad={"none"}
          round
        >
          <Button
            primary
            color="button"
            label="Continue"
            disabled={
              age.trim() === "" ||
              genderIdentity === "" ||
              (genderIdentity === "Prefer to self-describe" && genderIdentityOther.trim() === "")
            }
            icon={<LinkNext />}
            reverse
            onClick={() => setCurrentPage(2)}
          />
        </Box>
      </Box>
    );
  }

  // Render page 2
  if (currentPage === 2) {
    return (
      <Box
        justify={"center"}
        align={"center"}
        gap={"xsmall"}
        style={{ maxWidth: "80%", margin: "auto" }}
        animation={["fadeIn"]}
      >
        <Heading level={3} margin="small" fill>
          Please answer the following questions:
        </Heading>

        <Paragraph margin="small" size="large" fill>
          How would you describe your ethnicity?
        </Paragraph>
        <Box
          pad={"xsmall"}
          round
        >
          <Select
            placeholder="Select ethnicity"
            value={ethnicity}
            size="small"
            width="medium"
            onChange={({ value }) => setEthnicity(value)}
            options={[
              "Asian or Asian British",
              "Black, Black British, Caribbean or African",
              "Mixed or multiple ethnic groups",
              "White",
              "Other ethnic group",
            ]}
          />
        </Box>

        {ethnicity === "Other ethnic group" && (
          <Box
            pad={"xsmall"}
            round
          >
            <TextInput
              value={ethnicityOther}
              onChange={event => setEthnicityOther(event.target.value)}
              placeholder="Please describe your ethnicity"
              style={{ textAlign: "center" }}
            />
          </Box>
        )}

        <Paragraph margin="small" size="large" fill>
          What was your total household income before taxes during the past 12 months?
        </Paragraph>
        <Box
          pad={"xsmall"}
          round
        >
          <Select
            placeholder="Select income range"
            value={householdIncome}
            size="small"
            width="medium"
            onChange={({ value }) => setHouseholdIncome(value)}
            options={[
              "Less than 20,000 pounds or dollars",
              "20,000 - 39,999 pounds or dollars",
              "40,000 - 59,999 pounds or dollars",
              "60,000 - 99,999 pounds or dollars",
              "More than 100,000 pounds or dollars",
              "Prefer not to answer",
              "Don't know",
            ]}
          />
        </Box>

        <Box
          margin={"xsmall"}
          pad={"none"}
          round
        >
          <Button
            primary
            color="button"
            label="Continue"
            disabled={
              ethnicity === "" ||
              (ethnicity === "Other ethnic group" && ethnicityOther.trim() === "") ||
              householdIncome === ""
            }
            icon={<LinkNext />}
            reverse
            onClick={() => setCurrentPage(3)}
          />
        </Box>
      </Box>
    );
  }

  // Render page 3
  if (currentPage === 3) {
    return (
      <Box
        justify={"center"}
        align={"center"}
        gap={"xsmall"}
        style={{ maxWidth: "80%", margin: "auto" }}
        animation={["fadeIn"]}
      >
        <Heading level={3} margin="small" fill>
          Please answer the following questions:
        </Heading>

        <Paragraph margin="small" size="large" fill>
          {props.version === "adult"
            ? "What is your highest level of education?"
            : "What is the highest level of education held by at least one of your parents?"
          }
        </Paragraph>
        <Box
          pad={"xsmall"}
          round
        >
          <Select
            placeholder="Select education level"
            value={education}
            size="small"
            width="medium"
            onChange={({ value }) => setEducation(value)}
            options={educationOptions.map(option => option.value)}
          />
        </Box>

        <Paragraph margin="small" size="large" fill>
          Do you use social media platforms every day or on most days of the week?
        </Paragraph>
        <Box
          pad={"xsmall"}
          round
        >
          <Select
            placeholder="Select response"
            size="small"
            width="medium"
            value={socialMediaDaily === null ? undefined : (socialMediaDaily ? "Yes" : "No")}
            onChange={({ value }) => setSocialMediaDaily(value === "Yes")}
            options={["Yes", "No"]}
          />
        </Box>

        <Box
          margin={"xsmall"}
          pad={"none"}
          round
        >
          <Button
            primary
            color="button"
            label="Continue"
            disabled={education === "" || socialMediaDaily === null}
            icon={<LinkNext />}
            reverse
            onClick={() => setCurrentPage(4)}
          />
        </Box>
      </Box>
    );
  }

  // Render page 4
  return (
    <Box
      justify={"center"}
      align={"center"}
      gap={"xsmall"}
      style={{ maxWidth: "80%", margin: "auto" }}
      animation={["fadeIn"]}
    >
      <Heading level={3} margin="small" fill>
        Please answer the following questions:
      </Heading>

      <Paragraph margin="small" size="large" fill>
        Which social media platforms do you use? (Check all that apply)
      </Paragraph>
      <Box
        direction="row"
        gap="medium"
        justify="center"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        {/* Left column */}
        <Box gap="xsmall">
          {platformOptions.slice(0, Math.ceil(platformOptions.length / 2)).map((platform) => (
            <CheckBox
              key={platform}
              label={platform}
              checked={socialMediaPlatforms.includes(platform)}
              onChange={(event) => {
                if (event.target.checked) {
                  setSocialMediaPlatforms([...socialMediaPlatforms, platform]);
                } else {
                  setSocialMediaPlatforms(socialMediaPlatforms.filter(p => p !== platform));
                }
              }}
            />
          ))}
        </Box>

        {/* Right column */}
        <Box gap="xsmall">
          {platformOptions.slice(Math.ceil(platformOptions.length / 2)).map((platform) => (
            <CheckBox
              key={platform}
              label={platform}
              checked={socialMediaPlatforms.includes(platform)}
              onChange={(event) => {
                if (event.target.checked) {
                  setSocialMediaPlatforms([...socialMediaPlatforms, platform]);
                } else {
                  setSocialMediaPlatforms(socialMediaPlatforms.filter(p => p !== platform));
                }
              }}
            />
          ))}
        </Box>
      </Box>

      <Box
        pad={"xsmall"}
        round
      >
        <TextInput
          value={socialMediaOther}
          width="medium"
          onChange={event => setSocialMediaOther(event.target.value)}
          placeholder="Other platforms"
          style={{ textAlign: "center" }}
        />
      </Box>

      <Box
        margin={"xsmall"}
        pad={"none"}
        round
      >
        <Button
          primary
          color="button"
          label="Submit"
          icon={<LinkNext />}
          reverse
          onClick={() => {
            const finalGenderIdentity = genderIdentity === "Prefer to self-describe"
              ? genderIdentityOther
              : genderIdentity;

            const finalEthnicity = ethnicity === "Other ethnic group"
              ? ethnicityOther
              : ethnicity;

            const finalSocialMediaPlatforms = socialMediaOther.trim()
              ? [...socialMediaPlatforms, socialMediaOther]
              : socialMediaPlatforms;

            props.handler(
              parseInt(age) || 0,
              finalGenderIdentity,
              finalEthnicity,
              householdIncome,
              education,
              socialMediaDaily || false,
              finalSocialMediaPlatforms.join(", "),
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default Demographics;

