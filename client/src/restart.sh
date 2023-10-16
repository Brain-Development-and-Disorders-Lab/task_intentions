#!/bin/sh
# Kill any existing processes using the server port
kill -9 $(lsof -i:8123 -t)
# Change into the absolute path
cd /home/path.../
# Start the server
/usr/local/bin/yarn start:server
