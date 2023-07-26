#!/bin/sh
# Kill any existing processes using the server port
kill -9 $(lsof -i:8123 -t)
# Change into the absolute path
cd /path/to/client
# Start the server
/usr/local/bin/yarn start:server

# Crontab file contents:
# PATH=/usr/local/bin:/usr/bin:/usr/sbin:$PATH
# * * * * * /path/to/client/restart.sh 1> /dev/null 2> /path/to/client/log.err
