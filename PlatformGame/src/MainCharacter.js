function MainCharacter(){

	this.elementArray = new Array();

	this.factoryName = "MainCharacter";

	this.leftLimit = 0;
	this.topLimit = 0;
	this.rightLimit = 1000;
	this.bottomLimit = 300;

	this.element = new Element(this,50,50,50,80);
	
	this.element.setMaxXSpeed(500);
	this.element.setMaxYSpeed(1000);

	this.elementArray.push(this.element);

	this.isObjectOnPoint = function(x,y){
		var elX = this.element.getX();
		if(x<elX)
			return false;
		var elX2 = this.element.getX()+this.element.getWidth();
		if(x>elX2)
			return false;
		var elY = this.element.getY();
		if(y<elY)
			return false;
		var elY2 = this.element.getY()+this.element.getHeight();
		if(y>elY2)
			return false;
		return true;
	}

	this.testCollisionWith = function(otherFactory,delta){
		for (var i in this.elementArray){
			for(var j in otherFactory.elementArray){
				this.elementArray[i].resolveCollisionWith(otherFactory.elementArray[j],delta);
			}
		}
	}
	
	this.step = function(delta, globalGameState, game){
		this.element.step(delta,globalGameState,game);
	};
	
	this.draw = function(context,delta){
		context.strokeStyle = "gray";
		context.strokeRect(this.element.x, this.element.y, this.element.width, this.element.height);
		context.strokeRect(this.leftLimit, this.topLimit, this.rightLimit-this.leftLimit, this.bottomLimit-this.topLimit);
	};

	this.onStep = function(element,delta,globalGameState,game){
		var xAcceleration = 100;//PixelPerSecond
		var yAcceleration = 450;
		
		var firstPoint = game.isThereAnObjectOnPoint(element.x+1,element.y+element.height+1);
		var secondPoint = game.isThereAnObjectOnPoint(element.x-1+element.width,element.y+element.height+1);
		var onGround = element.y+element.height == this.bottomLimit;
		var canJump = firstPoint || secondPoint || onGround;
		
		var gravity = 800;		
		if(!canJump)
			applyGravity(element,delta,gravity);
		else
			element.ySpeed = 0;
		
		if(globalGameState.left){
			if(element.xSpeed>0)
				element.xSpeed = 0;
			element.xAccelerate(-xAcceleration);
		}
		if(globalGameState.right){
			if(element.xSpeed<0)
				element.xSpeed = 0;
			element.xAccelerate(xAcceleration);
		}
		if(!globalGameState.left && !globalGameState.right && canJump){
			element.xSpeed = 0;
		}
		if(globalGameState.up){
			if(canJump)
				element.yAccelerate(-yAcceleration);
		}

		applyFriction(element,delta,500,0);
	}

	this.onAfterStep = function(element,delta,globalGameState,game){
		wrapOnBoundaries(element,this.topLimit,this.bottomLimit,this.rightLimit,this.leftLimit)
	}


}
