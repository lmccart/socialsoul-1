#!/usr/bin/env bash

for ID in $(seq 0 5)
do
	USER=socialsoul
	SERVER="socialsoul$ID.local"
	AT="$USER@$SERVER"

	echo $AT

	# kill chrome
	ssh $AT "killall 'Google Chrome' && defaults write com.google.Keystone.Agent checkInterval 0" &
	
done
