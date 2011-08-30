function Box(){
	
	this.x=220;
	this.y=554;
	this.width = 83;
	this.height = 32;

	this.testCollisionWith = function(otherElement){
        }

	this.step = function(delta, gameCommandState, game){
	};
	
	this.draw = function(context){
		context.strokeRect(this.x, this.y, this.width, this.height);
	};
}
