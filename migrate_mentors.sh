#!/bin/bash -ex

MONGO="mongo socialsoul";
echo "db.mentors.drop();" | $MONGO;
echo "db.mentors.ensureIndex({user: 1}, {unique: true});" | $MONGO;
while read line; do
	echo "db.mentors.insert({user: \"$line\"});" | $MONGO;
done <data/mentors.txt
