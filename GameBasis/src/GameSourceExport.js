function GameSourceExport(){
	this.getJavascriptSourceForGame = function(game){
		var javascriptCode = "\nfunction setupFactories(game){\n";
		var factories = game.getFactories();
		for(var i in factories){
			var factoryName = factories[i].factoryName;
			var events = game.getEventsFor(factoryName);
			javascriptCode += "  var factory_"+factoryName+" = new ElementFactory(\""+factoryName+"\");\n";
			for(var j in events){
				var value = eval("factories[i]."+events[j]).toString();
				javascriptCode += "  factory_"+factoryName+"."+events[j]+" = "+value+"\n\n";
			}
			javascriptCode += "\n  game.addFactory(factory_"+factoryName+");\n";
		}
		javascriptCode += "\n}\n";
		return javascriptCode;
	}
}
