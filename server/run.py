import rpy2.robjects as ro
from rpy2.robjects import pandas2ri
import pandas as pd
import json
from flask import Flask, request
from flask_cors import CORS

# Required to communicate between R / Python data structures
pandas2ri.activate()

# Configure R and access required functions
r = ro.r
r.source("functions.R")
r_model_wrapper = ro.globalenv["model_wrapper"]

# Create the Flask application
app = Flask(__name__)
CORS(app)

@app.post("/task/intentions")
def generate_partner():
    # Parse the request and extract data for model
    request_data = request.get_json()
    participant_id = request_data["participantID"]
    participant_responses = pd.DataFrame(request_data["participantResponses"])

    # To-do: Add checks for ID and responses

    # Run the model
    model_output = r_model_wrapper(participant_responses)

    # Parse parameters for participant and partner
    participant_parameters = pd.DataFrame(model_output[0], dtype=float)
    partner_parameters = pd.DataFrame(model_output[1][0].split(" "), dtype=float)

    # Parse and format the partner behavior to be packaged in the response
    partner_behavior = model_output[2]
    partner_behavior_cols = pd.array(r.names(model_output[2]))
    partner_behavior = pd.DataFrame(partner_behavior).transpose()
    partner_behavior.columns = partner_behavior_cols

    return json.dumps({
        "participantID": participant_id,
        "participantParameters": participant_parameters.to_json(),
        "partnerParameters": partner_parameters.to_json(),
        "partnerResponses": partner_behavior.to_json(),
    })

if __name__ == "__main__":
    app.run(host="localhost", port=8123, debug=False)
