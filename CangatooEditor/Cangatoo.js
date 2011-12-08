var editMode = false;

function stringToFunction(code){
	var replaceFunction = null;
	eval("replaceFunction = "+code);
	return replaceFunction;
};

function getOnlyGameCode(code) {
	var customCodeStart = "//GAMECODE START";
	var customCodeEnd   = "//GAMECODE END";
	var s = code;
	var i = s.indexOf(customCodeStart);
	if (i >= 0) {
		s = s.substring(i + customCodeStart.length);
	}
	i = s.indexOf(customCodeEnd);
	if (i >= 0) {
		s = s.substring(0, i);
	}
	return s;
};

function setGameToLoad(newGameCode){
	gameCode = newGameCode;
}

function Cangatoo(){
	
	this.startGame = function(gameCanvas){
		startGame(gameCanvas);
	};
	
	this.newGame = function(){
		game.newGame();
	};
	
	this.restartLevel = function(){
		editMode = false;
		game.restartCurrentLevel();
		play();
	};	
	
	this.addLevel = function(levelName){
		var level = new Level(levelName);
		game.addLevel(level);
	};
	
	this.pause = function(){
		pause();
	};
	
	this.play = function(){
		editMode = false;
		play();
	};
	
	this.editLevel = function(){
		editMode = true;
		game.restartCurrentLevel();
		pause();
	};
	
	this.addElementFromFactory = function(x,y,factoryName){
		var factory = game.getFactoryByName(factoryName);
		if(editMode){
			factory.addElementToCreateAt(x,y);
		}else{
			factory.addElementAt(x,y);
		}
		game.redraw();
	};
	
	this.removeElement = function(x,y){
		var elementToRemove = game.getObjectOnPoint(x,y);
		level.removeElementFromLevelCreation(elementToRemove);
		kill(elementToRemove);
		game.redraw();
	};
	
	this.getLevels = function(){
		var levelNames = game.getLevelNames();
		return levelNames;
	};
	
	this.getLevelEvents = function(levelName){
		if(levelName == ""){			
			return null;
		}
		var events = game.getEventsForLevel(levelName);
		return events;
	};
	
	this.getLevelEventCode = function(levelName,eventName){
		var level = game.getLevelByName(levelName);
		return level[eventName].toString();
	};
	
	this.setLevelEventCode = function(levelName,eventName,code){
		var level = game.getLevelByName(levelName);
		var replaceFunction = stringToFunction(code);
		level[eventName] = replaceFunction;
	};
	
	this.addFactory = function(factoryName){
		var factory = new ElementFactory(factoryName);
		game.addFactory(factory);
	};
	
	this.getFactoriesNames = function(){
		return game.getFactoriesNames();
	};
	
	this.getFactoryEvents = function(factoryName){
		return game.getEventsFor(factoryName);
	};
	
	this.getFactoryEventCode = function(factoryName,eventName){
		var factory = game.getFactoryByName(factoryName);
		return factory[eventName].toString();
	};
	
	this.setFactoryEventCode = function(factoryName,eventName,code){
		var factory = game.getFactoryByName(factoryName);
		var replaceFunction = stringToFunction(code);
		factory[eventName] = replaceFunction;
	};
	
	this.removeFactory = function(factoryName){
		game.removeFactoryByName(factoryName);
	};
	
	this.loadGameCode = function(codeToLoad){
		eval(getOnlyGameCode(codeToLoad));
		restartGame();
	};
}