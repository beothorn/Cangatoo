function renderLoadForEachFactory(){
	var javascriptCode = "\n";
	var factories = game.getFactories();
	for(var i in factories){
		var factoryName = factories[i].factoryName;
		javascriptCode += "	this.loadFactory_"+factoryName+" = function(){\n";
		var events = game.getEventsFor(factoryName);
		javascriptCode += "    var factory_"+factoryName+" = new ElementFactory(\""+factoryName+"\");\n";
		for(var j in events){
			var value = eval("factories[i]."+events[j]).toString()+";";
			javascriptCode += "    factory_"+factoryName+"."+events[j]+" = "+value+"\n\n";
		}
		javascriptCode += "    game.addFactory(factory_"+factoryName+");\n";
		javascriptCode += "  };\n";
	}
	return javascriptCode;
}

function renderLoadFactories(){
	var javascriptCode = "\n"+
	"  this.loadFactories = function(){\n";
	var factories = game.getFactories();
	for(var i in factories){
		var factoryName = factories[i].factoryName;
		javascriptCode += "    this.loadFactory_"+factoryName+"();\n";
	}
	javascriptCode += "  };\n";
	return javascriptCode;
}
