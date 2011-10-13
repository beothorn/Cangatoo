function loadRestAndSetElementText(game,element, includes){
	
	var javascriptCode = 
		"/**"+
		"Save this code as "+ game.gameName +".js and add to your html\n"+
		"<script type=\"text/javascript\" src=\""+game.gameName+"\"></script>\n"+
		" and the canvas\n"+
		"<canvas id=\"gameCanvas\" width=\""+game.width+"\" height=\""+game.height+"\"></canvas>\n"+
		"*/\n";
	
	javascriptCode += "function setupGame(game){\n";
	javascriptCode += "  game.gameName = \""+game.gameName+"\";\n";	
	
	javascriptCode += this.getFactoriesCode(game);
	
	javascriptCode += this.getLevelsCode(game);
	
	javascriptCode += "\n}\n";
	
	javascriptCode += "//INCLUDES\n";
	javascriptCode += includes;
	
	javascriptCode += 
		"window.onload = function(){\n"+
		"  startGame(document.getElementById(\"gameCanvas\"));\n"+
		"};\n"; 
	
	element.val(javascriptCode);
}
	
function getFactoriesCode(game){
	var javascriptCode = "";
	var factories = game.getFactories();
	for(var i in factories){
		var factoryName = factories[i].factoryName;
		var events = game.getEventsFor(factoryName);
		javascriptCode += "var factory_"+factoryName+" = new ElementFactory(\""+factoryName+"\");\n";
		for(var j in events){
			var value = eval("factories[i]."+events[j]).toString();
			javascriptCode += "factory_"+factoryName+"."+events[j]+" = "+value+"\n\n";
		}
		javascriptCode += "\ngame.addFactory(factory_"+factoryName+");\n";
	}
	return javascriptCode;
}
	
function getLevelsCode(game){
	var javascriptCode = "";
	var levels = game.getLevels();
	for(var i in levels){
		var levelName = levels[i].levelName;
		var events = game.getEventsForLevel(levelName);
		javascriptCode += "function "+levelName+"(){\n";
		
		javascriptCode += "this.levelName = \""+levelName+"\";\n";
		
		var loadLevelOnGame = eval("levels[i].loadLevelOnGame").toString();
		javascriptCode += "this.loadLevelOnGame = "+loadLevelOnGame+"\n";
		
		for(var j in events){
			var value = eval("levels[i]."+events[j]).toString();
			javascriptCode += "this."+events[j]+" = "+value+"\n";
		}
		javascriptCode += "}\n";
		javascriptCode += "\ngame.addLevel(new "+levelName+"() );\n";
	}
	
	return javascriptCode;
}
	
var includeCount = 0;
function exportJSTo(game,element,includes){
	var javascriptCode = "";
	
	includeCount = 0;
	for(var i in include){
		element.load(include[i],null,function(responseText){
			
			javascriptCode += responseText;
			includeCount++;
			if(includeCount == include.length){
				loadRestAndSetElementText(game,element,javascriptCode);
			}
		});
	};
}
