#!/bin/sh
# Description: Shell script to kill and restart the server periodically
# Uses a cron job to kill existing processes using the server
# port and restart the server.
# Author: Henry Burgess <henry.burgess@wustl.edu>

# Kill any existing processes using the server port
kill -9 $(lsof -i:8123 -t)

# Change to the absolute path
cd /path/to/client

# Start the server
/usr/local/bin/yarn start:server

# Note: The following commented code should be inserted into a new cron
# job, created using the command `crontab -e`.
# PATH=/usr/local/bin:/usr/bin:/usr/sbin:$PATH
# * * * * * /path/to/client/restart.sh 1> /dev/null 2> /path/to/client/log.err
