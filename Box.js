function Box(){
	
	this.x=120;
	this.y=464;
	this.width = 83;
	this.height = 132;

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
	
	this.testCollisionWith = function(otherElement){
  }

	this.step = function(delta, gameCommandState, game){
	};
	
	this.draw = function(context){
		context.strokeRect(this.x, this.y, this.width, this.height);
	};
}
