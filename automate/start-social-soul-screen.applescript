set baseUrl to "http://socialsoulserver.local:3000/screen/:"
set screenWidth to 1920
set screenHeight to 1080

set computerName to computer name of (system info)
set computerId to character -1 of computerName as integer
set leftUrl to baseUrl & (computerId * 2 + 0)
set rightUrl to baseUrl & (computerId * 2 + 1)

tell application "Google Chrome"
	activate
	close every window
	
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
delay 5
tell application "System Events" to key code 53