function renderFooter(){
	var gameVariableName = convertGameNameToVariable(game.gameName);
	var footerCode =
	"\n"+
	"};\n"+
	"\n"+
	"setGameToLoad(new "+gameVariableName+"());\n"+
	"\n"+
	"//GAMECODE END\n"+
	"\n";
	return footerCode;
}
