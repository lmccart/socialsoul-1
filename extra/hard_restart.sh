#!/bin/bash
cd /Users/socialsoulserver/socialsoul
./extra/start_all.exp
/usr/local/bin/forever stopall
/usr/local/bin/forever start -o logs/out.log -e logs/err.log --spinSleepTime 1000 --minUptime 5000 app.js
