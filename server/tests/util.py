# Packages
import logging
import requests
import threading
import time
from types import FunctionType


# Constants
ADDR = "http://localhost:8123/task/intentions"


# Configure logging
format = "%(asctime)s: %(message)s"
logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")


# Create a new worker thread with a function that supports
# a tuple of arguments
def create_thread(target, args=()):
  logging.debug("Creating new thread")
  return threading.Thread(target=target, args=args)


# Create a pool of worker threads and run them
def create_pool(workers, target, args):
  logging.info("Creating {}-worker pool".format(workers))
  jobs = []

  for i in range(0, workers):
    jobs.append(create_thread(target, args))

  # Start the threads
  for j in jobs:
    j.start()

  # Join the threads
  for j in jobs:
    j.join()


# Create and send a GET request to the specified address
# with parameters
def create_request(address, data={}):
  response = None

  try:
    response = requests.post(address, json=data)
  except(requests.exceptions.ConnectionError):
    logging.error("Connection error!")

  return response


def runner(func: FunctionType, args):
  logging.info("Running {}: {}".format(func.__module__, func.__name__))
  start_time = time.time()

  # Run the test
  output = func(*args)

  # Calculated the elapsed time
  elapsed = time.time() - start_time
  logging.info("{}: {} finished after {}s".format(func.__module__, func.__name__, round(elapsed, ndigits=3)))

  # Return test output
  return output


# Check the content of the ID object
def valid_id(id):
  valid = True

  if id == "":
    valid = False

  return valid


# Check the content of the response object
def valid_responses(responses):
  valid = True

  if len(responses) == 0:
    # Check there are multiple responses
    valid = False

  for response in responses:
    # Check each response for all fields
    if "ppt1" not in response:
      valid = False
    if "par1" not in response:
      valid = False
    if "ppt2" not in response:
      valid = False
    if "par2" not in response:
      valid = False
    if "Ac" not in response:
      valid = False

  return valid
