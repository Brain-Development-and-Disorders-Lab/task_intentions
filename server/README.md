# Intentions Game 🧠 API

Run computations for the Intentions Game on a remote server. Uses `Flask` to operate an API endpoint.

`functions.R` contains the R functions responsible for task and partner behavior computations during the Intentions Game. `run.py` starts the server and handles the incoming and outgoing requests.

## Dependencies

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

## Usage

After installing all R and Python dependencies, run:

```Shell
python3 run.py
```

As defined in `run.py`, the server by default will listen on port `8123` via the path `/task/intentions`.

Additional configuration is required when deploying this server in an online scenario.

## Request Format

The API expects a POST request, and the body must contain two data:

1. Participant ID, in either string, float, or a mixture of formats.
2. Participant responses from Phase one of the intentions game. Originally stored as an array of JavaScript objects, the responses are serialized from JSON to a string.

An example set of data is given below:

| Data | Type | Example |
| --------- | ---- | ------- |
| `participantID` | `string` or `float` or `int` | `participantA1`, `12.34`, `1234` |
| `participantResponses` | `string` | `[{"ID":"NA","Trial":1,"ppt1":2,"par1":4,"ppt2":2,"par2":4,"Ac":1,"Phase":1}]` **Note:** This example is a list of responses containing only a single trial. |

The API will respond with an error if any of the received parameters are formatted incorrectly.

## Notes

- The file `restart.sh` is a shell script that will kill any existing processes using the port `8123` before restarting the server. This requires a cron job to be configured, information is included in the shell script how this should be done.
