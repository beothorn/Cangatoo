function setupGame(game){
	
	game.gameName = "Bouncing balls";
	
  var factory_MainCharacter = new ElementFactory("MainCharacter");

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
			util.applyGravity(element,delta,gravity);
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

		util.applyFriction(element,delta,500,0);
	}
	
	factory_MainCharacter.onDraw = function(element,delta,context){
		context.strokeRect(element.x, element.y, element.width, element.height);
	};

  factory_MainCharacter.onAfterStep = function (element,delta,globalGameState,game){
		util.wrapOnBoundaries(element,this.topLimit,this.bottomLimit,this.rightLimit,this.leftLimit)
	}


  game.addFactory(factory_MainCharacter);
  var factory_Box = new ElementFactory("Box");

  factory_Box.onDraw = function (element,delta,context){
		context.fillStyle = "white";
		context.fillText("?",element.x+17,element.y+17);
	}

  factory_Box.onCreate = function (element){
		element.setSprite("./Sprites/ball.png");
		
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
		util.bounceOnBoundaries(element,this.topLimit,this.bottomLimit,this.rightLimit,this.leftLimit)
	}

	
	factory_Box.onAfterStep = function (element,delta,globalGameState,game){
		util.bounceOnBoundaries(element,this.topLimit,this.bottomLimit,this.rightLimit,this.leftLimit)
	}
	
	factory_Box.onClick = function(element,absoluteClickPosition){		
		element.xAccelerate(element.getXSpeed()*-1);
		element.yAccelerate(element.getYSpeed()*-1);
	}
	
	
  game.addFactory(factory_Box);
  
  var factory_ClickToStart = new ElementFactory("ClickToStart");
  
  factory_ClickToStart.onCreate = function (element) {
			element.width = 64;
			element.height = 32;
	}
  
  factory_ClickToStart.onDraw = function (element, delta, context) {
    context.fillStyle = "black";
    context.strokeRect(element.x, element.y, element.width, element.height);
    context.fillText("Click to start", element.x, element.y+17);
  }
	
	factory_ClickToStart.onClick = function (element, absoluteClickPosition) {
			util.goToLevel("SecondLevel");
	}

  game.addFactory(factory_ClickToStart);
  
  
  function FirstLevel(){
  	
  	this.levelName = "FirstLevel";
  	
		this.loadLevelOnGame = function(game){
			var positions_ClickToStart = [{x:50,y:50}];
			game.getFactoryByName("ClickToStart").addElementsAt(positions_ClickToStart);
			this.onLevelStart(game);
		}
		
		this.onLevelStart = function(game){
		}
	}
  
  game.addLevel(new FirstLevel());
  
  function SecondLevel(){
  	
  	this.levelName = "SecondLevel";
  	
		this.loadLevelOnGame = function(game){
			var positions_MainCharacter = [{x:50,y:50}];
			game.getFactoryByName("MainCharacter").addElementsAt(positions_MainCharacter);
		
			var positions_Box = [{x:140,y:220},{x:300,y:200},{x:200,y:100}];
			game.getFactoryByName("Box").addElementsAt(positions_Box);
			this.onLevelStart(game);
		}
		
		this.onLevelStart = function(game){
		}
	}
  
  game.addLevel(new SecondLevel());

}
