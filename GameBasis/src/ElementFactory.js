function ElementFactory(width,height){

	this.elementArray = new Array();
	this.width = width;
	this.height = height;

	this.addElementAt = function(x,y){
		var element = new Element(this,x,y,this.width,this.height);
		this.onCreate(element);
		this.elementArray.push(element);
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
	
	this.draw = function(context,delta){
		context.strokeStyle = "gray";
		for (var i in this.elementArray){
			context.strokeRect(this.elementArray[i].x, this.elementArray[i].y, this.elementArray[i].width, this.elementArray[i].height);
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
		* Usually, you want to set initial values, like element.setMaxXSpeed(100) here.
		* Parameters:
		* 	-element: the Element being created.
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
