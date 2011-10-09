function setupDefaultGame(game){
  var factory_MainCharacter = new ElementFactory("MainCharacter");
  factory_MainCharacter.onLevelStart = function (){
		/**
		* The event onLevelStart is called when a level is started or restarted.
		* This will probably be automatically generated in the future.
		**/
		var positions = [{x:50,y:50}];
		factory_MainCharacter.addElementsAt(positions);
	}

  factory_MainCharacter.onDraw = function (element,delta,context){
		/**
		* The event onDraw is called when an element is being drawn.
		* If you want to draw effects, text or anything else this is the place.
		* Parameters:
		* 	-element: the Element being drawn.
		*	-delta: the time passed in milisseconds since the last step
		*	-context: canvas 2d context where the element is being draw
		**/
	}

  factory_MainCharacter.onCreate = function (element){
		element.width = 50;
		element.height = 80;
		
		this.leftLimit = 0;
		this.topLimit = 0;
		this.rightLimit = 500;
		this.bottomLimit = 300;
		element.setMaxXSpeed(500);
		element.setMaxYSpeed(1000);
	}

  factory_MainCharacter.onStep = function (element,delta,globalGameState,game){
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

  factory_MainCharacter.onAfterStep = function (element,delta,globalGameState,game){
		wrapOnBoundaries(element,this.topLimit,this.bottomLimit,this.rightLimit,this.leftLimit)
	}


  game.addFactory(factory_MainCharacter);
  var factory_Box = new ElementFactory("Box");
  factory_Box.onLevelStart = function (){
		/**
		* The event onLevelStart is called when a level is started or restarted.
		* This will probably be automatically generated in the future.
		**/
		var positions = [{x:140,y:220},{x:300,y:200},{x:200,y:100}];
		factory_Box.addElementsAt(positions);
	}

  factory_Box.onDraw = function (element,delta,context){
		context.fillStyle = "white";
		context.fillText("?",element.x+17,element.y+17);
	}

  factory_Box.onCreate = function (element){
		element.setSprite("./PlatformGame/resources/ball.png");
		
		this.leftLimit = 0;
		this.topLimit = 0;
		this.rightLimit = 500;
		this.bottomLimit = 300;
		element.setMaxXSpeed(500);
		element.setMaxYSpeed(1000);
		element.xAccelerate(-100);
		element.yAccelerate(-100);
	}

  factory_Box.onStep = function (element,delta,globalGameState,game){
		/**
		* The event onStep is called in every frame before 
		* the element position is changed by its speed.
		* Usually, you want to call applyGravity(element,delta,gravity) here.
		* Parameters:
		* 	-element: the Element being stepped.
		*	-delta: the time passed in milisseconds since the last step
		*	-globalGameState: the global game values
		*	-game: the game class
		**/
	}

  factory_Box.onAfterStep = function (element,delta,globalGameState,game){
		bounceOnBoundaries(element,this.topLimit,this.bottomLimit,this.rightLimit,this.leftLimit)
	}


  game.addFactory(factory_Box);

}
