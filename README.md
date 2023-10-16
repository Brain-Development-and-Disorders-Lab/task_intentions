# Intentions Game 🧠

## Getting Started

### JavaScript task (client)

Before developing or previewing the game, ensure that the Node.js version 14+ is installed on your system. Download Node.js [here](https://nodejs.org/en/) and install Yarn using this command `npm i -g yarn`. After installing Yarn, run `yarn` in the `client` directory of this repository. After a short period of time, all dependencies for the tasks will be configured and ready for development.

### API endpoint (server)

To run the API endpoint for task computations, the following packages should be installed:

**R:**

- `doParallel`
- `dplyr`
- `matlab`
- `tidyverse`

**Python:**

- `rpy2`
- `pandas`
- `flask`
- `flask_cors`

## Developer Commands 👨‍💻

Each command is run under the `client` directory.

`yarn clean`: Remove all build artefacts and logs.

`yarn build:client`: Create a production build of the game.

`yarn lint:client`: Pipe all the game source code through ESLint to check for any style violations.

`yarn start`: Start both the game and the API server.

`yarn start:server`: Launch the Flask API instance.

`yarn start:client`: Run a Webpack HMR-compatible development server to preview the task at [localhost:8080](http://localhost:8080).

`yarn test`: Run all tests, server and game tests.

`yarn test:server`: Run all the tests for the Flask API instance.

`yarn test:client`: Run all the tests for the game.

## Tools 🛠

`Yarn`: manage dependencies and packages

`Webpack`: module bundling tool and development server

[`Grommet`](https://v2.grommet.io/): accessible React front-end framework used to build the interfaces.

`Jest`: testing framework for JavaScript. Multiple plugins used to evaluate accessiblity and display of React components.

`Flask`: configure an API endpoint using Python.

`rpy2`: execute R code from Python.

`Pytest`: testing framework for Python.
