#!/bin/bash -ex

# sudo systemsetup -setusingnetworktime on
# sudo systemsetup -setrestartfreeze on
# sudo systemsetup -setrestartpowerfailure on

# sudo systemsetup -setsleep Never
# sudo systemsetup -setcomputersleep Never
# sudo systemsetup -setdisplaysleep Never

# configure poweron/shutdown schedule
sudo pmset repeat cancel # clear all scheduled events
sudo pmset repeat wakeorpoweron MTWRFSU "09:00:00" shutdown MTWRFSU "23:00:00"

# configure volume
osascript -e 'set volume alert volume 0'
osascript -e 'set volume output volume 100'

# disable safari popups
defaults write com.apple.coreservices.uiagent CSUIHasSafariBeenLaunched -bool YES
defaults write com.apple.coreservices.uiagent CSUIRecommendSafariNextNotificationDate -date 2050-01-01T00:00:00Z
defaults write com.apple.coreservices.uiagent CSUILastOSVersionWhereSafariRecommendationWasMade -float 10.99
