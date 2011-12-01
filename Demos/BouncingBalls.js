function BouncingBalls(){
	
	resources.addImageUrlToLoad("./Sprites/3dBlueBall.png","blueBall");
	resources.addImageUrlToLoad("./Sprites/testBackground.png","background");
	resources.addImageUrlToLoad("./Sprites/mainChar.png","mainChar");
	
	canvas.width  = 500;
	canvas.height = 300;

	
	this.setup = function(game){
		game.gameName = "Bouncing balls";
	
		var factory_MainCharacter = new ElementFactory("MainCharacter");
	
		factory_MainCharacter.onCreate = function (){
			self.setSprite("mainChar");
			self.lifes = 3;
			
			self.leftLimit = 0;
			self.topLimit = 0;
			self.rightLimit = 500;
			self.bottomLimit = 300;
			self.setMaxXSpeed(500);
			self.setMaxYSpeed(1000);
		}
	
		factory_MainCharacter.onStep = function (delta,globalGameState){
			var xAcceleration = 100;//PixelPerSecond
			var yAcceleration = 450;
			
			var firstPoint = game.isThereAnObjectOnPoint(self.x+1,self.y+self.height+1);
			var secondPoint = game.isThereAnObjectOnPoint(self.x-1+self.width,self.y+self.height+1);
			var onGround = self.y+self.height == self.bottomLimit;
			var canJump = firstPoint || secondPoint || onGround;
			
			var gravity = 800;		
			if(!canJump){
				applyGravity(self,delta,gravity);
			}else{
				self.ySpeed = 0;
			}
			
			if(globalGameState.left){
				if(self.xSpeed>0)
					self.xSpeed = 0;
				self.xAccelerate(-xAcceleration);
			}
			if(globalGameState.right){
				if(self.xSpeed<0)
					self.xSpeed = 0;
				self.xAccelerate(xAcceleration);
			}
			if(!globalGameState.left && !globalGameState.right && canJump){
				self.xSpeed = 0;
			}
			if(globalGameState.up){
				if(canJump)
					self.yAccelerate(-yAcceleration);
			}
	
			applyFriction(self,delta,500,0);
		}
		
		factory_MainCharacter.onAfterStep = function (delta,globalGameState){
			wrapOnBoundaries(self,self.topLimit,self.bottomLimit,self.rightLimit,self.leftLimit)
		}
		
		factory_MainCharacter.onCollision = function(other,delta){
			if(other.is("Box")){
				kill(other);
				create("Box",0,0);
				level.health--;
				if(level.health == 0)
					goToPreviousLevel();
			}
		}
		
		factory_MainCharacter.onDraw = function(delta,context){
			context.fillText("life: "+level.health, self.x, self.y+17);
		};
	
		game.addFactory(factory_MainCharacter);
		var factory_Box = new ElementFactory("Box");
	
		factory_Box.onCreate = function (){
			self.setSprite("blueBall");
			
			self.leftLimit = 0;
			self.topLimit = 0;
			self.rightLimit = 500;
			self.bottomLimit = 300;
			self.setMaxXSpeed(500);
			self.setMaxYSpeed(1000);
			self.xAccelerate(-100);
			self.yAccelerate(-100);
		}
	
		factory_Box.onStep = function (delta,globalGameState){
			/**
			* The event onStep is called in every frame before 
			* the element position is changed by its speed.
			* Usually, you want to call applyGravity(self,delta,gravity) here.
			* Parameters:
			* 	-element: the Element being stepped.
			*	-delta: the time passed in milisseconds since the last step
			*	-globalGameState: the global game values
			*	-game: the game class
			**/
		}
	
		factory_Box.onAfterStep = function (delta,globalGameState){
			bounceOnBoundaries(self,self.topLimit,self.bottomLimit,self.rightLimit,self.leftLimit)
		}		
		
		game.addFactory(factory_Box);
		
		var factory_ClickToStart = new ElementFactory("ClickToStart");
		
		factory_ClickToStart.onCreate = function () {
				self.width = 64;
				self.height = 32;
		}
		
		factory_ClickToStart.onDraw = function (delta, context) {
			context.fillStyle = "black";
			context.font = "8pt Verdana";
			context.strokeRect(self.x, self.y, self.width, self.height);
			context.fillText("Click to start", self.x, self.y+17);
		}
		
		factory_ClickToStart.onClick = function (absoluteClickPosition) {
				goToNextLevel();
		}
	
		game.addFactory(factory_ClickToStart);
		
		var level_FirstLevel = new Level("FirstLevel");
		level_FirstLevel.levelElements = [
			{"ClickToStart":[{x:50,y:50}]}
		];
		
		game.addLevel(level_FirstLevel);
		
		var level_SecondLevel = new Level("SecondLevel");
		level_SecondLevel.levelElements = [
			{"MainCharacter":[{x:50,y:50}]},
			{"Box":[{x:140,y:220},{x:300,y:200},{x:200,y:100}]}  	
		];
		
		level_SecondLevel.backgroundImage = function(){ return resources.get("background");};
		
		level_SecondLevel.onLoadLevel = function(){
			level.health = 3;
		}
		game.addLevel(level_SecondLevel);
		game.firstLevel = level_SecondLevel;
	}
	
}

loadCode(new BouncingBalls());
