function ElementFactory(factoryName){

	this.elementArray = new Array();
	this.width = 0;
	this.height = 0;
	this.factoryName = factoryName;

	this.restartFactory = function(){
		this.elementArray.length = 0;
	}
	
	this.addElementAt = function(x,y){
		var element = new Element(this,x,y);
		this.onCreate(element);
		this.elementArray.push(element);
	}

	this.addElementToCreateAt = function(x,y){
		this.addElementAt(x,y);
		var factoryExisted = false;
		for(var i in game.level.levelElements){
			for(var factoryName in game.level.levelElements[i]){
				if(factoryName==this.factoryName){
					game.level.levelElements[i][factoryName].push({x:x,y:y});
					factoryExisted = true;
				}
			}
		}
		if(!factoryExisted){
			eval("var newLevelElements = {"+this.factoryName+":[{x:x,y:y}]}");
			game.level.levelElements.push(newLevelElements);
		}
	}
	
	this.addElementsAt = function(pointArray){
		for(var i in pointArray){
			this.addElementAt(pointArray[i].x,pointArray[i].y);
		}
	}

	this.isElementOnPoint = function(element,x,y){
		var elX = element.getX();
		if(x<elX)
			return false;
		var elX2 = element.getX()+element.getWidth();
		if(x>elX2)
			return false;
		var elY = element.getY();
		if(y<elY)
			return false;
		var elY2 = element.getY()+element.getHeight();
		if(y>elY2)
			return false;
		return true;
	}

	this.isObjectOnPoint = function(x,y){
		for (var i in this.elementArray){
			if(this.isElementOnPoint(this.elementArray[i],x,y))
				return true;	
		}
		return false;
	}

	this.testCollisionWith = function(otherFactory,delta){
		for (var i in this.elementArray){
			for(var j in otherFactory.elementArray){
				this.elementArray[i].resolveCollisionWith(otherFactory.elementArray[j],delta);
			}
		}
	}

	this.step = function(delta, globalGameState, game){
		for (var i in this.elementArray){
			this.elementArray[i].step(delta,globalGameState,game);
		}
	};
	
	this.click = function(absoluteClickPosition){
		for (var i in this.elementArray){
			var element = this.elementArray[i];
			var rect = {x1:element.x,x2:element.x+element.width,y1:element.y,y2:element.y+element.height};
			if(isPointInsideRectangle(absoluteClickPosition,rect)){
				this.onClick(element,absoluteClickPosition);
			}
		}
	}
	
	this.draw = function(context,delta){
		context.strokeStyle = "gray";
		for (var i in this.elementArray){
			var element = this.elementArray[i];
			if(element.sprite != null)
				context.drawImage(element.sprite,element.x,element.y);
			this.onDraw(this.elementArray[i],delta,context);
		}
	};
	
	this.onDraw = function(element,delta,context){
		/**
		* The event onDraw is called when an element is being drawn.
		* If you want to draw effects, text or anything else this is the place.
		* Parameters:
		* 	-element: the Element being drawn.
		*	-delta: the time passed in milisseconds since the last step
		*	-context: canvas 2d context where the element is being draw
		**/
	}	

	this.onCreate = function(element){		
		/**
		* The event onCreate is called when an element is created
		* You want to set initial values, width, height, the element sprite, etc.
		* Parameters:
		* 	-element: the Element being created.
		**/
	}	

	this.onClick = function(element,absoluteClickPosition){		
		/**
		* The event onClick is called when a mouse click is done inside the element passed
		* as parameter.
		* You want to set initial values, width, height, the element sprite, etc.
		* Parameters:
		* 	-element: the Element being clicked.
		*   -absoluteClickPosition: The click position relative to the canvas element.
		**/
	}
	
	this.onStep = function(element,delta,globalGameState,game){
		/**
		* The event onStep is called in every frame before 
		* the element position is changed by its speed.
		* Usually, you want to call applyGravity(element,delta,gravity) here.
		* Parameters:
		* 	-element: the Element being stepped.
		*	-delta: the time passed in milisseconds since the last step
		*	-globalGameState: the global game values
		*	-game: the game class
		**/
	}

	this.onAfterStep = function(element,delta,globalGameState,game){
		/**
		* The event onAfterStep is called after the event onStep and also after
		* the element position was already changed by its speed.
		* Usually, you want to call wrapOnBoundaries(element,topLimit,bottomLimit,rightLimit,leftLimit)
		* here.
		* Parameters:
		* 	-element: the Element being stepped.
		*	-delta: the time passed in milisseconds since the last step
		*	-globalGameState: the global game values
		*	-game: the game class
		**/
	}
}
