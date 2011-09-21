function Gravity(gravity){
	this._gravity = gravity;	
	
	this.setGravity = function(gravity){
		this._gravity = gravity;
	}
	
	this.onStep = function(element, delta){
		element.yAccelerate((delta*this._gravity)/1000);
	}
}
