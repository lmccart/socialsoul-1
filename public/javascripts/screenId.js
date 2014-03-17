// show the screen number on startup
var screenId = parseInt(window.location.search.substring(1), 10);
document.title = screenId;
document.write('<div class="debug" id="screenId">'+screenId+"</div>");