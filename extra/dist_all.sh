#!/bin/bash -ex

cd $(dirname $0)

# Server setup
# this is useful once everything is configured, to avoid letting changes persist
# SERVER="socialsoulserver.local"
# LOGIN="socialsoul@$SERVER"
# ssh $LOGIN "cd ~/Documents/socialsoul && git fetch && git reset --hard origin/master"
# ssh $LOGIN < systemsettings.sh
# ssh $LOGIN "sudo launchctl unload -w /Library/LaunchDaemons || true"
# ssh $LOGIN "sudo rm -rf /Library/LaunchDaemons /Users/socialsoul/Desktop"
# rsync --delete -r -e ssh LaunchDaemons.server "$LOGIN:/tmp/"
# rsync --delete -r -e ssh Desktop.server "$LOGIN:/tmp/"
# ssh $LOGIN "sudo mv /tmp/LaunchDaemons.server /Library/LaunchDaemons"
# ssh $LOGIN "sudo chown -R root /Library/LaunchDaemons"
# ssh $LOGIN "mv /tmp/Desktop.server /Users/socialsoul/Desktop"
# ssh $LOGIN "sudo launchctl load -w /Library/LaunchDaemons"

# Client setup
for ID in $(seq 0 5)
do
	CLIENT_USER="socialsoul"
	CLIENT_ADDRESS="socialsoul$ID.local"
	AT="$CLIENT_USER@$CLIENT_ADDRESS"

	LAUNCH_AGENT="com.socialsoul.screen.plist"

	echo "Connectin to $AT"

	ssh $AT < systemsettings.sh

	# unload the LaunchAgent, return true even if it doesn't exist 
	ssh $AT "sudo launchctl unload -w ~/Library/LaunchAgents/$LAUNCHAGENT || true"

	# delete LaunchAgent and any files on the Desktop
	ssh $AT "sudo rm -rf ~/Library/LaunchAgents/$LAUNCHAGENT ~/Desktop/*"

	rsync --delete -r -e ssh "LaunchDaemons.screen" "$LOGIN:/tmp/"
	rsync --delete -r -e ssh "Desktop.screen" "$LOGIN:/tmp/"
	ssh $AT "sudo mv /tmp/LaunchDaemons.screen /Library/LaunchDaemons"
	ssh $AT "sudo chown -R root /Library/LaunchDaemons"
	ssh $AT "mv /tmp/Desktop.screen/* /Users/socialsoul/Desktop"
	ssh $AT "sudo launchctl load -w /Library/LaunchDaemons"
done
