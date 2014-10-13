#!/bin/bash -ex

# this runscript allows us to capture the script
# output when running with launchd
/usr/local/bin/node app.js >> logs/out.log 2>> logs/err.log
