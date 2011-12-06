function renderHeader(){
	var gameVariableName = convertGameNameToVariable(game.gameName);
	var javascriptCode = 
		"/*\n"+
		"Save this code as "+ gameVariableName +".js and add to your html\n"+
		"For example:\n"+
		"<html>\n"+
	  "  <head>\n"+
	  "    <script type=\"text/javascript\" src=\""+game.gameName+"\"></script>\n"+
	  "  </head>\n"+
		"  <body>\n"+
		"    <canvas id=\"gameCanvas\" width=\""+canvas.width+"\" height=\""+canvas.height+"\"></canvas>\n"+
		"  </body>\n"+
		"</html>\n"+
		"*/\n"+
		"\n"+
		"window.onload = function(){\n"+
		"  startGame(document.getElementById(\"gameCanvas\"));\n"+
		"};\n"+
		"\n"+
		"//GAMECODE START\n"+
		"function "+gameVariableName+"(){\n";
		return javascriptCode;	
}
