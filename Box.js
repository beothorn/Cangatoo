function Box(_x,_y,_width,_height){
	
	this.element = new Element(_x,_y);
	
	this.element.leftLimit = 0;
	this.element.topLimit = 0;
	this.element.rightLimit = 1000;
	this.element.bottomLimit = 300;
	
	this.element.width = _width;
	this.element.height = _height;
	
	this.element.elasticity = 3;
	
	this.element.setMaxXSpeed(500);
	this.element.setMaxYSpeed(1000);
	
	this.element.setXFriction(500);

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
	
	this.testCollisionWith = function(otherElement,delta){
		this.element.resolveCollisionWith(otherElement,delta);
  }

	this.step = function(delta, gameCommandState, game){
		this.element.step(delta);
	};
	
	this.draw = function(context,delta){
		context.strokeStyle = "gray";
		context.strokeRect(this.element.x, this.element.y, this.element.width, this.element.height);
	};
}
