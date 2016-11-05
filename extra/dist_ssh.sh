#!/usr/bin/env bash

# generate ssh key on server
# (only once)
ssh-keygen -f ~/.ssh/id_rsa -t rsa -N ''

SSH_KEY=`cat ~/.ssh/id_rsa.pub`

for ID in $(seq 0 5)
do
	USER=socialsoul
	SERVER="socialsoul$ID.local"
	AT="$USER@$SERVER"

	echo $AT

	# generate ssh key on remote client & create ~/.ssh directory
	# (only once)
	ssh -t $AT "ssh-keygen -f ~/.ssh/id_rsa -t rsa -N ''"

	# remove authorized_keys
	# (only once)
	ssh $AT "rm ~/.ssh/authorized_keys"

	# write ssh key to authorized keys
	# (only once)
	# smarter version would check that the file exists & the key is not already present
	ssh -t $AT "echo \"$SSH_KEY\" >> ~/.ssh/authorized_keys"
done
