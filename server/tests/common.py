# Packages
import json
import logging


# Custom functions
import util


# Constants
DEFAULT_ID = "test1234"
DEFAULT_RESPONSES = [{"ID":"NA","Trial":1,"ppt1":6,"par1":6,"ppt2":6,"par2":1,"Ac":2,"Phase":1},{"ID":"NA","Trial":2,"ppt1":9,"par1":5,"ppt2":9,"par2":9,"Ac":2,"Phase":1},{"ID":"NA","Trial":3,"ppt1":7,"par1":7,"ppt2":7,"par2":2,"Ac":2,"Phase":1},{"ID":"NA","Trial":4,"ppt1":6,"par1":6,"ppt2":10,"par2":6,"Ac":2,"Phase":1},{"ID":"NA","Trial":5,"ppt1":7,"par1":2,"ppt2":8,"par2":6,"Ac":2,"Phase":1},{"ID":"NA","Trial":6,"ppt1":11,"par1":6,"ppt2":9,"par2":2,"Ac":2,"Phase":1},{"ID":"NA","Trial":7,"ppt1":6,"par1":2,"ppt2":8,"par2":6,"Ac":2,"Phase":1},{"ID":"NA","Trial":8,"ppt1":12,"par1":9,"ppt2":9,"par2":9,"Ac":2,"Phase":1},{"ID":"NA","Trial":9,"ppt1":6,"par1":6,"ppt2":6,"par2":2,"Ac":2,"Phase":1},{"ID":"NA","Trial":10,"ppt1":6,"par1":6,"ppt2":8,"par2":6,"Ac":1,"Phase":1},{"ID":"NA","Trial":11,"ppt1":5,"par1":5,"ppt2":8,"par2":5,"Ac":1,"Phase":1},{"ID":"NA","Trial":12,"ppt1":12,"par1":8,"ppt2":8,"par2":8,"Ac":1,"Phase":1},{"ID":"NA","Trial":13,"ppt1":8,"par1":8,"ppt2":8,"par2":2,"Ac":1,"Phase":1},{"ID":"NA","Trial":14,"ppt1":8,"par1":5,"ppt2":8,"par2":8,"Ac":1,"Phase":1},{"ID":"NA","Trial":15,"ppt1":12,"par1":6,"ppt2":10,"par2":2,"Ac":1,"Phase":1},{"ID":"NA","Trial":16,"ppt1":7,"par1":7,"ppt2":7,"par2":1,"Ac":1,"Phase":1},{"ID":"NA","Trial":17,"ppt1":8,"par1":8,"ppt2":10,"par2":8,"Ac":1,"Phase":1},{"ID":"NA","Trial":18,"ppt1":7,"par1":7,"ppt2":10,"par2":7,"Ac":1,"Phase":1},{"ID":"NA","Trial":19,"ppt1":12,"par1":10,"ppt2":10,"par2":10,"Ac":1,"Phase":1},{"ID":"NA","Trial":20,"ppt1":10,"par1":5,"ppt2":10,"par2":10,"Ac":1,"Phase":1},{"ID":"NA","Trial":21,"ppt1":5,"par1":5,"ppt2":5,"par2":1,"Ac":1,"Phase":1},{"ID":"NA","Trial":22,"ppt1":8,"par1":2,"ppt2":9,"par2":6,"Ac":1,"Phase":1},{"ID":"NA","Trial":23,"ppt1":4,"par1":4,"ppt2":8,"par2":4,"Ac":1,"Phase":1},{"ID":"NA","Trial":24,"ppt1":10,"par1":6,"ppt2":8,"par2":2,"Ac":1,"Phase":1}]


# Class to group requests
class Requests:
  # Basic request
  def basic(address=""):
    # Send a request
    logging.info("Sending request...")
    response = util.create_request(address, data={
      "participantID": DEFAULT_ID,
      "participantResponses": DEFAULT_RESPONSES
    })

    # Extract the content of the response
    content = None
    try:
      content = response.json()
      logging.info("Request succeeded!")
    except (json.JSONDecodeError):
      logging.error("Error decoding JSON!")

    # Assert that there were no issues decoding the response
    assert content is not None

    # Assert that ID has been specified
    assert util.valid_id(content['participantID']) == True

    # Assert that the responses are valid
    assert util.valid_responses(content['partnerChoices']) == True


  # No ID
  def no_id(address=""):
    # Send a request
    logging.info("Sending request...")

    response = util.create_request(address, data={
      "participantResponses": DEFAULT_RESPONSES,
    })

    # Assert that an HTTP error occurred
    assert response.status_code == 500


  # No responses
  def no_responses(address=""):
    # Send a request
    logging.info("Sending request...")
    response = util.create_request(address, data={
      "participantID": DEFAULT_ID,
    })

    # Assert that an HTTP error occurred
    assert response.status_code == 500


  # Invalid responses value
  def invalid_responses(address=""):
    # Send a request
    logging.info("Sending request...")
    response = util.create_request(address, data={
      "participantID": DEFAULT_ID,
      "participantResponses": [{"ID":"NA","Trial":1,"ppt1":2,"par1":3,"Ac":1,"Phase":1}]
    })

    # Assert that an HTTP error occurred
    assert response.status_code == 500
