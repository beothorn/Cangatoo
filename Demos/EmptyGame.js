//GAMECODE START
function Empty_Game() {

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
	};

	this.setGameName = function() {
		game.gameName = "Bouncing balls";
	};

	this.loadFactory_Ball = function() {
		var factory_Ball = new ElementFactory("Ball");
		factory_Ball.onDraw = function(delta, context) {
		};

		factory_Ball.onCollision = function(other, delta) {
		};

		factory_Ball.onCreate = function() {
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

		factory_Ball.onClick = function(absoluteClickPosition) {
		};

		factory_Ball.onStep = function(delta, globalGameState) {
		};

		factory_Ball.onAfterStep = function(delta, globalGameState) {
			bounceOnBoundaries(self, self.topLimit, self.bottomLimit,
					self.rightLimit, self.leftLimit);
		};

		game.addFactory(factory_Ball);
	};

	this.loadFactories = function() {
		this.loadFactory_Ball();
	};
	
	this.loadLevel_FirstLevel = function() {
		var level_FirstLevel = new Level("FirstLevel");
		level_FirstLevel.onLoadLevel = function() {
		};
		level_FirstLevel.levelElements = [ 
		    {"Ball" : [ { x : 0,	y : 0} ]} 
		];
		game.addLevel(level_FirstLevel);
		game.firstLevel = level_FirstLevel;
	};
	
	this.loadLevels = function() {
		this.loadLevel_FirstLevel();
	};

};

setGameToLoad(new Bouncing_balls());

//GAMECODE END
