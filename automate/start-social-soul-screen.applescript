set baseUrl to "http://socialsoulserver.local:3000/screen/:"
set screenWidth to 1920
set screenHeight to 1080

repeat
	tell application "Finder" to set displayResolution to the bounds of the window of the desktop
	set displayLeft to item 1 of displayResolution
	set displayRight to item 3 of displayResolution
	set displayWidth to (displayRight - displayLeft)
	if displayWidth > screenWidth then
		exit repeat
	else
		-- wait for both screens to be turned on
		delay 1
	end if
end repeat

set computerName to computer name of (system info)
set computerId to character -1 of computerName as integer
set leftUrl to baseUrl & (computerId * 2 + 0)
set rightUrl to baseUrl & (computerId * 2 + 1)

tell application "Google Chrome"
	activate
	close every window
	
	-- give partial presentation mode time to exit
	delay 3
	
	set leftWindow to make new window
	set bounds of leftWindow to {0, 0, screenWidth, screenHeight}
	set URL of leftWindow's active tab to leftUrl
	tell leftWindow to enter presentation mode
	
	set rightWindow to make new window
	set bounds of rightWindow to {screenWidth, 0, 2 * screenWidth, screenHeight}
	set URL of rightWindow's active tab to rightUrl
	tell rightWindow to enter presentation mode
	
end tell

-- temporarily hide the cursor in chrome
delay 3
tell application "System Events" to key code 53