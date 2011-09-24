function BoxFactory(){


	this.factoryName = "Box";

	this.elementArray = new Array();
	this.width = 32;
	this.height = 32;
	this.maxXSpeed = 500;
	this.maxYSpeed = 1000;

	this.addElementAt = function(x,y){
		var element = new Element(this,x,y,this.width,this.height);
		element.setMaxXSpeed(this.maxXSpeed);
		element.setMaxYSpeed(this.maxYSpeed);
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
		}
	};

	this.onAfterStep = function(element,delta,globalGameState,game){
		var leftLimit = 0;
		var topLimit = 0;
		var rightLimit = 1000;
		var bottomLimit = 300;

		bounceOnBoundaries(element,topLimit,bottomLimit,rightLimit,leftLimit)
	}

	this.onStep = function(element,delta,globalGameState,game){
		/**
		**/
	}

}
