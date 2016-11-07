#!/bin/bash -ex

cd $(dirname $0)

# add this line to ~/.ssh/ssh_config if it's not present 
KEY_CHECKING="StrictHostKeyChecking no"
grep -q -F "$KEY_CHECKING" ~/.ssh/ssh_config || echo "$KEY_CHECKING" >> ~/.ssh/ssh_config

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

	ssh $AT < systemsettings.sh

	ssh $AT "sudo systemsetup -gettimezone"

	# unload the LaunchAgent, return true even if it doesn't exist 
	ssh $AT "launchctl unload -w ~/Library/LaunchAgents/$LAUNCH_AGENT || true"

	rsync -a "LaunchAgents.screen/$LAUNCH_AGENT" "$AT:~/Library/LaunchAgents/"
	rsync -a "Desktop.screen/" "$AT:~/Desktop/"

	ssh $AT "launchctl load -w ~/Library/LaunchAgents/$LAUNCH_AGENT"
done
