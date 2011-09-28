function Game(drawCanvas){
	this.lastLoopTime = new Date().getTime();
	this.elementFactories = new Array();

	this.canvas = drawCanvas;
	this.context = this.canvas.getContext('2d');
	
	this.getFactories = function(){
		return this.elementFactories;
	}

	this.addFactory = function(factory){
		this.elementFactories.push(factory);
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


	this.gameLoop = function(globalGameState){
		var currentTime = new Date().getTime();
		var delta = currentTime - this.lastLoopTime;
		if(delta>40) delta = 40;
		this.stepElements(delta,globalGameState);
		this.testCollisions(delta);
		this.drawelementFactories(delta);
		this.lastLoopTime = new Date().getTime();
	}
	
	this.getFactoriesNames = function(){
		var factoriesNames = new Array();
		for (var i in this.elementFactories){
			factoriesNames.push(this.elementFactories[i].factoryName);
		}
		return factoriesNames;
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
