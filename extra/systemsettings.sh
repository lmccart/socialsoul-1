#!/bin/bash -ex

sudo systemsetup -setusingnetworktime on
sudo systemsetup -setrestartfreeze on
sudo systemsetup -setrestartpowerfailure on

sudo systemsetup -setsleep Never
sudo systemsetup -setcomputersleep Never
sudo systemsetup -setdisplaysleep Never

# configure poweron/shutdown schedule
# sudo pmset repeat cancel
# sudo pmset repeat wakeorpoweron MTWRF "09:00:00" shutdown MTWRFSU "22:00:00"

# configure volume
# sudo osascript -e 'set volume alert volume 0'
# sudo osascript -e 'set volume output volume 100'

echo "Finished systemsettings.sh"