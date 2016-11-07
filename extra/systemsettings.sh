#!/bin/bash -ex

# sudo systemsetup -setusingnetworktime on
# sudo systemsetup -setrestartfreeze on
# sudo systemsetup -setrestartpowerfailure on

# sudo systemsetup -setsleep Never
# sudo systemsetup -setcomputersleep Never
# sudo systemsetup -setdisplaysleep Never

# configure poweron/shutdown schedule
sudo pmset repeat cancel # clear all scheduled events
# sudo pmset repeat wakeorpoweron MTWRFSU "09:00:00" shutdown MTWRFSU "23:00:00"
sudo pmset repeat wakeorpoweron MTWRFSU "11:52:00" shutdown MTWRFSU "11:54:00"

# configure volume
osascript -e 'set volume alert volume 0'
osascript -e 'set volume output volume 100'
