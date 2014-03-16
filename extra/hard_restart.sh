forever stopall
cd ../../
forever start -o logs/out.log -e logs/err.log --spinSleepTime 1000 --minUptime 5000 app.js