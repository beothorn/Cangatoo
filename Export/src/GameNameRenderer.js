function renderGameName(){
	var gameNameFunction = "\n"+
	"  this.setGameName = function(){\n"+
	"    game.gameName = \""+game.gameName+"\";\n"+
	"  }\n";
	return gameNameFunction;
}
