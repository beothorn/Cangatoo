function Game(){
	this.lastLoopTime = new Date().getTime();
	this.elementFactories = new Array();
	this.levels = new Array();
	
	this.gameName = "New game";
	this.width = 500;
	this.height = 300;

	this.context = canvas.getContext('2d');
	
	this.gameLoop = function(globalGameState){
		var currentTime = new Date().getTime();
		var delta = currentTime - this.lastLoopTime;
		if(delta>40) delta = 40;
		this.onClick(globalGameState);
		this.stepElements(delta,globalGameState);
		this.testCollisions(delta);
		this.drawelementFactories(delta);
		this.lastLoopTime = new Date().getTime();
	};
	
	this.goToFirstLevel = function(){
		if(this.firstLevel == null)
			this.internalLoadLevel(this.levels[0]);
		this.internalLoadLevel(this.firstLevel);
	};
	
	this.goToNextLevel = function(){
		var nextLevelIndex = this.levels.indexOf(level)+1;
		var nextLevel = this.levels[nextLevelIndex];
		if(nextLevel == null)
			throw "Next level doesn't exist.";
		this.internalLoadLevel(nextLevel);
	};
	
	this.goToPreviousLevel = function(){
		var currentLevelIndex = this.levels.indexOf(level);
		if(currentLevelIndex == 0)
			throw "Previous level doesn't exist.";
		var previousLevelIndex = currentLevelIndex-1;
		var previousLevel = this.levels[previousLevelIndex];
		this.internalLoadLevel(previousLevel);
	};
	
	this.levelExists = function(levelName){
		return this.getLevelByName(levelName) != null;
	};
	
	this.getLevelByName = function(levelName){
		for (var i in this.levels){
			if(this.levels[i].levelName == levelName)
				return this.levels[i];
		}                                                        
		return null;
	};                               
	
	this.setLevel = function(_level){
		level = _level;
	};
	
	this.clear = function(){
		this.elementFactories = new Array();
		this.levels = new Array();
	};
	
	this.reset = function(){
		this.goToFirstLevel();
	};
	
	this.loadLevelOnGame = function(){ 
		for(var i in level.levelElements){
			for(var factoryName in level.levelElements[i]){
				this.getFactoryByName(factoryName).addElementsAt(level.levelElements[i][factoryName]);
			}
		}
	};
	
	this.restartCurrentLevel = function(){
		for (var i in this.elementFactories){
			this.elementFactories[i].restartFactory();
		}
		this.loadLevelOnGame();
		self = level; 
		level.onLoadLevel();
		this.redraw();
	};
	
	this.redraw = function(){
		this.drawelementFactories(0);
	};
	
	this.internalLoadLevel = function(level){
		this.setLevel(level);
		this.restartCurrentLevel();
	};
	
	this.loadLevel = function(levelName){		
		var level = this.getLevelByName(levelName);
		this.internalLoadLevel(level);      
	};
	
	this.getLevels = function(){
		return this.levels;
	};
	
	this.getFactories = function(){
		return this.elementFactories;
	};

	this.addFactory = function(factory){
		var nameAddition = 1;
		var factoryName = factory.factoryName;
		while(this.factoryExists(factoryName)){
			factoryName = factory.factoryName+nameAddition;
			nameAddition++;
		}
		factory.factoryName = factoryName;
		this.elementFactories.push(factory);
	};
	
	this.addLevel = function(level){
		var nameAddition = 1;
		var levelName = level.levelName;
		while(this.levelExists(levelName)){
			levelName = level.levelName+nameAddition;
			nameAddition++;
		}
		level.levelName = levelName;
		this.levels.push(level);
	};
	
	this.removeFactoryByName = function(factoryName){
		for (var i in this.elementFactories){
			if(this.elementFactories[i].factoryName == factoryName){
				this.elementFactories.splice(i,1);
				return;
			}
		}
	};

	this.isObjectOnPoint = function(x,y,factory){
		return factory.isObjectOnPoint(x,y);
	};
	
	this.isThereAnObjectOnPoint = function(x,y){
		for (var i in this.elementFactories)
		{
			if(this.isObjectOnPoint(x,y,this.elementFactories[i])){
				return true;
			}
		}
		return false;
	};
	
	this.getObjectOnPoint = function(x,y){
		for (var i in this.elementFactories)
		{
			var elementOnPoint = this.elementFactories[i].getObjectOnPoint(x,y); 
			if( elementOnPoint != null ){
				return elementOnPoint;
			}
		}
		return null;
	};

	this.testCollisions = function(delta){
		var i;
		var j;
		for(i=0;i<this.elementFactories.length-1;i++){
			var factory = this.elementFactories[i];
			factory.testCollisionWith(factory,delta);
		}
		for(i=0;i<this.elementFactories.length-1;i++){
			 var factory1 =this.elementFactories[i];
			 for(j=i+1;j<this.elementFactories.length;j++){
			 	 var factory2 =this.elementFactories[j];
				 factory1.testCollisionWith(factory2,delta);
				 factory2.testCollisionWith(factory1,delta);
			 }
		 }		
	};
	
	this.drawelementFactories = function(delta){
		if(level.backgroundColor == null){
			this.context.fillStyle = "white";
		}else{				
			this.context = level.backgroundColor ;
		}
		this.context.fillRect(0, 0, canvas.width, canvas.height);
		
		if(level.backgroundImage == null){
		}else{
			this.context.clearRect(0, 0, canvas.width, canvas.height);
			this.context.drawImage(level.backgroundImage,0,0);
		}
		for (var i in this.elementFactories)
		{
			this.elementFactories[i].draw(this.context,delta);
		}
	};
	
	this.stepElements = function(delta,globalGameState){
		for (var i in this.elementFactories)
		{
			this.elementFactories[i].step(delta,globalGameState);
		}
	};

	this.onClick = function(globalGameState){
		if(globalGameState.click == null)
			return;
		
		for (var i in this.elementFactories)
		{
			this.elementFactories[i].click(globalGameState.click);
		}
		globalGameState.click = null;
	};
	
	this.getLevelNames = function(){
		var levelsNames = new Array();
		for (var i in this.levels){
			levelsNames.push(this.levels[i].levelName);
		}
		return levelsNames;
	};
	
	this.getFactoriesNames = function(){
		var factoriesNames = new Array();
		for (var i in this.elementFactories){
			factoriesNames.push(this.elementFactories[i].factoryName);
		}
		return factoriesNames;
	};

	this.getEventsForLevel = function(levelName){
		var level = this.getLevelByName(levelName);
		if(level == null)
			throw "level "+levelName+" does not exist";

		var events = new Array();
		for(var property in level){
			if(typeof(eval("level."+property)) == 'function' && property.indexOf("on")==0)
				events.push(property);
		}
		return events;
	};
	
	this.getEventsFor = function(factoryName){
		var factory = this.getFactoryByName(factoryName);
		if(factory == null)
			throw "factory "+factoryName+" does not exist";

		var events = new Array();
		for(var property in factory){
			if(typeof(eval("factory."+property)) == 'function' && property.indexOf("on")==0)
				events.push(property);
		}
		return events;
	};

	this.factoryExists = function(factoryName){
		return this.getFactoryByName(factoryName) != null;
	};
	
	this.getFactoryByName = function(factoryName){
		for (var i in this.elementFactories){
			if(this.elementFactories[i].factoryName == factoryName)
				return this.elementFactories[i];
		}
		return null;
	};
}
