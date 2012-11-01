function renderSetup(){
	var setupCode =
	"\n"+
	"  this.setup = function(){\n"+
	"    this.setCanvasProperties();\n"+
	"    this.setResources();\n"+
	"    this.setGameName();\n"+
	"    this.loadFactories();\n"+
	"    this.loadLevels();\n"+
	"  };\n";
	return setupCode;
}
