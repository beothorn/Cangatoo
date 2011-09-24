function Box(_x,_y,_width,_height){
	
	this.onAfterStep = function(element,delta,globalGameState,game){
		var leftLimit = 0;
		var topLimit = 0;
		var rightLimit = 1000;
		var bottomLimit = 300;

		bounceOnBoundaries(element,topLimit,bottomLimit,rightLimit,leftLimit)
	}

	this.element = new Element(this,_x,_y);
	
	this.element.width = _width;
	this.element.height = _height;
	
	this.element.elasticity = 1;
	
	this.element.setMaxXSpeed(500);
	this.element.setMaxYSpeed(1000);
	
	this.element.xAccelerate(-30);

	this.getX = function(){
		return this.element.x;
	}
	this.getY = function(){
		return this.element.y;
	}
	this.getWidth = function(){
		return this.element.width;
	}
	
	this.getHeight = function(){
		return this.element.height;
	}
	
	this.getXForCollisionCheck = function(){
		return this.element.getXForCollisionCheck();
	}
	
	this.getYForCollisionCheck = function(){
		return this.element.getYForCollisionCheck();
	}
	
	this.testCollisionWith = function(otherElement,delta){
		this.element.resolveCollisionWith(otherElement,delta);
	}

	this.step = function(delta, globalGameState, game){
		this.element.step(delta,globalGameState,game);
	};
	
	this.draw = function(context,delta){
		context.strokeStyle = "gray";
		context.strokeRect(this.element.x, this.element.y, this.element.width, this.element.height);
	};
}
