#!/bin/bash

mongoimport --drop -d socialsoul --file data/mentors.json --jsonArray
