function Game(drawCanvas){
	this.lastLoopTime = new Date().getTime();
	this.elements = new Array();

	this.canvas = drawCanvas;
	this.context = this.canvas.getContext('2d');
	
	this.addElement = function(element){
		this.elements.push(element);
	}
	
	this.isObjectOnPoint = function(x,y,element){
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
	
	this.isThereAnObjectOnPoint = function(x,y){
		for (var i in this.elements)
		{
			if(this.isObjectOnPoint(x,y,this.elements[i])){
				return true;
			}
		}
		return false;
	}

	this.testCollisions = function(delta){
		var i;
		var j;
		for(i=0;i<this.elements.length-1;i++){
			 var element1 =this.elements[i];
			 for(j=i+1;j<this.elements.length;j++){
			 	 var element2 =this.elements[j];
				 element1.testCollisionWith(element2,delta);
				 element2.testCollisionWith(element1,delta);
			 }
		 }		
	}
	
	this.drawElements = function(delta){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (var i in this.elements)
		{
			this.elements[i].draw(this.context,delta);
		}
	}
	
	this.gameLoop = function(globalGameState){
		var currentTime = new Date().getTime();
		var delta = currentTime - this.lastLoopTime;
		if(delta>40)
			delta = 40;
		for (var i in this.elements)
		{
			this.elements[i].step(delta,globalGameState, this);
		}
		
		this.testCollisions(delta);
		this.drawElements(delta);
		this.lastLoopTime = new Date().getTime();
	}
}