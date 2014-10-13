#!/bin/bash -ex

# restart script for use from computers with passwordless SSH

ssh -o "StrictHostKeyChecking no" "socialsoulserver@socialsoulserver.local" "sudo reboot"

for i in {0..4}; do
  ssh -o "StrictHostKeyChecking no" "socialsoul@socialsoul${i}.local" "sudo reboot"
done
