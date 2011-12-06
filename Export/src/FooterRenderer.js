function renderFooter(){
	var gameVariableName = convertGameNameToVariable(game.gameName);
	var footerCode =
	"\n"+
	"}\n"+
	"\n"+
	"setGameToLoad(new "+gameVariableName+"());\n"+
	"\n"+
	"//#############################################################################\n"+
	"\n";
	return footerCode;
}
