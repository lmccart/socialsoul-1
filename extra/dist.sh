#!/bin/bash -ex

cd $(dirname $0)

# Server setup
SERVER="socialsoulserver.local"
LOGIN="socialsoulserver@$SERVER"
ssh -o "StrictHostKeyChecking no" $LOGIN "cd /socialsoul && git fetch && git reset --hard origin/master"
ssh -o "StrictHostKeyChecking no" $LOGIN < systemsettings.sh
ssh -o "StrictHostKeyChecking no" $LOGIN "sudo launchctl unload -w /Library/LaunchDaemons/*"
ssh -o "StrictHostKeyChecking no" $LOGIN "sudo rm /Library/LaunchDaemons/*"
scp -o "StrictHostKeyChecking no" LaunchDaemons.server/* "$LOGIN:/Library/LaunchDaemons"
scp -o "StrictHostKeyChecking no" "start-social-soul-exit.scpt" "$LOGIN:/Users/socialsoulserver/Desktop/start-social-soul-exit.scpt"
ssh -o "StrictHostKeyChecking no" $LOGIN "sudo launchctl load -w /Library/LaunchDaemons/*"

# Client setup
for i in {0..4} ; do
	SERVER="socialsoul${i}.local"
	LOGIN="socialsoul@$SERVER"
	ssh -o "StrictHostKeyChecking no" $LOGIN < systemsettings.sh
	ssh -o "StrictHostKeyChecking no" $LOGIN "sudo launchctl unload -w /Library/LaunchDaemons/*"
	ssh -o "StrictHostKeyChecking no" $LOGIN "sudo rm /Library/LaunchDaemons/*"
	scp -o "StrictHostKeyChecking no" LaunchDaemons.screen/* "$LOGIN:/Library/LaunchDaemons"
	scp -o "StrictHostKeyChecking no" "start-social-soul-screen.scpt" "$LOGIN:/Users/socialsoul/Desktop/start-social-soul-screen.scpt"
	ssh -o "StrictHostKeyChecking no" $LOGIN "sudo launchctl load -w /Library/LaunchDaemons/*"
done
