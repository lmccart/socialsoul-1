#!/usr/bin/env bash

for ID in $(seq 0 5)
do
	USER=socialsoul
	SERVER="socialsoul$ID.local"
	AT="$USER@$SERVER"

	echo $AT
	
	# just connect
	ssh $AT

	# edit sudoers to allow calling reboot, shutdown, etc. without a password
	# you need to run this by hand after connecting (above), i don't know how to execute it via ssh
	# (only once). do not uncomment the next line!
	echo "Paste the following line:"
	echo "sudo bash -c 'echo \"ALL ALL=(ALL) NOPASSWD: ALL\" | (EDITOR=\"tee -a\" visudo)'"
	echo "Then enter the password."
	echo "Then press CTRL-D to exit the ssh connection and move onto the next client."
done

echo "Finally, paste the following line on the server:"
echo "sudo bash -c 'echo \"ALL ALL=(ALL) NOPASSWD: ALL\" | (EDITOR=\"tee -a\" visudo)'"