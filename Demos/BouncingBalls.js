//GAMECODE START
function Bouncing_balls() {

	this.setup = function() {
		this.setCanvasProperties();
		this.setResources();
		this.setGameName();
		this.loadFactories();
		this.loadLevels();
	};

	this.setCanvasProperties = function() {
		canvas.width = 500;
		canvas.height = 300;
	};

	this.setResources = function() {
		resources.addImageUrlToLoad("./Sprites/3dRedBall.png", "redBall");
		resources.addImageUrlToLoad("./Sprites/clickToStart.png", "clickScreen");
		resources.addImageUrlToLoad("./Sprites/testBackground.png","background");
		resources.addImageUrlToLoad("./Sprites/mainChar.png", "mainChar");
	};

	this.setGameName = function() {
		game.gameName = "Bouncing balls";
	};

	this.loadFactory_MainCharacter = function() {
		var factory_MainCharacter = new ElementFactory("MainCharacter");
		factory_MainCharacter.onDraw = function(delta, context) {
			context.fillText("life: " + level.health, self.x, self.y + 17);
		};

		factory_MainCharacter.onCollision = function(other, delta) {
			if (other.is("Box")) {
				kill(other);
				create("Box", 0, 0);
				level.health--;
				if (level.health == 0) {
					goToPreviousLevel();
				}
			}
		};

		factory_MainCharacter.onCreate = function() {
			self.setSprite("mainChar");
			self.lifes = 3;
			self.leftLimit = 0;
			self.topLimit = 0;
			self.rightLimit = 500;
			self.bottomLimit = 300;
			self.setMaxXSpeed(500);
			self.setMaxYSpeed(1000);
		};

		factory_MainCharacter.onClick = function(absoluteClickPosition) {
		};

		factory_MainCharacter.onStep = function(delta, globalGameState) {
			var xAcceleration = 100;
			var yAcceleration = 450;
			var firstPoint = game.isThereAnObjectOnPoint(self.x + 1, self.y
					+ self.height + 1);
			var secondPoint = game.isThereAnObjectOnPoint(self.x - 1
					+ self.width, self.y + self.height + 1);
			var onGround = self.y + self.height == self.bottomLimit;
			var canJump = firstPoint || secondPoint || onGround;
			var gravity = 800;
			if (!canJump) {
				applyGravity(self, delta, gravity);
			} else {
				self.ySpeed = 0;
			}
			if (globalGameState.left) {
				if (self.xSpeed > 0) {
					self.xSpeed = 0;
				}
				self.xAccelerate(-xAcceleration);
			}
			if (globalGameState.right) {
				if (self.xSpeed < 0) {
					self.xSpeed = 0;
				}
				self.xAccelerate(xAcceleration);
			}
			if (!globalGameState.left && !globalGameState.right && canJump) {
				self.xSpeed = 0;
			}
			if (globalGameState.up) {
				if (canJump) {
					self.yAccelerate(-yAcceleration);
				}
			}
			applyFriction(self, delta, 500, 0);
		};

		factory_MainCharacter.onAfterStep = function(delta, globalGameState) {
			wrapOnBoundaries(self, self.topLimit, self.bottomLimit,
					self.rightLimit, self.leftLimit);
		};

		game.addFactory(factory_MainCharacter);
	};
	this.loadFactory_Box = function() {
		var factory_Box = new ElementFactory("Box");
		factory_Box.onDraw = function(delta, context) {
		};

		factory_Box.onCollision = function(other, delta) {
		};

		factory_Box.onCreate = function() {
			self.setSprite("redBall");
			self.leftLimit = 0;
			self.topLimit = 0;
			self.rightLimit = 500;
			self.bottomLimit = 300;
			self.setMaxXSpeed(500);
			self.setMaxYSpeed(1000);
			self.xAccelerate(-100);
			self.yAccelerate(-100);
		};

		factory_Box.onClick = function(absoluteClickPosition) {
		};

		factory_Box.onStep = function(delta, globalGameState) {
		};

		factory_Box.onAfterStep = function(delta, globalGameState) {
			bounceOnBoundaries(self, self.topLimit, self.bottomLimit,
					self.rightLimit, self.leftLimit);
		};

		game.addFactory(factory_Box);
	};
	this.loadFactory_ClickToStart = function() {
		var factory_ClickToStart = new ElementFactory("ClickToStart");
		factory_ClickToStart.onDraw = function(delta, context) {
		};

		factory_ClickToStart.onCollision = function(other, delta) {
		};

		factory_ClickToStart.onCreate = function() {
			self.setSprite("clickScreen");
		};

		factory_ClickToStart.onClick = function(absoluteClickPosition) {
			goToNextLevel();
		};

		factory_ClickToStart.onStep = function(delta, globalGameState) {
		};

		factory_ClickToStart.onAfterStep = function(delta, globalGameState) {
		};

		game.addFactory(factory_ClickToStart);
	};

	this.loadFactories = function() {
		this.loadFactory_MainCharacter();
		this.loadFactory_Box();
		this.loadFactory_ClickToStart();
	};
	this.loadLevel_FirstLevel = function() {
		var level_FirstLevel = new Level("FirstLevel");
		level_FirstLevel.onLoadLevel = function() {
		};
		level_FirstLevel.levelElements = [ 
		    {"ClickToStart" : [ { x : 0,	y : 0} ]} 
		];
		game.addLevel(level_FirstLevel);
		game.firstLevel = level_FirstLevel;
	};
	this.loadLevel_SecondLevel = function() {
		
		var level_SecondLevel = new Level("SecondLevel");
		
		level_SecondLevel.onLoadLevel = function() {
			self.backgroundImage = resources.get("background");
			level.health = 3;
		};
		
		level_SecondLevel.levelElements = [ 
			{"MainCharacter":[{x:59,y:207}]},
			{"Box":[{x:220,y:285},{x:269,y:240},{x:316,y:188},{x:366,y:142},{x:412,y:92},{x:454,y:47}]}
    		];	
		game.addLevel(level_SecondLevel);
	};
	this.loadLevels = function() {
		this.loadLevel_FirstLevel();
		this.loadLevel_SecondLevel();
	};

};

setGameToLoad(new Bouncing_balls());

//GAMECODE END
