# Intentions Game

## Getting Started

### Major Versions

> [!IMPORTANT]
> As of [v1.7.13](https://github.com/Brain-Development-and-Disorders-Lab/task_intentions/releases/tag/v1.7.13), Package management has been migrated to use [pnpm](https://pnpm.io/) in light of a recent increase in supply-chain attacks.

_All recent versions include features from earlier versions._

- [v1.7.13](https://github.com/Brain-Development-and-Disorders-Lab/task_intentions/releases/tag/v1.7.13) (latest): Includes all social status features, with additional questionnaires and paradigms that can be toggled. Contains small UI fixes to MRI-compatible versions and code quality improvements.
- [v1.7.2](https://github.com/Brain-Development-and-Disorders-Lab/task_intentions/releases/tag/v1.7.2): First version to include MRI-compatible features, supporting input from a 4-button controller with UI indicators, and a trigger waiting period. Adds offline support by performing all computations in-browser with `WebR`. Removes support for external server computations.
- [v1.7.0](https://github.com/Brain-Development-and-Disorders-Lab/task_intentions/releases/tag/v1.7.0): Initial release, basic 3-Phase experiment timeline, all computations handled by external server requiring persistent internet connectivity.

### Development

- `pnpm clean`: Remove all client build artefacts and logs.
- `pnpm build`: Create a production build of the client.
- `pnpm lint`: Run the client source code through ESLint to check for any style violations.
- `pnpm start`: Start a Webpack HMR-compatible development server to preview the client locally on [localhost:8080](http://localhost:8080).
- `pnpm test`: Run all client tests.

## Components

### Client

Before building or previewing the client, ensure that the Node.js version 22+ is installed on your system. Download Node.js [here](https://nodejs.org/en/) and install pnpm using this command `npm i -g pnpm`.

After installing pnpm, run `pnpm install` in the top-level repository directory to install all dependencies. Refer to [Development](#development) below for other commands to build and preview the client.

#### Experiment Manipulations

| Parameter                           | Type    | Description                                         | Notes                                                                                                                                               |
| ----------------------------------- | ------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **partner**                         | string  | Sets the partner type for testing purposes          | `"test"` is a shorter collection of trials, otherwise use `"default"`                                                                               |
| **requireID**                       | boolean | Controls whether participant ID is required         |                                                                                                                                                     |
| **useButtonInput**                  | boolean | Enables button-based input scheme                   | Includes additional instructions, enables selection indicators for all screens                                                                      |
| **useOfflinePackages**              | boolean | Enables offline R package usage                     | Only use for local deployments                                                                                                                      |
| **enableSocialStatusQuestionnaire** | boolean | Controls display of the social status questionnaire | Shows a social status questionnaire at the start of the experiment                                                                                  |
| **enableEndingQuestionnaires**      | boolean | Controls post-experiment questionnaire display      | Shows a DASS and social media usage questionnaire at the conclusion of the experiment                                                               |
| **useAdultQuestionnaires**          | boolean | Enables adult-specific questionnaire content        | Requires `enableEndingQuestionnaires` to be `true`, uses the adult questions if `true`, else `false` to show the adolescent set                     |
| **enableStatusPhaseOne**            | boolean | Enables social status display in first phase        | Includes additional instructions and social status questionnaire prior to experiment starting, shows status display above partner in Phase One      |
| **enableStatusPhaseTwo**            | boolean | Enables social status display in second phase       | Includes additional instructions and social status questionnaire prior to experiment starting, shows status display above partner in Phase Two      |
| **enableStatusPhaseThree**          | boolean | Enables social status display in third phase        | Includes additional instructions and social status questionnaire prior to experiment starting, shows status display above partner in Phase Three    |
| **isPartnerHighStatusPhaseOne**     | boolean | Sets partner as high status in first phase          | Requires `enableStatusPhaseOne` to be `true`                                                                                                        |
| **isPartnerHighStatusPhaseTwo**     | boolean | Sets partner as high status in second phase         | Requires `enableStatusPhaseTwo` to be `true`                                                                                                        |
| **isPartnerHighStatusPhaseThree**   | boolean | Sets partner as high status in third phase          | Requires `enableStatusPhaseThree` to be `true`                                                                                                      |
| **enableCyberball**                 | boolean | Enables Cyberball exclusion/inclusion task          | Includes additional instructions and social status questionnaire prior to experiment starting                                                       |
| **cyberballIsInclusive**            | boolean | Controls whether Cyberball task is inclusive        | Cyberball operates in inclusion mode when `true`, otherwise operating in exclusion mode, changes to probabilities can be made in `configuration.ts` |
| **cyberballIsPartnerHighStatus**    | boolean | Sets partner as high status in Cyberball task       | Shows social status display above Partner A, partner has high status when `true`, otherwise low status when `false`                                 |

#### Offline Usage

The task includes a `packages` directory containing all required R packages. To use these packages, set the `useOfflinePackages` manipulation within `Configuration.ts` to `true`. Each package was built and prepared using the [rwasm](https://r-wasm.github.io/rwasm/articles/rwasm.html) tool.

Use the `pnpm build` command to build the client with the offline packages, build output is placed in the `dist` directory. To run the task, use the `pnpm start` command if running from source code. If using a compiled version of the task, start an instance of `http-server` in the directory containing `index.html`.

> [!IMPORTANT]
> For offline operation, `http-server` or an equivalent **must** be used to host and run the experiment locally, otherwise requests to use the `WebR` runtime will be blocked by the browser.

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
