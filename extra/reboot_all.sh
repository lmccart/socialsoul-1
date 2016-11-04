#!/bin/bash -ex

# restart script for use from computers with passwordless SSH

ssh -o "StrictHostKeyChecking no" "socialsoul@socialsoulserver.local" "sudo reboot"

for i in {0..5}; do
  ssh -o "StrictHostKeyChecking no" "socialsoul@socialsoul${i}.local" "sudo reboot"
done
