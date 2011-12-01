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
		var oldSelf = self; 
		self = element;
		this.onCreate(element);
		self = oldSelf;
		this.elementArray.push(element);
	}

	this.addElementToCreateAt = function(x,y){
		this.addElementAt(x,y);
		var factoryExisted = false;
		for(var i in level.levelElements){
			for(var factoryName in level.levelElements[i]){
				if(factoryName==this.factoryName){
					level.levelElements[i][factoryName].push({x:x,y:y});
					factoryExisted = true;
				}
			}
		}
		if(!factoryExisted){
			eval("var newLevelElements = {"+this.factoryName+":[{x:x,y:y}]}");
			level.levelElements.push(newLevelElements);
		}
	}
	
	this.addElementsAt = function(pointArray){
		for(var i in pointArray){
			this.addElementAt(pointArray[i].x,pointArray[i].y);
		}
	}
	
	this.removeElement = function(element){
		var i = this.elementArray.indexOf(element);
		this.elementArray.splice(i,1);
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
	
	this.getObjectOnPoint = function(x,y){
		for (var i in this.elementArray){
			if(this.isElementOnPoint(this.elementArray[i],x,y))
				return this.elementArray[i];	
		}
		return null;
	}

	this.testCollisionWith = function(otherFactory,delta){
		for (var i in this.elementArray){
			for(var j in otherFactory.elementArray){
				
				self = this.elementArray[i];
				var other = otherFactory.elementArray[j];

				if(self != other){
				
					var selfRectangle =  {x1: self.getXForCollisionCheck() ,y1: self.getYForCollisionCheck() ,x2: self.getXForCollisionCheck()+self.width ,y2: self.y+self.height};
					var otherRectangle = {x1: other.getXForCollisionCheck() ,y1: other.getYForCollisionCheck() ,x2: other.getXForCollisionCheck()+other.getWidth() ,y2: other.getYForCollisionCheck()+other.getHeight()};
				
					if(rectanglesIntersect(selfRectangle,otherRectangle)){
						this.onCollision(other,delta);
					}
				}
			}
		}
	}

	this.step = function(delta, globalGameState){
		for (var i in this.elementArray){
			this.elementArray[i].step(delta,globalGameState);
		}
	};
	
	this.click = function(absoluteClickPosition){
		for (var i in this.elementArray){
			var element = this.elementArray[i];
			var rect = {x1:element.x,x2:element.x+element.width,y1:element.y,y2:element.y+element.height};
			if(isPointInsideRectangle(absoluteClickPosition,rect)){
				self = element; 
				this.onClick(absoluteClickPosition);
			}
		}
	}
	
	this.draw = function(context,delta){
		context.strokeStyle = "gray";
		for (var i in this.elementArray){
			var element = this.elementArray[i];
			if(element.sprite != null)
				context.drawImage(element.sprite,element.x,element.y);
			self = element; 
			this.onDraw(delta,context);
		}
	};
	
	this.onDraw = function(delta,context){
		/**
		* The event onDraw is called when an element is being drawn.
		* If you want to draw effects, text or anything else this is the place.
		* Parameters:
		* 	-element: the Element being drawn.
		*	-delta: the time passed in milisseconds since the last step
		*	-context: canvas 2d context where the element is being draw
		**/
	}	

	this.onCollision = function(other,delta){
	}
	
	this.onCreate = function(){		
		/**
		* The event onCreate is called when an element is created
		* You want to set initial values, width, height, the element sprite, etc.
		* Parameters:
		* 	-element: the Element being created.
		**/
	}	

	this.onClick = function(absoluteClickPosition){		
		/**
		* The event onClick is called when a mouse click is done inside the element passed
		* as parameter.
		* You want to set initial values, width, height, the element sprite, etc.
		* Parameters:
		* 	-element: the Element being clicked.
		*   -absoluteClickPosition: The click position relative to the canvas element.
		**/
	}
	
	this.onStep = function(delta,globalGameState){
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

	this.onAfterStep = function(delta,globalGameState){
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
