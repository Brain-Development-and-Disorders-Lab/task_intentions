# Function file
source("functions.R")

# Additional libraries
library(logger)
library(jsonlite)
library(RestRserve)
library(tidyverse)

# Define the API route
api_route <- "/task/intentions"

# Create a new application
application <- Application$new(middleware = list(CORSMiddleware$new(routes = api_route, match = "exact")))

# Configure the logger to use files
if (dir.exists("logs") == FALSE) {
  dir.create("logs")
}

# Create a data folder to store participant data
if (dir.exists("participants") == FALSE) {
  dir.create("participants")
}

# Set the 'server' log level and namespace
log_threshold(DEBUG, namespace = "server")
log_appender(appender_tee(
  "./logs/server.log",
  append = TRUE,
  max_lines = Inf,
  max_bytes = Inf,
  max_files = 1L
), namespace = "server")

# Set the 'participants' log level and namespace
log_threshold(DEBUG, namespace = "participants")
log_appender(appender_tee(
  "./logs/participants.log",
  append = TRUE,
  max_lines = Inf,
  max_bytes = Inf,
  max_files = 1L
), namespace = "participants")

# Start the server
log_info("Starting server...", namespace = "server")

# Load the full data
full_data <- read.csv("./data/fullData.csv") %>% dplyr::select(-X)

# Create the partners
log_debug("Creating partners...", namespace = "server")
precan_df <- precan_partners(full_data)
log_debug("Ready to start!", namespace = "server")

handler <- function(.req, .res) {
  # Parse the ID from the body of the request
  # Check for a valid ID
  valid_id <- FALSE
  if ("participantID" %in% attributes(.req$parameters_query)$names) {
    # Extract the participantID and serialize to a set of characters
    participant_id <- as.character(.req$parameters_query["participantID"])

    # Check that participantID has been specified
    valid_specification <- !is.na(participant_id)

    # Check the participantID is valid format using a Regex matching pattern
    valid_format <-
      str_detect(participant_id, regex("[0-9]{8}", ignore_case = FALSE))

    # Check the participantID contains the correct number of characters
    valid_length <- nchar(participant_id) == 8

    # Finalize the validation of the participantID
    valid_id <-
      valid_specification == TRUE &&
      valid_format == TRUE &&
      valid_length == TRUE
  }

  # Reply with a HTTPError if any issues with participant ID
  if (valid_id == FALSE) {
    log_error(
      "Participant ID invalid or not specified",
      namespace = "server"
    )
    raise(HTTPError$bad_request(body = "Invalid ID specified"))
  }

  # Parse the participant responses
  valid_response <- FALSE
  parsed <- list()
  if ("participantResponses" %in% attributes(.req$parameters_query)$names) {
    tryCatch({
        parsed <- fromJSON(
          as.character(.req$parameters_query["participantResponses"]),
          simplifyDataFrame = TRUE
        )
        valid_response <- TRUE
      },
      error = function(e) {
        log_error(
          "Error encountered while parsing \'participantResponses\' content",
          namespace = "server"
        )

        # Return an empty list
        list()
      }
    )
  }

  # Reply with a HTTPError if any issues with participant responses
  if (valid_response == FALSE) {
    log_error(
      "\'participantResponses\' invalid or not specified",
      namespace = "server"
    )
    raise(HTTPError$bad_request(body = "Invalid response format"))
  } else {
    log_debug(
      "Successfully parsed participant responses",
      namespace = "server"
    )
  }

  log_success(
    "Valid request received",
    namespace = "server"
  )
  log_info(
    "Computing for ID: {participant_id}",
    namespace = "participants"
  )

  # Run the matching function
  log_debug(
    "Running matching function...",
    namespace = "server"
  )

  computed <- list()
  tryCatch({
      computed <- matching_partner_incremental_fit(
        phase1data = parsed,
        precan_df,
        shuffle = T,
        file_loc = F)
    },
    error = function(e) {
      log_error(
        "Error encountered while computing the partner",
        namespace = "server"
      )

      # Return an empty list
      list()
    }
  )

  # Save the data in CSV for for each participant ID
  # Create a folder for the participant ID if it doesn't exist
  if (dir.exists(paste0("participants/", participant_id)) == FALSE) {
    dir.create(paste0("participants/", participant_id))
  }

  # Generate file path
  file_path <- paste0("participants/", participant_id, "/")
  file_time <- as.character(round(as.numeric(as.POSIXct(Sys.time()))))

  responses_file_name <-
    paste(participant_id, file_time, "responses.csv", sep = "_")
  parameters_file_name <-
    paste(participant_id, file_time, "parameters.csv", sep = "_")
  partner_file_name <-
    paste(participant_id, file_time, "partner.csv", sep = "_")

  # Write the responses CSV file
  write.csv(
    parsed,
    paste0(
      file_path,
      responses_file_name
    )
  )

  # Extract participant and partner parameters
  participant_parameters <- computed[[1]]
  partner_parameters <- as.integer(strsplit(computed[[2]], " ")[[1]])
  partner_choices <- computed[[3]]

  # Extract the partner data and write the partner CSV file
  write.csv(
    partner_choices,
    paste0(
      file_path,
      partner_file_name
    )
  )

  # Write the parameters CSV file
  write.csv(
    data.frame(
      mu_alpha = c(participant_parameters[1], partner_parameters[1]),
      mu_beta = c(participant_parameters[2], partner_parameters[2]),
      row.names = c("ppt", "par")
    ),
    paste0(
      file_path,
      parameters_file_name
    )
  )

  # Get the request origin and update the response origin if it is valid
  request_origin <- as.character(.req$headers["origin"])
  log_debug(
    "Request origin: ", request_origin,
    namespace = "server"
  )

  # Configure the response body
  .res$set_body(toJSON(list(
    participantID = participant_id,
    participantParameters = toJSON(c(participant_parameters[1], participant_parameters[2])),
    partnerParameters = toJSON(c(partner_parameters[1], partner_parameters[2])),
    partnerChoices = toJSON(partner_choices)
  )))
  .res$set_content_type("text/plain")
}

# Specify the API endpoint and handler
application$add_get(path = api_route, FUN = handler)

# Start the server
backend <- BackendRserve$new()
backend$start(application, http_port = 8123)
