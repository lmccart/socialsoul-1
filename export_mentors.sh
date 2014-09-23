#!/bin/bash

mongoexport -d socialsoul -c mentors --jsonArray > data/mentors.json
