function Box(){
	
	this.x=120;
	this.y=464;
	this.width = 83;
	this.height = 132;

	this.testCollisionWith = function(otherElement){
        }

	this.step = function(delta, gameCommandState, game){
	};
	
	this.draw = function(context){
		context.strokeRect(this.x, this.y, this.width, this.height);
	};
}
