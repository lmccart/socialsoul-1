#!/usr/bin/env bash

DIR=$(dirname "$0")

for ID in $(seq 0 5)
do
	USER=socialsoul
	SERVER="socialsoul$ID.local"
	AT="$USER@$SERVER"

	echo $AT

	# unload tabalive while we are loading
	# ssh $AT "launchctl unload ~/Library/LaunchAgents/com.tabalive.plist"

	# kill chrome
	ssh $AT "killall 'Google Chrome'"

	# disable chrome auto-update
	defaults write com.google.Keystone.Agent checkInterval 0

	# remove any files on the desktop
	# ssh $AT "rm ~/Desktop/*"
	# ssh $AT "mv ~/Desktop/* ~/Downloads/"

	# copy keepalive to LaunchAgents and Desktop respectively
	# rsync -a "$DIR/com.tabalive.plist" "$AT:~/Library/LaunchAgents/"
	# rsync -a "$DIR/keep-tab-alive.scpt" "$AT:~/Desktop/"

	# upload cliclick and start-chrome.scpt to server root
	# rsync -a "$DIR/cliclick" "$AT:~/Desktop/"
	# rsync -a "$DIR/start-chrome.scpt" "$AT:~/Desktop/"

	# run start-chrome.scpt on remote client (takes a while, should run in background)
	ssh $AT "osascript ~/Desktop/start-social-soul-screen.scpt" &
	
	# hide the menu bar (doesn't seem to work?)
	ssh $AT "defaults write NSGlobalDomain _HIHideMenuBar -bool true ; killall SystemUIServer" &

	# hide the dock
	ssh $AT "defaults write com.apple.dock autohide -bool true ; killall Dock"

	# load the LaunchAgent with launchctl. this also happens automatically on boot.
	# ssh $AT "launchctl load -w ~/Library/LaunchAgents/com.tabalive.plist" &
done
