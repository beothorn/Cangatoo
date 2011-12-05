function renderFooter(){
	var gameVariableName = convertGameNameToVariable(game.gameName);
	var footerCode =
	"\n"+
	"}\n"+
	"\n"+
	"setGameToLoad(new "+gameVariableName+"());\n"+
	"\n"+
	"window.onload = function(){\n"+
	"  startGame(document.getElementById(\"gameCanvas\"));\n"+
	"};\n";
	return footerCode;
}
