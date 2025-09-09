# Intentions Game

## Getting Started

### Client

Before building or previewing the client, ensure that the Node.js version 14+ is installed on your system. Download Node.js [here](https://nodejs.org/en/) and install Yarn using this command `npm i -g yarn`.

After installing Yarn, run `yarn` in the top-level repository directory to install all dependencies. Refer to [Development](#development) below for other commands to build and preview the client.

#### Experiment Manipulations

| Parameter                         | Type    | Description                                    | Notes                                                                                                                                               |
| --------------------------------- | ------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **partner**                       | string  | Sets the partner type for testing purposes     | `"test"` is a shorter collection of trials, otherwise use `"default"`                                                                               |
| **requireID**                     | boolean | Controls whether participant ID is required    |                                                                                                                                                     |
| **useButtonInput**                | boolean | Enables button-based input scheme              | Includes additional instructions, enables selection indicators for all screens                                                                      |
| **useOfflinePackages**            | boolean | Enables offline R package usage                | Only use for local deployments                                                                                                                      |
| **enableSocialStatusQuestionnaire**    | boolean | Controls display of the social status questionnaire | Shows a social status questionnaire at the start of the experiment                                                                    |
| **enableEndingQuestionnaires**    | boolean | Controls post-experiment questionnaire display | Shows a DASS and social media usage questionnaire at the conclusion of the experiment                                                               |
| **useAdultQuestionnaires**          | boolean | Enables adult-specific questionnaire content | Requires `enableEndingQuestionnaires` to be `true`, uses the adult questions if `true`, else `false` to show the adolescent set                  |
| **enableStatusPhaseOne**          | boolean | Enables social status display in first phase   | Includes additional instructions and social status questionnaire prior to experiment starting, shows status display above partner in Phase One      |
| **enableStatusPhaseTwo**          | boolean | Enables social status display in second phase  | Includes additional instructions and social status questionnaire prior to experiment starting, shows status display above partner in Phase Two      |
| **enableStatusPhaseThree**        | boolean | Enables social status display in third phase   | Includes additional instructions and social status questionnaire prior to experiment starting, shows status display above partner in Phase Three    |
| **isPartnerHighStatusPhaseOne**   | boolean | Sets partner as high status in first phase     | Requires `enableStatusPhaseOne` to be `true`                                                                                                        |
| **isPartnerHighStatusPhaseTwo**   | boolean | Sets partner as high status in second phase    | Requires `enableStatusPhaseTwo` to be `true`                                                                                                 |
| **isPartnerHighStatusPhaseThree** | boolean | Sets partner as high status in third phase     | Requires `enableStatusPhaseThree` to be `true`                                                                                               |
| **enableCyberball**               | boolean | Enables Cyberball exclusion/inclusion task     | Includes additional instructions and social status questionnaire prior to experiment starting                                                       |
| **cyberballIsInclusive**          | boolean | Controls whether Cyberball task is inclusive   | Cyberball operates in inclusion mode when `true`, otherwise operating in exclusion mode, changes to probabilities can be made in `configuration.ts` |
| **cyberballIsPartnerHighStatus**  | boolean | Sets partner as high status in Cyberball task  | Shows social status display above Partner A, partner has high status when `true`, otherwise low status when `false`                                 |

### Server

> [!CAUTION]
> The server component of the Intentions Game has been deprecated, and partner computations are now performed by the client. The documentation below pertains to the archived `server.zip` file contents.

The server uses Python and R to generate partner behavior for a phase of the task. To run the server, the following packages are required:

**Required R packages (including dependencies):**

- `codetools`
- `iterators`
- `jsonlite`
- `foreach`
- `doParallel`
- `cli`
- `generics`
- `glue`
- `lifecycle`
- `magrittr`
- `pillar`
- `R6`
- `rlang`
- `tibble`
- `tidyselect`
- `utf8`
- `fansi`
- `vctrs`
- `pkgconfig`
- `withr`
- `dplyr`
- `logger`

## Development

- `yarn clean`: Remove all client build artefacts and logs.
- `yarn build`: Create a production build of the client.
- `yarn lint`: Run the client source code through ESLint to check for any style violations.
- `yarn start`: Start a Webpack HMR-compatible development server to preview the client locally on [localhost:8080](http://localhost:8080).
- `yarn test`: Run all client tests.

### Offline Usage

The task includes a `packages` directory containing all required R packages. To use these packages, set the `useOfflinePackages` manipulation within `Configuration.ts` to `true`. Each package was built and prepared using the [rwasm](https://r-wasm.github.io/rwasm/articles/rwasm.html) tool.

Use the `yarn build` command to build the client with the offline packages, build output is placed in the `dist` directory. To run the task, use the `yarn start` command or run an instance of `http-server` using the `dist` directory.

## Additional Features

- Alternate input scheme for usage with MRI controllers. Keys `1` and `2` used to move UI selection cursor, `3` used to interact with UI element. Experiment collects `5` key input timestamps (in Unix epoch format) and stores at the end of the data file.
- Incrementally saving data to `localStorage` for each experiment. In the case of the game crashing or exiting the browser window, the next time the game is accessed, an alert will prompt the user that the previous experiment did not complete and allow them to download the data captured. This feature is disabled by default (for online testing scenarios using Gorilla). It is advisable to enable this feature when the faciliator is physically present to deliver the experiment.

## License

<!-- CC BY-NC-SA 4.0 License -->
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
  <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
</a>
<br />
This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

## Issues and Feedback

Please contact **Henry Burgess** <[henry.burgess@wustl.edu](mailto:henry.burgess@wustl.edu)> for all code-related issues and feedback.
