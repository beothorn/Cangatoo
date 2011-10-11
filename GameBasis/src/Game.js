function Game(drawCanvas){
	this.lastLoopTime = new Date().getTime();
	this.elementFactories = new Array();//TODO: should be a map
	this.levels = new Array();

	this.canvas = drawCanvas;
	this.context = this.canvas.getContext('2d');
	
	this.getLevelByName = function(levelName){
		for (var i in this.levels){
			if(this.levels[i].levelName == levelName)
				return this.levels[i];
		}                                                        
		throw "Level '"+levelName+"' doesn't exist.";
	}                                  
	
	this.setLevel = function(level){
		this.currentLevel = level;
	}
	
	this.restartCurrentLevel = function(){
		for (var i in this.elementFactories){
			this.elementFactories[i].restartFactory();
		}
		
		this.currentLevel.loadLevel(this);
		this.redraw();
	}
	
	this.redraw = function(){
		this.drawelementFactories(0);
	}
	
	this.loadLevel = function(levelName){		
		var level = this.getLevelByName(levelName);
		this.setLevel(level);
		this.restartCurrentLevel();            
	}
	
	this.getFactories = function(){
		return this.elementFactories;
	}

	this.addFactory = function(factory){
		this.elementFactories.push(factory);
	}
	
	this.addLevel = function(level){
		this.levels.push(level);
	}
	
	this.removeFactoryByName = function(factoryName){
		for (var i in this.elementFactories){
			if(this.elementFactories[i].factoryName == factoryName){
				this.elementFactories.splice(i,1);
				return;
			}
		}
	}

	this.isObjectOnPoint = function(x,y,factory){
		return factory.isObjectOnPoint(x,y);
	}
	
	this.isThereAnObjectOnPoint = function(x,y){
		for (var i in this.elementFactories)
		{
			if(this.isObjectOnPoint(x,y,this.elementFactories[i])){
				return true;
			}
		}
		return false;
	}

	this.testCollisions = function(delta){
		var i;
		var j;
		for(i=0;i<this.elementFactories.length-1;i++){
			 var factory1 =this.elementFactories[i];
			 for(j=i+1;j<this.elementFactories.length;j++){
			 	 var factory2 =this.elementFactories[j];
				 factory1.testCollisionWith(factory2,delta);
				 factory2.testCollisionWith(factory1,delta);
			 }
		 }		
	}
	
	this.drawelementFactories = function(delta){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (var i in this.elementFactories)
		{
			this.elementFactories[i].draw(this.context,delta);
		}
	}
	
	this.stepElements = function(delta,globalGameState){
		for (var i in this.elementFactories)
		{
			this.elementFactories[i].step(delta,globalGameState, this);
		}
	}

	this.onClick = function(globalGameState){
		if(globalGameState.click == null)
			return;
		
		for (var i in this.elementFactories)
		{
			this.elementFactories[i].click(globalGameState.click);
		}
		globalGameState.click = null;
	}

	this.gameLoop = function(globalGameState){
		var currentTime = new Date().getTime();
		var delta = currentTime - this.lastLoopTime;
		if(delta>40) delta = 40;
		this.onClick(globalGameState);
		this.stepElements(delta,globalGameState);
		this.testCollisions(delta);
		this.drawelementFactories(delta);
		this.lastLoopTime = new Date().getTime();
	}
	
	this.getLevelNames = function(){
		var levels = new Array();
		for (var i in this.levels){
			levels.push(this.levels[i].levelName);
		}
		return levels;
	}
	
	this.getFactoriesNames = function(){
		var factoriesNames = new Array();
		for (var i in this.elementFactories){
			factoriesNames.push(this.elementFactories[i].factoryName);
		}
		return factoriesNames;
	}

	this.getEventsForLevel = function(levelName){
		var level;
		for (var i in this.levels){
			if(this.levels[i].levelName == levelName)
				level = this.levels[i];
		}
		if(level == null)
			throw "level "+levelName+" does not exist";

		var events = new Array();
		for(var property in level){
			if(typeof(eval("level."+property)) == 'function' && property.indexOf("on")==0)
				events.push(property);
		}
		return events;
	}
	
	this.getEventsFor = function(factoryName){
		var factory;
		for (var i in this.elementFactories){
			if(this.elementFactories[i].factoryName == factoryName)
				factory = this.elementFactories[i];
		}
		if(factory == null)
			throw "factory "+factoryName+" does not exist";

		var events = new Array();
		for(var property in factory){
			if(typeof(eval("factory."+property)) == 'function' && property.indexOf("on")==0)
				events.push(property);
		}
		return events;
	}

	this.getFactoryByName = function(factoryName){
		for (var i in this.elementFactories){
			if(this.elementFactories[i].factoryName == factoryName)
				return this.elementFactories[i];
		}
		return null;
	}
}
