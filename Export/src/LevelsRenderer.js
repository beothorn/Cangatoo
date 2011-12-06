function renderLoadForEachLevel(){
	var javascriptCode = "";
	var levels = game.getLevels();
	for(var i in levels){
		var levelName = levels[i].levelName;
		javascriptCode += "  this.loadLevel_"+levelName+" = function(){\n";
		javascriptCode += "    var level_"+levelName+" = new Level(\""+levelName+"\");\n";
				
		javascriptCode +=  getLevelEventsCode(levels[i]);
		javascriptCode +=  getLevelElementsCode(levels[i]);
		
		
		javascriptCode += "    game.addLevel(level_"+levelName+");\n";
		if(game.firstLevel.levelName == levelName){
			javascriptCode += "game.firstLevel = level_"+levelName+";\n";
		}
		javascriptCode += "  }\n";
	}
	
	return javascriptCode;
}

function renderLoadLevels(){
	var javascriptCode = "  this.loadLevels = function(){";
	var levels = game.getLevels();
	for(var i in levels){
		var levelName = levels[i].levelName;
		javascriptCode += "  this.loadLevel_"+levelName+"();\n";		
	}
	javascriptCode += "  }\n";
	
	return javascriptCode;
}

function getLevelEventsCode(level){
	var javascriptCode= "";
	var levelName = level.levelName;
	var events = game.getEventsForLevel(levelName);
	for(var j in events){
		var value = eval("level."+events[j]).toString();
		javascriptCode += "level_"+levelName+"."+events[j]+" = "+value+"\n";
	}
	
	return javascriptCode;
}

function getLevelElementsCode(level){
	var javascriptCode= "";
	var levelName = level.levelName;
	javascriptCode += "    level_"+levelName+".levelElements = [\n";
	var isFirstFactory = true;
	for(var elI in level.levelElements){
		for(var factoryName in level.levelElements[elI]){
			if(isFirstFactory){
				isFirstFactory = false;
			}else{
				javascriptCode += ",";
			}
			javascriptCode += "    {\""+factoryName+"\":[";
			var isFirstCoordinate = true;
			for(var j in level.levelElements[elI][factoryName]){
				if(isFirstCoordinate){
					isFirstCoordinate = false;
				}else{
					javascriptCode += ",";
				}
				//oh shit
				javascriptCode += "{x:"+level.levelElements[elI][factoryName][j]["x"]+",y:"+level.levelElements[elI][factoryName][j]["y"]+"}";
				//fix this
			}
			javascriptCode += "]}\n";
		}
	}
	javascriptCode += "    ];\n";
	return javascriptCode;
}
