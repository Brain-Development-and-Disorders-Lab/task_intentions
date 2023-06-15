#!/bin/zsh
# Kill any existing processes using the server port
kill -9 $(lsof -i:8123 -t)
# Change into the absolute path
cd /Users/henry/Documents/GitHub/task_intentions/client
# Start the server
/usr/local/bin/yarn start:server

# File:
# PATH=/usr/local/bin:/usr/sbin:$PATH
# * * * * * /<absolute path>/restart.sh
