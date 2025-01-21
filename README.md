# Intentions Game

## Getting Started

### Client

Before building or previewing the client, ensure that the Node.js version 14+ is installed on your system. Download Node.js [here](https://nodejs.org/en/) and install Yarn using this command `npm i -g yarn`.

After installing Yarn, run `yarn` in the top-level repository directory to install all dependencies. Refer to [Development](#development) below for other commands to build and preview the client.

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

## License

<!-- CC BY-NC-SA 4.0 License -->
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
  <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
</a>
<br />
This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

## Issues and Feedback

Please contact **Henry Burgess** <[henry.burgess@wustl.edu](mailto:henry.burgess@wustl.edu)> for all code-related issues and feedback.
