#!/usr/bin/env bash

for ID in $(seq 0 5)
do
	USER=socialsoul
	SERVER="socialsoul$ID.local"
	AT="$USER@$SERVER"

	echo $AT
	
	# just connect
	# ssh $AT

	# edit sudoers to allow calling reboot, shutdown, etc. without a password
	# you need to run this by hand after connecting (above), i don't know how to execute it via ssh
	# (only once). do not uncomment the next line!
	# sudo bash -c 'echo "ALL ALL=(ALL) NOPASSWD: ALL" | (EDITOR="tee -a" visudo)'

	# do not reopen windows on reboot and restart
	ssh -tt $AT "killall 'Google Chrome' ; \
		defaults write -g ApplePersistence -bool no ; \
		sudo reboot" &
done