#!/usr/bin/env bash

for ID in $(seq 0 5)
do
	USER=socialsoul
	SERVER="socialsoul$ID.local"
	AT="$USER@$SERVER"

	echo $AT
	
	# do not reopen windows on restart
	ssh -tt $AT "killall 'Google Chrome' ; defaults write -g ApplePersistence -bool no ; sudo reboot" &
done

# reboot server
killall 'Google Chrome' ; defaults write -g ApplePersistence -bool no ; sudo reboot