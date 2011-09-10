function Box(_x,_y,_width,_height){
	
	this.x=_x;
	this.y=_y;
	this.width = _width;
	this.height = _height;

	this.getX = function(){
		return this.x;
	}
	this.getY = function(){
		return this.y;
	}
	this.getWidth = function(){
		return this.width;
	}
	
	this.getHeight = function(){
		return this.height;
	}
	
	this.testCollisionWith = function(otherElement,delta){
  }

	this.step = function(delta, gameCommandState, game){
	};
	
	this.draw = function(context,delta){
		context.strokeStyle = "gray";
		context.strokeRect(this.x, this.y, this.width, this.height);
	};
}
