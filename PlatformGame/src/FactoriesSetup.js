function setupFactory_Box(game){
	var factory = new ElementFactory("Box",32,32);
	
	factory.onCreate = function(element){
		this.leftLimit = 0;
		this.topLimit = 0;
		this.rightLimit = 1000;
		this.bottomLimit = 300;
		element.setMaxXSpeed(500);
		element.setMaxYSpeed(1000);
		element.xAccelerate(-100);
		element.yAccelerate(-100);
	}
	
	factory.onDraw = function(element,delta,context){
		context.fillText("?",element.x+17,element.y+17);
	}
	
	factory.onAfterStep = function(element,delta,globalGameState,game){
		bounceOnBoundaries(element,this.topLimit,this.bottomLimit,this.rightLimit,this.leftLimit)
	}
	
	var positions = [{x:140,y:220},{x:300,y:200},{x:200,y:100}];
	factory.addElementsAt(positions);
	game.addFactory(factory);
}

function setupFactory_MainCharacter(game){

	var factory = new ElementFactory("MainCharacter",50,80);

	factory.onCreate = function(element){
		this.leftLimit = 0;
		this.topLimit = 0;
		this.rightLimit = 1000;
		this.bottomLimit = 300;
		element.setMaxXSpeed(500);
		element.setMaxYSpeed(1000);
	}

	factory.onStep = function(element,delta,globalGameState,game){
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

	factory.onAfterStep = function(element,delta,globalGameState,game){
		wrapOnBoundaries(element,this.topLimit,this.bottomLimit,this.rightLimit,this.leftLimit)
	}

	var positions = [{x:50,y:50}];
	factory.addElementsAt(positions);
	game.addFactory(factory);	
}
