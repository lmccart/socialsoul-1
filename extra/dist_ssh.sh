#!/usr/bin/env bash

# This script should be run only once. If it's run multiple times,
# it will just add multiple entries to ~/.ssh/authorized_keys
# When you run this script you will need to type the password 6 times.

# private key (to be generated or re-used)
SERVER_USER=`whoami`
SSH_FILE="/Users/$SERVER_USER/.ssh/id_rsa"

# generate ssh key on server if it doesn't exist
if [ ! -e "$SSH_FILE" ]; then
	echo "Couldn't find $SSH_FILE you should generate an ssh key first."
	# ssh-keygen -f "$SSH_FILE" -t rsa -N ''
fi

SSH_KEY=`cat $SSH_FILE.pub`

for ID in $(seq 0 5)
do
	CLIENT_USER="socialsoul"
	CLIENT_ADDRESS="socialsoul$ID.local"
	AT="$CLIENT_USER@$CLIENT_ADDRESS"

	echo "Connecting to $AT"

	# create ~/.ssh folder if it doesn't exist
	echo "Creating ~/.ssh folder on $CLIENT_ADDRESS"
	ssh $AT "mkdir -p ~/.ssh/"

	# write ssh key to authorized keys
	echo "Copying ssh key to ~/.ssh/authorized_keys"
	ssh -t $AT "echo \"$SSH_KEY\" >> ~/.ssh/authorized_keys"
done
