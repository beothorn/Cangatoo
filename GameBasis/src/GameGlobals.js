//Globals
var game;
var level;
var canvas;
var self;
var resources = new Resources();
var loader = new GameLoader();
var gameSetup = new GameSetup();
var mouse = {x:0,y:0};
var gamePaused = false;
var gameCode;
var intervalID;

var globalGameState = {
		left:false,
		right:false,
		up:false,
		down:false,
		click:null
};

//--end globals

//Game control
function startGame(gameCanvas){
	canvas = gameCanvas;
	gameSetup.doBeforeStart(gameCanvas);
	loader.load();
}

function restartGame(){
	gameSetup.restartGame();
}

function play(){
	var FPS = 30;
	var oneSecond = 1000;
	gamePaused = false;
	if(intervalID!=null)
		clearInterval(intervalID);
	intervalID = setInterval(function(){
		game.gameLoop(globalGameState);
	}, oneSecond / FPS);
}

function pause(){
	gamePaused = true;
	clearInterval(intervalID);
}

function setGameToLoad(newGameCode){
	gameCode = newGameCode;
}

//-- end game control

function applyGravity(element,delta,gravity){
	element.yAccelerate((delta*gravity)/1000);
}

function wrapOnBoundaries(element,topLimit,bottomLimit,rightLimit,leftLimit){
	if(element.x+element.width>rightLimit){
		element.xSpeed = 0;
		element.x = rightLimit - element.width;
	}
	if(element.x<leftLimit){
		element.xSpeed = 0;
		element.x = leftLimit;
	}
	if(element.y+element.height>bottomLimit){
		element.ySpeed = 0;
		element.y = bottomLimit - element.height;
	}	
	if(element.y<topLimit){
		element.ySpeed = 0;
		element.y = topLimit;
	}
}

function bounceOnBoundaries(element,topLimit,bottomLimit,rightLimit,leftLimit){
	if(element.x+element.width>rightLimit){
		element.xSpeed = element.xSpeed *-1;
		element.x = rightLimit - element.width;
	}
	if(element.x<leftLimit){
		element.xSpeed = element.xSpeed *-1;
		element.x = leftLimit;
	}
	if(element.y+element.height>bottomLimit){
		element.ySpeed = element.ySpeed *-1;
		element.y = bottomLimit - element.height;
	}	
	if(element.y<topLimit){
		element.ySpeed = element.ySpeed *-1;
		element.y = topLimit;
	}
}

function applyFriction(element,delta,xFriction,yFriction){
	if(element.xSpeed>0){
		element.xSpeed-=element.getValueForDelta(xFriction,delta);
		if(element.xSpeed<0)
			element.xSpeed=0;
	}
	if(element.xSpeed<0){
		element.xSpeed+=element.getValueForDelta(xFriction,delta);
		if(element.xSpeed>0)
			element.xSpeed=0;
	}
	if(element.ySpeed>0){
		element.ySpeed-=element.getValueForDelta(yFriction,delta);
		if(element.ySpeed<0)
			element.ySpeed=0;
	}
	if(element.ySpeed<0){
		element.ySpeed+=element.getValueForDelta(yFriction,delta);
		if(element.ySpeed>0)
			element.ySpeed=0;
	}
}

function goToLevel(levelName){
	game.loadLevel(levelName);
}

function goToNextLevel(){
	game.goToNextLevel();
}

function goToPreviousLevel(){
	game.goToPreviousLevel();
}

function goToFirstLevel(){
	game.goToFirstLevel();
}

function kill(element){
	element.killYourself();
}

function create(elementFactory,x,y){
	var factory = game.getFactoryByName(elementFactory);
	factory.addElementAt(x,y);
}

function drawText(text,x,y){
    var context = canvas.getContext('2d');
    var oldColor = context.fillStyle; 
    context.fillStyle = "#000000";
    context.font = "12pt Calibri";
    var spaceBetweenLines = 2;
    var fontHeight = 12;
    var lineCarretPosition = 0;
    var lines = text.split('\n');
    for(var i in lines){
    	lineCarretPosition++;
    	context.fillText(lines[i], x, y +(lineCarretPosition*(fontHeight+spaceBetweenLines)));
    }
}
